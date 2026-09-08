import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/locales";
import { editorialFont, technicalFont } from "@/styles/fonts";
import { PageShell } from "@/components/layout/PageShell";
import "@/styles/globals.css";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: {
    default: "carwyn.sec — Cyber Security Portfolio",
    template: "%s | carwyn.sec",
  },
  description: "The personal Information Security portfolio of Nguyen Hoang Phuc.",
  // The foundation is not a published portfolio. Revisit at release readiness.
  robots: { index: false, follow: false },
};

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
