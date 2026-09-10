"use client";

import type { MouseEvent, ReactNode } from "react";

export function BackToTopLink({ children }: { children: ReactNode }) {
  function moveToTop(event: MouseEvent<HTMLAnchorElement>) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const main = document.getElementById("main-content");
    const hero = document.getElementById("hero");
    if (!main || !hero) return;
    event.preventDefault();
    history.pushState(null, "", "#hero");
    hero.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    main.focus({ preventScroll: true });
  }

  return <a href="#hero" onClick={moveToTop}>{children}</a>;
}
