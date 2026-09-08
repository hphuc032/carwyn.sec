"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/use-motion-preference";
import { getInitializationState, getServerInitializationState, subscribeInitialization } from "@/lib/initialization-state";
import type { gsap } from "gsap";

let playedInMemory = false;
export function HeroMotion() {
  const reduced = useReducedMotion();
  const initialization = useSyncExternalStore(subscribeInitialization, getInitializationState, getServerInitializationState);
  useEffect(() => {
    if (initialization !== "ready" || reduced || playedInMemory) return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    let seen = false;
    try { seen = sessionStorage.getItem("carwyn:hero-intro") === "1"; } catch { /* Optional session preference. */ }
    if (seen) { playedInMemory = true; return; }
    let cancelled = false;
    let context: gsap.Context | undefined;
    const started = performance.now();
    void import("gsap").then(({ gsap }) => {
      if (cancelled || playedInMemory || performance.now() - started > 700 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      playedInMemory = true;
      try { sessionStorage.setItem("carwyn:hero-intro", "1"); } catch { /* Memory guard remains available. */ }
      context = gsap.context(() => {
        // Text is never hidden; enhancement begins only after the library succeeds.
        gsap.fromTo("[data-hero-line]", { yPercent: 8, opacity: .78 }, { yPercent: 0, opacity: 1, duration: .7, stagger: .075, ease: "power3.out", clearProps: "transform,opacity" });
        gsap.fromTo("[data-hero-detail]", { y: 6, opacity: .8 }, { y: 0, opacity: 1, duration: .5, delay: .2, clearProps: "transform,opacity" });
      }, hero);
    }).catch(() => { /* Server-rendered typography already is the complete fallback. */ });
    return () => { cancelled = true; context?.revert(); };
  }, [initialization, reduced]);
  return null;
}
