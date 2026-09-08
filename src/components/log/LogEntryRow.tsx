import Link from "next/link";
import { formatLogDate, getSecurityLogReadingTime } from "@/data/security-log";
import { logArticlePath } from "@/data/security-log-publication";
import type { Locale } from "@/i18n/locales";
import type { SecurityLogEntry } from "@/types/content";

export function LogEntryRow({ entry, locale, headingLevel = "h2" }: { entry: SecurityLogEntry; locale: Locale; headingLevel?: "h2" | "h3" }) {
  const content = entry.content[locale]!.value;
  const category = entry.category[locale]!.value;
  const minutes = getSecurityLogReadingTime(entry.slug, locale);
  const Heading = headingLevel;
  return <li className="log-entry">
    <Link className="log-entry-link" href={logArticlePath(entry.slug, locale)} data-cursor="open">
      <span className="log-entry-id">LOG_{entry.logNumber}</span>
      <div className="log-entry-copy"><Heading>{content.title}</Heading><p>{content.excerpt}</p></div>
      <div className="log-entry-meta">
        <span>{category}</span>
        {minutes && <span>{minutes} {locale === "vi" ? "phút đọc" : minutes === 1 ? "min read" : "min read"}</span>}
        {entry.publishedAt && <time dateTime={entry.publishedAt.value}>{formatLogDate(entry.publishedAt.value, locale)}</time>}
      </div>
      <span className="log-entry-action">{locale === "vi" ? "ĐỌC LOG" : "READ LOG"}<span aria-hidden="true"> →</span></span>
    </Link>
  </li>;
}
