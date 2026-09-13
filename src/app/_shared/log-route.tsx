import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/locales";
import { SecurityLogIndex } from "@/components/log/SecurityLogIndex";
import { SecurityLogArticle } from "@/components/log/SecurityLogArticle";
import { getSecurityLogArticle, publishedSecurityLog } from "@/data/security-log";
import { logArticlePath, logIndexPath, securityLogPublication } from "@/data/security-log-publication";
import { localizedMetadata } from "@/lib/site-metadata";

export const logStaticParams = (locale: Locale) => securityLogPublication
  .filter(record => (record.locales as readonly Locale[]).includes(locale))
  .map(({ slug }) => ({ slug }));

export function logIndexMetadata(locale: Locale): Metadata {
  return localizedMetadata({
    locale,
    title: "Security Log — carwyn.sec",
    description: locale === "vi"
      ? "Ghi chép kỹ thuật và bài lab an toàn thông tin của carwyn.sec."
      : "Technical field notes and information-security labs from carwyn.sec.",
    paths: { en: logIndexPath("en"), vi: logIndexPath("vi") },
  });
}

export function LogIndexRoute({ locale }: { locale: Locale }) {
  return <SecurityLogIndex locale={locale} />;
}

export async function logArticleMetadata(locale: Locale, params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const entry = publishedSecurityLog(slug, locale);
  if (!entry) return {
    title: locale === "vi" ? "Không tìm thấy bài viết — carwyn.sec" : "Log not found — carwyn.sec",
    robots: { index: false, follow: false },
  };
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

export async function LogArticleRoute({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getSecurityLogArticle(slug, locale);
  if (!article) notFound();
  return <SecurityLogArticle article={article} locale={locale} />;
}
