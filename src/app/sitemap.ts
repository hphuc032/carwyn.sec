import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { publishedCase, projects } from "@/data/projects";
import { casePath } from "@/data/project-publication";

export default function sitemap(): MetadataRoute.Sitemap {
  // No invented domain or localhost search entries. Set at deployment readiness.
  const origin = process.env.SITE_URL;
  if (!origin) return [];
  const url = new URL(origin);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("SITE_URL must be a public HTTPS origin");
  return locales.flatMap(locale => projects.filter(project => publishedCase(project.slug, locale)).map(project => ({ url: new URL(casePath(project.slug, locale), url.origin).href })));
}
