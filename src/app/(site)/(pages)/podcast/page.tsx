import { PodcastChatProvider } from "@/components/chat/PodcastChatProvider";
import PodcastPage from "@/components/pages/podcast/podcast-page";
import { getPodcastEpisodes } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/podcast/podcast-page";

const GLOBAL_FALLBACK_SUGGESTIONS = [
  "What does Ranking Heroes teach about link-building at scale?",
  "Which guest had the most actionable SEO advice?",
  "Summarize the recurring strategies across the last five episodes",
  "What do guests agree on about AI search?",
  "Quote the strongest take on B2B content from any episode",
];

interface PodcastRouteProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export default async function PodcastRoute({ searchParams }: PodcastRouteProps) {
  const [episodes, params] = await Promise.all([getPodcastEpisodes(), searchParams]);
  const page = Array.isArray(params.page) ? params.page[0] : params.page;
  return (
    <>
      <PodcastPage episodes={episodes} page={page ?? null} />
      <PodcastChatProvider
        globalSuggestions={GLOBAL_FALLBACK_SUGGESTIONS}
        mode="global"
        routeKey="podcast:hub"
      />
    </>
  );
}
