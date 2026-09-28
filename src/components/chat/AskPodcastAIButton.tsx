"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

import type { ChatEpisodeContext } from "./chat-episode";
import { PODCAST_CHAT_OPEN_EVENT } from "./PodcastChatProvider";

interface AskPodcastAIButtonProps {
  className?: string;
  label?: string;
  /**
   * "outline": bordered pill for light/dark page surfaces (default).
   * "outline-inverse": the same pill on an always-dark panel (white text).
   * "inline": the podcast index card row — GPT swirl icon + label, no border.
   */
  variant?: "outline" | "outline-inverse" | "inline" | "pill";
  /** Hide the glyph (the Figma "Try the Chat Widget" button is text only). */
  showIcon?: boolean;
  /** "sparkle": small line star. "swirl": the 31×32 GPT swirl used by the podcast frames. */
  icon?: "sparkle" | "swirl";
  /** When set, the drawer opens scoped to this episode (its transcript, its suggested questions). */
  episode?: ChatEpisodeContext;
  /** Inline variant on an always-dark surface: white text and glyph. */
  inverse?: boolean;
}

/** The podcast hero pill (Figma 2251:68): 24px swirl + 18/24 label on an off-white / dark pill. */
const PILL_CLASS =
  "inline-flex items-center justify-center gap-[10px] rounded-[100px] bg-[var(--color-hr-off-white)] px-[14px] py-[6px] text-[18px] leading-[24px] text-[var(--color-hr-dark)] dark:bg-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]";

function PillContent({ label }: { label: string }) {
  return (
    <>
      <Image alt="" aria-hidden className="dark:brightness-0 dark:invert" height={24} src="/podcast/gpt-icon.svg" width={24} />
      {label}
    </>
  );
}

/**
 * Inline "Ask Podcast AI" trigger. Dispatches a global CustomEvent that the
 * route's <PodcastChatProvider> listens for, opening the chat drawer without
 * prop drilling. Renders nothing when the chat is disabled (env flag off) so
 * the page does not advertise a dead affordance.
 */
export function AskPodcastAIButton({
  className,
  label = "Ask Podcast AI",
  variant = "outline",
  showIcon = true,
  icon = "sparkle",
  episode,
  inverse = false,
}: AskPodcastAIButtonProps) {
  const enabled = process.env.NEXT_PUBLIC_CHAT_ENABLED === "true";

  // WHY: the hero pill is part of the design, so it stays visible (as plain text) even when the chat is off.
  if (!enabled && variant === "pill") {
    return (
      <span className={cn(PILL_CLASS, className)}>
        <PillContent label={label} />
      </span>
    );
  }
  if (!enabled) return null;

  const open = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent<ChatEpisodeContext | undefined>(PODCAST_CHAT_OPEN_EVENT, { detail: episode }));
    }
  };

  if (variant === "pill") {
    return (
      <button
        aria-label="Open the Podcast AI chat"
        className={cn(
          PILL_CLASS,
          // WHY: the pill must read as clickable — on hover it mixes towards the accent, lifts slightly and shows a pointer.
          "motion-interactive motion-interactive-press cursor-pointer transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:bg-[color-mix(in_srgb,var(--color-hr-off-white)_70%,var(--color-hr-accent)_30%)] hover:shadow-[0_4px_14px_rgba(153,138,255,0.35)] dark:hover:bg-[color-mix(in_srgb,var(--color-hr-dark)_60%,var(--color-hr-accent)_40%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
          className,
        )}
        onClick={open}
        type="button"
      >
        <PillContent label={label} />
      </button>
    );
  }

  if (variant === "inline") {
    return (
      <button
        className={cn(
          "motion-interactive motion-interactive-press inline-flex items-center gap-[10px] text-[16px] font-medium leading-[1.3] hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 lg:leading-none",
          inverse
            ? "text-[var(--color-hr-pure-white)] focus-visible:ring-offset-[var(--color-hr-dark)]"
            : "text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]",
          className,
        )}
        onClick={open}
        type="button"
      >
        <Image alt="" aria-hidden className={inverse ? "brightness-0 invert" : "dark:brightness-0 dark:invert"} height={32} src="/podcast/ask-ai.svg" width={31} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      className={cn(
        "motion-interactive motion-interactive-press inline-flex items-center justify-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-[20px] py-[12px] text-[16px] font-medium leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2",
        variant === "outline-inverse"
          ? "text-[var(--color-hr-pure-white)] hover:bg-[color-mix(in_srgb,var(--color-hr-pure-white)_8%,transparent)]"
          : "text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]",
        className,
      )}
      onClick={open}
      type="button"
    >
      {showIcon && icon === "swirl" ? (
        <Image alt="" aria-hidden className="dark:brightness-0 dark:invert" height={32} src="/podcast/ask-ai.svg" width={31} />
      ) : null}
      {showIcon && icon === "sparkle" ? (
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 16 16"
        width="16"
      >
        <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z" />
      </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
}
