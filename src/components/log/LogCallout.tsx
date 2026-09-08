import type { ReactNode } from "react";

export function LogCallout({ label, children }: { label: string; children: ReactNode }) {
  return <aside className="log-callout" aria-label={label}><strong>{label}</strong><div>{children}</div></aside>;
}
