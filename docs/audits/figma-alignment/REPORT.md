# Figma alignment audit — 2026-04-29

Visual diff sweep against the light-mode source-of-truth across 8 templates
× the relevant viewports (13 pairs total). Captured against the
`heroic-rankings-final.vercel.app` staging deploy with localStorage flipped
to `hr-theme=light` before paint.

Per-template site screenshots live in `docs/audits/figma-alignment/<id>/<viewport>-site.png`.
Figma reference frames are in the design files keyed below; the comparison
findings are recorded inline. Severity scale:

- **MATCH** — visually equivalent within rendering tolerance.
- **MINOR** — small drift (spacing, asset placeholder, copy variant) that
  doesn't block launch but is worth tracking.
- **DRIFT** — meaningful divergence from design that should be fixed before
  cutover.
- **MISSING** — element from Figma is absent on the site (or vice versa).

## Inventory

| Template | Route | File key | Desktop node | Mobile node |
|---|---|---|---|---|
| Blog index | `/insights` | `LrfQdM6RTwf95gfkga3tJl` | `248:1541` | — |
| Blog single | `/insights/best-ahrefs-alternatives` | `LrfQdM6RTwf95gfkga3tJl` | `2339:27` | `2339:195` |
| Case studies index | `/case-studies` | `LrfQdM6RTwf95gfkga3tJl` | `248:1917` | — |
| Case study single | `/case-studies/designrush` | `7qZIJIngHrkTeaq9nWZkSa` | `2255:878` | `2255:1378` |
| Podcast index | `/podcast` | `LrfQdM6RTwf95gfkga3tJl` | `2223:283` | — |
| Podcast single | `/podcast/audit-fixture-podcast-episode` | `7qZIJIngHrkTeaq9nWZkSa` | `2223:49` | `2223:723` |
| Team detail | `/team/nebojsa-jankovic` | `7qZIJIngHrkTeaq9nWZkSa` | `197:891` | `672:4109` |
| About Us | `/about-us` | `LrfQdM6RTwf95gfkga3tJl` | `189:5` | `709:1478` |

---

## 1 — Blog index (`/insights`) · desktop · `LrfQdM6RTwf95gfkga3tJl/248:1541`

| Status | Element | Notes |
|---|---|---|
| MATCH | Top navbar | White bar, black links, "Insights" rendered as dark pill, theme toggle + Get Started CTA on right. |
| MATCH | "Our Blog" hero | Purple gradient H1 sized + positioned per Figma. |
| MATCH | Subhead + email subscribe | Two-line lede with inline link, email field + Subscribe button. |
| MATCH | Filter pills | All / Marketing / SEO / Link Building, "All" selected pill. |
| MINOR | Card grid count | Figma shows 6 cards in a single preview frame; site renders all 12 migrated posts in a 4×3 grid. Expected — Figma frame is illustrative, site shows real content. |
| MATCH | Card composition | Purple gradient panel + post-specific image overlay + category badge + "G"/widget icon top-right + title/excerpt/date below. |
| MATCH | Card thumbnails are unique | Post-specific imagery from migrated Sanity asset (the C2/C3 fix landed correctly). |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |
| MATCH | Footer nav | Home / About Us / Services / Partnership / Privacy policy + phone + email + LinkedIn / Instagram / X. |

**Verdict:** MATCH structurally; one DRIFT on the global CTA copy that affects every page in this audit. Treat as a single global decision, not per-page.

## 2 — Blog single (`/insights/best-ahrefs-alternatives`) · desktop · `LrfQdM6RTwf95gfkga3tJl/2339:27`

| Status | Element | Notes |
|---|---|---|
| MATCH | Author attribution | "by Nebojsa Jankovic · in Seo" rendered above title. |
| MATCH | Title | Top 8 Ahrefs Alternatives, purple gradient on highlighted segment, sized + tracking per Figma. |
| MATCH | "Get summary" AI button rail | ChatGPT / Perplexity / Claude / Google AI Mode / Grok pills, same order as Figma. |
| MATCH | Two-col layout | Sticky TOC on left, body on right. Section nav items match the post's H2 anchors. |
| MINOR | Hero image card | Figma reference shows a decorative compass illustration over a purple gradient panel; site shows the post's actual `mainImage` (a PAID badge graphic). Both are theme-correct — the Figma image is illustrative copy, the site shows real content. |
| MATCH | Body typography | Paragraph spacing, bold/italic/link styling, bullet markers, table rendering all align. |
| UNVERIFIED | "Author" sidebar | Figma shows an author panel (photo + role + short bio + LinkedIn pill) below the TOC. Site rendering at full-page scale was too compressed to confirm; check `BlogPostDetailContent` directly to confirm the panel renders. |
| UNVERIFIED | "Share this article" footer row | Figma shows LinkedIn/X/Facebook share pills + "Copy link to article" right-aligned. Same — confirm in viewport-zoom. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

