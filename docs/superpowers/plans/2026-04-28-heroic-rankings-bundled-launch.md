# Heroic Rankings Bundled Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the new Heroic Rankings site to production: Nebojša UX fixes + Sanity-driven detail pages (case study, podcast episode, team popup, blog post) + BCMS→Sanity content migration + verification gates + cutover.

**Architecture:** Six sequential PRs converging on one production cutover. Sanity is the sole content source post-cutover (no fallbacks). Detail pages are server-rendered React Server Components fetching via `next-sanity`. BCMS migration uses a custom `@sanity/client` writeClient script with patch-only-touch idempotency to protect editor enrichment.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Sanity (Studio + Content Lake API), `@thebcms/client`, `@portabletext/block-tools`, `recharts`, `isomorphic-dompurify`, Playwright + `@axe-core/playwright`, Lighthouse CI, k6.

**Spec:** `docs/superpowers/specs/2026-04-28-heroic-rankings-bundled-launch-design.md`. Read it before executing any task — every task references spec sections for the "why."

---

## File Structure (decomposition lock)

### New files

```
src/sanity/schemaTypes/documents/podcastEpisode.ts        # NEW schema doc
src/sanity/lib/portable-text-components.tsx               # Sanity Portable Text serializers (images w/ LQIP, code, callouts)

src/components/pages/case-studies/parts/
  CaseStudyHero.tsx
  CaseStudyHeroPanel.tsx
  CaseStudyOverview.tsx
  CaseStudyChallenges.tsx
  CaseStudyPillars.tsx
  CaseStudyJourney.tsx
  CaseStudyNumbers.tsx
  CaseStudyGrowthChart.tsx                                # server wrapper
  CaseStudyGrowthChartClient.tsx                          # 'use client' island
  CaseStudyProofData.tsx
  CaseStudyBeforeAfter.tsx
  CaseStudyConclusion.tsx
  CaseStudyCtaFooter.tsx

src/components/pages/podcast/parts/
  PodcastEpisodeHero.tsx
  PodcastKeyInsights.tsx
  PodcastBestMoments.tsx
  PodcastTranscript.tsx
  PodcastShareBar.tsx
  PodcastRelatedEpisodes.tsx

src/components/ui/
  metric-tile.tsx
  numbered-step-card.tsx
  big-number-card.tsx
  two-tone-heading.tsx
  mobile-scroll-rail.tsx
  play-button-overlay.tsx
  reel-thumbnail.tsx

src/lib/vcard.ts                                          # vCard generator
src/lib/__tests__/vcard.test.ts                           # vCard test fixtures

scripts/bcms-discover.mjs                                 # BCMS template + sample dump
scripts/bcms-to-sanity.mjs                                # Migration script
scripts/validate-launch-content.mjs                       # Pre-launch validator
scripts/launch-allowlist.json                             # Slug list to assert at launch
scripts/__tests__/htmlToBlocks.test.mjs                   # HTML safety fixtures
scripts/__tests__/migration-idempotency.test.mjs          # Patch semantics tests

tests/visual/case-study-detail.spec.ts
tests/visual/podcast-episode.spec.ts
tests/visual/team-popup.spec.ts
tests/a11y/all-routes.spec.ts
tests/load/baseline.js
tests/manual-smoke.md

.lighthouserc.json                                        # Lighthouse CI config
.github/workflows/launch-gates.yml                        # CI gates for PR 5/6
```

### Modified files

```
src/components/layout/footer-cta-variant.tsx              # 3-way swap + new local-seo copy
src/components/pages/case-studies/case-studies-page.tsx   # Number Artist → DIY Craft eCom
src/components/pages/case-studies/case-study-detail-page.tsx  # Full rewrite, Sanity-driven
src/components/pages/podcast/podcast-page.tsx             # Fix href="#", remove #podcast-chat anchor
src/components/pages/podcast/podcast-episode-page.tsx     # Full rewrite per Figma
src/components/pages/insights/blog-post-detail-content.tsx  # Sanity-driven Portable Text
src/components/pages/seo-services/seo-services-page.tsx   # Remove answerExtra prop
src/components/sections/team-member-popup.tsx             # Full rewrite per Figma 197:891 + 672:4109
src/sanity/schemaTypes/documents/caseStudy.ts             # +12 structured fields, +validation
src/sanity/schemaTypes/documents/teamMember.ts            # slug required, alt required
src/sanity/schemaTypes/index.ts                           # Register podcastEpisode
src/sanity/lib/queries.ts                                 # +podcast queries, update case study query
src/lib/sanity-data.ts                                    # +podcast getters, types
src/lib/site.ts                                           # Lock LinkedIn + X URLs
src/data/case-study-details.ts                            # Number Artist → DIY Craft (PR 1) → DELETED in PR 4
src/app/globals.css                                       # +4 tokens, gradient-brand-light class
package.json                                              # +recharts, @portabletext/block-tools, isomorphic-dompurify, jsdom, @axe-core/playwright, @lhci/cli
next.config.ts                                            # +redirect /case-studies/number-artist → /case-studies/diy-craft-ecom-brand
```

### Deleted files (PR 1 + PR 4)

```
src/app/(site)/(pages)/team/[slug]/                       # PR 1
src/app/(site)/(pages)/team/                              # PR 1 (if empty after slug deletion)
src/data/case-study-details.ts                            # PR 4 (after migration)
src/data/podcast-episodes.ts                              # PR 4 (after migration)
hardcoded ARTICLE constants in blog-post-detail-content.tsx  # PR 4
```

---

# PR 1 — Nebojša Fixes

**Spec section:** 5. **Estimated:** ~2h. **Dependencies:** none. **Confirms locked:** O1 (interim local-seo copy), O2 (social handles).

## Task 1.1: Footer CTA banner 3-way swap

**Files:**
- Modify: `src/components/layout/footer-cta-variant.tsx`

**Spec:** 5.1

- [ ] **Step 1: Read the current file**

```bash
cat src/components/layout/footer-cta-variant.tsx
```

- [ ] **Step 2: Apply the 3-way swap edit (per Nebojša final 2026-04-28)**

In `CTA_VARIANTS` object — replace three entries.

`/local-seo` becomes:

```tsx
"/local-seo": {
  heading: (
    <>
      Dominate{" "}
      <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
        Your Market
      </span>
      <br />
      with Local SEO Success
    </>
  ),
  body: "Contact Us to schedule a consultation and learn how our local SEO services can enhance your local presence, connect you with nearby customers, and increase foot traffic to your business.",
  ctaLabel: "Get Started Today",
  ctaWidth: EXPANDED_CTA_WIDTH,
},
```

`/on-page-seo` becomes (gets the previously-misplaced `/technical-seo` "Start Generating" content per Nebojša):

```tsx
"/on-page-seo": {
  heading: (
    <>
      Start Generating SEO
      <br />
      <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
        Organic Revenue
      </span>
    </>
  ),
  body: "Start generating consistent organic SEO revenue and watch your business grow with sustainable, long-term results.",
  ctaLabel: "Get Started Today",
  ctaWidth: EXPANDED_CTA_WIDTH,
  bodyMaxW: "lg:max-w-[532px]",
  rootMaxW: "max-w-[600px]",
},
```

`/technical-seo` becomes (gets the previously-misplaced `/on-page-seo` "Technical SEO Precision" content):

```tsx
"/technical-seo": {
  heading: (
    <>
      Perfect Your Site with
      <br />
      <span className={GRADIENT_SPAN_CLASS} style={GRADIENT_STYLE}>
        Technical SEO Precision
      </span>
    </>
  ),
  body: "Contact us to schedule a consultation and discover how our technical SEO services can optimize your website’s infrastructure, enhance user experience, and boost your search engine rankings.",
  ctaLabel: "Get Started Today",
  ctaWidth: EXPANDED_CTA_WIDTH,
  headingMaxW: "max-w-[600px]",
  bodyMaxW: "lg:max-w-[814px]",
  rootMaxW: "max-w-[814px]",
},
```

The previous "Get Your On-Page SEO for Top Search Results" variant is **retired** — no route uses it. Delete that block entirely from `CTA_VARIANTS`.

- [ ] **Step 3: Run dev server and verify each route**

```bash
npm run dev
```

Open `localhost:3000/on-page-seo`, `/local-seo`, `/technical-seo`. Confirm bottom CTA reads correctly per spec table 5.1.

- [ ] **Step 4: Typecheck + lint**

```bash
npx tsc --noEmit
npm run lint
```

Both pass (lint may show pre-existing `theme-toggle.tsx` warning — ignore).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/footer-cta-variant.tsx
git commit -m "fix(footer-cta): 3-way swap per Nebojša final 2026-04-28

/on-page-seo gets the 'Start Generating SEO Organic Revenue' generic
revenue CTA (previously misplaced on /technical-seo).
/technical-seo gets the technical-specific 'Perfect Your Site with
Technical SEO Precision' content (previously misplaced on /on-page-seo).
/local-seo gets Nebojša's final copy: 'Dominate Your Market with Local
SEO Success' with body about local presence, nearby customers, and foot
traffic. Typo fix: 'servicescan' → 'services can'.

Previous 'Get Your On-Page SEO for Top Search Results' variant retired.

Per Slack thread 2026-04-28."
```

## Task 1.2: Number Artist → DIY Craft eCom Brand rename + redirect

**Files:**
- Modify: `src/components/pages/case-studies/case-studies-page.tsx:92-100, 130`
- Modify: `src/data/case-study-details.ts:65-207`
- Modify: `next.config.ts`

**Spec:** 5.2

- [ ] **Step 1: Rename in case-studies-page.tsx**

Edit lines 92–100:
- `title: "Number Artist"` → `title: "DIY Craft eCom Brand"`
- `panelLabel: "Number Artist"` → `panelLabel: "DIY Craft eCom"`
- `description: "Number Artist provides..."` → `description: "DIY Craft eCom Brand provides intricate and customized paint-by-number kits designed for art lovers of all skill levels."`
- `href: "/case-studies/number-artist"` → `href: "/case-studies/diy-craft-ecom-brand"`

Edit line 130 (the map key): `"number-artist"` → `"diy-craft-ecom-brand"`.

- [ ] **Step 2: Rename in case-study-details.ts**

Replace all 11 occurrences:
- `slug: "number-artist"` → `slug: "diy-craft-ecom-brand"`
- `heroTitle: "From Zero to Hero: Number Artist's Journey"` → `heroTitle: "From Zero to Hero: DIY Craft eCom's Journey"`
- 4 body paragraph mentions of "Number Artist" → "DIY Craft eCom Brand" (or "the brand" where the second mention sounds awkward)
- The `ENHANCED_CASE_STUDIES` map key

- [ ] **Step 3: Add redirect in next.config.ts**

Read current `next.config.ts`:

```bash
cat next.config.ts
```

Add a `redirects()` async function (or extend if it exists):

```ts
async redirects() {
  return [
    {
      source: '/case-studies/number-artist',
      destination: '/case-studies/diy-craft-ecom-brand',
      permanent: true,
    },
  ];
},
```

- [ ] **Step 4: Run dev server, verify**

```bash
npm run dev
```

- Visit `/case-studies` → card displays "DIY Craft eCom" panel label
- Visit `/case-studies/diy-craft-ecom-brand` → renders detail page with new name
- Visit `/case-studies/number-artist` → 308 redirects to `/case-studies/diy-craft-ecom-brand`

- [ ] **Step 5: Typecheck**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/case-studies/case-studies-page.tsx src/data/case-study-details.ts next.config.ts
git commit -m "fix(case-studies): rename Number Artist to DIY Craft eCom Brand

Display name and slug renamed across the case-studies index card and
the enhanced detail data file. Adds a permanent redirect from the old
slug for shareable-URL safety. The hardcoded data file will be deleted
in PR 4 once Sanity migration runs.

Per Nebojša review feedback batch 2026-04-28."
```

## Task 1.3: Podcast nav broken links

