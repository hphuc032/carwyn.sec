export const en = {
  foundation: "Foundation initialized.",
  skipToContent: "Skip to content",
} as const;

export type Dictionary = { [Key in keyof typeof en]: string };
