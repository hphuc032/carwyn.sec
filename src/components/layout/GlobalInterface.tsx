"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { globalUI, sectionIds, publicPath } from "@/i18n/global-ui";
import type { Locale } from "@/i18n/locales";
import { useSectionIndex } from "@/hooks/use-section-index";
import { useReducedMotion } from "@/hooks/use-motion-preference";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { LanguageSelector } from "./LanguageSelector";

export function GlobalInterface({ locale }: { locale: Locale }) {
  const copy = globalUI[locale];
  const pathname = usePathname();
  const home = locale === "en" ? "/" : "/vi";
  const { available, active } = useSectionIndex(pathname);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const navigationFrame = useRef(0);
  const activeIndex = active ? sectionIds.indexOf(active) : -1;
  useEffect(() => () => cancelAnimationFrame(navigationFrame.current), []);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const returnTarget = trigger.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      returnTarget?.focus({ preventScroll: true });
    };
  }, [open]);

  return <>
    <header className="site-header">
      <Link className="site-brand" href={home} aria-label={copy.home}>carwyn.sec</Link>
      <div className="header-controls">
        <LanguageSelector locale={locale} />
        <button ref={trigger} className="menu-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-index" data-cursor="open" onClick={() => setOpen(true)}>{copy.menu}<span aria-hidden="true"> +</span></button>
      </div>
    </header>
    <dialog ref={dialog} id="site-index" className="site-index" aria-labelledby="index-title"
      onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
      <div className="index-topline"><h2 id="index-title" className="system-label">{copy.navigation}</h2>
        <div className="header-controls"><LanguageSelector locale={locale} onNavigate={() => setOpen(false)} /><button type="button" className="menu-trigger" onClick={() => setOpen(false)}>{copy.close}<span aria-hidden="true"> ×</span></button></div>
      </div>
      <nav aria-label={copy.navigation} className="index-links">
        {sectionIds.map((id, index) => {
          const exists = available.includes(id) || (publicPath(pathname).startsWith("/operations/") && ["identity", "expertise", "operations"].includes(id));
          return <Link key={id} href={`${home}#${id}`} aria-disabled={!exists} aria-describedby={!exists ? "index-availability" : undefined}
            aria-current={active === id ? "location" : undefined} onClick={(event) => {
              if (!exists) { event.preventDefault(); return; }
              if (publicPath(pathname) !== "/") { setOpen(false); return; }
              event.preventDefault();
              const destination = document.getElementById(id);
              setOpen(false);
              cancelAnimationFrame(navigationFrame.current);
              navigationFrame.current = requestAnimationFrame(() => {
                if (!destination) return;
                history.pushState(null, "", `#${id}`);
                destination.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
                if (!destination.hasAttribute("tabindex")) destination.setAttribute("tabindex", "-1");
                destination.focus({ preventScroll: true });
              });
            }}><span className="index-number">{String(index + 1).padStart(2, "0")}</span><span>{copy.labels[index]}</span></Link>;
        })}
      </nav>
      {available.length < sectionIds.length && <p id="index-availability" className="index-note">{copy.unavailable}</p>}
    </dialog>
    <aside className="system-status" aria-label={copy.system}>
      <StatusIndicator state="active"><span className="status-desktop">{copy.online}</span><span className="status-mobile">{copy.compactOnline}</span></StatusIndicator>
      <span className="status-location">{copy.location}</span>
      <span className="status-section">{String(activeIndex + 1).padStart(2, "0")} / {activeIndex < 0 ? copy.system : copy.labels[activeIndex]}</span>
    </aside>
  </>;
}
