"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

interface PodcastShareBarProps {
  episode: SanityPodcastEpisodeDetail;
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
 * Share bar (Figma `2223:162` desktop / mobile share row inside `2223:807`).
 *
 * Dark panel with "Share this podcast" label and 3 light pills (LinkedIn /
 * X / Facebook) plus a "Copy link to podcast" button with a link icon. On
 * desktop the share label is left-aligned and pills are inline; on mobile
 * everything stacks centered.
 *
 * Marked `'use client'` because the copy-link button uses the clipboard API
 * and tracks a transient "Link copied" state.
 */
export function PodcastShareBar({ episode }: PodcastShareBarProps) {
  const [copied, setCopied] = useState(false);

  const slug = episode.slug?.current ?? "";
  const episodeUrl = slug ? `${SITE_URL}/podcast/${slug}` : SITE_URL;
  const encodedUrl = encodeURIComponent(episodeUrl);
  const encodedTitle = encodeURIComponent(episode.title ?? "");

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
      await navigator.clipboard.writeText(episodeUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Silent fail — clipboard may be blocked. UX should not break.
    }
  };

  const pillBase =
    "motion-interactive motion-interactive-press inline-flex h-[40px] items-center justify-center rounded-[20px] bg-[var(--color-hr-off-white)] px-[18px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)]";

  return (
    <section
      className="px-[20px] pb-[60px] lg:px-[80px] lg:pb-[120px]"
      id="podcast-share"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[30px] bg-[var(--color-hr-dark)] px-[20px] py-[40px] lg:rounded-[40px] lg:px-[60px] lg:py-[60px]">
          <div className="flex flex-col items-center gap-[20px] lg:flex-row lg:justify-between lg:gap-[20px]">
            <div className="flex flex-col items-center gap-[15px] lg:flex-row lg:items-center lg:gap-[20px]">
              <p className="text-[16px] font-medium leading-[20px] text-[var(--color-hr-pure-white)] lg:text-[24px] lg:leading-[28px] lg:tracking-[-0.48px]">
                Share this podcast
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
              aria-label="Copy link to podcast"
              className={cn(
                "motion-interactive motion-interactive-press inline-flex h-[40px] items-center gap-[8px] rounded-[30px] bg-[var(--color-hr-off-white)] px-[18px] text-[16px] font-medium leading-[20px] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)]",
              )}
              onClick={handleCopy}
              type="button"
            >
              <CopyLinkIcon />
              <span>{copied ? "Link copied" : "Copy link to podcast"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
