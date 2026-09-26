# Podcast Index — full page (dark + light, desktop + mobile)

## Source
- **Figma file key:** `LrfQdM6RTwf95gfkga3tJl`
- **Frames:**
  - Dark desktop `2251:28` (1440 × 4190) — primary geometry source
  - Dark mobile `2251:475` (390 wide)
  - Light desktop `2223:283` (screenshot only — colour mapping)
  - Light mobile `2223:514` (screenshot only)
- **Extracted:** 2026-09-27 via `get_metadata` + `get_design_context` (dark desktop, dark mobile) + `get_screenshot` (light desktop 2400px, light mobile, card cutout `2251:106`)
- **Implemented in:** `src/components/pages/podcast/podcast-page.tsx`, gradient classes in `src/app/globals.css` (`gradient-text-podcast-*`)

## Page structure (desktop, y in frame)

1. **Navbar** `2251:29` — site nav (already shared).
2. **Hero** `2251:62` — column 665 wide centred at y 203: H1 62/80 tracking −1.24 ("Podcast for People Who" solid + "Want to Actually Rank." gradient 214.74°), gap 20, paragraph 18/24 w 483, gap 20, pill row gap 5: `15+ Episodes` (bg #151419 dark / #F4F4F4 light), `GPT 5.2 Chat` (icon 23.68×24 + text), `Watch on Youtube` (white bg, YouTube mark 22×15.46). Pills 18/24, px 14 py 6, radius 100.
   - Guest photos `2251:76–80`: five 200×200 squares radius 40, shadow 0 4 14 rgba(0,0,0,.18), rotations −9.51 / −4.29 / 0 / 7.69 / 13.96°, square lefts inside the 1280 container 200 / 360 / 540 / 746.78 / 928.27, tops 33 / 14 / 0 / 14 / 27; row top y 607 (120 below the text block).
3. **Latest Episode** `2251:81` — panel 1280 × 540 at (80, 975.27), radius 40, gradient 48.69° #151419 35.36% → #4C4AB5 142.03% (same recipe in light mode). Text column `2251:83` at (120, 1015) w 482, gap 20: label "/  Latest Episode  /" 18 tracking −0.36 white; title 52/60 tracking −1.04 **HR Gradient Light** (207.72°) uppercase "SEO GROWTH"; "with **Jonathan Bentz**" 18 tracking −0.36 (name bold, light gradient 191.39°); quote 18/24; pills outlined #F4F4F4 (`EP • 15 • Part 1`, `52 min`). Arrow button `2251:94` 72 white at (120, 1403) = 40 from left/bottom. Image `2251:82` 607.75 × 500 at right 20 / top 20, radius 40, shadow.
4. **Episodes** `2251:100` — heading block at y 1635 (120 below panel): label "/  Episodes  /", gap 20, H2 52/60 w 561 "Every Conversation, " + "One Place" gradient 211.65°. Cards start y 1818 (**20 px** below the heading block).
   - Card `2251:103–105`: 413 × 544.61, radius 40, dark: bg #0C0C0C border #2A2A2A; light: bg white border #E0E0E0. Three columns, gap 20.
   - Image "Subtract" 413 × 305 with rounded top corners and a **notch** cut from the bottom-right corner (≈112 × 110, inner radius ≈40, 20 px concave fillets) so the 72 px white arrow (`2251:115`, at right 20 / bottom 20 of the image) sits inside the card colour.
   - Pills `2251:157` white bg dark text at top 20 / right 20 (`EP • 14`, `50 min`).
   - Text `2251:133` at left 20 / top 325, w 373, gap 20: title 32/1.2 tracking −0.64; "with **Guest**" 18/24 bold gradient; description 18/24 w 359; "Ask AI" row = swirl icon 31.46 × 31.88 + 16 Medium, gap 10.
   - Sample content: Organic Growth / Jason Rivera (50 min) · SEO, AEO & AI Growth / Sara Miller (59 min) · SEO Wind / Tom Winter (57 min). Card images = `public/podcast/episode-1..3.png` (826 × 610 exports of the same crops).
5. **Podcast AI** `2251:172` — panel 1420 × 1028 at (6, 2482) radius 40 bg #151419, diagonal vector `2251:205` 1700 × 834 at (−181, −181) rotated 14.4°. Text column `2251:207` at 120 from top, 70 in from the panel edge, w 750: label, H2 52/60 w 630 ("Ask Anything." light gradient 208.76° + rest white), paragraph 18/24 w 522, **"Try the Chat Widget"** outlined button (#998AFF border, radius 16, px 20 py 12, 16 Medium). Chat bubble `2251:214` 402.9 × 345 at x 955.6 (gap 125). "Built for Podcast Listeners **Who Want More**" 32/1.2 (light gradient 185.8°) at 569 from top, w 624, + paragraph. Feature row at 724: three flex-1 columns gap 60: 50 px icon tile (radius 12, border #E0E0E0, bg #151419), gap 20, 32/1.2 title, gap 20, 18/24 paragraph.
6. **Footer CTA** `2251:215` — shared footer.

## Mobile (390 frame, `2251:475`)
- Page padding 5; hero px 15 py 60: H1 38/1.2 tracking −0.76 w 350; paragraph 16/1.3 w 324; **three pills stacked full width** (w 350, gap 5); photo row: five 76.39 px squares radius 15.28 at bounding-box lefts 0 / 64.15 / 135.65 / 199.63 / 257.43 (tops 6.86 / 2.71 / 0 / 0.69 / 2.26) with the same rotations.
- Latest panel: w 380 radius 30, vertical gradient (#151419 4.89% → #4C4AB5 193.64%), px 15 pt 60 pb 15, everything centred, gap 40: label 16 tracking −0.32; title 52/60 w 350 (same size as desktop); guest 18/1.3; quote 16/1.3 w 300; pills; image 350 × 350 radius 40 with a 60 px arrow inset 20.
- Episodes: py 60, heading centred w 294 (label 16, H2 28/1.2 tracking −0.56), cards stacked gap 10: 350 × 544.61, image 305 fully rounded 40 (no notch), arrow 66.28 at (269.4, 215.86), pills top 20 right 20, text at (17, 325) w 316: title 22 tracking −0.44, guest 16/1.3, description 16/1.3, Ask AI 16/1.3.
- Podcast AI: radius 30, py 60, gap 60, all centred: text w 294 (label 16, H2 28/1.2 with "Ask Anything." on its own line, paragraph 16/1.3, full-width button), bubble 296 × 254, "Built for…" w 332 + paragraph w 294, features stacked gap 30 (icon, 22 title gap 15, 16 paragraph w ≈230).

## Colour mapping (light ↔ dark)
| Element | Light `2223:283` | Dark `2251:28` |
|---|---|---|
| Page bg / text | white / #151419 | #050505 / white |
| Hero pills | #F4F4F4 (YouTube pill #151419) | #151419 (YouTube pill white) |
| Heading highlights (hero, "One Place", card guest names) | HR Gradient (purple) | HR Gradient Light |
| Latest panel, AI panel | identical dark gradient / #151419, light gradient highlights | same |
| Episode card | white, border #E0E0E0 | #0C0C0C, border #2A2A2A |

## Verification notes
- All assets already existed under `public/podcast/` (guest-1..5, episode-1..3, gpt-icon, youtube-icon, ask-ai, chat-bubble, diagonal-vector, icon-*). No new downloads needed.
- The card notch is drawn in CSS (card-coloured block + two radial-gradient fillets) instead of the baked "Subtract" PNGs so CMS images work.
- Sanity has no real episodes yet (only the excluded audit fixture); the frame's episodes render as the fallback so sections 2 and 3 are always present.
