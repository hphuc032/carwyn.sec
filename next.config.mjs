import createMDX from "@next/mdx";

const withMDX = createMDX({});

export default withMDX({
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "mdx"],
  devIndicators: false,
  // Preserve the actual origin for same-origin locale rewrites on loopback hosts.
  skipProxyUrlNormalize: true,
});
