import { MobileScrollRail } from "@/components/ui/mobile-scroll-rail";
import { ReelThumbnail } from "@/components/ui/reel-thumbnail";
import { TwoToneHeading } from "@/components/ui/two-tone-heading";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

interface PodcastBestMomentsProps {
  reels: SanityPodcastEpisodeDetail["bestMoments"];
}

type Reel = NonNullable<SanityPodcastEpisodeDetail["bestMoments"]>[number] & {
  _key?: string;
};

const MOBILE_REEL_WIDTH = 320;
const MOBILE_REEL_GAP = 10;

function getThumbnailUrl(reel: Reel, width: number): string | null {
  if (!reel.thumbnail?.asset) return null;
  try {
    return urlFor(reel.thumbnail).width(width).url();
  } catch {
    return null;
  }
}

function getThumbnailLqip(reel: Reel): string | undefined {
  return reel.thumbnail?.asset?.metadata?.lqip;
}

/**
 * Best Moments reel gallery (Figma `2223:139` desktop / mobile section
 * inside `2223:761`).
 *
 * Desktop: white shadow card with two-tone H2 (gradient "Best Moments" +
 * solid "From This Episode") on the left and 3 reel thumbnails (197x350)
 * tiered horizontally on the right.
 *
 * Mobile: full-width white card; reels become a horizontal scroll rail of
 * 320x320 thumbnails using the shared `MobileScrollRail` primitive.
 *
 * Schema enforces a max of 6 reels; this component renders all of them.
 */
export function PodcastBestMoments({ reels }: PodcastBestMomentsProps) {
  if (!reels || reels.length === 0) return null;

  const validReels = reels.filter((reel): reel is Reel =>
    Boolean(reel.thumbnail?.asset && reel.videoUrl),
  );

  if (validReels.length === 0) return null;

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="podcast-best-moments"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-pure-white)] px-[15px] py-[60px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] lg:rounded-[40px] lg:px-[60px] lg:py-[80px] dark:bg-[var(--color-bg-dark)] dark:shadow-none">
          <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-[523px_minmax(0,1fr)] lg:items-center lg:gap-[60px]">
            <div className="text-center lg:text-left">
              <TwoToneHeading
                as="h2"
                className="font-normal text-[28px] leading-[1.2] tracking-[-0.56px] text-[var(--color-hr-pure-black)] lg:text-[52px] lg:leading-[60px] lg:tracking-[-1.04px] dark:text-[var(--color-text-inverse)]"
                highlightPosition="leading"
                highlighted="Best Moments"
                main="From This Episode"
              />
              <p className="mt-[20px] text-[16px] leading-[1.3] text-[var(--color-hr-dark)] lg:mt-[24px] lg:text-[18px] lg:leading-[24px] dark:text-[var(--color-text-inverse)]">
                Every episode is full of insights, but some moments stand out.
                Below are the exchanges that captured the most important ideas
                from this conversation.
              </p>
            </div>

            {/* Desktop grid (3-up) */}
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-[12px]">
              {validReels.slice(0, 3).map((reel, index) => {
                const thumbnailUrl = getThumbnailUrl(reel, 600);
                if (!thumbnailUrl) return null;
                return (
                  <ReelThumbnail
                    key={reel._key ?? `desktop-reel-${index}`}
                    caption={reel.caption ?? undefined}
                    playLabel="Play reel"
                    size="md"
                    thumbnail={{
                      src: thumbnailUrl,
                      alt: reel.thumbnail?.alt ?? reel.title ?? "Episode reel",
                      lqip: getThumbnailLqip(reel),
                    }}
                    title={reel.title ?? undefined}
                    videoUrl={reel.videoUrl ?? "#"}
                  />
                );
              })}
            </div>

            {/* Mobile rail */}
            <MobileScrollRail
              ariaLabel="Best moments from this episode"
              indicator="bar"
              indicatorAriaLabel="Best moments carousel position"
              itemCount={validReels.length}
              itemGap={MOBILE_REEL_GAP}
              itemWidth={MOBILE_REEL_WIDTH}
            >
              {validReels.map((reel, index) => {
                const thumbnailUrl = getThumbnailUrl(reel, 800);
                if (!thumbnailUrl) return null;
                return (
                  <div
                    key={reel._key ?? `mobile-reel-${index}`}
                    className="snap-start"
                    style={{ width: `${MOBILE_REEL_WIDTH}px` }}
                  >
                    <ReelThumbnail
                      caption={reel.caption ?? undefined}
                      playLabel="Play reel"
                      size="lg"
                      thumbnail={{
                        src: thumbnailUrl,
                        alt:
                          reel.thumbnail?.alt ?? reel.title ?? "Episode reel",
                        lqip: getThumbnailLqip(reel),
                      }}
                      title={reel.title ?? undefined}
                      videoUrl={reel.videoUrl ?? "#"}
                    />
                  </div>
                );
              })}
            </MobileScrollRail>
          </div>
        </div>
      </div>
    </section>
  );
}
