import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";

import { PodcastBestMoments } from "./parts/PodcastBestMoments";
import { PodcastEpisodeHero } from "./parts/PodcastEpisodeHero";
import { PodcastKeyInsights } from "./parts/PodcastKeyInsights";
import { PodcastRelatedEpisodes } from "./parts/PodcastRelatedEpisodes";
import { PodcastShareBar } from "./parts/PodcastShareBar";
import { PodcastTranscript } from "./parts/PodcastTranscript";

interface PodcastEpisodePageProps {
  episode: SanityPodcastEpisodeDetail;
}

/**
 * Sanity-driven podcast episode detail page (Figma `2223:49` desktop /
 * `2223:723` mobile).
 *
 * Composes 6 self-contained sub-components — each renders one Sanity field
 * block in its own `<section>` and returns `null` when the corresponding
 * field is empty. Vertical rhythm comes from the sub-components themselves
 * so missing data collapses without leaving gaps.
 *
 * No outer `route-motion-frame` wrapper here: `(site)/template.tsx` already
 * provides one for every page; wrapping again would compound the route-enter
 * animation.
 */
export function PodcastEpisodePage({ episode }: PodcastEpisodePageProps) {
  return (
    <>
      <PodcastEpisodeHero episode={episode} />
      <PodcastKeyInsights insights={episode.keyInsights} />
      <PodcastBestMoments reels={episode.bestMoments} />
      <PodcastTranscript transcript={episode.transcript} />
      <PodcastShareBar episode={episode} />
      <PodcastRelatedEpisodes episodes={episode.relatedEpisodes} />
    </>
  );
}
