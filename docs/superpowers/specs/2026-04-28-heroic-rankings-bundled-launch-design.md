# Heroic Rankings — Bundled Launch Design

**Status:** Draft v2 (Codex review integrated), awaiting Pavle approval
**Date:** 2026-04-28
**Owner:** Pavle Lazic (product/architect/PM); Claude (implementation)
**Brainstorm:** see commit history
**Reviewers:** Codex senior-dev pass (2026-04-28) — 2 CRITICAL + 4 HIGH findings integrated; see Section 12 changelog

---

## Executive Summary

Convert the new Heroic Rankings site from a partially-CMS-driven static implementation to a fully Sanity-driven, production-ready release. This spec covers six PRs that converge on one production cutover: Nebojša UX fixes, Sanity schema additions, BCMS → Sanity content migration, four detail page templates wired 1:1 to Figma, verification, and the live cutover.

The site currently runs on Next.js 16 App Router + React 19 + Tailwind v4 with twelve Sanity schemas defined and partial wiring (About Us already pulls from Sanity). Detail page routes for blog post, case study, team member, and podcast episode exist but are stubbed with hardcoded data. Live content for the legacy heroicrankings.com site lives in BCMS (`thebcms.com`). This work moves all of that content into Sanity and powers the new detail page templates with it.

Current site traffic is ~4K monthly visits (~5/hour). Performance and correctness, not scaling, are the bar.

---

## Goals

- Production-ready bundled release of the new Heroic Rankings site
- All four detail page templates implemented at 1:1 visual fidelity with Figma `7qZIJIngHrkTeaq9nWZkSa`
- All content migrated from BCMS to Sanity (idempotent, repeatable, dry-runnable)
- Six concrete UX fixes from Nebojša's most recent review batch
- Verified against Lighthouse, accessibility, visual regression, and light load thresholds
- Single cutover event (DNS + Vercel production deploy) with rollback path

## Out of Scope

- Blog post single-page detail design (Figma missing — deferred to a separate later PR)
- Sentry / error monitoring tooling (flag for future work)
- Editorial workflow training for Nebojša/Pavle on Sanity Studio (separate doc)
- "Ask Podcast AI" / chatbot widget feature (button is rendered per Figma but the AI backend is out-of-scope)

---

## 1. Architecture & Data Flow

### 1.1 Routes after this work

| Route | Source | Status |
|---|---|---|
| `/` | hybrid (Sanity teasers + hardcoded sections) | unchanged |
| `/about-us` | Sanity (team + posts + testimonials) | unchanged, populated by migration |
| `/seo-services` + 7 service routes | mostly hardcoded | unchanged this scope |
| `/partnership` | partial Sanity wiring | unchanged this scope |
| `/contact` | Sanity contactPage | unchanged |
| `/insights` | Sanity post list | unchanged |
| `/insights/[slug]` | hardcoded "Market Research" article | **becomes Sanity-driven** with placeholder editorial layout (per Q6 deferred) |
| `/case-studies` | Sanity card list | unchanged |
| `/case-studies/[slug]` | 1 hardcoded entry | **becomes Sanity-driven 1:1 Figma `2255:878` / `2255:1378`** |
| `/podcast` | hardcoded | **becomes Sanity-driven** |
| `/podcast/[slug]` | broken (`href="#"`) | **becomes Sanity-driven 1:1 Figma `2223:49` / `2223:723`** |
| `/team/[slug]` | route exists | **REMOVED** (popup-only per Q5) |
| `/privacy-policy` | Sanity legalPage | unchanged |

### 1.2 Data fetch pattern

Server components fetch from Sanity via `next-sanity` `sanityFetch()` with GROQ at request time. Live API gives Studio→site preview within ~5 seconds without ISR busting. Production cache: `revalidate: 60`. 404 behavior: GROQ returns `null` → route triggers `notFound()` (no fallback to hardcoded data after PR 4).

### 1.3 Migration architecture

Standalone Node 20+ ESM script `scripts/bcms-to-sanity.mjs` runs locally or in CI. Reads BCMS via `@thebcms/client` SDK; writes to Sanity via `@sanity/client` writeClient with `apiVersion: '2026-03-01'`, `useCdn: false`. See Section 4 for full migration design.

### 1.4 Cutover behavior

After PR 4 merges, hardcoded data files are deleted: `src/data/case-study-details.ts`, `src/data/podcast-episodes.ts`, `src/data/blog-posts.ts` registry stub, the `Market Research` constants in `blog-post-detail-content.tsx`. Pages 100% rely on Sanity. Empty Sanity dataset → 404 (intentional — catches gaps).

**Pre-launch content validator (gate for PR 6):** before cutover, run `scripts/validate-launch-content.mjs` which queries Sanity production dataset and asserts every launch-required slug has every required structured field populated (see Section 6.10 for the validator spec). Validator failure → PR 6 cannot merge. This protects against the cutover-crash-risk where deleting hardcoded fallbacks meets editor-incomplete content.

---

## 2. Sanity Schema Additions & Extensions

### 2.1 New tokens (added to `src/app/globals.css`)

| Token | Value | Used for |
|---|---|---|
| `--color-hr-pure-black` | `#050505` | Two-tone hero titles on case study + podcast detail |
| `--color-hr-black-box` | `#0C0C0C` | Dark metric card backgrounds inside `#151419` panels |
| `--color-hr-dark-line` | `#2A2A2A` | Borders on dark metric cards / dark transcript cards |
| `--gradient-brand-light` | `linear-gradient(~210deg, #826FFF 18%, #E188FF 41%, #E1BDFF 130%)` | Big numbers / accent text on dark sections |

Plus utility class `.gradient-text-brand-light` mirroring the existing `.gradient-text-brand` pattern.

**Existing tokens unchanged.** Existing pages render byte-identical to today.

### 2.2 `teamMember` (existing) — one breaking change required

Existing fields cover the Figma popup (`name`, `role`, `bioParagraphs[]`, `cardImage`, `contact{email,phone}`, `socialLinks[]`). Migration populates them.

