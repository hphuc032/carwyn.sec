import { SectionLabel } from "@/components/ui/SectionLabel";
import { publishedAchievements } from "@/data/achievements";
import type { Locale } from "@/i18n/locales";
import type { Achievement } from "@/types/content";

const categoryOrder: readonly Achievement["category"][] = ["community", "competition", "recognition", "certification"];
const labels = {
  en: {
    section: "Achievements", count: "02 published records", heading: "Progress, on record.",
    intro: "Community work. Current study. A record of movement.", status: "Status",
    categories: { community: "Community", competition: "Competitions", recognition: "Recognition", certification: "Certifications" },
    states: { "core-team": "Core Team", participated: "Participated", "top-4": "Top 4", recognized: "Recognized", "in-progress": "In progress", completed: "Completed" },
  },
  vi: {
    section: "Thành tựu", count: "02 hồ sơ công khai", heading: "Tiến trình, được ghi nhận.",
    intro: "Hoạt động cộng đồng. Quá trình học. Những bước tiến đang tiếp diễn.", status: "Trạng thái",
    categories: { community: "Cộng đồng", competition: "Cuộc thi", recognition: "Ghi nhận", certification: "Chứng chỉ" },
    states: { "core-team": "Core Team", participated: "Đã tham gia", "top-4": "Top 4", recognized: "Được ghi nhận", "in-progress": "Đang học", completed: "Hoàn thành" },
  },
} as const;

export function Achievements({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const records = publishedAchievements(locale);
  const groups = categoryOrder.map(category => ({ category, records: records.filter(record => record.category === category) })).filter(group => group.records.length > 0);

  return <section id="achievements" className="achievements" aria-labelledby="achievements-title" tabIndex={-1}>
    <div className="achievements-inner">
      <div className="achievements-topline"><SectionLabel number="06">{copy.section}</SectionLabel><span>{copy.count}</span></div>
      <div className="achievements-intro"><h2 id="achievements-title">{copy.heading}</h2><p>{copy.intro}</p></div>
      <div className="achievement-groups">
        {groups.map(group => <section className="achievement-group" aria-labelledby={`achievement-${group.category}`} key={group.category}>
          <header className="achievement-group-heading"><h3 id={`achievement-${group.category}`}>{copy.categories[group.category]}</h3><span>{String(group.records.length).padStart(2, "0")}</span></header>
          <ol>
            {group.records.map(record => {
              const content = record.content[locale]!.value;
              return <li className="achievement-record" data-status={record.status} key={record.id}>
                <span className="achievement-index">{String(record.order).padStart(3, "0")}</span>
                <div className="achievement-primary">
                  <h4>{record.organization ?? content.title}</h4>
                  <p className="achievement-descriptor">{record.organization ? content.title : content.descriptor}</p>
                  {content.detail && <p className="achievement-detail">{content.detail}</p>}
                </div>
                <p className="achievement-status"><span>{copy.status}</span><strong>{copy.states[record.status]}</strong></p>
              </li>;
            })}
          </ol>
        </section>)}
      </div>
    </div>
  </section>;
}
