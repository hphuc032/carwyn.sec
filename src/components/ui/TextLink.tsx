import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "target" | "rel"> & {
  href: string;
  variant?: "text" | "navigation" | "editorial";
  arrow?: "right" | "external";
} & ({ newTab: true; newTabLabel: string } | { newTab?: false; newTabLabel?: never });

export function TextLink({ href, variant = "text", arrow, newTab = false, newTabLabel, children, className = "", ...props }: Props) {
  const content = <>
    <span>{children}</span>
    {arrow && <span className="link-arrow" aria-hidden="true">{arrow === "right" ? "→" : "↗"}</span>}
    {newTab && <span className="sr-only"> ({newTabLabel})</span>}
  </>;
  const linkProps = {
    ...props, className: `text-link link-${variant} ${className}`,
    target: newTab ? "_blank" : undefined, rel: newTab ? "noopener noreferrer" : undefined,
  };
  if (href.startsWith("/") && !href.startsWith("//")) return <Link href={href} {...linkProps}>{content}</Link>;
  return <a href={href} {...linkProps}>{content}</a>;
}
