import InsightsPage from "@/components/pages/insights/insights-page";
import { getPosts } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/insights/insights-page";

export const dynamic = "force-dynamic";

export default async function InsightsRoute() {
  const posts = await getPosts().catch(() => []);
  return <InsightsPage cmsPosts={posts} />;
}
