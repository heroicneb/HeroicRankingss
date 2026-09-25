import Link from "next/link";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface PageLinksProps {
  page: number;
  pageCount: number;
  /** Builds the href for a page, e.g. `(n) => n === 1 ? "/case-study/" : `/case-study/?page=${n}``. */
  hrefFor: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Page numbers to show: the first and last, the current one and its
 * neighbours; gaps become an ellipsis (1 … 4 5 6 … 9).
 */
function pageItems(page: number, pageCount: number): Array<number | "gap"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const wanted = new Set([1, pageCount, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => wanted.add(n));
  if (page >= pageCount - 2) [pageCount - 3, pageCount - 2, pageCount - 1].forEach((n) => wanted.add(n));
  const pages = [...wanted].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const items: Array<number | "gap"> = [];
  pages.forEach((n, i) => {
    const previous = pages[i - 1];
    if (previous !== undefined && n - previous > 1) items.push("gap");
    items.push(n);
  });
  return items;
}

const PILL =
  "inline-flex h-[44px] min-w-[44px] items-center justify-center rounded-[100px] px-[14px] text-[18px] font-normal leading-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--color-bg-dark)]";
const PILL_IDLE =
  "motion-interactive motion-interactive-press bg-[var(--color-hr-off-white)] text-[var(--color-hr-grey)] hover:bg-[color-mix(in_srgb,var(--color-hr-off-white)_84%,var(--color-hr-light-grey)_16%)] dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse-60)]";
const PILL_ACTIVE =
  "bg-[var(--color-hr-dark)] text-[var(--color-hr-off-white)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]";
const PILL_DISABLED = "cursor-default opacity-40";

/**
 * Link-based pagination (server component). Every page is a real URL, so it
 * works without JavaScript and is crawlable. Same pill styling as the blog
 * pagination.
 */
export function PageLinks({ page, pageCount, hrefFor, ariaLabel = "Pages", className }: PageLinksProps) {
  if (pageCount <= 1) return null;
  const items = pageItems(page, pageCount);

  return (
    <nav aria-label={ariaLabel} className={cn("flex flex-wrap items-center justify-center gap-[10px]", className)}>
      {page > 1 ? (
        <Link aria-label="Previous page" className={cn(PILL, PILL_IDLE)} href={hrefFor(page - 1)}>
          <ChevronLeftIcon className="size-3" />
        </Link>
      ) : (
        <span aria-disabled className={cn(PILL, PILL_IDLE, PILL_DISABLED)}>
          <ChevronLeftIcon className="size-3" />
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span aria-hidden className="px-1 text-[18px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]" key={`gap-${index}`}>
            …
          </span>
        ) : item === page ? (
          <span aria-current="page" className={cn(PILL, PILL_ACTIVE)} key={item}>
            {item}
          </span>
        ) : (
          <Link aria-label={`Page ${item}`} className={cn(PILL, PILL_IDLE)} href={hrefFor(item)} key={item}>
            {item}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link aria-label="Next page" className={cn(PILL, PILL_IDLE)} href={hrefFor(page + 1)}>
          <ChevronRightIcon className="size-3" />
        </Link>
      ) : (
        <span aria-disabled className={cn(PILL, PILL_IDLE, PILL_DISABLED)}>
          <ChevronRightIcon className="size-3" />
        </span>
      )}
    </nav>
  );
}
