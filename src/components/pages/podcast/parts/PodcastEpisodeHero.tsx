import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { PlayButtonOverlay } from "@/components/ui/play-button-overlay";
import { SectionLabel } from "@/components/ui/section-label";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

interface PodcastEpisodeHeroProps {
  episode: SanityPodcastEpisodeDetail;
}

function getHeroImageUrl(
  source: SanityPodcastEpisodeDetail["heroImage"],
  width: number,
): string | null {
  if (!source?.asset) return null;
  try {
    return urlFor(source).width(width).url();
  } catch {
    return null;
  }
}

/**
 * Splits the episode title into a solid prefix and a gradient suffix using
 * `titleHighlighted` (when present and a substring of `title`). Falls back to
 * a single solid block when no highlight is configured.
 *
 * Patterns supported:
 *   "Marketing That Actually Works" + highlighted "That Actually Works"
 *     => solid "Marketing" + gradient "That Actually Works"
 *
 * The highlight may appear at any position; the surrounding whitespace is
 * preserved so the rendered string matches the original `title`.
 */
function splitTitle(title: string, highlighted: string | null | undefined) {
  if (!highlighted) {
    return { before: title, gradient: "", after: "" };
  }

  const idx = title.indexOf(highlighted);
  if (idx === -1) {
    return { before: title, gradient: "", after: "" };
  }

  return {
    before: title.slice(0, idx),
    gradient: highlighted,
    after: title.slice(idx + highlighted.length),
  };
}

/**
 * Podcast episode hero (Figma `2223:91` desktop / `2223:746` mobile).
 *
 * Two-column desktop:
 *   - Left (487): EP pill + duration pill, H1 (split solid + gradient),
 *     "with Guest Name / Role" caption (gradient bold), summary paragraph.
 *   - Right (738x415): hero thumbnail with circular play overlay (72x72),
 *     linked to the video embed URL.
 *
 * Single-column mobile: pills + H1 + caption + body + 350x197 thumbnail.
 */
export function PodcastEpisodeHero({ episode }: PodcastEpisodeHeroProps) {
  if (!episode?.title) return null;

  const heroImageUrl = getHeroImageUrl(episode.heroImage, 1200);
  const heroImageLqip = episode.heroImage?.asset?.metadata?.lqip;
  const heroImageAlt = episode.heroImage?.alt ?? episode.title;

  const { before, gradient, after } = splitTitle(
    episode.title,
    episode.titleHighlighted,
  );

  const guestName = episode.guest?.name ?? null;
  const guestRole = episode.guest?.role ?? null;

  const playHref = episode.videoEmbedUrl ?? null;

  return (
    <section
      className="px-[20px] pb-[60px] pt-[100px] lg:px-[80px] lg:pb-[120px] lg:pt-[160px]"
      id="podcast-episode-hero"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <SectionLabel className="text-center lg:text-left">
          / Podcast /
        </SectionLabel>

        <div className="mt-[20px] flex flex-wrap items-center justify-center gap-[5px] lg:mt-[30px] lg:justify-start">
          <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:text-[18px] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]">
            EP&nbsp;&bull;&nbsp;{episode.episodeNumber}
          </span>
          <span className="inline-flex items-center rounded-[100px] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:text-[18px] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]">
            {episode.duration}
          </span>
        </div>

        <div className="mt-[20px] grid grid-cols-1 gap-[30px] lg:mt-[40px] lg:grid-cols-[487px_minmax(0,1fr)] lg:items-center lg:gap-[60px]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-normal text-[38px] leading-[1.2] tracking-[-0.76px] text-[var(--color-hr-pure-black)] lg:text-[62px] lg:leading-[80px] lg:tracking-[-1.24px] dark:text-[var(--color-text-inverse)]">
              {before}
              {gradient ? (
                <span className="gradient-text-brand">{gradient}</span>
              ) : null}
              {after}
            </h1>

            {guestName ? (
              <p className="mt-[20px] text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:mt-[24px] lg:text-[18px] dark:text-[var(--color-text-inverse)]">
                with{" "}
                <span className="gradient-text-brand font-bold">
                  {guestName}
                </span>
                {guestRole ? (
                  <>
                    <span aria-hidden> &bull; </span>
                    {guestRole}
                  </>
                ) : null}
              </p>
            ) : null}

            {episode.description ? (
              <p className="mt-[20px] max-w-[521px] text-[16px] leading-[24px] text-[var(--color-hr-dark)] lg:mt-[24px] lg:text-[18px] dark:text-[var(--color-text-inverse)]">
                {episode.description}
              </p>
            ) : null}
          </div>

          {heroImageUrl ? (
            <div className="relative aspect-[350/197] w-full overflow-hidden rounded-[20px] lg:aspect-[738/415] lg:rounded-[20px]">
              {playHref ? (
                <AppLink
                  aria-label={`Play episode: ${episode.title}`}
                  className="motion-interactive motion-interactive-press group block h-full w-full"
                  href={playHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image
                    alt={heroImageAlt}
                    blurDataURL={heroImageLqip}
                    className="object-cover"
                    fetchPriority="high"
                    fill
                    placeholder={heroImageLqip ? "blur" : "empty"}
                    priority
                    sizes="(min-width: 1024px) 738px, 100vw"
                    src={heroImageUrl}
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <PlayButtonOverlay
                      ariaLabel="Play episode"
                      className="lg:size-[106px]"
                      size={72}
                    />
                  </span>
                </AppLink>
              ) : (
                <>
                  <Image
                    alt={heroImageAlt}
                    blurDataURL={heroImageLqip}
                    className="object-cover"
                    fetchPriority="high"
                    fill
                    placeholder={heroImageLqip ? "blur" : "empty"}
                    priority
                    sizes="(min-width: 1024px) 738px, 100vw"
                    src={heroImageUrl}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    <PlayButtonOverlay
                      ariaLabel="Play episode"
                      className="lg:size-[106px]"
                      size={72}
                    />
                  </span>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
