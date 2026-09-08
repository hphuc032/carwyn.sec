"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/i18n/locales";

/** Local specimen behavior only. No application state or portfolio actions. */
export function PreviewActions({ locale }: { locale: Locale }) {
  const [count, setCount] = useState(0);
  const vi = locale === "vi";
  return <>
    <div className="specimen-actions">
      <Button variant="solid" onClick={() => setCount((value) => value + 1)}>{vi ? "Thử thao tác" : "Test action"}</Button>
      <Button onClick={() => setCount(0)}>{vi ? "Đặt lại" : "Reset"}</Button>
      <Button disabled>{vi ? "Chưa khả dụng" : "Unavailable"}</Button>
    </div>
    <p className="specimen-feedback" role="status">{vi ? "Số lần thử" : "Action count"}: {count}</p>
  </>;
}

type ShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };

export function FontDiagnostics() {
  const [ready, setReady] = useState(false);
  const [shift, setShift] = useState(0);
  useEffect(() => {
    let mounted = true;
    let total = 0;
    void document.fonts.ready.then(() => { if (mounted) setReady(true); });
    const observer = PerformanceObserver.supportedEntryTypes.includes("layout-shift")
      ? new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as ShiftEntry[]) {
          if (!entry.hadRecentInput) total += entry.value;
        }
        if (mounted) setShift(total);
      }) : undefined;
    observer?.observe({ type: "layout-shift", buffered: true });
    return () => { mounted = false; observer?.disconnect(); };
  }, []);
  return <p className="specimen-font-report" data-font-ready={ready} data-layout-shift={shift}>
    {ready ? "FONTS READY" : "CHECKING FONTS"} / LOAD SHIFT {shift.toFixed(4)}
  </p>;
}
