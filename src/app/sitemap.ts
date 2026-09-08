import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { publishedCase, projects } from "@/data/projects";
import { casePath } from "@/data/project-publication";
import { logArticlePath, logIndexPath, securityLogPublication } from "@/data/security-log-publication";

export default function sitemap(): MetadataRoute.Sitemap {
  // No invented domain or localhost search entries. Set at deployment readiness.
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  const url = new URL(origin);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("SITE_URL must be a public HTTPS origin");
  const projectRoutes = locales.flatMap(locale => projects.filter(project => publishedCase(project.slug, locale)).map(project => ({ url: new URL(casePath(project.slug, locale), url.origin).href })));
  const logRoutes = locales.flatMap(locale => [
    { url: new URL(logIndexPath(locale), url.origin).href },
    ...securityLogPublication.filter(entry => (entry.locales as readonly string[]).includes(locale)).map(entry => ({ url: new URL(logArticlePath(entry.slug, locale), url.origin).href })),
  ]);
  return [...projectRoutes, ...logRoutes];
}
