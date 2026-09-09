import "server-only";

import type { PublicLink, SocialLink } from "@/types/content";

export const socialLinks = [
  { id: "email", kind: "email", label: "nhpntd@gmail.com", url: "mailto:nhpntd@gmail.com" },
  { id: "github", kind: "github", label: "@hphuc032", url: "https://github.com/hphuc032" },
  { id: "linkedin", kind: "linkedin", label: "Nguyen Hoang Phuc", url: "https://www.linkedin.com/in/nguyen-phuc-71217332a/" },
] as const satisfies readonly SocialLink[];

export const publicCv = {
  label: "Nguyen Hoang Phuc / PDF",
  url: "/cv/nguyen-hoang-phuc-cv.pdf",
} as const satisfies PublicLink;

export function socialLink(kind: SocialLink["kind"]) {
  const link = socialLinks.find(candidate => candidate.kind === kind);
  if (!link) throw new Error(`Missing approved ${kind} contact link.`);
  return link;
}
