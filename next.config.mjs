import createMDX from "@next/mdx";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const withMDX = createMDX({});
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const githubPagesBasePath = "/carwyn.sec";

export default function nextConfig(phase) {
  return withMDX({
    reactStrictMode: true,
    poweredByHeader: false,
    experimental: { globalNotFound: true },
    // Preview files are not route candidates in production. No runtime opt-in.
    pageExtensions: phase === PHASE_DEVELOPMENT_SERVER
      ? ["preview.tsx", "ts", "tsx", "mdx"]
      : ["ts", "tsx", "mdx"],
    devIndicators: false,
    env: {
      NEXT_PUBLIC_BASE_PATH: isGitHubPages ? githubPagesBasePath : "",
    },
    ...(isGitHubPages ? {
      output: "export",
      trailingSlash: true,
      basePath: githubPagesBasePath,
      images: { unoptimized: true },
    } : {
      // Preserve convenient aliases only on deployments with a Next.js server.
      skipProxyUrlNormalize: true,
      async redirects() {
        return [
          { source: "/favicon.ico", destination: "/favicon.svg", permanent: true },
        ];
      },
    }),
  });
}
