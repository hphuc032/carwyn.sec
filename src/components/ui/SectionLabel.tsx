import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"p"> & { number: string };
export function SectionLabel({ number, children, className = "", ...props }: Props) {
  return <p className={`section-label ${className}`} {...props}>
    <span className="section-number">{number}</span>
    <span aria-hidden="true"> / </span><span>{children}</span>
  </p>;
}
