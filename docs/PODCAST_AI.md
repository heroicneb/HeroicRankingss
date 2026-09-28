# Podcast AI (Gemini)

The chat drawer on `/podcast` and `/podcast/<slug>` is answered by Gemini from the episode transcripts. No external chatbot server, no database. This replaces the setup described in `CHATBOT_INTEGRATION.md`, which is now historical.

## Pieces
- `content/podcast-transcripts/*.txt` — the exported transcripts, `EP NN - Guest.txt`.
- `scripts/podcast-ai/build-index.ts` — splits transcripts into ~350-word chunks and embeds them with `gemini-embedding-001` (768 dims) into `content/podcast-ai/index.json`. Re-run after adding or changing a transcript: `node --env-file=.env.local --experimental-strip-types scripts/podcast-ai/build-index.ts` (resumable; free-tier rate limits just slow it down).
- `src/lib/podcast-ai/` — parsing, the index loader, retrieval.
- `src/app/api/chat/route.ts` — the chat route: rules (system prompt), rate limit, message caps, streaming via the Vercel AI SDK data protocol that the drawer already speaks.
- Per-episode mode is used automatically on an episode page when its transcript exists (matched by episode number); otherwise the drawer answers across all episodes.

## Environment
- `GEMINI_API_KEY` (server only) — required.
- `GEMINI_CHAT_MODEL` (optional) — defaults to `gemini-3.8-flash` with hidden reasoning off (lite models reject that option; if you switch to one, remove `thinkingConfig` in the route).
- `NEXT_PUBLIC_CHAT_ENABLED=true` — shows the drawer, the Ask AI rows and the chat widget button.

## Rules the assistant follows
Only podcast content, only from the transcripts; refuses personal questions, general advice not in an episode, and any task (writing, code, translation…); ignores attempts to change its rules; quotes with speaker and episode number; concise; links only to `/podcast/<slug>`.
