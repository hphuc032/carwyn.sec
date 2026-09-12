import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const outputDirectory = join(process.cwd(), "out");
const basePath = "/carwyn.sec";
const siteUrl = `https://hphuc032.github.io${basePath}`;
const slugs = ["secure-api-gateway", "vulnerability-assessment", "network-traffic-analysis"];
const articleSlug = "analyzing-http-and-https-traffic-with-wireshark";
const routes = [
  "/",
  "/vi/",
  ...slugs.flatMap(slug => [`/operations/${slug}/`, `/vi/operations/${slug}/`]),
  "/log/",
  "/vi/log/",
  `/log/${articleSlug}/`,
  `/vi/log/${articleSlug}/`,
];
const requiredFiles = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "cv/nguyen-hoang-phuc-cv.pdf",
  ...routes.filter(route => route !== "/").map(route => `${route.slice(1)}index.html`),
];

async function exists(path) {
  try { return (await stat(path)).isFile(); } catch { return false; }
}

async function directoryIndex(path) {
  try { return (await stat(path)).isDirectory() && await exists(join(path, "index.html")); } catch { return false; }
}

for (const file of requiredFiles) {
  assert.ok(await exists(join(outputDirectory, file)), `missing static artifact: out/${file}`);
}
assert.ok((await stat(join(outputDirectory, "_next"))).isDirectory(), "missing out/_next directory");
assert.equal(await exists(join(outputDirectory, "en", "index.html")), false, "the unsupported /en alias must not be exported");

const htmlFiles = await Promise.all(requiredFiles.filter(file => file.endsWith(".html")).map(async file => ({
  file,
  html: await readFile(join(outputDirectory, file), "utf8"),
})));
for (const { file, html } of htmlFiles) {
  assert.equal(/https?:\/\/(?:localhost|127\.0\.0\.1)/i.test(html), false, `${file}: localhost URL leaked`);
  assert.equal(/(?:href|src)="\/(?!carwyn\.sec(?:\/|#|"))/.test(html), false, `${file}: unprefixed root-relative href/src`);
  assert.ok(html.includes(`${siteUrl}/`) || file === "404.html", `${file}: production base URL missing`);
}

const homeRecord = htmlFiles.find(item => item.file === "index.html");
assert.ok(homeRecord, "home export must exist");
const home = homeRecord.html;
assert.ok(home.includes(`${basePath}/images/identity/nguyen-hoang-phuc.webp`), "portrait must use the deployment base path");
assert.ok(home.includes(`${basePath}/cv/nguyen-hoang-phuc-cv.pdf`), "CV must use the deployment base path");
assert.ok(home.includes(`${basePath}/_next/`), "Next.js assets must use the deployment base path");

const sitemap = await readFile(join(outputDirectory, "sitemap.xml"), "utf8");
assert.equal((sitemap.match(/<url>/g) ?? []).length, routes.length, "sitemap route count");
assert.equal(sitemap.includes("localhost"), false, "sitemap must not contain localhost");
assert.ok(routes.every(route => sitemap.includes(`${siteUrl}${route}`)), "sitemap must contain every published route under the project path");

const robots = await readFile(join(outputDirectory, "robots.txt"), "utf8");
assert.ok(robots.includes(`Allow: ${basePath}/`), "robots allow rule must include the project path");
assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots sitemap URL must include the project path");

const cv = await readFile(join(outputDirectory, "cv", "nguyen-hoang-phuc-cv.pdf"));
assert.ok(cv.subarray(0, 5).toString() === "%PDF-", "public CV is not a PDF");
console.log(`PASS artifact structure (${requiredFiles.length} required files, CV SHA256 ${createHash("sha256").update(cv).digest("hex")})`);
console.log(`PASS base-path references, SEO URLs, robots and ${routes.length} published sitemap routes`);

const mime = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".svg", "image/svg+xml"],
  [".webp", "image/webp"], [".woff2", "font/woff2"], [".pdf", "application/pdf"],
  [".xml", "application/xml; charset=utf-8"], [".txt", "text/plain; charset=utf-8"],
]);

function fileForRequest(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://127.0.0.1").pathname);
  if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) return null;
  const relative = pathname.slice(basePath.length).replace(/^\/+/, "");
  const candidate = relative === "" ? "index.html" : relative.endsWith("/") ? `${relative}index.html` : relative;
  const resolved = normalize(join(outputDirectory, candidate));
  return resolved.startsWith(normalize(outputDirectory)) ? resolved : null;
}

const server = createServer(async (request, response) => {
  const requested = fileForRequest(request.url || "/");
  const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
  if (requested && !requestUrl.pathname.endsWith("/") && await directoryIndex(requested)) {
    response.statusCode = 308;
    response.setHeader("Location", `${requestUrl.pathname}/${requestUrl.search}`);
    response.end();
    return;
  }
  const file = requested && await exists(requested) ? requested : join(outputDirectory, "404.html");
  response.statusCode = requested && await exists(requested) ? 200 : 404;
  response.setHeader("Content-Type", mime.get(extname(file)) || "application/octet-stream");
  response.end(await readFile(file));
});

const serve = process.argv.includes("--serve");
const requestedPort = serve ? Number(process.env.PORT || 4173) : 0;
await new Promise(resolve => server.listen(requestedPort, "127.0.0.1", resolve));
try {
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const localOrigin = `http://127.0.0.1:${address.port}${basePath}`;
  for (const route of routes) {
    const response = await fetch(`${localOrigin}${route}`);
    assert.equal(response.status, 200, `direct request failed: ${basePath}${route}`);
    assert.match(response.headers.get("content-type") || "", /^text\/html/, `direct route must serve HTML: ${route}`);
  }
  const missing = await fetch(`${localOrigin}/log/not-published/`);
  assert.equal(missing.status, 404, "unpublished route must remain unavailable");
  console.log(`PASS direct static-host requests for ${routes.length} published routes; unpublished route returns 404`);
  if (serve) {
    console.log(`Static export available at ${localOrigin}/`);
    await new Promise(resolve => {
      process.once("SIGINT", resolve);
      process.once("SIGTERM", resolve);
    });
  }
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}
