import InsightsPage from "@/components/pages/insights/insights-page";
import { getPosts } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/insights/insights-page";

interface InsightsRouteProps {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

export default async function InsightsRoute({ searchParams }: InsightsRouteProps) {
  // WHY: category and page come from the URL so every archive page is server-rendered and crawlable.
  const [posts, params] = await Promise.all([getPosts().catch(() => []), searchParams]);
  return <InsightsPage category={first(params.category)} cmsPosts={posts} page={first(params.page)} />;
}
