"use client";

import { useEffect, useRef } from "react";
import { globalUI } from "@/i18n/global-ui";
import type { Locale } from "@/i18n/locales";
import { setInitializationState } from "@/lib/initialization-state";
import { motionTiming } from "@/lib/motion";

let visitedInMemory = false;
export function Initialization({ locale }: { locale: Locale }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    let finish = 0;
    const complete = () => { delete element.dataset.play; setInitializationState("ready"); };
    const visibility = () => { if (document.hidden) { clearTimeout(finish); complete(); } };
    document.addEventListener("visibilitychange", visibility);
    const frame = requestAnimationFrame(() => {
      if (visitedInMemory) { setInitializationState("ready"); return; }
      let visited = false;
      try { visited = sessionStorage.getItem("carwyn:initialized") === "1"; sessionStorage.setItem("carwyn:initialized", "1"); } catch { /* Storage is optional. */ }
      visitedInMemory = true;
      if (visited || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { complete(); return; }
      setInitializationState("running");
      element.dataset.play = "true";
      finish = window.setTimeout(complete, motionTiming().initialization * 1000);
    });
    return () => { cancelAnimationFrame(frame); window.clearTimeout(finish); document.removeEventListener("visibilitychange", visibility); if (element.dataset.play) complete(); };
  }, []);
  const copy = globalUI[locale];
  // Decorative, non-blocking greeting; never a loader or accessibility gate.
  return <div ref={panel} className="initialization" aria-hidden="true">
    <span className="initialization-start">{copy.initializing}</span>
    <span className="initialization-ready">{copy.ready}</span>
  </div>;
}