> Note: Figma MCP hit the Starter-plan tool-call limit after pairs 1–2; pairs 3–13 below were compared against the cached extraction markdown in `docs/figma-cache/extractions/` plus the site-side screenshot, not against a fresh Figma image. Re-running the Figma fetches after the quota resets would tighten the audit but is not blocking.

## 3 — Case studies index (`/case-studies`) · desktop · `LrfQdM6RTwf95gfkga3tJl/248:1917`

| Status | Element | Notes |
|---|---|---|
| MATCH | Top navbar | Light mode renders correctly: white bar, dark links, "Case Studies" pill highlighted. |
| MATCH | "Success Stories" hero | Purple gradient H1 with subhead + email subscribe form. Matches Figma. |
| MATCH | Card grid layout | 3+3 grid, 6 unique slugs (`affinda` / `art-by-maudsch` / `designrush` / `diy-craft-ecom-brand` / `my-baskets` / `nagish`). |
| **DRIFT** | **Card panel images / colors (CRITICAL)** | In dark mode the cards render as solid brand-color panels (orange / cream / navy / purple / teal / dark) per design. **In light mode all 6 cards display the same hand/wrist hero photo as a faint full-bleed background, with the URL/client name in white-on-light barely legible.** Root cause: every migrated case-study has `cardImage: null`, and 5 of 6 share the *same* `heroImage` (`image-64fd103849499229752ffad29f96f6996f5506f2`) — only `my-baskets` has its own. The card component falls back to `heroImageUrl` + a generic SVG when both are absent, but on this set every card lands on the same hero. **Action:** populate `caseStudy.cardImage` per slug in Sanity (the schema field exists), OR change the card to render a flat brand-color panel + URL text overlay (matching dark-mode + Figma intent) and ignore `heroImage` for the index card. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

**Verdict:** DRIFT — the card-image issue is a real launch-blocker for this page in light mode. Decision needed: per-slug `cardImage` content vs component change.

## 4 — Case study single (`/case-studies/designrush`) · desktop · `7qZIJIngHrkTeaq9nWZkSa/2255:878`

Comparison against `docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md`.

| Status | Element | Notes |
|---|---|---|
| MATCH | Hero | Two-tone H1 (gradient + black), subtitle below. |
| DRIFT | Hero metric pills row | Figma spec shows 3 pills ("Months" / "Organic Revenue" / "Monthly Visitors") on `#F4F4F4` rounded-[20px] tiles below the subtitle. The DesignRush doc has no `numbersThatMatter` populated, so the row collapses. The hero pill row is bound to that same data per the heroPanel field — verify whether the design intends the pills to come from the dedicated `heroPanel` block instead. Add real DesignRush metrics to Sanity. |
| MATCH | Hero image strip | Dark gradient panel rendered correctly (this is the same shared `heroImage` flagged in §3 — the image content is generic but the panel shape is right). |
| MATCH | Objective & Challenges (`2255:936`) | Light grey panel + 3 numbered cards with gradient digits + body — text now readable post-C1 fix. |
| MATCH | Six Pillars (`2255:972`) | 3×2 grid of white pillar cards — text readable, icon boxes render. |
| MATCH | Journey timeline (`2255:1042`) | Light grey panel + 4-step horizontal timeline with gradient step numbers + ring markers. Title + body legible. |
| MISSING | Numbers That Matter (`2255:1066`) | Dark `#151419` panel with 8-card 4×2 metric grid — collapses on this slug because `numbersThatMatter` is empty. Expected per data model; not a bug. |
| MISSING | Growth chart (`2255:1148`) | Same — collapses when `growthChart` empty. |
| MINOR | Proof Data (`2255:975`) | Section renders, but the analytics-screenshot cards on light mode look very low contrast — empty `#F4F4F4` panels with body text barely visible. Confirm the `image` field is populated on each `proofData.items[i]`, otherwise the cards render an empty figure slot. |
| MATCH | Conclusion (`2255:1373`) | Light grey panel + heading + body — readable post-C1. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