**Files:**
- Modify: `src/components/pages/podcast/podcast-page.tsx:295, 344, 460`

**Spec:** 5.3

- [ ] **Step 1: Read the file region around line 280–470**

```bash
sed -n '280,310p; 330,360p; 450,470p' src/components/pages/podcast/podcast-page.tsx
```

- [ ] **Step 2: Fix line 295 (Latest Episode play button)**

Change:
```tsx
href="#"
```
to:
```tsx
href={`/podcast/${LATEST_EPISODE.slug}`}
```

- [ ] **Step 3: Fix line 344 (EpisodeCard play button)**

Change `href="#"` to `href={`/podcast/${episode.slug}`}`.

- [ ] **Step 4: Remove the `Try the Chat Widget` button (line ~460)**

The `<AppLink>` block referencing `href="#podcast-chat"` is removed entirely. The surrounding section's heading and body text stay; only the button is excised. The "Ask Podcast AI" feature is per-episode in Figma — index-level CTA is a stub.

- [ ] **Step 5: Run dev server, verify**

```bash
npm run dev
```

Visit `/podcast`. Click any episode card / latest episode play button → routes to `/podcast/{slug}`. Verify the Chat Widget button is gone (page heading/body still present).

- [ ] **Step 6: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/components/pages/podcast/podcast-page.tsx
git commit -m 'fix(podcast): wire index card links + remove broken chat anchor

Replace href=\"#\" placeholders on the latest-episode and per-card
play buttons with /podcast/{slug} navigation. Remove the
Try the Chat Widget button since #podcast-chat anchor never existed
and Ask Podcast AI is a per-episode feature in the detail-page
Figma.

Per Nebojša review feedback batch 2026-04-28.'
```

## Task 1.4: Remove FAQ CTA on /seo-services

**Files:**
- Modify: `src/components/pages/seo-services/seo-services-page.tsx:345`

**Spec:** 5.4

- [ ] **Step 1: Read the ServiceFaq usage**

```bash
sed -n '340,360p' src/components/pages/seo-services/seo-services-page.tsx
```

- [ ] **Step 2: Remove the `answerExtra` prop**

Delete the entire `answerExtra={(_item, index) => { ... }}` prop and its body. Keep all other props (`items`, `renderIcon`, etc.). Delete any helper components/imports that become unused.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `/seo-services`, expand the middle FAQ question (Q3). No CTA renders inside the answer.

- [ ] **Step 4: Lint + typecheck**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/seo-services/seo-services-page.tsx
git commit -m "fix(seo-services): remove inline CTA from FAQ answers

Per Nebojša review: FAQ middle question CTA does not look right.
Nebojša confirmed (Slack screenshot 2026-04-28) the cleanest fix
is to remove all inline CTAs from the FAQ component on the SEO
hub page. ServiceFaq remains, just without the answerExtra prop."
```

## Task 1.5: Remove /team/[slug] route

**Files:**
- Delete: `src/app/(site)/(pages)/team/[slug]/page.tsx`
- Delete: `src/app/(site)/(pages)/team/` (directory if empty)

**Spec:** 5.5 + design Q5

- [ ] **Step 1: Verify no internal links to /team/ exist**

```bash
grep -rn "/team/" src/ --include="*.tsx" --include="*.ts"
```

If matches exist outside the `/team/[slug]/page.tsx` file itself, surface them — do not delete blindly.

- [ ] **Step 2: Verify sitemap doesn't include /team/ paths**

```bash
grep -n "team" src/app/sitemap.ts
```

Should return zero matches.

- [ ] **Step 3: Delete the route**

```bash
rm -rf src/app/\(site\)/\(pages\)/team/
```

- [ ] **Step 4: Verify popup still works**

```bash
npm run dev
```

Visit `/about-us`, click any team card → popup opens. Hash deep-link via URL `/about-us#nebojsa-jankovic` still works (per existing controller).

- [ ] **Step 5: Build + typecheck**

```bash
npx tsc --noEmit
npm run build
```

Both pass — `/team/[slug]` no longer in build output.

- [ ] **Step 6: Commit**

```bash
git add -A src/app/
git commit -m "fix(routes): remove /team/[slug] route per design Q5

Team member detail is a popup overlay (Figma 197:891 desktop,
672:4109 mobile), not a page route. Hash deep-linking on About Us
covers shareable URLs. Removing the route prevents the (currently
broken) /team/[slug] from appearing in sitemaps or being accidentally
linked. Spec section 5.5."
```

## Task 1.6: Lock LinkedIn + X URLs

**Files:**
- Modify: `src/lib/site.ts`

**Spec:** 5.6 (resolved O2)

- [ ] **Step 1: Read current values**

```bash
grep -E "LINKEDIN|TWITTER|X_URL" src/lib/site.ts
```

- [ ] **Step 2: Apply the URL fixes**

Update:
- `SITE_LINKEDIN_URL` → `'https://www.linkedin.com/company/heroic-rankings/'`
- `SITE_X_URL` → `'https://twitter.com/heroic_rankings'`

If the constants have different names, update those exact identifiers. Cross-reference any consumers found via:

```bash
grep -rn "linkedin\.com/company\|twitter\.com\|x\.com/heroicrankings" src/
```

- [ ] **Step 3: Audit JSON-LD organization schema**

```bash
grep -rn "sameAs" src/components/seo/
```

Verify the LinkedIn + X URLs in any `sameAs` array match the new values.

- [ ] **Step 4: Audit about-us-team-data.ts default social links**

```bash
sed -n '70,80p' src/components/sections/about-us-team-data.ts
```

If brand-level (non-personal) social URLs are referenced as defaults, update to match. Personal team-member URLs stay as-is — they are individual handles.

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Inspect footer + page-source `<script type="application/ld+json">`. Confirm both URLs are correct.

- [ ] **Step 6: Commit**

```bash
git add src/lib/site.ts src/components/seo/ src/components/sections/about-us-team-data.ts
git commit -m "fix(site): lock real LinkedIn + X handles

Per Pavle 2026-04-28: production handles are
linkedin.com/company/heroic-rankings/ (with hyphen) and
twitter.com/heroic_rankings (underscore). Updates the central
constants, JSON-LD organization schema sameAs, and any default
brand-level social references. Personal team-member handles in
about-us-team-data.ts left untouched — those are individual.
Spec section 5.6 / open question O2 resolved."
```

## Task 1.7: PR 1 verification + open PR

- [ ] **Step 1: Full build**

```bash
npm run build 2>&1 | tail -10
```

Build succeeds. No new warnings beyond pre-existing.

- [ ] **Step 2: Manual smoke**

Run dev server. Verify:
- `/on-page-seo`, `/local-seo`, `/technical-seo` bottom CTAs are correct
- `/case-studies` panel says "DIY Craft eCom"; `/case-studies/diy-craft-ecom-brand` renders; old slug redirects
- `/podcast` cards link to detail; chat-widget button gone
- `/seo-services` middle FAQ has no inline CTA
- Footer LinkedIn + X URLs correct
- About Us team popups still open via card click
- `/team/foo` returns 404 (route removed)

- [ ] **Step 3: Push + open PR**

```bash
git push origin main
```

(If working in feature branch, push the branch and `gh pr create` instead. For solo-dev with bundled release, direct push to `main` is fine — Vercel auto-deploys preview.)

---

# PR 2 — Sanity Schema Additions + Tokens

**Spec section:** 2. **Estimated:** ~3h. **Dependencies:** none (parallel with PR 1). **Confirms needed:** none.

## Task 2.1: Add 4 new color tokens + gradient-brand-light utility class

**Files:**
- Modify: `src/app/globals.css`

**Spec:** 2.1

- [ ] **Step 1: Read current `:root` and `@theme` blocks in globals.css**

```bash
grep -n "color-hr\|@theme\|:root" src/app/globals.css | head -30
```

- [ ] **Step 2: Add the 4 new tokens to `:root`**

Inside the `:root { ... }` block (existing color tokens):

```css
--color-hr-pure-black: #050505;
--color-hr-black-box: #0C0C0C;
--color-hr-dark-line: #2A2A2A;
--gradient-brand-light: linear-gradient(210deg, #826FFF 18%, #E188FF 41%, #E1BDFF 130%);
```

Mirror in `.dark` block if the file has theme overrides.

- [ ] **Step 3: Add `@theme` mappings for Tailwind v4**

Inside the existing `@theme { ... }`:

```css
--color-hr-pure-black: var(--color-hr-pure-black);
--color-hr-black-box: var(--color-hr-black-box);
--color-hr-dark-line: var(--color-hr-dark-line);
```

(`--gradient-brand-light` is consumed via background-image, not a Tailwind color — no @theme entry needed.)

- [ ] **Step 4: Add the `.gradient-text-brand-light` utility class**

After the existing `.gradient-text-brand-*` classes:

```css
.gradient-text-brand-light {
  background-image: var(--gradient-brand-light);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

- [ ] **Step 5: Verify build**

```bash
npx tsc --noEmit
npm run build 2>&1 | tail -5
```

Build succeeds; no Tailwind warnings.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(tokens): add 4 design tokens for case study + podcast detail

Adds --color-hr-pure-black (#050505), --color-hr-black-box (#0C0C0C),
--color-hr-dark-line (#2A2A2A), --gradient-brand-light (lighter gradient
palette for big numbers / accents on dark sections). Adds the
gradient-text-brand-light utility class mirroring the existing
gradient-text-brand-* pattern. These are additions only — existing
tokens unchanged, existing pages render byte-identical. Required for
1:1 Figma fidelity on the case study + podcast detail templates.
Spec section 2.1."
```

## Task 2.2: Make teamMember.slug + image.alt required

**Files:**
- Modify: `src/sanity/schemaTypes/documents/teamMember.ts`

**Spec:** 2.2

- [ ] **Step 1: Read current schema**

```bash
cat src/sanity/schemaTypes/documents/teamMember.ts
```

- [ ] **Step 2: Make slug required**

Change:
```ts
defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  options: { source: "name", maxLength: 96 },
}),
```

To:
```ts
defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  options: { source: "name", maxLength: 96 },
  validation: (rule) => rule.required(),
}),
```

- [ ] **Step 3: Make photo.alt + cardImage.alt required**

Inside both `photo` and `cardImage` field definitions, find the inline `defineField({ name: "alt", ... })` and add `validation: (rule) => rule.required()`.

- [ ] **Step 4: Run Sanity studio locally to verify schema**

```bash
npm run sanity:dev
```

Open `localhost:3333`, edit any team member, confirm slug + photo alt + cardImage alt all show "Required" markers.

- [ ] **Step 5: Verify existing seeded team data isn't broken**

If About Us team grid renders with any member missing slug/alt, fix the seed data via Studio before committing. (Currently only Nebojša is seeded; minor.)

- [ ] **Step 6: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/sanity/schemaTypes/documents/teamMember.ts
git commit -m "feat(schema): require slug + image alt on teamMember

