import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:3000";
const widths = [375, 430, 768, 1024, 1440, 1920];
const sections = ["identity", "expertise", "operations", "experience", "achievements", "log", "terminal", "contact"];
const cases = ["secure-api-gateway", "vulnerability-assessment", "network-traffic-analysis"];
const logSlug = "analyzing-http-and-https-traffic-with-wireshark";
const forbiddenClaims = /finalist|winner|champion|qualified for (?:the )?final|vào (?:vòng )?chung kết|quán quân|vô địch|giành giải/i;
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.addInitScript(() => sessionStorage.setItem("carwyn:initialized", "1"));
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => {
  if (["error", "warning"].includes(message.type())) errors.push(`${message.location().url || "document"}: ${message.text()}`);
});
const measurements = [];

async function assertMetadata(locale, expectedTitle, descriptionFragment, type = "website") {
  assert.equal(await page.title(), expectedTitle);
  assert.ok((await page.locator('meta[name="description"]').getAttribute("content"))?.includes(descriptionFragment));
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute("content"), expectedTitle);
  assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), type);
  assert.equal(await page.locator('meta[property="og:locale"]').getAttribute("content"), locale === "vi" ? "vi_VN" : "en_US");
  const canonical = page.locator('link[rel="canonical"]');
  if (await canonical.count()) assert.ok((await canonical.getAttribute("href"))?.startsWith("https://"));
}

