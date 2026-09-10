import { SectionLabel } from "@/components/ui/SectionLabel";
import { TerminalConsole } from "@/components/terminal/TerminalConsole";
import type { TerminalContent, TerminalResponse } from "@/components/terminal/types";
import { publishedAchievements } from "@/data/achievements";
import { publicCv, socialLinks } from "@/data/contact";
import { expertise } from "@/data/expertise";
import { experience } from "@/data/experience";
import { casePath } from "@/data/project-publication";
import { profile } from "@/data/profile";
import { publishedProjects } from "@/data/projects";
import { publishedSecurityLogs } from "@/data/security-log";
import { logArticlePath, logIndexPath } from "@/data/security-log-publication";
import type { Locale } from "@/i18n/locales";
import { LiquidLight } from "@/components/motion/LiquidLight";

const labels = {
  en: {
    section: "Terminal", mode: "Local command map", heading: "Ask the portfolio directly.",
    intro: "A small, predefined interface into the published record.", ready: "INTERFACE READY", consoleLabel: "CARWYN.SEC / LOCAL INTERFACE",
    instruction: 'Type "help" to list the available commands.', input: "Enter a portfolio command", output: "Terminal output history",
    available: "Available commands", invalid: "command not found", hint: 'type "help" for available commands', cleared: "Terminal history cleared.",
    actions: { operations: "OPEN SELECTED OPERATIONS", experience: "OPEN EXPERIENCE", achievements: "OPEN ACHIEVEMENTS", logs: "OPEN SECURITY LOG", contact: "OPEN CONTACT" },
    status: { "core-team": "Core Team", participated: "Qualifying round participant", "top-4": "Top 4", recognized: "Recognized", "in-progress": "In progress", completed: "Completed" },
    contact: "Public contact channels", unavailable: "No published records.", identityField: "Information Security / Cyber Security", identityLocation: "Vietnam",
    descriptions: {
      help: "list available commands", whoami: "show the identity behind carwyn.sec", skills: "show published capability groups",
      projects: "show selected operations", experience: "show published work records", achievements: "show published achievement records",
      logs: "show published Security Log entries", contact: "check contact availability", clear: "clear this terminal history",
    },
  },
  vi: {
    section: "Terminal", mode: "Bản đồ lệnh cục bộ", heading: "Hỏi trực tiếp portfolio.",
    intro: "Một giao diện nhỏ, định sẵn để xem các nội dung đã công bố.", ready: "GIAO DIỆN SẴN SÀNG", consoleLabel: "CARWYN.SEC / GIAO DIỆN CỤC BỘ",
    instruction: 'Nhập "help" để xem các lệnh hiện có.', input: "Nhập lệnh portfolio", output: "Lịch sử đầu ra terminal",
    available: "Các lệnh hiện có", invalid: "không tìm thấy lệnh", hint: 'nhập "help" để xem các lệnh hiện có', cleared: "Đã xóa lịch sử terminal.",
    actions: { operations: "MỞ DỰ ÁN TIÊU BIỂU", experience: "MỞ KINH NGHIỆM", achievements: "MỞ THÀNH TỰU", logs: "MỞ SECURITY LOG", contact: "MỞ LIÊN HỆ" },
    status: { "core-team": "Core Team", participated: "Tham dự vòng sơ khảo", "top-4": "Top 4", recognized: "Được ghi nhận", "in-progress": "Đang học", completed: "Hoàn thành" },
    contact: "Các kênh liên hệ công khai", unavailable: "Chưa có nội dung công khai.", identityField: "An toàn thông tin / Cyber Security", identityLocation: "Việt Nam",
    descriptions: {
      help: "liệt kê các lệnh hiện có", whoami: "hiển thị danh tính phía sau carwyn.sec", skills: "hiển thị các nhóm năng lực đã công bố",
      projects: "hiển thị các dự án tiêu biểu", experience: "hiển thị kinh nghiệm đã công bố", achievements: "hiển thị thành tựu đã công bố",
      logs: "hiển thị các bài Security Log đã công bố", contact: "kiểm tra trạng thái phần liên hệ", clear: "xóa lịch sử terminal này",
    },
  },
} as const;

