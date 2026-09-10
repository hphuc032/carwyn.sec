import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Uses an existing QA runtime, not an application dependency.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
const context = await browser.newContext();
await context.addInitScript(() => {
  window.__introPlays = 0;
  new MutationObserver((entries) => {
    for (const entry of entries) if (entry.target instanceof Element && entry.target.matches('.initialization[data-play="true"]')) window.__introPlays++;
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-play"] });
});
const page = await context.newPage();
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => { if (["error", "warning"].includes(message.type())) errors.push(`${message.text()} ${message.location().url}`); });
try {
  await page.goto(base);
  await page.waitForFunction(() => window.__introPlays > 0);
  await page.waitForFunction(() => !document.querySelector(".initialization").hasAttribute("data-play"));
  assert.equal(await page.evaluate(() => window.__introPlays), 1);
  const origin = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => history.replaceState(null, "", "?review=global#identity"));
  await page.getByRole("link", { name: "Tiếng Việt", exact: true }).first().click();
  await page.waitForURL("**/vi?review=global#identity");
  await page.waitForFunction(() => document.documentElement.lang === "vi");
  assert.equal(await page.evaluate(() => performance.timeOrigin), origin, "locale switch must not reload document");
  assert.equal(await page.evaluate(() => window.__introPlays), 1);
  await page.getByRole("link", { name: "English", exact: true }).first().click();
  await page.waitForFunction(() => document.documentElement.lang === "en");
  assert.equal(await page.evaluate(() => performance.timeOrigin), origin);
  await page.getByRole("button", { name: "Index", exact: true }).click();
  await page.locator("dialog").getByRole("link", { name: "Tiếng Việt", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.lang === "vi" && !document.querySelector("dialog").open);
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.equal(await page.evaluate(() => performance.timeOrigin), origin);
  await page.reload();
  await page.waitForTimeout(1400);
  assert.equal(await page.evaluate(() => window.__introPlays), 0, "refresh skips session intro");
  console.log("PASS initialization, refresh, bilingual SPA navigation, query/hash preservation");

  for (const locale of ["en", "vi"]) {
    await page.goto(base + (locale === "vi" ? "/vi" : "/"));
    await page.waitForFunction(() => document.querySelector(".menu-trigger") !== null);
    const menu = locale === "en" ? "Index" : "Mục lục";
    for (const width of [375, 430, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${locale} ${width} page overflow`);
      await page.getByRole("button", { name: menu, exact: true }).click();
      await page.waitForFunction(() => document.querySelector("dialog").open);
      assert.ok(await page.locator("dialog").evaluate(el => el.open));
      assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
      assert.ok(await page.locator("dialog").evaluate(el => el.scrollWidth <= el.clientWidth), `${locale} ${width} menu overflow`);
      await page.keyboard.press("Escape");
      await page.waitForFunction(() => !document.querySelector("dialog").open);
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
      assert.ok(await page.getByRole("button", { name: menu, exact: true }).evaluate(el => el === document.activeElement));
    }
    await page.getByRole("button", { name: menu, exact: true }).press("Enter");
    await page.locator("dialog a").last().focus();
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)), "modal focus wraps");
    assert.ok(await page.evaluate(() => document.activeElement.matches(":focus-visible")));
    await page.locator(".index-links a").nth(6).press("Enter");
    await page.waitForURL(`**/${locale === "vi" ? "vi" : ""}#contact`);
    await page.waitForFunction(() => document.activeElement.id === "contact");
    await page.waitForFunction(() => document.querySelector(".status-section").textContent.includes("07"));
    assert.equal(await page.locator("dialog").evaluate(el => el.open), false);
    await page.locator(".skip-link").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "main-content");
    console.log(`PASS ${locale}: six widths, modal, Escape, focus return/trap, Contact navigation, skip link`);
  }

  console.log("PASS section discovery, active index and navigation focus");

  // Inspect pointer states independently of the preceding native smooth scroll.
  // The decorative cursor intentionally clears while that scroll is in progress.
  await page.goto(base);
  await page.locator("h1").hover();
  await page.mouse.move(200, 200);
  await page.waitForFunction(() => document.querySelector(".context-cursor").dataset.visible === "true");
  for (const name of ["view", "open", "scan"]) {
    await page.locator("h1").evaluate((el, value) => el.setAttribute("data-cursor", value), name);
    await page.locator("h1").hover();
    assert.equal(await page.locator(".context-cursor").textContent(), name.toUpperCase());
  }
  assert.equal(await page.locator(".context-cursor").evaluate(el => getComputedStyle(el).pointerEvents), "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(210, 210);
  assert.equal(await page.locator(".context-cursor").evaluate(el => getComputedStyle(el).display), "none");
  console.log("PASS cursor contexts, decorative pointer behavior, live reduced-motion change");

  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(base);
  assert.equal(await reducedPage.locator(".initialization").evaluate(el => getComputedStyle(el).display), "none");
  await reduced.close();
  const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });
  const touchPage = await touch.newPage();
  await touchPage.goto(base);
  await touchPage.getByRole("button", { name: "Index", exact: true }).tap();
  assert.ok(await touchPage.locator("dialog").evaluate(el => el.open));
  assert.equal(await touchPage.locator(".context-cursor").evaluate(el => getComputedStyle(el).display), "none");
  await touchPage.getByRole("button", { name: "Close", exact: true }).tap();
  await touch.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Storage blocked by test"); } }));
  const blockedPage = await blocked.newPage();
  blockedPage.on("pageerror", error => errors.push(error.message));
  await blockedPage.goto(base);
  await blockedPage.getByRole("button", { name: "Index", exact: true }).click();
  assert.ok(await blockedPage.locator("dialog").evaluate(el => el.open));
  await blocked.close();
  console.log("PASS reduced-motion initial load, touch menu/cursor, blocked storage");
  if (!process.argv.includes("--production")) {
    await page.goto(base + "/dev/design-system#typography");
    await page.locator(".site-header").getByRole("link", { name: "Tiếng Việt", exact: true }).click();
    await page.waitForURL("**/vi/dev/design-system#typography");
    assert.ok(await page.locator(".design-specimen").isVisible());
    console.log("PASS development specimen and equivalent locale/hash");
  }
  assert.deepEqual(errors, [], "runtime console and hydration");
  console.log("PASS console and hydration");
} finally { await browser.close(); }
