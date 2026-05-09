import { PodcastChatProvider } from "@/components/chat/PodcastChatProvider";
import PodcastPage from "@/components/pages/podcast/podcast-page";
import { getPodcastEpisodes } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/podcast/podcast-page";

export const dynamic = "force-dynamic";

const GLOBAL_FALLBACK_SUGGESTIONS = [
  "What does Ranking Heroes teach about link-building at scale?",
  "Which guest had the most actionable SEO advice?",
  "Summarize the recurring strategies across the last five episodes",
  "What do guests agree on about AI search?",
  "Quote the strongest take on B2B content from any episode",
];

export default async function PodcastRoute() {
  const episodes = await getPodcastEpisodes();
  return (
    <>
      <PodcastPage episodes={episodes} />
      <PodcastChatProvider
        globalSuggestions={GLOBAL_FALLBACK_SUGGESTIONS}
        mode="global"
        routeKey="podcast:hub"
      />
    </>
  );
}
