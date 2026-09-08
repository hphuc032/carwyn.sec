import type { Locale } from "@/i18n/locales";
export type { Locale } from "@/i18n/locales";

export type PublicationState = "draft" | "review" | "published";
export type LearningStatus = "in-progress" | "completed";
export type Translation<T> = { value: T; state: PublicationState };
export type Localized<T> = { en: Translation<T>; vi?: Translation<T> };
export type DateValue = { value: string; precision: "year" | "month" | "day" };
export type DateRange = { start?: DateValue; end?: DateValue | "present" };
export type AssetRef = {
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
  caption?: Localized<string>;
};
export type PublicLink = { label: string; url: string };
export type CaseStudySection = {
  id: string;
  state: PublicationState;
  content: Localized<{ heading: string; paragraphs: readonly string[] }>;
  evidence?: AssetRef;
};

export interface Project {
  id: string;
  slug: string;
  caseNumber: "001" | "002" | "003";
  featuredOrder: 1 | 2 | 3;
  state: PublicationState;
  caseStudyState: PublicationState;
  content: Localized<{ title: string; summary?: string; role?: string }>;
  year?: DateValue;
  technologyIds?: readonly string[];
  preview?: AssetRef;
  links?: readonly PublicLink[];
  category?: Localized<string>;
  overview?: Localized<string>;
  sections?: readonly CaseStudySection[];
  visualConcept?: "access" | "assessment" | "protocol";
}

export interface Experience {
  id: string;
  organization: string;
  kind: "technical" | "community" | "non-technical";
  state: PublicationState;
  dates?: DateRange;
  location?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "internship" | "volunteer";
  content: Localized<{ role?: string; description?: string; responsibilities?: readonly string[] }>;
}

type AchievementBase = {
  id: string;
  state: PublicationState;
  organization?: string;
  date?: DateValue;
  content: Localized<{ title: string; detail?: string }>;
  evidenceLinks?: readonly PublicLink[];
};

export type Achievement = AchievementBase & (
  | { category: "certification"; status: LearningStatus }
  | { category: "community" | "competition" | "recognition"; result?: string }
);

export interface Expertise {
  id: string;
  order: number;
  state: PublicationState;
  content: Localized<{ title: string; description?: string }>;
  toolIds?: readonly string[];
  subjects?: Localized<readonly string[]>;
}

export interface SocialLink extends PublicLink {
  id: string;
  kind: "github" | "linkedin" | "email";
}

export interface Profile {
  brand: string;
  name: string;
  field: string;
  location: string;
  content: Localized<{ biography: string; objective?: string; availability?: string }>;
  currentLearning?: readonly { name: string; status: LearningStatus }[];
  portrait?: AssetRef;
  cv?: PublicLink;
}

export interface SecurityLogEntry {
  id: string;
  slug: string;
  state: PublicationState;
  category: string;
  publishedAt?: DateValue;
  updatedAt?: DateValue;
  content: Localized<{ title: string; excerpt: string }>;
  mdxKeys: Partial<Record<Locale, string>>;
  wordCounts?: Partial<Record<Locale, number>>;
  cover?: AssetRef;
}
