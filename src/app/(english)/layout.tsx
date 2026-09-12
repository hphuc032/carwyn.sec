import type { Metadata } from "next";
import { LocaleDocument } from "@/components/layout/LocaleDocument";
import { rootMetadata } from "@/lib/site-metadata";
import "@/styles/globals.css";

export function generateMetadata(): Metadata {
  return rootMetadata("en");
}

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LocaleDocument locale="en">{children}</LocaleDocument>;
}
