# Case Study Template — desktop light / dark / mobile (2026-09-26)

## Source
- File key: `LrfQdM6RTwf95gfkga3tJl` (Nebojsa's copy of "Heroic Rankings - Website")
- Desktop light: node `2255:878` "HR - Case Study Single Page" (1440×11414)
- Desktop dark: node `2255:1899` (same layout, dark tokens)
- Mobile: node `2255:1378` (390×11433) — see 2026-04-28-case-study-section-02-single-mobile.md
- Calls made: `get_screenshot` ×3 (2255-878, 2255-1378, 2255-1899), `get_metadata` (2255-878), `get_design_context` (2255-878, truncated by the tool after the proof cards; the remaining sections were taken from metadata + the 2026-05-05 extraction)
- Assets: 52 files downloaded from the design-context response; icons and analytics screenshots uploaded to Sanity for the `diy-craft-ecom-brand` document via `scripts/seed/case-study-diy-ecom-brand.mjs`. Four screenshots were pixelated where they showed the client's domain / account name (NDA).

## Page geometry (desktop, content column 1280 @ x=80; panels 1420 @ x=10)
| Section | Top | Notes |
|---|---|---|
| Hero | 203 | centred column 665; H1 62/80 tracking -1.24, gradient first line + `<br>` + solid `#050505`; subtitle 18/24 w483 20px below. No eyebrow. |
| Metric pills | 471 | centred row, gap 10; pill `#F4F4F4` r20 px40 py12; value 24 Medium light-gradient tracking -0.48; label 18/24 |
| Image strip | 670 | 1420×684 r40, `linear-gradient(52.4159deg, #151419 35.359%, #4C4AB5 142.03%)` |
| Case overview | 1474 | label 18 tracking -0.36 (`/  Case Overview  /`), H2 52/60 w561 two-tone (gradient trailing), body 18/24 full width, gaps 20 |
| Objective & challenges | 1921 | panel `#F4F4F4` 1420×803 r40, padding 120/70; left col 551 (label, H2, body w522), right col 630 @ x=730: 3 rows (50px badge r12 border `#E0E0E0` + gradient 32px number, title 32/1.2, body 18/24) with `#E0E0E0` dividers, row gap 36 |
| Six pillars | 2844 | label; header row @2887: H2 w413 (gradient "Six Pillars" leading) + body w630 right; grid @3127: 3×2 cards 413×403 r40 white border `#E0E0E0` p30; icon tile 50 r12 (icon 34), title 32 (mt 25), intro 18/24 (mt 16), disc bullets (mt 15, gap 5, indent 27) |
| Journey | 4073 | panel `#F4F4F4` 1420×781; label @+120, H2 +20; timeline: 2px `#E0E0E0` line @4431 across 1280, 30px dots at x 80/345.8/611.5/877.3/1143 (first = brand gradient fill, rest `#E0E0E0`); titles 32/1.2 @+40 (80px slot), body 18/24 w217 |
| Numbers that matter | 4874 | dark panel `#151419` 1420×1916.5 (gap 20 after journey); label white; H2 w325 (light gradient on 2nd line) + body w847 @x513; cards @5277: 4×2, 305×405, `#0C0C0C` border `#2A2A2A` r40, centred: icon tile 80 (`#151419`, border `#E0E0E0`, icon ~44) → number 80 ExtraBold light-gradient (mt 40) → label 32 white (90px slot) → sub 18 light-gradient; chart @6187 inside the panel |
| Growth chart | 6187 | title 32 white + legend pills right (border `#535353`, bg white 2%, r10, px12 py8, 12px dot, 18px text); plot 1064×308 grid `#2A2A2A`; left axis 0–70k "Organic Traffic", right axis 0–700 "Domains / DR" (axis titles light-gradient, rotated); x ticks `#535353`; lines 3px: traffic = light gradient (#826FFF→#E188FF→#E1BDFF), referring domains `#4C4AB5`, DR `#535353`; 8px dots with 2px `#151419` stroke; tooltip card @DEC25 (border `#2A2A2A` r30 p15, bold month, 3 pills) |
| Proof | 6910 | label; header row: H2 + body w630; cards @7094: `#F4F4F4` border `#E0E0E0` r40 p30; row1 2×(630×524, image 570×250), row2 2×(630×600, image 570×326), row3/4 full 1280 (image 1220×560 / 1220×428) with title left + body w600 right; half cards: title 32 (mt 30), body 18/24 w478, metric pills (px12 py8 r10, 18px) |
| Before vs After | 9711 | label, H2 ("After" gradient), body, legend pills ("Before - March 24" grey dot / "Present" purple dot); row @9958: 5 columns w202 spaced 262 with 1px×101 `#E0E0E0` lines; before 18/24 grey line-through, after 48 SemiBold/62 gradient, label 18/24 |
| Conclusion | 10188 | panel `#F4F4F4` 1420×556; "Conclusion" 52/60 `#050505`; subhead 32/1.2 full gradient (mt 40); body 18/24 (mt 40) |
| Footer CTA | 10754 | global footer CTA panel (dark, border `#998AFF`, blurs, label, two-tone H2, body, gradient + outline buttons, nav row) |

## Plotted values read off the chart (used for the DIY eCom seed)
Months JAN24 MAR24 JUN24 SEP24 DEC24 MAR25 JUN25 SEP25 DEC25 JAN26 ·
Organic traffic 0 0 0 2.5k 35k 14k 37.1k 33.4k 62,201 63.5k ·
Referring domains 0 0 61 100 212 359 418 518 589 597 ·
Domain rating 1 1 40 40 43 53 50 50 57 54

## Dark version (2255:1899)
Page `#000`; off-white panels → `#151419`-ish surfaces; cards `#0C0C0C` with `#2A2A2A` borders; text white; same geometry. Matches the site's existing `dark:` tokens.

## Implementation
- Components: `src/components/pages/case-studies/parts/*` (rewritten 2026-09-26 to this geometry; chart lives inside the numbers panel)
- Schema additions: `strategyIntro` object, `beforeAfter.beforeLabel/afterLabel`, growth-chart series colour `indigo`
- Content: `scripts/seed/case-study-diy-ecom-brand.mjs` (client name replaced per NDA)
- Verified: desktop 1440 light + dark, mobile 375 (see session notes)
