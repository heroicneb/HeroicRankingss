import Image from "next/image";

import { AppLink } from "@/components/ui/app-link";
import { PlayButtonOverlay } from "@/components/ui/play-button-overlay";
import { cn } from "@/lib/cn";

export interface ReelThumbnailImage {
  src: string;
  alt: string;
  /** Optional low-quality placeholder data URL for blur-up. */
  lqip?: string;
}

export type ReelThumbnailSize = "lg" | "md" | "sm";

export interface ReelThumbnailProps {
  thumbnail: ReelThumbnailImage;
  /** Tap target — usually a video URL or modal route. */
  videoUrl: string;
  title?: string;
  caption?: string;
  size?: ReelThumbnailSize;
  className?: string;
  /** Aria label for the play button overlay. */
  playLabel?: string;
}

const SIZE_PRESETS: Record<ReelThumbnailSize, { width: number; height: number; play: number }> = {
  // Mobile reel — 320×320 stack (Best Moments mobile)
  lg: { width: 320, height: 320, play: 60 },
  // Desktop reel — 197×350 (Best Moments desktop)
  md: { width: 197, height: 350, play: 56 },
  // Small inline reel
  sm: { width: 160, height: 280, play: 44 },
};

/**
 * Reel card with thumbnail image, centered play overlay, and optional title +
 * caption beneath. Wrapped in an `AppLink` so the entire card is tappable.
 *
 * Used in the podcast Best Moments section. Matches Figma `2223:139` desktop
 * and `2223:761` mobile.
 *
 * Source: docs/figma-cache/extractions/2026-04-28-podcast-section-01-episode-single-desktop.md
 *         docs/figma-cache/extractions/2026-04-28-podcast-section-02-episode-single-mobile.md
 */
export function ReelThumbnail({
  thumbnail,
  videoUrl,
  title,
  caption,
  size = "lg",
  className,
  playLabel = "Play reel",
}: ReelThumbnailProps) {
  const dims = SIZE_PRESETS[size];

  return (
    <AppLink
      aria-label={title ? `${playLabel} — ${title}` : playLabel}
      className={cn(
        "group flex flex-col gap-[12px] motion-interactive motion-interactive-press",
        className,
      )}
      href={videoUrl}
    >
      <div
        className="relative overflow-hidden rounded-[20px] bg-[var(--color-hr-off-white)]"
        style={{ width: `${dims.width}px`, height: `${dims.height}px` }}
      >
        <Image
          alt={thumbnail.alt}
          blurDataURL={thumbnail.lqip}
          className="object-cover"
          fill
          placeholder={thumbnail.lqip ? "blur" : "empty"}
          sizes={`${dims.width}px`}
          src={thumbnail.src}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <PlayButtonOverlay ariaLabel={playLabel} size={dims.play} />
        </span>
      </div>
      {title ? (
        <p className="font-medium text-[var(--color-hr-dark)] type-paragraph">{title}</p>
      ) : null}
      {caption ? (
        <p className="type-paragraph text-[var(--color-hr-grey)]">{caption}</p>
      ) : null}
    </AppLink>
  );
}
