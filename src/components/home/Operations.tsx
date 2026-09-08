import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { ProjectVisual } from "@/components/operations/ProjectVisual";
import { publishedProjects, githubProfile } from "@/data/projects";
import { casePath, isPublishedCase } from "@/data/project-publication";
import type { Locale } from "@/i18n/locales";

export function Operations({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return <section id="operations" className="operations" aria-labelledby="operations-title" tabIndex={-1}>
    <div className="operations-inner">
      <SectionLabel number="04">{vi ? "Dự án tiêu biểu" : "Selected Operations"}</SectionLabel>
      <div className="operations-intro"><h2 id="operations-title">{vi ? "Từ thực hành đến dự án." : "Practice, in projects."}</h2><p>{vi ? "Ba dự án. Ba góc nhìn về bảo mật." : "Three projects. Three perspectives on security."}</p></div>
      <ol className="operations-list">
        {publishedProjects(locale).map(project => {
          const copy = project.content[locale]!.value;
          const ready = isPublishedCase(project.slug, locale) && project.caseStudyState === "published";
          const body = <><span className="operation-index">CASE {project.caseNumber}</span><div className="operation-copy"><h3 lang="en">{copy.title}</h3><p className="operation-category">{project.category?.[locale]?.value}</p><p className="operation-summary">{copy.summary}</p></div><span className="operation-arrow" aria-hidden="true">↗</span></>;
          return <li key={project.id} className="operation-row">
            {ready ? <Link className="operation-link" href={casePath(project.slug, locale)} prefetch={false} data-cursor="view" aria-label={`${vi ? "Xem dự án" : "View case"} ${project.caseNumber}: ${copy.title}`}>{body}</Link> : <div className="operation-link">{body}</div>}
            <div className="operation-preview"><ProjectVisual project={project} locale={locale} /></div>
          </li>;
        })}
      </ol>
      <div className="operations-end"><span>{vi ? "Tiếp tục khám phá" : "Beyond this selection"}</span><TextLink href={githubProfile} variant="editorial" arrow="right">{vi ? "XEM THÊM TRÊN GITHUB" : "VIEW MORE ON GITHUB"}</TextLink></div>
    </div>
  </section>;
}
