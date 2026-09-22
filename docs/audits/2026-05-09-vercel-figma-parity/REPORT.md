# Case Studies — Vercel vs Figma parity audit (2026-05-09)

Auditor: Claude Opus 4.7. Live Vercel deploy =
`https://heroic-rankings-final.vercel.app/case-studies/<slug>`. Figma spec
= `docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md`
(Figma node `2255:878` desktop, `2255:1378` mobile).

Captured 6 desktop screenshots at 1440 px (`01-nagish-1440.png` …
`06-maudsch-1440.png`). Compared section-by-section against Figma spec.

---

## Code-side fixes shipped this session — commit `d06d368`

1. **`MetricTile`** light variant now auto-swaps to dark palette under `.dark`
   (bg `--color-hr-black-box`, gradient `gradient-text-brand-light`, label
   white). Previously stayed light tile on dark page → high-contrast white
   islands.
2. **`CaseStudyPillars`** icon `<Image>` gets `dark:invert` so black SVGs
   flip to white on dark icon-box bg. Previously black-on-dark = invisible.

Both verified live on local dev (DOM `filter: invert(1)`, tile bg
`rgb(12,12,12)`, gradient bg-image swapped to brand-light).

> **Push status: held pending Codex review (`task-moxxr1fy-majjmo`).**
> Sanity content patches are already live; code fixes will land on Vercel
> on next push to `main`.

---

## Sanity content patches shipped this session

Migration script: `scripts/migrate/2026-05-09-clear-overview-placeholders.mjs`.
Applied as a single transaction (4 patches, auto-published).

| Slug | Before | After |
|---|---|---|
| nagish | `caseOverview = { headingMain: "Test", body: "Test" }` | `caseOverview` unset → section collapses |
| art-by-maudsch | `caseOverview = { headingMain: "Missing info", body: "Missing info" }` | `caseOverview` unset → section collapses |
| diy-craft-ecom-brand | `caseOverview = { headingMain: "Missing text", body: "Missing text" }` | `caseOverview` unset → section collapses |
| designrush | body leaked `"…we helped My Baskets achieve…"` | body fixed → `"…we helped DesignRush achieve…"` |

---

## Content-gap matrix vs Figma spec

✓ = populated · ✗ = missing · `n` = item count

| Field             | nagish | maudsch | designrush | diy-craft | my-baskets | affinda | Figma target |
|-------------------|:------:|:-------:|:----------:|:---------:|:----------:|:-------:|:-----------:|
| heroSubtitle      | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| titleHighlighted  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| heroMetrics       | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| heroImage         | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **caseOverview**  | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ |
| objectiveChallenges (items) | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| **strategyPillars** | 6 | **7** | 6 | **7** | **8** | 6 | 6 |
| **journeyTimeline** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 4–5 steps |
| **numbersThatMatter (items)** | 7 | 6 | 7 | 6 | 6 | 6 | 8 |
| **growthChart**   | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 3-series line chart |
| **proofData (cards)** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | 6 analytics screenshots |
| beforeAfter (items) | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| conclusion        | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ctaFooter         | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ (per case, global fallback OK) |

---

## Punch list — content (Pavle + Nebojsa, in Studio)

### Cross-cutting (every case study)

1. **`journeyTimeline`** — write 4–5 step entries per case (Discovery &
   Strategy / Technical Foundation / Content Optimization / Authority
   Building / AI Optimization). Currently null on all 6 → entire section
   collapses → page jumps from "Six Pillars" straight to "Numbers".
2. **`growthChart`** — supply 3-series monthly time series (Referring
   Domains / Organic Traffic / Domain Rating). Without it the dark
   "Numbers That Matter" panel ends abruptly. Skipped per the migration
   script comment ("needs monthly series data Nebojsa hasn't supplied").
3. **`proofData[].image`** — upload 6 analytics screenshots per case
   (Ahrefs dashboard, GSC performance, top-3 keywords, AI engine revenue,
   revenue forecasting, monthly SEO revenue). Cards render but show empty
   placeholder when `image` ref is missing.
4. **`ctaFooter`** — optional per-case override; global
   `FooterCtaVariant` fallback works, so this is post-launch grade.

### Per-case overview headings

Three docs (nagish, maudsch, diy-craft) had their `caseOverview` cleared
this session because it was literal placeholder text. Replace with real
copy when ready:

```
caseOverview: {
  label: "/ Case Overview /",
  headingMain: "<one-line plain>",
  headingHighlighted: "<gradient half — must be substring of headingMain>",
  body: "<2–3 sentence narrative>"
}
```

### Strategy-pillar overflow

`maudsch` (7), `diy-craft` (7), `my-baskets` (8) — pillars[0] on these is
the intro sentence ("To address these challenges, the following
strategies were implemented:") accidentally stuffed into the `title`
field instead of being a section-level intro paragraph.

Two-step fix in Studio:
1. Move that intro sentence to `objectiveChallenges.body` or delete it
   (it duplicates the panel's purpose).
2. Truncate each remaining pillar `title` to a label phrase (~3–5 words)
   instead of full sentence; move long copy to `intro`. Figma renders
   `title` as 32 px H3 — sentence-length titles wrap awkwardly.

### Numbers grid — short by 1–2 cards

Figma calls for 8 metric cards (4×2 grid). Live: 6–7 per case. Decide
whether to:
- (a) Add 1–2 metrics per case to fill the 4×2 grid, OR
- (b) Adjust the layout to a 4×2/3×2 hybrid grid based on item count
  (code change — falls outside content task).

---

## Outstanding code-side observations

Not blockers, surfaced for awareness:

- **MetricTile dual-span** — value text duplicated in DOM (one
  `display:none` per theme). Screen readers may announce twice. Codex
  review (`task-moxxr1fy-majjmo`) is checking. If flagged, consider
  `aria-hidden` on the inactive span or single-span CSS-variable swap.
- **`dark:invert` on pillar icon** — assumes monochrome SVG. If Sanity
  asset later carries a multi-color icon, invert will break it. Mitigate
  by storing icons with `currentColor` fill and using `text-` colors.
- **HeroPanel image gradient** — uses
  `linear-gradient(... #4C4AB5 ...)` from `--color-hr-art-maudsch` token
  on every case. Figma spec calls for per-brand gradient. The Hero panel
  brand-color SVG (commit `d20ccda`) handles per-brand color via
  `case-study-panels.ts` lookup; verify it overrides this gradient when
  brand SVG resolves.

---

## Artifacts

- Screenshots: `docs/audits/2026-05-09-vercel-figma-parity/01-…06-…1440.png`
- Dark-mode after-fix proofs: `07-maudsch-after-dark.png`,
  `08-affinda-after-dark.png`, `09-affinda-hero-fold.png`
- Migration script: `scripts/migrate/2026-05-09-clear-overview-placeholders.mjs`
- Code commit: `d06d368 fix(case-studies): dark-mode hero pills + pillar icons + clear overview placeholders`
