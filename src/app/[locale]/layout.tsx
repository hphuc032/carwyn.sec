import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/locales";
import { editorialFont, technicalFont } from "@/styles/fonts";
import { PageShell } from "@/components/layout/PageShell";
import { getSiteOrigin, localizedMetadata, siteDescriptions, siteTitle } from "@/lib/site-metadata";
import "@/styles/globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const origin = getSiteOrigin();
  return {
    ...localizedMetadata({
      locale,
      title: siteTitle,
      description: siteDescriptions[locale],
      paths: { en: "/", vi: "/vi" },
    }),
    ...(origin ? { metadataBase: new URL(origin) } : {}),
    icons: { icon: "/favicon.svg" },
    robots: { index: Boolean(origin), follow: Boolean(origin) },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale} className={`dark ${editorialFont.variable} ${technicalFont.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          {dictionary.skipToContent}
        </a>
        <PageShell locale={locale}>{children}</PageShell>
      </body>
    </html>
  );
}
