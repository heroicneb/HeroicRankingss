# Heroic Rankings Launch — State Consolidation (2026-04-28)

This document closes the "code-complete, content-bound" phase of the
heroic-rankings-final rebuild. It is the orientation document for whoever
picks the project up next — you, Nebojša, or another agent. It is intentionally
cold-readable: no required prior context.

---

## Phase

**Pre-launch, code-complete, content-bound.**

The new Vercel-deployed Next.js 16 / Sanity-driven Heroic Rankings site sits
beside the live BCMS-backed `heroicrankings.com`. The new code is
feature-complete and stable on `main`. The Sanity dataset is empty for the
three new content types (`caseStudy` extended fields, `podcastEpisode`,
detail-page-ready `post`). DNS still points at the old site.

Phase ends here. The content phase begins when content is entered.

---

## Architectural reflection

This project is a **re-platform**, not just a site rebuild.

| | Old | New |
|---|---|---|
| CMS | BCMS (self-hosted) | Sanity Cloud |
| Backend | Node.js + MongoDB + Nginx | Sanity Content Lake |
| Hosting | DigitalOcean droplet | Vercel edge |
| Frontend | (unknown framework) | Next.js 16 + React 19 + Tailwind v4 |
| Ops | Owned by Heroic | Delegated to Vercel + Sanity |
| Reliability | Single droplet | Vercel + Sanity SLAs |
| Cost model | Per-server fixed | Per-usage scaling |
| Maintenance | Server-care + CMS-care | Dataset-care only |

The detail pages are the *visible artifact* of the re-platform. The
substantive change is that Heroic Rankings goes from "owns infra" to
"delegates infra," from "everything to maintain" to "almost nothing."
This shapes everything about post-launch operations and content velocity.

---

## What we built (this bundle)

### PR 1 — Nebojša review fixes (pre-this-session)
- Footer CTA banner with 3-way swap by route (`/on-page-seo`, `/technical-seo`, `/local-seo`)
- FAQ rewrites on `/seo-services`
- Slug renames (case-studies, podcast, etc.)
- Podcast nav corrections
- `/team/[slug]` route removed; sitemap + presentation resolver updated
- Centralized social URL constants in `src/lib/site.ts`

### PR 2 — Sanity schemas
- `caseStudy`: 12 new structured fields (heroSubtitle, heroMetrics, caseOverview, objectiveChallenges, strategyPillars, journeyTimeline, numbersThatMatter, growthChart, proofData, beforeAfter, conclusion, ctaFooter)
- `podcastEpisode`: NEW document type (~310 lines after schema polish)
- `teamMember`: validation tightened (slug required, photo alts required)
- 4 new tokens in `globals.css` (`--color-hr-pure-black`, `--color-hr-black-box`, `--color-hr-dark-line`, `--gradient-brand-light`)
- `gradient-text-brand-light` utility class for dark surfaces

### PR 4 — Detail pages
- **4.1**: 7 shared UI primitives (`MetricTile`, `NumberedStepCard`, `BigNumberCard`, `TwoToneHeading`, `MobileScrollRail`, `PlayButtonOverlay`, `ReelThumbnail`)
- **4.2**: vCard generator (RFC 6350) at `src/lib/vcard.ts` with 17 tests
- **4.3**: Team member popup full rewrite (Figma `197:891` desktop / `672:4109` mobile) — preserves existing controller wiring
- **4.4**: Insights blog detail (`/insights/[slug]`) — 6 sub-components, server-side H2/H3 anchor ids, IntersectionObserver scroll-spy TOC
- **4.5**: Recharts client island for case study growth chart, server wrapper with reserved height + skeleton
- **4.6**: Case study detail (`/case-studies/[slug]`) — 11 sub-components matching Figma `2255:878` / `2255:1378`
- **4.7**: Podcast episode detail (`/podcast/[slug]`) — 6 sub-components matching Figma `2223:49` / `2223:723`; index page migrated from hardcoded `EPISODES` constant to Sanity-driven
- **4.8**: Push to `main`, Vercel cutover