**Required schema change in PR 2:** `slug` is currently `optional` at `src/sanity/schemaTypes/documents/teamMember.ts:14`. Change to `validation: r => r.required()`. Hash deep-linking on About Us popup (`#nebojsa-jankovic`) and prev/next navigation depend on slugs being present and unique. Migration step asserts every `teamMember` doc has a slug after import; fails if any are missing.

**Image alt validation:** add `validation: r => r.required()` on `photo.alt` and `cardImage.alt`. Currently optional — non-decorative editorial images must have alt for accessibility (Codex MED finding).

### 2.3 `post` (existing blog) — sufficient as-is

Existing fields (`title`, `slug`, `excerpt`, `mainImage`, `body` portableText, `author→teamMember`, `categories[]`, `publishedAt`, `seo`) cover BCMS migration. Detail layout uses placeholder editorial template until blog Figma lands.

### 2.4 `caseStudy` — major extension

Add 12 new fields to the existing `caseStudy.ts` schema. All optional to maintain backward compatibility with existing GROQ queries.

| New field | Type | Purpose |
|---|---|---|
| `heroSubtitle` | text (rows: 2) | Subtitle below H1 |
| `heroMetrics` | array of `{value, label}` (max 3) | 3 hero stat tiles |
| `caseOverview` | object `{label, headingMain, headingHighlighted, body}` | Case Overview block |
| `objectiveChallenges` | object `{label, headingMain, headingHighlighted, body, items[3]: {number, title, body}}` | 3 numbered cards |
| `strategyPillars` | array of `{title, intro, bullets[], icon}` (6 items) | Six Pillars cards |
| `journeyTimeline` | object `{label, headingMain, headingHighlighted, items[]: {title, body}}` | Journey timeline (4–5 steps) |
| `numbersThatMatter` | object `{label, headingMain, headingHighlighted, body, items[]: {value, label, sub, icon}}` | Big-numbers section |
| `growthChart` | object `{headingMain, headingHighlighted, leftAxisLabel, rightAxisLabel, months[], series[]: {label, color, points[]}, tooltipMonth, tooltipMetrics[]}` | Line chart |
| `proofData` | object `{label, headingMain, headingHighlighted, body, items[]: {title, body, image, metricTags[]: {label, value, isAccent}, isFullWidth}}` | Analytics screenshots |
| `beforeAfter` | object `{label, headingMain, headingHighlighted, body, items[5]: {label, before, after}}` | 5-stat comparison |
| `conclusion` | object `{heading, gradientSubhead, body: portableText}` | Conclusion panel |
| `ctaFooter` | object `{label, headingMain, headingHighlighted, body, primaryCta, secondaryCta}` | Per-case-study final CTA |

Pattern for split-color headings: `headingMain` (solid) + `headingHighlighted` (gradient) — concatenated at render time with a space.

**Bounded validation rules (added per Codex HIGH finding):**

- `heroMetrics`: `r.max(3)`
- `objectiveChallenges.items`: `r.length(3)` exactly
- `strategyPillars`: `r.length(6)` exactly
- `journeyTimeline.items`: `r.min(4).max(6)`
- `numbersThatMatter.items`: `r.min(4).max(8)`
- `growthChart.series`: `r.min(1).max(5)`; custom validation: every series has `points[]` length equal to `months.length`
- `growthChart.series[].color`: `enum: ['gradient-light', 'white-trace', 'grey-trace']` (token-based, not free-form hex)
- `proofData.items`: `r.max(8)`; each item's `image` field has `validation: r => r.required()` and `image.alt` required
- `beforeAfter.items`: `r.length(5)` exactly
- All editorial image fields (`heroImage`, `cardImage`, `strategyPillars[].icon`, `proofData[].image`, etc.): `alt` field required

These rules prevent editors creating "valid" but visually broken docs (mismatched series lengths, missing required cards).

### 2.5 New: `podcastEpisode` document type

Defined in `src/sanity/schemaTypes/documents/podcastEpisode.ts`. Registered in `src/sanity/schemaTypes/index.ts`. Fields:

- `title` (string, required)
- `titleHighlighted` (string) — substring rendered with gradient
- `slug` (slug, required)
- `episodeNumber` (number, required, integer, positive)
- `duration` (string, required) — "1h 44min"
- `guest` (object: `{name, role, company, photo, bio, linkedinUrl, twitterUrl, websiteUrl}`)
- `description` (text, rows: 4)
- `heroImage` (image, hotspot, alt)
- `videoEmbedUrl` (url) — YouTube/Vimeo/direct
- `keyInsights` (object: `{headingMain, headingHighlighted, body, topicPills[] (max 8), bullets[] (max 10)}`)
- `bestMoments` (array of `reel` objects: `{title, thumbnail, videoUrl, caption}`, max 6)
- `transcript` (portableText)
- `relatedEpisodes` (array of references to podcastEpisode, max 3)
- `publishedAt` (datetime, required)
- `seo` (existing seo object type)

Plus orderings (newest first) and preview config.

**Bounded validation rules:**

- `episodeNumber`: required, integer, positive, **unique** (custom validation queries other docs)
- `bestMoments`: `r.max(6)`; each reel's `thumbnail` required, `videoUrl` required, `thumbnail.alt` required
- `keyInsights.bullets`: `r.min(1).max(10)`
- `keyInsights.topicPills`: `r.max(8)`
- `relatedEpisodes`: `r.unique().max(3)` (no self-reference)
- `heroImage.alt` required, `guest.photo.alt` required
- `transcript`: required if `videoEmbedUrl` present (so audio/video has searchable text)

### 2.6 Sanity Studio organization

`src/sanity/structure.ts` adds a "Podcast" section with "Episodes" (newest first). Case Studies list gets the orderable plugin (already imported per `package.json`).

### 2.7 GROQ queries to add (`src/sanity/lib/queries.ts`)

- `PODCAST_EPISODES_QUERY` — list view
- `PODCAST_EPISODE_BY_SLUG_QUERY` — detail with deref
- `PODCAST_EPISODE_SLUGS_QUERY` — `generateStaticParams`
- Update `CASE_STUDY_BY_SLUG_QUERY` to deref all 12 new structured fields

