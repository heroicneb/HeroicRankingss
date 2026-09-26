import type { CSSProperties } from "react";
import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { GradientText } from "@/components/ui/gradient-text";
import { cn } from "@/lib/cn";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { urlFor } from "@/sanity/lib/image";

interface PodcastBestMomentsProps {
  reels: SanityPodcastEpisodeDetail["bestMoments"];
}

type Reel = NonNullable<SanityPodcastEpisodeDetail["bestMoments"]>[number];

/** Desktop reel slots from the frame (Figma 2223:145–147): tiered 197×350 portraits inside a 630×398.55 block. */
const DESKTOP_REEL_SLOTS = [
  { left: 0, top: 48.33, width: 197, height: 350.22 },
  { left: 217, top: 0, width: 195.13, height: 346.89 },
  { left: 433, top: 28.33, width: 197, height: 350.22 },
] as const;

function thumbnailUrl(reel: Reel, width: number): string | null {
  if (!reel.thumbnail?.asset) return null;
  try {
    return urlFor(reel.thumbnail).width(width).url();
  } catch {
    return null;
  }
}

function ReelTile({
  reel,
  className,
  sizes,
  style,
}: {
  reel: Reel;
  className?: string;
  sizes: string;
  style?: CSSProperties;
}) {
  const src = thumbnailUrl(reel, 800);
  const label = reel.title?.trim() || "Play reel";
  const inner = (
    <>
      {src ? (
        <Image
          alt={reel.thumbnail?.alt ?? label}
          blurDataURL={reel.thumbnail?.asset?.metadata?.lqip}
          className="object-cover"
          fill
          placeholder={reel.thumbnail?.asset?.metadata?.lqip ? "blur" : "empty"}
          sizes={sizes}
          src={src}
        />
      ) : null}
      <span aria-hidden className="absolute inset-0 bg-[rgba(0,0,0,0)] transition-colors duration-300 group-hover:bg-[rgba(0,0,0,0.5)]" />
      <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image alt="" className="h-[38px] w-[29.56px]" height={38} src="/podcast/play.svg" width={30} />
      </span>
    </>
  );
  const base = cn(
    "group absolute block overflow-hidden border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] dark:border-[var(--color-hr-dark-line)]",
    className,
  );
  return reel.videoUrl ? (
    <AppLink aria-label={label} className={base} href={reel.videoUrl} rel="noopener noreferrer" style={style} target="_blank">
      {inner}
    </AppLink>
  ) : (
    <div className={base} style={style}>
      {inner}
    </div>
  );
}

/**
 * Best Moments card (Figma 2223:139 desktop / 2223:793 mobile), rendered
 * inside the Key Insights panel.
 *
 * Desktop: white card, 30px padding, shadow; 523-wide heading column on
 * the left and three tiered 197×350 reels on the right. Mobile: 350-wide
 * card, 60 / 15 padding, heading + body then 320px square reels stacked
 * 5px apart.
 */
export function PodcastBestMoments({ reels }: PodcastBestMomentsProps) {
  const validReels = (reels ?? []).filter((reel) => Boolean(reel.thumbnail?.asset)).slice(0, 3);
  if (validReels.length === 0) return null;

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center gap-[30px] rounded-[30px] bg-[var(--color-hr-pure-white)] px-[15px] pb-[15px] pt-[60px] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] dark:bg-[var(--color-bg-dark)] lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:rounded-[40px] lg:p-[30px]">
      <div className="flex w-full flex-col items-center gap-5 text-center lg:w-[523px] lg:items-start lg:text-left">
        <h2 className="type-h2 w-[230px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:w-full">
          <GradientText className="gradient-text-podcast-moments">Best Moments</GradientText> From This Episode
        </h2>
        <p className="text-[16px] leading-[1.3] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px] lg:leading-[24px]">
          Whether you&apos;re an early-stage founder looking for your first customers or a seasoned marketer refining your
          playbook, this episode is packed with strategies you can apply right away. Hit play below and dive in!
        </p>
      </div>

      {/* Desktop: tiered portrait reels. */}
      <div className="relative hidden h-[398.55px] w-[630px] shrink-0 lg:block">
        {validReels.map((reel, index) => {
          const slot = DESKTOP_REEL_SLOTS[index] ?? DESKTOP_REEL_SLOTS[0];
          return (
            <ReelTile
              className="rounded-[40px]"
              key={reel._key ?? `reel-${index}`}
              reel={reel}
              sizes="197px"
              style={{ left: slot.left, top: slot.top, width: slot.width, height: slot.height }}
            />
          );
        })}
      </div>

      {/* Mobile: 320px squares stacked. */}
      <div className="flex w-full flex-col items-center gap-[5px] lg:hidden">
        {validReels.map((reel, index) => (
          <div className="relative size-[320px]" key={reel._key ?? `reel-m-${index}`}>
            <ReelTile className="inset-0 rounded-[20px]" reel={reel} sizes="320px" />
          </div>
        ))}
      </div>
    </div>
  );
}
