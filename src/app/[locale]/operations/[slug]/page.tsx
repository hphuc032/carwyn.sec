import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { publishedCase } from "@/data/projects";
import { projectPublication } from "@/data/project-publication";
import { CaseStudy } from "@/components/operations/CaseStudy";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return projectPublication.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = publishedCase(slug, locale);
  if (!project) notFound();
  const content = project.content[locale]!.value;
  return { title: { absolute: `${content.title} — carwyn.sec` }, description: content.summary };
}
export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = publishedCase(slug, locale);
  if (!project) notFound();
  return <CaseStudy project={project} locale={locale} />;
}
