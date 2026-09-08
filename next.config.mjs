import createMDX from "@next/mdx";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const withMDX = createMDX({});

export default function nextConfig(phase) {
  return withMDX({
  reactStrictMode: true,
  poweredByHeader: false,
  // Preview files are not route candidates in production. No runtime opt-in.
  pageExtensions: phase === PHASE_DEVELOPMENT_SERVER
    ? ["preview.tsx", "ts", "tsx", "mdx"]
    : ["ts", "tsx", "mdx"],
  devIndicators: false,
  // Preserve the actual origin for same-origin locale rewrites on loopback hosts.
  skipProxyUrlNormalize: true,
  });
}
