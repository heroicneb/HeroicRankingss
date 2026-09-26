import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";

import { PodcastEpisodeHero } from "./parts/PodcastEpisodeHero";
import { PodcastKeyInsights } from "./parts/PodcastKeyInsights";
import { PodcastRelatedEpisodes } from "./parts/PodcastRelatedEpisodes";
import { PodcastTranscript } from "./parts/PodcastTranscript";
import type { EpisodeView } from "./parts/podcast-episode-card";

interface PodcastEpisodePageProps {
  episode: SanityPodcastEpisodeDetail;
  /** Cards for "More From The Podcast" when the document picks no related episodes. */
  moreEpisodes: EpisodeView[];
}

/**
 * Podcast episode page — Figma `2223:49` (desktop) / `2223:723` (mobile).
 * Extraction notes: docs/figma-cache/extractions/2026-09-27-podcast-episode-section-01-trevor-longino.md
 *
 * Hero → Key Insights panel (with the Best Moments card inside) → Full
 * Episode Transcript panel (with the share row inside) → More From The
 * Podcast. Each part returns null when its Sanity block is empty.
 *
 * No outer `route-motion-frame` wrapper here: `(site)/template.tsx` already
 * provides one for every page.
 */
export function PodcastEpisodePage({ episode, moreEpisodes }: PodcastEpisodePageProps) {
  return (
    <>
      <PodcastEpisodeHero episode={episode} />
      <PodcastKeyInsights insights={episode.keyInsights} reels={episode.bestMoments} />
      <PodcastTranscript episode={episode} />
      <PodcastRelatedEpisodes episode={episode} moreEpisodes={moreEpisodes} />
    </>
  );
}
