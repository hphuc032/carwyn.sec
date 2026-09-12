import type { Metadata } from "next";
import { DesignSystemPreview } from "@/dev/design-system/DesignSystemPreview";

export const metadata: Metadata = {
  title: "Design System / carwyn.sec",
  robots: { index: false, follow: false },
};

export default function EnglishDesignSystemPage() {
  return <DesignSystemPreview locale="en" />;
}
