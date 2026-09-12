import { DeploymentLink } from "@/components/ui/DeploymentLink";
import type { Locale } from "@/i18n/locales";

export function NotFoundContent({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return <main id="main-content" tabIndex={-1} className="not-found">
    <div className="not-found-inner">
      <p>{vi ? "LỖI / 404" : "ERROR / 404"}</p>
      <h1>{vi ? "Không tìm thấy trang." : "Page not found."}</h1>
      <p>{vi ? "Trang bạn yêu cầu không tồn tại hoặc chưa được công bố." : "The requested page is unavailable or has not been published."}</p>
      <DeploymentLink href={vi ? "/vi" : "/"}>{vi ? "Quay lại carwyn.sec" : "Return to carwyn.sec"}</DeploymentLink>
    </div>
  </main>;
}

export function BilingualNotFoundContent() {
  return <main id="main-content" tabIndex={-1} className="not-found">
    <div className="not-found-inner not-found-en" lang="en">
      <p>ERROR / 404</p>
      <h1>Page not found.</h1>
      <p>The requested page is unavailable or has not been published.</p>
      <DeploymentLink href="/">Return to carwyn.sec</DeploymentLink>
    </div>
    <div className="not-found-inner not-found-vi" lang="vi">
      <p>LỖI / 404</p>
      <h1>Không tìm thấy trang.</h1>
      <p>Trang bạn yêu cầu không tồn tại hoặc chưa được công bố.</p>
      <DeploymentLink href="/vi">Quay lại carwyn.sec</DeploymentLink>
    </div>
  </main>;
}
