"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/locales";
export function HeroScrollCue({ locale }: { locale: Locale }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const check = () => setAvailable(Boolean(document.getElementById("identity")));
    const observer = new MutationObserver(check);
    observer.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    check();
    return () => observer.disconnect();
  }, []);
  return <a className="hero-scroll" href="#identity" aria-disabled={!available}
    aria-label={available ? (locale === "en" ? "Scroll to Identity" : "Cuộn đến phần giới thiệu") : (locale === "en" ? "Next section not yet available" : "Phần tiếp theo chưa khả dụng")}
    onClick={(event) => { if (!document.getElementById("identity")) event.preventDefault(); }}>
    {locale === "en" ? "SCROLL" : "CUỘN"}<span aria-hidden="true">↓</span>
  </a>;
}