---

## 3. Detail Page Implementations & 1:1 Fidelity Strategy

### 3.1 Fidelity strategy

Figma export gives absolute-positioned code. Translate to **semantic flow layout** while preserving every Figma value as Tailwind arbitrary values:

- Desktop (≥1024px): exact Figma desktop pixel values via `lg:` prefix
- Mobile (<1024px): exact Figma mobile pixel values default
- Tablet (768–1023): graceful single-column fallback
- Semantic HTML: `section`, `article`, `h1`–`h3`, `ul`/`li`, `figure`
- Reuse existing primitives: `Container`, `SectionLabel`, `GradientText`, `AppLink`, `Button`, `GradientArrowUpRightIcon`
- Visual regression check (PR 5): Playwright screenshots at 1440 / 1024 / 768 / 375, baseline manually compared against Figma renders, then automated diff

### 3.2 Case Study Detail (`/case-studies/[slug]`)

`src/components/pages/case-studies/case-study-detail-page.tsx` — full rewrite.

Sub-components in `src/components/pages/case-studies/parts/`:
- `CaseStudyHero.tsx`, `CaseStudyHeroPanel.tsx`, `CaseStudyOverview.tsx`, `CaseStudyChallenges.tsx`, `CaseStudyPillars.tsx`, `CaseStudyJourney.tsx`, `CaseStudyNumbers.tsx`, `CaseStudyGrowthChart.tsx`, `CaseStudyProofData.tsx`, `CaseStudyBeforeAfter.tsx`, `CaseStudyConclusion.tsx`, `CaseStudyCtaFooter.tsx`

New shared primitives in `src/components/ui/`:
- `MetricTile.tsx`, `NumberedStepCard.tsx`, `BigNumberCard.tsx`, `TwoToneHeading.tsx`, `MobileScrollRail.tsx`

**Chart implementation (revised per Codex MED finding):** `recharts` lives in a dedicated client island file `CaseStudyGrowthChartClient.tsx` with explicit `'use client'` directive. The parent `CaseStudyGrowthChart.tsx` (server component) renders a wrapper `<div>` with **fixed height (mobile: 384px; desktop: 480px)** so the layout reserves space before hydration — prevents CLS. The client island is loaded via `next/dynamic(() => import('./CaseStudyGrowthChartClient'), { ssr: false, loading: () => <ChartSkeleton /> })`. ChartSkeleton matches the reserved height. Empty-data case (zero series or zero months) renders a "Data unavailable" placeholder instead of throwing.

Data: `app/(site)/(pages)/case-studies/[slug]/page.tsx` calls `generateStaticParams()` from `getCaseStudySlugs()`, then `getCaseStudyBySlug(slug)`, then `notFound()` on null.

### 3.3 Podcast Episode Detail (`/podcast/[slug]`)

`src/components/pages/podcast/podcast-episode-page.tsx` — refactor.

Sub-components in `src/components/pages/podcast/parts/`:
- `PodcastEpisodeHero.tsx`, `PodcastKeyInsights.tsx`, `PodcastBestMoments.tsx`, `PodcastTranscript.tsx`, `PodcastShareBar.tsx`, `PodcastRelatedEpisodes.tsx`

New primitives:
- `PlayButtonOverlay.tsx`, `ReelThumbnail.tsx`, `TranscriptExpander.tsx`

Data: same pattern as case study.

### 3.4 Team Member Popup

`src/components/sections/team-member-popup.tsx` — full rewrite to match Figma `197:891` (desktop) and `672:4109` (mobile). Existing controller (`about-us-team-popup-controller.tsx`) and dialog wiring preserved.

New sub-components: `TeamMemberPopupDesktop.tsx`, `TeamMemberPopupMobile.tsx`, `ContactPillStack.tsx`. New util: `src/lib/vcard.ts` — `.vcf` blob generation for "Save to Contacts".

