import type { MetadataRoute } from "next";
import { deploymentBasePath } from "@/lib/deployment-path";
import { absoluteSiteUrl, getSiteUrl } from "@/lib/site-metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: siteUrl
      ? { userAgent: "*", allow: `${deploymentBasePath || ""}/` }
      : { userAgent: "*", disallow: "/" },
    ...(siteUrl ? { sitemap: absoluteSiteUrl("/sitemap.xml", siteUrl) } : {}),
  };
}
