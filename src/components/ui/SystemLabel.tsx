import type { ComponentPropsWithoutRef } from "react";

export function SystemLabel({ className = "", ...props }: ComponentPropsWithoutRef<"span">) {
  return <span className={`system-label ${className}`} {...props} />;
}
