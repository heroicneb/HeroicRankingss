# Team-detail page — legacy structure, new-site design language

**Date:** 2026-05-05
**Status:** Design approved, awaiting implementation plan
**Stakeholder:** Nebojsa Jankovic (Founder & CEO)
**Author of design:** Pavle + Claude Opus 4.7
**Stress-test:** Codex (gpt-5.5 xhigh) — verdict MAJOR GAPS, all folded in below

## Goal

Recreate the legacy `https://heroicrankings.com/about/<slug>/` content density on the new site as a separate full route per team member, but styled with the new site's design tokens, NOT a literal copy of legacy CSS.

Existing `/team/[slug]` route is a stretched Figma-popup interpretation (1 portrait + huge gradient name + bio). Nebojsa wants the legacy structure: bio prose + Q&A pairs + personal traits + spare-time bullets + multi-photo lifestyle column.

All content already in Sanity. No content migration needed — pure data re-shape + render rewrite.

## Inventory verified (2026-05-05)

### Sanity `teamMember` per active member

| Member | bioParagraphs paras | cards photos | hobbies format |
|---|---|---|---|
| Nebojsa | 5 (single-prose bio) | 6 | newline-bullets |
| Anastasija | 8 (Q&A) | 5 | newline-bullets |
| Stefan | 6 (merged Q) | 5 | prose paragraph |
| Una | 8 (Q&A) | 3 | newline-bullets |
| Srdjan | 8 (Q&A) | 3 | period-jammed |
| Slobodan | 8 (Q&A) | 4 | newline-bullets |
| Andjela | 8 (Q&A) | 6 | newline-bullets |

### Pattern in `bioParagraphs[]`

- Last 4 paragraphs always = `[traits-Q, traits-A, hobbies-Q, hobbies-A]`
- Earlier paragraphs = either single bio prose (Nebojsa) or odd-Q / even-A pairs (rest), with **Stefan** as outlier (one merged Q, two answers).
- Q strings vary: "What do you like the most about your job?", "What do you most like about working at Heroic Rankings?", "Name 3 of your personal traits:", "What I like to do in my spare time:" / "What do you like to do in your spare time:" / "In my spare time, I love:".
- Bullet format varies: newline-separated (most), period-jammed (Srdjan: `"A.B.C."`), prose paragraph (Stefan).

### `cards[]` photo array

- Carries lifestyle photos with empty `title/subtitle/description` (pure photo carriers).
- Generic alt = member name across all photos for each member (SEO weakness).

## EARS requirements

1. The system **shall** render `/team/[slug]` for every published `teamMember` doc with `showOnAboutPage=true`.
2. The route **shall** display: name + role eyebrow + bio prose + Q&A list + personal traits + spare-time bullets + lifestyle photo column + LinkedIn CTA + secondary contact pills + breadcrumb (Home › About Us › {Name}).
3. **When** a team member has 5 or more lifestyle photos, the system **shall** render the bio card sticky on viewports ≥1024px.
4. **When** a team member has fewer than 5 photos, the system **shall** render the bio card non-sticky on all viewports.
5. **When** viewport <768px, the system **shall** stack content vertically (card → photos → contact pills).
6. The system **shall** consume only project tokens (`--color-hr-*`, `--radius-*`, `--shadow-*`, `--font-*`); zero raw hex.
7. **If** any `lifestylePhotos[].alt` is empty, the migration **shall** refuse to apply and the schema **shall** mark the field as required.
8. **Where** legacy `qaItems` is empty (transitional fallback), the system **shall** render `bioParagraphs[]` verbatim.
9. The popup on `/about-us` **shall** include a "Read full profile →" link to `/team/[slug]`.
10. The system **shall** generate a per-member OG image at `/team/[slug]/opengraph-image`.
11. The sitemap query **shall** filter by `showOnAboutPage==true` (drive-by fix to existing over-broad query).

## Design — desktop ≥1024px

12-col grid, `max-w-[1440px]`, `px-[80px]`.

