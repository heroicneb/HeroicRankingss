# Render audit — findings (2026-04-29)

Three-phase audit against `https://heroic-rankings-final.vercel.app/`
after PR4 detail pages + BCMS→Sanity migration.

- **Phase 1** — programmatic structural sweep (`scripts/audit/render-audit.mjs`),
  100 routes, HTTP/title/meta/JSON-LD/section anchors. Result: **99 / 100 pass**
  after entity decoding fix + force-dynamic cache bypass; remaining failure
  resolved when canonical alias caught up to deploy `kdx0iwtxe`.
- **Phase 2** — visual rendering via Playwright at desktop (1440) + mobile (375)
  on home, case-studies index, case-study detail (DesignRush), insights index,
  blog detail (best-ahrefs-alternatives), about-us, team detail
  (nebojsa-jankovic), podcast index, podcast episode detail. Screenshots:
  `audit-01-…audit-13-…png` in repo root.
- **Phase 3** — synthesis below.

## CRITICAL — production blockers

### C1. Dark-mode white-on-white in case-study detail panels
**Pages:** every `/case-studies/[slug]` detail.
**Symptom:** in dark mode the off-white panels (Challenges, Journey,
Pillars, ProofData, Conclusion) keep their light background but the text
inside is forced to `--color-text-inverse` (white) by `dark:` overrides
→ panel content unreadable.
**Files:**
- `src/components/pages/case-studies/parts/CaseStudyChallenges.tsx:47,54`
  (TwoToneHeading + body force `dark:text-[var(--color-text-inverse)]`)
- `src/components/pages/case-studies/parts/CaseStudyJourney.tsx:45,48,65,68`
  (step title + body, both desktop and mobile)
- `src/components/pages/case-studies/parts/CaseStudyConclusion.tsx`
  (similar pattern, verify and patch)
- `src/components/pages/case-studies/parts/CaseStudyPillars.tsx`
  (light-bg cards, verify text overrides)
- `src/components/pages/case-studies/parts/CaseStudyProofData.tsx`
  (light-bg quote cards)
**Fix:** the off-white / pure-white panels are theme-invariant by design.
Remove `dark:text-[var(--color-text-inverse)]` overrides on text *inside*
those panels, OR override the panel bg to a dark surface in `.dark`. The
former preserves the Figma intent (always-light cards on dark page).

