# Heroic Rankings — Bundled Launch Design

**Status:** Draft, awaiting Pavle approval
**Date:** 2026-04-28
**Owner:** Pavle Lazic (product/architect/PM); Claude (implementation)
**Brainstorm:** see commit history

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

### 2.2 `teamMember` (existing) — sufficient as-is

Existing fields cover the Figma popup (`name`, `role`, `bioParagraphs[]`, `cardImage`, `contact{email,phone}`, `socialLinks[]`). Migration populates them.

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

Chart implementation: **`recharts`** dynamically imported via `next/dynamic({ ssr: false })`. Custom tooltip + dot for highlighted month. Skeleton placeholder during SSR.

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
  ├── parseArgs()              — --dry-run, --type, --limit
  ├── connectBcms()
  ├── connectSanity()
  ├── primeAssetCache()        — query existing sanity.imageAsset with source.id
  ├── migrateTeamMembers()     — first (others reference team)
  ├── migrateTestimonials()
  ├── migrateBlogPosts()       — depends on team for author refs
  ├── migrateCaseStudies()
  ├── migratePodcastEpisodes()
  ├── writeReport()
  └── main() — try/catch per type, exits non-zero on errors
```

### 4.4 Idempotency

Deterministic doc IDs: `${type}-${bcmsEntry._id}`. `client.createOrReplace()` ensures same input produces same dataset state regardless of run count.

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

### 4.5 HTML → Portable Text

`@portabletext/block-tools` `htmlToBlocks()` with custom rules for `<img>` blocks (upload + insert image reference). JSDOM polyfill for Node-side DOM parsing.

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

`src/lib/site.ts`:
- `SITE_LINKEDIN_URL`: confirm hyphenation with Pavle (live: `linkedin.com/company/heroic-rankings`)
- `SITE_X_URL`: confirm handle (live: `twitter.com/heroic_rankings` underscore)

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

## 8. Timeline & Sequencing

### Day 1

| PR | Hours | Notes |
|---|---|---|
| PR 1 — Nebojša fixes | ~2h | needs `/local-seo` CTA copy + social handles confirms |
| PR 2 — Schema additions + tokens | ~3h | independent; parallel with PR 1 |
| PR 3a — BCMS discovery script | ~1h | needs BCMS API key |
| PR 3b — Migration script + dry-run | ~3h | depends on PR 2 deployed |

Day 1 deliverable: PRs 1, 2, 3 merged to main; migration dry-run reviewed.

### Day 2

| PR | Hours | Notes |
|---|---|---|
| PR 3c — Live migration run | ~30m | `--no-dry-run`, verify Studio populated |
| PR 4 — Detail page wiring | ~8–10h | biggest chunk; case study + podcast + team popup + insights all 1:1 Figma |
| PR 5 — Verification | ~2h | parallel with PR 4 review |
| PR 6 — Production cutover | ~1h | DNS + Vercel + final smoke |

Day 2 deliverable: bundled release live on production domain.

### Critical path & parallelization

Sequential: PR 3 needs PR 2 deployed; PR 4 needs PR 3 data populated; PR 6 needs PR 5 green.

Parallelizable: PR 1 + PR 2 simultaneously; within PR 4 case study + podcast + team popup are independent feature branches (3 parallel agent dispatches); visual baselines + a11y + k6 run concurrently in PR 5.

### Blocking inputs needed from Pavle today

1. BCMS API key + confirm org/instance IDs
2. Sanity write token
3. Confirm `/local-seo` CTA copy
4. Confirm LinkedIn + X handles
5. Re-confirm vCard "Save to Contacts" feature (already agreed; re-asked given timeline)

---

## 9. Open questions

These remain unresolved and must be answered before the corresponding PR ships:

| # | Question | Blocks |
|---|---|---|
| O1 | Final `/local-seo` CTA copy | PR 1 |
| O2 | Real LinkedIn + X handles | PR 1 |
| O3 | BCMS API key + org/instance IDs | PR 3a |
| O4 | Sanity write token | PR 3 |

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
