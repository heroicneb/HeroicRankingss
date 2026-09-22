# Chatbot Integration — Heroic Rankings (Vercel/Next.js Site)

> **Audience:** the agent / engineer building the heroicrankings.com Vercel app.
> **Source of truth:** this document + `/Users/pavle/Developer/clients/heroic/chatbot/podcast-chatbot/` (backend repo).
> **Status as of 2026-05-10:** Backend live + publicly reachable at `https://chatbot.heroicrankings.com` via CF Tunnel. All 16 episodes ingested + embedded. `/api/chat` is **Bearer-gated** (server-side proxy required — see §5/§6).

---

## 1. TL;DR — what to build on the Vercel site

You need to wire **two chat surfaces** into the Next.js app. They both call the same backend endpoint with different payloads.

| Surface | Where it appears | Mode | Body field |
|---|---|---|---|
| **Global chat** | All pages of `/podcast` (list, hub, marketing) — and optionally a floating chat button site-wide | RAG over all 16 episode transcripts (pgvector) | omit `episodeId` |
| **Per-episode chat** | Single episode page `/podcast/[slug]` only | Full transcript stuffed into context for that one episode | pass `episodeId` (UUID, see catalog below) |

**Backend:** Express + Vercel AI SDK v4, streams response via Vercel AI SDK protocol (`f:` / `0:` / `e:` / `d:` prefixed frames).
**Frontend lib:** use `@ai-sdk/react` `useChat` hook — it speaks the same protocol natively. Plug-and-play.
**Auth:** `/api/chat` requires `Authorization: Bearer <CHATBOT_SERVER_SECRET>`. Browser cannot have this secret. You MUST proxy through a Vercel Edge route (§6.2). No exceptions.
**Design:** build chat UI using existing Heroic design tokens (Tailwind v4 `:root` vars in `src/app/globals.css`). **Do not** use a Shadow-DOM widget — that path is retired.

---

## 2. Backend deployment facts

| Thing | Value |
|---|---|
| Host | heroic VPS (`46.224.140.247`), service runs as systemd unit `podcast-chatbot.service` under user `deploy` |
| Bind | `0.0.0.0:3003` (internal), service file at `/etc/systemd/system/podcast-chatbot.service` |
| Code path | `/opt/podcast-chatbot/` |
| Env file | `/opt/podcast-chatbot/.env` (do not commit) |
| Node | v20.20.1, `dist/server/index.js` is entrypoint |
| DB | Postgres 17 + pgvector container `podcast-db` (127.0.0.1:5432, separate from heroic main DB) |
| LLM | OpenAI `gpt-4o-mini` for chat, `text-embedding-3-large` reduced to 1536 dims for vectors |
| Public hostname (planned) | `https://chatbot.heroicrankings.com` via Cloudflare Tunnel — **not yet provisioned** |

**Until the tunnel is up,** the backend is unreachable from Vercel. Coordinate with the chatbot owner before assuming a public URL exists.

---

## 3. API contract

All routes prefixed with the public origin (post-tunnel: `https://chatbot.heroicrankings.com`).

### 3.1 `POST /api/chat` — main chat endpoint

**Headers (server-side, set by Vercel Edge route):**
```
Content-Type: application/json
Authorization: Bearer <CHATBOT_SERVER_SECRET>   (server-only env var, NEVER in browser)
```

**Request body:**
```ts
{
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  episodeId?: string,        // UUID — present = per-episode mode
  sessionToken?: string,     // optional, for session budget tracking
  podcastName: 'Ranking Heroes',
  officialUrl: 'https://heroicrankings.com'
}
```

**Response:** streaming, content-type `text/plain` with Vercel AI SDK protocol frames:
```
f:{"messageId":"msg-..."}
0:" Hello"
0:" world"
e:{"finishReason":"stop","usage":{"promptTokens":5499,"completionTokens":10}}
d:{"finishReason":"stop","usage":{...}}
```

`useChat` from `@ai-sdk/react` parses this for you. No manual SSE handling needed.

**Behavior:**
- `episodeId` present → server loads that episode's full transcript into context (per-episode stuffing). High accuracy. Higher token spend (10–30k tokens depending on episode length).
- `episodeId` absent → server runs vector retrieval across all 16 episodes, top-K chunks injected. Lower latency, lower cost, occasional retrieval misses on niche queries.

### 3.2 `GET /api/episodes` — episode catalog

