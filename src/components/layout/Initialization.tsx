"use client";

import { useEffect, useRef } from "react";
import { globalUI } from "@/i18n/global-ui";
import type { Locale } from "@/i18n/locales";

let visitedInMemory = false;
export function Initialization({ locale }: { locale: Locale }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    let finish = 0;
    const frame = requestAnimationFrame(() => {
      if (visitedInMemory) return;
      let visited = false;
      try { visited = sessionStorage.getItem("carwyn:initialized") === "1"; sessionStorage.setItem("carwyn:initialized", "1"); } catch { /* Storage is optional. */ }
      visitedInMemory = true;
      if (visited || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      element.dataset.play = "true";
      finish = window.setTimeout(() => { delete element.dataset.play; }, 1200);
    });
    return () => { cancelAnimationFrame(frame); window.clearTimeout(finish); delete element.dataset.play; };
  }, []);
  const copy = globalUI[locale];
  // Decorative, non-blocking greeting; never a loader or accessibility gate.
  return <div ref={panel} className="initialization" aria-hidden="true">
    <span className="initialization-start">{copy.initializing}</span>
    <span className="initialization-ready">{copy.ready}</span>
  </div>;
}
