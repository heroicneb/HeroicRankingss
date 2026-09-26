# Podcast Episode page — Trevor Longino (desktop + mobile)

## Source
- **Figma file key:** `LrfQdM6RTwf95gfkga3tJl`
- **Frames:** desktop `2223:49` "HR - Podcast Single" (1440 × 3904), mobile `2223:723` (390 wide). Light theme only; dark mode follows the site's dark variants.
- **Extracted:** 2026-09-27 via `get_design_context` (both frames) + `get_screenshot` (mobile).
- Earlier notes for the same layout in the old file key: `2026-04-28-podcast-section-01-episode-single-desktop.md` / `-02-…-mobile.md`.
- **Implemented in:** `src/components/pages/podcast/podcast-episode-page.tsx` + `parts/` (hero, key insights + best moments, transcript + share, related), shared card `parts/podcast-episode-card.tsx`. Content seeded by `scripts/seed/podcast-trevor-longino.ts` → `/podcast/trevor-longino`.

## Desktop structure (y in frame)
1. **Hero** `2223:91` at (79, 197), 1281 × 415, `justify-between`, columns vertically centred.
   - Left `2223:92` (gap 40): block gap 10 → pills `EP • 9`, `1h 44min` (bg #F4F4F4, 18/24, px 14 py 6, radius 100); H1 62/80 tracking −1.24 w 430 ("Marketing " solid + "That Actually Works" gradient 226.99°); caption 18/24 "with **Trevor Longino** • Founder, CrowdTamers" (name bold gradient 188.07°). Then paragraph 18/24 w 522.
   - Right `2223:102` 738 × 415.125 radius 20 thumbnail; play glyph `2223:103` 29.56 × 38 gradient triangle with soft shadow (asset `play-shadow.svg` 54.16 × 59.36) centred.
2. **Key Insights panel** `2223:105` at (10, 732), 1420 wide, bg #F4F4F4, radius 40, px 70 py 30, column gap 80 (120 below the hero).
   - Row `2223:106` h 564, `justify-between`: left `2223:107` w 631 `justify-between`: [H2 52/60 w-full (gradient "25 Years of Marketing Lessons" 219.42° + ", Compressed Into One Conversation"), body 18/24, "Ask Podcast AI" outline button (swirl icon 31.46 × 31.88 + 16 Medium, border #998AFF, radius 16, px 20 py 12)] gap 20; bottom: 4 topic pills wrap gap 5 w 596 (bg #0C0C0C, 18/24 white, px 14 py 6). Right `2223:123` w 625: 7 cards gap 10 (bg #F4F4F4, border #E0E0E0, radius 20, p 12, 18/24).
   - **Best Moments card** `2223:139` w 1281 (full), bg white, shadow 0 4 12 rgba(0,0,0,.1), radius 40, p 30, `justify-between`, centred: left w 523 gap 20 (H2 gradient "Best Moments" 213.47° + " From This Episode"; body 18/24); right block 630 × 398.55 with three portrait reels (border #E0E0E0, radius 40): 197 × 350.22 at (0, 48.33), 195.13 × 346.89 at (217, 0) shown with a 50 % black overlay, 197 × 350.22 at (433, 28.33); play triangle 29.56 × 38 centred on each.
   - Panel height 1162.55 → ends 1894.55.
3. **Transcript panel** `2223:154` at (9.5, 1914.56) — **20 px** below the insights panel — 1420 × 436, bg #151419, radius 40, px 70 py 60, gap 40: label "/  Full Episode Transcript  /" 18 tracking −0.36 white; card (border #2A2A2A, radius 40, p 30, gap 20): paragraph 18/24 with **Nebojsa:** bold white + "Read Full Transcript" row (18 px plus glyph + 18/24 #E0E0E0); share row `2223:162` `justify-between`: "Share this podcast" 24 Medium tracking −0.48 + pills gap 8 (bg #F4F4F4, px 20 py 8, radius 20, 16 Medium #151419) | copy glyph 20 + "Copy link to podcast" 16 Medium white (no pill).
4. **More From The Podcast** `2223:177` at (80, 2470.56) — 120 below the panel: label "/  Continue Watching  /", gap 20, H2 52/60 "More From " + "The Podcast" gradient 197.13° (one line, w 561). Cards `2223:180…` at y 2593.56 (**20 px** below): identical to the index cards (413 × 544.61, notch, pills, Ask AI). Sample: Jason Rivera / Sara Miller / Tom Winter.
5. **Footer** `2223:249` at 3257.9 (120 below the cards).

## Mobile structure (`2223:723`, 390 frame, page padding 5, panels 380 wide, 5 px apart)
- Hero `2223:746` px 15 py 60 gap 40 centred: pills (18/24), H1 38/1.2 tracking −0.76 w-full + caption 16/1.3 w 324 (gap 10), paragraph 16/1.3 w 304, thumbnail 350 × 197 radius 20 with the play glyph at (160, 79).
- Insights panel `2223:761` 380 wide radius 40, pt 60 px 15 pb 15, gap 30, centred: H2 28/1.2 tracking −0.56 w 328; body 16/1.3 w 300; Ask Podcast AI button; 4 stacked full-width pills (16 **Medium**, py 6); 7 cards (16/1.3 centred, p 12); Best Moments card `2223:793` 350 wide bg white shadow radius 30 pt 60 px 15 pb 15 gap 30: H2 28 w 230 + body (gap 20); three 320 × 320 reels radius 20 border 0.51 #E0E0E0, gap 5, play glyph centred.
- Transcript panel `2223:807` 380 wide radius 40 px 20 py 60 gap 30 centred: label 18; card p 20 radius 40 gap 20 (18/24 text, expander row); share block gap 20: "Share this podcast" 16/1.3, pills gap 10 (16/1.3 regular), copy row.
- Related `2223:829` px 10 py 40 gap 40: heading centred, cards 350 wide stacked (same as the index page's mobile cards).

## Colour mapping
Light frame only. Dark mode on the site: page #050505, off-white panel → `--color-surface-inverse-10`, white cards → `--color-bg-dark`, gradient highlights → HR Gradient Light via `.dark .gradient-text-podcast-*`.

## Assets
- New in `public/podcast/`: `play-shadow.svg` (hero glyph with shadow), `play.svg` (reel glyph), `transcript-expand.svg` (18 px plus), `copy-link.svg` (20 px copy glyph). Swirl icon reuses `ask-ai.svg`.
- Photos (hero 1280 × 720, reels 2048 × 1288 / 1947 × 1457 / 1606 × 1448) are uploaded to Sanity by the seed script from a local folder, not committed.

## Verification notes
- Sanity had no Trevor Longino document; the seed creates `podcastEpisode-trevor-longino`. Video URL and reel URLs are placeholders (channel URL) until the real links are added in the Studio.
- The 50 % black overlay on the middle reel in the frame reads as a hover/active state; implemented as a hover overlay on every reel rather than a permanently dimmed middle tile.