```
┌─────────────────────────────────────────────────┐
│ / Our Team /          ← Back to team            │  eyebrow row
├─────────────────────────────────────────────────┤
│ ┌─────────────────────┐  ┌────────────┐         │
│ │  CARD (sticky if    │  │ photo 1    │         │
│ │   photos>=5)        │  │            │         │
│ │  ┌──┐  Name         │  └────────────┘         │
│ │  │📷│  / Role /     │       ┌────────────┐    │
│ │  └──┘  [in]         │       │ photo 2    │    │
│ │                     │       └────────────┘    │
│ │  Bio prose          │  ┌────────────┐         │
│ │                     │  │ photo 3    │         │
│ │  Q&A list           │  └────────────┘         │
│ │                     │       ┌────────────┐    │
│ │  Personal traits    │       │ photo 4    │    │
│ │  Resilient, ...     │       └────────────┘    │
│ │                     │  …                      │
│ │  Spare time         │                         │
│ │  • bullet 1         │                         │
│ │  • bullet 2         │                         │
│ │  • bullet 3         │                         │
│ │                     │                         │
│ │  contact pills      │                         │
│ │  [Connect LinkedIn] │                         │
│ └─────────────────────┘                         │
└─────────────────────────────────────────────────┘
```

- **Left card** — 7/12 cols. `position: sticky; top: 100px` ONLY when `lifestylePhotos.length >= 5`; else `self-start; h-fit`. Surface = case-study panel pattern: `bg-[--color-hr-off-white]`, `rounded-[var(--radius-card)]`, `border border-[--color-hr-light-grey]`, `p-[40px] lg:p-[60px]`. Dark-mode mirrors via `dark:` tokens.
- **Right column** — 5/12 cols. Zigzag stagger: odd children `ml-0`, even `ml-[60px]` (proportional to legacy 793/1017 px offset). Aspect-aware: each photo card uses `aspect-[ratio]` driven by Sanity `asset->metadata.dimensions`. Soft shadow `--shadow-card`. Lead photo `priority`, rest `loading="lazy"`.
- **Card content order** (top→bottom):
  1. Avatar 80×80 + gradient-text name + role eyebrow + LinkedIn icon button (header row)
  2. Divider
  3. Bio prose (long-form, only if exists)
  4. Q&A list (`<dl>` with `<dt>` for question, `<dd>` for answer)
  5. Divider
  6. "Personal traits" h4 + traits string
  7. "Spare time" h4 + bullet list
  8. Divider
  9. Contact pills row (email, phone, X, Instagram if present)
  10. Full-width "Connect on LinkedIn" CTA

### Design language alignment (no raw hex)

| Element | Token / utility |
|---|---|
| Card surface | `bg-[--color-hr-off-white]` light / `bg-[--color-bg-dark]` dark |
| Card border | `border-[--color-hr-light-grey]` / `dark:border-[--color-border-inverse-10]` |
| Card radius | `rounded-[var(--radius-card)]` |
| Name (gradient) | existing `gradient-text-brand-about-us-popup-name` |
| Role eyebrow | `SectionLabel` primitive |
| Bio paragraphs | `.type-paragraph` |
| Q-text | `text-[18px] font-medium` |
| Q&A divider | existing dotted-rule pattern |
| Traits/spare-time h4 | `.type-h4` |
| Bullets | `list-disc list-inside` with `.type-paragraph` |
| Contact pills | existing `ContactPill` (extracted from current detail) |
| LinkedIn CTA | existing button pattern from current detail |
| Photo card | `rounded-[var(--radius-card)]`, `shadow-[var(--shadow-card)]` |

If `--shadow-card` is missing in `globals.css`, add once.

## Design — tablet 768–1024

- 1-col stack: card (full-width, non-sticky) → photo column 2-up grid → contact pills already inside card.

## Design — mobile <768

- 1-col stack everything.
- Card full-width, padding `p-[24px]`.
- Photos 1-col with full-bleed inside card padding margin.

## Schema additions to `teamMember`

```ts
// new fields, append after existing
defineField({
  name: "personalTraits",
  title: "Personal Traits (3 words)",
  type: "string",
  description: "E.g. \"Resilient, dedicated, and ambitious.\"",
  validation: (rule) => rule.max(120),
}),
defineField({
  name: "spareTimeBullets",
  title: "Spare-Time Bullets",
  type: "array",
  of: [{ type: "string" }],
  description: "Hobbies / spare-time activities, one per item. Renders as bullet list.",
  validation: (rule) => rule.max(8),
}),
defineField({
  name: "qaItems",
  title: "Q&A Items",
  type: "array",
  description: "Question/answer pairs above traits. Each one renders as a Q (title) + A (paragraph).",
  of: [
    {
      type: "object",
      fields: [
        defineField({ name: "question", type: "string", validation: (r) => r.required() }),
        defineField({ name: "answer", type: "text", rows: 4, validation: (r) => r.required() }),
      ],
      preview: { select: { title: "question", subtitle: "answer" } },
    },
  ],
}),
defineField({
  name: "lifestylePhotos",
  title: "Lifestyle Photos",
  type: "array",
  description: "Personal/lifestyle photos rendered in the right column on /team/[slug]. 3–6 recommended; sticky bio card requires >=5.",
  of: [
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Required. Scene-accurate, ~125 chars max. First photo can include full name + role; rest scene-only or first-name-only to avoid keyword stuffing.",
          validation: (r) => r.required().max(140),
        }),
      ],
    },
  ],
  validation: (rule) => rule.max(8),
}),
```

