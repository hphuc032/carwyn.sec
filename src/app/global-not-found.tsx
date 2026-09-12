import type { Metadata } from "next";
import { BilingualNotFoundContent } from "@/components/layout/NotFoundContent";
import { editorialFont, technicalFont } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Page not found — carwyn.sec",
  description: "The requested page is unavailable or has not been published.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const localeScript = `if (/(?:^|\\/)vi(?:\\/|$)/.test(location.pathname)) { document.documentElement.lang = "vi"; document.title = "Không tìm thấy trang — carwyn.sec"; }`;
  return <html lang="en" suppressHydrationWarning className={`dark ${editorialFont.variable} ${technicalFont.variable}`}>
    <head><script dangerouslySetInnerHTML={{ __html: localeScript }} /></head>
    <body>
      <BilingualNotFoundContent />
    </body>
  </html>;
}
