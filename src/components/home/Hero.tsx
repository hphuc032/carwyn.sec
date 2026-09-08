import { SectionLabel } from "@/components/ui/SectionLabel";
import { StaticNetwork } from "@/components/webgl/StaticNetwork";
import { NetworkSphere } from "@/components/webgl/NetworkSphere";
import type { Locale } from "@/i18n/locales";
import { HeroMotion } from "./HeroMotion";
import { HeroScrollCue } from "./HeroScrollCue";

export function Hero({ locale }: { locale: Locale }) {
  return <section id="hero" className="hero" aria-labelledby="hero-title">
    <div className="hero-topline" data-hero-detail>
      <SectionLabel number="01">HERO</SectionLabel>
      <span className="hero-signature" lang="en">Nguyen Hoang Phuc</span>
    </div>
    <NetworkSphere locale={locale}><StaticNetwork /></NetworkSphere>
    <h1 id="hero-title" className="hero-heading" lang="en" aria-label="UNDERSTAND SYSTEMS. DEFEND THEM.">
      <span className="hero-statement hero-understand" aria-hidden="true"><span className="hero-line"><span data-hero-line>UNDERSTAND</span></span><span className="hero-line"><span data-hero-line>SYSTEMS.</span></span></span>
      <span className="hero-statement hero-defend" aria-hidden="true"><span className="hero-line"><span data-hero-line>DEFEND</span></span><span className="hero-line"><span data-hero-line>THEM.</span></span></span>
    </h1>
    <div className="hero-bottomline" data-hero-detail>
      <p className="hero-field">{locale === "en" ? "INFORMATION SECURITY" : "AN TOÀN THÔNG TIN"}<span>2026</span></p>
      <HeroScrollCue locale={locale} />
    </div>
    <HeroMotion />
  </section>;
}
