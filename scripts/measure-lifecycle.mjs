import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:4186";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const report = { method: "Chromium CDP laboratory; synthetic visibility events; frame intervals are not hardware GPU telemetry", runs: [] };
await mkdir("test-results/performance/lifecycle", { recursive: true });
try {
  for (const width of [1440, 1024, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width === 430, hasTouch: width === 430 });
    await context.addInitScript(() => {
      window.__life = { draws: 0, tasks: [], shifts: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__life.tasks.push({ start: e.startTime, duration: e.duration }); }).observe({ type: "longtask", buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__life.shifts.push(e.value); }).observe({ type: "layout-shift", buffered: true });
      for (const method of ["drawArrays", "drawElements"]) {
        const original = WebGL2RenderingContext.prototype[method];
        WebGL2RenderingContext.prototype[method] = function (...args) { window.__life.draws++; return original.apply(this, args); };
      }
    });
    const page = await context.newPage(), cdp = await context.newCDPSession(page), errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await cdp.send("Performance.enable");
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.start");
    await page.goto(base); await page.waitForTimeout(3200);
    const { profile } = await cdp.send("Profiler.stop");
    const nodes = new Map(profile.nodes.map(n => [n.id, n]));
    const samples = new Map();
    for (let i = 0; i < profile.samples.length; i++) {
      const frame = nodes.get(profile.samples[i]).callFrame;
      const key = `${frame.url || "browser"} | ${frame.functionName || "anonymous"}`;
      samples.set(key, (samples.get(key) || 0) + profile.timeDeltas[i] / 1000);
    }
    const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m => [m.name, m.value]));
    const idle = async () => {
      const a = await metrics(), draws = await page.evaluate(() => window.__life.draws);
      await page.waitForTimeout(800);
      const b = await metrics();
      return { taskMsPerSecond: (b.TaskDuration - a.TaskDuration) * 1250, webglDrawCalls: await page.evaluate(() => window.__life.draws) - draws };
    };
    const visibleIdle = await idle();
    const beforePointer = await metrics();
    if (width !== 430) {
      for (let i = 0; i < 60; i++) await page.mouse.move(width * (.2 + .6 * i / 60), 420 + Math.sin(i / 7) * 150);
    }
    const afterPointer = await metrics();
    await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
    await page.waitForTimeout(150); const hiddenIdle = await idle();
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
    await page.mouse.move(0, 0);
    const frames = await page.evaluate(async () => {
      const intervals = []; let previous = performance.now();
      await new Promise(resolve => {
        const tick = now => {
          intervals.push(now - previous); previous = now;
          scrollBy(0, 100);
          if (scrollY + innerHeight >= document.documentElement.scrollHeight - 1) resolve(); else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      return intervals;
    });
    await page.waitForTimeout(1300); const offscreenIdle = await idle();
    const fullScroll = await page.evaluate(() => ({ ...window.__life, overflow: document.documentElement.scrollWidth > innerWidth }));
    frames.sort((a, b) => a - b);
    const memory = [];
    if (width === 1440) {
      for (let cycle = 0; cycle < 3; cycle++) {
        for (const route of ["/operations/secure-api-gateway/", "/log/", cycle % 2 ? "/" : "/vi/"]) {
          await page.goto(base + route); await page.waitForTimeout(route.includes("operations") || route.includes("log") ? 300 : 2200);
        }
        await cdp.send("HeapProfiler.collectGarbage");
        const m = await metrics();
        memory.push({ cycle, heap: m.JSHeapUsedSize, documents: m.Documents, nodes: m.Nodes, listeners: m.JSEventListeners, canvas: await page.locator("canvas").count() });
      }
    }
    report.runs.push({ width, visibleIdle, hiddenIdle, offscreenIdle, pointer: { taskMs: (afterPointer.TaskDuration - beforePointer.TaskDuration) * 1000, layoutMs: (afterPointer.LayoutDuration - beforePointer.LayoutDuration) * 1000 }, frames: { count: frames.length, median: frames[Math.floor(frames.length * .5)], p95: frames[Math.floor(frames.length * .95)], over34ms: frames.filter(v => v > 34).length }, fullScroll, memory, initialCpuTop: [...samples].sort((a, b) => b[1] - a[1]).slice(0, 18), errors });
    console.log(JSON.stringify(report.runs.at(-1)));
    await context.close();
  }
  await writeFile("test-results/performance/lifecycle/measurements.json", JSON.stringify(report, null, 2));
} finally { await browser.close(); }
