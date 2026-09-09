import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import type { Locale } from "@/i18n/locales";

const labels = {
  en: { section: "End System", status: "All systems operational", back: "Back to top", copyright: "carwyn.sec © 2026" },
  vi: { section: "Kết thúc hệ thống", status: "Mọi hệ thống hoạt động ổn định", back: "Về đầu trang", copyright: "carwyn.sec © 2026" },
} as const;

export function EndSystem({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  return <footer id="end-system" className="end-system" aria-labelledby="end-system-title">
    <div className="end-system-inner">
      <div className="end-system-topline"><SectionLabel number="10">{copy.section}</SectionLabel><StatusIndicator state="active">{copy.status}</StatusIndicator></div>
      <div className="end-system-closing">
        <p id="end-system-title">carwyn.sec</p>
        <a href="#hero">{copy.back} <span aria-hidden="true">↑</span></a>
      </div>
      <p className="end-system-copyright">{copy.copyright}</p>
    </div>
  </footer>;
}
