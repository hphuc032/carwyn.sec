import type { ComponentPropsWithoutRef } from "react";

export function Divider({ className = "", ...props }: ComponentPropsWithoutRef<"hr">) {
  return <hr className={`divider ${className}`} {...props} />;
}
