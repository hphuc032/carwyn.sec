import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { publishedCase } from "@/data/projects";
import { projectPublication } from "@/data/project-publication";
import { CaseStudy } from "@/components/operations/CaseStudy";
import { casePath } from "@/data/project-publication";
import { localizedMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return projectPublication.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = publishedCase(slug, locale);
  if (!project) return { title: locale === "vi" ? "Không tìm thấy dự án — carwyn.sec" : "Case study not found — carwyn.sec", robots: { index: false, follow: false } };
  const content = project.content[locale]!.value;
  if (!content.summary) notFound();
  return localizedMetadata({
    locale,
    title: `${content.title} — carwyn.sec`,
    description: content.summary,
    paths: { en: casePath(slug, "en"), vi: casePath(slug, "vi") },
  });
}
export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = publishedCase(slug, locale);
  if (!project) notFound();
  return <CaseStudy project={project} locale={locale} />;
}
