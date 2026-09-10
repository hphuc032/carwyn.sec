"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { getInitializationState, getServerInitializationState, subscribeInitialization } from "@/lib/initialization-state";
import { useReducedMotion } from "@/hooks/use-motion-preference";
import type { Locale } from "@/i18n/locales";

const NetworkCanvas = dynamic(() => import("./NetworkCanvas").catch(() => ({ default: () => null })), { ssr: false });
class NetworkBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function NetworkSphere({ children, locale }: { children: ReactNode; locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const initialization = useSyncExternalStore(subscribeInitialization, getInitializationState, getServerInitializationState);
  const [eligible, setEligible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [requested, setRequested] = useState(false);
  const onReady = useCallback((value: boolean) => setReady(value), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const check = () => setEligible(media.matches && !connection?.saveData);
    check(); media.addEventListener("change", check);
    return () => media.removeEventListener("change", check);
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: .05 });
    observer.observe(element);
    const visibility = () => setHidden(document.hidden);
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (initialization !== "ready" || !eligible || reduced || !visible || hidden || requested || failed) return;
    // Defer enhancement; the complete SVG/heading has already been painted.
    const timer = window.setTimeout(() => {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
      if (!gl) { onFailure(); return; }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      setRequested(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [initialization, eligible, reduced, visible, hidden, requested, failed, onFailure]);
  const enhanced = requested && eligible && !reduced && !failed;
  return <div ref={root} className="network-object" data-network-mode={enhanced && ready ? "webgl" : "static"}>
    <div className="network-stage" aria-hidden="true">
      {children}
      {enhanced && <NetworkBoundary onFailure={onFailure}><NetworkCanvas active={visible && !hidden && !paused} onReady={onReady} onFailure={onFailure} /></NetworkBoundary>}
    </div>
    {enhanced && ready && <button className="network-pause" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
      {locale === "en" ? (paused ? "RESUME MOTION" : "PAUSE MOTION") : (paused ? "TIẾP TỤC CHUYỂN ĐỘNG" : "DỪNG CHUYỂN ĐỘNG")}
    </button>}
  </div>;
}
