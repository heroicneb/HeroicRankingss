# Case Study Single Page — Desktop

## Source
- **Figma file key:** `7qZIJIngHrkTeaq9nWZkSa`
- **Section node ID:** `2255:878`
- **URL:** https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=2255-878&m=dev
- **Extracted:** 2026-04-28
- **Tool:** `mcp__plugin_figma_figma__get_design_context`

## Page structure (top → bottom)

1. **Navbar** (`2255:879`) — standard nav, no case-study-specific elements
2. **Hero** (`2255:918`) — gradient H1 title with two-tone treatment ("From Zero to Hero:" gradient + "Number Artist's Journey" black) + subtitle + 3 metric pills (Months / $1.3M Organic Revenue / 63,500 Monthly Visitors) on `#F4F4F4` rounded-[20px] tiles with light gradient numbers
3. **Hero image strip** (`2255:931`) — 1420×684 dark gradient panel `linear-gradient(52.4deg, #151419 35%, #4C4AB5 142%)` rounded-[40px]
4. **Case Overview** (`2255:932`) — section label "/ Case Overview /" + H2 "From Startup to Market Leader in 24 Months" (mixed black + gradient) + body paragraph
5. **Objective & Challenges** (`2255:936`) — light grey panel rounded-[40px], section label + H2 mixed gradient + 3 numbered cards (01/02/03) with gradient digits + title + body, divider lines between
6. **Six Pillars of Dominant SEO** (`2255:972`) — 6-card 3×2 grid, each card 413×403 white with `#E0E0E0` border, rounded-[40px]: icon box (50×50) + H3 title + intro line + bulleted list (4 items)
7. **Execution / Journey to Success** (`2255:1042`) — light grey panel rounded-[40px], section label + H2 + 4-step horizontal timeline with `#E0E0E0` line + 5 ellipse markers + 5 step cards (Discovery & Strategy, Technical Foundation, Content Optimization, Authority Building, AI Optimization)
8. **The Numbers That Matter** (`2255:1066`) — 1420×1916 **dark bg `#151419`** rounded-[40px], section label + H2 (white + light gradient) + body + 8 metric cards (4×2 grid), each card 305×405 `#0C0C0C` with `#2A2A2A` border, rounded-[40px], with: 80×80 icon box + 80px gradient number + H3 white label + light gradient sub-caption ("↑ From 0", "↑ From 1 to 54", etc.)
9. **Growth Trajectory chart** (`2255:1148`) — embedded line chart in same dark panel: 3 series (Referring Domains / Organic Traffic / Domain Rating) over 11 months JAN24→JAN26, with axis labels left+right, gridlines, dot markers per month, callout tooltip overlay for DEC25 showing all 3 metrics
10. **The Proof Is in the Data** (`2255:975`) — H2 + 6 analytics screenshot cards on `#F4F4F4`, mixed sizes:
    - Ahrefs Analytics Dashboard (570×250) + 3 metric tags (Domain Rating: 54, Ref. Domains: 597, Keywords: 3.6K)
    - Google Search Console Performance (570×250) + 2 metric tags (Impressions: 16.1M, Clicks: 200K+)
    - Top 3 Keyword Rankings (570×326) + 2 metric tags (Top 3: 800+, Organic Traffic: 65K)
    - AI Engine Revenue (570×326) with info tooltip + 1 tag (Next-Gen Traffic Source) + dual-color paragraph (gradient phrase + black)
    - Revenue Forecasting & Performance (1220×560) — full-width
    - Monthly SEO Revenue Tracking (1220×428) — full-width
11. **Before vs After** (`2255:1297`) — H2 mixed black + gradient + 2 legend tags (Before March 24 / Present) + 5 stat columns separated by vertical line dividers `#E0E0E0`: each col has strikethrough small old value (1, 0, 0, 0, $0) + huge gradient SemiBold 48px new value (54, 63.5k, 597, 3,600, $54k+) + label
12. **Conclusion** (`2255:1373`) — light grey panel rounded-[40px], H2 black "Conclusion" + gradient subhead + body
13. **Final CTA Footer** (`2255:1333`) — dark `#151419` panel rounded-[40px] with `#998AFF` border, decorative ellipse blurs, section label "/ Start Scaling /" + H2 gradient "Ready to Write Your Own Success Story?" + body + 2 buttons: gradient-fill "Book Your Strategy Call" + outlined "Learn More"
14. **Site footer rows** — Home/About/Services/Partnership/Privacy + fax/email + LinkedIn/Instagram/X + ©2025

## Tokens used

