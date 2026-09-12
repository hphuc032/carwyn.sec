import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocaleDocument } from "@/components/layout/LocaleDocument";
import { rootMetadata } from "@/lib/site-metadata";
import { isLocale, locales } from "@/i18n/locales";
import "@/styles/globals.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return rootMetadata(locale);
}

export function generateStaticParams() {
  const generatedLocales = process.env.DEPLOY_TARGET === "github-pages" ? (["vi"] as const) : locales;
  return generatedLocales.map(locale => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocaleDocument locale={locale}>{children}</LocaleDocument>;
}
