import { logArticleMetadata, LogArticleRoute, logStaticParams } from "@/app/_shared/log-route";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = logStaticParams;
export function generateMetadata({ params }: Props) {
  return logArticleMetadata("en", params);
}

export default function EnglishLogArticlePage({ params }: Props) {
  return <LogArticleRoute locale="en" params={params} />;
}
