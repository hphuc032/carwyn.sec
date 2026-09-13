import { notFound } from "next/navigation";
import { logArticleMetadata, LogArticleRoute, logStaticParams } from "@/app/_shared/log-route";
import { isLocale } from "@/i18n/locales";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams({ params }: { params: { locale: string } }) {
  return isLocale(params.locale) ? logStaticParams(params.locale) : [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return logArticleMetadata(locale, Promise.resolve({ slug }));
}

export default async function LogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <LogArticleRoute locale={locale} params={Promise.resolve({ slug })} />;
}
