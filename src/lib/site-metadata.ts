import type { Metadata } from "next";
import type { Locale } from "@/i18n/locales";

const socialLocale = { en: "en_US", vi: "vi_VN" } as const;

export const siteTitle = "carwyn.sec — Cyber Security Portfolio";

export const siteDescriptions = {
  en: "The personal Information Security portfolio of Nguyen Hoang Phuc.",
  vi: "Portfolio An toàn thông tin của Nguyen Hoang Phuc.",
} as const satisfies Record<Locale, string>;

export function getSiteOrigin() {
  const configured = process.env.SITE_URL;
  if (!configured) return undefined;
  const url = new URL(configured);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("SITE_URL must be a public HTTPS origin");
  }
  return url.origin;
}

function absoluteUrl(path: string, origin: string) {
  return new URL(path, origin).href;
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
  const origin = getSiteOrigin();
  const currentPath = paths[locale];
  const currentUrl = origin ? absoluteUrl(currentPath, origin) : undefined;
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
    ...(origin ? {
      alternates: {
        canonical: currentUrl,
        languages: {
          en: absoluteUrl(paths.en, origin),
          vi: absoluteUrl(paths.vi, origin),
          "x-default": absoluteUrl(paths.en, origin),
        },
      },
    } : {}),
  };
}
