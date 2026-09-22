# Podcast — Vercel vs Figma parity audit (2026-05-09)

Auditor: Claude Opus 4.7. Live Vercel deploy =
`https://heroic-rankings-final.vercel.app/podcast`. Figma episode-single
spec = `docs/figma-cache/extractions/2026-04-28-podcast-section-01-episode-single-desktop.md`
(node `2223:49`). No cached extraction exists for the podcast INDEX page.

---

## Sanity content state

Single GROQ result for `*[_type=="podcastEpisode"]`:

| Field | Value |
|---|---|
| `_id` | `audit-fixture-podcast-episode` |
| `slug.current` | `audit-fixture-podcast-episode` |
| `episodeNumber` | 99 |
| `title` | "Audit Fixture — Building Marketing Programs That Actually Work In 2026" |
| `guest.name` | "Audit Fixture Guest" |
| heroImage / keyInsights / transcript / videoEmbedUrl | all present |
| bestMoments | 6 entries |
| relatedEpisodes | 0 |

**Zero real episodes.** All public list/detail queries gate
`audit-fixture-*` IDs (per `docs/migration/launch-checklist.md` M1 fix),
so the fixture is queryable for tests but invisible on live routes.

---

## Live state

### `/podcast` index — light + dark (1440 desktop)

Renders 2 sections (out of 4 possible):

| Section ID | State |
|---|---|
| `podcast-hero` | ✓ renders — H1 "Podcast for People Who Want to Actually Rank" with gradient on second line, GPT 5.2 chat pill, "Watch on YouTube" button, guest tile carousel |
| `podcast-latest` | ✗ collapses (no episodes) |
| `podcast-episodes` | ✗ collapses (no episodes) |
| `podcast-ai` | ✓ renders — "Ask Anything. Get Answers From Every Episode." panel + speech-bubble decoration + 3 feature cards (Context-Aware Answers / Instant Streaming / Private & Secure) with monochrome SVG icons rendering correctly in both themes |

`+ Built for Podcast Listeners + Ready to grow together` are nested
inside `podcast-ai` and the global footer respectively.

Hero icons + feature-card icons render correctly in dark mode (no
invisible SVGs like the case-study pillar bug). They appear to be inline
SVGs using `currentColor`, not Sanity CDN raster swaps, so they're not
subject to the `dark:invert` workaround.

### `/podcast/audit-fixture-podcast-episode` detail

Returns the Next.js 404 UI as designed — `getPodcastEpisodeBySlug`
filters audit fixtures, returns null, calls `notFound()`. Status code is
HTTP 200 with not-found body (Next 16 + force-dynamic limitation,
documented in launch-checklist).

**This means the episode-single design (Figma `2223:49`) cannot be
visually verified against the live deploy until at least one real
`podcastEpisode` doc is published.** Code review of the components
themselves (`src/components/pages/podcast/parts/*.tsx`) shows the 6
sub-components (Hero, KeyInsights, BestMoments, Transcript, ShareBar,
RelatedEpisodes) match the Figma extraction structurally.

---

## Cross-cutting drift vs case studies

The dark-mode bugs surfaced on case-studies (white hero pills, invisible
pillar icons) **do not apply** to the podcast pages:

- No `MetricTile` usage — podcast hero pills are inline `<span>`s in
  `PodcastEpisodeHero.tsx:64` (Codex confirmed this earlier as
  "podcast hero coupling: safe").
- No Sanity-sourced raster icons inside dark cards — feature icons on
  podcast index appear to use inline SVGs.

No code changes required for podcast parity.

---

## Gaps for launch

### Content (blocking)

1. **Seed at least 1 real `podcastEpisode`** — otherwise
   `/podcast/[slug]` cannot render the Figma `2223:49` design. Required
   fields per schema: `title`, `slug`, `episodeNumber`, `duration`,
   `guest{name, role, company, photo}`, `description`, `heroImage`,
   `videoEmbedUrl`, `keyInsights{heading, body, ctaLabel, topicPills[],
   bullets[]}`, `bestMoments[]` (≥3), `transcript` (portableText),
   `relatedEpisodeIds[]`, `seo`.
2. **Decide visibility of empty index** — current behavior collapses
   the latest+grid sections to nothing, leaving the page hero +
   AI-panel only. Either:
   - (a) Acceptable (page reads like a "coming soon" landing for the
     podcast feature)
   - (b) Hide the entire podcast nav link until content exists
   - (c) Add a placeholder "First episode landing soon" CTA in the
     collapsed slot

### Code (post-launch grade)

- **Podcast INDEX Figma extraction** missing — only the episode-single
  design is cached. If the Figma file has a separate index design
  (likely shows the episode grid + featured-latest pattern), pull it
  and verify the current code matches.
- **`audit-fixture-podcast-episode`** has `episodeNumber: 99` and
  `relatedEpisodes: 0`. When real episodes ship, decide whether to
  delete the fixture or leave it as a smoke-test asset (gate already
  hides it from production).

---

## Artifacts

- `01-podcast-index-light-1440.png` — index, light mode
- `02-episode-fixture-light-1440.png` — fixture detail returns 404 (as
  designed)
- `03-podcast-index-dark-1440.png` — index, dark mode (parity confirmed)
