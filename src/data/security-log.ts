import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import type { MDXComponents } from "mdx/types";
import EnglishArticle from "@/content/security-log/analyzing-http-and-https-traffic-with-wireshark/en.mdx";
import VietnameseArticle from "@/content/security-log/analyzing-http-and-https-traffic-with-wireshark/vi.mdx";
import { isPublishedLog } from "@/data/security-log-publication";
import type { Locale } from "@/i18n/locales";
import type { SecurityLogEntry } from "@/types/content";

type ArticleComponent = ComponentType<{ components?: MDXComponents }>;
type ArticleResource = { Content: ArticleComponent; source: string };

const articleDirectory = join(
  process.cwd(),
  "src",
  "content",
  "security-log",
  "analyzing-http-and-https-traffic-with-wireshark",
);
const englishArticleSource = readFileSync(join(articleDirectory, "en.mdx"), "utf8");
const vietnameseArticleSource = readFileSync(join(articleDirectory, "vi.mdx"), "utf8");

export const securityLogEntries = [
  {
    id: "log-001",
    logNumber: "001",
    slug: "analyzing-http-and-https-traffic-with-wireshark",
    state: "published",
    kind: "field-note",
    category: {
      en: { state: "published", value: "Network / Lab" },
      vi: { state: "published", value: "Mạng / Bài lab" },
    },
    publishedAt: { value: "2026-09-08", precision: "day" },
    content: {
      en: {
        state: "published",
        value: {
          title: "Analyzing HTTP and HTTPS Traffic with Wireshark",
          excerpt: "A field note on separating observable protocol data from encrypted application content in Wireshark.",
        },
      },
      vi: {
        state: "published",
        value: {
          title: "Phân tích lưu lượng HTTP và HTTPS bằng Wireshark",
          excerpt: "Ghi chép kỹ thuật về cách phân biệt dữ liệu giao thức quan sát được với nội dung ứng dụng đã mã hóa trong Wireshark.",
        },
      },
    },
    mdxKeys: { en: "log-001-en", vi: "log-001-vi" },
  },
] as const satisfies readonly SecurityLogEntry[];

const contentRegistry: Readonly<Partial<Record<string, Readonly<Partial<Record<Locale, ArticleResource>>>>>> = {
  "analyzing-http-and-https-traffic-with-wireshark": {
    en: {
      Content: EnglishArticle,
      source: englishArticleSource,
    },
    vi: {
      Content: VietnameseArticle,
      source: vietnameseArticleSource,
    },
  },
};

function assertPublished(entry: SecurityLogEntry, locale: Locale) {
  if (entry.state !== "published" || entry.content[locale]?.state !== "published" || entry.category[locale]?.state !== "published") {
    throw new Error(`Security Log ${entry.id} lacks approved ${locale} publication data.`);
  }
  if (!entry.publishedAt || entry.publishedAt.precision !== "day") {
    throw new Error(`Published Security Log ${entry.id} requires an exact publication date.`);
  }
  if (!contentRegistry[entry.slug]?.[locale]) {
    throw new Error(`Security Log ${entry.id} lacks registered ${locale} MDX.`);
  }
}

export function publishedSecurityLogs(locale: Locale): readonly SecurityLogEntry[] {
  const entries = securityLogEntries.filter(entry => isPublishedLog(entry.slug, locale));
  entries.forEach(entry => assertPublished(entry, locale));
  return entries;
}

export function publishedSecurityLog(slug: string, locale: Locale) {
  const entry = securityLogEntries.find(candidate => candidate.slug === slug);
  if (!entry || !isPublishedLog(slug, locale)) return undefined;
  assertPublished(entry, locale);
  return entry;
}

function countWords(source: string) {
  const readable = source
    .replace(/```[\s\S]*?```/g, block => block.replace(/```[^\n]*|```/g, " "))
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>|{}[\]()-]/g, " ");
  return readable.match(/[\p{L}\p{M}\p{N}]+(?:[’'][\p{L}\p{M}\p{N}]+)*/gu)?.length ?? 0;
}

export function getSecurityLogArticle(slug: string, locale: Locale) {
  const entry = publishedSecurityLog(slug, locale);
  const resource = contentRegistry[slug]?.[locale];
  if (!entry || !resource) return undefined;
  const wordCount = countWords(resource.source);
  return { entry, Content: resource.Content, wordCount, readingMinutes: Math.max(1, Math.ceil(wordCount / 200)) };
}

export function getSecurityLogReadingTime(slug: string, locale: Locale) {
  return getSecurityLogArticle(slug, locale)?.readingMinutes;
}

export function formatLogDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
