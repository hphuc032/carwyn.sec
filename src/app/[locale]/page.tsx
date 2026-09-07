import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";

export default async function FoundationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-site p-6 sm:p-12">
      <h1 className="text-heading font-semibold">carwyn.sec</h1>
      <p className="mt-4 text-secondary">{dictionary.foundation}</p>
    </main>
  );
}
