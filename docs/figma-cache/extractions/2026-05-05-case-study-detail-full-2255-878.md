# Case Study Detail — Full Page (Figma 2255:878)

## Source
- File key: `7qZIJIngHrkTeaq9nWZkSa`
- Node ID: `2255:878`
- URL: https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=2255-878&m=dev
- Extracted: 2026-05-05
- Tool: `mcp__plugin_figma_figma__get_design_context`

## Tokens (per Figma styles output)
- HR Dark: `#151419`
- HR Pure Black: `#050505`
- HR Off White: `#F4F4F4`
- HR Pure White: `#FFFFFF`
- HR Black Box: `#0C0C0C` (dark numbers-that-matter card bg)
- HR Dark Line: `#2A2A2A` (dark border)
- HR Grey: `#535353`
- HR Light Grey: `#E0E0E0`
- HR Gradient (text): `linear-gradient(~210deg, rgb(153,138,255) 18%, rgb(153,86,175) 40%, rgb(42,34,96) 129%)`
- HR Gradient Light (numbers-that-matter dark variant): `linear-gradient(~220deg, rgb(130,111,255) 18%, rgb(225,136,255) 40%, rgb(225,189,255) 129%)`

## Typography (DM Sans)
- H1: 62 / 80 / -2
- H2: 52 / 60 / -2
- H3 (card titles, journey steps): 32 / 1.2 / -2
- Numbers That Matter big number: 80 ExtraBold / -1.6
- Before/After big number: 48 SemiBold / -0.96
- Section title (eyebrow): 18 / 100 / -2 (e.g. `/ Case Study /`)
- Paragraph: 18 / 24 / 0
- CTA: 16 Medium / 100

## Section structure (top → bottom)

### 1. Hero (top:203px)
- Eyebrow `/ Case Study /` (centered, lg-left)
- H1 split: prefix solid-text + gradient highlight (e.g. "From Zero to Hero:" gradient + "Number Artist's Journey" solid)
- Subtitle 18/24, max-w 484, centered

### 2. Hero Metric Pills (top:471px)
- 3 pills horizontal, gap 10
- Pill: bg `#F4F4F4`, rounded-20px, py-12 px-40
- Pill content: gradient-light value 24 Medium + label 18 Regular

### 3. Hero Image Strip (top:670px)
- 1420×684 dark gradient panel (`linear-gradient(52.4°, #151419 35%, #4C4AB5 142%)`)
- Note: Pavle requested brand-color SVG panel here instead, matching index card. KEEP brand SVG; deviate from Figma intentionally.

### 4. Case Overview (top:1474px)
- Eyebrow "/ Case Overview /"
- H2 split with gradient highlight ("From Startup to Market Leader in 24 Months")
- Body 18/24, full-width

### 5. Objective & Challenges (top:1921px, 1420×803 panel)
- Light grey panel `#F4F4F4`, rounded-40
- Eyebrow + H2 (gradient highlight)
- Body
- Right column: 3 numbered cards stacked with dividers
  - Each card: 50px white square w/ rounded-12, border `#E0E0E0`, inside = gradient number 32px positioned `ml-[5–9px] mt-[14px]` (Figma uses absolute offsets that visually-center 01 only — bug in Figma source; fix in impl with flex center)
  - Title 32px next to badge
  - Body 18/24 below
  - Horizontal divider lines `#E0E0E0` between cards

### 6. Six Pillars (top:2887px → 3953px)
- H2 + 630px paragraph (right column on flex row)
- 3×2 grid of white cards, each 413/414 × 403, rounded-40, border `#E0E0E0`
- Card content: 50px icon box (rounded-12, border) WITH icon SVG inside + H3 32px + intro paragraph + bullet list
- Bullets: dot bullet, 18/24, no purple accent in Figma

### 7. Journey to Success (top:4073px, 1420×781 light grey panel)
- Eyebrow "/ Execution /"
- H2 "The Journey to Success" (with gradient on "Success")
- Horizontal timeline: 5 dots on a horizontal line. First dot is bigger (active state).
- Below each dot: H3 32px title + body 18/24

### 8. The Numbers That Matter (top:4874px, 1420×1916 DARK panel `#151419`)
- Eyebrow "/ Performance Metrics /" (white)
- H2 white text + light gradient on highlighted part
- Body 18/24 white
- 4×2 grid of dark cards bg `#0C0C0C`, border `#2A2A2A`, rounded-40, 305×405
- Card content: 80px icon box (`#151419` bg, `#E0E0E0` border, rounded-12) WITH icon centered + huge 80px gradient-light number + 32px white label + 18/24 gradient-light sub-caption
- All centered

