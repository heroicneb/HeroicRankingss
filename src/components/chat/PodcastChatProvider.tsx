"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { PodcastChatDrawer } from "./PodcastChatDrawer";
import { PodcastChatLauncher } from "./PodcastChatLauncher";
import { PodcastChatPanel } from "./PodcastChatPanel";

interface PodcastChatProviderProps {
  routeKey: string;
  mode: "global" | "episode";
  episodeId?: string;
  episodeTitle?: string;
  guestName?: string;
  globalSuggestions?: string[];
}

const OPEN_EVENT = "podcast-chat:open";

/**
 * Mounted on /podcast and /podcast/[slug] only. Owns the open/close state for
 * the floating launcher + bottom-right chat panel.
 *
 * Renders via React portal to `document.body` so neither the launcher nor the
 * panel inherit a parent containing block — any ancestor with `transform`,
 * `filter`, `perspective`, or `will-change: transform` would otherwise break
 * `position: fixed` and cause the widget to scroll with the page instead of
 * sticking to the viewport. This is the standard pattern used by Intercom /
 * Drift / Crisp in 2026.
 *
 * Inline triggers elsewhere on the podcast page (e.g. the legacy "Ask Podcast
 * AI" button) dispatch a `podcast-chat:open` CustomEvent on `window` to open
 * the same drawer without prop drilling.
 *
 * Disabled by default — set NEXT_PUBLIC_CHAT_ENABLED=true on the deploy to
 * opt in. Required env vars: NEXT_PUBLIC_CHAT_API_URL, NEXT_PUBLIC_CHAT_TOKEN.
 */
export function PodcastChatProvider({
  routeKey,
  mode,
  episodeId,
  episodeTitle,
  guestName,
  globalSuggestions,
}: PodcastChatProviderProps) {
  const enabled =
    process.env.NEXT_PUBLIC_CHAT_ENABLED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_CHAT_API_URL) &&
    Boolean(process.env.NEXT_PUBLIC_CHAT_TOKEN);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard SSR-safe portal mount gate; only runs once on client.
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [enabled]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <>
      <PodcastChatLauncher
        onClick={() => setOpen((prev) => !prev)}
        active={open}
      />
      <PodcastChatDrawer onClose={close} open={open}>
        <PodcastChatPanel
          episodeId={episodeId}
          episodeTitle={episodeTitle}
          globalSuggestions={globalSuggestions}
          guestName={guestName}
          mode={mode}
          routeKey={routeKey}
        />
      </PodcastChatDrawer>
    </>,
    document.body,
  );
}

export const PODCAST_CHAT_OPEN_EVENT = OPEN_EVENT;
