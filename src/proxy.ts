import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // NextURL normalizes 127.0.0.1 to localhost. Preserve request.url so a local
  // rewrite is not mistaken for an external request that re-enters this proxy.
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/en" || path.startsWith("/en/")) {
    url.pathname = path.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (path === "/vi" || path.startsWith("/vi/")) {
    return NextResponse.next();
  }

  url.pathname = `/en${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|.*\\.[^/]+$).*)"],
};
