import { cn } from "@/lib/cn";

export interface PlayButtonOverlayProps {
  /** Pixel size of the circular button. Default 72. */
  size?: number;
  /** Pixel size of the inner play triangle. Defaults to ~38% of `size`. */
  iconSize?: number;
  className?: string;
  /** Aria label, e.g., "Play episode". Default: "Play". */
  ariaLabel?: string;
}

/**
 * Circular white play-button overlay rendered on top of hero/reel imagery.
 * Returns a non-interactive `<span role="img">` so it can be wrapped by an
 * existing `<a>` or `<button>` parent without nested-button violations.
 *
 * Sizes per Figma:
 * - 72×72 hero overlay (`2223:103`)
 * - 66×66 episode-card overlay
 * - 38×38 mobile reel overlay
 */
export function PlayButtonOverlay({
  size = 72,
  iconSize,
  className,
  ariaLabel = "Play",
}: PlayButtonOverlayProps) {
  const resolvedIconSize = iconSize ?? Math.round(size * 0.38);

  return (
    <span
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[var(--color-hr-pure-white)] text-[var(--color-hr-dark)] shadow-[0_4px_24px_rgba(0,0,0,0.25)]",
        className,
      )}
      role="img"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        aria-hidden="true"
        fill="currentColor"
        height={resolvedIconSize}
        viewBox="0 0 24 24"
        width={resolvedIconSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l10.79-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
      </svg>
    </span>
  );
}
