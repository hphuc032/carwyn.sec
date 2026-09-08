import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & { width?: "content" | "wide" | "reading" };

export function Container({ width = "content", className = "", ...props }: ContainerProps) {
  return <div className={`content-container container-${width} ${className}`} {...props} />;
}

/** Use outside Container; nest a Container to realign inner content. */
export function FullBleed({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={`full-bleed ${className}`} {...props} />;
}

/** Children choose spans; this primitive owns only columns and gaps. */
export function EditorialGrid({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={`editorial-grid ${className}`} {...props} />;
}
