# Podcast Chat Widget — Design (2026-05-09)

**Status:** Design approved by Pavle 2026-05-09. Implementation pending.
**Source of truth for backend:** `docs/CHATBOT_INTEGRATION.md`.
**Backend status:** built + ingested (16 episodes), CF Tunnel pending — UI wiring can land before public DNS is up.

## Goal

Wire two chat surfaces into the Vercel Next.js site so visitors can converse with the Ranking Heroes podcast content:

- `/podcast` (hub): RAG over all 16 episode transcripts.
- `/podcast/[slug]` (single): full-transcript context for that one episode.

Floating launcher + right-side drawer pattern. Available **only** on podcast routes.

## EARS requirements

1. **(Ubiquitous)** The system **shall** expose a floating chat launcher button on `/podcast` and `/podcast/[slug]` routes only.
2. **(Event-driven)** **When** the user clicks the floating launcher OR any existing "Ask Podcast AI" / "Ask AI" trigger on a podcast page, the system **shall** open a right-side drawer containing the chat panel.
3. **(State-driven)** **While** the chat panel is mounted on `/podcast`, requests to `/api/chat` **shall** omit `episodeId` (global RAG over 16 episodes).
4. **(State-driven)** **While** the chat panel is mounted on `/podcast/[slug]`, requests **shall** include the `chatbotEpisodeId` UUID resolved from the Sanity `podcastEpisode` document (per-episode full-transcript mode).
5. **(Event-driven)** **When** the drawer mounts with no prior session conversation, the system **shall** render 3–5 suggested-question chips: from `/api/episodes/suggestions` on `/podcast`, hand-written fallback prompts on `/podcast/[slug]`.
6. **(State-driven)** **While** a conversation is in progress, the system **shall** persist the message list to `sessionStorage` under a route-scoped key; on drawer reopen with the same key, prior messages restore. Tab close clears.
7. **(Unwanted behavior)** **If** `/api/chat` returns a network error or non-2xx, the system **shall** surface an inline error in the chat panel with a retry button — never silent fail.
8. **(Optional)** **Where** a `podcastEpisode.chatbotEpisodeId` is empty in Sanity, the per-episode chat **shall** fall back to global mode rather than throwing.
9. **(Ubiquitous)** The system **shall** consume only existing Heroic design tokens (`--color-hr-*`, `--radius-*`, `--font-*`) and primitives (`Button`, `SectionLabel`); zero raw hex.

## Architecture

```
Vercel Next.js (heroicrankings.com)
├── app/(site)/(pages)/podcast/
│     ├── page.tsx              ← <PodcastChatProvider mode=global>
│     └── [slug]/page.tsx       ← <PodcastChatProvider mode=episode episodeId={...}>
├── components/chat/
│     ├── PodcastChatProvider.tsx     (client, owns open/close + sessionStorage glue)
│     ├── PodcastChatLauncher.tsx     (client, fixed bottom-right)
│     ├── PodcastChatDrawer.tsx       (client, right slide-in)
│     ├── PodcastChatPanel.tsx        (client, useChat + message list + input)
│     ├── SuggestedChips.tsx          (client, pre-fill chips)
│     └── chat-storage.ts             (sessionStorage helpers, route-scoped keys)
├── lib/sanity-data.ts                +chatbotEpisodeId on SanityPodcastEpisodeDetail
└── sanity/schemaTypes/documents/podcastEpisode.ts +chatbotEpisodeId field

env (Vercel):
  NEXT_PUBLIC_CHAT_API_URL=https://chatbot.heroicrankings.com
  NEXT_PUBLIC_CHAT_TOKEN=pub_423f40f2899f6b0cca10ccfb1d870c39
```

Browser → `chatbot.heroicrankings.com/api/chat` direct (no Vercel proxy — CORS allowlisted, X-Site-Token gates per backend doc §9).

## Component contracts

```ts
// PodcastChatProvider
type Props = {
  mode: 'global' | 'episode';
  episodeId?: string;
  episodeTitle?: string;
  guestName?: string;
};
// State: { open: boolean }; setOpen via launcher onClick
// Restores conversation from sessionStorage on mount

// PodcastChatLauncher
// fixed bottom-right, bg-[var(--color-hr-accent)], size 64, rounded-full, shadow-lg
// Props: { onClick: () => void }

// PodcastChatDrawer
// right slide-in: translate-x-full → translate-x-0, 300ms cubic-bezier
// reduced-motion: opacity-only
// Width: 100vw mobile, 480px tablet, 560px desktop
// ESC closes, overlay click closes
// Props: { open; onClose; children }

// PodcastChatPanel
// useChat({
//   api: `${NEXT_PUBLIC_CHAT_API_URL}/api/chat`,
//   body: { episodeId, podcastName: 'Ranking Heroes', officialUrl: 'https://heroicrankings.com' },
//   headers: { 'X-Site-Token': NEXT_PUBLIC_CHAT_TOKEN },
//   initialMessages: chatStorage.load(routeKey),
//   onFinish: () => chatStorage.save(routeKey, messages),
// })
// Props: { mode; episodeId?; episodeTitle?; guestName?; suggestions: string[]; routeKey: string }

// SuggestedChips
// Renders only when messages.length === 0
// Props: { suggestions: string[]; onPick: (q: string) => void }
```

## Data flow

