import Link from "next/link";

export default async function NotFound() {
  return <main id="main-content" tabIndex={-1} className="not-found">
    <div className="not-found-inner not-found-en" lang="en">
      <p>ERROR / 404</p>
      <h1>Page not found.</h1>
      <p>The requested page is unavailable or has not been published.</p>
      <Link href="/">Return to carwyn.sec</Link>
    </div>
    <div className="not-found-inner not-found-vi" lang="vi">
      <p>LỖI / 404</p>
      <h1>Không tìm thấy trang.</h1>
      <p>Trang bạn yêu cầu không tồn tại hoặc chưa được công bố.</p>
      <Link href="/vi">Quay lại carwyn.sec</Link>
    </div>
  </main>;
}
