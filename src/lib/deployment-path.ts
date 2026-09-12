const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const deploymentBasePath = configuredBasePath === "/"
  ? ""
  : configuredBasePath.replace(/\/$/, "");

/** Prefixes files served from public/. Next.js already prefixes next/link routes. */
export function publicAssetPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || !deploymentBasePath) return path;
  if (path === deploymentBasePath || path.startsWith(`${deploymentBasePath}/`)) return path;
  return `${deploymentBasePath}${path}`;
}

/** Prefixes application routes and matches the trailing-slash export layout. */
export function publicRoutePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || !deploymentBasePath) return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  let pathname = match?.[1] || "/";
  const suffix = match?.[2] || "";
  if (pathname !== "/" && !pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(pathname)) pathname += "/";
  return `${deploymentBasePath}${pathname}${suffix}`;
}
