import type { Locale } from "@/i18n/locales";
import { Hero } from "@/components/home/Hero";
import { Identity } from "@/components/home/Identity";
import { Expertise } from "@/components/home/Expertise";
import { Operations } from "@/components/home/Operations";
import { Experience } from "@/components/home/Experience";
import { Achievements } from "@/components/home/Achievements";
import { SecurityLog } from "@/components/home/SecurityLog";
import { Terminal } from "@/components/home/Terminal";
import { Contact } from "@/components/home/Contact";
import { EndSystem } from "@/components/home/EndSystem";
import { ChapterMotion } from "@/components/home/ChapterMotion";
import { PointerAtmosphere } from "@/components/home/PointerAtmosphere";

export function PortfolioPage({ locale }: { locale: Locale }) {
  return <>
    <main id="main-content" tabIndex={-1}>
      <Hero locale={locale} />
      <Identity locale={locale} />
      <Expertise locale={locale} />
      <Operations locale={locale} />
      <Experience locale={locale} />
      <Achievements locale={locale} />
      <SecurityLog locale={locale} />
      <Terminal locale={locale} />
      <Contact locale={locale} />
    </main>
    <EndSystem locale={locale} />
    <ChapterMotion locale={locale} />
    <PointerAtmosphere locale={locale} />
  </>;
}
