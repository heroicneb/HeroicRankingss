# Podcast Episode Single Page — Desktop

## Source
- **Figma file key:** `7qZIJIngHrkTeaq9nWZkSa`
- **Section node ID:** `2223:49`
- **URL:** https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=2223-49&m=dev
- **Extracted:** 2026-04-28
- **Note:** Pavle initially labeled this as "blog post single desktop" but extraction confirms it's the **podcast episode single** design (talks about "EP • 9", "Marketing That Actually Works with Trevor Longino", "Ask Podcast AI", episode transcripts, "More From The Podcast"). Blog post designs are still pending.

## Page structure (top → bottom)

1. **Navbar** (`2223:50`) — standard nav with **Podcast** active pill (dark `#151419` background)
2. **Hero** (`2223:91`) — two-column layout 1281 wide:
   - **Left column** (487 wide): EP•9 / 1h 44min pills `#F4F4F4` + H1 mixed `Marketing` (black) + `That Actually Works` (gradient, 62/80, tracking -1.24) + "with **Trevor Longino** • Founder, CrowdTamers" caption with bold gradient name + 521 body paragraph
   - **Right column**: 738×415 hero image rounded-[20px] (purple/dark themed thumbnail with episode graphic) + circular play-button overlay (`2223:103` — large white-bordered play icon centered on image)
3. **Key Insights panel** (`2223:105`) — `#F4F4F4` rounded-[40px] panel with two columns:
   - **Left** (631 wide): H2 mixed gradient + black "25 Years of Marketing Lessons, Compressed Into One Conversation" + body + outlined "Ask Podcast AI" button with sparkle icon + 4 dark `#0C0C0C` topic pills (Minimum Viable Sprints / Test-Based Marketing / Funnel Metrics & Benchmarks / Positioning & Messaging)
   - **Right** (625 wide): vertical stack of 7 insight cards, each `#F4F4F4` background with `#E0E0E0` border, rounded-[20px], padding 12, containing 18/24 paragraph with insight text (e.g. "The Minimum Viable Sprint framework — validating messaging with $100 ad tests in 48 hours")
4. **Best Moments** (`2223:139`) — white card rounded-[40px] with shadow, two-column:
   - **Left** (523 wide): H2 mixed `Best Moments` (gradient) + ` From This Episode` (black) + body paragraph
   - **Right**: 3 reel thumbnails in tiered horizontal layout:
     - Thumbnail 1 (197×350) — slight tilt, white bg
     - Thumbnail 2 (195×347) center, dark overlay 50%
     - Thumbnail 3 (197×350) right
     - Each has play icon vector overlay (`imgGroup177148`, `imgGroup177149` — multi-position)
5. **Full Episode Transcript** (`2223:154`) — `#151419` dark panel rounded-[40px], section label "/ Full Episode Transcript /" white + transcript card on `#151419` with `#2A2A2A` border, rounded-[40px], padding 30, containing first paragraph styled with bold "Nebojsa:" prefix in gradient + transcript text + "Read Full Transcript" expand link with arrow icon
6. **Share Bar** (`2223:162`) — same dark panel: "Share this podcast" 24/normal Medium white + 3 light pills (LinkedIn / X / Facebook on `#F4F4F4` bg with dark text) + "Copy link to podcast" with link icon (`imgGroup177075`)
7. **More From The Podcast** (`2223:177`) — section label + H2 mixed `More From` (black) + `The Podcast` (gradient) + 3-card grid:
   - Each card 413 wide, white with `#E0E0E0` border, rounded-[40px]
   - Top: 305 tall image with subtract clip (rounded top corners) + episode pills (EP•14 / duration) overlay + circular play overlay button (white bg 72×72)
   - Below image: H3 32/1.2 episode title + "with **Guest Name**" gradient bold + 18/24 body description + "Ask AI" button with sparkle icon
   - Sample episodes: Organic Growth (Jason Rivera) / SEO, AEO & AI Growth (Sara Miller) / SEO Wind (Tom Winter)
8. **Final CTA Footer** (`2223:249`) — dark panel rounded-[40px] with `#998AFF` border + decorative ellipse blurs, label "/ Start Scaling /" + H2 white + light-gradient mixed "Ready to Elevate Your Online Presence?" + body + outlined "Get Started Today" button + footer rows

