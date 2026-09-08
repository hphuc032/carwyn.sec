import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const browser = await chromium.launch({ channel: "msedge", headless: true });
const base = process.argv[2] ?? "http://127.0.0.1:3006";
const results = {};
try {
  for (const path of ["/operations/secure-api-gateway", "/vi/operations/network-traffic-analysis"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const pending = [];
    page.on("response", response => { if (response.request().resourceType() === "script") pending.push(response.body().then(body => ({ url: new URL(response.url()).pathname, bytes: body.length, gzip: gzipSync(body).length, webgl: body.includes("THREE.WebGLRenderer"), gsap: body.includes("GSAP") }))); });
    const response = await page.goto(base + path);
    const html = await response.body();
    await page.waitForTimeout(1800);
    const scripts = await Promise.all(pending);
    assert.ok(scripts.every(script => !script.webgl && !script.gsap), "case must not load Three/GSAP");
    results[path] = { htmlBytes: html.length, htmlGzip: gzipSync(html).length, scriptBytes: scripts.reduce((sum, script) => sum + script.bytes, 0), scriptGzip: scripts.reduce((sum, script) => sum + script.gzip, 0), scripts };
    await context.close();
  }
  const css = await readFile("src/styles/operations.css");
  results.operationsCss = { bytes: css.length, gzip: gzipSync(css).length };
  await writeFile("test-results/operations/performance.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
