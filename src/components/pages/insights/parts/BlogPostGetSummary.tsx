"use client";

import { useState } from "react";

import { AISummaryPills } from "@/components/ui/ai-summary-pills";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface BlogPostGetSummaryProps {
  articleUrl: string;
}

/**
 * Desktop: inline "Get summary" label + 5 outlined AI pills (Figma 2339:72).
 * Mobile: collapsed dropdown card with chevron; pills appear on tap (Figma 2339:223).
 */
export function BlogPostGetSummary({ articleUrl }: BlogPostGetSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Desktop: inline label + pills row */}
      <div className="hidden flex-wrap items-center gap-x-[15px] gap-y-[10px] lg:flex">
        <span className="text-[18px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
          Get summary
        </span>
        <AISummaryPills articleUrl={articleUrl} />
      </div>

      {/* Mobile: collapsed dropdown card */}
      <div className="w-full lg:hidden">
        <button
          aria-controls="blog-get-summary-mobile-pills"
          aria-expanded={isOpen}
          className="motion-interactive motion-interactive-press flex w-full items-center justify-between rounded-[16px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] px-[18px] py-[14px] text-left text-[16px] font-normal leading-[22px] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          <span>Get summary</span>
          <ChevronDownIcon
            className={cn(
              "h-[20px] w-[20px] shrink-0 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </button>

        {isOpen ? (
          <div
            className="mt-[10px] rounded-[16px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-pure-white)] p-[14px] dark:border-[var(--color-border-inverse-15)] dark:bg-[var(--color-bg-dark)]"
            id="blog-get-summary-mobile-pills"
          >
            <AISummaryPills articleUrl={articleUrl} className="justify-center" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