Returns all episodes with id, episode_number, title, guest_name, token_count, etc. Use this to build a `slug → episodeId` lookup in your Sanity content layer or at runtime.

```ts
fetch('https://chatbot.heroicrankings.com/api/episodes')
  .then(r => r.json())
  .then(({ episodes }) => /* map episode_number → id */);
```

### 3.3 `GET /api/episodes/suggestions` — suggested questions

Returns 5 randomized suggested questions for the global chat starter UI. Optional but nice for empty state.

### 3.4 `GET /widget.js`

Legacy Shadow-DOM bundle. **Ignore it.** Native React integration replaces this.

### 3.5 `GET /admin`, `/admin/login`

Admin dashboard for ingesting episodes / managing config. Not for end users. Lives at the chatbot subdomain, gated by `ADMIN_TOKEN` in `.env`. Out of scope for site work.

### 3.6 `GET /health`

`{ status, uptime, memoryMB, db }` — useful for monitoring.

---

## 4. Episode catalog (DB UUIDs ↔ guests)

Use these UUIDs as `episodeId` for per-episode chat. Map your Sanity podcast documents to these IDs. Pavle owns the Sanity schema — recommended approach is to add an `episodeNumber: number` field to the Sanity podcast schema and resolve to UUID at runtime via `/api/episodes`. Alternative: store `chatbotEpisodeId: string` directly in Sanity.

| Ep # | Guest | episodeId (UUID) | Tokens |
|---:|---|---|---:|
| 1 | Nenad Stamenkovic | `aea3aaa3-b90d-4b60-8637-cc493df07bdf` | 12 452 |
| 2 | Nick Vujic | `6c8b61b2-1a03-42ef-bcc5-7d28fcd2e431` | 17 429 |
| 3 | Mihailo Miljkovic | `3a88a7e9-e92f-4a68-8c14-f46a943581b1` | 20 304 |
| 4 | Jonathan Boshoff | `00f08594-a386-4315-85f1-ba069dd54aac` | 16 163 |
| 5 | Peter Rota | `d7b9c077-8825-41c9-9b03-b67e286acf93` | 21 828 |
| 6 | Dimitris Gkiokas | `ca293c41-98b7-4b19-8e13-d831cd2fc735` | 30 273 |
| 7 | Antonio Gabric | `4042a283-e167-4a42-951a-2c3d4d8d3656` | 17 045 |
| 8 | Kevin Lee | `a8365aac-699d-426f-8a4d-2fbf41c5250b` | 17 346 |
| 9 | Trevor Longino (PT1+PT2 merged) | `f3dc85e5-05ea-4634-afc7-c6a0e0fd8270` | 27 742 |
| 10 | Tom Winter | `d80db702-a3d5-4727-b090-03de83a4d5f9` | 14 404 |
| 11 | AEO — Miha & Ali | `cae78c81-f8b2-4337-a8df-1074f80b3209` | 15 021 |
| 12 | Sarra Miller | `3227561b-24a6-46c3-861c-f7a8dcdf9c30` | 13 897 |
| 13 | Slava Rybalka | `6f4a001a-4905-4eaf-9b73-52587ff98930` | 12 388 |
| 14 | Jason Rivera | `561c17b4-28b7-4e1e-aa9f-b8f8dd4a2e20` | 12 720 |
| 15 | Jonathan Bentz | `59a8fbcd-59dd-4576-87dc-d32ae25922bd` | 22 815 |
| 16 | Jakub Rudnik | `f3b7c7d6-4a9f-40de-9711-678dd52c4a5c` | 18 949 |

Podcast id (parent): `ae9dc099-9e9c-4243-8036-d0201e61f751` (slug `ranking-heroes`).

---

## 5. Auth — server-side Bearer secret (REQUIRED)

`/api/chat` is **server-secret-gated**. Calls without a valid `Authorization: Bearer <secret>` return **401**. There is no public token, no CORS-only path, no fallback. The browser must NEVER call `/api/chat` directly.

**Required architecture:**

```
Browser → Vercel Edge route /api/chat → chatbot.heroicrankings.com/api/chat
              ▲                                     ▲
              │ same-origin POST                    │ Authorization: Bearer <secret>
              │ (no CORS, no auth)                  │ (server-only env var)
```

**Vercel env vars (Production + Preview):**
```
CHATBOT_API_URL=https://chatbot.heroicrankings.com
CHATBOT_SERVER_SECRET=<paste from 1Password / Pavle — starts with chatbot_srv_>
```

