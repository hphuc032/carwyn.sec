import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/locales";
import { DesignSystemPreview } from "@/dev/design-system/DesignSystemPreview";

export const metadata: Metadata = {
  title: "Design System — Development specimen",
  robots: { index: false, follow: false },
};

// This filename is recognized only by next dev, never by the production build.
export default async function DesignSystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DesignSystemPreview locale={locale} />;
}
