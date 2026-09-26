import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/cn";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { splitTitle } from "@/lib/split-title";
import { urlFor } from "@/sanity/lib/image";

import { GuestLine, PILL } from "./podcast-episode-card";

interface PodcastEpisodeHeroProps {
  episode: SanityPodcastEpisodeDetail;
}

function getHeroImageUrl(source: SanityPodcastEpisodeDetail["heroImage"], width: number): string | null {
  if (!source?.asset) return null;
  try {
    return urlFor(source).width(width).url();
  } catch {
    return null;
  }
}

/** The frame's play glyph: a 29.56×38 gradient triangle with a soft shadow (Figma 2223:103). */
export function PlayTriangle({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}>
      <Image alt="" className="h-[59px] w-[54px] translate-x-[-2px] translate-y-[4px]" height={59} src="/podcast/play-shadow.svg" width={54} />
    </span>
  );
}

/**
 * Episode hero (Figma 2223:91 desktop / 2223:746 mobile).
 *
 * Desktop: two columns 487.875 / 738 spread across the 1280 container.
 * Left: EP + duration pills, 62/80 title with a gradient span, "with
 * Guest • Role, Company", 40px gap, 522-wide summary. Right: 738×415
 * thumbnail with the play glyph, linked to the video when one is set.
 *
 * Mobile: centred stack (pills, 38px title, caption, 304-wide summary,
 * 350×197 thumbnail), 40px gaps.
 */
export function PodcastEpisodeHero({ episode }: PodcastEpisodeHeroProps) {
  if (!episode?.title) return null;

  const heroImageUrl = getHeroImageUrl(episode.heroImage, 1476);
  const heroImageLqip = episode.heroImage?.asset?.metadata?.lqip;
  const heroImageAlt = episode.heroImage?.alt ?? episode.title;
  const { before, gradient, after } = splitTitle(episode.title, episode.titleHighlighted);
  const guestName = episode.guest?.name?.trim() || null;
  const guestSuffix = [episode.guest?.role?.trim(), episode.guest?.company?.trim()].filter(Boolean).join(", ") || null;
  const playHref = episode.videoEmbedUrl?.trim() || null;

  const thumbnail = (
    <>
      {heroImageUrl ? (
        <Image
          alt={heroImageAlt}
          blurDataURL={heroImageLqip}
          className="object-cover"
          fetchPriority="high"
          fill
          placeholder={heroImageLqip ? "blur" : "empty"}
          priority
          sizes="(min-width: 1024px) 738px, 350px"
          src={heroImageUrl}
        />
      ) : null}
      <PlayTriangle />
    </>
  );

  return (
    <section className="pb-[60px] pt-[60px] lg:pb-[120px] lg:pt-[114px]" id="podcast-episode-hero">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10 px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-[55px] lg:px-20">
        <div className="flex flex-col items-center gap-10 text-center lg:items-start lg:text-left">
          <div className="flex flex-col items-center gap-[10px] lg:w-[487.875px] lg:items-start">
            <div className="flex items-center gap-[5px]">
              <span className={cn(PILL, "bg-[var(--color-hr-off-white)] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:bg-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]")}>
                EP • {episode.episodeNumber}
              </span>
              <span className={cn(PILL, "bg-[var(--color-hr-off-white)] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:bg-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]")}>
                {episode.duration}
              </span>
            </div>
            <h1 className="type-h1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-[430.164px]">
              {before}
              {gradient ? <GradientText className="gradient-text-podcast-episode-title">{gradient}</GradientText> : null}
              {after}
            </h1>
            {guestName ? (
              <GuestLine
                className="w-[324px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-full lg:text-[18px] lg:leading-[24px]"
                gradientClass="gradient-text-podcast-episode-guest"
                name={guestName}
                suffix={guestSuffix}
              />
            ) : null}
          </div>

          {episode.description ? (
            <p className="w-[304px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-[521.938px] lg:text-[18px] lg:leading-[24px]">
              {episode.description}
            </p>
          ) : null}
        </div>

        {playHref ? (
          <AppLink
            aria-label={`Play episode: ${episode.title}`}
            className="motion-interactive relative block h-[197px] w-[350px] shrink-0 overflow-hidden rounded-[20px] lg:h-[415.125px] lg:w-[738px]"
            href={playHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {thumbnail}
          </AppLink>
        ) : (
          <div className="relative h-[197px] w-[350px] shrink-0 overflow-hidden rounded-[20px] lg:h-[415.125px] lg:w-[738px]">{thumbnail}</div>
        )}
      </div>
    </section>
  );
}
