"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface InsightsPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

/**
 * Page numbers to show: always the first and last, the current one and its
 * neighbours; gaps become an ellipsis. e.g. 1 … 4 5 6 … 9
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

export function InsightsPagination({ page, pageCount, onPageChange }: InsightsPaginationProps) {
  if (pageCount <= 1) return null;
  const items = pageItems(page, pageCount);

  return (
    <nav aria-label="Blog pages" className="mt-10 flex flex-wrap items-center justify-center gap-[10px]">
      <button
        aria-label="Previous page"
        className={cn(PILL, PILL_IDLE, "disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[var(--color-hr-off-white)]")}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        <ChevronLeftIcon className="size-3" />
      </button>

      {items.map((item, index) =>
        item === "gap" ? (
          <span aria-hidden className="px-1 text-[18px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-60)]" key={`gap-${index}`}>
            …
          </span>
        ) : (
          <button
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(PILL, item === page ? PILL_ACTIVE : PILL_IDLE)}
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
          >
            {item}
          </button>
        ),
      )}

      <button
        aria-label="Next page"
        className={cn(PILL, PILL_IDLE, "disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[var(--color-hr-off-white)]")}
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        <ChevronRightIcon className="size-3" />
      </button>
    </nav>
  );
}
