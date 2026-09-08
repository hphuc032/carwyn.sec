import type { Project } from "@/types/content";
import type { Locale } from "@/i18n/locales";

/** Abstract concept artwork only: no topology, measurements, packets or findings. */
export function ProjectVisual({ project, locale }: { project: Project; locale: Locale }) {
  const concept = project.visualConcept ?? "access";
  return <figure className={`project-visual visual-${concept}`}>
    <svg viewBox="0 0 600 400" fill="none" aria-hidden="true" focusable="false">
      <path d="M32 32h32M32 32v32M568 32h-32M568 32v32M32 368h32M32 368v-32M568 368h-32M568 368v-32" stroke="currentColor" opacity=".35" />
      {concept === "access" && <g transform="translate(300 200)">
        {[0, 1, 2, 3, 4].map(n => <rect key={n} x={-118 + n * 19} y={-118 + n * 19} width={236 - n * 38} height={236 - n * 38} transform={`rotate(${n * 8})`} stroke="currentColor" opacity={.2 + n * .13} />)}
        <path d="M-24 0h48M0-24v48" stroke="var(--accent-digital)" />
      </g>}
      {concept === "assessment" && <g>
        {[0, 1, 2, 3, 4, 5].map(n => <path key={n} d={`M${145 + n * 62} 94v212M145 ${94 + n * 42}h310`} stroke="currentColor" opacity=".2" />)}
        <rect x="207" y="136" width="124" height="126" stroke="var(--accent-cyber)" />
        <path d="M191 120h25M191 120v25M347 278h-25M347 278v-25" stroke="currentColor" />
      </g>}
      {concept === "protocol" && <g>
        {[0, 1, 2, 3, 4].map(n => <g key={n} transform={`translate(${80 + n * 24} ${100 + n * 45})`}>
          <path d={`M0 0h${440 - n * 48}`} stroke="currentColor" opacity=".25" />
          <rect x={35 + (n % 3) * 55} y="-6" width="68" height="12" fill={n === 2 ? "var(--accent-digital)" : "currentColor"} opacity={n === 2 ? .8 : .4} />
        </g>)}
      </g>}
    </svg>
    <figcaption>{locale === "en" ? "Concept study · abstract illustration" : "Phác họa ý niệm · minh họa trừu tượng"}</figcaption>
  </figure>;
}
