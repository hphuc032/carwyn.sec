import "server-only";

import type { Achievement, Locale } from "@/types/content";

// Publication decisions and source conflicts are recorded in
// docs/achievements-evidence-audit.md. Review records never reach the UI.
export const achievementCatalog = [
  {
    id: "aws-student-builder-group-hcmute",
    order: 1,
    category: "community",
    status: "core-team",
    state: "published",
    organization: "AWS Student Builder Group HCMUTE",
    content: {
      en: { state: "published", value: { title: "Core Team" } },
      vi: { state: "published", value: { title: "Core Team" } },
    },
  },
  {
    id: "hcmute-top-four",
    order: 3,
    category: "competition",
    status: "top-4",
    state: "review",
    content: {
      en: { state: "review", value: { title: "Top 4 at HCMUTE" } },
    },
  },
  {
    id: "cscv-qualifying-round",
    order: 4,
    category: "competition",
    status: "participated",
    state: "review",
    content: {
      en: { state: "review", value: { title: "CSCV qualifying round participation" } },
    },
  },
  {
    id: "ceh",
    order: 2,
    category: "certification",
    status: "in-progress",
    state: "published",
    content: {
      en: {
        state: "published",
        value: {
          title: "CEH",
          descriptor: "Certified Ethical Hacker",
          detail: "Currently studying CEH material.",
        },
      },
      vi: {
        state: "published",
        value: {
          title: "CEH",
          descriptor: "Certified Ethical Hacker",
          detail: "Hiện đang học nội dung CEH.",
        },
      },
    },
  },
] as const satisfies readonly Achievement[];

function hasPublishedCopy(record: Achievement, locale: Locale) {
  const translation = record.content[locale];
  return translation?.state === "published" && translation.value.title.trim().length > 0;
}

function assertPublishable(record: Achievement, locale: Locale) {
  if (!hasPublishedCopy(record, locale)) {
    throw new Error(`Achievement ${record.id} lacks approved ${locale} content.`);
  }
  if (record.category === "community" && !record.organization) {
    throw new Error(`Published community record ${record.id} requires an organization.`);
  }
  if (record.category === "certification" && record.status === "completed" && !record.evidenceLinks?.length) {
    throw new Error(`Completed certification ${record.id} requires public evidence.`);
  }
}

export function publishedAchievements(locale: Locale): readonly Achievement[] {
  const records = achievementCatalog.filter(record => record.state === "published");
  records.forEach(record => assertPublishable(record, locale));
  return records.toSorted((a, b) => a.order - b.order);
}