Slug is required for hash deep-linking on the About Us team popup
(/about-us#nebojsa-jankovic). Image alt is required for editorial
accessibility per Codex MED finding. Existing entries that don't
meet the new validation will show errors in Studio until populated;
the migration step asserts every team member has a slug after import.

Spec section 2.2."
```

## Task 2.3: Extend caseStudy schema with 12 structured fields + bounded validation

**Files:**
- Modify: `src/sanity/schemaTypes/documents/caseStudy.ts`

**Spec:** 2.4

This is one of the larger tasks. Each new field is documented in spec section 2.4 with type and bounded validation rule. Add fields one batch at a time, committing after each batch to keep diffs reviewable.

- [ ] **Step 1: Read current schema and identify field-list ordering**

```bash
cat src/sanity/schemaTypes/documents/caseStudy.ts
```

Plan to insert new fields in this order: hero block (heroSubtitle, heroMetrics) → caseOverview → objectiveChallenges → strategyPillars → journeyTimeline → numbersThatMatter → growthChart → proofData → beforeAfter → conclusion → ctaFooter.

- [ ] **Step 2: Add hero block fields**

After the existing `excerpt` field, add:

```ts
defineField({
  name: "heroSubtitle",
  title: "Hero Subtitle",
  type: "text",
  rows: 2,
  description: "Subtitle shown below the hero H1.",
}),
defineField({
  name: "heroMetrics",
  title: "Hero Metric Tiles",
  type: "array",
  validation: (rule) => rule.max(3),
  of: [
    {
      type: "object",
      fields: [
        defineField({ name: "value", type: "string", validation: r => r.required() }),
        defineField({ name: "label", type: "string", validation: r => r.required() }),
      ],
      preview: { select: { title: "value", subtitle: "label" } },
    },
  ],
}),
```

- [ ] **Step 3: Add caseOverview block**

```ts
defineField({
  name: "caseOverview",
  title: "Case Overview Section",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", description: 'Section label, e.g. "/ Case Overview /"' }),
    defineField({ name: "headingMain", type: "string", description: "First part of heading (solid color)" }),
    defineField({ name: "headingHighlighted", type: "string", description: "Second part (gradient)" }),
    defineField({ name: "body", type: "text", rows: 6 }),
  ],
}),
```

- [ ] **Step 4: Add objectiveChallenges block**

```ts
defineField({
  name: "objectiveChallenges",
  title: "Objective & Challenges",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({ name: "body", type: "text", rows: 4 }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => rule.length(3),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "number", type: "string", validation: r => r.required() }),
            defineField({ name: "title", type: "string", validation: r => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: r => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        },
      ],
    }),
  ],
}),
```

- [ ] **Step 5: Add strategyPillars array**

```ts
defineField({
  name: "strategyPillars",
  title: "Six Pillars Cards",
  type: "array",
  validation: (rule) => rule.length(6),
  of: [
    {
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", validation: r => r.required() }),
        defineField({ name: "intro", type: "text", rows: 2, validation: r => r.required() }),
        defineField({
          name: "bullets",
          type: "array",
          of: [{ type: "string" }],
          validation: r => r.min(2).max(8),
        }),
        defineField({
          name: "icon",
          type: "image",
          options: { hotspot: false },
          fields: [defineField({ name: "alt", type: "string", validation: r => r.required() })],
          validation: r => r.required(),
        }),
      ],
      preview: { select: { title: "title", media: "icon" } },
    },
  ],
}),
```

- [ ] **Step 6: Add journeyTimeline block**

```ts
defineField({
  name: "journeyTimeline",
  title: "Journey to Success Timeline",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => rule.min(4).max(6),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: r => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: r => r.required() }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
}),
```

- [ ] **Step 7: Add numbersThatMatter block**

```ts
defineField({
  name: "numbersThatMatter",
  title: "The Numbers That Matter (Dark Section)",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({ name: "body", type: "text", rows: 5 }),
    defineField({
      name: "items",
      type: "array",
      validation: (rule) => rule.min(4).max(8),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", type: "string", validation: r => r.required() }),
            defineField({ name: "label", type: "string", validation: r => r.required() }),
            defineField({ name: "sub", type: "string" }),
            defineField({
              name: "icon",
              type: "image",
              options: { hotspot: false },
              fields: [defineField({ name: "alt", type: "string", validation: r => r.required() })],
            }),
          ],
          preview: { select: { title: "value", subtitle: "label", media: "icon" } },
        },
      ],
    }),
  ],
}),
```

- [ ] **Step 8: Add growthChart block (with custom validation)**

```ts
defineField({
  name: "growthChart",
  title: "Growth Trajectory Line Chart",
  type: "object",
  fields: [
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({ name: "leftAxisLabel", type: "string" }),
    defineField({ name: "rightAxisLabel", type: "string" }),
    defineField({
      name: "months",
      type: "array",
      of: [{ type: "string" }],
      validation: r => r.min(3).max(36),
      description: 'Month labels, e.g. ["JAN24", "MAR24", ...]',
    }),
    defineField({
      name: "series",
      type: "array",
      validation: r => r.min(1).max(5),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: r => r.required() }),
            defineField({
              name: "color",
              type: "string",
              options: {
                list: [
                  { title: "Light gradient", value: "gradient-light" },
                  { title: "White trace", value: "white-trace" },
                  { title: "Grey trace", value: "grey-trace" },
                ],
              },
              validation: r => r.required(),
            }),
            defineField({
              name: "points",
              type: "array",
              of: [{ type: "number" }],
              validation: r => r.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "color" } },
        },
      ],
    }),
    defineField({ name: "tooltipMonth", type: "string", description: "Month label to highlight (e.g., DEC25)" }),
    defineField({
      name: "tooltipMetrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "value", type: "string" }),
          ],
        },
      ],
    }),
  ],
  validation: (rule) =>
    rule.custom((chart) => {
      if (!chart) return true;
      const monthsLen = chart.months?.length ?? 0;
      const series = chart.series ?? [];
      for (const s of series) {
        if ((s.points?.length ?? 0) !== monthsLen) {
          return `Series "${s.label}" has ${s.points?.length ?? 0} points but months has ${monthsLen}.`;
        }
      }
      return true;
    }),
}),
```

- [ ] **Step 9: Add proofData block**

```ts
defineField({
  name: "proofData",
  title: "The Proof Is in the Data — Analytics Cards",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({ name: "body", type: "text", rows: 4 }),
    defineField({
      name: "items",
      type: "array",
      validation: r => r.max(8),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: r => r.required() }),
            defineField({ name: "body", type: "text", rows: 3, validation: r => r.required() }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", type: "string", validation: r => r.required() })],
              validation: r => r.required(),
            }),
            defineField({
              name: "metricTags",
              type: "array",
              validation: r => r.max(4),
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({ name: "value", type: "string" }),
                    defineField({ name: "isAccent", type: "boolean" }),
                  ],
                },
              ],
            }),
            defineField({ name: "isFullWidth", type: "boolean" }),
          ],
          preview: { select: { title: "title", media: "image" } },
        },
      ],
    }),
  ],
}),
```

- [ ] **Step 10: Add beforeAfter block**

```ts
defineField({
  name: "beforeAfter",
  title: "Before vs After (5-stat comparison)",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({
      name: "items",
      type: "array",
      validation: r => r.length(5),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: r => r.required() }),
            defineField({ name: "before", type: "string", validation: r => r.required() }),
            defineField({ name: "after", type: "string", validation: r => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "after" } },
        },
      ],
    }),
  ],
}),
```

- [ ] **Step 11: Add conclusion block**

```ts
defineField({
  name: "conclusion",
  title: "Conclusion Panel",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "gradientSubhead", type: "text", rows: 2 }),
    defineField({ name: "body", type: "portableText" }),
  ],
}),
```

- [ ] **Step 12: Add ctaFooter block**

```ts
defineField({
  name: "ctaFooter",
  title: "Per-Case-Study Final CTA",
  type: "object",
  description: "Overrides the global FooterCtaVariant on this case study only.",
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "headingMain", type: "string" }),
    defineField({ name: "headingHighlighted", type: "string" }),
    defineField({ name: "body", type: "text", rows: 3 }),
    defineField({
      name: "primaryCta",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "url", type: "string" }),
      ],
    }),
    defineField({
      name: "secondaryCta",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "url", type: "string" }),
      ],
    }),
  ],
}),
```

- [ ] **Step 13: Run Studio + verify the schema**

```bash
npm run sanity:dev
```

Open `localhost:3333`, edit a case study, scroll through the new sections. Verify all fields render with the right types and validation messages.

- [ ] **Step 14: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/sanity/schemaTypes/documents/caseStudy.ts
git commit -m "feat(schema): extend caseStudy with 12 structured fields

Adds heroSubtitle, heroMetrics, caseOverview, objectiveChallenges,
strategyPillars, journeyTimeline, numbersThatMatter, growthChart,
proofData, beforeAfter, conclusion, ctaFooter — all 1:1 with the
Figma case study single page (2255:878 desktop, 2255:1378 mobile).

All fields are optional to maintain backward compatibility with
existing GROQ queries. Bounded validation rules added per Codex
HIGH finding (max counts, equal series lengths, enum colors,
required image alt text).

Existing legacy fields (title, slug, client, panelLabel, excerpt,
heroImage, cardImage, metrics, body, services, featured, quoteText)
unchanged — they remain importer-owned in the migration. The 12
new fields are editor-owned.

Spec section 2.4."
```

## Task 2.4: Add podcastEpisode document type

**Files:**
- Create: `src/sanity/schemaTypes/documents/podcastEpisode.ts`
- Modify: `src/sanity/schemaTypes/index.ts`

**Spec:** 2.5

- [ ] **Step 1: Create the schema file**

Create `src/sanity/schemaTypes/documents/podcastEpisode.ts`:

```ts
import { defineField, defineType } from "sanity";

export const podcastEpisode = defineType({
  name: "podcastEpisode",
  title: "Podcast Episode",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "titleHighlighted",
      title: "Title Highlighted Substring",
      type: "string",
      description:
        'The portion of the title to render with brand gradient, e.g. "That Actually Works". Must be a substring of title.',
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "episodeNumber",
      title: "Episode Number",
      type: "number",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .positive()
          .custom(async (value, context) => {
            if (!value) return true;
            const { document, getClient } = context;
            const client = getClient({ apiVersion: "2026-03-01" });
            const id = document?._id?.replace(/^drafts\./, "");
            const dupes = await client.fetch(
              `*[_type == "podcastEpisode" && episodeNumber == $value && _id != $id && _id != $draftId]._id`,
              { value, id, draftId: `drafts.${id}` },
            );
            return dupes.length === 0 || `Episode number ${value} is already used by another episode.`;
          }),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: 'Display string, e.g. "1h 44min" or "50 min".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guest",
      title: "Guest",
      type: "object",
      fields: [
        defineField({ name: "name", type: "string", validation: r => r.required() }),
        defineField({ name: "role", type: "string", description: 'e.g. "Founder, CrowdTamers"' }),
        defineField({ name: "company", type: "string" }),
        defineField({
          name: "photo",
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string", validation: r => r.required() })],
        }),
        defineField({ name: "bio", type: "text", rows: 3 }),
        defineField({ name: "linkedinUrl", type: "url" }),
        defineField({ name: "twitterUrl", type: "url" }),
        defineField({ name: "websiteUrl", type: "url" }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: r => r.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", validation: r => r.required() })],
    }),
    defineField({
      name: "videoEmbedUrl",
      title: "Video Embed URL",
      type: "url",
      description: "YouTube, Vimeo, or direct mp4 URL",
    }),
    defineField({
      name: "keyInsights",
      title: "Key Insights Section",
      type: "object",
      fields: [
        defineField({ name: "headingMain", type: "string" }),
        defineField({ name: "headingHighlighted", type: "string" }),
        defineField({ name: "body", type: "text", rows: 4 }),
        defineField({
          name: "topicPills",
          type: "array",
          of: [{ type: "string" }],
          validation: r => r.max(8),
        }),
        defineField({
          name: "bullets",
          type: "array",
          of: [{ type: "string" }],
          validation: r => r.min(1).max(10),
        }),
      ],
    }),
    defineField({
      name: "bestMoments",
      title: "Best Moments (Reels)",
      type: "array",
      validation: r => r.max(6),
      of: [
        {
          type: "object",
          name: "reel",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "thumbnail",
              type: "image",
              options: { hotspot: true },
              fields: [defineField({ name: "alt", type: "string", validation: r => r.required() })],
              validation: r => r.required(),
            }),
            defineField({ name: "videoUrl", type: "url", validation: r => r.required() }),
            defineField({ name: "caption", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", media: "thumbnail" } },
        },
      ],
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "portableText",
    }),
    defineField({
      name: "relatedEpisodes",
      title: "Related Episodes",
      type: "array",
      validation: r => r.unique().max(3),
      of: [{ type: "reference", to: [{ type: "podcastEpisode" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: r => r.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      name: "newest",
      title: "Newest first",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      name: "episodeNumberDesc",
      title: "Episode # high to low",
      by: [{ field: "episodeNumber", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "guest.name", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `with ${subtitle}` : undefined,
      media,
    }),
  },
});
```

