export const isStaticExport = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "github-pages";

/** Public assets are served from the origin root in every supported deployment. */
export function publicAssetPath(path: string) {
  return path;
}

/** Matches the trailing-slash layout used by the static GitHub Pages export. */
export function publicRoutePath(path: string) {
  if (!isStaticExport || !path.startsWith("/") || path.startsWith("//")) return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  let pathname = match?.[1] || "/";
  const suffix = match?.[2] || "";
  if (pathname !== "/" && !pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(pathname)) pathname += "/";
  return `${pathname}${suffix}`;
}
