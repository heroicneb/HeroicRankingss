# Reddit Marketing service page — Figma extraction (2026-09-23)

- **File key:** `c9T57PLFisgSWhzLthkJob` (Heroic Rankings - Website (CLAUDE), Nebojsa's copy)
- **Page node:** `0:1` Website
- **Frame:** `1311:48` "HR - Reddit Service Page" — 1440 × 14287 at canvas (202, 454)
- **Route implemented:** `/seo/reddit-marketing/` → `src/components/pages/reddit-marketing/reddit-marketing-page.tsx`
- **Tools used:** `get_metadata` (frame + page), `get_design_context` (per section), `get_screenshot` (frame, 4096 + contents-only 2048), `download_assets` (hero statue). Figma Starter plan tool-call limit was hit after the hero gradient rectangles; `1311:88` (hero title) and `1311:92` (statue rectangle) were NOT fetched via design context and are documented from the screenshot + metadata only.

## Section map (frame-relative y, all 1420 wide at x=10 unless noted)

| # | Node | Name | y | h | Notes |
|---|---|---|---|---|---|
| nav | `1311:49` | Frame 4 | 14 | 69 | site navbar — provided by layout, not implemented here |
| hero | `1311:88` | text "Reddit Marketing Services" | 203 | 80 | x=291 w=857, gradient brand text, H1 |
| hero | `1311:89` | text "Show up in the threads that rank, convert, and shape buyer decisions." | 303 | 60 | x=421 w=598, 2 lines |
| hero | `1311:843` | text "From authentic mentions to rankings to revenue — one thread at a time." | 383 | 24 | Paragraph/Web 18/24 |
| hero | `1311:838` | Frame 30 CTA "Book a Reddit Strategy Call" | 447 | 45 | x=587 w=265; border #998AFF, rounded 16, px20 py12, CTA/Web 16 medium, arrow 10px |
| hero | `1311:92` | Rectangle 99 (statue image fill) | 559 | 635 | full width; raw image 2048×2048 RGBA statue holding Reddit disc, centered, height-fit |
| hero | `1311:90`/`1311:91` | Rectangle 3/4 gradient block | 714 | 480 | rounded 40; `linear-gradient(42.36deg, #151419 35.359%, #4C4AB5 142.03%)` (HR Gradient Dark) |
| 1 | `1313:176` | Frame 177343 "Why Reddit Is Different" | 1204 | 1343 | white, border #F4F4F4, rounded 40, px70 py120; left col w490 (H2 + para w458), right col w630 list of 6 items separated by 1px lines, gap 38 |
| 2 | `1313:197` | Frame 177348 "The Opportunity" | 2557 | 1581 | white, border #F4F4F4, rounded 40, px70 py120, gap 120; H2 w571; 3×2 cards w413 h472/448, bg #F4F4F4 border #E0E0E0 rounded 40 p30 gap20 |
| 3 | `1313:629` | Frame 177356 "What We Do" | 4146 | 1543 | bg #F4F4F4 rounded 40 px70 py120 gap120; header row gap128 (H2 w630, para w522); 8 white cards (3/3/2) p30 gap20, subtitle in brand gradient |
| 4 | `1314:630` | Frame 177357 "Full Service Menu" | 5699 | 694 | bg #151419 rounded 40 px70 py120 gap60, overflow clip; glow vector `278c1.svg` rotated 14.4° at (-172,-111) box 1701×834; 4 cards bg #0C0C0C border #2A2A2A rounded 40 p30 gap30; titles 32px in HR Gradient Light; bullet lists 18/24 white |
| 5 | `1360:1133` | Frame 177378 "What You Win" | 6403 | 1111 | white rounded 40 px70 py120 gap120; header like §3; 4 cards (3 + 1) w413 bg #F4F4F4 border #E0E0E0 |
| 6 | `1320:1197` | Frame 177367 "Our Process" | 7534 | 1680 | bg #F4F4F4 rounded 40 px70 py120 gap20; row gap99: left w551 (H2 w456, para w522), right w630 gap36: 7 numbered steps (number box 50 white border rounded 12, gradient number 32px; H3; "Optional" pill on step 5: border #998AFF rounded 20 px14 py6 14px) |
| 7 | `1360:1278` | Frame 177360 "Reporting" | 9234 | 979 | dark like §4 with same glow; H2 + para; 2×4 cards (#0C0C0C) title gradient-light 32px + para white |
| 8 | loose `1320:1339`…`1320:1368` | "Why Heroic Rankings" | 10353 | ~650 | no container; label x=80; H2 w406 h120; 3×2 grid of title + description (x=110/543/977, w≈300) with vertical 1px lines (`1320:1362`…) left of each column; last cell "Ready to Own Reddit?" + CTA `1320:1368` "Book a Strategy Call" w212 h45 |
| 9 | `1320:1457` | Frame 177377 FAQ | 11134 | 1478 | bg #F4F4F4 rounded 40 px70 py120 gap80; H2 "Frequently Asked / Questions(gradient)"; white container border #E0E0E0 rounded 40 px26 py30 gap30, 6 items, question H3 32px, close-X icon 18px (rotated plus), 1px lines between |
| footer | `1311:367` | Footer Autolayout | 12622 | 670 | site footer — CTA copy: label "/  Get Started  /", H2 "Ready to own your **corner of Reddit?**", body (736 wide) "Reddit is the breakout channel of the moment — and the brands moving now are locking in visibility that gets harder to win every month. Let's map your opportunities and put your brand in the threads that rank, convert, and shape buyer decisions.", CTA "Book a Reddit Strategy Call" |

## Typography (Figma text styles)

- H1 (hero title): not fetched; measured 857×80 → maps to `.type-h1`
- H2/Web: DM Sans 400, 52/60, tracking -1.04 → `.type-h2`
- H3/Web: DM Sans 400, 32/1.2, tracking -0.64 → `.type-h3`
- Section Title/Web: 18/normal, tracking -0.36 → `.type-section-label`
- Paragraph/Web: 18/24 → `.type-paragraph`
- CTA/Web: DM Sans 500, 16 → `.type-cta`
- Footer/Web (pill): 14

## Colors

- HR Dark `#151419` → `--color-hr-dark`
- HR Off White `#F4F4F4` → `--color-hr-off-white`
- HR Light Grey `#E0E0E0` → `--color-hr-light-grey`
- HR Pure White `#FFFFFF` → `--color-hr-pure-white`
- HR Black Box `#0C0C0C` → `--color-hr-black-box`
- HR Dark Line `#2A2A2A` → `--color-hr-dark-line`
- HR Accent `#998AFF` (button borders) → `--color-hr-accent`
- HR Gradient (text): 153,138,255 18.3% → 153,86,175 40.7% → 42,34,96 129.5% → `.gradient-text-brand`
- HR Gradient Light (dark-card titles): #826FFF 18.3% → #E188FF 40.7% → #E1BDFF 129.5% → `--gradient-brand-light` / `.gradient-text-brand-light`
- HR Gradient Dark (hero block): #151419 35.359% → #4C4AB5 142.03% at 42.36°

## Assets saved to `public/reddit-marketing/`

Section 1 icons: `icon-authenticity.svg` (50×50, includes its own box), `icon-moderators.svg` 28×34, `icon-culture.svg` 37×37, `icon-corporate.svg` 35×36, `icon-evergreen.svg` 33×33, `icon-compounds.svg` 25×36.
Section 2 icons: `icon-search-results.svg` 31×32, `icon-ai-quote.svg` 33×36, `icon-handshake.svg` 37×23 + `icon-handshake-spark.svg` 12×15 (composite), `icon-buyer-decision.svg` 31×31, `icon-evergreen.svg`, `icon-window.svg` 32×32.
Section 3 icons: `icon-brand-mentions.svg` 36, `icon-comment-service.svg` 36, `icon-post-creation.svg` 36, `icon-engagement.svg` 38×32, `icon-managed-accounts.svg` 33×36, `icon-reputation.svg` 28×36, `icon-reddit-seo.svg` 37×31, `icon-ai-quote.svg`.
Section 5 icons: `icon-win-rankings.svg` 35×35, `icon-top-comment.svg` 36×31, `icon-handshake.svg`, `icon-shape-ai.svg` 31×36.
Dark sections: `glow.svg` 1868×664.
Hero: `hero-statue.webp` 2048×2048 RGBA (converted from Figma raw PNG `71fe6c34…`).
1px divider lines from the design are rendered as CSS borders (token `--color-hr-light-grey`) rather than the `e8bb8.svg`/`76020.svg`/`71a76.svg` line assets.

## Verification notes

- Visual target: frame screenshot (4096px tall render) — hero statue overflows the gradient block by ~155px at the top; sections are separated by 10px.
- Nav in Figma lists "Reddit Marketing" nowhere explicitly; site nav comes from Sanity `siteSettings.navItems` and must be updated there by an editor.
- FAQ items are hard-coded fallbacks; Sanity `faqItem.servicePage` gained the `reddit-marketing` option so CMS FAQs can override.
