"use client";

import { cn } from "@/lib/cn";

import { PODCAST_CHAT_OPEN_EVENT } from "./PodcastChatProvider";

interface AskPodcastAIButtonProps {
  className?: string;
  label?: string;
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
}: AskPodcastAIButtonProps) {
  if (process.env.NEXT_PUBLIC_CHAT_ENABLED !== "true") return null;

  return (
    <button
      className={cn(
        "motion-interactive motion-interactive-press inline-flex items-center gap-[10px] rounded-[16px] border border-[var(--color-hr-accent)] bg-transparent px-[20px] py-[12px] text-[16px] font-medium leading-none text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-off-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-10)]",
        className,
      )}
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(PODCAST_CHAT_OPEN_EVENT));
        }
      }}
      type="button"
    >
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
      <span>{label}</span>
    </button>
  );
}
