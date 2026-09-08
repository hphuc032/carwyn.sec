import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"span"> & { state?: "active" | "neutral" | "warning" | "in-progress" };
/** Supply a visible state label. Static by default; no unnecessary live region. */
export function StatusIndicator({ state = "neutral", children, className = "", ...props }: Props) {
  return <span className={`status-indicator status-${state} ${className}`} {...props}>
    <span className="status-mark" aria-hidden="true" /><span>{children}</span>
  </span>;
}
