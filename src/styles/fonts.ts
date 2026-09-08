import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";

export const editorialFont = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  style: "normal",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-editorial",
  adjustFontFallback: true,
});

export const technicalFont = IBM_Plex_Mono({
  weight: ["400", "500"],
  style: "normal",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-technical",
  adjustFontFallback: true,
});
