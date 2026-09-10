import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = {};
try {
  for (const mode of ["desktop", "static"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: mode === "static" ? "reduce" : "no-preference" });
    await context.addInitScript(() => {
      window.__networkReady = null;
      new MutationObserver(() => { if (!window.__networkReady && document.querySelector('[data-network-mode="webgl"]')) window.__networkReady = performance.now(); }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-network-mode"] });
    });
    const page = await context.newPage();
    const tasks = [];
    page.on("response", response => { if (response.request().resourceType() === "script") tasks.push(response.body().then(body => ({ url: new URL(response.url()).pathname, bytes: body.length, gzip: gzipSync(body).length, kind: body.includes("THREE.WebGLRenderer") ? "three" : body.includes("GSAP") ? "gsap" : "other" })).catch(() => null)); });
    const response = await page.goto(base);
    const html = await response.text();
    const initial = new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]));
    await page.waitForTimeout(2800);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Performance.enable");
    const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(m => [m.name, m.value]));
    const before = await metrics();
    await page.waitForTimeout(1000);
    const after = await metrics();
    const scripts = (await Promise.all(tasks)).filter(Boolean).map(item => ({ ...item, initial: initial.has(item.url) }));
    results[mode] = {
      networkMode: await page.locator(".network-object").getAttribute("data-network-mode"),
      networkReadyMs: await page.evaluate(() => window.__networkReady),
      canvas: await page.locator(".network-live canvas").evaluateAll(nodes => nodes.map(el => ({ width: el.width, height: el.height, cssWidth: el.clientWidth }))),
      wakeBuffers: await page.locator(".liquid-light").evaluateAll(nodes => nodes.map(el => ({ width: el.width, height: el.height }))),
      idleTaskMsPerSecond: (after.TaskDuration - before.TaskDuration) * 1000,
      scripts,
    };
    await context.close();
  }
  const sandbox = {};
  vm.runInNewContext(await readFile(".next/server/app/[locale]/page_client-reference-manifest.js", "utf8"), sandbox);
  const manifest = Object.values(sandbox.__RSC_MANIFEST)[0];
  const heroChunks = new Set();
  for (const [name, module] of Object.entries(manifest.clientModules)) if (/components[\\/]((home)|(webgl))/.test(name)) for (const chunk of module.chunks) if (typeof chunk === "string" && chunk.endsWith(".js")) heroChunks.add(chunk);
  results.heroEntryChunks = await Promise.all([...heroChunks].map(async path => { const body = await readFile(`.next/${path.replace(/^\/?_next\//, "")}`); return { path, bytes: body.length, gzip: gzipSync(body).length }; }));
  await mkdir("test-results/hero", { recursive: true });
  await writeFile("test-results/hero/performance.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
