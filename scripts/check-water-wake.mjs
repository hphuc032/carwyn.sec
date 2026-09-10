import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = ts.transpileModule(await readFile(new URL("../src/lib/water-wake.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { WaterWake } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:3019";
const report = { storage: {}, gestures: [], lifecycle: [], errors: [] };
const unit = new WaterWake(), storage = unit.samples;
for (let i = 0; i < 10000; i++) unit.add(i * 3, Math.sin(i) * 10, i * 30, 5);
assert.equal(unit.count, 30); assert.equal(unit.samples, storage);
assert.equal(unit.draw({}, 301101, 1), false); assert.equal(unit.count, 0);
report.storage = { capacity: 30, additions: 10000, typedBufferBytes: unit.samples.byteLength + unit.curve.byteLength + unit.edges.byteLength, buffersReused: true };

const browser = await chromium.launch({ channel: "msedge", headless: true });
const watch = page => {
  page.on("pageerror", error => report.errors.push(error.message));
  page.on("console", message => { if (["error", "warning"].includes(message.type())) report.errors.push(message.text()); });
};
const instrument = context => context.addInitScript(() => {
  window.__wakeDraws = 0; window.__wakeCommits = 0; window.__wakeFrameCosts = [];
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => 1, onCommitFiberRoot: () => window.__wakeCommits++, onCommitFiberUnmount: () => {} };
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (...args) {
    const context = original.apply(this, args);
    if (context && args[0] === "2d" && this.matches(".liquid-light") && !context.__instrumented) {
      context.__instrumented = true;
      const clear = context.clearRect;
      let started = 0;
      context.clearRect = function (...values) { started = performance.now(); window.__wakeDraws++; return clear.apply(this, values); };
      const composite = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "globalCompositeOperation");
      Object.defineProperty(context, "globalCompositeOperation", { get() { return composite.get.call(this); }, set(value) {
        composite.set.call(this, value);
        if (value === "source-over" && started) { window.__wakeFrameCosts.push(performance.now() - started); started = 0; }
      } });
    }
    return context;
  };
});
const gesture = (page, shape, count = 65) => page.evaluate(async ({ shape, count }) => {
  const el = document.querySelector("#hero"), bounds = el.getBoundingClientRect();
  const points = [], intervals = []; let last = performance.now();
  for (let i = 0; i < count; i++) {
    await new Promise(resolve => setTimeout(() => requestAnimationFrame(resolve), 12));
    const t = i / (count - 1), now = performance.now();
    let x, y;
    if (shape === "circle") { x = 280 + Math.cos(t * Math.PI * 2) * 125; y = 640 + Math.sin(t * Math.PI * 2) * 145; }
    else if (shape === "zigzag") { x = 170 + t * Math.min(1100, bounds.width - 320); y = 650 + (i % 8 < 4 ? 100 : -100); }
    else if (shape === "reversal") { x = 160 + (t < .5 ? t * 2 : (1 - t) * 2) * 700; y = 740 + t * 20; }
    else { x = 250 + Math.sin(t * Math.PI * 2) * 125; y = 470 + t * 320; }
    x += bounds.left;
    el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: x, clientY: y }));
    points.push({ x: x - bounds.left, y: y - bounds.top, time: now }); intervals.push(now - last); last = now;
  }
  return { points, intervals: intervals.slice(1) };
}, { shape, count });
const pixels = (page, path = []) => page.locator("#hero .liquid-light").evaluate((canvas, path) => {
  const scratch = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = scratch.getContext("2d", { willReadFrequently: true }); ctx.drawImage(canvas, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data, scale = canvas.width / canvas.clientWidth;
  let ink = 0, nearHead = 0, behind = 0, offChord = 0, nearPath = 0;
  const distance = (x, y, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, t = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - a.x - t * dx, y - a.y - t * dy); };
  for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) {
    const alpha = data[(y * canvas.width + x) * 4 + 3]; if (!alpha) continue;
    ink += alpha; if (!path.length) continue;
    const px = x / scale, py = y / scale, head = path.at(-1), separation = Math.hypot(px - head.x, py - head.y);
    if (separation < 18) nearHead += alpha; if (separation > 35) behind += alpha;
    if (distance(px, py, path[0], head) > 35) offChord += alpha;
    let nearest = Infinity;
    for (let i = 1; i < path.length; i++) nearest = Math.min(nearest, distance(px, py, path[i - 1], path[i]));
    if (nearest < 60) nearPath += alpha;
  }
  return { ink, nearHead, behind, offChord, nearPath, width: canvas.width, height: canvas.height, ratio: scale };
}, path);
const calm = async page => {
  await page.waitForTimeout(1850);
  const buffers = await page.locator(".liquid-light").evaluateAll(els => els.map(el => ({ width: el.width, height: el.height, opacity: el.style.opacity })));
  assert.equal(buffers.some(el => el.width !== 1 || el.height !== 1 || el.opacity), false, JSON.stringify(buffers));
};
try {
  await mkdir("test-results/water-wake", { recursive: true });
  for (const width of [1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 2 }); await instrument(context);
    const page = await context.newPage(); watch(page); await page.goto(base); await page.waitForTimeout(2500);
    await page.locator(".network-pause").click(); await page.waitForTimeout(250);
    const cdp = await context.newCDPSession(page); await cdp.send("Performance.enable");
    const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(item => [item.name, item.value]));
    for (const shape of ["s-curve", "circle", "zigzag", "reversal"]) {
      // Warm the cursor/canvas once; resizing a buffer on first activation is separate.
      await gesture(page, shape, 5);
      const before = await metrics(), commits = await page.evaluate(() => window.__wakeCommits), nodes = await page.locator("body *").count();
      await page.evaluate(() => { window.__wakeFrameCosts = []; });
      const { points, intervals } = await gesture(page, shape);
      const after = await metrics(), image = await pixels(page, points);
      const result = { viewportWidth: width, shape, p95Ms: intervals.toSorted((a, b) => a - b)[Math.floor(intervals.length * .95)], over25ms: intervals.filter(n => n > 25).length,
        frames: intervals.length, taskMs: (after.TaskDuration - before.TaskDuration) * 1000, durationMs: intervals.reduce((a, b) => a + b, 0), layouts: after.LayoutCount - before.LayoutCount,
        commits: await page.evaluate(() => window.__wakeCommits) - commits, ...image };
      const costs = await page.evaluate(() => window.__wakeFrameCosts.toSorted((a, b) => a - b));
      result.drawP95Ms = costs[Math.floor(costs.length * .95)];
      assert.equal(result.layouts, 0); assert.equal(result.commits, 0); assert.equal(await page.locator("body *").count(), nodes);
      assert.ok(image.ink > 100); assert.ok(image.width <= 1024 && image.height <= 640 && image.ratio <= 1);
      if (shape === "s-curve") {
        assert.ok(image.behind > image.nearHead * 4, "disturbance follows behind the leading cursor");
        assert.ok(image.nearPath / image.ink > .95, "wake follows actual recent curve");
        assert.ok(image.offChord / image.ink > .2, "curved path cannot be replaced by a straight rotated field");
        await page.screenshot({ path: `test-results/water-wake/s-curve-${width}.png` });
      }
      await calm(page);
      const idleBefore = await metrics(), draws = await page.evaluate(() => window.__wakeDraws);
      await page.waitForTimeout(700); const idleAfter = await metrics();
      assert.equal(await page.evaluate(() => window.__wakeDraws), draws, "calm canvas has no background frames");
      result.idleTaskMsPerSecond = (idleAfter.TaskDuration - idleBefore.TaskDuration) / .7 * 1000;
      report.gestures.push(result); console.log("PASS", width, shape, JSON.stringify(result));
    }
    await cdp.send("HeapProfiler.collectGarbage"); const heapBefore = (await metrics()).JSHeapUsedSize;
    for (let cycle = 0; cycle < 12; cycle++) { await gesture(page, "s-curve", 8); await page.evaluate(() => dispatchEvent(new Event("blur"))); }
    await cdp.send("HeapProfiler.collectGarbage"); const heapAfter = (await metrics()).JSHeapUsedSize;
    assert.ok(heapAfter - heapBefore < 750000, "repeated activation must not accumulate large buffers");
    await gesture(page, "s-curve", 20);
    await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
    await calm(page); const hiddenDraws = await page.evaluate(() => window.__wakeDraws); await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => window.__wakeDraws), hiddenDraws);
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
    await gesture(page, "s-curve", 20); assert.ok((await pixels(page)).ink > 0);
    await page.evaluate(() => document.dispatchEvent(new PointerEvent("pointerleave")));
    await page.waitForTimeout(70); assert.ok((await pixels(page)).ink > 0, "exit preserves the old path briefly");
    await page.locator("#hero").evaluate(el => {
      const bounds = el.getBoundingClientRect();
      el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: bounds.left + 800, clientY: 820 }));
    });
    await page.waitForTimeout(40);
    assert.equal((await pixels(page)).ink, 0, "re-entry cannot bridge an unobserved path with a straight streak");
    await calm(page);
    await page.locator("#hero").evaluate(el => el.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "touch", clientX: 800, clientY: 820 })));
    assert.equal(await page.locator(".liquid-light").evaluateAll(els => els.some(el => el.width > 1)), false, "hybrid touch cannot activate the wake");
    await page.locator("#identity").scrollIntoViewIfNeeded(); await calm(page);
    assert.equal(await page.locator("#contact .liquid-light,#identity .liquid-light").count(), 0);
    await page.locator(".site-header a[lang=vi]").click(); await page.waitForFunction(() => document.documentElement.lang === "vi");
    await page.locator("#hero").scrollIntoViewIfNeeded(); await gesture(page, "s-curve", 25); assert.ok((await pixels(page)).ink > 0);
    await page.emulateMedia({ reducedMotion: "reduce" }); await calm(page); await gesture(page, "s-curve", 8);
    assert.equal(await page.locator(".liquid-light").evaluateAll(els => els.some(el => el.width > 1)), false);
    report.lifecycle.push({ width, heapBefore, heapAfter, retainedHeapDelta: heapAfter - heapBefore, hiddenStopped: true, offscreenStopped: true, localeRestart: true, reducedDisabled: true, exitFade: true, reentryBreak: true, hybridTouchDisabled: true });
    await context.close();
  }
  const unavailable = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await unavailable.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args) { return args[0] === "2d" && this.matches(".liquid-light") ? null : original.apply(this, args); };
  });
  const fallback = await unavailable.newPage(); watch(fallback); await fallback.goto(base); await fallback.waitForTimeout(1800);
  await gesture(fallback, "s-curve", 12);
  assert.equal(await fallback.locator(".liquid-light").evaluateAll(els => els.some(el => el.width > 1)), false);
  assert.ok(await fallback.getByRole("heading", { name: "UNDERSTAND SYSTEMS. DEFEND THEM.", exact: true }).isVisible());
  await unavailable.close();
  assert.deepEqual(report.errors, []);
  await writeFile("test-results/water-wake/validation.json", JSON.stringify(report, null, 2));
  console.log("PASS storage, curved path, pointer head/tail, buffer limits, memory and lifecycle");
} finally { await browser.close(); }