Legacy fields `bioParagraphs[]` and `cards[]` stay on schema with `hidden: ({ document }) => Boolean(document?.qaItems?.length || document?.lifestylePhotos?.length)` and `readOnly: true` for one release. Scheduled for deletion in a follow-up commit after parity confirmed in production.

## GROQ + types extension

Extend the team-detail query in `src/sanity/lib/queries.ts`:

```groq
*[_type == "teamMember" && slug.current == $slug][0]{
  ..., // existing
  personalTraits,
  spareTimeBullets,
  qaItems,
  "lifestylePhotos": lifestylePhotos[]{
    "url": asset->url,
    "alt": alt,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  }
}
```

Update `SanityTeamMemberDetail` in `src/lib/sanity-data.ts` to include the new fields. Existing `bioParagraphs` mapping stays for transitional fallback.

Drive-by fix in same file: filter sitemap query by `showOnAboutPage == true` (existing bug Codex flagged at `queries.ts:218`).

## Migration — `scripts/migrate/2026-05-team-detail-split.mjs`

**Strategy: human-in-the-loop split, NOT regex authority** (Codex feedback #2).

1. **Step A — generate draft JSON.** Read 7 members. For each, output to `scripts/migrate/team-detail-draft.json`:
   ```json
   {
     "<slug>": {
       "_id": "...",
       "_rev": "...",
       "personalTraits": "<auto-extracted>",
       "spareTimeBullets": ["<auto-split>", "..."],
       "qaItems": [{"question": "...", "answer": "..."}],
       "_warnings": ["e.g. Stefan: merged question detected, please verify"]
     }
   }
   ```
2. **Step B — manual review.** Human (me) opens draft JSON, fixes Stefan's merged-Q, Srdjan's period-jammed bullets, Nebojsa's single-prose bio (qaItems = []). Annotate any others.
3. **Step C — vision pass on photos.** Separate sub-step:
   - Download each `cards[].image` at `?w=800` to `/tmp/team-alts/<slug>/<n>.jpg`.
   - I view each via Read tool, draft scene-accurate alt:
     - **Lead photo**: full name + role + scene (boost branded query).
     - **Photos 2–N**: scene only or first-name + scene (no stuffing).
   - Write into draft JSON `lifestylePhotos[].alt`.
4. **Step D — apply.** Migration reads reviewed JSON, writes new fields with **revision-guarded patches** (`.ifRevisionId(_rev)`). Refuses to write if any `lifestylePhotos[].alt` is empty.
5. **Backup before apply:**
   - `npx sanity dataset export production` (full export).
   - Per-doc JSON snapshot of all 7 members with `_id, _rev, _updatedAt, bioParagraphs, cards[].asset._ref, cards[].image.alt`, written to `scripts/migrate/team-detail-pre-apply-snapshot.json`.

## Risks (revised post-Codex)

| # | Risk | Mitigation |
|---|---|---|
| R1 | Sanity write irreversible | dry-run default, dataset export + per-doc snapshot, revision-guarded patches |
| R2 | Q&A split mis-pairs (Stefan merged Q) | manual JSON review, regex = warn only |
| R3 | Sticky card breaks on short photo column | conditional sticky: `lifestylePhotos.length >= 5` only |
| R4 | Image LCP regression | lead photo `priority`, rest lazy; serve via Sanity image pipeline |
| R5 | Mixed photo aspect ratios | use `asset->metadata.dimensions` for `aspect-ratio` style |
| R6 | Empty alts ship | schema `validation.required()` on alt + migration refuses empty |
| R7 | Photo column has zero data on first render | extend GROQ + types in same commit as component rewrite |
| R8 | Sitemap leaks hidden members | filter `showOnAboutPage==true` (existing bug, fix in same migration commit) |
| R9 | Stale Person/ProfilePage JSON-LD | already wired (verified `person-schema.tsx:48`); re-test after rewrite |
| R10 | Per-member OG fallback to global | add `team/[slug]/opengraph-image.tsx` (Next 16 ImageResponse) |

## Files

| Action | Path | Reason |
|---|---|---|
| Edit | `src/sanity/schemaTypes/documents/teamMember.ts` | Add 4 new fields, hide legacy fields |
| Edit | `src/sanity/lib/queries.ts` | Extend detail query + filter sitemap query (G2) |
| Edit | `src/lib/sanity-data.ts` | Type extensions for new fields |
| Rewrite | `src/components/pages/team/team-member-detail.tsx` | Legacy-structure component |
| Edit | `src/app/(site)/(pages)/team/[slug]/page.tsx` | Wire `BreadcrumbSchema` (G4) |
| Edit | `src/components/sections/team-member-popup.tsx` | Add "Read full profile →" link |
| Edit | `src/app/globals.css` | Add `--shadow-card` if missing |
| New | `src/app/(site)/(pages)/team/[slug]/opengraph-image.tsx` | Per-member OG (G3) |
| New | `scripts/migrate/2026-05-team-detail-split.mjs` | Migration |
| New | `scripts/migrate/team-detail-draft.json` | Reviewed JSON |
| New | `scripts/migrate/team-detail-pre-apply-snapshot.json` | Pre-apply backup |
| New | `docs/figma-cache/extractions/2026-05-05-team-detail-legacy-style.md` | Design ref |

## Validation gate 2 — design vs requirements coverage

| EARS | Design covers? |
|---|---|
| 1 — render `/team/[slug]` for every published member | ✅ existing route, schema unchanged for `showOnAboutPage` filter |
| 2 — full content blocks + breadcrumb | ✅ Section design + G4 breadcrumb wire |
| 3 — sticky on >=5 photos | ✅ conditional sticky |
| 4 — non-sticky <5 | ✅ `self-start; h-fit` |
| 5 — mobile stack | ✅ Mobile section |
| 6 — tokens only | ✅ Token table |
| 7 — alt validation | ✅ schema required + migration refuses empty |
| 8 — qaItems fallback to bioParagraphs | ✅ component reads both during transition |
| 9 — popup → full-profile link | ✅ popup edit |
| 10 — per-member OG | ✅ G3 new file |
| 11 — sitemap filter | ✅ G2 drive-by |

No design elements outside requirements. No requirements without design.

## Sequence (atomic commits)

1. `feat(team): add structured fields to teamMember schema (qaItems, traits, bullets, lifestylePhotos)`
2. `chore(team): hide+readOnly legacy bioParagraphs/cards once new fields present`
3. `feat(sanity): extend team detail query + types for new fields`
4. `fix(sitemap): filter team query by showOnAboutPage` (drive-by)
5. `chore(migrate): generate team-detail draft JSON for human review`
6. `chore(migrate): manual review pass — fix Stefan/Srdjan/Nebojsa edge cases`
7. `chore(migrate): vision-drafted alt-text pass over 30 photos`
8. `chore(migrate): apply revision-guarded patches to 7 members`
9. `feat(team): rewrite /team/[slug] component with legacy structure + new design language`
10. `feat(team): wire breadcrumb schema on team route`
11. `feat(team): per-member OG image`
12. `feat(team): popup "Read full profile" link`
13. (next release) `chore(team): remove legacy bioParagraphs + cards fields after parity confirmed`

## Open questions for Nebojsa

- Lifestyle photo proper-noun upgrades (locations / events) — optional; site ships without them. Schedule a 30-min review pass post-launch.
- Wedding photos — Andjela has 6 photos, Una has 3 — confirm display order.

## References

- Legacy live: https://heroicrankings.com/about/nebojsa-jankovic/ (verified via Playwright 2026-05-05)
- Figma popup design: file `7qZIJIngHrkTeaq9nWZkSa`, node `197:891`
- Codex stress-test: thread `019df78a-0906-7092-b072-2f475d59c7d9` (2026-05-05)
- Existing detail component: `src/components/pages/team/team-member-detail.tsx`
- Existing popup: `src/components/sections/team-member-popup.tsx`