⚠ **CRITICAL:** `CHATBOT_SERVER_SECRET` is **server-only**. Do **not** prefix with `NEXT_PUBLIC_`. If it leaks into a client bundle, rotate immediately and re-paste new value into Vercel + heroic.

**Why no public token:** the previous design used a `pub_...` token in the browser bundle + CORS allowlist. That stops casual scrapers but leaks the token; a determined attacker spoofs `Origin: https://heroicrankings.com` from `curl` and abuses OpenAI spend at our cost. Server-side Bearer eliminates this — the only entity that can call `/api/chat` is the Vercel server itself, which authenticates by knowing the secret.

**CORS irrelevant:** with the proxy pattern, browser → Vercel is same-origin, so no CORS preflight. Vercel → chatbot is server-to-server, so no CORS at all. The `sites.allowed_domains` table in the chatbot DB is now legacy / unused.

**Public endpoints unaffected (still open):**
- `GET /health` — public status
- `GET /api/episodes` — public listing (needed for slug→UUID mapping)
- `GET /api/episodes/suggestions` — public starter questions
- `GET /api/episodes/:id` — public detail

---

## 6. Recommended frontend implementation

### 6.1 Dependencies

```bash
pnpm add ai @ai-sdk/react
```

The chatbot already speaks the Vercel AI SDK protocol — `useChat` Just Works.

### 6.2 Vercel Edge proxy route (REQUIRED)

Create `src/app/api/chat/route.ts`. This is the **only** place that knows the Bearer secret. It receives same-origin POSTs from the browser and forwards them to the chatbot, injecting the secret server-side.

```ts
// src/app/api/chat/route.ts
export const runtime = 'edge';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL!;
const CHATBOT_SERVER_SECRET = process.env.CHATBOT_SERVER_SECRET!;

export async function POST(req: Request) {
  // Pass body through unchanged; chatbot expects Vercel AI SDK shape.
  const upstream = await fetch(`${CHATBOT_API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CHATBOT_SERVER_SECRET}`,
    },
    body: await req.text(),
    // SSE-style streaming response — let it through.
  });

  // Stream upstream body straight back to the browser.
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
```

### 6.3 Skeleton client component

Place under `src/components/chat/ChatPanel.tsx`. Style with existing tokens / `Button` / typography classes from the design system.

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

interface ChatPanelProps {
  /** When set, chat runs in per-episode mode (full transcript stuffed). */
  episodeId?: string;
  /** For UI personalization on episode pages. */
  episodeTitle?: string;
  guestName?: string;
}