**vCard hardening (revised per Codex MED finding):**
- Use **CRLF line endings** (`\r\n`) per RFC 6350 — Outlook chokes on plain `\n`
- **Escape special chars** in field values: `\`, `,`, `;`, newlines (per RFC 6350 § 3.4)
- **Normalize phone numbers** to E.164 (`+1 555 555 1234` → `+15555551234`); reject invalid
- **Safe filename:** ASCII-only, no spaces, e.g. `nebojsa-jankovic.vcf` (slug-derived)
- **Fallback path:** if vCard generation fails (validation reject), button degrades to opening a panel with `mailto:` + `tel:` + LinkedIn/X/Instagram links inline. Never silent failure.
- **Tested fixtures:** `src/lib/__tests__/vcard.test.ts` covers names with diacritics (Nebojša Janković), emails with subaddressing, missing phone, all-empty contact (button hidden in that case).
- **Cross-platform smoke:** stress-test phase manually verifies download + import on iOS Safari, Android Chrome, macOS Mail, Outlook (per matrix in 6.6).

Data: `cmsTeamMembers` from Sanity (already wired through About Us page).

### 3.5 Insights Blog Detail (`/insights/[slug]`)

`src/components/pages/insights/blog-post-detail-content.tsx` — full rewrite. Placeholder editorial layout: hero (title + author + date + cover) + Portable Text body + related posts grid.

Custom Portable Text serializers in `src/sanity/lib/portable-text-components.tsx` (new file): images with LQIP + responsive sizes, code blocks, callouts, internal links.

When blog single Figma lands later → separate redesign PR. Data wiring done now stays.

### 3.6 Files modified summary

```
NEW:
  src/sanity/schemaTypes/documents/podcastEpisode.ts
  src/sanity/lib/portable-text-components.tsx
  src/components/pages/case-studies/parts/*.tsx (~12 files)
  src/components/pages/podcast/parts/*.tsx (~6 files)
  src/components/ui/metric-tile.tsx
  src/components/ui/numbered-step-card.tsx
  src/components/ui/big-number-card.tsx
  src/components/ui/two-tone-heading.tsx
  src/components/ui/mobile-scroll-rail.tsx
  src/components/ui/play-button-overlay.tsx
  src/components/ui/reel-thumbnail.tsx
  src/lib/vcard.ts
  scripts/bcms-to-sanity.mjs
  scripts/bcms-discover.mjs

REWRITTEN:
  src/components/pages/case-studies/case-study-detail-page.tsx
  src/components/pages/podcast/podcast-page.tsx (index)
  src/components/pages/podcast/podcast-episode-page.tsx (detail)
  src/components/pages/insights/blog-post-detail-content.tsx
  src/components/sections/team-member-popup.tsx

EXTENDED:
  src/sanity/schemaTypes/documents/caseStudy.ts (+12 fields)
  src/sanity/schemaTypes/index.ts (register podcastEpisode)
  src/sanity/lib/queries.ts (+ podcast queries, update case study query)
  src/lib/sanity-data.ts (+ podcast getters, update case study getter types)
  src/app/globals.css (+ 4 tokens, gradient-brand-light class)

DELETED:
  src/app/(site)/(pages)/team/ (route handler + slug page)
  src/data/case-study-details.ts (replaced by Sanity)
  src/data/podcast-episodes.ts (replaced by Sanity)
  hardcoded ARTICLE constants in blog-post-detail-content.tsx
```

---

## 4. BCMS → Sanity Migration

### 4.1 Architecture

Single ESM Node 20+ script `scripts/bcms-to-sanity.mjs`. Not part of Next runtime.

```
BCMS API (cdn.thebcms.com/api/v3)
        ↓  @thebcms/client + BCMS_API_KEY
   [in-memory transform]
        ↓  field map per template
        ↓  HTML → Portable Text via @portabletext/block-tools
        ↓  asset dedup cache (source.id → sanityAssetId)
        ↓
   Sanity Content Lake (production dataset)
        ↓  @sanity/client writeClient + SANITY_API_WRITE_TOKEN
        ↓  client.createOrReplace({ _id: deterministic, ... })
        ↓  client.assets.upload('image', buffer, { source: { id, name, url } })
        ↓
   migration-report.json
```

### 4.2 Approach choice

Custom `@sanity/client` writeClient script chosen over NDJSON CLI import or `defineMigration`:

- NDJSON: no dry-run, no per-asset dedup tracking via `source` metadata
- `defineMigration`: designed for in-place schema transforms, not cross-CMS imports
- Custom script: full control over field mapping per template, idempotent via `createOrReplace` with deterministic IDs, asset dedup via `source.id` cache, dry-run flag, per-doc error handling — canonical 2026 pattern per Sanity Learn courses

### 4.3 Script structure

```
scripts/bcms-to-sanity.mjs
  ├── parseArgs()              — --dry-run, --type, --limit, --strict
  ├── connectBcms()            — verify auth, retry 3× w/ exponential backoff on 5xx
  ├── connectSanity()          — verify project + dataset, fail fast if wrong
  ├── primeAssetCache()        — query existing sanity.imageAsset with source.id
  ├── migrateTeamMembers()     — first (others reference team)
  ├── migrateTestimonials()
  ├── migrateBlogPosts()       — depends on team for author refs
  ├── migrateCaseStudies()
  ├── migratePodcastEpisodes()
  ├── validateLaunchAllowlist() — assert every slug in launch-allowlist.json was created/updated
  ├── writeReport()
  └── main() — try/catch per type, exits non-zero on errors OR unsupportedHtml warnings
```

**Failure modes handled (added per Codex MED finding):**

- **Slug collisions:** if two BCMS entries map to the same Sanity slug, abort with explicit error listing both source IDs. Don't silently overwrite.
- **Asset 4xx/5xx:** retry 3× with exponential backoff (1s, 2s, 4s); after 3 failures, log to `report.errors[]` and skip the doc.
- **Asset MIME validation:** verify `Content-Type: image/*` on download; reject otherwise.
- **Asset size cap:** reject assets > 20MB (Sanity asset upper limit is 20MB on free tier).
- **Stale Sanity docs:** end-of-run query `*[_type in $importerTypes && !(_id in $writtenIds)]` flags docs the importer didn't touch this run; logged but not deleted automatically (manual cleanup decision).
- **Launch allowlist:** `scripts/launch-allowlist.json` lists every slug expected to exist post-migration; script exits non-zero if any are missing. Updated by Pavle/Nebojša before each prod run.
- **Exit codes:** 0 = clean, 1 = errors (any), 2 = warnings only (unsupported HTML, stale docs).

### 4.4 Idempotency — patch-only-touch (revised per Codex CRITICAL finding)

**Original plan (rejected):** `client.createOrReplace()` with deterministic IDs. Problem: rerun overwrites editor-entered structured fields (the 12 new caseStudy fields are manual Studio entry, not BCMS-migrated). A second run after editors enriched content silently destroys their work.

**Revised plan:** explicit ownership boundary per document type, enforced via `patch()` semantics that only touch importer-owned keys.

Per-type ownership map:

| Doc type | Importer-owned (script writes/overwrites) | Editor-owned (script never touches after first creation) |
|---|---|---|
| `post` | title, slug, excerpt, mainImage, body, author, categories, publishedAt, seo | (none — all importer-owned) |
| `teamMember` | name, slug, role, department, photo, cardImage, bio, bioParagraphs, contact, socialLinks | (none — all importer-owned) |
| `testimonial` | quote, authorName, authorTitle, company, avatar, companyLogo, rating | featured, order |
| `caseStudy` | title, slug, client, panelLabel, excerpt, heroImage, cardImage, metrics[], body, services, featured, quoteText | heroSubtitle, heroMetrics, caseOverview, objectiveChallenges, strategyPillars, journeyTimeline, numbersThatMatter, growthChart, proofData, beforeAfter, conclusion, ctaFooter (all 12 new structured fields) |
| `podcastEpisode` | (likely empty — BCMS unlikely to have podcast template; verify in discovery) | all fields editor-owned |

**Write semantics:**

```js
async function importDoc(type, sanityId, importedFields) {
  const existing = await client.fetch(`*[_id == $id][0]`, { id: sanityId });
  if (!existing) {
    // First-time creation: write everything imported, leave editor-only fields undefined
    return client.create({ _id: sanityId, _type: type, ...importedFields });
  }
  // Existing doc: patch ONLY importer-owned keys; editor-owned keys remain untouched
  return client.patch(sanityId).set(importedFields).commit();
}
```

`patch().set()` updates only the keys passed; existing keys not in the patch are preserved. This is the canonical Sanity primitive for partial-write-with-preserve.

**Conflict detection:** if `existing` has any importer-owned key with a value that differs from `importedFields` (i.e., editor changed a "should be importer-owned" field manually), log a `WARN` to `migration-report.json` so we know editors went outside their lane. Don't fail the run — editor wins, but flag for review.

Asset dedup cache primed at start:

```js
const existingAssets = await client.fetch(
  `*[_type == "sanity.imageAsset" && defined(source.id)]{ _id, "sourceId": source.id }`
);
const assetCache = new Map(existingAssets.map(a => [a.sourceId, a._id]));

async function uploadOrReuseAsset(bcmsAssetId, bcmsAssetUrl, name) {
  if (assetCache.has(bcmsAssetId)) return assetCache.get(bcmsAssetId);
  const buffer = Buffer.from(await fetch(bcmsAssetUrl).then(r => r.arrayBuffer()));
  const asset = await client.assets.upload('image', buffer, {
    source: { id: bcmsAssetId, name, url: bcmsAssetUrl },
    filename: name,
  });
  assetCache.set(bcmsAssetId, asset._id);
  return asset._id;
}
```

### 4.5 HTML → Portable Text — strict, sanitized (revised per Codex HIGH finding)

`@portabletext/block-tools` `htmlToBlocks()` with custom rules for `<img>` blocks (upload + insert image reference). JSDOM polyfill for Node-side DOM parsing.

**No raw-HTML escape hatch.** If `htmlToBlocks` encounters a node it cannot serialize, the script:

1. Logs the unsupported HTML fragment + source `bcmsEntryId` to `migration-report.json`
2. Falls back to a sanitized HTML block via `isomorphic-dompurify` with strict allowlist (`p`, `strong`, `em`, `a[href]`, `ul`, `ol`, `li`, `blockquote`, `code`)
3. Wraps the sanitized HTML in a custom Portable Text block of `_type: 'rawHtml'` with `html` field — rendered via the Portable Text serializer in `src/sanity/lib/portable-text-components.tsx` using `dangerouslySetInnerHTML` (safe because input is DOMPurified)
4. **Increments `report.warnings.unsupportedHtmlBlocks` counter.** If counter > 0 at end of migration, exit code is non-zero — forces human review before launch.

**Dependencies added in PR 3:**
- `@portabletext/block-tools` (Sanity official)
- `isomorphic-dompurify` (DOMPurify wrapper that works in Node)
- `jsdom` (DOM polyfill for `htmlToBlocks` Node usage)

**Test fixtures:** `scripts/__tests__/htmlToBlocks.test.mjs` with malicious-input fixtures (`<script>`, `<iframe>`, event handlers, javascript: URLs) — all must be sanitized to safe output. Run via `node --test`.

### 4.6 Field mappings (provisional — finalized after BCMS discovery step)

Provisional based on observed BCMS URLs:

**`blog` → `post`:** `meta.title→title`, `meta.slug→slug.current`, `meta.excerpt→excerpt`, `meta.coverImage→mainImage`, `content→body` (htmlToBlocks), `meta.author→author` (resolved ref), `meta.categories[]→categories[]`, `meta.publishedAt→publishedAt`, `meta.seoTitle/seoDescription→seo.metaTitle/metaDescription`.

**`case-study` → `caseStudy`:** legacy fields only. New 12 structured fields (objectiveChallenges, strategyPillars, growthChart, etc.) do not exist in BCMS — populated as `undefined` for migrated entries; editors fill via Studio. The current "Number Artist" / "DIY Craft eCom" detail lives in hardcoded `case-study-details.ts` and gets manually entered into Studio post-migration.

**`team-member` → `teamMember`:** straight 1:1.

**`podcast-episode` → `podcastEpisode`:** if BCMS has the template; otherwise schema is populated manually (likely the case — live site has no `/podcast/`).

### 4.7 Discovery step

Before finalizing field mappings: run `scripts/bcms-discover.mjs` which calls `bcms.template.getAll()` and dumps each template's field schema + 1 sample entry. Manually diff against assumed mapping and adjust before production migration.

### 4.8 Error handling + reporting

Per-entry try/catch. Errors collected with full context (`type`, `bcmsId`, `error.message`, `error.stack`). Final exit code 0 if errors are skip-safe, 1 otherwise. `migration-report.json` always written.

### 4.9 Dry-run mode

`--dry-run` flag: all writes/uploads logged, not executed. Asset cache still pre-loaded so dedup logic exercises. Run order: `--dry-run` → review → fix mapping → `--dry-run` again → live run.

### 4.10 Required credentials

1. `BCMS_API_KEY` (read-only scope) in `.env.local`
2. BCMS organization ID + instance ID (likely `org/620528baca65b6578d29868d/instance/6710e3bdeeda0c4a2de4b330` per existing CDN URLs — verify)
3. `SANITY_API_WRITE_TOKEN` (Editor or Administrator role) in `.env.local`
4. Production dataset is the migration target (no separate `staging` dataset per Q4)

---

## 5. Nebojša Fixes (PR 1)

Low-risk batch shipped first.

### 5.1 Footer CTA banner 3-way swap

`src/components/layout/footer-cta-variant.tsx`:

- `/on-page-seo` ← on-page content (currently misplaced under `/local-seo`)
- `/technical-seo` ← technical content (currently under `/on-page-seo`)
- `/local-seo` ← new copy: "Get Found by Customers Searching Right Now" + body about Google Maps + local pack visibility

The "Start Generating SEO Organic Revenue" copy is deleted (`/seo-services` already has its own variant).

### 5.2 Number Artist → DIY Craft eCom Brand

11 references across `case-studies-page.tsx` and `case-study-details.ts`. Display name and slug both change. Pre-launch site, no SEO/external link risk. Next.js redirect added in `next.config.ts` from old slug to new for ~30 days as cheap insurance.

### 5.3 Podcast nav broken links

`src/components/pages/podcast/podcast-page.tsx`:

- Line 295 (LatestEpisode "Open episode") `href="#"` → `href={`/podcast/${LATEST_EPISODE.slug}`}`
- Line 344 (EpisodeCard play button) `href="#"` → `href={`/podcast/${episode.slug}`}`
- Line 460 (Try the Chat Widget) `href="#podcast-chat"` → button removed (anchor doesn't exist; "Ask Podcast AI" feature is per-episode in Figma)

### 5.4 FAQ CTA removal

`src/components/pages/seo-services/seo-services-page.tsx` line 345: remove `answerExtra` prop. ServiceFaq renders cleanly without inline CTAs.

### 5.5 Remove `/team/[slug]` route

Delete `src/app/(site)/(pages)/team/`. Verify `src/app/sitemap.ts` doesn't include `/team/` paths. Internal links use hash deep-linking (`#slug`) on About Us, not route navigation.

### 5.6 Social URL fixes

`src/lib/site.ts` updates (confirmed by Pavle 2026-04-28):
- `SITE_LINKEDIN_URL` → `https://www.linkedin.com/company/heroic-rankings/`
- `SITE_X_URL` → `https://twitter.com/heroic_rankings`

These also propagate to `organization-schema` JSON-LD, `about-us-team-data.ts` defaults, footer, and any podcast share-button defaults that reference the brand-level handles.

### 5.7 Verification

`npm run typecheck`, `npm run lint`, `npm run build` all pass. Vercel preview manual smoke for the routes touched.

---

## 6. Stress Test & Production-Ready Signoff (PR 5–6)

Sized for 4K monthly = ~5 visitors/hour current. Bar is performance + correctness + SEO + accessibility, not scaling.

### 6.1 Performance baseline

Lighthouse CI on Vercel preview via GitHub Action. Targets per route:

- Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100
- LCP < 2.5s mobile / < 2.0s desktop
- INP < 200ms
- CLS < 0.1

`@vercel/speed-insights` and `@vercel/analytics` already wired.

### 6.2 Visual regression

Playwright `tests/visual/*.spec.ts` captures PNG at 1440 / 1024 / 768 / 375. Baseline manually verified against Figma, then automated diff in CI.

### 6.3 Functional smoke checklist

`tests/manual-smoke.md` — Pavle reviews before PR 6:

- [ ] Sitemap routes return 200
- [ ] Theme toggle works on all routes, no flash
- [ ] Mobile menu opens/closes
- [ ] Contact form submits + validates
- [ ] FAQ accordions on all service pages
- [ ] Case studies render full structured content (12 sections)
- [ ] Podcast episodes render full content (hero, insights, reels, transcript, share, related)
- [ ] Team popups: card click opens, prev/next nav, Esc closes, hash deep-links work
- [ ] Footer CTAs route-correct (3-way swap)
- [ ] Sanity Studio CRUD works
- [ ] Search Console sitemap submitted

### 6.4 SEO audit

Sitemap includes all CMS-driven routes. Robots.txt disallows `/studio`. Each detail page has unique title/meta/og:image. Schema.org JSON-LD: `Article` for blog posts, `Person` for team in About Us, `BreadcrumbList` for case studies + podcasts. Canonical URLs match production domain.

### 6.5 Accessibility

`@axe-core/playwright` runs on every route, fails PR on violation. VoiceOver manual spot-check: About Us team popup, case study detail. Keyboard nav: every interactive element reachable, visible focus ring.

### 6.6 Cross-browser/device

Manual smoke matrix: Chrome / Safari / Firefox at desktop + iOS Safari + Android Chrome. ~30 min total.

### 6.7 Light load test

`tests/load/baseline.js` k6 script: 50 RPS sustained 3 min (10× current peak). Threshold: p95 < 800ms, error rate < 1%. Catches catastrophic regressions (e.g. a route doing 50 GROQ queries per request).

### 6.8 Production-ready signoff (PR 6 merge gate)

All must pass:
1. Lighthouse scores ≥ targets
2. Playwright visual regression green
3. Playwright a11y green (zero axe violations)
4. Manual smoke checklist signed off
5. k6 load test green
6. Cross-browser matrix verified
7. Sanity Studio fully populated (no expected-slug 404s)
8. Sitemap + robots + schema markup live and verified
9. Production domain DNS configured
10. Vercel Analytics + Speed Insights live

### 6.9 Post-launch monitoring (first 7 days)

Vercel Speed Insights daily review. Vercel Analytics for traffic. Sanity Studio editorial QA (5 case studies, 5 blog posts, all team members spot-checked). Search Console crawl errors, indexing, Core Web Vitals.

Sentry / error monitoring NOT in scope; flagged as future work.

### 6.10 Pre-launch content validator (CRITICAL gate for PR 6)

`scripts/validate-launch-content.mjs` — runs against production Sanity dataset. Loads `scripts/launch-allowlist.json` (Pavle/Nebojša maintain) listing every slug that must be live at launch. For each slug:

```js
{
  type: "caseStudy",
  slug: "diy-craft-ecom-brand",
  requiredFields: [
    "title", "slug", "client", "excerpt", "heroImage", "cardImage",
    "heroSubtitle", "heroMetrics", "caseOverview",
    "objectiveChallenges", "strategyPillars", "journeyTimeline",
    "numbersThatMatter", "growthChart", "proofData", "beforeAfter",
    "conclusion", "ctaFooter"
  ]
}
```

Validator queries each doc, asserts every required field is **non-null AND non-empty** (arrays must have minimum length per validation rules, strings must be > 0 chars, references must resolve). Image fields validated to have `asset->_id` plus `alt` text.

**Output:**
- All pass → `report.status = 'PASS'`, exit 0, PR 6 unblocked
- Any miss → `report.status = 'FAIL'`, lists missing-field-by-slug, exit 1, PR 6 cannot merge until fixed
- Validator runs as a GitHub Action in PR 6 — can't merge if red

This is the explicit gate that prevents shipping empty/partial detail pages after fallback deletion.

### 6.11 Tooling install requirements (PR 5 prerequisite)

The signoff gate (6.8) assumes tooling that is NOT yet in `package.json`. Must be added in PR 5 BEFORE the gate is checked:

| Tool | Package | Use |
|---|---|---|
| Lighthouse CI | `@lhci/cli` (devDep) | Performance + a11y + SEO scores |
| axe-core for Playwright | `@axe-core/playwright` (devDep) | Automated a11y checks |
| k6 | binary install (or GitHub Action `grafana/k6-action`) | Light load test |

If install introduces regressions or PR 5 runs out of time → fall back to manual Lighthouse runs in Chrome DevTools + manual axe DevTools spot-check + skip k6 for first launch.

---

## 7. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | BCMS API key delay | High | Day-1 blocker | Fallback: scrape public CDN for assets + manual entry |
| 2 | Sanity write token missing | Med | Day-1 blocker | Create at sanity.io/manage, Editor role, scope to dataset |
| 3 | `caseStudy` extension breaks existing GROQ | Low | Build break | All new fields optional; CI `tsc --noEmit` gates PR 2 |
| 4 | Recharts SSR hydration mismatch | Med | Detail page broken | `dynamic({ ssr: false })` + skeleton placeholder |
| 5 | HTML → PortableText loses BCMS-specific blocks | Med | Body malformed | Custom serializers + DOMPurified raw-HTML fallback |
| 6 | BCMS content drifts during migration | Low | Stale data | 30-min freeze communicated to Nebojša beforehand |
| 7 | DNS cutover briefly unreachable | Med | Site down ~30s | Verify Vercel domain in PR 5; switch during low traffic |
| 8 | `src/data/*.ts` deletion leaves dangling imports | Low | Build break | `tsc --noEmit` catches; grep sweep in PR 4 |
| 9 | Slug change breaks bookmarks | Low (pre-launch) | 404 on shared URL | Next.js redirect from old slug |
| 10 | vCard cross-platform quirks | Med | Save-to-Contacts silently fails | Test iOS/Android in stress test; fallback to inline links |
| 11 | 1:1 Figma fidelity drift over time | High (long-term) | Visual regression | Playwright baselines + manual Figma review gate |
| 12 | Sanity rate limits during migration | Low | Migration partial | writeClient (not Live) limits: free tier 100 mut/s, we use ~5/s |

---

## 8. Timeline & Sequencing — revised to 3 days (per Codex finding)

Original plan was 2 days. Codex correctly flagged that the critical path is content pipeline (BCMS discovery → migration → manual editor enrichment of 12 new caseStudy fields → 1:1 UI) rather than UI work itself. 3 days is realistic; 2 days is plausible only if BCMS discovery is clean on first pass AND editors populate the new caseStudy structured fields immediately.

### Day 1 — Nebojša fixes + schema + discovery

| PR | Hours | Notes |
|---|---|---|
| PR 1 — Nebojša fixes | ~2h | needs social handles confirm (local-seo copy locked already) |
| PR 2 — Schema additions + tokens + validation rules + slug-required + alt-required | ~3h | independent; parallel with PR 1 |
| PR 3a — BCMS discovery script + run | ~2h | **highest-priority blocker** — needs BCMS API key first thing |

Day 1 deliverable: PRs 1, 2 merged. PR 3a discovery output reviewed; field mapping locked.

### Day 2 — Migration + manual enrichment + UI start

| PR | Hours | Notes |
|---|---|---|
| PR 3b — Migration script + dry-run | ~3h | depends on PR 2 deployed + PR 3a output |
| PR 3c — Live migration run | ~30m | `--no-dry-run`, verify Studio populated |
| **Manual content enrichment session** | ~2–3h (Pavle/Nebojša) | populate the 12 new caseStudy structured fields for each launch case study; populate podcastEpisode docs entirely (BCMS unlikely to have podcast template); seed launch-allowlist.json |
| PR 4a — Detail page wiring (team popup + insights) | ~3h | smaller surfaces, can start once schema is live (don't need migration content) |

Day 2 deliverable: migration live; editors enriching content; team popup + insights detail pages done.

### Day 3 — Heavy UI + verification + cutover

| PR | Hours | Notes |
|---|---|---|
| PR 4b — Case study detail (1:1 Figma `2255:878` / `2255:1378`) | ~4h | needs enriched content from Day 2 |
| PR 4c — Podcast episode detail (1:1 Figma `2223:49` / `2223:723`) | ~3h | needs podcastEpisode docs from Day 2 |
| PR 5 — Verification (Lighthouse CI + axe + visual + k6 install + smoke) | ~3h | parallel with PR 4 review |
| Pre-launch validator gate (Section 6.10) | ~30m | runs as GitHub Action; PR 6 blocked if red |
| PR 6 — Production cutover | ~1h | DNS + Vercel + final smoke |

Day 3 deliverable: bundled release live on production domain.

### Critical path & parallelization

**Sequential dependencies:** PR 3 needs PR 2 deployed; PR 4b/4c need PR 3 + manual enrichment; PR 6 needs PR 5 green AND validator green.

**Parallelizable:**
- Day 1: PR 1 + PR 2 simultaneously; PR 3a discovery in parallel with PR 2 review
- Day 2: PR 4a (team popup + insights) starts during the enrichment session — only needs schema, not migrated content
- Day 3: PR 4b + PR 4c are independent (3 parallel feature branches with Codex/agent dispatches OK); visual + a11y + k6 run concurrently in PR 5

### What slips the timeline

1. **BCMS API key delay** → entire migration shifts (Day 1 → Day 2)
2. **Editor enrichment session pushed to Day 3** → PR 4b/4c lose data contract → late rework
3. **First migration dry-run reveals BCMS shape mismatch** → discovery iteration adds ~half day
4. **Visual regression baselines fail** → manual Figma comparison loop

### Blocking inputs needed from Pavle today

1. **BCMS API key** + confirm org/instance IDs (`org/620528baca65b6578d29868d/instance/6710e3bdeeda0c4a2de4b330`)
2. **Sanity write token** (Editor or Administrator role)
3. **LinkedIn + X handles** (real URLs to lock in `src/lib/site.ts`)
4. **Editor availability for Day 2 enrichment session** (Pavle/Nebojša ~3 hours to populate 6 case studies × 12 new fields + podcast episodes from scratch)

---

## 9. Open questions

These remain unresolved and must be answered before the corresponding PR ships:

| # | Question | Status | Blocks |
|---|---|---|---|
| O1 | Final `/local-seo` CTA copy | Pavle approved interim copy ("Get Found by Customers Searching Right Now") for PR 1; Nebojša provides final copy for follow-up | PR 1 (resolved) |
| O2 | Real LinkedIn + X handles | ✅ resolved 2026-04-28 (`linkedin.com/company/heroic-rankings/` + `twitter.com/heroic_rankings`) | (resolved) |
| O3 | BCMS API key + org/instance IDs | unresolved | PR 3a |
| O4 | Sanity write token | unresolved | PR 3 |
| O5 | Editor availability for Day 2 enrichment session | unresolved | PR 4b/4c |
| O6 | Launch allowlist (`scripts/launch-allowlist.json`) — exact slugs that must be live + their required fields | needs Pavle/Nebojša input by Day 2 | PR 6 validator gate |

---

## 10. Decision log

Decisions made during brainstorming, with reasoning:

| Decision | Reasoning |
|---|---|
| Bundle into one production release (vs separate Nebojša-fix shipment) | User preference; cohesive launch |
| Single Sanity production dataset (no `staging` dataset) | Solo-dev / single-site context; Sanity drafts cover preview-before-publish; simpler |
| Vercel Preview branch for staging URL | Free, auto-deploys per branch |
| Approach B (six layered PRs converging on one cutover) | Best-practice review pacing + low risk per merge + matches user's bundled-release preference |
| Team popup-only (remove `/team/[slug]` route) | Figma is a popup overlay, not a page; user confirmed |
| Insights detail wired to Sanity now with placeholder layout (Option A) | Content goes live for SEO; layout polished later when blog Figma lands |
| Recharts + dynamic import for case study growth chart | 1:1 Figma fidelity needs real chart lib; lazy-load avoids global bundle hit |
| Ship vCard "Save to Contacts" feature | Button labeled in Figma; ~30 lines; honor design contract |
| Add 4 new tokens (`pure-black`, `black-box`, `dark-line`, `gradient-brand-light`) | Required for 1:1 fidelity on new dark sections; existing tokens unchanged |
| Custom `@sanity/client` writeClient script for migration | Cross-CMS imports need transformation logic + idempotency + dry-run; canonical 2026 pattern |
| Slug rename for Number Artist → DIY Craft eCom Brand (display + URL) | Pre-launch, low risk; redirect added as insurance |
| Lighthouse score targets ≥ 90 perf / ≥ 95 a11y / ≥ 95 best-practices / 100 SEO | Industry standard for marketing sites |

---

## 12. Changelog

**v2 (2026-04-28) — Codex review integrated:**

- Section 1.4: added pre-launch content validator as gate for PR 6 (CRITICAL)
- Section 2.2: `teamMember.slug` made required; alt text required on photo + cardImage (HIGH/MED)
- Section 2.4: added bounded validation rules for caseStudy structured fields (HIGH)
- Section 2.5: added bounded validation rules for podcastEpisode (HIGH)
- Section 3.2: explicit client-island boundary for Recharts with reserved layout space (MED)
- Section 3.4: vCard hardening — CRLF, escaping, normalized phones, fallback path, tested fixtures (MED)
- Section 4.4: switched from `createOrReplace` to patch-only-touch with importer-owned vs editor-owned field map per type (CRITICAL — prevents rerun overwriting editor work)
- Section 4.5: removed raw-HTML escape hatch; DOMPurify + strict allowlist + malicious-input fixtures + non-zero exit on unsupported HTML (HIGH)
- Section 4.3: added slug collision detection, asset retries, MIME validation, size cap, stale-doc detection, launch-allowlist assertion, exit code semantics (MED)
- Section 6.10: added pre-launch content validator script spec (CRITICAL)
- Section 6.11: added tooling install requirements (Lighthouse CI, axe-playwright, k6) before they're a gate (MED)
- Section 8: timeline revised from 2 days to 3 days; PR 4 split into 4a (independent of migrated content) and 4b/4c (depends on migrated content); editor enrichment session called out explicitly (HIGH)
- Section 9: added O5 (editor availability) and O6 (launch allowlist) as gating questions

**v1 (2026-04-28) — initial spec:** see commit history.

## 11. References

- BCMS Templates API: https://thebcms.com/docs/inside-bcms/templates
- BCMS Entries API: https://thebcms.com/docs/inside-bcms/entries
- Sanity Importing Data: https://www.sanity.io/docs/content-lake/importing-data
- Sanity Migration Cheatsheet: https://www.sanity.io/docs/content-lake/content-migration-cheatsheet
- Sanity Asset Upload Best Practices: https://www.sanity.io/learn/course/refactoring-content/uploading-assets-efficiently
- Sanity Idempotent Migrations: https://www.sanity.io/learn/course/handling-schema-changes-confidently/making-the-content-migration-more-idempotent
- WordPress → Sanity HTML to Portable Text: https://www.sanity.io/learn/course/migrating-content-from-wordpress-to-sanity/converting-html-to-portable-text
- Figma file (file key `7qZIJIngHrkTeaq9nWZkSa`):
  - Team Member Popup Desktop: node `197:891`
  - Team Member Popup Mobile: node `672:4109`
  - Case Study Single Desktop: node `2255:878`
  - Case Study Single Mobile: node `2255:1378`
  - Podcast Episode Single Desktop: node `2223:49`
  - Podcast Episode Single Mobile: node `2223:723`
- Cached Figma extractions: `docs/figma-cache/extractions/2026-04-28-*.md`
