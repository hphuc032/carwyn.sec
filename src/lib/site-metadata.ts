import type { Metadata } from "next";
import type { Locale } from "@/i18n/locales";
import { deploymentBasePath, publicAssetPath } from "@/lib/deployment-path";

const socialLocale = { en: "en_US", vi: "vi_VN" } as const;

export const siteTitle = "carwyn.sec — Cyber Security Portfolio";

export const siteDescriptions = {
  en: "The personal Information Security portfolio of Nguyen Hoang Phuc.",
  vi: "Portfolio An toàn thông tin của Nguyen Hoang Phuc.",
} as const satisfies Record<Locale, string>;

export function getSiteUrl() {
  const configured = process.env.SITE_URL;
  if (!configured) return undefined;
  const url = new URL(configured);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new Error("SITE_URL must be a public HTTPS URL without credentials, query, or hash");
  }
  return url.href.replace(/\/$/, "");
}

export function absoluteSiteUrl(path: string, siteUrl = getSiteUrl()) {
  if (!siteUrl) return undefined;
  const base = new URL(`${siteUrl.replace(/\/$/, "")}/`);
  let relative = path.replace(/^\/+/, "");
  if (deploymentBasePath && relative && !relative.endsWith("/") && !/\.[a-z0-9]+$/i.test(relative)) {
    relative += "/";
  }
  return new URL(relative || ".", base).href;
}

export function rootMetadata(locale: Locale): Metadata {
  const siteUrl = getSiteUrl();
  return {
    ...localizedMetadata({
      locale,
      title: siteTitle,
      description: siteDescriptions[locale],
      paths: { en: "/", vi: "/vi" },
    }),
    ...(siteUrl ? { metadataBase: new URL(`${siteUrl}/`) } : {}),
    icons: { icon: publicAssetPath("/favicon.svg") },
    robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
  };
}

export function localizedMetadata({
  locale,
  title,
  description,
  paths,
  type = "website",
  publishedTime,
}: {
  locale: Locale;
  title: string;
  description: string;
  paths: Record<Locale, string>;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const currentPath = paths[locale];
  const currentUrl = absoluteSiteUrl(currentPath, siteUrl);
  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type,
    title,
    description,
    siteName: "carwyn.sec",
    locale: socialLocale[locale],
    alternateLocale: [socialLocale[locale === "en" ? "vi" : "en"]],
    ...(currentUrl ? { url: currentUrl } : {}),
    ...(type === "article" && publishedTime ? { publishedTime } : {}),
  };

  return {
    title: { absolute: title },
    description,
    openGraph,
    ...(siteUrl ? {
      alternates: {
        canonical: currentUrl,
        languages: {
          en: absoluteSiteUrl(paths.en, siteUrl)!,
          vi: absoluteSiteUrl(paths.vi, siteUrl)!,
          "x-default": absoluteSiteUrl(paths.en, siteUrl)!,
        },
      },
    } : {}),
  };
}