**Verdict:** Mostly MATCH after today's fixes. One real DRIFT: hero metric pills row is empty because Sanity data is missing — populate `numbersThatMatter` (or whichever field the heroPanel reads) for each case study. Spot-check proofData images on a different slug.

## 5 — Podcast index (`/podcast`) · desktop · `LrfQdM6RTwf95gfkga3tJl/2223:283`

| Status | Element | Notes |
|---|---|---|
| MATCH | Hero | "Podcast for People Who Want to Actually Rank." with "Want to Actually Rank" in gradient. |
| MATCH | Hero CTAs | `GPT 5.2 Chat` pill + `Watch on Youtube` red button. The episode-count pill correctly hides when there are zero public episodes (M1 audit-fixture gate filters the only doc). |
| MATCH | Guest cluster | 5 staggered guest portraits with rotation, tilted per Figma. |
| MISSING | Latest episode featured card | Bound to `episodes[0]`. With the audit fixture gated, the public dataset has zero episodes → section collapses. Will render once real episodes ship. |
| MISSING | Episodes grid | Same — collapses on empty. |
| MATCH | "Ask Anything. Get Answers From Every Episode." section | Two-tone heading + body + GPT chat-bubble illustration on right. |
| MATCH | "Built for Podcast Listeners Who Want More" | 3 feature columns with rendered icons (chat bubble / lightning / lock) in dark icon boxes. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

**Verdict:** MATCH structurally. The empty episode sections are content-bound, not a render bug. Re-audit once real episodes are loaded.

## 6 — Podcast single (`/podcast/audit-fixture-podcast-episode`) · desktop · `7qZIJIngHrkTeaq9nWZkSa/2223:49`
## 6b — Podcast single mobile · `7qZIJIngHrkTeaq9nWZkSa/2223:723`

**Skipped — no public podcast content.** The M1 audit-fixture gate (committed in `4139e1d`) now filters the only podcast doc from `getPodcastEpisodeBySlug`, so the route renders the branded `Page Not Found` UI for the fixture URL. Visual alignment for this template will need to be re-run after real podcast episodes are added to Sanity.

Cached design intent: `docs/figma-cache/extractions/2026-04-28-podcast-section-01-episode-single-desktop.md` describes the expected layout — left video embed + right episode meta (title + duration + date + 3 chat AI summary pills) → "Best Moments From This Episode" reel gallery → transcript scroll panel → share row → CTA. Earlier this session (Phase 2 audit, pre-gate) the page rendered with all these sections; the C2 GROQ projection fix populated the reel thumbnails too.

**Verdict:** UNVERIFIED for this audit. Re-run pair 6 once real podcast data lands, OR temporarily un-gate the fixture in a branch for a one-off design check.

## 7 — Team detail (`/team/nebojsa-jankovic`) · desktop · `7qZIJIngHrkTeaq9nWZkSa/197:891`