export function ChatPanel({ episodeId, episodeTitle, guestName }: ChatPanelProps) {
  const [open, setOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: '/api/chat', // same-origin Vercel route — NOT direct chatbot URL
      body: {
        episodeId,
        podcastName: 'Ranking Heroes',
        officialUrl: 'https://heroicrankings.com',
      },
      // No auth header — secret lives only in the Edge route on the server.
    });

  // Render with Heroic design system: Button, Drawer, Container, type-* classes.
  // Floating launcher button → drawer panel → message list + input.
  // Streaming partial tokens land in messages[last].content automatically.

  return (
    <div className="...">
      {/* design-system styled chat UI here */}
    </div>
  );
}
```

### 6.3 Where to mount it

| Page | Component usage |
|---|---|
| `src/app/(site)/(pages)/podcast/page.tsx` (podcast hub) | `<ChatPanel />` — global mode |
| `src/app/(site)/(pages)/podcast/[slug]/page.tsx` (episode detail) | `<ChatPanel episodeId={resolvedUuid} episodeTitle={...} guestName={...} />` |
| Optional site-wide footer / floating button | `<ChatPanel />` — global mode |

For the episode detail page, resolve the UUID by either:
- adding `chatbotEpisodeId: string` to the Sanity podcast episode schema and storing the UUID directly, or
- adding `episodeNumber: number` to the Sanity schema and resolving via a one-shot fetch to `/api/episodes` cached server-side.

### 6.4 Streaming UX

`useChat` handles partial-token streaming transparently. The hook gives you:
- `messages` — array of `{ id, role, content }`, where `content` updates token-by-token while the model streams.
- `isLoading` — true while assistant is responding.
- `stop()` — cancel mid-stream.
- `reload()` — retry last user message.

Render `messages` as a list. Auto-scroll on each token. Use the design system's typography classes for chat bubbles.

### 6.5 Suggested-questions starter

Empty-state UX: fetch `/api/episodes/suggestions` once on mount and show 3–5 chips that prefill the input. Only relevant for global mode; per-episode pages can show questions tailored to the episode (the episode row has a `suggested_questions` jsonb column — extend the API or fetch via `/api/episodes/:id` if needed).

---

## 7. Constraints, rate limits, gotchas

- **Rate limit (per IP):** the backend has `chatRateLimit` middleware (Express rate limit) and `enforceSessionBudget`. Numbers live in `server/security/rateLimiter.ts` — read it before tuning.
- **Per-message size:** request body limited to 10 KB on `/api/chat` (long histories are auto-trimmed server-side to ~16 k tokens).
- **History trimming:** server keeps the most recent messages that fit ~16 k tokens. Long conversations silently lose the oldest turns.
- **Auth:** every `/api/chat` call MUST pass `Authorization: Bearer <CHATBOT_SERVER_SECRET>`. Missing or wrong secret → 401. The browser never knows the secret; only the Vercel Edge route does.
- **DB connection:** the chatbot DB (`podcast_chatbot`) is **not** the same DB as the heroic main app. Don't try to query it from Vercel directly — go through the API.
- **Multi-tenancy ready, single-tenant in practice:** the schema supports multiple podcasts/sites, but only "Ranking Heroes" + heroicrankings.com are configured today.
- **Costs:** per-episode mode costs ~10–30 k input tokens per question on `gpt-4o-mini` (~$0.0015–$0.0045 per question). Global RAG mode ~5–6 k input tokens (~$0.0008). At expected widget traffic this is negligible. Prompt caching can drop per-episode cost ~10× on repeat questions about the same episode within 5 minutes — already handled server-side by the OpenAI client.

---

## 8. What's pending (do not block on these — coordinate)

- **CHATBOT_SERVER_SECRET** — get the value from Pavle (1Password / DM). Add to Vercel Production + Preview env (server-only, no `NEXT_PUBLIC_` prefix). Without it, the Edge route returns 401 immediately.
- **Per-episode `suggested_questions`** in DB are empty (`'[]'`). Backend has a route to populate them; not yet run. Site can omit suggested questions on episode pages until they exist, or fall back to a generic prompt.
- **Embed in Sanity:** decide whether to add `chatbotEpisodeId` (UUID) or `episodeNumber` (int) to the podcast schema, then have the studio populate it for all 16 episodes.

---

## 9. What NOT to do

- **Don't call `chatbot.heroicrankings.com/api/chat` directly from the browser.** It will 401 because the browser cannot send the Bearer secret. Always go through the Vercel Edge route.
- **Don't expose `CHATBOT_SERVER_SECRET` as `NEXT_PUBLIC_*`.** That ships it to the browser bundle and defeats the entire design. Server-only env var.
- **Don't use the Shadow-DOM widget bundle** (`/widget.js` from the chatbot). It exists for legacy non-React hosts. The Vercel app is React; build native.
- **Don't query the chatbot DB directly** from Vercel server actions. Use the HTTP API. The DB is on the heroic VPS, not the heroic main app DB.
- **Don't ship without testing per-episode flow** end-to-end. The first deploy should at least verify: episode page → ChatPanel mounts → user message → streaming response cites that episode's content.
- **Don't log the request body** in the Edge route. User messages may contain personal context.

---

## 10. Quick sanity test

Direct chatbot call (replace `<SECRET>` with the value from Pavle):

```bash
curl -N -X POST https://chatbot.heroicrankings.com/api/chat \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <SECRET>' \
  -d '{
    "messages":[{"role":"user","content":"Summarize Trevor Longino on PR for startups."}],
    "episodeId":"f3dc85e5-05ea-4634-afc7-c6a0e0fd8270",
    "podcastName":"Ranking Heroes",
    "officialUrl":"https://heroicrankings.com"
  }'
```

Expected: streaming output with `f:` / `0:` / `e:` / `d:` frames.

Failure decoder:
- `401 Missing bearer token` — you forgot `Authorization` header.
- `401 Invalid bearer token` — secret value wrong; sync with Pavle.
- `Cannot GET` / 5xx — tunnel or backend issue; escalate to chatbot owner.

---

## 11. Contact / ownership

- Chatbot backend repo: `/Users/pavle/Developer/clients/heroic/chatbot/podcast-chatbot/` (local).
- Chatbot deployed at: `/opt/podcast-chatbot/` on heroic VPS.
- This doc lives in the site repo so the agent building the site has it inline. Update it when contracts change.
