import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH ?? "playwright");
const base = process.argv[2] ?? "http://127.0.0.1:3000";
const widths = [375, 430, 768, 1024, 1440, 1920];
const expectedSourceHash = "D800848A65AB8EE3B534CEA254F3E1D2604B9E3D786DB0CBC7720BE69B8CF640";
const expectedLinks = [
  "mailto:nhpntd@gmail.com",
  "https://github.com/hphuc032",
  "https://www.linkedin.com/in/nguyen-phuc-71217332a/",
  "/cv/nguyen-hoang-phuc-cv.pdf",
];
const browser = await chromium.launch({ channel: "msedge", headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await context.addInitScript(() => {
  sessionStorage.setItem("carwyn:initialized", "1");
  window.__contactCls = 0;
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__contactCls += entry.value;
  }).observe({ type: "layout-shift", buffered: true });
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => {
  if (["error", "warning"].includes(message.type())) errors.push(`${message.location().url || "document"}: ${message.text()}`);
});
const measurements = [];
const captureStyle = ".site-header,.system-status,.initialization,.context-cursor,.skip-link{visibility:hidden!important}";

try {
  await mkdir("test-results/contact", { recursive: true });
  for (const locale of ["en", "vi"]) {
    const prefix = locale === "vi" ? "/vi" : "";
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}${prefix}/#contact`);
      const contact = page.locator("#contact");
      await contact.scrollIntoViewIfNeeded();
      const metrics = await contact.evaluate(root => {
        const links = [...root.querySelectorAll("a")];
        return {
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          sectionOverflow: root.scrollWidth > root.clientWidth + 1,
          headingSize: parseFloat(getComputedStyle(root.querySelector("h2")).fontSize),
          minTarget: Math.min(...links.map(link => link.getBoundingClientRect().height)),
        };
      });
      assert.equal(metrics.pageOverflow, false, `${locale}/${width}: page overflow`);
      assert.equal(metrics.sectionOverflow, false, `${locale}/${width}: contact overflow`);
      assert.ok(metrics.headingSize >= 64, `${locale}/${width}: editorial heading scale`);
      assert.ok(metrics.minTarget >= 44, `${locale}/${width}: touch target`);
      assert.equal(await contact.locator(".contact-record").count(), 4, `${locale}/${width}: four contact methods`);
      measurements.push({ locale, width, ...metrics });
    }
    console.log(`PASS ${locale}: Contact responsive at six widths with four usable methods`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/#contact`);
  const hrefs = await page.locator("#contact .contact-record > a").evaluateAll(links => links.map(link => link.getAttribute("href")));
  assert.deepEqual(hrefs, expectedLinks);
  assert.equal(await page.locator("#contact a[target='_blank'][rel='noopener noreferrer']").count(), 3);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector(".status-section")?.textContent?.includes("Contact"));
  assert.ok((await page.locator(".status-section").textContent()).includes("07 / Contact"));
  console.log("PASS approved anchors, safe new-tab semantics and active-section status");

  const pdf = await fetch(`${base}/cv/nguyen-hoang-phuc-cv.pdf`);
  assert.equal(pdf.status, 200);
  assert.ok(pdf.headers.get("content-type")?.includes("application/pdf"));
  assert.ok((await pdf.arrayBuffer()).byteLength > 3000);
  const publicPdfs = (await readdir("public", { recursive: true })).filter(path => path.toLocaleLowerCase().endsWith(".pdf"));
  assert.deepEqual(publicPdfs.map(path => path.replaceAll("\\", "/")), ["cv/nguyen-hoang-phuc-cv.pdf"]);
  if (existsSync("CV/CV IT Resume.pdf")) {
    const sourceHash = createHash("sha256").update(await readFile("CV/CV IT Resume.pdf")).digest("hex").toUpperCase();
    assert.equal(sourceHash, expectedSourceHash);
  }
  console.log("PASS public PDF response, sole-public-PDF boundary and source integrity");

  await page.goto(`${base}/#terminal`);
  const input = page.locator("#terminal-command");
  await input.fill("contact");
  await input.press("Enter");
  const response = page.locator(".terminal-output ol > li").last();
  const terminalText = await response.textContent();
  assert.ok(terminalText.includes("nhpntd@gmail.com") && terminalText.includes("@hphuc032") && terminalText.includes("Nguyen Hoang Phuc / PDF"));
  await response.locator(".terminal-action").click();
  await page.waitForURL("**/#contact");
  assert.equal(await page.locator("#contact").evaluate(element => document.activeElement === element), true);
  console.log("PASS Terminal contact command uses the shared catalog and navigates to Contact");

  await page.locator(".site-header").getByRole("link", { name: "Tiếng Việt", exact: true }).click();
  await page.waitForURL("**/vi#contact");
  assert.ok((await page.locator("#contact").textContent()).includes("Kênh công khai"));
  assert.ok((await page.locator("#contact h2").textContent()).includes("LET'SCONNECT."));
  await page.locator("#end-system a[href='#hero']").click();
  await page.waitForURL("**/vi#hero");
  console.log("PASS locale hash preservation and Back to Top");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/#contact`);
  const transition = await page.locator(".contact-action").first().evaluate(element => parseFloat(getComputedStyle(element).transitionDuration));
  assert.ok(transition <= .001);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 430, height: 932 } });
  const noJs = await noJsContext.newPage();
  await noJs.goto(`${base}/#contact`);
  assert.equal(await noJs.locator("#contact").isVisible(), true);
  assert.equal(await noJs.locator("#contact a").count(), 4);
  assert.equal(await noJs.locator("#end-system").isVisible(), true);
  await noJsContext.close();
  console.log("PASS reduced motion and no-JavaScript readability");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/#contact`);
  await page.locator("#contact").screenshot({ path: "test-results/contact/contact-desktop-1440.png", style: captureStyle });
  const contactTop = await page.locator("#contact").evaluate(element => element.offsetTop);
  await page.evaluate(top => scrollTo(0, top - innerHeight * .52), contactTop);
  await page.screenshot({ path: "test-results/contact/terminal-to-contact.png" });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.screenshot({ path: "test-results/contact/contact-to-footer.png" });
  await page.screenshot({ path: "test-results/contact/full-page-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto(`${base}/#contact`);
  await page.locator("#contact").screenshot({ path: "test-results/contact/contact-mobile-430.png", style: captureStyle });

  const layoutShift = await page.evaluate(() => window.__contactCls);
  assert.ok(layoutShift <= .01, `Unexpected layout shift: ${layoutShift}`);
  assert.deepEqual(errors, []);
  await writeFile("test-results/contact/validation.json", JSON.stringify({ measurements, layoutShift, errors }, null, 2));
  console.log(`PASS console/hydration, layout shift ${layoutShift}, and requested screenshots`);
} finally {
  await browser.close();
}
