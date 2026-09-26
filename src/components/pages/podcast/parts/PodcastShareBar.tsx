"use client";

import { useState } from "react";
import Image from "next/image";

import type { SanityPodcastEpisodeDetail } from "@/lib/sanity-data";
import { SITE_URL } from "@/lib/site";

interface PodcastShareBarProps {
  episode: Pick<SanityPodcastEpisodeDetail, "slug" | "title">;
}

/**
 * Share row inside the transcript panel (Figma 2223:162 desktop / 2223:815
 * mobile): "Share this podcast" + LinkedIn / X / Facebook pills on the left,
 * "Copy link to podcast" with the copy glyph on the right. Mobile stacks
 * everything centred with 20px gaps.
 *
 * Client component: the copy button uses the clipboard API.
 */
export function PodcastShareBar({ episode }: PodcastShareBarProps) {
  const [copied, setCopied] = useState(false);

  const slug = episode.slug?.current ?? "";
  const episodeUrl = slug ? `${SITE_URL}/podcast/${slug}` : SITE_URL;
  const encodedUrl = encodeURIComponent(episodeUrl);
  const encodedTitle = encodeURIComponent(episode.title ?? "");

  const shareLinks = [
    { label: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "X", url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  const handleCopy = async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(episodeUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be blocked; the row stays usable for the share links.
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:gap-5">
        <p className="text-[16px] leading-[1.3] text-[var(--color-hr-pure-white)] lg:text-[24px] lg:font-medium lg:leading-[normal] lg:tracking-[-0.48px]">
          Share this podcast
        </p>
        <div className="flex items-center gap-[10px] lg:gap-[8px]">
          {shareLinks.map((link) => (
            <a
              aria-label={`Share on ${link.label}`}
              className="motion-interactive motion-interactive-press inline-flex items-center justify-center rounded-[20px] bg-[var(--color-hr-off-white)] px-5 py-2 text-[16px] leading-[1.3] text-[var(--color-hr-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)] lg:font-medium lg:leading-[normal]"
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
        className="motion-interactive inline-flex items-center gap-[10px] text-[16px] font-medium leading-[normal] text-[var(--color-hr-pure-white)] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-hr-dark)]"
        onClick={handleCopy}
        type="button"
      >
        <Image alt="" aria-hidden className="size-[20px]" height={20} src="/podcast/copy-link.svg" width={20} />
        <span>{copied ? "Link copied" : "Copy link to podcast"}</span>
      </button>
    </div>
  );
}
