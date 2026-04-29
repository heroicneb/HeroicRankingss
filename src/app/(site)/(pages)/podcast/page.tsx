import PodcastPage from "@/components/pages/podcast/podcast-page";
import { getPodcastEpisodes } from "@/lib/sanity-data";

export { metadata } from "@/components/pages/podcast/podcast-page";

export const dynamic = "force-dynamic";

export default async function PodcastRoute() {
  const episodes = await getPodcastEpisodes();
  return <PodcastPage episodes={episodes} />;
}