## Tokens used

Same palette as case study page. Notable additions on this page:

| Token | Value | Use |
|---|---|---|
| `#998AFF` | accent purple border | Border on outlined CTA buttons + ellipse decoratives |
| HR Gradient | `linear-gradient(~190deg, #998AFF 18%, #9956AF 41%, #2A2260 130%)` | Used on guest names & headings |
| HR Gradient (Bold) | same gradient applied to `font-bold` text | Guest name treatment |

No new color tokens needed — all map to existing project vars.

## Typography

| Style | Font | Use |
|---|---|---|
| H1 hero | DM Sans Regular 62 / 80 | "Marketing That Actually Works" |
| H2 | DM Sans Regular 52 / 60 | Section headings |
| H3 | DM Sans Regular 32 / 1.2 | Episode card titles, transcript "Nebojsa:" prefix size |
| Team & Testimonials | DM Sans Medium 24 | "Share this podcast" |
| Paragraph | DM Sans Regular 18 / 24 | Insight bullets, body |
| Section Title | DM Sans Regular 18 / 100, tracking -0.36 | "/ Section /" labels |
| CTA | DM Sans Medium 16 | Buttons |
| Footer | DM Sans Regular 14 / 100 | Footer rows |

`fontVariationSettings: 'opsz' 14` consistently set on every text node.

## Required Sanity schema for `podcastEpisode` (NEW document type)

This document type does not exist yet in the project. Schema must include:

| Field | Type | Notes |
|---|---|---|
| `title` | string | Hero H1 — split-renderable (some words gradient, others solid) |
| `titleParts` | array of `{text, highlighted: boolean}` | OR: store split parts to drive the dual-color hero |
| `slug` | slug | `/podcast/[slug]` route |
| `episodeNumber` | number | Required, unique. **Fix: current data has 3 entries with `14` — duplicate bug** |
| `duration` | string | "1h 44min", "50 min" |
| `guest` | object `{name, role, company, photo, bio}` OR reference to `teamMember` if internal | "Trevor Longino — Founder, CrowdTamers" |
| `description` | text | Hero subtitle paragraph |
| `heroImage` | image with hotspot | 738×415 hero thumbnail |
| `videoEmbedUrl` | url | YouTube / Vimeo / direct mp4 |
| `keyInsights` | object `{heading, body, ctaLabel, topicPills[], bullets[]}` | The 25 Years section content |
| `bestMoments` | array of `{title, thumbnail, videoUrl, caption?}` | 3 reels minimum (matches Pavle's "imamo dizajn za to da kad otvorimo nekog gosta, imamo ono gde stoje reels i content") |
| `transcriptPreview` | portableText | First paragraph for collapsed view |
| `transcript` | portableText | Full transcript with speaker tags |
| `relatedEpisodeIds[]` | array of references to `podcastEpisode` | "More From The Podcast" — auto-suggest by topic OR manual override |
| `seo` | object | meta title/desc, OG image |

## Verification notes

- ✅ Existing `podcast-page.tsx` has placeholder content with `href="#"` broken nav — needs full Sanity wiring
- ✅ Existing data file `podcast-episodes.ts` has 3 entries with `episodeNumber: 14` — must fix during migration
- ✅ Reels feature confirmed by design — schema field `bestMoments[]` covers it
- ⚠️ Hero image overlay: large play button (`2223:103`, ~106 size, white circular border) needs vector or SVG asset — extract from `imgGroup177147`
- ⚠️ Schema needs careful design: `titleParts[]` vs single `title` — recommend `title` (string) + `titleHighlights` (array of substrings to highlight) so editors don't have to maintain split parts
- ⚠️ Per gap audit: Jason Rivera, Sara Miller appear in both Pavle's existing podcast-episodes.ts and in the Figma sample data — likely fictional placeholders; must confirm real guest list from Pavle before migration
- ⚠️ "Ask Podcast AI" / "Ask AI" buttons reference a chat widget feature that doesn't exist yet — flag as separate feature, not in Sanity scope