export function Terminal({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const home = locale === "vi" ? "/vi" : "/";
  const skills = expertise.filter(item => item.state === "published").map(item => ({ label: item.content[locale].value.title, detail: item.toolIds.join(" / ") }));
  const projectEntries = publishedProjects(locale).map(project => {
    const detail = project.category?.[locale]?.value;
    return { label: project.content[locale]!.value.title, href: casePath(project.slug, locale), ...(detail ? { detail } : {}) };
  });
  const experienceEntries = experience.filter(record => record.state === "published" && record.content[locale]?.state === "published").toSorted((a, b) => a.order - b.order).map(record => {
    const content = record.content[locale]!.value;
    if (!content.role) throw new Error(`Published experience ${record.id} requires a ${locale} role for Terminal.`);
    const location = locale === "vi" && record.location === "Phu Nhuan" ? "Phú Nhuận" : record.location;
    return { label: record.organization ?? content.role, detail: [record.organization ? content.role : undefined, location].filter(Boolean).join(" / ") };
  });
  const achievementEntries = publishedAchievements(locale).map(record => {
    const content = record.content[locale]!.value;
    const label = record.category === "community" && record.organization ? record.organization : content.title;
    const detail = record.category === "community" ? copy.status[record.status]
      : [content.descriptor, copy.status[record.status]].filter((part, index, parts) => part && parts.indexOf(part) === index).join(" / ");
    return { label, detail };
  });
  const logEntries = publishedSecurityLogs(locale).map(entry => ({ label: entry.content[locale]!.value.title, detail: `LOG_${entry.logNumber}`, href: logArticlePath(entry.slug, locale) }));
  const contactLines = [...socialLinks.map(link => `${link.kind === "email" ? "Email" : link.kind === "github" ? "GitHub" : "LinkedIn"}: ${link.label}`), `CV: ${publicCv.label}`];
  const response = (value: Omit<TerminalResponse, "announcement">): TerminalResponse => ({ ...value, announcement: value.heading ?? value.lines?.[0] ?? value.entries?.[0]?.label ?? copy.unavailable });
  const content: TerminalContent = {
    prompt: "carwyn@sec:~$", ready: copy.ready, consoleLabel: copy.consoleLabel, instruction: copy.instruction, inputLabel: copy.input, outputLabel: copy.output,
    commandDescriptions: copy.descriptions, availableHeading: copy.available, invalidPrefix: copy.invalid,
    invalidHint: copy.hint, clearedAnnouncement: copy.cleared,
    responses: {
      whoami: response({ lines: [profile.name, profile.brand, copy.identityField, copy.identityLocation] }),
      skills: response({ heading: copy.descriptions.skills, entries: skills }),
      projects: response({ heading: copy.descriptions.projects, entries: projectEntries, action: { label: copy.actions.operations, href: `${home}#operations` } }),
      experience: response({ heading: copy.descriptions.experience, entries: experienceEntries, action: { label: copy.actions.experience, href: `${home}#experience` } }),
      achievements: response({ heading: copy.descriptions.achievements, entries: achievementEntries, action: { label: copy.actions.achievements, href: `${home}#achievements` } }),
      logs: response({ heading: copy.descriptions.logs, entries: logEntries, action: { label: copy.actions.logs, href: logIndexPath(locale) } }),
      contact: response({ heading: copy.contact, lines: contactLines, action: { label: copy.actions.contact, href: `${home}#contact` } }),
    },
  };

  return <section id="terminal" className="terminal-section" aria-labelledby="terminal-title" tabIndex={-1} data-liquid="0.45">
    <LiquidLight />
    <div className="terminal-inner">
      <div className="terminal-topline"><SectionLabel number="08">{copy.section}</SectionLabel><span>{copy.mode}</span></div>
      <div className="terminal-intro"><h2 id="terminal-title" data-reveal="chapter" data-reveal-key="terminal">{copy.heading}</h2><p>{copy.intro}</p></div>
      <TerminalConsole content={content} />
      <noscript><style>{`.terminal-console{display:none}`}</style><div className="terminal-noscript"><p>{copy.instruction}</p><ul>{Object.keys(copy.descriptions).map(command => <li key={command}>{command}</li>)}</ul></div></noscript>
    </div>
  </section>;
}
