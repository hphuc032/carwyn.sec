"use client";

import { useEffect, useState } from "react";
import { sectionIds, type SectionId } from "@/i18n/global-ui";

export function useSectionIndex(pathname: string) {
  const [index, setIndex] = useState<{ available: SectionId[]; active?: SectionId }>({ available: [] });
  useEffect(() => {
    const nodes = new Map<SectionId, HTMLElement>();
    const visible = new Set<SectionId>();
    let frame = 0;
    const publish = () => {
      const available = sectionIds.filter((id) => nodes.has(id));
      const active = sectionIds.find((id) => visible.has(id));
      setIndex((previous) => previous.active === active && previous.available.join() === available.join()
        ? previous : { available, ...(active ? { active } : {}) });
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = entry.target.id as SectionId;
        if (entry.isIntersecting) visible.add(id); else visible.delete(id);
      }
      publish();
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    const discover = () => {
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        const old = nodes.get(id);
        if (old === element) continue;
        if (old) { observer.unobserve(old); nodes.delete(id); visible.delete(id); }
        if (element) { nodes.set(id, element); observer.observe(element); }
      }
      publish();
    };
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(discover);
    });
    discover();
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["id"] });
    return () => { observer.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame); };
  }, [pathname]);
  return index;
}