### C2. Team detail page: photo + answer fields broken
**Page:** `/team/nebojsa-jankovic` (and likely all `/team/[slug]`).
**Symptoms:**
1. Photo column renders as a blank white box — image src not resolving.
2. "Name 3 of your personal traits:" answer column is empty even though
   the data exists in the bio block (e.g., "Resilient, dedicated, and
   ambitious." appears in the *bio* column instead).
3. "What I like to do in my spare time:" answer column also empty;
   value is concatenated into the bio column with no line break
   ("Spending time with my wife and sonTraveling the world…").
**Files:** `src/components/pages/team/team-member-detail.tsx` and
related Sanity field reads in `src/lib/sanity-data.ts`
(`getTeamMemberBySlug`).
**Likely root causes:**
- Photo: `member.photoUrl` / `member.cardImageUrl` not populated from
  the migrated team-member doc → `<Image>` renders 1px gif placeholder.
  Migration mapper (`scripts/migrate/mappers/teamMember.mjs`) probably
  did not write `photo`/`cardImage` references on the migrated doc.
- Answer columns: BCMS team members store `personalTraits` and
  `freeTime` as separate fields; migration packed them into `bio` as
  trailing paragraphs. Detail page reads them as separate Sanity
  fields → empty.
- Concatenation without line break = `bioParagraphs` joined without
  separator in mapper, or block split by paragraph dropped.

### C3. Insights cards all share one thumbnail
**Page:** `/insights` (and any blog card grid).
**Symptom:** every visible blog card shows the SAME image — "A Dive into
Google's Algorithm Updates" — overlaid with a generic laptop photo,
across all 12 cards in the index. Real titles render correctly below.
**Hypothesis:** migrated post `mainImage` references were not unique;
either all rolled to one default, or `getPostList()` query falls back
to a single image when a post has none. Verify in Sanity studio.

## HIGH — visual / content polish

### H1. Podcast index: "15+ Episodes" claim, only 1 episode card
**Page:** `/podcast`. Hero pill says `15+ Episodes` but only the audit
fixture is in the CMS, so only 1 card renders. Either remove the
hard-coded count, drive it from `episodes.length`, or seed real
episodes before launch.

### H2. Podcast episode "Built for Podcast Listeners" feature icons missing
**Page:** `/podcast`. The 3 feature icon boxes (Context-Aware Answers,
Instant Streaming, Private & Secure) render with empty icon squares.
Either icon SVGs are not imported or icon component shrunk to 0 in this
viewport.

### H3. Podcast episode detail "Best Moments From This Episode" empty
**Page:** `/podcast/audit-fixture-podcast-episode`. Section heading
renders but the card slot beneath is empty. If the fixture has no
"best moments" data, the section should `return null`; instead it
renders a placeholder card.

### H4. About-us "Meet Your Core Heroes" cards have no photos
**Page:** `/about-us`. Team grid cards render dark with name/role text
visible but no portraits. Same root cause as **C2** — migrated team
members have empty `cardImage` / `photo` references.

### H5. CSP inline-script violation on every page
**Pages:** all. Console reports
> Executing inline script violates the following Content Security Policy
> directive 'script-src 'self' 'nonce-…' 'strict-dynamic' …'
One inline script (likely a Next.js theme-flash blocker or analytics
snippet) is missing the nonce prop. Find the offender in
`src/app/layout.tsx` or a `_document` equivalent and pass `nonce` from
`headers()`.

## MEDIUM — content correctness

### M1. Audit fixture content visible in production
- `/case-studies/audit-fixture-case-study` removed earlier (good).
- `/podcast/audit-fixture-podcast-episode` is still the only podcast
  episode and is *visible* on the live site. Either gate audit-fixture
  docs behind a `migrationSource.kind == "audit-fixture"` filter in
  list/detail queries, or delete before launch.

### M2. CaseStudy DesignRush only renders 7 of 12 sections
Hero, overview, challenges, pillars, journey, proof, conclusion render.
Missing: heroPanel, numbers, growthChart, beforeAfter, ctaFooter.
Confirm whether legacy DesignRush page had those blocks and they were
dropped during migration, or whether sections correctly collapse when
fields are empty. Spot-check 3 more case studies.

## LOW — observed but not blocking

### L1. Blog post detail TOC sticky behavior
On the desktop screenshot, the left-column TOC ("Ahrefs Alternatives
(Paid)" highlighted) renders correctly. No issue; flagging only because
sticky-on-scroll behavior was not exercised in this audit.

### L2. Mobile case-studies index layout
Mobile renders 6 cards stacked vertically as expected, full-width.
Working as designed.

## Verification status of earlier fixes

- ✅ Case-studies index force-dynamic: deploy `kdx0iwtxe` confirmed
  6 unique slugs (`affinda`, `art-by-maudsch`, `designrush`,
  `diy-craft-ecom-brand`, `my-baskets`, `nagish`). No
  `audit-fixture-case-study`, no `number-artist`.
- ✅ HTML entity decoding in render-audit script: 89 false-positive
  broken-image errors resolved.
- ✅ partnerLogo migration: 24 docs in Sanity, 4 featured / 9 partner
  / 11 other.

## Recommended fix order

1. **C1 dark-mode panels** — affects every case-study detail; one CSS
   pass can resolve all five components.
2. **C2 team detail data shape** — one migration backfill + one
   component prop wiring fix.
3. **C3 insights thumbnails** — verify in Studio first; could be a
   query/transform bug rather than a migration bug.
4. **H1–H4** — cosmetic but launch-quality blockers.
5. **H5 CSP nonce** — security/devtools cleanliness.
6. **M1** delete or gate audit-fixture podcast.
7. **M2** spot-check remaining case studies.

## Artifacts

- Phase 1 results: `scripts/audit/render-audit.mjs` last run output
  (99/100, kdx0iwtxe deploy).
- Phase 2 screenshots:
  - `audit-01-home-desktop.png`
  - `audit-02-case-studies-index-desktop.png`
  - `audit-03-seo-services-desktop.png`
  - `audit-04-case-study-designrush-desktop.png`
  - `audit-05-insights-index-desktop.png`
  - `audit-06-blog-post-detail-desktop.png`
  - `audit-06b-blog-post-detail-viewport.png`
  - `audit-07-about-us-desktop.png`
  - `audit-08-team-detail-desktop.png`
  - `audit-09-podcast-index-desktop.png`
  - `audit-10-podcast-episode-detail-desktop.png`
  - `audit-11-home-mobile.png`
  - `audit-12-case-studies-mobile.png`
  - `audit-13-case-study-detail-mobile.png`
