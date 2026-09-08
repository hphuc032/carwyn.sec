import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const production = process.argv.includes("--production");

async function request(path, language = "en") {
  const response = await fetch(new URL(path, base), {
    redirect: "manual",
    headers: { "Accept-Language": language },
    signal: AbortSignal.timeout(30000),
  });
  return { response, html: await response.text() };
}

for (const [path, locale, message, language] of [
  ["/", "en", "UNDERSTAND SYSTEMS. DEFEND THEM.", "vi"],
  ["/vi", "vi", "UNDERSTAND SYSTEMS. DEFEND THEM.", "en"],
]) {
  const { response, html } = await request(path, language);
  assert.equal(response.status, 200, `${path} must render without a redirect`);
  assert.ok(html.includes(`<html lang="${locale}"`), `${path} document language`);
  assert.ok(html.includes(message), `${path} server-rendered dictionary`);
  assert.ok(html.includes('id="main-content"'), `${path} skip-link target`);
  assert.ok(html.includes('content="noindex, nofollow"'), `${path} draft indexing`);
  console.log(`PASS ${path}: 200, ${locale}, server-rendered content`);
}

const { response: englishAlias } = await request("/en?source=foundation");
assert.equal(englishAlias.status, 308);
assert.equal(new URL(englishAlias.headers.get("location"), base).pathname, "/");
assert.equal(new URL(englishAlias.headers.get("location"), base).search, "?source=foundation");
console.log("PASS /en: canonical redirect preserves query");

for (const path of ["/fr", "/vi/missing", "/missing", "/operations/not-published", "/vi/operations/not-published", "/picture/CA1A3276.JPG", "/CV/CV%20IT%20Resume.pdf"]) {
  const { response } = await request(path);
  assert.equal(response.status, 404, `${path} must be unavailable`);
  console.log(`PASS ${path}: 404`);
}

for (const locale of ["en", "vi"]) {
  for (const slug of ["secure-api-gateway", "vulnerability-assessment", "network-traffic-analysis"]) {
    const path = `${locale === "vi" ? "/vi" : ""}/operations/${slug}`;
    const { response, html } = await request(path);
    assert.equal(response.status, 200, path);
    assert.ok(html.includes(`<html lang="${locale}"`));
    assert.ok(html.includes('id="case-title"') && html.includes('id="overview"'));
    assert.ok(!html.includes('class="network-object"'));
    assert.ok(!html.includes('id="results"') && !html.includes('id="architecture"'));
    console.log(`PASS ${path}: published brief, SSR, no unsupported sections`);
  }
}
const { response: sitemapResponse, html: sitemapXml } = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
assert.ok(!sitemapXml.includes("dev/design-system") && !sitemapXml.includes("not-published"));
console.log("PASS sitemap excludes unpublished routes");

for (const path of ["/dev/design-system", "/vi/dev/design-system"]) {
  const { response, html } = await request(path);
  assert.equal(response.status, production ? 404 : 200, `${path} preview boundary`);
  if (!production) assert.ok(html.includes('content="noindex, nofollow"'));
  console.log(`PASS ${path}: ${response.status}, ${production ? "excluded from production" : "development specimen"}`);
}
