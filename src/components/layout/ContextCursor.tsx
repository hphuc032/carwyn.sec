"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-motion-preference";

export function ContextCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = cursor.current;
    if (!element || reduced) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const hide = () => { element.dataset.visible = "false"; };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") { hide(); return; }
      x = event.clientX; y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const context = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const label = context && ["view", "open", "scan"].includes(context) ? context.toUpperCase() : "";
      element.textContent = label;
      element.dataset.interactive = String(Boolean(label || target?.closest("a, button, input, select, textarea, summary")));
      element.dataset.visible = "true";
      if (!frame) frame = requestAnimationFrame(() => {
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = 0;
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", hide);
    media.addEventListener("change", hide);
    return () => {
      cancelAnimationFrame(frame); hide();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", hide);
      media.removeEventListener("change", hide);
    };
  }, [reduced]);
  return <div ref={cursor} className="context-cursor" aria-hidden="true" />;
}