try {
  await mkdir("test-results/localization", { recursive: true });

  for (const locale of ["en", "vi"]) {
    const prefix = locale === "vi" ? "/vi" : "";
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}${prefix}/`);
      await page.waitForLoadState("networkidle");
      const metrics = await page.evaluate(() => ({
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        lang: document.documentElement.lang,
        headings: document.querySelectorAll("main h1, main h2").length,
        visibleSections: [...document.querySelectorAll("main > section")].filter(section => {
          const style = getComputedStyle(section);
          return style.display !== "none" && style.visibility !== "hidden";
        }).length,
      }));
      assert.equal(metrics.pageOverflow, false, `${locale}/${width}: horizontal overflow`);
      assert.equal(metrics.lang, locale, `${locale}/${width}: document language`);
      assert.ok(metrics.headings >= 9, `${locale}/${width}: semantic headings`);
      assert.equal(metrics.visibleSections, 9, `${locale}/${width}: all homepage sections visible`);
      measurements.push({ locale, width, ...metrics });
    }

    const homeText = await page.locator("main").textContent();
    assert.equal(await page.locator("#hero-title").getAttribute("aria-label"), "UNDERSTAND SYSTEMS. DEFEND THEM.");
    assert.ok(homeText.includes("LET'SCONNECT."));
    assert.ok(homeText.includes("AWS Student Builder Group HCMUTE"));
    assert.ok(homeText.includes("HCMUTE CTF 2025"));
    assert.ok(homeText.includes(locale === "vi" ? "THAM DỰ VÒNG SƠ KHẢO" : "QUALIFYING ROUND PARTICIPANT"));
    assert.ok(homeText.includes(locale === "vi" ? "Đang học" : "In progress"));
    assert.equal(forbiddenClaims.test(homeText), false, `${locale}: unsupported achievement claim`);
    assert.equal(await page.locator("#achievements .achievement-group").count(), 4);
    assert.equal(await page.locator("#operations .operation-row").count(), 3);
    assert.equal(await page.locator("#identity img").getAttribute("alt"), locale === "vi"
      ? "Nguyen Hoang Phuc mặc áo khoác đen và đeo kính râm, ngồi trong không gian có tông màu ấm."
      : "Nguyen Hoang Phuc wearing a black jacket and sunglasses, seated in warm natural surroundings.");
    assert.equal(await page.locator(".skip-link").textContent(), locale === "vi" ? "Chuyển đến nội dung" : "Skip to content");
    await assertMetadata(locale, "carwyn.sec — Cyber Security Portfolio", locale === "vi" ? "Portfolio An toàn thông tin" : "personal Information Security portfolio");
    console.log(`PASS ${locale}: homepage content, claims, accessibility text, metadata and six widths`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const section of sections) {
    await page.goto(`${base}/#${section}`);
    const timeOrigin = await page.evaluate(() => performance.timeOrigin);
    await page.locator('.site-header .language-selector a[lang="vi"]').click();
    await page.waitForURL(`**/vi#${section}`);
    assert.equal(await page.evaluate(() => performance.timeOrigin), timeOrigin, `${section}: client transition`);
    assert.equal(await page.locator(".initialization").getAttribute("data-play"), null, `${section}: initialization replay`);
    await page.locator('.site-header .language-selector a[lang="en"]').click();
    await page.waitForURL(`**/#${section}`);
  }
  console.log("PASS all eight meaningful homepage hashes survive EN/VI switching without replaying initialization");

  for (const slug of cases) {
    for (const locale of ["en", "vi"]) {
      const prefix = locale === "vi" ? "/vi" : "";
      await page.goto(`${base}${prefix}/operations/${slug}`);
      assert.equal(await page.locator(".case-study").isVisible(), true);
      assert.equal(await page.locator("#results,#architecture").count(), 0);
      assert.equal(forbiddenClaims.test(await page.locator("main").textContent()), false);
      await assertMetadata(locale, `${await page.locator("#case-title").textContent()} — carwyn.sec`, slug === "secure-api-gateway" ? (locale === "vi" ? "xác thực" : "authentication") : "");
      const targetLocale = locale === "en" ? "vi" : "en";
      await page.locator(`.site-header .language-selector a[lang="${targetLocale}"]`).click();
      await page.waitForURL(`**/${targetLocale === "vi" ? `vi/operations/${slug}` : `operations/${slug}`}`);
    }
  }
  console.log("PASS three case studies: equivalent stable routes and matched publication boundaries");

  for (const locale of ["en", "vi"]) {
    const prefix = locale === "vi" ? "/vi" : "";
    await page.goto(`${base}${prefix}/log`);
    assert.equal(await page.locator(".log-entry").count(), 1);
    await assertMetadata(locale, "Security Log — carwyn.sec", locale === "vi" ? "Ghi chép kỹ thuật" : "Technical field notes");
    await page.goto(`${base}${prefix}/log/${logSlug}`);
    const text = await page.locator("article").textContent();
    assert.ok(text.includes("TLS Application Data"));
    assert.ok(text.includes(locale === "vi" ? "không tiết lộ thông điệp HTTP" : "does not reveal the HTTP message"));
    await assertMetadata(locale, `${await page.locator("#log-title").textContent()} — carwyn.sec`, locale === "vi" ? "dữ liệu giao thức" : "observable protocol data", "article");
  }
  console.log("PASS Security Log index/article parity and HTTP versus encrypted HTTPS/TLS boundary");

  for (const locale of ["en", "vi"]) {
    const prefix = locale === "vi" ? "/vi" : "";
    await page.goto(`${base}${prefix}/#terminal`);
    const input = page.locator("#terminal-command");
    await input.fill("help");
    await input.press("Enter");
    assert.deepEqual(await page.locator(".terminal-response li strong").allTextContents(), ["help", "whoami", "skills", "projects", "experience", "achievements", "logs", "contact", "clear"]);
    await input.fill("whoami");
    await input.press("Enter");
    const output = await page.locator(".terminal-response").last().textContent();
    assert.ok(output.includes(locale === "vi" ? "An toàn thông tin / Cyber Security" : "Information Security / Cyber Security"));
    assert.ok(output.includes(locale === "vi" ? "Việt Nam" : "Vietnam"));
    assert.ok((await page.locator(".terminal-console-bar").textContent()).includes(locale === "vi" ? "GIAO DIỆN CỤC BỘ" : "LOCAL INTERFACE"));
  }
  console.log("PASS shared Terminal commands with localized UI and whoami output");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/vi#contact`);
  assert.ok(await page.locator("#contact a").first().evaluate(link => parseFloat(getComputedStyle(link).transitionDuration) <= .001));
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 430, height: 932 } });
  const noJs = await noJsContext.newPage();
  for (const path of ["/", "/vi", "/operations/secure-api-gateway", "/vi/operations/secure-api-gateway", "/log", "/vi/log", `/log/${logSlug}`, `/vi/log/${logSlug}`]) {
    const response = await noJs.goto(`${base}${path}`);
    assert.equal(response.status(), 200, `${path}: no-JavaScript response`);
    assert.equal(await noJs.locator("main").isVisible(), true, `${path}: no-JavaScript content`);
  }
  await noJsContext.close();
  console.log("PASS representative EN/VI routes remain readable without JavaScript");

  for (const [locale, width, path] of [["en", 1440, "/"], ["vi", 1440, "/vi"], ["en", 430, "/"], ["vi", 430, "/vi"]]) {
    await page.setViewportSize({ width, height: width === 430 ? 932 : 1000 });
    await page.goto(`${base}${path}#identity`);
    await page.locator("#identity").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/localization/${locale}-${width}.png`, fullPage: false });
  }

  assert.deepEqual(errors, []);
  await writeFile("test-results/localization/validation.json", JSON.stringify({ measurements, errors }, null, 2));
  console.log("PASS clean console/hydration and localization review screenshots");
} finally {
  await browser.close();
}
