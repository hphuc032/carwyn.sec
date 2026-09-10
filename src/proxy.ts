import { NextResponse, type NextRequest } from "next/server";
import { projectPublication } from "@/data/project-publication";
import { securityLogPublication } from "@/data/security-log-publication";

export function proxy(request: NextRequest) {
  // NextURL normalizes 127.0.0.1 to localhost. Preserve request.url so a local
  // rewrite is not mistaken for an external request that re-enters this proxy.
  const url = new URL(request.url);
  const path = url.pathname;
  const requestHeaders = new Headers(request.headers);
  const locale = path === "/vi" || path.startsWith("/vi/") ? "vi" : "en";
  requestHeaders.set("x-carwyn-locale", locale);

  const publicPath = locale === "vi" ? path.slice(3) || "/" : path;
  const contentRoute = publicPath.match(/^\/(operations|log)\/([^/]+)\/?$/);
  if (contentRoute) {
    const [, kind, slug] = contentRoute;
    const publication = kind === "operations" ? projectPublication : securityLogPublication;
    const available = publication.some(entry => entry.slug === slug && (entry.locales as readonly string[]).includes(locale));
    if (!available) {
      url.pathname = `/${locale}/__not-published__`;
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
  }

  if (path === "/en" || path.startsWith("/en/")) {
    url.pathname = path.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (path === "/vi" || path.startsWith("/vi/")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  url.pathname = `/en${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)"],
};