### 9. Growth Chart (within dark panel, top:6187px)
- Title 32px white "Growth Trajectory Over 24 Months"
- 3 legend pills (right): Referring Domains / Organic Traffic / Domain Rating each with colored dot
- Real line chart with dual Y-axis (Organic Traffic left 0–70k, Domains/DR right 0–700)
- 11 month X-axis ticks JAN24 → JAN26
- Faint grid lines
- Tooltip card on DEC25 datapoint showing all 3 series values

### 10. The Proof Is in the Data (top:6910px → ~9620px)
- Eyebrow "/ Real Results /"
- H2 split with gradient ("the Data")
- Body paragraph
- 6 cards in mixed grid:
  - Row 1: 2 cards (Ahrefs Analytics + GSC Performance) — 630×524 each
  - Row 2: 2 cards (Top 3 Keyword Rankings + AI Engine Revenue) — 630×600 each
  - Row 3: 1 full-width card (Revenue Forecasting) — 1280×722
  - Row 4: 1 full-width card (Monthly SEO Revenue Tracking) — 1280×590
- Each card: light grey bg `#F4F4F4`, border `#E0E0E0`, rounded-40
- Card content: screenshot image + H3 32px + body 18/24 + metric pills row (label + gradient value)

### 11. Before vs After (top:9711px)
- Eyebrow "/ Real Results /" (note: same eyebrow re-used, but in main bg this time)
- H2 "Before vs After" with gradient on "After"
- Body
- Legend chip row: "Before - March 24" (grey dot) + "Present" (purple dot)
- 5 metrics in horizontal flex with vertical line `#E0E0E0` between each
  - Each: line-through 18 grey old value + huge 48px SemiBold gradient new value + 18 label

### 12. Conclusion (top:10188px, 1420×556 light grey panel)
- H1 52/60 "Conclusion" (solid `#050505`)
- Subhead 32/1.2 with FULL gradient (no two-tone, full-text gradient)
- Body 2 paragraphs 18/24

### 13. CTA Footer (top:10754px, 1420 dark panel `#151419`, border `#998AFF`)
- Decorative circle blurs (top-right + bottom-left)
- Eyebrow "/ Start Scaling /"
- H2 split "Ready to Write Your Own" + gradient "Success Story?"
- Body
- 2 CTAs: gradient-bg "Book Your Strategy Call" + outline "Learn More"
- Below: separator + footer nav + copyright + logo

## Implementation status (current vs Figma)

| Section | Status |
|---|---|
| 1 Hero | ✅ exists, two-tone H1 OK, subtitle OK |
| 2 Hero Pills | ✅ MetricTile 3-up grid |
| 3 Hero Image Strip | 🔄 Pavle requested brand-SVG (deviates from Figma's dark gradient — intentional) |
| 4 Case Overview | ✅ exists |
| 5 Objective & Challenges | ⚠️ 02/03 number centering FIXED; dark mode FIXED |
| 6 Six Pillars | ⚠️ icons missing in Sanity → empty 50px boxes |
| 7 Journey to Success | ✅ exists |
| 8 Numbers That Matter | ⚠️ icon boxes empty (Sanity has no icons), card sizes need check |
| 9 Growth Chart | ⚠️ exists but no monthly data populated for any slug → renders empty |
| 10 Proof Data | ✅ structure exists, image content sparse |
| 11 Before vs After | ⚠️ 5-row layout exists; line-through styling check |
| 12 Conclusion | ✅ exists |
| 13 CTA Footer | ✅ uses global FooterCtaVariant |

## Deviations from Figma (intentional)
- **Hero panel = brand-color SVG** (Pavle directive 2026-05-05) instead of dark gradient strip. Visual parity with /case-studies index card.
- **Dark-mode variants** for every section. Figma is single-theme; project supports both.

## Outstanding gaps
- Icons missing on `numbersThatMatter.items[].icon` and `strategyPillars[].icon` for all 6 case studies. Empty boxes render. Either: (a) source icon SVGs and upload to Sanity; (b) hide icon container when icon absent.
- Growth chart series data missing across all 6 slugs. Section gracefully collapses but loses a major Figma section.
- Per-case-study CTA footer copy missing — falls back to global. Acceptable per content brief.
- proofData[].image PNG screenshots missing — needs Nebojsa.
