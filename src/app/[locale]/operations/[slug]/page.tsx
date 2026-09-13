import { notFound } from "next/navigation";
import { caseStaticParams, caseStudyMetadata, CaseStudyRoute } from "@/app/_shared/case-study-route";
import { isLocale } from "@/i18n/locales";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams({ params }: { params: { locale: string } }) {
  return isLocale(params.locale) ? caseStaticParams(params.locale) : [];
}
export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return caseStudyMetadata(locale, Promise.resolve({ slug }));
}
export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <CaseStudyRoute locale={locale} params={Promise.resolve({ slug })} />;
}
