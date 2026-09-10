import type { Metadata } from "next";
import { headers } from "next/headers";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { editorialFont, technicalFont } from "@/styles/fonts";
import "@/styles/globals.css";

async function requestLocale() {
  return (await headers()).get("x-carwyn-locale") === "vi" ? "vi" : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  return {
    title: locale === "vi" ? "Không tìm thấy trang — carwyn.sec" : "Page not found — carwyn.sec",
    description: locale === "vi" ? "Trang được yêu cầu không tồn tại hoặc chưa được công bố." : "The requested page is unavailable or has not been published.",
    robots: { index: false, follow: false },
  };
}

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  return <html lang={locale} className={`dark ${editorialFont.variable} ${technicalFont.variable}`}>
    <body>
      <NotFoundContent locale={locale} />
    </body>
  </html>;
}
