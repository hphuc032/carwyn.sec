import { notFound } from "next/navigation";
import { logIndexMetadata, LogIndexRoute } from "@/app/_shared/log-route";
import { isLocale } from "@/i18n/locales";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return logIndexMetadata(locale);
}

export default async function LogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LogIndexRoute locale={locale} />;
}
