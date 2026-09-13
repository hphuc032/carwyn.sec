import { DeploymentLink } from "@/components/ui/DeploymentLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextLink } from "@/components/ui/TextLink";
import { ProjectVisual } from "@/components/operations/ProjectVisual";
import { publishedProjects } from "@/data/projects";
import { casePath, isPublishedCase } from "@/data/project-publication";
import { socialLink } from "@/data/contact";
import type { Locale } from "@/i18n/locales";
import { LiquidLight } from "@/components/motion/LiquidLight";

export function Operations({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const githubProfile = socialLink("github").url;
  return <section id="operations" className="operations" aria-labelledby="operations-title" tabIndex={-1} data-liquid="0.7">
    <LiquidLight />
    <div className="operations-inner">
      <SectionLabel number="04">{vi ? "Dự án tiêu biểu" : "Selected Operations"}</SectionLabel>
      <div className="operations-intro"><h2 id="operations-title">{vi ? "Từ thực hành đến dự án." : "Practice, in projects."}</h2><p>{vi ? "Ba dự án. Ba góc nhìn về bảo mật." : "Three projects. Three perspectives on security."}</p></div>
      <ol className="operations-list">
        {publishedProjects(locale).map(project => {
          const copy = project.content[locale]!.value;
          const ready = isPublishedCase(project.slug, locale) && project.caseStudyState === "published";
          const body = <><span className="operation-index">CASE {project.caseNumber}</span><div className="operation-copy"><h3 lang="en"><span className="record-reveal" data-reveal="record" data-reveal-key={`case-${project.id}`}>{copy.title}</span></h3><p className="operation-category">{project.category?.[locale]?.value}</p><p className="operation-summary">{copy.summary}</p></div><span className="operation-arrow" aria-hidden="true">↗</span></>;
          return <li key={project.id} className="operation-row">
            {ready ? <DeploymentLink className="operation-link" href={casePath(project.slug, locale)} prefetch={false} data-cursor="view"><span className="sr-only">{vi ? "Xem bài viết dự án: " : "View case study: "}</span>{body}</DeploymentLink> : <div className="operation-link">{body}</div>}
            <div className="operation-preview"><ProjectVisual project={project} locale={locale} /></div>
          </li>;
        })}
      </ol>
      <div className="operations-end"><span>{vi ? "Tiếp tục khám phá" : "Beyond this selection"}</span><TextLink href={githubProfile} variant="editorial" arrow="right">{vi ? "XEM THÊM TRÊN GITHUB" : "VIEW MORE ON GITHUB"}</TextLink></div>
    </div>
  </section>;
}
