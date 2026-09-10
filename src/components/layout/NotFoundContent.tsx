import Link from "next/link";
import type { Locale } from "@/i18n/locales";

export function NotFoundContent({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return <main id="main-content" tabIndex={-1} className="not-found">
    <div className="not-found-inner">
      <p>{vi ? "LỖI / 404" : "ERROR / 404"}</p>
      <h1>{vi ? "Không tìm thấy trang." : "Page not found."}</h1>
      <p>{vi ? "Trang bạn yêu cầu không tồn tại hoặc chưa được công bố." : "The requested page is unavailable or has not been published."}</p>
      <Link href={vi ? "/vi" : "/"}>{vi ? "Quay lại carwyn.sec" : "Return to carwyn.sec"}</Link>
    </div>
  </main>;
}
