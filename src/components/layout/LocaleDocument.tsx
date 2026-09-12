import type { ReactNode } from "react";
import type { Locale } from "@/i18n/locales";
import { getDictionary } from "@/i18n/dictionaries";
import { editorialFont, technicalFont } from "@/styles/fonts";
import { PageShell } from "@/components/layout/PageShell";

export function LocaleDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
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
