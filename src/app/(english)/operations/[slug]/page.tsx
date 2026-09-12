import { caseStaticParams, caseStudyMetadata, CaseStudyRoute } from "@/app/_shared/case-study-route";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = caseStaticParams;
export function generateMetadata({ params }: Props) {
  return caseStudyMetadata("en", params);
}

export default function EnglishCasePage({ params }: Props) {
  return <CaseStudyRoute locale="en" params={params} />;
}