| Figma name | Hex / Value | Project token |
|---|---|---|
| HR Pure White | `#FFFFFF` | `var(--color-hr-pure-white)` ✅ |
| HR Off White | `#F4F4F4` | `var(--color-hr-off-white)` ✅ |
| HR Light Grey | `#E0E0E0` | `var(--color-hr-light-grey)` ✅ |
| HR Grey | `#535353` | `var(--color-hr-grey)` ✅ |
| HR Dark | `#151419` | `var(--color-hr-dark)` ✅ |
| HR Pure Black | `#050505` | `var(--color-hr-pure-black)` (verify exists) |
| HR Black Box | `#0C0C0C` | NEW — needed for metric card bg on dark section |
| HR Dark Line | `#2A2A2A` | NEW — needed for metric card border on dark section |
| HR Gradient | `linear-gradient(~210deg, #998AFF 18%, #9956AF 41%, #2A2260 130%)` | maps to existing `gradient-text-brand-*` |
| HR Gradient Light | `linear-gradient(~210deg, #826FFF 18%, #E188FF 41%, #E1BDFF 130%)` | NEW — used on dark sections (lighter / pinker palette) |

## Typography

| Style | Font / Size | Use |
|---|---|---|
| H1 / Web | DM Sans Regular 62 / 80, tracking -1.24 | Hero title |
| H2 / Web | DM Sans Regular 52 / 60, tracking -1.04 | Section headings |
| H3 / Web | DM Sans Regular 32 / 1.2, tracking -0.64 | Card titles, step titles |
| Team & Testimonials | DM Sans Medium 24, tracking -0.48 | Hero metric numbers ("24", "$1.3M", "63,500") |
| Paragraph / Web | DM Sans Regular 18 / 24 | Body |
| Section Title | DM Sans Regular 18 / 100, tracking -0.36 | Section labels "/ ... /" |
| Key points / Web | DM Sans SemiBold 48 / 100, tracking -0.96 | Before/After big numbers |
| ExtraBold (gradient) | DM Sans ExtraBold 80, tracking -1.6 | Big metric cards on dark section |
| CTA / Web | DM Sans Medium 16 / 100 | Buttons |
| Footer / Web | DM Sans Regular 14 / 100 | Footer text |

## Required Sanity schema for `caseStudy` (extension)

Current schema: title, slug, client, panelLabel, excerpt, heroImage, cardImage, metrics[] (label/value/description), body (portableText), services[].

**Needed extensions:**

| New field | Type | Purpose |
|---|---|---|
| `heroSubtitle` | string | Subtitle below H1 ("How we transformed...") |
| `heroMetrics[]` | array of `{value, label}` | The 3 hero stat tiles (Months / Revenue / Visitors) |
| `caseOverview` | object `{label, heading, body}` | Case Overview section |
| `objectiveChallenges` | object `{label, heading, body, items[]}` | items = `{number, title, body}`, 3 numbered cards |
| `strategyPillars` | array of 6 `{title, intro, bullets[]: string, iconAsset}` | Six Pillars cards |
| `journeyTimeline` | array of `{title, body}` (4-5 items) | Journey to Success steps |
| `numbersThatMatter` | object `{label, heading, body, items[]}` | items = `{value, label, sub, iconAsset}`, ~8 cards |
| `growthChart` | object `{title, series[], months[], legend[], tooltip{...}}` | Line chart data — series = `{label, color, points[]}` |
| `proofData` | array of `{title, body, image, metricTags[]: {label,value}, isHighlight?}` | 6 analytics screenshot cards |
| `beforeAfter` | object `{label, heading, body, items[]}` | items = `{label, before, after}`, ~5 columns |
| `conclusion` | object `{heading, gradientSubhead, body (portableText)}` | Conclusion panel |
| `ctaFooter` | object `{label, heading (rich), body, primaryCta{label,url}, secondaryCta{label,url}}` | Custom final CTA per case study |

## Verification notes

- ✅ All colors map to existing tokens except 2 new ones (`HR Black Box`, `HR Dark Line`) — add to globals.css
- ⚠️ Two distinct gradients: standard "HR Gradient" for light sections + "HR Gradient Light" (pinkier palette) for dark sections — must add second gradient class
- ⚠️ Growth trajectory line chart is complex (3 series + axis labels + tooltip) — recommend `recharts` or `visx` for production rendering, or store as 3 SVG paths if data is static per case study
- ⚠️ Schema is significantly larger than current `caseStudy.ts` — needs migration script for existing Number Artist content (currently in hardcoded `case-study-details.ts`)
- ⚠️ Per Nebojša's feedback: "Number Artist" → rename to "DIY Craft eCom brand" everywhere
- ⚠️ Hero gradient is two-tone: first half `text-transparent` w/ gradient bg-clip, second half `text-[#050505]` solid black — implement as two `<span>`s within H1
