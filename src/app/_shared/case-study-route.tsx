import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/locales";
import { publishedCase } from "@/data/projects";
import { projectPublication, casePath } from "@/data/project-publication";
import { CaseStudy } from "@/components/operations/CaseStudy";
import { localizedMetadata } from "@/lib/site-metadata";

export const caseStaticParams = () => projectPublication.map(({ slug }) => ({ slug }));

export async function caseStudyMetadata(locale: Locale, params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const project = publishedCase(slug, locale);
  if (!project) return {
    title: locale === "vi" ? "Không tìm thấy dự án — carwyn.sec" : "Case study not found — carwyn.sec",
    robots: { index: false, follow: false },
  };
  const content = project.content[locale]!.value;
  if (!content.summary) notFound();
  return localizedMetadata({
    locale,
    title: `${content.title} — carwyn.sec`,
    description: content.summary,
    paths: { en: casePath(slug, "en"), vi: casePath(slug, "vi") },
  });
}

export async function CaseStudyRoute({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = publishedCase(slug, locale);
  if (!project) notFound();
  return <CaseStudy project={project} locale={locale} />;
}
