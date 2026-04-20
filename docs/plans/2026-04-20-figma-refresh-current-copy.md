# Figma Refresh Plan (2026-04-20)

**Goal:** Rebuild page-by-page parity against the current Figma source of truth, file key `7qZIJIngHrkTeaq9nWZkSa` (`Heroic Rankings - Website (Copy)`), and remove drift introduced by earlier work that targeted the older file key `iIVCGkNIrd9sc6j9NKmGIF`.

## Baseline

- Active worktree: `/Users/pavle/Developer/clients/heroic/heroic-rankings/.worktrees/figma-refresh-2026-04-20`
- Source branch: `main`
- Working branch: `codex/figma-refresh-2026-04-20`
- Figma access path: direct Figma REST API via local `.env.local`
- Constraint: Figma MCP is not exposed in this session, so extraction will use the REST API while preserving the same cache artifacts and note structure required by the repo workflow.

## Non-Negotiable Workflow

1. Work one page at a time.
2. Within a page, work one section at a time.
3. Before implementation for a section:
   - confirm node IDs
   - capture fresh Figma extraction details
   - save a cache note under `docs/figma-cache/extractions/`
   - save required assets under `public/figma/<page>/<section>/` when applicable
4. Before closing a page:
   - run `npm run lint`
   - run `npm run build`
   - run focused tests for touched sections/components
   - run responsive browser verification at `1440`, `1024`, `768`, and `375`
5. Do not move to the next page until the current page is clean enough to lock.

## Fresh Source of Truth

| Item | Value |
|---|---|
| Figma file key | `7qZIJIngHrkTeaq9nWZkSa` |
| Figma page | `Website` |
| Homepage node | `702:10152` |
| About Us node | `189:5` |
| Partnership node | `247:345` |
| Insights node | `248:1541` |
| Case Studies node | `248:1917` |
| Contact node | `249:2227` |
| SEO Services hub node | `203:1361` |
| Technical SEO node | `222:243` |
| On-Page SEO node | `230:372` |
| Local SEO node | `233:728` |
| Keyword Strategy node | `233:1084` |
| Content Creation node | `233:1412` |
| E-commerce SEO node | `240:2` |
| Link Building node | `246:2` |

## Execution Order

| Step | Scope | Route | Figma node | Status |
|---|---|---|---|---|
| 0 | Shared shell and tokens | shell | shared components | queued |
| 1 | Homepage | `/` | `702:10152` | in progress |
| 2 | About Us | `/about-us` | `189:5` | queued |
| 3 | SEO Services hub | `/seo-services` | `203:1361` | queued |
| 4 | Link Building | `/link-building` | `246:2` | queued |
| 5 | On-Page SEO | `/on-page-seo` | `230:372` | queued |
| 6 | Technical SEO | `/technical-seo` | `222:243` | queued |
| 7 | Local SEO | `/local-seo` | `233:728` | queued |
| 8 | Content Creation | `/content-creation` | `233:1412` | queued |
| 9 | E-commerce SEO | `/ecommerce-seo` | `240:2` | queued |
| 10 | Keyword Strategy | `/keyword-strategy` | `233:1084` | queued |
| 11 | Partnership | `/partnership` | `247:345` | queued |
| 12 | Insights hub and detail | `/insights`, `/insights/[slug]` | `248:1541` | queued |
| 13 | Case Studies hub and detail | `/case-studies`, `/case-studies/[slug]` | `248:1917` | queued |
| 14 | Podcast hub and detail | `/podcast`, `/podcast/[slug]` | pending frame confirmation | queued |
| 15 | Contact | `/contact` | `249:2227` | queued |
| 16 | Privacy Policy | `/privacy-policy` | pending frame confirmation | queued |
| 17 | Team detail | `/team/[slug]` | pending frame confirmation | queued |

## Deliverables Per Page

For each page, produce or update:

- one route-level audit note in `docs/audit/reports/`
- one or more extraction notes in `docs/figma-cache/extractions/`
- any required Figma-derived assets in `public/figma/<page>/<section>/`
- focused tests for copy/order/structure when the page has repeatable content
- implementation updates in `src/components/**`, `src/app/**`, or shared tokens

## Immediate Tasks

### Task 0.1: Reset stale tracking

- Create a new parity tracker for the current file key.
- Update `TODO.md` to reflect the active parity sweep.
- Leave all prior 2026-04-03 and 2026-04-15 plans in place for reference only.

### Task 0.2: Homepage extraction

- Pull the current homepage frame and map section node IDs from the `702:10152` tree.
- Save extraction notes to `docs/figma-cache/extractions/2026-04-20-homepage-section-00-full-audit.md`.
- Identify mismatches against current implementation before touching UI code.

### Task 0.3: Homepage implementation loop

- Start with shared shell issues that block homepage fidelity.
- Then fix sections in visual order:
  1. Hero
  2. Services
  3. About
  4. Team
  5. Stats
  6. Featured logos
  7. Case studies
  8. Trust authority
  9. Partnerships
  10. Blog
  11. Testimonials
  12. Footer CTA / footer

### Task 0.4: Verification gate

- Reuse existing verification scripts where they still apply.
- Update or replace old assumptions that still point at the previous Figma file key.
- Record exact verification commands and outcomes in the tracker and audit note.

## Risks To Resolve Early

- Existing docs and audit artifacts still reference the old file key and can mislead implementation.
- Existing Figma-derived assets may be outdated relative to the current copy file.
- Some routes such as `podcast`, `privacy-policy`, and `team/[slug]` still need current-file frame confirmation.
- Shared token changes can create page regressions, so shell and token work must stay tightly verified.
