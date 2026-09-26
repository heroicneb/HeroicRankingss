import { GradientText } from "@/components/ui/gradient-text";
import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";

import { EpisodeCard, toEpisodeView, type EpisodeView } from "./podcast-episode-card";

interface PodcastRelatedEpisodesProps {
  episode: SanityPodcastEpisodeDetail;
  /** Fallback cards when the document picks no related episodes. */
  moreEpisodes: EpisodeView[];
}

/**
 * "More From The Podcast" (Figma 2223:177 desktop / 2223:829 mobile):
 * "/  Continue Watching  /" label, two-tone H2, then the shared episode
 * cards 20px below (three columns on desktop, stacked 10px apart on phones).
 */
export function PodcastRelatedEpisodes({ episode, moreEpisodes }: PodcastRelatedEpisodesProps) {
  const picked = (episode.relatedEpisodes ?? []).filter((item) => item?.slug?.current).map((item) => toEpisodeView(item, 826));
  const cards = (picked.length ? picked : moreEpisodes).slice(0, 3);
  if (cards.length === 0) return null;

  return (
    <section className="px-5 pb-[60px] pt-[40px] lg:px-20 lg:pb-[120px] lg:pt-[120px]" id="podcast-related-episodes">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mx-auto flex max-w-[294px] flex-col items-center gap-5 text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
          <SectionLabel>/&nbsp;&nbsp;Continue Watching&nbsp;&nbsp;/</SectionLabel>
          <h2 className="type-h2 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-[561px]">
            More From <GradientText className="gradient-text-podcast-related">The Podcast</GradientText>
          </h2>
        </div>

        <div className="mt-10 flex flex-col items-center gap-[10px] lg:mt-5 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {cards.map((card) => (
            <EpisodeCard episode={card} key={card.key} />
          ))}
        </div>
      </div>
    </section>
  );
}
