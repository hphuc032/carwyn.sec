import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SecurityLogArticle } from "@/components/log/SecurityLogArticle";
import { getSecurityLogArticle, publishedSecurityLog } from "@/data/security-log";
import { logArticlePath, securityLogPublication } from "@/data/security-log-publication";
import { isLocale } from "@/i18n/locales";
import { localizedMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return securityLogPublication.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const entry = publishedSecurityLog(slug, locale);
  if (!entry) notFound();
  const content = entry.content[locale]!.value;
  return localizedMetadata({
    locale,
    title: `${content.title} — carwyn.sec`,
    description: content.excerpt,
    paths: { en: logArticlePath(slug, "en"), vi: logArticlePath(slug, "vi") },
    type: "article",
    publishedTime: entry.publishedAt?.value,
  });
}

export default async function LogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = getSecurityLogArticle(slug, locale);
  if (!article) notFound();
  return <SecurityLogArticle article={article} locale={locale} />;
}
