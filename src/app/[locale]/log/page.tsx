import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SecurityLogIndex } from "@/components/log/SecurityLogIndex";
import { isLocale } from "@/i18n/locales";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: { absolute: "Security Log — carwyn.sec" },
    description: locale === "vi" ? "Ghi chép kỹ thuật và bài lab an toàn thông tin của carwyn.sec." : "Technical field notes and information-security labs from carwyn.sec.",
  };
}

export default async function LogIndexPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SecurityLogIndex locale={locale} />;
}
