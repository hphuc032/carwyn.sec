import type { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"button"> & { variant?: "solid" | "outline" };
export function Button({ type = "button", variant = "outline", className = "", ...props }: Props) {
  return <button type={type} className={`button button-${variant} ${className}`} {...props} />;
}