### Post-PR-4 corrections (today, 2026-04-28)
- pnpm-lockfile fix (npm-vs-pnpm divergence broke Vercel install)
- Codex audit (23 min, 11 findings: 3 High + 4 Medium + 3 Low + 1 RuntimeHypothesis)
- 3 Codex Highs fixed:
  - Blog TOC anchor ids now emit server-side via PortableText H2/H3 serializer (no DOM patching)
  - vCard `escape()` normalizes bare `\r` + CRLF to prevent line injection (3 regression tests)
  - Podcast fetch errors propagate to `error.tsx` boundary instead of silently rendering empty
- 4 Codex Mediums fixed:
  - Team popup social labels mapped from lowercase Sanity enum (`linkedin`/`twitter`/`instagram`) to display labels (`LinkedIn`/`X`/`Instagram`) at the data adapter
  - Dead "Ask Podcast AI" button hidden until backend ships
  - Growth chart wrapped in `<figure>` with sr-only `<table>` data fallback (SVG `aria-hidden`)
  - `videoEmbedUrl` + `bestMoments[].videoUrl` validate http/https + known providers (YouTube, Vimeo, TikTok, Instagram, .mp4)
- `titleHighlighted` schema field added to `caseStudy` + `post` with substring-of-title validation; `CaseStudyHero` + `BlogPostHeader` + `PodcastEpisodeHero` all use shared `splitTitle` helper
- Studio polish: `presentationTool` mounted with preview pane resolvers; field groups on all 3 types; friendly validation messages explaining where each field renders

---

## Project state, multiple angles

### Code health
- TypeScript clean (`tsc --noEmit` zero output)
- Lint passes except 2 pre-existing tolerable errors (`theme-toggle.tsx` setState-in-effect, `caseStudy.ts:328` `any` from validation custom rule)
- Build clean (35–39 static pages depending on `generateStaticParams` slugs)
- Tests: 17/17 vCard tests pass
- ~16 commits today on `main`, all reviewed (Sonnet spec + Opus quality + Codex adversarial), all pushed
- One dependency mismatch caught + fixed (npm vs pnpm). `pnpm` is the canonical package manager for this repo because Vercel uses it.

### Content (Sanity)
- Project: `5cr26y9m` / dataset: `production`
- Existing populated: team members, partnership, contact, legal
- Empty: caseStudy details (existing summaries from old data may exist; the *new* structured fields are empty), podcastEpisode (zero documents), post detail pages (existing posts may need `titleHighlighted` retrofit)
- Audit fixture script ready at `scripts/seed-audit-fixtures.mjs` — not run; populates `audit-fixture-*` prefixed docs that can be deleted via `npx sanity documents delete --query '*[_id match "audit-fixture-*"]'`

### Operations
- Vercel project: `pavle-9556s-projects/heroic-rankings-final`
- Latest production deploy: building from `main` automatically
- Domain status: still on old site at `heroicrankings.com`
- DNS: not yet pointed at Vercel
- 301 redirects: not configured (descoped pre-launch)
- Sanity Studio: live at `/studio` route on the new site
- Search Console: not yet aware of new site

### Editor UX
- Studio has preview panes for `caseStudy`, `podcastEpisode`, `post` (iframes the live route per slug)
- Field groups: caseStudy 6 (Hero/Overview/Strategy/Proof/Closing/SEO), podcastEpisode 5 (Episode/Guest/Content/Related/SEO), post 2 (Article/SEO)
- Validation messages now explain field purpose

### Design parity
- Structurally verified by spec reviewers per task
- Visually unverified — needs eyeball pass against Figma at 1440 / 1024 / 768 / 375
- Known runtime hypothesis (Codex): chart series with duplicate `label` would collapse — needs content to verify

### SEO
- Old site has indexed URLs at patterns like `/seo/linkbuilding/`, `/seo/`, etc.
- New site uses `/link-building`, `/seo-services`, etc.
- No redirect map yet — biggest non-code launch risk if delayed beyond 48h

---

## Outstanding work