```
Sanity Studio editor pastes UUID into chatbotEpisodeId field
                │
                ▼
groq PODCAST_EPISODE_BY_SLUG_QUERY adds chatbotEpisodeId
                │
                ▼
SanityPodcastEpisodeDetail.chatbotEpisodeId?: string
                │
                ▼
app/(site)/(pages)/podcast/[slug]/page.tsx (server component) reads value
                │
                ▼
<PodcastChatProvider mode={ep.chatbotEpisodeId ? 'episode' : 'global'}
                     episodeId={ep.chatbotEpisodeId}
                     episodeTitle={ep.title}
                     guestName={ep.guest?.name} />
                │
                ▼
PodcastChatPanel useChat() body.episodeId = props.episodeId
                │
                ▼
POST chatbot.heroicrankings.com/api/chat (streaming)
```

For `/podcast` hub: server-side fetch `/api/episodes/suggestions` via React `cache()` + `revalidate=3600`, hydrates `<SuggestedChips suggestions={...} />`.

For `/podcast/[slug]`: hand-written fallback prompts (per-episode `suggested_questions` jsonb is empty per backend doc §8). Recommended fallback prompts:

```ts
const PER_EPISODE_FALLBACK_PROMPTS = [
  'Summarize the key takeaways from this episode',
  'What advice did the guest give for first-time founders?',
  'What tools or platforms did they recommend?',
  'What would they have done differently?',
  'Quote the most actionable insight from this conversation',
];
```

## Drawer UX

| Element | Treatment |
|---|---|
| Open transition | `translate-x-full → translate-x-0`, 300ms cubic-bezier; reduced-motion: opacity-only |
| Header | episode title + guest avatar (episode mode) OR "Ask Ranking Heroes" + GPT 5.2 chip (global mode); close X (top-right) |
| Message list | user bubble = `bg-[var(--color-hr-accent)]` right-align white text; assistant = `bg-[var(--color-hr-off-white)]` left-align dark text + markdown via `react-markdown` |
| Streaming | partial token append in-place, auto-scroll on each chunk via `useEffect` watching `messages[last].content` |
| Input | textarea auto-resize, Enter=send, Shift+Enter=newline, Cmd/Ctrl+K focuses input |
| Suggested chips | only render when `messages.length === 0` |
| Footer | "Powered by Heroic Rankings AI · GPT-4o-mini" small-print |
| Mobile | full-screen sheet, slide-up from bottom; respects `safe-area-inset-bottom` |
| Dark mode | drawer surface = `--color-bg-dark`, bubble swaps per existing theme tokens |

## Error handling

- `useChat` exposes `error: Error | undefined`.
- On error: inline alert above input + Retry button calling `reload()`.
- "Failed to fetch" → "Couldn't reach the chat. Try again?"
- Non-2xx (CORS / token reject) → "This chat isn't available right now."
- Stop button while `isLoading` → calls `stop()` (already in useChat).

## Testing approach

| Phase | When | What |
|---|---|---|
| 1 | now (pre-tunnel) | Wire UI + Sanity schema. Mock `useChat` via a fixture handler. Visual QA in dev. |
| 2 | post-tunnel | Swap mock → real endpoint. Run §10 smoke test from CHATBOT_INTEGRATION.md. |
| 3 | post-launch | Playwright spec: open drawer → ask → stream receives → close, both modes. |

Backend not testable from Vercel until CF tunnel is up. Coordinate with chatbot owner before §10 smoke test.

## Validation

| EARS req | Design coverage |
|---|---|
| 1 launcher only on `/podcast/*` | Provider mounted only in those `page.tsx` files |
| 2 click → drawer | Launcher onClick + existing "Ask AI" buttons → setOpen(true) |
| 3 `/podcast` global mode | mode='global', body.episodeId omitted |
| 4 `/podcast/[slug]` per-episode | mode='episode' + episodeId from Sanity |
| 5 suggested chips | SuggestedChips component, dual source path |
| 6 session-scoped persistence | chat-storage.ts with routeKey |
| 7 error surfacing + retry | Error handling section |
| 8 fallback when chatbotEpisodeId blank | Provider mode logic |
| 9 design tokens only | Component contracts + drawer UX explicit |

No gaps. No scope creep beyond requirements.

## Open coordination items

- **CF Tunnel** at `chatbot.heroicrankings.com → 127.0.0.1:3003`: pending chatbot owner. UI wiring can ship + flag-gate the drawer until tunnel is live.
- **Sanity content task** (post-implementation): Pavle pastes 16 UUIDs into `chatbotEpisodeId` field, one per episode. Mapping in CHATBOT_INTEGRATION.md §4.
- **`/api/episodes/suggestions`** content: backend has the route; verify it returns 5 questions before launch.
- **Per-episode `suggested_questions` jsonb** in DB are empty per backend doc §8. Either fall back to hand-written prompts (this design's choice) or have backend populate them — defer.

## Implementation order (when ready)

1. Add `chatbotEpisodeId` field to Sanity `podcastEpisode` schema + extend GROQ query + extend `SanityPodcastEpisodeDetail` type.
2. Add env vars to Vercel (production + preview).
3. Install `ai` + `@ai-sdk/react` + `react-markdown`.
4. Create `components/chat/` files in dependency order: chat-storage → SuggestedChips → PodcastChatPanel → PodcastChatDrawer → PodcastChatLauncher → PodcastChatProvider.
5. Mount provider in `podcast/page.tsx` + `podcast/[slug]/page.tsx`.
6. Wire existing "Ask Podcast AI" / "Ask AI" trigger buttons to provider's open state.
7. Visual QA in dev with mocked endpoint, then ship behind a `NEXT_PUBLIC_CHAT_ENABLED` flag.
8. Post-tunnel: flip the flag.
