import { SectionLabel } from "@/components/ui/SectionLabel";
import { publicCv, socialLink } from "@/data/contact";
import type { Locale } from "@/i18n/locales";
import { publicAssetPath } from "@/lib/deployment-path";

const labels = {
  en: {
    section: "Contact", channel: "Public channels", heading: "LET'S CONNECT.",
    intro: "Public contact points for projects, technical conversations, and professional enquiries.",
    names: { email: "Email", github: "GitHub", linkedin: "LinkedIn", cv: "CV / Resume" },
    actions: { email: "WRITE", github: "VISIT", linkedin: "CONNECT", cv: "VIEW PDF" },
    newTab: "opens in a new tab",
  },
  vi: {
    section: "Liên hệ", channel: "Kênh công khai", heading: "LET'S CONNECT.",
    intro: "Các kênh liên hệ công khai dành cho dự án, trao đổi kỹ thuật và cơ hội nghề nghiệp.",
    names: { email: "Email", github: "GitHub", linkedin: "LinkedIn", cv: "CV / Hồ sơ" },
    actions: { email: "GỬI THƯ", github: "TRUY CẬP", linkedin: "KẾT NỐI", cv: "XEM PDF" },
    newTab: "mở trong thẻ mới",
  },
} as const;

export function Contact({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const methods = [
    { id: "email", link: socialLink("email"), newTab: false },
    { id: "github", link: socialLink("github"), newTab: true },
    { id: "linkedin", link: socialLink("linkedin"), newTab: true },
    { id: "cv", link: publicCv, newTab: true },
  ] as const;

  return <section id="contact" className="contact" aria-labelledby="contact-title" tabIndex={-1}>
    <div className="contact-inner">
      <div className="contact-topline"><SectionLabel number="09">{copy.section}</SectionLabel><span>{copy.channel}</span></div>
      <div className="contact-opening">
        <h2 id="contact-title" lang="en" aria-label={copy.heading} data-arrival="conclusion"><span>LET&apos;S</span><span>CONNECT.</span></h2>
        <p>{copy.intro}</p>
      </div>
      <address className="contact-address">
        <ol className="contact-list">
          {methods.map((method, index) => <li key={method.id} className="contact-record">
            <span className="contact-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="contact-kind">{copy.names[method.id]}</span>
            <a href={method.link.url.startsWith("/") ? publicAssetPath(method.link.url) : method.link.url} data-cursor="open" {...(method.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <span className="contact-value">{method.link.label}</span>
              <span className="contact-action">{copy.actions[method.id]} <span aria-hidden="true">{method.newTab ? "↗" : "→"}</span></span>
              {method.newTab && <span className="sr-only"> ({copy.newTab})</span>}
            </a>
          </li>)}
        </ol>
      </address>
    </div>
  </section>;
}
