import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";

export const editorialFont = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  style: "normal",
  // Subsets select preloads, not glyph availability. Vietnamese faces remain
  // self-hosted and load through their CSS unicode-range when text needs them.
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial",
  adjustFontFallback: true,
});

export const technicalFont = IBM_Plex_Mono({
  weight: ["400", "500"],
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-technical",
  adjustFontFallback: true,
});