Comparison against `docs/figma-cache/extractions/2026-04-28-team-member-section-01-popup-desktop.md`. Note: the cached frame is a **popup/modal** design; the site implements it as a **full route page** (Codex's Option B for ProfilePage SEO). Some divergences are intentional consequences of that decision.

| Status | Element | Notes |
|---|---|---|
| MATCH | Photo card (305×642 right column) | Renders with photo asset (C2 fix landed). Border + radius match. |
| MATCH | Subtitle label "/ Founder & CEO /" | Above name, 18/24 grey. |
| MATCH | Hero name | "Nebojsa Jankovic" 62/80 with brand gradient. |
| MATCH | Divider line | 1px under name. |
| **DRIFT** | Body layout | Figma: **2-column** body (col 1 + col 2 paragraphs). Site: **single-column stack** (the C2 fix today switched away from `md:grid-cols-2` because the 2-col grid jumbled the Q&A pairs that BCMS migration packed into `bioParagraphs`). Decision: restore 2-col with structured Q&A schema, or keep current stack as the new spec. |
| **DRIFT** | Glass contact tile overlay | Figma: glass-effect panel anchored to bottom of photo with 5 social pills (phone / email / Instagram / LinkedIn / X) + "Save to Contacts" button. Site: single "Connect on LinkedIn" button below the photo. |
| MISSING (by design) | "Close" link top-right | Popup-only, replaced with "Back to team" route link. |
| MISSING (by design) | "Previous" / "Next" sibling nav at bottom | Popup-only. The full-route version doesn't include sibling pagination. Add if SEO benefits from internal-link weight; otherwise drop from the spec. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

**Verdict:** DRIFT. Two real divergences (body col-count + contact tile design) are intentional consequences of the popup→route conversion, but they should be re-validated against the latest Figma frame before launch. The single-col bio stack today reads cleanly with the fixed bioParagraphs data, but isn't the design spec.

## 8 — About Us (`/about-us`) · desktop · `LrfQdM6RTwf95gfkga3tJl/189:5`

Comparison against `docs/figma-cache/extractions/2026-04-03-about-us-page-full.md` (note: extracted 2026-04-03, may not reflect latest copy tweaks).

| Status | Element | Notes |
|---|---|---|
| MATCH | Hero | "Meet the Ranking Heroes" with Roman statue illustration on dark gradient panel. |
| MATCH | "Over a Decade of Ethical, Data-Driven SEO Excellence" | Subhead + body. |
| MATCH | 3-column block | Our Approach / Our Team / Our Vision rendered. |
| MATCH | Trust / authority partner rail | Logos render (partnerLogo migration covered). |
| MATCH | "We focus on one thing: organic performance" feature | Subhead + paragraph. |
| MATCH | "Meet Your Core Heroes" team grid | 8 cards rendering with portraits (H4 fix landed via the C2 GROQ projection patch). |
| MATCH | "What Our Clients Say" testimonials | 3 testimonial cards visible. |
| MATCH | "Insights and Trends in Our Most Popular Reads" | 12 blog cards bound to migrated posts; thumbnails unique (C3 verified). |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

**Verdict:** MATCH. Highest-fidelity page in the audit — every section that should render is rendering correctly. The April-3 cached extraction is the limiting factor on tight visual diff; if the design has shifted since, re-pull the frame from `LrfQdM6RTwf95gfkga3tJl/189:5` after the Figma quota resets.

## Mobile pairs (375px viewport)

Compared against the cached `*-mobile.md` extraction docs.

### 2b — Blog single mobile · `LrfQdM6RTwf95gfkga3tJl/2339:195`
| Status | Element | Notes |
|---|---|---|
| MATCH | Hero stack | Author attribution → title → AI-summary buttons → hero image card → body, all stacked single-column. |
| MATCH | Body rendering | Paragraphs, tables, bullet lists, blockquotes all renderable; long-form scrolls cleanly. |
| MATCH | Author panel | Photo + role + bio + LinkedIn pill at bottom of body. |
| MATCH | Share row | LinkedIn / X / Facebook + Copy link pills. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

### 4b — Case study single mobile · `7qZIJIngHrkTeaq9nWZkSa/2255:1378`
| Status | Element | Notes |
|---|---|---|
| MATCH | Hero stack | Title → hero image strip → subtitle. |
| DRIFT | Hero metric pills | Same as desktop — empty because `numbersThatMatter` not populated. |
| MATCH | Numbered challenge cards | 3 cards stacked vertically, dividers between. Readable post-C1. |
| MATCH | Pillars / Journey rails | Horizontal scroll rails per the `MobileScrollRail` primitive. |
| MINOR | Proof data | Empty card slots — same as desktop. |
| MATCH | Conclusion + CTA | Renders. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

### 7b — Team detail mobile · `7qZIJIngHrkTeaq9nWZkSa/672:4109`
| Status | Element | Notes |
|---|---|---|
| MATCH | Header row | "/ Our Team /" + "Back to team" link. |
| MATCH | Subtitle + name | "Founder & CEO" + gradient name. |
| MATCH | Bio paragraphs | Stacked single-column with line breaks (post-C2 fix). |
| MATCH | Photo card | Centered below content with proper aspect. |
| MATCH | LinkedIn CTA | Full-width pill below photo. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

### 8b — About Us mobile · `LrfQdM6RTwf95gfkga3tJl/709:1478`
| Status | Element | Notes |
|---|---|---|
| MATCH | Hero | Roman statue + "Meet the Ranking Heroes" gradient. |
| MATCH | About + 3-column block | Stacks vertically. |
| MATCH | Trust rail | Logo carousel renders. |
| UNVERIFIED | Team grid | First card shows portrait clearly; subsequent cards in the grid render but at this scrolled-thumbnail scale the portraits look dark/absent on cards 5-8. **Spot-check at viewport zoom** before launch — could be a thumbnail artifact, could be a real layout bug where only the first card receives the full portrait. |
| MATCH | Testimonials | Card visible. |
| MATCH | Insights cards | Stack with unique thumbnails. |
| ACCEPTED | Footer CTA copy | Site renders global "Ready to grow together" / "Start Growing"; this differs from the older Figma frames but is intentionally the new copy per Pavle. Marked as accepted, not DRIFT. |

---

## Summary — ranked findings

### CRITICAL (launch-blocker)

1. **`/case-studies` index in light mode shows the same hero image on 5 of 6 cards (§3).** Cards intended to be solid brand-color panels with URL/client overlay; instead they render the same hand/wrist photo behind unreadable white text. Two valid fixes:
   - Populate `caseStudy.cardImage` per slug in Sanity (the schema field exists, currently `null` on every doc).
   - Or change the index card component to ignore `heroImage` and render flat brand-color panels matching dark mode.

### HIGH

2. **Case-study hero metric pills row is empty (§4, §4b).** Figma shows 3 pills (Months / Organic Revenue / Monthly Visitors). Site collapses the row because `numbersThatMatter` (or the heroPanel field that drives it) is empty on every migrated case study. Either populate per slug OR rebind the hero pills to a different field that is reliably present.
3. **Team detail body uses single-column stack instead of Figma's 2-column (§7).** Today's C2 fix switched to single-stack because BCMS-migrated `bioParagraphs` interleave Q&A as flat strings and the 2-col grid jumbled them. Decision needed: introduce structured `personalTraits[]` + `freeTime[]` schema fields and restore 2-col, or accept single-stack as the new spec.
4. **Glass contact tile on team detail is missing (§7).** Figma overlays a glass-effect panel on the photo with 5 social pills + "Save to Contacts" button. Site shows a plain "Connect on LinkedIn" button below the photo.

### MEDIUM

6. **Case-study Proof Data cards look low-contrast in light mode (§4).** The `image` field on each `proofData.items[i]` may be empty for DesignRush; spot-check another slug (Affinda / Nagish) before flagging as a wider bug.
7. **About-us mobile team grid — UNVERIFIED whether portraits render on cards 5-8 (§8b).** Spot-check at a real 375px viewport before launch.

### MINOR

8. Card-grid count differs Figma (6 illustrative) vs site (12 real) on `/insights` (§1). Expected.
9. Cached extraction for `/about-us` (§8) is from 2026-04-03 and may not reflect latest Figma copy — re-pull `LrfQdM6RTwf95gfkga3tJl/189:5` after Figma quota resets if a tighter check is needed.

### Skipped / unverifiable in this pass

- `/podcast/[slug]` (§6) — only doc is the gated audit fixture, route serves Page Not Found. Re-run after real episodes ship.
- Pairs 3–13 used cached extraction text + site screenshots only because Figma MCP hit the Starter-plan call cap after pairs 1–2. Re-run with quota for pixel-tight diff.

## Recommendations (post Pavle review)

| # | Item | Recommendation | Effort | Launch-block? |
|---|---|---|---|---|
| 1 | `/case-studies` index light-mode card images | **Component fix.** Drop the hero-image fallback on the index card, render flat brand-color panels matching dark mode. Existing `CASE_STUDY_PANEL_FALLBACKS` already keys per-slug — extend with brand colors. Cheaper than sourcing 6 unique card images and theme-stable. | ~30 min code | Yes |
| 2 | Hero metric pills empty on every case study | **Content backlog.** Pills graceful-degrade today (row collapses). Add `numbersThatMatter` / heroPanel.metrics to the client's launch-content task list; populate as data comes in. Don't block launch on it. | content-side | No |
| 3 | Team body 1-col vs 2-col Figma | **Accept single-col stack as the new spec.** Reads cleanly with the fixed bioParagraphs, no schema work needed. Revisit if a future Q&A schema lands. | none | No |
| 4 | Glass contact tile missing on team detail | **Defer.** LinkedIn pill is functional. Build the glass tile + multi-social-pill component post-launch as a polish PR (~2-3h). | post-launch | No |
| 5 | Proof Data cards low-contrast on DesignRush | **Verify first.** Spot-check Affinda + Nagish — if their `proofData.items[].image` is populated, this is just DesignRush content, not a wider bug. | ~5 min | No |
| 6 | About-us mobile team grid cards 5-8 | **Verify first.** 5-min viewport screenshot at 375px to confirm portraits render on cards 5-8. Probably a thumbnail artifact. | ~5 min | No |
| - | Footer CTA copy | Accepted — kept as-is per Pavle. | none | — |
| - | Podcast single (§6) | Skipped; re-audit after real episodes ship. | post-launch | — |

**TL;DR:** only **#1** is a real launch-blocker. Everything else is either content backlog (#2), accepted as new spec (#3, footer), post-launch polish (#4), or 5-min verification (#5, #6).

---

## Addendum — fresh Figma fetches (2026-04-29 second pass)

The first pass hit a rate limit on file `LrfQdM6RTwf95gfkga3tJl`. The same node IDs exist in the main file `7qZIJIngHrkTeaq9nWZkSa` (the file owner sits on a different Figma team where Pavle has full Pro access), so the remaining critical pairs were re-fetched there. Confirmed findings:

### Case studies index (`248:1917`) — Critical #1 confirmed
Figma shows **flat brand-color panels per slug**, no hero photo:

| Slug | Figma panel color |
|---|---|
| Affinda | dark teal/forest green |
| My Baskets | cream/beige |
| Nagish | black |
| Art by Maudsch | purple/blue |
| DesignRush | dark navy |
| Number Artist (now `diy-craft-ecom-brand`) | orange |

Each card: solid color panel + client name centered + arrow icon top-right + title + description + date below. **Site's broken behavior of rendering the same hand photo on all 6 cards in light mode is a regression.** Fix: drop the heroImage fallback in the index card component, render flat panels with the existing `CASE_STUDY_PANEL_FALLBACKS` colors.

### Case study single (`2255:878`) — Hero pills + Numbers section confirmed
Figma shows:
- Hero metric pills row: **3 pills with real values** (e.g. "8.4 Months / $1.3M Organic Revenue / 63,500 Monthly Visitors").
- **Numbers That Matter** section: dark panel with 8-card 4×2 metric grid containing real numbers (54 / 63.5K / 957 / 3.6K / 16.1M / 200K+ / 800+ / $1.3M for the Number Artist case study).
- Growth chart, Proof Data with 6 analytics screenshot cards, Before/After comparison, Conclusion, footer CTA.

**Sections collapsing on the site is a content-population gap, not a render bug** — the migration didn't bring `numbersThatMatter` / `growthChart` / `beforeAfter` data per slug. Real fix is content-side: populate per slug.

### Team detail (`197:891`) — body uses flowing prose, not Q&A
The Figma popup design renders the bio as **two long flowing paragraphs per column**, not the BCMS-legacy Q&A format that the migration brought ("Name 3 of your personal traits:" / "Resilient, dedicated, and ambitious." / "What I like to do in my spare time:"). The latest copy reads as a continuous narrative.

**Mismatch is content, not code.** Two valid paths:
- Rewrite each of the 7 team bios as 2-3 flowing paragraphs (~20 min copy task per member; client-side).
- Accept current single-col stack as the new spec (no work).

The glass contact tile overlay (5 social pills + "Save to Contacts") is a real Figma feature missing from the site. Defer post-launch.

### About Us (`189:5`) — 8th "team card" is a CTA, not a portrait
The 8th slot in the team grid is a **"Become a Hero"** purple CTA panel inviting candidates to apply, NOT a real team member portrait. Migrated team has 7 members + this CTA = 8 cards in a 4×2 grid.

**Verify on site** whether the 8th slot renders the CTA panel or repeats a member. Cards 5–8 looking dark on the mobile thumbnail (§8b) may simply be the CTA panel + the bottom row.

Other Figma elements to verify on site:
- "The Fastest and Most Effective to Get Started" — 4 service-category pills section between the 3-col block and the dark "we focus on one thing" panel. Confirm this section renders.
- Dark "We focus on one thing: organic performance" panel.