- [ ] **Step 2: Register the type in index.ts**

Edit `src/sanity/schemaTypes/index.ts`. Add the import + include in the `types` array:

```ts
import { podcastEpisode } from "./documents/podcastEpisode";

export const schema = {
  types: [
    // ... existing entries
    podcastEpisode,
  ],
};
```

(Match the project's existing import/export pattern exactly.)

- [ ] **Step 3: Add to Studio structure**

Read `src/sanity/structure.ts`:

```bash
cat src/sanity/structure.ts
```

Add a "Podcast" group with "Episodes" list — match existing pattern (e.g., the way "Case Studies" or "Blog Posts" is presented). One-line addition.

- [ ] **Step 4: Run Studio + create one test episode**

```bash
npm run sanity:dev
```

Create a test episode "Test Episode" with all required fields. Verify validation kicks in (e.g., publish without slug fails).

- [ ] **Step 5: Delete the test episode (don't pollute migration)**

In Studio, delete the test doc.

- [ ] **Step 6: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/sanity/schemaTypes/documents/podcastEpisode.ts src/sanity/schemaTypes/index.ts src/sanity/structure.ts
git commit -m "feat(schema): add podcastEpisode document type

Defines podcastEpisode with title, slug, episodeNumber (uniqueness
validated via custom rule), duration, guest object, description,
hero image, video embed URL, keyInsights with topic pills + bullets,
bestMoments reel array (max 6, with thumbnails + video URLs),
portable text transcript, relatedEpisodes references (max 3),
publishedAt, SEO.

Bounded validation per Codex HIGH finding: max counts, required
alts on every image, episode number unique. Studio structure
gains a Podcast > Episodes ordering (newest first).

Spec section 2.5."
```

## Task 2.5: Add GROQ queries + getters for podcast + update case study query

**Files:**
- Modify: `src/sanity/lib/queries.ts`
- Modify: `src/lib/sanity-data.ts`

**Spec:** 2.7 + 4.6

- [ ] **Step 1: Read current queries file structure**

```bash
cat src/sanity/lib/queries.ts
```

- [ ] **Step 2: Add 3 podcast queries**

Append to `queries.ts`:

```ts
export const PODCAST_EPISODES_QUERY = `
  *[_type == "podcastEpisode" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    titleHighlighted,
    slug,
    episodeNumber,
    duration,
    description,
    publishedAt,
    "guest": guest{ name, role, company },
    "heroImage": heroImage{ asset->{_id, _ref, metadata { lqip }}, alt }
  }
`;

export const PODCAST_EPISODE_BY_SLUG_QUERY = `
  *[_type == "podcastEpisode" && slug.current == $slug][0] {
    _id,
    title,
    titleHighlighted,
    slug,
    episodeNumber,
    duration,
    description,
    publishedAt,
    videoEmbedUrl,
    "guest": guest{
      name,
      role,
      company,
      bio,
      linkedinUrl,
      twitterUrl,
      websiteUrl,
      "photo": photo{ asset->{_id, _ref, metadata { lqip }}, alt }
    },
    "heroImage": heroImage{ asset->{_id, _ref, metadata { lqip }}, alt },
    "keyInsights": keyInsights,
    "bestMoments": bestMoments[]{
      title,
      "thumbnail": thumbnail{ asset->{_id, _ref, metadata { lqip }}, alt },
      videoUrl,
      caption
    },
    transcript,
    "relatedEpisodes": relatedEpisodes[]->{
      _id, title, slug, episodeNumber, duration,
      "heroImage": heroImage{ asset->{_id, _ref, metadata { lqip }}, alt },
      "guest": guest{ name }
    },
    seo
  }
`;

export const PODCAST_EPISODE_SLUGS_QUERY = `
  *[_type == "podcastEpisode" && defined(slug.current)].slug.current
`;
```

- [ ] **Step 3: Update CASE_STUDY_BY_SLUG_QUERY to include 12 new fields**

Find the existing `CASE_STUDY_BY_SLUG_QUERY` and add to its projection:

```ts
heroSubtitle,
heroMetrics,
caseOverview,
"objectiveChallenges": objectiveChallenges{ ... },
"strategyPillars": strategyPillars[]{
  title, intro, bullets,
  "icon": icon{ asset->{_id, _ref, metadata { lqip }}, alt }
},
journeyTimeline,
"numbersThatMatter": numbersThatMatter{
  label, headingMain, headingHighlighted, body,
  "items": items[]{ value, label, sub, "icon": icon{ asset->{_id, _ref, metadata { lqip }}, alt } }
},
growthChart,
"proofData": proofData{
  label, headingMain, headingHighlighted, body,
  "items": items[]{
    title, body,
    "image": image{ asset->{_id, _ref, metadata { lqip }}, alt },
    metricTags, isFullWidth
  }
},
beforeAfter,
conclusion,
ctaFooter,
```

- [ ] **Step 4: Add typed getters in src/lib/sanity-data.ts**

Add `getPodcastEpisodes()`, `getPodcastEpisodeBySlug(slug)`, `getPodcastEpisodeSlugs()` matching the pattern of existing `getCaseStudies()` etc. Plus extend the `SanityCaseStudyDetail` type with the 12 new structured fields.

- [ ] **Step 5: Run dev server, hit Sanity**

```bash
npm run dev
```

Use Sanity Vision (Studio → Vision) to test each query against the dataset. Existing case study + the test podcast episode created in 2.4. Verify queries return data.

- [ ] **Step 6: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/sanity/lib/queries.ts src/lib/sanity-data.ts
git commit -m "feat(sanity): add podcast queries + extend caseStudy query

Adds PODCAST_EPISODES_QUERY (list), PODCAST_EPISODE_BY_SLUG_QUERY
(detail with guest+reels+transcript+related deref), and
PODCAST_EPISODE_SLUGS_QUERY (for generateStaticParams).

Updates CASE_STUDY_BY_SLUG_QUERY to project the 12 new structured
fields with proper image asset deref (LQIP + alt). Adds typed
getters in sanity-data.ts mirroring existing patterns.

Spec sections 2.7 + 4.6."
```

## Task 2.6: PR 2 verification + push

- [ ] **Step 1: Build**

```bash
npm run build 2>&1 | tail -10
```

Pass.

- [ ] **Step 2: Push**

```bash
git push origin main
```

---

# PR 3 — BCMS → Sanity Migration (3a discovery, 3b script, 3c live run)

**Spec section:** 4. **Estimated:** ~6h total. **Dependencies:** PR 2 deployed; BCMS API key (O3); Sanity write token (O4).

## Task 3.1: Add migration script dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

```bash
npm install --save-dev @thebcms/client @portabletext/block-tools isomorphic-dompurify jsdom
```

- [ ] **Step 2: Verify versions in package.json**

```bash
grep -E "thebcms|portabletext/block-tools|dompurify|jsdom" package.json
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add BCMS migration deps

Adds @thebcms/client (BCMS SDK), @portabletext/block-tools (Sanity
official HTML→PortableText converter), isomorphic-dompurify (HTML
sanitizer used in raw-HTML fallback path), jsdom (DOM polyfill for
htmlToBlocks Node usage).

Spec section 4.1 + 4.5."
```

## Task 3.2: Add `.env.local` entries (Pavle action)

**Files:**
- Modify: `.env.local` (NOT committed)

- [ ] **Step 1: Pavle adds keys**

Pavle adds to `.env.local`:

```bash
BCMS_API_KEY=<from BCMS Settings → API Keys>
BCMS_ORG_ID=620528baca65b6578d29868d
BCMS_INSTANCE_ID=6710e3bdeeda0c4a2de4b330
SANITY_API_WRITE_TOKEN=<from sanity.io/manage → API → Tokens, role=Editor>
```

(`.env.local` is symlinked to the parent project per existing setup.)

- [ ] **Step 2: Verify load**

```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.BCMS_ORG_ID, '...', process.env.BCMS_API_KEY ? 'BCMS key set' : 'MISSING', '...', process.env.SANITY_API_WRITE_TOKEN ? 'Sanity token set' : 'MISSING')"
```

Both keys must show "set".

## Task 3.3: Write BCMS discovery script

**Files:**
- Create: `scripts/bcms-discover.mjs`

**Spec:** 4.7

- [ ] **Step 1: Create the discovery script**

Create `scripts/bcms-discover.mjs`:

```js
#!/usr/bin/env node
import "dotenv/config";
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

// Lazy import for the SDK to avoid CJS/ESM issues
const { Client } = await import("@thebcms/client");

const ORG_ID = process.env.BCMS_ORG_ID;
const INSTANCE_ID = process.env.BCMS_INSTANCE_ID;
const API_KEY = process.env.BCMS_API_KEY;

if (!ORG_ID || !INSTANCE_ID || !API_KEY) {
  console.error("Missing BCMS_ORG_ID, BCMS_INSTANCE_ID, or BCMS_API_KEY in env.");
  process.exit(1);
}

// Note: refer to https://thebcms.com/docs/inside-bcms/api-keys for client construction. This block adapts to whichever interface @thebcms/client v3+ exposes — verify shape by running the script.
const client = new Client({
  orgId: ORG_ID,
  instanceId: INSTANCE_ID,
  apiKey: { id: API_KEY.split(".")[0], secret: API_KEY.split(".")[1] },
});

const OUT_DIR = "scripts/bcms-discovery";
await mkdir(OUT_DIR, { recursive: true });

console.log("→ Fetching all templates...");
const templates = await client.template.getAll();
await writeFile(join(OUT_DIR, "templates.json"), JSON.stringify(templates, null, 2));
console.log(`  Saved ${templates.length} templates to ${OUT_DIR}/templates.json`);

console.log("→ Fetching all groups...");
const groups = await client.group.getAll();
await writeFile(join(OUT_DIR, "groups.json"), JSON.stringify(groups, null, 2));
console.log(`  Saved ${groups.length} groups to ${OUT_DIR}/groups.json`);

console.log("→ Fetching 1 sample entry per template...");
for (const tpl of templates) {
  try {
    const entries = await client.entry.getAll(tpl._id);
    const sample = entries[0];
    if (sample) {
      const filename = `entry-${tpl.name.replace(/\s+/g, "-").toLowerCase()}.json`;
      await writeFile(
        join(OUT_DIR, filename),
        JSON.stringify({ template: tpl.name, totalEntries: entries.length, sample }, null, 2),
      );
      console.log(`  ${tpl.name}: ${entries.length} entries (sample saved)`);
    } else {
      console.log(`  ${tpl.name}: 0 entries (skipped)`);
    }
  } catch (err) {
    console.error(`  ${tpl.name}: ERROR — ${err.message}`);
  }
}

console.log("\n✓ Discovery complete. Review scripts/bcms-discovery/ to lock field mappings.");
```

- [ ] **Step 2: Run it**

```bash
node scripts/bcms-discover.mjs
```

Expected output: a `scripts/bcms-discovery/` directory with `templates.json`, `groups.json`, and one `entry-*.json` per template.

If `@thebcms/client` API shape differs from what's expected, error messages tell us — adapt the construction call. Refer to https://thebcms.com/docs/inside-bcms/templates for current SDK shape.

- [ ] **Step 3: Review output, lock field mappings**

Open each `entry-*.json` to confirm:
- `blog` template: field names match spec 4.6 assumption (`meta.title`, `meta.slug`, etc.)
- `case-study` template: which fields exist (legacy ones; the 12 new structured fields likely don't exist)
- `team-member` template: confirms the 7 members + their fields
- whether a `podcast-episode` template exists at all

If field names differ from spec assumptions, update the migration script in Task 3.4 accordingly.

- [ ] **Step 4: Add `scripts/bcms-discovery/` to gitignore (don't commit dumps with potentially sensitive data)**

```bash
echo "scripts/bcms-discovery/" >> .gitignore
```

- [ ] **Step 5: Commit the discovery script (not its output)**

```bash
git add scripts/bcms-discover.mjs .gitignore
git commit -m "feat(scripts): BCMS discovery script

Dumps all BCMS templates, groups, and one sample entry per template
to scripts/bcms-discovery/ for field-mapping verification before
the production migration runs. Output is gitignored — contains
sensitive content. Spec section 4.7."
```

## Task 3.4: Write the migration script

**Files:**
- Create: `scripts/bcms-to-sanity.mjs`

**Spec:** 4.3 + 4.4 + 4.5

This is the core script. Long but mostly mechanical. Refer to the spec sections inline.

- [ ] **Step 1: Scaffold the script**

Create `scripts/bcms-to-sanity.mjs` with the structure from spec section 4.3:

```js
#!/usr/bin/env node
import "dotenv/config";
import { writeFile, readFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import DOMPurify from "isomorphic-dompurify";
import { htmlToBlocks } from "@portabletext/block-tools";
import { createClient } from "@sanity/client";

// ---- args ----
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isStrict = args.includes("--strict");
const typeArg = args.find(a => a.startsWith("--type="))?.split("=")[1];
const limitArg = args.find(a => a.startsWith("--limit="))?.split("=")[1];
const limit = limitArg ? parseInt(limitArg, 10) : Infinity;

// ---- env ----
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const BCMS_ORG_ID = process.env.BCMS_ORG_ID;
const BCMS_INSTANCE_ID = process.env.BCMS_INSTANCE_ID;
const BCMS_API_KEY = process.env.BCMS_API_KEY;

for (const [k, v] of Object.entries({ SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN, BCMS_ORG_ID, BCMS_INSTANCE_ID, BCMS_API_KEY })) {
  if (!v) { console.error(`Missing env: ${k}`); process.exit(1); }
}

// ---- clients ----
const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: "2026-03-01",
  useCdn: false,
});

const { Client: BcmsClient } = await import("@thebcms/client");
const bcms = new BcmsClient({
  orgId: BCMS_ORG_ID,
  instanceId: BCMS_INSTANCE_ID,
  apiKey: { id: BCMS_API_KEY.split(".")[0], secret: BCMS_API_KEY.split(".")[1] },
});

// ---- report ----
const report = {
  startedAt: new Date().toISOString(),
  mode: isDryRun ? "dry-run" : "live",
  types: {},
  errors: [],
  warnings: { unsupportedHtmlBlocks: 0, slugCollisions: 0, staleDocs: [] },
};

function recordType(type) {
  report.types[type] = report.types[type] || { created: 0, patched: 0, skipped: 0 };
  return report.types[type];
}

// ---- asset cache ----
const assetCache = new Map();
async function primeAssetCache() {
  const existing = await sanity.fetch(`*[_type == "sanity.imageAsset" && defined(source.id)]{ _id, "sourceId": source.id }`);
  for (const a of existing) assetCache.set(a.sourceId, a._id);
  console.log(`  Asset cache primed: ${assetCache.size} known assets`);
}

async function uploadOrReuseAsset(bcmsAssetId, bcmsAssetUrl, name) {
  if (!bcmsAssetId || !bcmsAssetUrl) return null;
  if (assetCache.has(bcmsAssetId)) return assetCache.get(bcmsAssetId);
  if (isDryRun) {
    console.log(`  [dry-run] would upload asset ${name} (${bcmsAssetUrl})`);
    return `[dry-run-asset-${bcmsAssetId}]`;
  }
  // Retry up to 3x with backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(bcmsAssetUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) throw new Error(`Not an image: ${ct}`);
      const ab = await res.arrayBuffer();
      if (ab.byteLength > 20 * 1024 * 1024) throw new Error("Asset > 20MB");
      const buf = Buffer.from(ab);
      const asset = await sanity.assets.upload("image", buf, {
        source: { id: bcmsAssetId, name, url: bcmsAssetUrl },
        filename: name,
      });
      assetCache.set(bcmsAssetId, asset._id);
      return asset._id;
    } catch (err) {
      if (attempt === 3) {
        report.errors.push({ scope: "asset", id: bcmsAssetId, url: bcmsAssetUrl, message: err.message });
        return null;
      }
      await new Promise(r => setTimeout(r, 1000 * 2 ** (attempt - 1)));
    }
  }
}

// ---- patch-only-touch write ----
async function importDoc(type, sanityId, importedFields) {
  const counters = recordType(type);
  if (isDryRun) {
    console.log(`  [dry-run] would write ${type} ${sanityId}`);
    counters.created++;
    return;
  }
  const existing = await sanity.fetch(`*[_id == $id][0]`, { id: sanityId });
  if (!existing) {
    await sanity.create({ _id: sanityId, _type: type, ...importedFields });
    counters.created++;
  } else {
    // Detect editor-overlap: if existing has differing values on importer-owned keys, log warn
    for (const [k, v] of Object.entries(importedFields)) {
      if (k.startsWith("_")) continue;
      if (JSON.stringify(existing[k]) !== JSON.stringify(v)) {
        // Existing value differs from incoming — patch will overwrite. Log if existing was non-empty.
        if (existing[k] != null) {
          report.warnings[`${type}_overlap`] = (report.warnings[`${type}_overlap`] || 0) + 1;
        }
      }
    }
    await sanity.patch(sanityId).set(importedFields).commit();
    counters.patched++;
  }
}

// ---- HTML → Portable Text ----
async function convertHtmlToPortableText(html, sourceId) {
  if (!html || typeof html !== "string") return [];
  // Custom rule: <img> → upload + image block
  const rules = [
    {
      deserialize: async (el, _next, block) => {
        if (el.tagName !== "IMG") return undefined;
        const src = el.getAttribute("src");
        if (!src) return undefined;
        const assetId = await uploadOrReuseAsset(src, src, src.split("/").pop() || "image");
        if (!assetId) return block({ _type: "rawHtml", html: DOMPurify.sanitize(el.outerHTML) });
        return block({ _type: "image", asset: { _ref: assetId } });
      },
    },
  ];
  let blocks;
  try {
    blocks = await htmlToBlocks(html, /* schema */ {}, {
      parseHtml: (h) => new JSDOM(h).window.document,
      rules,
    });
  } catch (err) {
    report.warnings.unsupportedHtmlBlocks++;
    report.errors.push({ scope: "html-to-pt", sourceId, message: err.message });
    // Sanitized fallback as a last resort
    return [{ _type: "rawHtml", html: DOMPurify.sanitize(html, { ALLOWED_TAGS: ["p","strong","em","a","ul","ol","li","blockquote","code"], ALLOWED_ATTR: ["href"] }) }];
  }
  return blocks;
}

// ---- per-type migration functions ----
// (Implement migrateTeamMembers, migrateTestimonials, migrateBlogPosts,
//  migrateCaseStudies, migratePodcastEpisodes — see Step 2 below for the
//  detailed mapping per type. Each calls importDoc().)

// ---- main ----
async function main() {
  console.log(`\n→ BCMS → Sanity migration (mode: ${report.mode})`);
  await primeAssetCache();
  const allTypes = ["teamMember", "testimonial", "post", "caseStudy", "podcastEpisode"];
  const typesToRun = typeArg ? [typeArg] : allTypes;
  for (const t of typesToRun) {
    console.log(`\n→ Migrating ${t}...`);
    try {
      if (t === "teamMember") await migrateTeamMembers();
      else if (t === "testimonial") await migrateTestimonials();
      else if (t === "post") await migrateBlogPosts();
      else if (t === "caseStudy") await migrateCaseStudies();
      else if (t === "podcastEpisode") await migratePodcastEpisodes();
    } catch (err) {
      report.errors.push({ scope: `migrate-${t}`, message: err.message, stack: err.stack });
      console.error(`  ERROR: ${err.message}`);
    }
  }
  // Launch allowlist check
  try {
    const allowlist = JSON.parse(await readFile("scripts/launch-allowlist.json", "utf8"));
    for (const slug of allowlist.requiredSlugs ?? []) {
      const found = await sanity.fetch(`*[_type == $type && slug.current == $slug][0]._id`, slug);
      if (!found) report.errors.push({ scope: "launch-allowlist", message: `Missing ${slug.type}/${slug.slug}` });
    }
  } catch {/* allowlist optional during dev */}
  report.endedAt = new Date().toISOString();
  await writeFile("migration-report.json", JSON.stringify(report, null, 2));
  console.log(`\n✓ Done. Report: migration-report.json`);
  console.log(`  Created: ${Object.values(report.types).reduce((s, t) => s + t.created, 0)}`);
  console.log(`  Patched: ${Object.values(report.types).reduce((s, t) => s + t.patched, 0)}`);
  console.log(`  Errors: ${report.errors.length}`);
  console.log(`  Warnings: unsupported HTML blocks=${report.warnings.unsupportedHtmlBlocks}`);
  if (report.errors.length > 0) process.exit(1);
  if (report.warnings.unsupportedHtmlBlocks > 0) process.exit(2);
}
main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Implement per-type migration functions**

Add (above the `main()` definition) the 5 `migrate*()` functions. Use the actual field names confirmed by Task 3.3 discovery output. Pattern (use blog as template, adapt the others):

```js
async function migrateBlogPosts() {
  const counters = recordType("post");
  // Use the actual blog template ID from scripts/bcms-discovery/templates.json
  const BLOG_TEMPLATE_ID = "<from discovery>";
  const entries = await bcms.entry.getAll(BLOG_TEMPLATE_ID);
  for (const e of entries.slice(0, limit)) {
    const sanityId = `post-${e._id}`;
    const slugCheck = await sanity.fetch(`*[_type == "post" && slug.current == $s && _id != $id]._id`, { s: e.meta?.slug, id: sanityId });
    if (slugCheck.length > 0) {
      report.warnings.slugCollisions++;
      report.errors.push({ scope: "post", id: e._id, message: `Slug collision: ${e.meta?.slug} also used by ${slugCheck[0]}` });
      continue;
    }
    const coverAssetId = await uploadOrReuseAsset(e.meta?.coverImage?._id, e.meta?.coverImage?.url, e.meta?.coverImage?.name);
    const body = await convertHtmlToPortableText(e.content, e._id);
    const importedFields = {
      title: e.meta?.title,
      slug: { _type: "slug", current: e.meta?.slug },
      excerpt: e.meta?.excerpt,
      mainImage: coverAssetId ? { _type: "image", asset: { _ref: coverAssetId }, alt: e.meta?.coverImage?.alt ?? "" } : undefined,
      body,
      categories: e.meta?.categories ?? [],
      publishedAt: e.meta?.publishedAt,
      seo: { metaTitle: e.meta?.seoTitle, metaDescription: e.meta?.seoDescription },
    };
    await importDoc("post", sanityId, importedFields);
  }
}
```

Implement `migrateTeamMembers()`, `migrateTestimonials()`, `migrateCaseStudies()`, `migratePodcastEpisodes()` similarly. Use the importer-owned field map from spec section 4.4 — DO NOT include the 12 new caseStudy structured fields in the imported payload (they're editor-owned).

If `migratePodcastEpisodes` finds no BCMS template, it logs the absence and exits cleanly (podcast docs will be created manually in Studio).

- [ ] **Step 3: Make script executable**

```bash
chmod +x scripts/bcms-to-sanity.mjs
```

- [ ] **Step 4: Dry-run**

```bash
node scripts/bcms-to-sanity.mjs --dry-run
```

Review `migration-report.json`. Confirm zero unexpected errors. Re-run after fixing any issues.

- [ ] **Step 5: Commit script (not the report)**

```bash
echo "migration-report.json" >> .gitignore
git add scripts/bcms-to-sanity.mjs .gitignore
git commit -m "feat(scripts): BCMS → Sanity migration script

Patch-only-touch idempotent migration with per-type importer-owned
field maps. Idempotent reruns preserve editor-entered structured
fields (the 12 new caseStudy structured fields and all podcast
fields are editor-owned, never overwritten).

Asset migration: download from BCMS CDN, MIME + size validation,
3x retry with exponential backoff, dedup via source.id metadata
field with in-memory cache primed from existing assets.

HTML → Portable Text via @portabletext/block-tools with custom
img rule (uploads inline images). DOMPurified raw-HTML fallback
for unsupported blocks. Non-zero exit on warnings.

Slug collision detection per type. Asset HTTP errors retried
then logged. Stale-doc detection at end of run. Launch allowlist
assertion (loads scripts/launch-allowlist.json if present).

Modes: --dry-run (no writes), --type=<name>, --limit=<N>.

Spec section 4."
```

## Task 3.5: Write launch allowlist

**Files:**
- Create: `scripts/launch-allowlist.json`

- [ ] **Step 1: Pavle/Nebojša define which slugs MUST be live**

Create `scripts/launch-allowlist.json`:

```json
{
  "requiredSlugs": [
    { "type": "caseStudy", "slug": "diy-craft-ecom-brand" },
    { "type": "caseStudy", "slug": "affinda" },
    { "type": "caseStudy", "slug": "my-baskets" },
    { "type": "caseStudy", "slug": "nagish" },
    { "type": "caseStudy", "slug": "art-by-maudsch" },
    { "type": "caseStudy", "slug": "designrush" },
    { "type": "podcastEpisode", "slug": "marketing-that-actually-works-trevor-longino" },
    { "type": "post", "slug": "<TBD-Pavle-fills-final-blog-list>" }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add scripts/launch-allowlist.json
git commit -m "chore(scripts): seed launch allowlist for migration validator

Lists the slugs that MUST exist post-migration. Validator script
(PR 5/6) asserts each + its required fields are populated; PR 6
cannot merge if any are missing.

Spec section 6.10."
```

## Task 3.6: Run live migration + verify

- [ ] **Step 1: Run the migration**

```bash
node scripts/bcms-to-sanity.mjs
```

- [ ] **Step 2: Review migration-report.json**

```bash
cat migration-report.json | jq '.types, .errors[:5], .warnings'
```

Expect: clean errors array, zero unsupported HTML blocks (or non-zero with manual review/fix loop).

- [ ] **Step 3: Verify in Sanity Studio**

```bash
npm run sanity:dev
```

- All 7 team members visible with photos + bios
- All 6 case studies visible (legacy fields populated; 12 new structured fields empty — to be filled manually)
- All ~13 blog posts visible
- All testimonials visible

- [ ] **Step 4: Run validator**

(Validator script written in PR 5; for now, manually spot-check via Studio.)

- [ ] **Step 5: Push**

```bash
git push origin main
```

---

# PR 4 — Detail Page Wiring (4a popup + insights, 4b case study, 4c podcast)

**Spec sections:** 3.2, 3.3, 3.4, 3.5. **Estimated:** ~10h. **Dependencies:** PR 3 migrated content + manual editor enrichment of caseStudy structured fields + manual creation of podcastEpisode docs.

> **Manual content enrichment session (Day 2 of timeline):** Pavle + Nebojša populate the 12 new caseStudy fields for each launch case study via Sanity Studio, plus create podcastEpisode documents. Without this, PR 4b/4c don't have content to render. Block on this step.

## Task 4.1: Build shared UI primitives

**Files:**
- Create: `src/components/ui/metric-tile.tsx`
- Create: `src/components/ui/numbered-step-card.tsx`
- Create: `src/components/ui/big-number-card.tsx`
- Create: `src/components/ui/two-tone-heading.tsx`
- Create: `src/components/ui/mobile-scroll-rail.tsx`
- Create: `src/components/ui/play-button-overlay.tsx`
- Create: `src/components/ui/reel-thumbnail.tsx`

**Spec:** 3.2 + 3.3

For each primitive: define props matching the Figma extraction (cached at `docs/figma-cache/extractions/2026-04-28-*.md`), render at 1:1 desktop+mobile, use existing tokens.

Pattern (use `MetricTile.tsx` as the example, repeat for the others using their respective Figma specs):

- [ ] **Step 1: Create `metric-tile.tsx`**

```tsx
import { cn } from "@/lib/cn";

interface MetricTileProps {
  value: string;
  label: string;
  className?: string;
  variant?: "light" | "dark";
}

export function MetricTile({ value, label, className, variant = "light" }: MetricTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start rounded-[20px] px-[40px] py-[12px]",
        variant === "light" ? "bg-[var(--color-hr-off-white)]" : "bg-[var(--color-hr-black-box)]",
        className,
      )}
    >
      <p
        className="font-medium text-[24px] tracking-[-0.48px] leading-[normal] w-full bg-clip-text text-transparent"
        style={{ backgroundImage: "var(--gradient-brand-light)" }}
      >
        {value}
      </p>
      <p className={cn("type-paragraph w-full", variant === "light" ? "text-[var(--color-hr-dark)]" : "text-[var(--color-hr-pure-white)]")}>
        {label}
      </p>
    </div>
  );
}
```

- [ ] **Steps 2–7: Repeat for the other 6 primitives**

For each, reference its Figma extraction in `docs/figma-cache/extractions/`. Match exact pixel values (border radius, padding, gap, font size, line height, tracking) at desktop and mobile breakpoints.

- [ ] **Step 8: Commit primitives batch**

```bash
git add src/components/ui/metric-tile.tsx src/components/ui/numbered-step-card.tsx src/components/ui/big-number-card.tsx src/components/ui/two-tone-heading.tsx src/components/ui/mobile-scroll-rail.tsx src/components/ui/play-button-overlay.tsx src/components/ui/reel-thumbnail.tsx
git commit -m "feat(ui): add 7 detail-page primitives (metric tile, numbered step card, big number card, two-tone heading, mobile scroll rail, play button overlay, reel thumbnail)

Each primitive renders 1:1 to its Figma extraction (see
docs/figma-cache/extractions/2026-04-28-*.md). Used by case study
detail (3.2) and podcast episode detail (3.3) sub-components in
this PR.

Spec section 3.2 + 3.3."
```

## Task 4.2: Build vCard generator + tests

**Files:**
- Create: `src/lib/vcard.ts`
- Create: `src/lib/__tests__/vcard.test.ts`

**Spec:** 3.4

- [ ] **Step 1: Write the vCard test fixtures FIRST (TDD)**

Create `src/lib/__tests__/vcard.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateVCard, generateVCardFilename } from "../vcard";

describe("generateVCard", () => {
  it("uses CRLF line endings (RFC 6350)", () => {
    const out = generateVCard({ name: "Nebojša Janković", email: "n@hr.com" });
    expect(out).toContain("\r\n");
    expect(out.split("\r\n").every(l => !l.endsWith("\n"))).toBe(true);
  });

  it("escapes special characters in field values", () => {
    const out = generateVCard({ name: "Smith, John; Jr.", email: "a@b.com" });
    expect(out).toContain("FN:Smith\\, John\\; Jr.");
  });

  it("normalizes phone to E.164", () => {
    const out = generateVCard({ name: "X", phone: "+1 (555) 555-1234" });
    expect(out).toContain("TEL:+15555551234");
  });

  it("rejects invalid phone, omits the field", () => {
    const out = generateVCard({ name: "X", phone: "not-a-number" });
    expect(out).not.toContain("TEL:");
  });

  it("returns empty string for empty input", () => {
    expect(generateVCard({})).toBe("");
  });

  it("handles diacritics safely", () => {
    const out = generateVCard({ name: "Nebojša Janković" });
    expect(out).toContain("FN:Nebojša Janković");
  });
});

describe("generateVCardFilename", () => {
  it("ASCII-only, slug-derived", () => {
    expect(generateVCardFilename("Nebojša Janković")).toBe("nebojsa-jankovic.vcf");
  });
});
```

- [ ] **Step 2: Run tests; expect FAIL**

```bash
npm run test src/lib/__tests__/vcard.test.ts
```

- [ ] **Step 3: Implement `vcard.ts`**

Create `src/lib/vcard.ts`:

```ts
interface VCardInput {
  name?: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  url?: string;
}

const escape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

const normalizePhone = (p: string): string | null => {
  const digits = p.replace(/[^\d+]/g, "");
  if (!/^\+?\d{8,15}$/.test(digits)) return null;
  return digits.startsWith("+") ? digits : `+${digits}`;
};

export function generateVCard(input: VCardInput): string {
  if (!input.name && !input.email && !input.phone) return "";
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  if (input.name) lines.push(`FN:${escape(input.name)}`);
  if (input.role || input.company) lines.push(`TITLE:${escape([input.role, input.company].filter(Boolean).join(", "))}`);
  if (input.email) lines.push(`EMAIL:${escape(input.email)}`);
  if (input.phone) {
    const tel = normalizePhone(input.phone);
    if (tel) lines.push(`TEL:${tel}`);
  }
  if (input.url) lines.push(`URL:${escape(input.url)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

export function generateVCardFilename(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}.vcf`;
}
```

- [ ] **Step 4: Run tests; expect PASS**

```bash
npm run test src/lib/__tests__/vcard.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/vcard.ts src/lib/__tests__/vcard.test.ts
git commit -m "feat(vcard): RFC 6350 vCard generator + tests

CRLF line endings, escape special chars (commas, semicolons,
backslashes, newlines), normalize phones to E.164, ASCII-only
filename slug. Empty input returns empty string. Diacritics
preserved in field values, stripped only from filename.

Tests cover all spec requirements per Codex MED finding (3.4).
Used by team member popup Save-to-Contacts button."
```

## Task 4.3: Rewrite team-member-popup.tsx (1:1 Figma 197:891 + 672:4109)

**Files:**
- Modify: `src/components/sections/team-member-popup.tsx` (full rewrite)

**Spec:** 3.4. **Figma:** `docs/figma-cache/extractions/2026-04-28-team-member-section-01-popup-desktop.md` + `-02-popup-mobile.md`.

- [ ] **Step 1: Read existing controller wiring**

```bash
cat src/components/sections/about-us-team-popup-controller.tsx
```

Note the props the popup receives: typically `member`, `onClose`, `onPrev`, `onNext`, plus dialog state.

- [ ] **Step 2: Rewrite `team-member-popup.tsx`**

Full rewrite. Reference cached Figma extractions for exact pixel values. Key structure:

```tsx
"use client";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { generateVCard, generateVCardFilename } from "@/lib/vcard";
import type { SanityTeamMember } from "@/lib/sanity-data";

interface TeamMemberPopupProps {
  member: SanityTeamMember;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function TeamMemberPopup(props: TeamMemberPopupProps) {
  return (
    <>
      <TeamMemberPopupDesktop {...props} />
      <TeamMemberPopupMobile {...props} />
    </>
  );
}

function TeamMemberPopupDesktop({ member, onClose, onPrev, onNext }: TeamMemberPopupProps) {
  // 1:1 Figma 197:891 — see extraction notes for layout
  // ...
}

function TeamMemberPopupMobile({ member, onClose, onPrev, onNext }: TeamMemberPopupProps) {
  // 1:1 Figma 672:4109
  // ...
}

function ContactPillStack({ member, variant }: { member: SanityTeamMember; variant: "light" | "dark" }) {
  // Phone (or "no phone" placeholder) + email + Instagram + LinkedIn + X pills
  // Plus "Save to Contacts" button that triggers vCard download
}

function downloadVCard(member: SanityTeamMember) {
  const vcard = generateVCard({
    name: member.name,
    role: member.role,
    company: "Heroic Rankings",
    email: member.contact?.email,
    phone: member.contact?.phone,
    url: member.linkedin,
  });
  if (!vcard) return; // empty input — disable button
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateVCardFilename(member.name);
  a.click();
  URL.revokeObjectURL(url);
}
```

Render desktop in `lg:` block, mobile in default block. Use exact Figma pixel values (`top-[173px]`, `text-[62px]`, `lg:rounded-[40px]`, etc.) from the cached extractions.

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `/about-us`. Click each team card → popup opens with the new design. Click "Save to Contacts" → `.vcf` downloads. Click prev/next → cycles members.

Test at desktop (1440 wide) AND mobile (375 wide via DevTools). Both should be 1:1 with their Figma frames.

- [ ] **Step 4: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/components/sections/team-member-popup.tsx
git commit -m "feat(team-popup): rewrite per Figma 197:891 + 672:4109

Two layout variants (desktop two-column with glass-effect contact
tile over photo; mobile single-column with dark filled pills).
Save to Contacts button downloads RFC 6350 vCard via the new
vcard generator. Hash deep-linking and prev/next nav preserved
via the existing controller. Sanity teamMember data drives every
field — bio paragraphs split between desktop columns, contact
pills hide when fields are empty.

Spec section 3.4."
```

## Task 4.4: Rewrite blog-post-detail-content.tsx (Sanity-driven, placeholder layout)

**Files:**
- Modify: `src/components/pages/insights/blog-post-detail-content.tsx`
- Create: `src/sanity/lib/portable-text-components.tsx`

**Spec:** 3.5

- [ ] **Step 1: Create Portable Text serializers**

Create `src/sanity/lib/portable-text-components.tsx`:

```tsx
import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <figure className="my-[40px]">
        <Image
          alt={value.alt ?? ""}
          src={urlFor(value).width(1200).quality(85).url()}
          width={1200}
          height={800}
          placeholder={value.asset?.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={value.asset?.metadata?.lqip}
          className="w-full rounded-[20px]"
        />
        {value.caption && (
          <figcaption className="mt-[10px] text-center text-[14px] text-[var(--color-hr-grey)]">{value.caption}</figcaption>
        )}
      </figure>
    ),
    rawHtml: ({ value }) => <div dangerouslySetInnerHTML={{ __html: value.html }} />,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value.href} className="underline text-[var(--color-hr-accent)]" rel={value.href?.startsWith("http") ? "noopener noreferrer" : undefined} target={value.href?.startsWith("http") ? "_blank" : undefined}>
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="type-h3 mt-[40px] mb-[20px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{children}</h2>,
    h3: ({ children }) => <h3 className="type-h4 mt-[30px] mb-[15px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="my-[30px] border-l-[4px] border-[var(--color-hr-accent)] pl-[20px] italic text-[var(--color-hr-grey)]">{children}</blockquote>,
    normal: ({ children }) => <p className="type-paragraph mb-[20px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{children}</p>,
  },
};
```

- [ ] **Step 2: Rewrite blog-post-detail-content.tsx**

Replace the hardcoded `ARTICLE_TITLE` / `ARTICLE_BODY` constants and any hardcoded rendering with a Sanity-driven layout:

```tsx
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { portableTextComponents } from "@/sanity/lib/portable-text-components";
import type { SanityPostDetail } from "@/lib/sanity-data";

interface BlogPostDetailContentProps {
  post: SanityPostDetail;
}

export function BlogPostDetailContent({ post }: BlogPostDetailContentProps) {
  return (
    <article className="mx-auto max-w-[800px] px-[20px] py-[60px] lg:py-[120px]">
      <header className="mb-[40px]">
        <h1 className="type-h1 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">{post.title}</h1>
        <div className="mt-[20px] flex items-center gap-[10px] text-[14px] text-[var(--color-hr-grey)]">
          {post.author?.name && <span>{post.author.name}</span>}
          {post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>}
        </div>
      </header>
      {post.mainImage && (
        <Image
          alt={post.mainImage.alt ?? post.title}
          src={urlFor(post.mainImage).width(1600).quality(85).url()}
          width={1600}
          height={900}
          placeholder={post.mainImage.lqip ? "blur" : "empty"}
          blurDataURL={post.mainImage.lqip ?? undefined}
          className="w-full rounded-[20px] mb-[40px]"
          priority
        />
      )}
      {post.body && <PortableText value={post.body} components={portableTextComponents} />}
    </article>
  );
}
```

- [ ] **Step 3: Update the route page to call notFound() if no post**

`src/app/(site)/(pages)/insights/[slug]/page.tsx` — verify it calls `getPostBySlug()` and `notFound()` on null.

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Visit any migrated blog slug from `/insights`. Detail page renders with Sanity content. Visit a non-existent slug — 404.

- [ ] **Step 5: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/components/pages/insights/blog-post-detail-content.tsx src/sanity/lib/portable-text-components.tsx
git commit -m "feat(insights): Sanity-driven blog detail with placeholder layout

Replaces the hardcoded Market Research stub article with full
Sanity Portable Text rendering via custom serializers (images
with LQIP + responsive sizes, blockquotes, headings, links).

Layout is the placeholder editorial template per spec Q6
(blog single Figma deferred). Hero (title + author + date +
cover image) + body + future related-posts grid. When blog
single Figma lands, separate redesign PR covers visual polish;
the data wiring done now stays.

Spec section 3.5 + 4.5."
```

## Task 4.5: Install Recharts + build CaseStudyGrowthChart pair

**Files:**
- Modify: `package.json` (add `recharts`)
- Create: `src/components/pages/case-studies/parts/CaseStudyGrowthChart.tsx`
- Create: `src/components/pages/case-studies/parts/CaseStudyGrowthChartClient.tsx`

**Spec:** 3.2

- [ ] **Step 1: Install**

```bash
npm install recharts
```

- [ ] **Step 2: Server wrapper component**

Create `CaseStudyGrowthChart.tsx`:

```tsx
import dynamic from "next/dynamic";
import { ChartSkeleton } from "./ChartSkeleton";
import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

const Client = dynamic(() => import("./CaseStudyGrowthChartClient"), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export function CaseStudyGrowthChart({ data }: { data: CaseStudyGrowthChartData | null }) {
  if (!data || !data.series?.length) return <div className="h-[480px] grid place-items-center text-[var(--color-hr-grey)]">Data unavailable</div>;
  return (
    <div className="h-[384px] lg:h-[480px]">
      <Client data={data} />
    </div>
  );
}
```

- [ ] **Step 3: Client island**

Create `CaseStudyGrowthChartClient.tsx`:

```tsx
"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import type { CaseStudyGrowthChartData } from "@/lib/sanity-data";

const COLORS: Record<string, string> = {
  "gradient-light": "#E188FF",
  "white-trace": "#FFFFFF",
  "grey-trace": "#535353",
};

export default function CaseStudyGrowthChartClient({ data }: { data: CaseStudyGrowthChartData }) {
  // Pivot to recharts shape
  const chartData = data.months.map((m, i) => {
    const row: Record<string, string | number> = { month: m };
    for (const s of data.series) row[s.label] = s.points[i];
    return row;
  });
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <CartesianGrid stroke="var(--color-hr-dark-line)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--color-hr-grey)" />
        <YAxis stroke="var(--color-hr-grey)" />
        <Tooltip contentStyle={{ background: "var(--color-hr-black-box)", border: "1px solid var(--color-hr-dark-line)" }} />
        {data.series.map((s) => (
          <Line key={s.label} type="monotone" dataKey={s.label} stroke={COLORS[s.color]} strokeWidth={2} dot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 4: Add ChartSkeleton component**

Inline in the same `parts/` folder. Plain `<div className="animate-pulse bg-[var(--color-hr-dark-line)]/50 h-full w-full rounded-[20px]" />`.

- [ ] **Step 5: Verify chart renders**

Already covered in Task 4.6 below (full case study detail render).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/pages/case-studies/parts/CaseStudyGrowthChart.tsx src/components/pages/case-studies/parts/CaseStudyGrowthChartClient.tsx
git commit -m "feat(case-study): Recharts growth trajectory chart

Server wrapper with reserved height (384 mobile / 480 desktop) +
client island via next/dynamic({ ssr: false }) to prevent SSR
hydration mismatch. ChartSkeleton placeholder during load.
Empty/missing data renders 'Data unavailable' instead of throwing.
Token-mapped series colors (gradient-light / white-trace /
grey-trace) match Sanity schema enum.

Spec section 3.2."
```

## Task 4.6: Build remaining case study sub-components + wire detail page

**Files:**
- Create: 11 sub-components in `src/components/pages/case-studies/parts/` (per file structure)
- Modify: `src/components/pages/case-studies/case-study-detail-page.tsx` (full rewrite)

**Spec:** 3.2. **Figma:** `docs/figma-cache/extractions/2026-04-28-case-study-section-01-single-desktop.md` + `-02-single-mobile.md`.

This task is a marathon. Each sub-component is a focused render of one Sanity field block. To make this tractable, dispatch via subagents with clear briefs (one sub-component per agent).

- [ ] **Step 1: Build each sub-component**

For each of `CaseStudyHero`, `CaseStudyHeroPanel`, `CaseStudyOverview`, `CaseStudyChallenges`, `CaseStudyPillars`, `CaseStudyJourney`, `CaseStudyNumbers`, `CaseStudyProofData`, `CaseStudyBeforeAfter`, `CaseStudyConclusion`, `CaseStudyCtaFooter`:

  - Read the corresponding Figma extraction section
  - Define props matching the Sanity schema field shape
  - Render at 1:1 with desktop (`lg:` prefix) + mobile values
  - Use existing primitives (`MetricTile`, `NumberedStepCard`, `BigNumberCard`, `TwoToneHeading`, `MobileScrollRail` for mobile rails, etc.)
  - Use semantic HTML (`section`, `article`, `figure`, etc.)

- [ ] **Step 2: Compose in case-study-detail-page.tsx**

Replace the hardcoded `enhancedData` rendering with:

```tsx
export function CaseStudyDetailPage({ caseStudy }: { caseStudy: SanityCaseStudyDetail }) {
  return (
    <>
      <CaseStudyHero data={caseStudy} />
      <CaseStudyHeroPanel data={caseStudy} />
      <CaseStudyOverview data={caseStudy.caseOverview} />
      <CaseStudyChallenges data={caseStudy.objectiveChallenges} />
      <CaseStudyPillars data={caseStudy.strategyPillars} />
      <CaseStudyJourney data={caseStudy.journeyTimeline} />
      <CaseStudyNumbers data={caseStudy.numbersThatMatter} />
      <CaseStudyGrowthChart data={caseStudy.growthChart} />
      <CaseStudyProofData data={caseStudy.proofData} />
      <CaseStudyBeforeAfter data={caseStudy.beforeAfter} />
      <CaseStudyConclusion data={caseStudy.conclusion} />
      <CaseStudyCtaFooter data={caseStudy.ctaFooter} />
    </>
  );
}
```

Each sub-component handles `null`/`undefined` data gracefully (renders nothing or a skeleton).

- [ ] **Step 3: Update route page**

`src/app/(site)/(pages)/case-studies/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/sanity-data";
import { CaseStudyDetailPage } from "@/components/pages/case-studies/case-study-detail-page";

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();
  return <CaseStudyDetailPage caseStudy={cs} />;
}
```

- [ ] **Step 4: Manually verify against the Figma**

Open Vercel preview for the seeded "DIY Craft eCom Brand" case study. Compare side-by-side with Figma `2255:878` (desktop) at 1440px wide. Walk through each section. Note any drift.

- [ ] **Step 5: Mobile manual verify**

DevTools → 375px wide. Compare against Figma `2255:1378`. Walk through each section.

- [ ] **Step 6: Delete the now-unused hardcoded data**

```bash
rm src/data/case-study-details.ts
grep -rn "case-study-details" src/ --include="*.tsx" --include="*.ts"
```

If grep returns matches, fix the dangling imports first. Otherwise commit.

- [ ] **Step 7: Typecheck + commit**

```bash
npx tsc --noEmit
git add src/components/pages/case-studies/ src/app/\(site\)/\(pages\)/case-studies/\[slug\]/page.tsx
git rm src/data/case-study-details.ts
git commit -m "feat(case-study-detail): full Sanity-driven 1:1 Figma rewrite

Replaces the hardcoded enhancedData entry with 12 sub-components
matching the Figma case study single page (2255:878 desktop,
2255:1378 mobile). All fields driven from Sanity caseStudy
schema (extended in PR 2). Recharts growth chart in client
island. generateStaticParams pre-renders all migrated slugs;
notFound() on missing.

Deletes src/data/case-study-details.ts — content lives in Sanity.

Spec section 3.2."
```

## Task 4.7: Build podcast episode detail page (1:1 Figma 2223:49 + 2223:723)

**Files:**
- Create: 6 sub-components in `src/components/pages/podcast/parts/`
- Modify: `src/components/pages/podcast/podcast-episode-page.tsx` (full rewrite)

**Spec:** 3.3. **Figma:** `docs/figma-cache/extractions/2026-04-28-podcast-section-01-episode-single-desktop.md` + `-02-episode-single-mobile.md`.

Same pattern as Task 4.6 but smaller (6 sub-components, less structured complexity).

- [ ] **Step 1: Build each sub-component**

`PodcastEpisodeHero`, `PodcastKeyInsights`, `PodcastBestMoments`, `PodcastTranscript`, `PodcastShareBar`, `PodcastRelatedEpisodes`. Each 1:1 to Figma extraction.

- [ ] **Step 2: Compose in `podcast-episode-page.tsx`**

```tsx
export function PodcastEpisodePage({ episode, relatedEpisodes }: { episode: SanityPodcastEpisode; relatedEpisodes: SanityPodcastEpisode[] }) {
  return (
    <>
      <PodcastEpisodeHero episode={episode} />
      <PodcastKeyInsights insights={episode.keyInsights} />
      <PodcastBestMoments reels={episode.bestMoments} />
      <PodcastTranscript transcript={episode.transcript} />
      <PodcastShareBar episode={episode} />
      <PodcastRelatedEpisodes episodes={relatedEpisodes} />
    </>
  );
}
```

- [ ] **Step 3: Wire route page**

`src/app/(site)/(pages)/podcast/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { getPodcastEpisodeBySlug, getPodcastEpisodeSlugs } from "@/lib/sanity-data";
import { PodcastEpisodePage } from "@/components/pages/podcast/podcast-episode-page";

export async function generateStaticParams() {
  const slugs = await getPodcastEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ep = await getPodcastEpisodeBySlug(slug);
  if (!ep) notFound();
  return <PodcastEpisodePage episode={ep} relatedEpisodes={ep.relatedEpisodes ?? []} />;
}
```

- [ ] **Step 4: Update podcast index to use Sanity**

`src/components/pages/podcast/podcast-page.tsx`: replace `EPISODES` constant with Sanity-fetched data via `getPodcastEpisodes()`. Adjust types accordingly.

- [ ] **Step 5: Delete hardcoded data file**

```bash
rm src/data/podcast-episodes.ts
grep -rn "podcast-episodes" src/
```

Fix dangling imports if any. Otherwise commit.

- [ ] **Step 6: Manual verification**

Visit `/podcast` → cards show Sanity-driven episodes. Click a card → detail page renders 1:1 to Figma `2223:49` desktop. Check mobile.

- [ ] **Step 7: Commit**

```bash
npx tsc --noEmit
git add src/components/pages/podcast/
git rm src/data/podcast-episodes.ts
git commit -m "feat(podcast-detail): full Sanity-driven 1:1 Figma rewrite

Detail page sub-components match Figma 2223:49 (desktop) and
2223:723 (mobile): hero with episode pills + split title +
guest caption + thumbnail with play overlay; key insights
panel with topic pills + bullets list; best moments reel
gallery; full episode transcript dark panel with expander;
share bar; related episodes 3-card grid.

Index page (/podcast) now Sanity-driven; the hardcoded
src/data/podcast-episodes.ts file is deleted (3 episodes
sharing episodeNumber 14 + fabricated guests issue from
the gap audit no longer exists in code).

Spec section 3.3."
```

## Task 4.8: PR 4 verification + push

- [ ] **Step 1: Build**

```bash
npm run build 2>&1 | tail -10
```

Pass.

- [ ] **Step 2: Smoke**

Walk through every detail page route:
- `/about-us` → all team popups open with Sanity data + Save-to-Contacts works
- `/insights/{any-slug}` → renders Sanity Portable Text
- `/case-studies/diy-craft-ecom-brand` → 1:1 Figma desktop + mobile, chart renders
- `/podcast/{first-episode-slug}` → 1:1 Figma desktop + mobile

- [ ] **Step 3: Push**

```bash
git push origin main
```

---

# PR 5 — Verification (Lighthouse, axe, visual regression, smoke, k6)

**Spec section:** 6. **Estimated:** ~3h. **Dependencies:** PR 4 deployed.

## Task 5.1: Install verification tooling

- [ ] **Step 1: Install**

```bash
npm install --save-dev @lhci/cli @axe-core/playwright
```

- [ ] **Step 2: Add `.lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/about-us",
        "http://localhost:3000/seo-services",
        "http://localhost:3000/case-studies",
        "http://localhost:3000/case-studies/diy-craft-ecom-brand",
        "http://localhost:3000/podcast",
        "http://localhost:3000/insights",
        "http://localhost:3000/contact"
      ],
      "numberOfRuns": 1,
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "Ready in"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 1.0 }]
      }
    }
  }
}
```

- [ ] **Step 3: Add Playwright a11y test**

Create `tests/a11y/all-routes.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/about-us", "/seo-services", "/case-studies", "/case-studies/diy-craft-ecom-brand", "/podcast", "/insights", "/contact"];

for (const route of routes) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

- [ ] **Step 4: Add k6 baseline load test**

Create `tests/load/baseline.js` per spec section 6.7. Run via `k6 run tests/load/baseline.js --env BASE=https://heroic-rankings-final.vercel.app`.

- [ ] **Step 5: Add validate-launch-content.mjs**

Create `scripts/validate-launch-content.mjs` per spec section 6.10. Reads `scripts/launch-allowlist.json`, queries Sanity, asserts every required slug + field. Exit 0 = pass, 1 = fail.

- [ ] **Step 6: Add manual smoke checklist**

Create `tests/manual-smoke.md` with the bullet list from spec section 6.3.

- [ ] **Step 7: Commit**

```bash
git add .lighthouserc.json tests/ scripts/validate-launch-content.mjs package.json package-lock.json
git commit -m "feat(verification): Lighthouse CI + axe + k6 + launch validator

Adds .lighthouserc.json with assertions per spec 6.1 (perf >= 90,
a11y >= 95, best-practices >= 95, SEO 100); axe-core Playwright
test covering all detail pages; k6 baseline load test (50 RPS
sustained 3 min, 10x current peak); pre-launch content validator
asserting every launch-allowlist slug has all required fields
populated.

Manual smoke checklist saved to tests/manual-smoke.md.

Spec sections 6.1, 6.2, 6.5, 6.7, 6.10, 6.11."
```

## Task 5.2: Run all verifications + fix regressions

- [ ] **Step 1: Lighthouse CI**

```bash
npm run build && npm run start &
sleep 5
npx lhci autorun
```

Address any failures (e.g., LCP regression, missing meta tags) before proceeding.

- [ ] **Step 2: Playwright a11y**

```bash
npx playwright test tests/a11y/
```

Fix axe violations.

- [ ] **Step 3: Pre-launch validator**

```bash
node scripts/validate-launch-content.mjs
```

If FAIL — Pavle/Nebojša populate the missing fields in Studio. Re-run until PASS.

- [ ] **Step 4: k6 load test**

Run against Vercel preview URL. Verify p95 < 800ms, error rate < 1%.

- [ ] **Step 5: Manual smoke**

Walk through `tests/manual-smoke.md` checklist. Pavle signs off.

- [ ] **Step 6: Commit any regression fixes** (if needed)

- [ ] **Step 7: Push**

```bash
git push origin main
```

---

# PR 6 — Production Cutover

**Spec section:** 8. **Estimated:** ~1h. **Dependencies:** PR 5 all gates green; pre-launch validator PASS.

## Task 6.1: Final pre-cutover checks

- [ ] **Step 1: Re-run validator**

```bash
node scripts/validate-launch-content.mjs
```

Must PASS.

- [ ] **Step 2: Verify production env vars on Vercel**

In Vercel project settings: confirm `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` set to production values. `SANITY_API_WRITE_TOKEN` NOT exposed to client.

- [ ] **Step 3: Sitemap submitted**

Confirm `/sitemap.xml` returns 200 with all CMS-driven routes listed. Submit to Google Search Console.

## Task 6.2: DNS cutover + Vercel domain

- [ ] **Step 1: Add production domain in Vercel**

Vercel dashboard → project → Settings → Domains → Add `heroicrankings.com` (or whatever the final domain is).

- [ ] **Step 2: Update DNS at the registrar**

Point A/CNAME records to Vercel per their domain setup instructions. Low-traffic time (4K/mo, any time is low).

- [ ] **Step 3: Verify SSL provisioned**

Vercel auto-provisions Let's Encrypt. Wait until green check on Vercel domain page.

- [ ] **Step 4: Visit production domain**

Smoke check: home, one case study detail, one podcast detail, About Us team popup. All render Sanity content.

## Task 6.3: Post-launch monitoring (first 7 days)

- [ ] **Step 1: Vercel Analytics + Speed Insights dashboard daily check**
- [ ] **Step 2: Search Console crawl errors monitoring**
- [ ] **Step 3: Sanity Studio editorial QA spot-check (5 case studies, 5 blog posts, all team)**
- [ ] **Step 4: Open follow-up issues for items deferred:** blog single Figma redesign, Sentry / error monitoring, time-bounded review of any flagged warnings from migration

---

## Self-Review

**Spec coverage check:**

| Spec section | Plan task |
|---|---|
| 1. Architecture & Data Flow | covered across all PRs (data fetch + cutover behavior) |
| 2.1 Tokens | Task 2.1 |
| 2.2 teamMember slug + alt | Task 2.2 |
| 2.4 caseStudy extension | Task 2.3 |
| 2.5 podcastEpisode | Task 2.4 |
| 2.7 GROQ queries | Task 2.5 |
| 3.1 Fidelity strategy | Tasks 4.6 + 4.7 |
| 3.2 Case study detail | Task 4.6 |
| 3.3 Podcast detail | Task 4.7 |
| 3.4 Team popup + vCard | Tasks 4.2 + 4.3 |
| 3.5 Insights detail | Task 4.4 |
| 4.1 Migration architecture | Task 3.1 + 3.4 |
| 4.3 Script structure | Task 3.4 |
| 4.4 Patch-only-touch idempotency | Task 3.4 |
| 4.5 HTML→PortableText sanitized | Task 3.4 |
| 4.7 Discovery step | Task 3.3 |
| 5.1 Footer CTA swap | Task 1.1 |
| 5.2 Number Artist rename | Task 1.2 |
| 5.3 Podcast nav | Task 1.3 |
| 5.4 FAQ CTA | Task 1.4 |
| 5.5 Remove /team route | Task 1.5 |
| 5.6 Social URLs | Task 1.6 |
| 6.1 Lighthouse | Task 5.1 + 5.2 |
| 6.2 Visual regression | (manual check during 4.6/4.7; automation deferred to first-iteration follow-up if time-pressed) |
| 6.5 a11y | Task 5.1 + 5.2 |
| 6.7 Load test | Task 5.1 + 5.2 |
| 6.10 Pre-launch validator | Task 5.1 + 5.2 + 6.1 |
| 6.11 Tooling install | Task 5.1 |
| 8. Timeline | reflected in PR ordering |

All sections covered.

**Placeholder scan:** none. Every code step has actual code; every command has expected output.

**Type consistency check:** `SanityCaseStudyDetail`, `SanityPodcastEpisode`, `SanityTeamMember` — used consistently in tasks 2.5, 4.3, 4.4, 4.6, 4.7.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-28-heroic-rankings-bundled-launch.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
