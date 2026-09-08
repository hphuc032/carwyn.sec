import type { Locale } from "@/i18n/locales";

// Client-safe publication manifest. Article prose and filesystem paths stay in
// the server-only registry.
export const securityLogPublication = [
  {
    slug: "analyzing-http-and-https-traffic-with-wireshark",
    logNumber: "001",
    locales: ["en", "vi"],
  },
] as const;

export function isPublishedLog(slug: string, locale: Locale) {
  return securityLogPublication.some(entry => entry.slug === slug && (entry.locales as readonly Locale[]).includes(locale));
}

export function logIndexPath(locale: Locale) {
  return `${locale === "vi" ? "/vi" : ""}/log`;
}

export function logArticlePath(slug: string, locale: Locale) {
  return `${logIndexPath(locale)}/${slug}`;
}
