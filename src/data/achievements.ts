import "server-only";

import type { Achievement, Locale } from "@/types/content";

// Publication decisions are recorded in docs/achievements-evidence-audit.md.
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
    id: "cscv-qualifying-round",
    order: 2,
    category: "competition",
    status: "participated",
    state: "published",
    organization: "National Cybersecurity Association (NCA)",
    date: { value: "2025", precision: "year" },
    content: {
      en: { state: "published", value: {
        title: "Cybersecurity Student Competition 2025",
        descriptor: "QUALIFYING ROUND PARTICIPANT",
        detail: "Organizer: National Cybersecurity Association (NCA).",
      } },
      vi: { state: "published", value: {
        title: "Cuộc thi Sinh viên An ninh mạng 2025",
        descriptor: "THAM DỰ VÒNG SƠ KHẢO",
        detail: "Đơn vị tổ chức: Hiệp hội An ninh quốc gia (NCA).",
      } },
    },
    evidenceLinks: [{ label: "cscv.vn", url: "https://cscv.vn" }],
  },
  {
    id: "hcmute-top-four",
    order: 3,
    category: "recognition",
    status: "top-4",
    state: "published",
    date: { value: "2025", precision: "year" },
    content: {
      en: { state: "published", value: {
        title: "Top 4",
        descriptor: "HCMUTE CTF 2025",
        detail: "Sinh Viên Với An Toàn Thông Tin.",
      } },
      vi: { state: "published", value: {
        title: "Top 4",
        descriptor: "CUỘC THI SINH VIÊN VỚI AN TOÀN THÔNG TIN",
        detail: "HCMUTE CTF 2025.",
      } },
    },
  },
  {
    id: "ceh",
    order: 4,
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
  if (record.category === "competition" && (!record.organization || !record.date || !record.evidenceLinks?.length)) {
    throw new Error(`Published competition record ${record.id} requires organizer, year and public event evidence.`);
  }
  if (record.category === "recognition" && (!record.date || !record.content[locale]?.value.descriptor)) {
    throw new Error(`Published recognition record ${record.id} requires year and event identity.`);
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
