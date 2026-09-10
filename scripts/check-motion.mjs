import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:3016";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [];
const errors = [];
const sections = ["hero", "identity", "expertise", "operations", "experience", "achievements", "log", "terminal", "contact"];
const inspect = page => {
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (["warning", "error"].includes(m.type())) errors.push(m.text()); });
};
const instrument = async context => context.addInitScript(() => {
  window.__motion = { cls: 0, arrivals: [], heroChanges: 0 };
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__motion.cls += entry.value;
  }).observe({ type: "layout-shift", buffered: true });
  new MutationObserver(records => {
    for (const record of records) {
      if (record.target.matches?.("[data-hero-line]") && record.attributeName === "style") window.__motion.heroChanges++;
      if (record.attributeName === "data-arrival-state") window.__motion.arrivals.push({ key: record.target.dataset.arrival, state: record.target.dataset.arrivalState });
    }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-arrival-state", "style"] });
});
const approach = async (page, key) => page.locator(`[data-arrival="${key}"]`).evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - innerHeight - 80));
const settled = async page => {
  await page.waitForTimeout(850);
  assert.equal(await page.locator('[data-arrival-state="running"]').count(), 0);
  assert.equal(await page.locator("[data-arrival], [data-arrival] span").evaluateAll(els => els.some(el => el.style.opacity || el.style.transform)), false, "no stale animation styles");
};
try {
  await mkdir("test-results/motion", { recursive: true });
  for (const locale of process.argv.includes("--lifecycle-only") ? [] : ["en", "vi"]) for (const width of [375, 430, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width < 768, isMobile: width < 768 });
    await instrument(context);
    const page = await context.newPage(); inspect(page);
    await page.goto(`${base}${locale === "vi" ? "/vi" : "/"}`);
    await page.waitForTimeout(1800);
    assert.equal(await page.locator(".initialization[data-play]").count(), 0);
    assert.equal(await page.evaluate(() => window.__motion.heroChanges), 0, "Hero never dims/reveals twice");
    // Exercise finite arrivals just before visibility, not only hash-jump fallbacks.
    for (const key of ["portrait", "name", "conclusion"]) {
      await approach(page, key);
      await page.waitForTimeout(110);
      await page.evaluate(() => scrollBy(0, 180));
      await settled(page);
    }
    for (const id of sections) {
      await page.locator(`#${id}`).evaluate(el => scrollTo(0, el.offsetTop));
      await page.waitForTimeout(70);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${locale}/${width}/${id} overflow`);
    }
    await settled(page);
    const metrics = await page.evaluate(() => window.__motion);
    assert.ok(metrics.arrivals.some(e => e.state === "running"), "natural approach activates a finite arrival");
    assert.ok(metrics.cls < .01, `CLS ${metrics.cls}`);
    results.push({ locale, width, ...metrics });
    console.log(`PASS ${locale}/${width}: full scroll, finite arrivals, cleanup, overflow; CLS ${metrics.cls}`);
    await context.close();
  }

  let context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await instrument(context);
  let page = await context.newPage(); inspect(page);
  await page.goto(base);
  await page.waitForTimeout(1600);
  await approach(page, "conclusion");
  await page.waitForFunction(() => document.querySelector('[data-arrival="conclusion"]').dataset.arrivalState === "running");
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await settled(page);
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  await page.goto(base);
  await page.waitForTimeout(1600);
  await approach(page, "conclusion");
  await page.waitForFunction(() => document.querySelector('[data-arrival="conclusion"]').dataset.arrivalState === "running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settled(page);
  assert.equal(await page.locator(".network-live canvas").count(), 0);
  assert.equal(await page.locator(".liquid-light").evaluateAll(els => els.some(el => el.width !== 1 || el.height !== 1)), false);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await settled(page);
  console.log("PASS active arrivals settle on hidden-document/reduced-motion change");

  await page.goto(`${base}/#operations`);
  const project = page.locator(".operation-link").first();
  const resolvedTitle = () => project.locator("h3").evaluate(async el => {
    await Promise.all(el.getAnimations().map(animation => animation.finished));
    return getComputedStyle(el).transform;
  });
  await project.focus();
  const focused = await resolvedTitle();
  await project.evaluate(el => el.blur());
  await project.hover();
  assert.equal(await resolvedTitle(), focused, "keyboard/pointer title feedback match");
  await page.evaluate(() => {
    window.__cursorWrites = 0;
    new MutationObserver(records => { window.__cursorWrites += records.length; }).observe(document.querySelector(".context-cursor"), { childList: true });
  });
  const box = await project.boundingBox();
  await page.mouse.move(box.x + 80, box.y + 40, { steps: 20 });
  assert.ok(await page.evaluate(() => window.__cursorWrites) <= 1, "cursor does not rewrite text on every pointer event");
  await page.evaluate(() => {
    const selection = getSelection(); const range = document.createRange();
    range.selectNodeContents(document.querySelector(".operation-link h3")); selection.removeAllRanges(); selection.addRange(range);
  });
  assert.equal(await page.locator(".context-cursor").getAttribute("data-visible"), "false");
  await page.evaluate(() => getSelection().removeAllRanges());
  await page.locator("#terminal input").hover();
  assert.equal(await page.locator(".context-cursor").getAttribute("data-visible"), "false");
  console.log("PASS Operations keyboard parity, selection/input cursor deferral, bounded cursor text writes");

  // Keep real navigation independent of synthetic document.visibility fault injection.
  await context.close();
  context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  page = await context.newPage(); inspect(page);
  await page.goto(`${base}/#operations`);
  await page.waitForTimeout(1400);
  const cdp = await context.newCDPSession(page);
  const listenerCounts = async () => (await cdp.send("Runtime.evaluate", {
    expression: "({pointer: (getEventListeners(window).pointermove || []).length, visibility: (getEventListeners(document).visibilitychange || []).length})",
    includeCommandLineAPI: true, returnByValue: true,
  })).result.value;
  const originalListeners = await listenerCounts();
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.locator("#operations .operation-link").first().click();
    await page.waitForURL("**/operations/secure-api-gateway");
    await page.locator(".case-study h1").waitFor();
    assert.equal(await page.locator("canvas,[data-arrival]").count(), 0);
    await page.goBack();
    await page.waitForURL(url => !url.pathname.includes("/operations/"));
    await page.locator("#operations").waitFor();
    await page.locator(".site-header a[lang=vi]").click();
    await page.waitForFunction(() => document.documentElement.lang === "vi");
    await page.locator(".site-header a[lang=en]").click();
    await page.waitForFunction(() => document.documentElement.lang === "en");
    await settled(page);
    assert.equal(await page.locator(".initialization[data-play]").count(), 0);
    assert.deepEqual(await listenerCounts(), originalListeners, "route/locale changes must not accumulate motion listeners");
  }
  console.log("PASS repeated route/locale navigation leaves no arrivals, listener growth or replayed initialization", originalListeners);
  await page.reload(); await page.waitForTimeout(150);
  assert.equal(await page.locator(".initialization[data-play]").count(), 0, "returning refresh skips greeting");
  await context.close();
  assert.deepEqual(errors, []);
  const report = process.argv.includes("--lifecycle-only") ? "lifecycle-validation" : "validation";
  await writeFile(`test-results/motion/${report}.json`, JSON.stringify({ results, errors }, null, 2));
} finally { await browser.close(); }
