import PodcastPage from "@/components/pages/podcast/podcast-page";
import { getPodcastEpisodes } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/podcast/podcast-page";

export default async function PodcastRoute() {
  const episodes = await getPodcastEpisodes().catch((error) => {
    console.error("Failed to fetch podcast episodes:", error);
    return [];
  });
  return <PodcastPage episodes={episodes} />;
}
