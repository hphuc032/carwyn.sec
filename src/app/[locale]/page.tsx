import { notFound } from "next/navigation";
import { Hero } from "@/components/home/Hero";
import { Identity } from "@/components/home/Identity";
import { Expertise } from "@/components/home/Expertise";
import { Operations } from "@/components/home/Operations";
import { Experience } from "@/components/home/Experience";
import { Achievements } from "@/components/home/Achievements";
import { SecurityLog } from "@/components/home/SecurityLog";
import { Terminal } from "@/components/home/Terminal";
import { isLocale } from "@/i18n/locales";

export default async function FoundationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main id="main-content" tabIndex={-1}><Hero locale={locale} /><Identity locale={locale} /><Expertise locale={locale} /><Operations locale={locale} /><Experience locale={locale} /><Achievements locale={locale} /><SecurityLog locale={locale} /><Terminal locale={locale} /></main>
  );
}
