import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/pages/PortfolioPage";
import { isLocale } from "@/i18n/locales";

export default async function FoundationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PortfolioPage locale={locale} />;
}
