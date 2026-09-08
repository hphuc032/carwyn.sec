import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { SystemLabel } from "./SystemLabel";

export function Metadata({ className = "", ...props }: ComponentPropsWithoutRef<"dl">) {
  return <dl className={`metadata ${className}`} {...props} />;
}
export function MetadataItem({ label, children }: { label: ReactNode; children: ReactNode }) {
  return <div className="metadata-item"><dt><SystemLabel>{label}</SystemLabel></dt><dd>{children}</dd></div>;
}
