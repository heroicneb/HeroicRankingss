import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/components/pages/home/home-content";
import { EpisodeCard, FALLBACK_EPISODES, toEpisodeView } from "@/components/pages/podcast/parts/podcast-episode-card";
import { AppLink } from "@/components/ui/app-link";
import { Container } from "@/components/ui/container";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { GradientArrowUpRightIcon } from "@/components/ui/icons/decorative";
import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPodcastEpisodeSummary } from "@/lib/sanity-data";

/*
 * "/ Featured Podcasts /" on the homepage: the three newest episodes in the
 * same cards as the podcast page (arrow opens the episode, Ask AI opens the
 * chat scoped to that episode). Needs a PodcastChatProvider on the page.
 */

const CTA_CLASS =
  "type-cta motion-interactive motion-interactive-press inline-flex h-[47px] items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-5 py-3 text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]";

interface FeaturedPodcastsProps {
  episodes: SanityPodcastEpisodeSummary[];
  content?: HomeContent["featuredPodcasts"];
}

export function FeaturedPodcasts({ episodes, content = DEFAULT_HOME_CONTENT.featuredPodcasts }: FeaturedPodcastsProps) {
  // WHY: episodes arrive newest first; the frame's trio stands in until the CMS has episodes.
  const cards = episodes.length ? episodes.slice(0, 3).map((episode) => toEpisodeView(episode, 826)) : FALLBACK_EPISODES;

  return (
    <section className="pb-[60px] pt-[20px] lg:pb-[120px] lg:pt-[20px]" id="featured-podcasts">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[577px_1fr] lg:items-end" data-reveal>
          <div className="text-center lg:text-left">
            <SectionLabel>{content.label}</SectionLabel>
            <h2 className="type-h2 mt-5 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
              <GradientHeading highlightClassName="gradient-text-podcast-episodes" segments={content.heading} />
            </h2>
          </div>
          <div className="hidden justify-end lg:flex">
            <AppLink className={`${CTA_CLASS} w-fit min-w-max`} href={content.ctaUrl} motionPreset="none">
              {content.ctaLabel}
              <GradientArrowUpRightIcon className="size-[10px]" />
            </AppLink>
          </div>
        </div>
      </Container>

      <Container className="mt-[40px] lg:mt-20">
        <div className="flex flex-col items-center gap-[10px] lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-5" data-reveal-stagger>
          {cards.map((episode) => (
            <EpisodeCard episode={episode} key={episode.key} />
          ))}
        </div>
        <div className="mt-10 flex justify-center lg:hidden">
          <AppLink className={`${CTA_CLASS} w-full max-w-[350px]`} href={content.ctaUrl} motionPreset="none">
            {content.ctaLabel}
            <GradientArrowUpRightIcon className="size-[10px]" />
          </AppLink>
        </div>
      </Container>
    </section>
  );
}
