import { LogEntryRow } from "@/components/log/LogEntryRow";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { publishedSecurityLogs } from "@/data/security-log";
import { logIndexPath } from "@/data/security-log-publication";
import type { Locale } from "@/i18n/locales";

export function SecurityLog({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const entries = publishedSecurityLogs(locale);
  return <section id="log" className="security-log" aria-labelledby="security-log-title" tabIndex={-1}>
    <div className="security-log-inner">
      <div className="security-log-topline"><SectionLabel number="07">Security Log</SectionLabel><span>{vi ? "01 ghi chép công khai" : "01 published note"}</span></div>
      <div className="security-log-intro"><h2 id="security-log-title">{vi ? "Mở sổ ghi chép kỹ thuật." : "Open the technical notebook."}</h2><p>{vi ? "Ghi chép thực hành, giới hạn bằng chứng và những điều rút ra trong quá trình học." : "Practice notes, evidence boundaries, and lessons from technical study."}</p></div>
      <ol className="security-log-list">{entries.map(entry => <LogEntryRow key={entry.id} entry={entry} locale={locale} headingLevel="h3" />)}</ol>
      <div className="security-log-end"><span>{vi ? "Kho lưu trữ kỹ thuật" : "Technical archive"}</span><TextLink href={logIndexPath(locale)} variant="editorial" arrow="right" prefetch={false}>{vi ? "XEM SECURITY LOG" : "VIEW SECURITY LOG"}</TextLink></div>
    </div>
  </section>;
}
