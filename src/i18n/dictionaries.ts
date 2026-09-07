import "server-only";
import type { Locale } from "./locales";
import { en, type Dictionary } from "./dictionaries/en";
import { vi } from "./dictionaries/vi";

const dictionaries: Record<Locale, Dictionary> = { en, vi };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
