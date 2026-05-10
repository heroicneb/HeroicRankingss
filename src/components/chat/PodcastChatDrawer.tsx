"use client";

import { useEffect } from "react";

import { cn } from "@/lib/cn";

interface PodcastChatDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Floating chat widget — anchored bottom-right above the launcher button.
 * Glass-morphism shell: translucent dark surface + backdrop blur + subtle
 * gradient ring. Mounted via portal in PodcastChatProvider so it ignores any
 * ancestor `transform`/`filter`/`will-change` containing block. Renders
 * identically over light or dark page bg.
 */
export function PodcastChatDrawer({
  open,
  onClose,
  children,
}: PodcastChatDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed bottom-[88px] right-[16px] z-[80] flex h-[min(620px,calc(100dvh-120px))] w-[min(380px,calc(100vw-24px))] flex-col transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none lg:bottom-[100px] lg:right-[24px]",
        open
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {/* Gradient ring — sits behind the panel for a 1px soft glow border */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-[var(--color-hr-accent)]/40 via-white/10 to-transparent p-[1px]"
      >
        <div className="size-full rounded-[24px] bg-[var(--color-hr-dark)]/80 backdrop-blur-2xl" />
      </div>

      <aside
        aria-label="Podcast chat"
        aria-modal="false"
        className="relative flex size-full flex-col overflow-hidden rounded-[24px] shadow-[0_30px_80px_-12px_rgba(0,0,0,0.6)]"
        role="dialog"
      >
        <button
          aria-label="Close chat"
          className="absolute right-[12px] top-[12px] z-10 flex size-[28px] items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-hr-accent)]"
          onClick={onClose}
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 16 16"
            width="14"
          >
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
        {children}
      </aside>
    </div>
  );
}