### Code (post-launch grade)
- 3 Codex Lows: mobile-rail `prefers-reduced-motion`, token drift in `BlogPostAuthorCard.tsx:71` + `play-button-overlay.tsx:35` + `CaseStudyGrowthChartClient.tsx:15`, HeroPanel `sizes` attribute overstates 1024–1419px
- 1 RuntimeHypothesis verify: chart duplicate-label collapse (needs content)
- PR 5 verification tooling: Lighthouse CI, axe-playwright, k6 baseline, content validator script
- Legacy `PortableTextComponents` cleanup: privacy-policy + partnership pages still consume the legacy serializer; migrate them, then delete the legacy file

### Content
- Real entry by Pavle + Nebojša via Studio (2–4 h estimate)
- OR seed audit fixtures for QA (10 min)

### Ops
- DNS migration plan (TTL pre-lower 24h before, cutover window, rollback path)
- 301 redirect map (post-launch within 48h is acceptable; pre-launch is better)
- Vercel custom domain + SSL provisioning
- Search Console resubmission of new sitemap.xml

### QA
- Visual pass against Figma at 4 breakpoints (Pavle, 1–2 h)
- Browser matrix smoke (Chrome, Safari, Firefox, mobile Safari, Android Chrome)

---

## Risk profile, ranked

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | SEO juice loss at cutover (no redirects) | High if delayed >48h | Crawl old sitemap + ship `vercel.json` redirects within 48h |
| 2 | Empty detail routes 404 until content seeded | Guaranteed | Seed real content OR audit fixtures before announcing |
| 3 | Visual drift discovered post-launch | Low-medium | Manual Figma QA pass before cutover |
| 4 | Sanity transient outage now user-visible (was hidden) | Acceptable trade-off | Codex demanded fail-loud; monitor `error.tsx` boundary |
| 5 | Browser matrix untested | Low | Smoke pass during QA |
| 6 | No production observability | Medium long-term | Add Sentry or similar post-launch |

---

## Path to launch

```
Content seeding (Pavle + Nebojša, 2-4h)
    ↓
Visual QA at 4 breakpoints (Pavle, 1-2h)
    ↓
SEO redirect map drafted (Claude, 30m, on signal)
    ↓
Cutover window:
    - DNS TTL pre-lowered 24h prior
    - Vercel custom domain + SSL
    - Flip A/CNAME at registrar
    - Monitor for 1h
    - Resubmit sitemap to Search Console
    ↓
Post-launch hygiene (within 48h):
    - Redirects live
    - Codex Lows + verification tooling
    - Browser matrix smoke
```

The bottleneck is steps 1+2 (Pavle + Nebojša only). All other steps wait on those.

---

## Critical paths and references

- **Spec**: `docs/superpowers/specs/2026-04-28-heroic-rankings-bundled-launch-design.md`
- **Plan**: `docs/superpowers/plans/2026-04-28-heroic-rankings-bundled-launch.md`
- **Figma extractions**: `docs/figma-cache/extractions/2026-04-28-*.md` (8 files for 4 detail pages × desktop/mobile)
- **Schemas**: `src/sanity/schemaTypes/documents/{caseStudy,podcastEpisode,post,teamMember}.ts`
- **GROQ queries**: `src/sanity/lib/queries.ts`
- **Type pipeline**: `src/lib/sanity-data.ts` (`SanityRaw*` raw types → `Sanity*Detail` exported types)
- **Detail page roots**: `src/components/pages/{insights,case-studies,podcast}/`
- **Team popup**: `src/components/sections/team-member-popup.tsx`
- **vCard**: `src/lib/vcard.ts` + `src/lib/__tests__/vcard.test.ts`
- **Audit fixture seed**: `scripts/seed-audit-fixtures.mjs`
- **Studio config**: `sanity.config.ts`, `src/sanity/presentation/resolve.ts`

---

## Closure

Phase ends here.

Content phase begins when content is entered. The codebase is feature-complete
and stable; the launch is now content-bound and ops-bound, not code-bound. No
further code changes are required to ship — only the punch list above for
post-launch hygiene.

The website is one content session and one DNS flip away from being live.
