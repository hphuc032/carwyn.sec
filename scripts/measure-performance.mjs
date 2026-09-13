import { createRequire } from "node:module";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { extname, join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:4185";
const label = process.argv[3] ?? "baseline";
const directory = `test-results/performance/${label}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const cases = [
  ...["/", "/vi/", "/operations/secure-api-gateway/", "/log/", "/log/analyzing-http-and-https-traffic-with-wireshark/"].map(path => ({ path, mode: "desktop", width: 1440 })),
  { path: "/", mode: "reduced", width: 1440 },
  ...[375, 430].flatMap(width => [1, 2, 3].map(run => ({ path: "/", mode: "mobile", width, run }))),
  { path: "/vi/", mode: "mobile", width: 430 },
];
const report = { base, label, method: "Cold browser contexts; CDP 4x CPU / 150ms latency / 1.6Mbps down / 750Kbps up for touch. Laboratory only; no field INP or CrUX data.", pages: [] };
try {
  for (const test of cases) {
    const mobile = test.mode === "mobile";
    const context = await browser.newContext({ viewport: { width: test.width, height: mobile ? 900 : 1000 }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, reducedMotion: test.mode === "reduced" ? "reduce" : "no-preference" });
    await context.addInitScript(() => {
      window.__perf = { lcp: null, shifts: [], tasks: [], events: [], sphereReady: null };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__perf.lcp = { ms: entry.startTime, tag: entry.element?.tagName, className: entry.element?.className, text: entry.element?.textContent?.slice(0, 100), size: entry.size }; }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__perf.shifts.push({ value: e.value, ms: e.startTime }); }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.__perf.tasks.push({ ms: e.startTime, duration: e.duration, attribution: e.attribution?.map(a => a.name) }); }).observe({ type: "longtask", buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (e.interactionId) window.__perf.events.push({ name: e.name, duration: e.duration, inputDelay: e.processingStart - e.startTime, interactionId: e.interactionId }); }).observe({ type: "event", buffered: true, durationThreshold: 16 });
      new MutationObserver(() => { if (!window.__perf.sphereReady && document.querySelector('[data-network-mode="webgl"]')) window.__perf.sphereReady = performance.now(); }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-network-mode"] });
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Performance.enable");
    if (mobile) {
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8, connectionType: "cellular4g" });
    }
    const resources = [], pending = [], errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("response", response => pending.push((async () => {
      const body = await response.body();
      const type = response.request().resourceType();
      resources.push({ url: response.url(), status: response.status(), type, bytes: body.length, gzip: ["document", "script", "stylesheet"].includes(type) ? gzipSync(body).length : body.length, cacheControl: response.headers()["cache-control"], encoding: response.headers()["content-encoding"], three: type === "script" && body.includes("THREE.WebGLRenderer"), gsap: type === "script" && body.includes("GSAP"), wake: type === "script" && body.includes("data-liquid") });
    })().catch(e => errors.push(`resource body: ${e.message}`))));
    const response = await page.goto(base + test.path, { waitUntil: "load", timeout: 90000 });
    const html = await response.text();
    const initial = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => new URL(m[1], base).href);
    await page.waitForTimeout(mobile ? 2000 : 3500);
    await page.evaluate(() => document.fonts.ready);
    await Promise.all(pending);
    const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m => [m.name, m.value]));
    const start = await metrics();
    await page.waitForTimeout(1200);
    const end = await metrics();
    const measured = await page.evaluate(() => ({ ...window.__perf, resources: performance.getEntriesByType("resource").map(e => ({ url: e.name, start: e.startTime, end: e.responseEnd, transfer: e.transferSize, encoded: e.encodedBodySize, decoded: e.decodedBodySize, initiator: e.initiatorType })), navigation: performance.getEntriesByType("navigation")[0].toJSON(), canvas: [...document.querySelectorAll("canvas")].map(c => ({ w: c.width, h: c.height, cssW: c.clientWidth, cssH: c.clientHeight, wake: c.classList.contains("liquid-light") })), images: [...document.images].map(i => ({ src: i.currentSrc, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, renderedWidth: i.clientWidth, renderedHeight: i.clientHeight, loading: i.loading, decoding: i.decoding })), fontPreloads: [...document.querySelectorAll('link[rel="preload"][as="font"]')].map(e => e.href) }));
    await page.locator(".menu-trigger").first().click();
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const events = await page.evaluate(() => window.__perf.events);
    const group = type => resources.filter(r => r.type === type);
    const sum = (items, key) => items.reduce((n, r) => n + r[key], 0);
    const summary = {
      ...test, status: response.status(), lcpMs: measured.lcp?.ms, lcpElement: measured.lcp,
      cls: measured.shifts.reduce((n, e) => n + e.value, 0), menuEventMaxMs: Math.max(0, ...events.map(e => e.duration)),
      initialJsGzip: sum(group("script").filter(r => initial.includes(r.url)), "gzip"), totalJsGzip: sum(group("script"), "gzip"),
      cssGzip: sum(group("stylesheet"), "gzip"), imageBytes: sum(group("image"), "bytes"), fontBytes: sum(group("font"), "bytes"),
      responseBytes: sum(resources, "bytes"), transferBytes: measured.navigation.transferSize + sum(measured.resources, "transfer"), requestCount: resources.length,
      mainThreadMs: start.TaskDuration * 1000, scriptMs: start.ScriptDuration * 1000, layoutMs: start.LayoutDuration * 1000,
      idleTaskMsPerSecond: (end.TaskDuration - start.TaskDuration) * 1000 / 1.2,
      longTasks: measured.tasks.length, longTaskTotalMs: sum(measured.tasks, "duration"), longestTaskMs: Math.max(0, ...measured.tasks.map(t => t.duration)),
      sphereReadyMs: measured.sphereReady, threeLoaded: resources.some(r => r.three), gsapLoaded: resources.some(r => r.gsap),
      thirdParty: resources.filter(r => new URL(r.url).origin !== new URL(base).origin).map(r => r.url), errors,
    };
    report.pages.push({ summary, resources, measured, metrics: start, events });
    console.log(JSON.stringify(summary));
    await context.close();
    await writeFile(`${directory}/measurements.json`, JSON.stringify(report, null, 2));
  }
  const inventory = [];
  const walk = async root => { for (const entry of await readdir(root, { withFileTypes: true })) { const path = join(root, entry.name); if (entry.isDirectory()) await walk(path); else { const body = await readFile(path); inventory.push({ path: path.replaceAll("\\", "/"), ext: extname(path), bytes: body.length, gzip: /\.(js|css|html|txt|xml|svg)$/.test(path) ? gzipSync(body).length : body.length }); } } };
  await walk("out");
  report.inventory = inventory;
  await writeFile(`${directory}/measurements.json`, JSON.stringify(report, null, 2));
} finally { await browser.close(); }
