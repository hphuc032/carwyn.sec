import type { Locale } from "@/i18n/locales";
// Small publication manifest shared with navigation; prose stays server-side.
export const projectPublication = [
  { slug: "secure-api-gateway", caseNumber: "001", locales: ["en", "vi"] },
  { slug: "vulnerability-assessment", caseNumber: "002", locales: ["en", "vi"] },
  { slug: "network-traffic-analysis", caseNumber: "003", locales: ["en", "vi"] },
] as const;
export function isPublishedCase(slug: string, locale: Locale) {
  return projectPublication.some(record => record.slug === slug && (record.locales as readonly Locale[]).includes(locale));
}
export function casePath(slug: string, locale: Locale) {
  return `${locale === "vi" ? "/vi" : ""}/operations/${slug}`;
}
