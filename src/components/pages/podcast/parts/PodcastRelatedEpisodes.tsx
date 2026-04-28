import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { PlayButtonOverlay } from "@/components/ui/play-button-overlay";
import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

type RelatedEpisode = NonNullable<
  SanityPodcastEpisodeDetail["relatedEpisodes"]
>[number];

interface PodcastRelatedEpisodesProps {
  episodes: RelatedEpisode[] | null | undefined;
}

function getThumbnailUrl(
  episode: RelatedEpisode,
  width: number,
): string | null {
  if (!episode.heroImage?.asset) return null;
  try {
    return urlFor(episode.heroImage).width(width).url();
  } catch {
    return null;
  }
}

function RelatedEpisodeCard({ episode }: { episode: RelatedEpisode }) {
  const slug = episode.slug?.current ?? "";
  const href = slug ? `/podcast/${slug}` : "#";
  const thumbnailUrl = getThumbnailUrl(episode, 800);
  const thumbnailLqip = episode.heroImage?.asset?.metadata?.lqip;
  const thumbnailAlt = episode.heroImage?.alt ?? episode.title;
  const guestName = episode.guest?.name ?? null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] lg:rounded-[40px] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)]">
      <div className="relative h-[305px] w-full overflow-hidden">
        {thumbnailUrl ? (
          <Image
            alt={thumbnailAlt}
            blurDataURL={thumbnailLqip}
            className="object-cover"
            fill
            placeholder={thumbnailLqip ? "blur" : "empty"}
            sizes="(min-width: 1024px) 413px, (min-width: 768px) 50vw, 100vw"
            src={thumbnailUrl}
          />
        ) : null}

        <div className="absolute right-[20px] top-[20px] flex gap-[5px]">
          <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-pure-white)] px-[14px] py-[6px] text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:text-[18px]">
            EP&nbsp;&bull;&nbsp;{episode.episodeNumber}
          </span>
          <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-pure-white)] px-[14px] py-[6px] text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:text-[18px]">
            {episode.duration}
          </span>
        </div>

        <AppLink
          aria-label={`Open episode: ${episode.title}`}
          className="absolute bottom-[20px] right-[20px]"
          href={href}
        >
          <PlayButtonOverlay
            ariaLabel="Open episode"
            className="lg:size-[72px]"
            size={66}
          />
        </AppLink>
      </div>

      <div className="flex flex-1 flex-col gap-[20px] px-[20px] pb-[20px] pt-[20px]">
        <div className="flex flex-col gap-[10px]">
          <h3 className="font-normal text-[22px] leading-[1.2] tracking-[-0.44px] text-[var(--color-hr-dark)] lg:text-[32px] lg:tracking-[-0.64px] dark:text-[var(--color-text-inverse)]">
            <AppLink
              className="hover:underline focus-visible:underline focus-visible:outline-none"
              href={href}
            >
              {episode.title}
            </AppLink>
          </h3>
          {guestName ? (
            <p className="text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:text-[18px] dark:text-[var(--color-text-inverse)]">
              with{" "}
              <span className="gradient-text-brand font-bold">{guestName}</span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * "More From The Podcast" section (Figma `2223:177` desktop / `2223:829` mobile).
 *
 * Section label + two-tone H2 ("More From" solid + "The Podcast" gradient)
 * followed by a 3-card grid on desktop / vertical stack on mobile of related
 * episode cards. Each card shows the episode hero thumbnail with EP number
 * and duration pills overlaid plus a circular play button linking to the
 * episode detail page.
 *
 * Schema enforces a max of 3 related episodes; this component renders all
 * provided.
 */
export function PodcastRelatedEpisodes({
  episodes,
}: PodcastRelatedEpisodesProps) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="podcast-related-episodes"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <SectionLabel className="text-center lg:text-left">
          / Continue Listening /
        </SectionLabel>

        <h2 className="mt-[20px] text-center font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] lg:mt-[30px] lg:text-left lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px] dark:text-[var(--color-text-inverse)]">
          More From{" "}
          <GradientText className="gradient-text-brand-services">
            The Podcast
          </GradientText>
        </h2>

        <div className="mt-[40px] grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:mt-[60px] lg:grid-cols-3">
          {episodes.map((episode, index) => (
            <RelatedEpisodeCard
              episode={episode}
              key={episode._id ?? episode.slug?.current ?? `related-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
