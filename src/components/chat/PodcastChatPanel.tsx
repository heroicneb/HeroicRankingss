"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/cn";

import { SuggestedChips } from "./SuggestedChips";
import { load, save } from "./chat-storage";

const PER_EPISODE_FALLBACK_PROMPTS = [
  "Summarize the key takeaways",
  "What advice did the guest share?",
  "Tools or platforms they recommended",
  "What would they have done differently?",
  "Quote the most actionable insight",
];

interface PodcastChatPanelProps {
  routeKey: string;
  mode: "global" | "episode";
  episodeId?: string;
  episodeTitle?: string;
  guestName?: string;
  globalSuggestions?: string[];
}

export function PodcastChatPanel({
  routeKey,
  mode,
  episodeId,
  episodeTitle,
  guestName,
  globalSuggestions = [],
}: PodcastChatPanelProps) {
  const [seedMessages] = useState(() => load(routeKey));
  const listEndRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setInput,
    setMessages,
  } = useChat({
    // Same-origin Vercel Edge proxy — see src/app/api/chat/route.ts.
    // The proxy injects the Bearer secret server-side; the browser never
    // sees CHATBOT_SERVER_SECRET. Per docs/CHATBOT_INTEGRATION.md §6.2.
    api: "/api/chat",
    initialMessages: seedMessages,
    body: {
      episodeId: mode === "episode" ? episodeId : undefined,
      podcastName: "Ranking Heroes",
      officialUrl: "https://heroicrankings.com",
    },
  });

  useEffect(() => {
    save(routeKey, messages);
  }, [routeKey, messages]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const suggestions =
    mode === "episode" ? PER_EPISODE_FALLBACK_PROMPTS : globalSuggestions;

  const headline =
    mode === "episode" && episodeTitle ? episodeTitle : "Ranking Heroes AI";
  const subline =
    mode === "episode" && guestName
      ? `with ${guestName}`
      : "Ask anything across the show";

  function pick(q: string) {
    setInput(q);
  }

  function clearConversation() {
    setMessages([]);
    save(routeKey, []);
  }

  return (
    <div className="relative flex h-full flex-col text-[var(--color-hr-pure-white)]">
      <header className="flex items-start gap-[12px] border-b border-white/8 px-[20px] py-[16px] pr-[48px]">
        <span
          aria-hidden
          className="mt-[2px] inline-flex size-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-hr-accent)] to-[#5C46D6] text-white shadow-[0_0_22px_rgba(153,138,255,0.5)]"
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
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-medium leading-tight text-[var(--color-hr-pure-white)]">
            {headline}
          </p>
          <p className="mt-[3px] truncate text-[13px] leading-tight text-[var(--color-hr-pure-white)]/60">
            {subline}
          </p>
        </div>
        {messages.length > 0 ? (
          <button
            className="self-center text-[12px] text-[var(--color-hr-pure-white)]/60 underline-offset-2 hover:text-[var(--color-hr-pure-white)] hover:underline"
            onClick={clearConversation}
            type="button"
          >
            Reset
          </button>
        ) : null}
      </header>

      <div
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent"
        role="log"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col gap-[14px] px-[20px] pb-[14px] pt-[18px]">
            <p className="text-[15px] leading-[22px] text-[var(--color-hr-pure-white)]/80">
              {mode === "episode"
                ? "Ask anything about this episode. Answers cite the transcript."
                : "Ask anything across every episode. Answers retrieve the most relevant moments and quote the guest."}
            </p>
            <SuggestedChips onPick={pick} suggestions={suggestions} />
          </div>
        ) : (
          <ul className="flex flex-col gap-[12px] px-[16px] py-[16px]">
            {messages.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-[16px] px-[14px] py-[10px] text-[15px] leading-[22px] backdrop-blur-sm",
                    m.role === "user"
                      ? "bg-[var(--color-hr-accent)] text-[var(--color-hr-pure-white)] shadow-[0_4px_14px_rgba(153,138,255,0.35)]"
                      : "border border-white/8 bg-white/[0.06] text-[var(--color-hr-pure-white)]",
                  )}
                >
                  {m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    m.content
                  )}
                </div>
              </li>
            ))}
            <div ref={listEndRef} />
          </ul>
        )}

        {error ? (
          <div className="mx-[14px] mb-[12px] rounded-[12px] border border-[var(--color-hr-accent)]/40 bg-[var(--color-hr-black-box)] px-[12px] py-[10px] text-[13px] text-[var(--color-hr-pure-white)]">
            <p>
              {error.message?.includes("Failed to fetch")
                ? "Couldn’t reach the chat. Try again?"
                : "This chat isn’t available right now."}
            </p>
            <button
              className="mt-1 text-[12px] text-[var(--color-hr-accent)] underline-offset-2 hover:underline"
              onClick={() => reload()}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>

      <form
        className="border-t border-white/8 px-[14px] py-[12px]"
        onSubmit={handleSubmit}
      >
        <div className="flex items-end gap-[8px]">
          <textarea
            className="flex-1 resize-none rounded-[14px] border border-white/8 bg-white/[0.04] px-[14px] py-[10px] text-[15px] leading-[22px] text-[var(--color-hr-pure-white)] placeholder:text-[var(--color-hr-pure-white)]/40 backdrop-blur-sm focus-visible:border-[var(--color-hr-accent)]/60 focus-visible:outline-none [&::-webkit-scrollbar]:w-0"
            style={
              {
                scrollbarWidth: "none",
                fieldSizing: "content",
              } as React.CSSProperties
            }
            disabled={isLoading}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim().length > 0)
                  handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder={
              mode === "episode" ? "Ask about this episode…" : "Ask anything…"
            }
            rows={1}
            value={input}
          />
          {isLoading ? (
            <button
              className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] border border-white/8 bg-white/[0.04] text-[var(--color-hr-pure-white)] backdrop-blur-sm hover:bg-white/[0.08]"
              onClick={() => stop()}
              type="button"
              aria-label="Stop"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="12"
                viewBox="0 0 12 12"
                width="12"
              >
                <rect height="12" rx="2" width="12" />
              </svg>
            </button>
          ) : (
            <button
              aria-label="Send"
              className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-[var(--color-hr-accent)] to-[#5C46D6] text-[var(--color-hr-pure-white)] shadow-[0_4px_14px_rgba(153,138,255,0.4)] transition-transform hover:scale-[1.04] disabled:opacity-40 disabled:hover:scale-100"
              disabled={input.trim().length === 0}
              type="submit"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 14 14"
                width="14"
              >
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
