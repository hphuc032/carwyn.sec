import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { isStaticExport, publicRoutePath } from "@/lib/deployment-path";

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string };

/** Uses Next navigation normally and reliable document navigation on plain static hosts. */
export function DeploymentLink({ href, prefetch, replace, scroll, shallow, locale, onNavigate, ...props }: Props) {
  if (isStaticExport) return <a href={publicRoutePath(href)} {...props} />;
  const nextProps = {
    href,
    ...(prefetch !== undefined ? { prefetch } : {}),
    ...(replace !== undefined ? { replace } : {}),
    ...(scroll !== undefined ? { scroll } : {}),
    ...(shallow !== undefined ? { shallow } : {}),
    ...(locale !== undefined ? { locale } : {}),
    ...(onNavigate !== undefined ? { onNavigate } : {}),
    ...props,
  };
  return <Link {...nextProps} />;
}
