"use client";

interface PodcastChatLauncherProps {
  onClick: () => void;
  active?: boolean;
}

export function PodcastChatLauncher({
  onClick,
  active = false,
}: PodcastChatLauncherProps) {
  return (
    <button
      aria-expanded={active}
      aria-label={active ? "Close podcast chat" : "Open podcast chat"}
      className="motion-interactive motion-interactive-press fixed bottom-[16px] right-[16px] z-[70] flex size-[56px] items-center justify-center rounded-full bg-[var(--color-hr-accent)] text-[var(--color-hr-pure-white)] shadow-[0_8px_24px_rgba(153,138,255,0.45)] transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)] focus-visible:ring-offset-2 lg:bottom-[24px] lg:right-[24px] lg:size-[60px]"
      onClick={onClick}
      type="button"
    >
      {active ? (
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.4"
          viewBox="0 0 16 16"
          width="18"
        >
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          fill="none"
          height="22"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="22"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )}
    </button>
  );
}
