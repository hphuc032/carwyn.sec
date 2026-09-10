"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-motion-preference";

export function ContextCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  useEffect(() => {
    const element = cursor.current;
    if (!element || reduced) return;
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const hide = () => { cancelAnimationFrame(frame); frame = 0; element.dataset.visible = "false"; };
    const move = (event: PointerEvent) => {
      if (document.hidden || event.buttons || !media.matches || event.pointerType !== "mouse" || document.getSelection()?.isCollapsed === false) { hide(); return; }
      x = event.clientX; y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-native-cursor],input,textarea,select,[contenteditable="true"]')) { hide(); return; }
      const context = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const label = context && ["view", "open", "scan"].includes(context) ? context.toUpperCase() : "";
      // Avoid triggering the global section-discovery observer on every pointer event.
      if (element.textContent !== label) element.textContent = label;
      element.dataset.interactive = String(Boolean(label || target?.closest("a, button, summary")));
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
    window.addEventListener("scroll", hide, { passive: true, capture: true });
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("selectionchange", hide);
    media.addEventListener("change", hide);
    return () => {
      cancelAnimationFrame(frame); hide();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("scroll", hide, true);
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("selectionchange", hide);
      media.removeEventListener("change", hide);
    };
  }, [pathname, reduced]);
  return <div ref={cursor} className="context-cursor" aria-hidden="true" />;
}
