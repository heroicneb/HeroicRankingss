"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { SanityPostDetail } from "@/lib/sanity-data";

interface BlogPostShareBarProps {
  articleUrl: string;
  post: SanityPostDetail;
}

function CopyLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px]"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 11.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-4.95-4.95l-1.06 1.06M11.5 8.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 4.95 4.95l1.06-1.06"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * Share bar at the end of the article body. LinkedIn / X / Facebook share-intent
 * links plus a Copy link to article action.
 *
 * Desktop: inline row, Copy-link right-aligned (Figma 2339:159).
 * Mobile: stacked centered (Figma 2339:233).
 */
export function BlogPostShareBar({ articleUrl, post }: BlogPostShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(post.title);

  const shareLinks = [
    {
      label: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "X",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  const handleCopy = async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Silent fail — clipboard may be blocked. UX shouldn't break.
    }
  };

  const pillBase =
    "motion-interactive motion-interactive-press inline-flex h-[40px] items-center justify-center rounded-[20px] bg-[var(--color-hr-off-white)] px-[18px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]";

  return (
    <section className="mt-[60px] lg:mt-[80px]">
      {/* Divider */}
      <div
        aria-hidden
        className="h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-15)]"
      />

      <div className="mt-[30px] flex flex-col items-center gap-[20px] lg:flex-row lg:justify-between lg:gap-[20px]">
        <div className="flex flex-col items-center gap-[15px] lg:flex-row lg:items-center lg:gap-[20px]">
          <p className="text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] lg:text-[24px] lg:font-medium lg:leading-[28px] lg:tracking-[-0.48px] dark:text-[var(--color-text-inverse)]">
            Share this article
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[10px]">
            {shareLinks.map((link) => (
              <a
                aria-label={`Share on ${link.label}`}
                className={pillBase}
                href={link.url}
                key={link.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <button
          aria-label="Copy link to article"
          className={cn(
            "motion-interactive motion-interactive-press inline-flex h-[40px] items-center gap-[8px] rounded-[30px] bg-[var(--color-hr-off-white)] px-[18px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:bg-[var(--color-surface-inverse-10)] dark:text-[var(--color-text-inverse)]",
          )}
          onClick={handleCopy}
          type="button"
        >
          <CopyLinkIcon />
          <span>{copied ? "Link copied" : "Copy link to article"}</span>
        </button>
      </div>
    </section>
  );
}
