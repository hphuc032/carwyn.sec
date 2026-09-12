import { logIndexMetadata, LogIndexRoute } from "@/app/_shared/log-route";

export function generateMetadata() {
  return logIndexMetadata("en");
}

export default function EnglishLogIndexPage() {
  return <LogIndexRoute locale="en" />;
}
