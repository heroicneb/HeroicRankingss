# Team Detail Legacy-Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the legacy `https://heroicrankings.com/about/<slug>/` content density on the new site as a per-member full route at `/team/[slug]`, styled in the new design language (case-study-panel-style card, gradient name, project tokens). Render bio + Q&A + traits + spare-time bullets + lifestyle photo column from structured Sanity fields.

**Architecture:** Data already lives in Sanity, just unstructured. Plan = (1) extend `teamMember` schema with structured fields, (2) one-time migration with human-in-the-loop JSON review (NOT regex authority — Codex feedback), (3) extend GROQ + types, (4) rewrite `team-member-detail.tsx`, (5) wire breadcrumb + per-member OG, (6) link popup to full page, (7) drive-by fix sitemap query over-broadness. Legacy fields (`bioParagraphs[]`, `cards[]`) stay hidden+readOnly one release before deletion.

**Tech Stack:** Next 16.1.6 App Router, TypeScript, Tailwind v4, Sanity v4 (project `5cr26y9m`/dataset `production`), pnpm, vitest. Design tokens in `src/app/globals.css`. UI primitives: `GradientText`, `SectionLabel`, `ContactPill`, existing `gradient-text-brand-about-us-popup-name`.

**Reference:** Full design at `docs/plans/2026-05-05-team-detail-legacy-style-design.md`. EARS requirements 1–11 + Codex stress-test fold-in.

---

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| Edit | `src/sanity/schemaTypes/documents/teamMember.ts` | Add `personalTraits`, `spareTimeBullets`, `qaItems`, `lifestylePhotos` fields. Hide+readOnly legacy `bioParagraphs[]` + `cards[]` once new fields populated. |
| Edit | `src/sanity/lib/queries.ts` | Project new fields in `TEAM_MEMBER_BY_SLUG_QUERY`. Filter `TEAM_MEMBER_SLUGS_QUERY` by `showOnAboutPage != false`. |
| Edit | `src/lib/sanity-data.ts` | Extend `SanityRawTeamMember` + `SanityTeamMember` + `mapTeamMember` with new fields. |
| Edit | `src/app/sitemap.test.ts` | Mock `getTeamMemberSlugs`, flip `/team/` assertion from absent to present, add hidden-member exclusion case. |
| New | `scripts/migrate/2026-05-team-detail-split.mjs` | Two modes: `--draft` (read 7 members, write `team-detail-draft.json` with auto-extracted splits + `_warnings`); `--apply` (read reviewed JSON, revision-guarded patches, refuse on empty alts). |
| New | `scripts/migrate/team-detail-draft.json` | Draft splits for human review (committed for traceability). |
| New | `scripts/migrate/team-detail-pre-apply-snapshot.json` | Per-doc backup with `_id, _rev, _updatedAt, bioParagraphs, cards`. |
| Edit | `src/app/globals.css` | Add `--shadow-card` token only if missing. |
| Rewrite | `src/components/pages/team/team-member-detail.tsx` | Legacy-structure component: sticky bio card (left) + zigzag photo column (right) on ≥1024px. |
| New | `src/components/pages/team/__tests__/team-member-detail.test.tsx` | Snapshot/render test — verify sections render conditionally. |
| Edit | `src/app/(site)/(pages)/team/[slug]/page.tsx` | Wire `BreadcrumbSchema` (Home › About Us › {Name}). |
| New | `src/app/(site)/(pages)/team/[slug]/opengraph-image.tsx` | Per-member OG via Next ImageResponse. |
| Edit | `src/components/sections/team-member-popup.tsx` | Add "Read full profile →" link to `/team/[slug]`. |

---

## Task 1: Extend `teamMember` schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/teamMember.ts:78-95` (after `bioParagraphs`) and `:153-191` (`cards`)

- [ ] **Step 1: Add new fields to schema**

In `src/sanity/schemaTypes/documents/teamMember.ts`, add these four fields immediately after the existing `bioParagraphs` definition (around line 95):

```ts
defineField({
  name: "personalTraits",
  title: "Personal Traits",
  type: "string",
  description:
    'Three-word self-description, e.g. "Resilient, dedicated, and ambitious."',
  validation: (rule) => rule.max(140),
}),
defineField({
  name: "spareTimeBullets",
  title: "Spare-Time Bullets",
  type: "array",
  of: [{ type: "string" }],
  description:
    "Hobbies / spare-time activities, one per item. Renders as bullet list.",
  validation: (rule) => rule.max(8),
}),
defineField({
  name: "qaItems",
  title: "Q&A Items",
  type: "array",
  description:
    "Question/answer pairs above traits. Each renders as a Q (heading) + A (paragraph).",
  of: [
    {
      type: "object",
      fields: [
        defineField({
          name: "question",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "answer",
          type: "text",
          rows: 4,
          validation: (r) => r.required(),
        }),
      ],
      preview: { select: { title: "question", subtitle: "answer" } },
    },
  ],
  validation: (rule) => rule.max(6),
}),
defineField({
  name: "lifestylePhotos",
  title: "Lifestyle Photos",
  type: "array",
  description:
    "Personal/lifestyle photos rendered in the right column on /team/[slug]. 3–6 recommended; sticky bio card requires >=5.",
  of: [
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description:
            "Required. Scene-accurate, ~125 chars max. First photo can include full name + role; rest scene-only or first-name + scene to avoid keyword stuffing.",
          validation: (r) => r.required().max(140),
        }),
      ],
    },
  ],
  validation: (rule) => rule.max(8),
}),
```

- [ ] **Step 2: Hide legacy fields once new fields populated**

Modify the existing `bioParagraphs` field (line ~89) and `cards` field (line ~153) by adding `hidden` + `readOnly` props that activate once new fields are populated:

```ts
defineField({
  name: "bioParagraphs",
  title: "Extended Bio (Legacy)",
  type: "array",
  description:
    "Legacy field — replaced by qaItems + personalTraits + spareTimeBullets. Kept hidden for one release as rollback source. Will be removed in a follow-up after parity verified.",
  of: [{ type: "text" }],
  readOnly: true,
  hidden: ({ document }) =>
    Boolean(
      (document?.qaItems as unknown[] | undefined)?.length ||
        (document?.personalTraits as string | undefined)?.length,
    ),
}),
```

```ts
defineField({
  name: "cards",
  title: "Cards / Gallery (Legacy)",
  type: "array",
  description:
    "Legacy field — replaced by lifestylePhotos. Kept hidden for one release as rollback source. Will be removed in a follow-up after parity verified.",
  of: [
    /* existing of[] block unchanged */
  ],
  readOnly: true,
  hidden: ({ document }) =>
    Boolean((document?.lifestylePhotos as unknown[] | undefined)?.length),
  validation: (rule) =>
    rule
      .max(12)
      .warning("More than 12 cards is unusual for a team profile."),
}),
```

- [ ] **Step 3: Verify schema compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Verify Sanity Studio renders the new fields**

Open Studio (`pnpm dev` and visit `/studio`), open any teamMember doc. Expected: the four new fields appear after `bioParagraphs`. `bioParagraphs` and `cards` are still visible (no `qaItems` populated yet) but read-only.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemaTypes/documents/teamMember.ts
git commit -m "feat(team): add structured fields to teamMember schema (qaItems, traits, bullets, lifestylePhotos)

Adds personalTraits, spareTimeBullets, qaItems, lifestylePhotos.
Hides + read-onlys legacy bioParagraphs and cards once new fields
are populated. Legacy fields stay one release as rollback source,
scheduled for removal after parity verified.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Extend GROQ + types + sitemap filter

**Files:**
- Modify: `src/sanity/lib/queries.ts:198-216` and `:218-220`
- Modify: `src/lib/sanity-data.ts:113-130, 559-574, 582-605`

- [ ] **Step 1: Project new fields in detail query**

Replace the body of `TEAM_MEMBER_BY_SLUG_QUERY` in `src/sanity/lib/queries.ts`:

```ts
export const TEAM_MEMBER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "teamMember" && slug.current == $slug && !(_id match "audit-fixture-*")][0] {
    _id,
    name,
    slug,
    role,
    department,
    photo { ..., asset->{ _id, _type, metadata { lqip } } },
    cardImage { ..., asset->{ _id, _type, metadata { lqip } } },
    bio,
    bioParagraphs,
    personalTraits,
    spareTimeBullets,
    qaItems[]{ question, answer },
    "lifestylePhotos": lifestylePhotos[]{
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "lqip": asset->metadata.lqip
    },
    contact,
    socialLinks[] { _key, platform, url },
    linkedin,
    showOnAboutPage,
    _createdAt,
    _updatedAt
  }
`);
```

- [ ] **Step 2: Filter team-slug query by showOnAboutPage**

Replace `TEAM_MEMBER_SLUGS_QUERY` (line 218):

```ts
export const TEAM_MEMBER_SLUGS_QUERY = defineQuery(`
  *[
    _type == "teamMember"
    && defined(slug.current)
    && showOnAboutPage != false
    && !(_id match "audit-fixture-*")
  ].slug.current
`);
```

- [ ] **Step 3: Extend `SanityRawTeamMember` in sanity-data.ts**

In `src/lib/sanity-data.ts`, add new fields to `SanityRawTeamMember` (line ~113):

```ts
interface SanityRawTeamMember {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  role: string;
  department?: string | null;
  photo?: SanityImageRef | null;
  cardImage?: SanityImageRef | null;
  bio?: string | null;
  bioParagraphs?: string[] | null;
  personalTraits?: string | null;
  spareTimeBullets?: string[] | null;
  qaItems?: Array<{ question: string; answer: string }> | null;
  lifestylePhotos?: Array<{
    url: string | null;
    alt: string | null;
    width?: number | null;
    height?: number | null;
    lqip?: string | null;
  }> | null;
  contact?: { email?: string | null; phone?: string | null } | null;
  socialLinks?: SanityRawSocialLink[] | null;
  linkedin?: string | null;
  showOnAboutPage?: boolean;
  _createdAt?: string | null;
  _updatedAt?: string | null;
}
```

- [ ] **Step 4: Add corresponding fields to `SanityTeamMember`**

In the same file (line ~558), extend the public type:

```ts
export interface SanityTeamMember {
  _id: string;
  name: string;
  slug: { current: string } | null;
  role: string;
  department: string | null;
  photoUrl: string;
  photoAlt: string;
  photoLqip: string | undefined;
  cardImageUrl: string;
  cardImageAlt: string;
  cardImageLqip: string | undefined;
  bio: string | null;
  bioParagraphs: string[] | null;
  personalTraits: string | null;
  spareTimeBullets: string[];
  qaItems: Array<{ question: string; answer: string }>;
  lifestylePhotos: Array<{
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    lqip: string | undefined;
  }>;
  contact: { email: string | null; phone: string | null } | null;
  socialLinks: Array<{ platform: string; url: string }>;
}
```

- [ ] **Step 5: Map new fields in `mapTeamMember`**

Replace `mapTeamMember` body (line ~582):

```ts
function mapTeamMember(m: SanityRawTeamMember): SanityTeamMember {
  return {
    _id: m._id,
    name: m.name,
    slug: m.slug ?? null,
    role: m.role,
    department: m.department ?? null,
    photoUrl: imageUrl(m.photo, 600),
    photoAlt: m.photo?.alt ?? `${m.name} portrait`,
    photoLqip: imageLqip(m.photo),
    cardImageUrl: imageUrl(m.cardImage, 600),
    cardImageAlt: m.cardImage?.alt ?? m.name,
    cardImageLqip: imageLqip(m.cardImage),
    bio: m.bio ?? null,
    bioParagraphs: m.bioParagraphs ?? null,
    personalTraits: m.personalTraits?.trim() || null,
    spareTimeBullets: (m.spareTimeBullets ?? []).filter(
      (b): b is string => typeof b === "string" && b.trim().length > 0,
    ),
    qaItems: (m.qaItems ?? []).filter(
      (q): q is { question: string; answer: string } =>
        Boolean(q?.question?.trim() && q?.answer?.trim()),
    ),
    lifestylePhotos: (m.lifestylePhotos ?? [])
      .filter((p): p is NonNullable<typeof p> & { url: string } =>
        Boolean(p?.url),
      )
      .map((p) => ({
        url: p.url,
        alt: (p.alt ?? "").trim(),
        width: p.width ?? null,
        height: p.height ?? null,
        lqip: p.lqip ?? undefined,
      })),
    contact: m.contact
      ? { email: m.contact.email ?? null, phone: m.contact.phone ?? null }
      : null,
    socialLinks: (m.socialLinks ?? []).map((sl: SanityRawSocialLink) => ({
      platform: sl.platform,
      url: sl.url,
    })),
  };
}
```

- [ ] **Step 6: Update sitemap test mock + flip `/team/` assertion**

Replace `src/app/sitemap.test.ts` entirely:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getPostSlugsMock,
  getCaseStudySlugsMock,
  getTeamMemberSlugsMock,
} = vi.hoisted(() => ({
  getPostSlugsMock: vi.fn(),
  getCaseStudySlugsMock: vi.fn(),
  getTeamMemberSlugsMock: vi.fn(),
}));

vi.mock("@/lib/sanity-data", () => ({
  getPostSlugs: getPostSlugsMock,
  getCaseStudySlugs: getCaseStudySlugsMock,
  getTeamMemberSlugs: getTeamMemberSlugsMock,
}));

import sitemap from "./sitemap";

describe("sitemap route", () => {
  beforeEach(() => {
    getPostSlugsMock.mockResolvedValue(["market-research-guide"]);
    getCaseStudySlugsMock.mockResolvedValue(["affinda"]);
    getTeamMemberSlugsMock.mockResolvedValue(["nebojsa-jankovic"]);
  });

  it("includes homepage, insight, case study, and visible team routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://heroicrankings.com");
    expect(urls).toContain("https://heroicrankings.com/insights/market-research-guide");
    expect(urls).toContain("https://heroicrankings.com/case-studies/affinda");
    expect(urls).toContain("https://heroicrankings.com/team/nebojsa-jankovic");
  });

  it("does not include hidden team members (showOnAboutPage=false filtered upstream)", async () => {
    // getTeamMemberSlugsMock only returns visible slugs because the GROQ query
    // already filters by showOnAboutPage != false. This test asserts the sitemap
    // emits exactly what the data layer returns — no double-filtering or leaks.
    getTeamMemberSlugsMock.mockResolvedValue([]);
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/team/"))).toBe(false);
  });
});
```

- [ ] **Step 7: Run lint + tsc + tests**

Run:
```bash
npx tsc --noEmit
pnpm test --run src/app/sitemap.test.ts
```
Expected: tsc clean. Both sitemap tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/sanity/lib/queries.ts src/lib/sanity-data.ts src/app/sitemap.test.ts
git commit -m "feat(team): extend GROQ + types for structured fields, fix sitemap leak

- TEAM_MEMBER_BY_SLUG_QUERY projects qaItems, personalTraits,
  spareTimeBullets, lifestylePhotos with asset metadata (lqip,
  width, height for aspect-aware rendering).
- TEAM_MEMBER_SLUGS_QUERY filters showOnAboutPage != false
  (was emitting hidden members in sitemap — Codex G2 finding).
- Sitemap test updated: mock new getTeamMemberSlugs export, flip
  /team/ assertion from excluded to expected, add hidden-member
  case asserting empty data → empty team URL set.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Migration script — draft mode

**Files:**
- Create: `scripts/migrate/2026-05-team-detail-split.mjs`

- [ ] **Step 1: Write migration script (draft mode only — apply mode comes after manual review)**

Create `scripts/migrate/2026-05-team-detail-split.mjs`:

```js
#!/usr/bin/env node
/**
 * Splits unstructured `bioParagraphs[]` into qaItems + personalTraits +
 * spareTimeBullets, and copies `cards[].image` → lifestylePhotos[].
 *
 * Two phases:
 *   --draft  → reads 7 active members, writes auto-extracted JSON to
 *              scripts/migrate/team-detail-draft.json. NO Sanity writes.
 *              Human reviews + edits draft before --apply.
 *   --apply  → reads reviewed draft, writes revision-guarded patches.
 *              Refuses if any lifestylePhotos[].alt is empty.
 *
 * Codex feedback #2: regex is a warning system, NOT the parser of record.
 * Manual review is the source of truth for 7 docs.
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "5cr26y9m";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;
const API_VERSION = "2026-02-19";

const DRAFT_PATH = path.resolve(
  "scripts/migrate/team-detail-draft.json",
);
const SNAPSHOT_PATH = path.resolve(
  "scripts/migrate/team-detail-pre-apply-snapshot.json",
);

const TRAITS_QUESTION_REGEX = /name 3 of your personal traits/i;
const SPARE_TIME_QUESTION_REGEX = /spare time/i;

function makeClient(useToken = false) {
  return createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    token: useToken ? TOKEN : undefined,
    useCdn: !useToken,
  });
}

/**
 * Heuristic split of bioParagraphs[]. Returns the auto-derived shape +
 * a list of human-review _warnings. NOT authoritative.
 */
function autoSplit(member) {
  const paras = (member.bioParagraphs || []).map((p) => p.trim()).filter(Boolean);
  const warnings = [];

  let traitsIdx = paras.findIndex((p) => TRAITS_QUESTION_REGEX.test(p));
  let spareIdx = paras.findIndex((p) => SPARE_TIME_QUESTION_REGEX.test(p));
  if (traitsIdx === -1) warnings.push("traits question not found");
  if (spareIdx === -1) warnings.push("spare-time question not found");
  if (traitsIdx >= 0 && spareIdx >= 0 && spareIdx <= traitsIdx) {
    warnings.push("spare-time question precedes traits question — atypical");
  }

  const personalTraits =
    traitsIdx >= 0 && paras[traitsIdx + 1] ? paras[traitsIdx + 1] : "";
  const rawSpare = spareIdx >= 0 ? paras[spareIdx + 1] || "" : "";

  // Bullet split: try \n first, fall back to period-jammed, fall back to single-prose.
  let spareTimeBullets = [];
  if (rawSpare.includes("\n")) {
    spareTimeBullets = rawSpare
      .split(/\n+/)
      .map((b) => b.replace(/^[-•\s]+/, "").trim())
      .filter(Boolean);
  } else if ((rawSpare.match(/\.[A-Z]/g) || []).length >= 2) {
    spareTimeBullets = rawSpare
      .split(/\.(?=[A-Z])/)
      .map((b) => b.replace(/\.$/, "").trim())
      .filter(Boolean);
    warnings.push("period-jammed bullets — verify split");
  } else if (rawSpare.length > 0) {
    spareTimeBullets = [rawSpare];
    warnings.push("single-prose hobbies — kept as one bullet, may want to split");
  }

  // qaItems: paragraphs before traitsIdx, paired odd=Q / even=A.
  const beforeTraits = traitsIdx >= 0 ? paras.slice(0, traitsIdx) : [];
  const qaItems = [];
  if (beforeTraits.length === 1) {
    warnings.push(
      "single paragraph before traits — likely Nebojsa-style long-form bio (qaItems = [], leave bio in `bio` field instead)",
    );
  } else if (beforeTraits.length % 2 !== 0) {
    warnings.push(
      `${beforeTraits.length} paragraphs before traits — odd count, manual pairing required (e.g. Stefan merged-Q case)`,
    );
  }
  for (let i = 0; i + 1 < beforeTraits.length; i += 2) {
    qaItems.push({ question: beforeTraits[i], answer: beforeTraits[i + 1] });
  }

  return { personalTraits, spareTimeBullets, qaItems, warnings };
}

async function runDraft() {
  const client = makeClient(false);
  const members = await client.fetch(`
    *[_type == "teamMember" && showOnAboutPage != false]
    | order(order asc) {
      _id, _rev, _updatedAt, name, "slug": slug.current, role,
      bio, bioParagraphs,
      cards[]{ "asset": image.asset._ref, "alt": image.alt, "url": image.asset->url }
    }
  `);

  const draft = {};
  for (const m of members) {
    const split = autoSplit(m);
    const photoCards = (m.cards || []).filter((c) => c?.asset);
    draft[m.slug] = {
      _id: m._id,
      _rev: m._rev,
      _updatedAt: m._updatedAt,
      name: m.name,
      role: m.role,
      bio: m.bio || null,
      bioParagraphs_legacy: m.bioParagraphs || [],
      personalTraits: split.personalTraits,
      spareTimeBullets: split.spareTimeBullets,
      qaItems: split.qaItems,
      lifestylePhotos: photoCards.map((c, i) => ({
        _ref: c.asset,
        url: c.url,
        alt: "", // FILLED IN BY VISION PASS — leave empty here
        _index: i,
      })),
      _warnings: split.warnings,
    };
  }

  await mkdir(path.dirname(DRAFT_PATH), { recursive: true });
  await writeFile(DRAFT_PATH, JSON.stringify(draft, null, 2) + "\n");
  console.log(`✓ Draft written to ${DRAFT_PATH}`);
  console.log(`  ${Object.keys(draft).length} members.`);
  console.log("  Review _warnings, fix qaItems pairing, then run vision pass for alts.");
}

async function runApply() {
  if (!TOKEN) {
    console.error("✗ SANITY_API_TOKEN required for --apply");
    process.exit(2);
  }
  const draftRaw = await readFile(DRAFT_PATH, "utf8");
  const draft = JSON.parse(draftRaw);

  // Refuse if any lifestylePhotos[].alt is empty.
  const missingAlts = [];
  for (const [slug, doc] of Object.entries(draft)) {
    for (const p of doc.lifestylePhotos || []) {
      if (!p.alt?.trim()) missingAlts.push(`${slug}#${p._index}`);
    }
  }
  if (missingAlts.length > 0) {
    console.error("✗ Empty lifestylePhotos[].alt — refusing to apply:");
    for (const x of missingAlts) console.error(`  ${x}`);
    process.exit(2);
  }

  // Snapshot before apply.
  const client = makeClient(true);
  const ids = Object.values(draft).map((d) => d._id);
  const liveDocs = await client.fetch(`*[_id in $ids]`, { ids });
  await writeFile(SNAPSHOT_PATH, JSON.stringify(liveDocs, null, 2) + "\n");
  console.log(`✓ Pre-apply snapshot written to ${SNAPSHOT_PATH}`);

  // Revision-guarded patches.
  for (const [slug, doc] of Object.entries(draft)) {
    const patch = client.patch(doc._id).ifRevisionId(doc._rev).set({
      personalTraits: doc.personalTraits || null,
      spareTimeBullets: doc.spareTimeBullets || [],
      qaItems: (doc.qaItems || []).map((q, i) => ({
        _key: `qa-${i}`,
        question: q.question,
        answer: q.answer,
      })),
      lifestylePhotos: (doc.lifestylePhotos || []).map((p, i) => ({
        _key: `photo-${i}`,
        _type: "image",
        asset: { _type: "reference", _ref: p._ref },
        alt: p.alt,
      })),
    });
    await patch.commit();
    console.log(`  ✓ ${slug} patched`);
  }
  console.log(`✓ Apply complete. Backup at ${SNAPSHOT_PATH}`);
}

const [, , mode] = process.argv;
if (mode === "--draft") {
  await runDraft();
} else if (mode === "--apply") {
  await runApply();
} else {
  console.error("Usage: node scripts/migrate/2026-05-team-detail-split.mjs --draft | --apply");
  process.exit(2);
}
```

- [ ] **Step 2: Run draft mode**

```bash
node scripts/migrate/2026-05-team-detail-split.mjs --draft
```
Expected: writes `scripts/migrate/team-detail-draft.json` with 7 members. Console reports each + warnings count.

- [ ] **Step 3: Inspect draft for known edge cases**

Open `scripts/migrate/team-detail-draft.json`. Verify expected `_warnings`:
- `nebojsa-jankovic`: should have `"single paragraph before traits — likely Nebojsa-style ..."` warning. Manually set `qaItems: []` and copy the long-form first paragraph into the `bio` field if not already there.
- `stefan-cvetkovic`: should have `"odd count, manual pairing required"` warning. Manually merge the 2-answer Q.
- `srdjan-gombar`: should have `"period-jammed bullets — verify split"`. Verify split is `["Hang out with my son and nephew", "Play video games", "Boxing"]`.

- [ ] **Step 4: Commit draft script + raw draft JSON for traceability**

```bash
git add scripts/migrate/2026-05-team-detail-split.mjs scripts/migrate/team-detail-draft.json
git commit -m "chore(migrate): generate team-detail draft JSON for human review

Two-phase migration script: --draft generates auto-extracted splits
with _warnings flags for human review; --apply will write revision-
guarded patches once draft is reviewed and alt-pass populated.

Codex feedback #2: regex is warning system, manual review authoritative
for 7 docs. Draft committed for traceability of pre-review state.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Manual review pass on draft JSON

**Files:**
- Modify: `scripts/migrate/team-detail-draft.json`

- [ ] **Step 1: Fix Nebojsa**

In `team-detail-draft.json`, locate `nebojsa-jankovic`:
- Set `qaItems: []` (his bio is single long-form prose, not Q&A).
- Copy `bioParagraphs_legacy[0]` (the long bio text) into the `bio` field on the doc directly. (We'll handle this via a separate field in the apply patch — see below.)
- Remove the warning entry about single-paragraph if Q&A is now empty.

Add to `nebojsa-jankovic` entry: a `bio_replace` field with the long-form bio so the apply step writes it into `bio`:

```json
"bio_replace": "My journey into the world of SEO has been one of perseverance and self-discovery. ..."
```

(Update the apply script accordingly — see Step 4.)

- [ ] **Step 2: Fix Stefan**

In `stefan-cvetkovic`:
- The merged Q in `bioParagraphs_legacy[0]` is `"What do you like the most about your job? And what do you most like about working at Heroic Rankings?"` — split into two Qs.
- Manually craft `qaItems`:

```json
"qaItems": [
  {
    "question": "What do you like the most about your job?",
    "answer": "<answer extracted by reading bioParagraphs_legacy and splitting>"
  },
  {
    "question": "What do you most like about working at Heroic Rankings?",
    "answer": "It's one of the healthiest work environments that I've ever worked in. We're a small company so we can all get to know each other pretty well. Also, I love being enabled to grow, learn, and give a shot at new things."
  }
]
```

- [ ] **Step 3: Verify Srdjan**

In `srdjan-gombar`:
- `spareTimeBullets` should be auto-split as `["Hang out with my son and nephew", "Play video games", "Boxing"]`.
- If the auto-split produced fewer than 3 bullets, manually correct.

- [ ] **Step 4: Update apply script to handle `bio_replace`**

In `scripts/migrate/2026-05-team-detail-split.mjs`, modify the `runApply` patch.set block to optionally replace `bio`:

```js
const patchData = {
  personalTraits: doc.personalTraits || null,
  spareTimeBullets: doc.spareTimeBullets || [],
  qaItems: (doc.qaItems || []).map((q, i) => ({
    _key: `qa-${i}`,
    question: q.question,
    answer: q.answer,
  })),
  lifestylePhotos: (doc.lifestylePhotos || []).map((p, i) => ({
    _key: `photo-${i}`,
    _type: "image",
    asset: { _type: "reference", _ref: p._ref },
    alt: p.alt,
  })),
};
if (typeof doc.bio_replace === "string" && doc.bio_replace.trim()) {
  patchData.bio = doc.bio_replace.trim();
}
const patch = client.patch(doc._id).ifRevisionId(doc._rev).set(patchData);
```

- [ ] **Step 5: Commit reviewed draft**

```bash
git add scripts/migrate/team-detail-draft.json scripts/migrate/2026-05-team-detail-split.mjs
git commit -m "chore(migrate): manual review pass on team-detail draft

- Nebojsa: qaItems = [] (single long-form bio); bio_replace supports
  copying his bioParagraphs[0] into the bio field on apply.
- Stefan: split merged dual-question into two qaItems.
- Srdjan: verified period-jammed bullets parsed to 3 bullets.
- Apply step now honors optional bio_replace.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Vision-drafted alt-text pass

**Files:**
- Modify: `scripts/migrate/team-detail-draft.json` (only `lifestylePhotos[].alt`)

- [ ] **Step 1: Download all photos**

For each member, for each `lifestylePhotos[]` entry, download the image at width 800 to `/tmp/team-alts/<slug>/<index>.jpg`. Use a one-off bash loop reading the draft JSON's `url` fields:

```bash
mkdir -p /tmp/team-alts
node -e "
const draft = require('./scripts/migrate/team-detail-draft.json');
for (const [slug, doc] of Object.entries(draft)) {
  for (const p of doc.lifestylePhotos) {
    console.log(slug, p._index, p.url);
  }
}
" > /tmp/team-alts/manifest.txt

while read slug idx url; do
  mkdir -p "/tmp/team-alts/$slug"
  curl -sL "${url}?w=800" -o "/tmp/team-alts/$slug/$idx.jpg"
done < /tmp/team-alts/manifest.txt

ls -la /tmp/team-alts/*/
```
Expected: ~30 jpgs across 7 slug subdirs.

- [ ] **Step 2: View each photo + draft alt text**

Use the Read tool on each `/tmp/team-alts/<slug>/<idx>.jpg`. For each, draft a scene-accurate alt per pattern:

- **Photo at index 0 (lead)**: full name + role + scene. Example: `"Nebojsa Jankovic, Founder & CEO of Heroic Rankings, in navy blazer outside a white-columned villa"`.
- **Photos at index >= 1**: scene only OR first-name + scene. Examples: `"Wedding portrait against green vines"`, `"Nebojsa at the beach in a green tank top"`, `"Outdoor table with friends, holding a drink"`.

Constraints per alt:
- Max 140 chars (schema validation).
- No "Image of" / "Picture of" prefix.
- Each alt unique within a member's set.
- Name appears at most twice across all photos for one member (avoid keyword stuffing).

- [ ] **Step 3: Write alts back into draft JSON**

Open `scripts/migrate/team-detail-draft.json`, fill in every `lifestylePhotos[i].alt` value with the drafted text.

- [ ] **Step 4: Verify all alts populated**

```bash
node -e "
const draft = require('./scripts/migrate/team-detail-draft.json');
let missing = 0;
for (const [slug, doc] of Object.entries(draft)) {
  for (const p of doc.lifestylePhotos || []) {
    if (!(p.alt || '').trim()) {
      console.log('MISSING', slug, p._index);
      missing++;
    }
  }
}
console.log(missing === 0 ? 'OK — all alts populated' : missing + ' missing');
"
```
Expected: `OK — all alts populated`.

- [ ] **Step 5: Commit alt pass**

```bash
git add scripts/migrate/team-detail-draft.json
git commit -m "chore(migrate): vision-drafted alt-text for 30 team lifestyle photos

Each alt is scene-accurate (~125 chars). Lead photo per member
includes full name + role for branded image search. Subsequent
photos are scene-only or first-name + scene to avoid keyword
stuffing. All unique within member sets.

Nebojsa to optionally upgrade location/event proper nouns post-launch.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Apply migration to production

**Files:**
- Generated: `scripts/migrate/team-detail-pre-apply-snapshot.json`

- [ ] **Step 1: Full dataset export backup**

```bash
npx sanity dataset export production /tmp/sanity-pre-team-split-$(date +%Y%m%d-%H%M).tar.gz
```
Expected: tarball written; size > 0. This is the global rollback.

- [ ] **Step 2: Apply migration**

```bash
SANITY_API_TOKEN=$SANITY_API_TOKEN node scripts/migrate/2026-05-team-detail-split.mjs --apply
```
Expected: prints "Pre-apply snapshot written" + 7 lines "✓ <slug> patched". Exit 0.

If any patch fails with revision mismatch (someone edited the doc in Studio mid-flight), re-run `--draft` to refresh `_rev`, re-apply manual edits, then re-run `--apply`.

- [ ] **Step 3: Verify in Studio**

Open Studio (`pnpm dev` → `/studio`). Open each of the 7 active team members. Confirm:
- New fields populated (`personalTraits`, `spareTimeBullets`, `qaItems`, `lifestylePhotos`).
- Legacy `bioParagraphs` and `cards` fields are now hidden.

- [ ] **Step 4: Commit snapshot**

```bash
git add scripts/migrate/team-detail-pre-apply-snapshot.json
git commit -m "chore(migrate): apply revision-guarded patches to 7 team members

Snapshot of pre-apply state committed for rollback traceability.
Full dataset export also taken at /tmp/sanity-pre-team-split-*.tar.gz.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Add `--shadow-card` token if missing

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Check if token exists**

Run: `grep -n "shadow-card" src/app/globals.css`

If found, skip to Task 8. If not, continue.

- [ ] **Step 2: Add token to `:root` and `@theme`**

In `src/app/globals.css`, add to the `:root` block:

```css
--shadow-card: 0 4px 24px -8px rgb(21 20 25 / 0.08);
```

And register in the `@theme` block to expose as Tailwind utility:

```css
--shadow-card: var(--shadow-card);
```

- [ ] **Step 3: Verify Tailwind compiles**

Run: `pnpm build 2>&1 | tail -10`
Expected: build succeeds, no CSS errors.

- [ ] **Step 4: Commit (only if changed)**

```bash
git add src/app/globals.css
git commit -m "chore(tokens): add --shadow-card for team-detail photo cards

Soft elevated shadow used by lifestyle-photo column on team detail.
Single token, registered in @theme so utilities pick it up.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Rewrite `team-member-detail.tsx`

**Files:**
- Rewrite: `src/components/pages/team/team-member-detail.tsx`
- Test: `src/components/pages/team/__tests__/team-member-detail.test.tsx`

- [ ] **Step 1: Write the failing render test**

Create `src/components/pages/team/__tests__/team-member-detail.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TeamMemberDetail } from "../team-member-detail";

const baseMember = {
  _id: "doc-1",
  name: "Nebojsa Jankovic",
  slug: { current: "nebojsa-jankovic" },
  role: "Founder & CEO",
  department: null,
  photoUrl: "https://cdn.sanity.io/test.jpg",
  photoAlt: "Nebojsa Jankovic portrait",
  photoLqip: undefined,
  cardImageUrl: "https://cdn.sanity.io/test-card.jpg",
  cardImageAlt: "Nebojsa Jankovic",
  cardImageLqip: undefined,
  bio: "My journey into SEO ...",
  bioParagraphs: null,
  personalTraits: "Resilient, dedicated, and ambitious.",
  spareTimeBullets: ["Family time", "Travel", "Marketing trends"],
  qaItems: [],
  lifestylePhotos: [
    { url: "https://cdn.sanity.io/photo-1.jpg", alt: "Lead alt", width: 800, height: 1067, lqip: undefined },
    { url: "https://cdn.sanity.io/photo-2.jpg", alt: "Second alt", width: 1067, height: 800, lqip: undefined },
    { url: "https://cdn.sanity.io/photo-3.jpg", alt: "Third alt", width: 800, height: 1067, lqip: undefined },
    { url: "https://cdn.sanity.io/photo-4.jpg", alt: "Fourth alt", width: 800, height: 1067, lqip: undefined },
    { url: "https://cdn.sanity.io/photo-5.jpg", alt: "Fifth alt", width: 1067, height: 800, lqip: undefined },
  ],
  contact: { email: "info@heroicrankings.com", phone: null },
  socialLinks: [{ platform: "linkedin", url: "https://linkedin.com/in/nebojsa" }],
  createdAt: null,
  updatedAt: null,
};

describe("TeamMemberDetail", () => {
  it("renders name, role, bio, traits, spare-time bullets, photos", () => {
    render(<TeamMemberDetail member={baseMember} />);
    expect(screen.getByRole("heading", { level: 1, name: /Nebojsa Jankovic/ })).toBeTruthy();
    expect(screen.getByText("Founder & CEO")).toBeTruthy();
    expect(screen.getByText(/My journey into SEO/)).toBeTruthy();
    expect(screen.getByText("Resilient, dedicated, and ambitious.")).toBeTruthy();
    expect(screen.getByText("Family time")).toBeTruthy();
    expect(screen.getAllByRole("img").filter((i) => i.getAttribute("alt") !== "Nebojsa Jankovic portrait").length).toBeGreaterThanOrEqual(5);
  });

  it("renders qaItems when present", () => {
    const member = {
      ...baseMember,
      qaItems: [{ question: "What do you do?", answer: "I lead." }],
    };
    render(<TeamMemberDetail member={member} />);
    expect(screen.getByText("What do you do?")).toBeTruthy();
    expect(screen.getByText("I lead.")).toBeTruthy();
  });

  it("falls back to bioParagraphs when qaItems empty and bio missing", () => {
    const member = {
      ...baseMember,
      bio: null,
      qaItems: [],
      bioParagraphs: ["Legacy paragraph 1", "Legacy paragraph 2"],
    };
    render(<TeamMemberDetail member={member} />);
    expect(screen.getByText("Legacy paragraph 1")).toBeTruthy();
    expect(screen.getByText("Legacy paragraph 2")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test --run src/components/pages/team/__tests__/team-member-detail.test.tsx
```
Expected: tests fail (component doesn't yet render new sections).

- [ ] **Step 3: Rewrite `team-member-detail.tsx`**

Replace `src/components/pages/team/team-member-detail.tsx` entirely:

```tsx
import Image from "next/image";
import Link from "next/link";

import { GradientText } from "@/components/ui/gradient-text";
import { ArrowUpRightIcon, LinkedInIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/cn";
import type { SanityTeamMemberDetail } from "@/lib/sanity-data";

const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "X",
  instagram: "Instagram",
  github: "GitHub",
  youtube: "YouTube",
  website: "Website",
};

const SOCIAL_DISPLAY_ORDER = [
  "LinkedIn",
  "X",
  "Instagram",
  "Website",
  "YouTube",
  "GitHub",
];

interface SocialLinkDisplay {
  label: string;
  url: string;
}

function orderSocials(links: SocialLinkDisplay[]): SocialLinkDisplay[] {
  return [...links].sort(
    (a, b) =>
      SOCIAL_DISPLAY_ORDER.indexOf(a.label) -
      SOCIAL_DISPLAY_ORDER.indexOf(b.label),
  );
}

function normalizeRoleLabel(role: string): string {
  return role.replace(/^\/\s*|\s*\/$/g, "").trim();
}

function legacyBioParagraphs(member: SanityTeamMemberDetail): string[] {
  return (member.bioParagraphs ?? [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

interface TeamMemberDetailProps {
  member: SanityTeamMemberDetail;
}

export function TeamMemberDetail({ member }: TeamMemberDetailProps) {
  const roleLabel = normalizeRoleLabel(member.role);
  const cardPhoto = member.cardImageUrl || member.photoUrl;
  const cardPhotoAlt = member.cardImageAlt || member.photoAlt;

  const socials = orderSocials(
    (member.socialLinks ?? [])
      .filter((link) => link.url?.trim().length)
      .map((link) => ({
        label: SOCIAL_PLATFORM_LABELS[link.platform] ?? link.platform,
        url: link.url.trim(),
      })),
  );
  const linkedinUrl = socials.find((s) => s.label === "LinkedIn")?.url;
  const phone = member.contact?.phone?.trim() ?? "";
  const email = member.contact?.email?.trim() ?? "";

  const photos = member.lifestylePhotos ?? [];
  const isStickyEligible = photos.length >= 5;

  const bioBlock = (() => {
    const trimmedBio = member.bio?.trim();
    if (trimmedBio) return [trimmedBio];
    if (member.qaItems.length > 0) return [];
    return legacyBioParagraphs(member);
  })();

  return (
    <article
      className="pb-[100px] pt-[120px] lg:pb-[160px] lg:pt-[183px]"
      id="team-member-detail"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[20px] lg:px-[80px]">
        <div className="mb-[20px] flex items-center justify-between gap-3 lg:mb-[40px]">
          <SectionLabel className="text-left">/ Our Team /</SectionLabel>
          <Link
            aria-label="Back to team"
            className="motion-interactive inline-flex items-center gap-[8px] text-[16px] font-normal leading-[24px] text-[var(--color-hr-grey)] hover:text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse-50)] dark:hover:text-[var(--color-text-inverse)]"
            href="/about-us#about-us-team"
          >
            Back to team
          </Link>
        </div>

        <div className="grid gap-[40px] lg:grid-cols-12 lg:gap-[40px]">
          <div
            className={cn(
              "lg:col-span-7",
              isStickyEligible
                ? "lg:sticky lg:top-[100px] lg:self-start lg:h-fit"
                : "lg:self-start lg:h-fit",
            )}
          >
            <div className="rounded-[var(--radius-card)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] p-[24px] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] lg:p-[60px]">
              {/* Header row: avatar + role + name + LinkedIn */}
              <div className="flex items-start gap-[20px]">
                {cardPhoto ? (
                  <div className="relative size-[80px] shrink-0 overflow-hidden rounded-[20px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]">
                    <Image
                      alt={cardPhotoAlt}
                      className="h-full w-full object-cover"
                      fill
                      priority
                      sizes="80px"
                      src={cardPhoto}
                    />
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[16px] font-normal leading-[24px] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                    {roleLabel || member.role}
                  </p>
                  <h1 className="mt-[6px] text-[28px] leading-[1.15] tracking-[-0.56px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[40px] lg:leading-[1.15] lg:tracking-[-0.8px]">
                    <GradientText className="gradient-text-brand-about-us-popup-name">
                      {member.name}
                    </GradientText>
                  </h1>
                </div>
                {linkedinUrl ? (
                  <a
                    aria-label={`Open ${member.name} on LinkedIn`}
                    className="motion-interactive inline-flex size-[44px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] text-[var(--color-hr-dark)] hover:bg-[var(--color-hr-dark)] hover:text-[var(--color-hr-off-white)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)]"
                    href={linkedinUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <LinkedInIcon className="size-5" />
                  </a>
                ) : null}
              </div>

              <div
                aria-hidden
                className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
              />

              {/* Bio prose */}
              {bioBlock.length > 0 ? (
                <div className="mt-[30px] flex flex-col gap-5 text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                  {bioBlock.map((paragraph, index) => (
                    <p
                      className="whitespace-pre-line"
                      key={`${member._id}-bio-${index}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : null}

              {/* Q&A list */}
              {member.qaItems.length > 0 ? (
                <dl className="mt-[30px] flex flex-col gap-[24px]">
                  {member.qaItems.map((item, index) => (
                    <div
                      className="flex flex-col gap-[8px]"
                      key={`${member._id}-qa-${index}`}
                    >
                      <dt className="text-[16px] font-medium leading-[22px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                        {item.question}
                      </dt>
                      <dd className="text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {member.personalTraits || member.spareTimeBullets.length > 0 ? (
                <div
                  aria-hidden
                  className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
                />
              ) : null}

              {/* Personal traits */}
              {member.personalTraits ? (
                <div className="mt-[30px] flex flex-col gap-[8px]">
                  <h4 className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    Personal traits
                  </h4>
                  <p className="text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                    {member.personalTraits}
                  </p>
                </div>
              ) : null}

              {/* Spare time bullets */}
              {member.spareTimeBullets.length > 0 ? (
                <div className="mt-[24px] flex flex-col gap-[12px]">
                  <h4 className="type-h4 text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)]">
                    Spare time
                  </h4>
                  <ul className="ml-[18px] list-disc text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] dark:text-[var(--color-text-inverse)] lg:text-[18px]">
                    {member.spareTimeBullets.map((bullet, index) => (
                      <li key={`${member._id}-bullet-${index}`}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {phone || email || socials.length > 0 ? (
                <>
                  <div
                    aria-hidden
                    className="mt-[30px] h-px w-full bg-[var(--color-hr-light-grey)] dark:bg-[var(--color-border-inverse-10)] lg:mt-[40px]"
                  />
                  <div className="mt-[24px] flex flex-col gap-[16px]">
                    <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-[var(--color-hr-grey)] dark:text-[var(--color-text-inverse-50)]">
                      Contact
                    </p>
                    <div className="flex flex-wrap gap-[10px]">
                      {phone ? (
                        <ContactPill href={`tel:${phone}`}>{phone}</ContactPill>
                      ) : null}
                      {email ? (
                        <ContactPill href={`mailto:${email}`}>{email}</ContactPill>
                      ) : null}
                      {socials
                        .filter((s) => s.label !== "LinkedIn")
                        .map((social) => (
                          <ContactPill external href={social.url} key={social.label}>
                            {social.label}
                          </ContactPill>
                        ))}
                    </div>
                  </div>
                </>
              ) : null}

              {linkedinUrl ? (
                <a
                  aria-label={`Open ${member.name} on LinkedIn`}
                  className={cn(
                    "motion-interactive motion-interactive-press group mt-[24px] inline-flex w-full items-center justify-between gap-[12px] rounded-[var(--radius-pill)] border border-[var(--color-hr-dark)] bg-[var(--color-hr-dark)] px-[20px] py-[14px] text-[16px] font-medium leading-[24px] text-[var(--color-hr-off-white)]",
                    "hover:bg-transparent hover:text-[var(--color-hr-dark)]",
                    "dark:border-[var(--color-text-inverse)] dark:bg-[var(--color-text-inverse)] dark:text-[var(--color-text-fill-dark)]",
                    "dark:hover:bg-transparent dark:hover:text-[var(--color-text-inverse)]",
                  )}
                  href={linkedinUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Connect on LinkedIn
                  <ArrowUpRightIcon className="size-5" />
                </a>
              ) : null}
            </div>
          </div>

          {photos.length > 0 ? (
            <aside className="lg:col-span-5">
              <ul className="flex flex-col gap-[24px] lg:gap-[40px]">
                {photos.map((photo, index) => {
                  const portrait = (photo.height ?? 1) > (photo.width ?? 1);
                  const offsetClass =
                    index % 2 === 0 ? "lg:ml-0" : "lg:ml-[60px]";
                  return (
                    <li
                      className={cn(
                        offsetClass,
                        "overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]",
                      )}
                      key={`${member._id}-photo-${index}`}
                    >
                      <Image
                        alt={photo.alt}
                        className={cn(
                          "h-full w-full object-cover",
                          portrait ? "aspect-[3/4]" : "aspect-[4/3]",
                        )}
                        height={photo.height ?? 800}
                        priority={index === 0}
                        loading={index === 0 ? undefined : "lazy"}
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        src={photo.url}
                        width={photo.width ?? 1067}
                      />
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ContactPill({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const pillClass =
    "inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-hr-light-grey)] bg-[var(--color-hr-off-white)] px-[16px] py-[8px] text-[16px] font-normal leading-[24px] text-[var(--color-hr-dark)] transition-colors hover:bg-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)] dark:bg-[var(--color-bg-dark)] dark:text-[var(--color-text-inverse)] dark:hover:bg-[var(--color-surface-inverse-20)]";
  return (
    <a
      className={pillClass}
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}
```

If `LinkedInIcon` is not exported from `src/components/ui/icons`, replace with the inline SVG already used in the popup, or fall back to the `ArrowUpRightIcon` for the avatar-row LinkedIn button.

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test --run src/components/pages/team/__tests__/team-member-detail.test.tsx
```
Expected: 3 tests pass.

- [ ] **Step 5: Run full lint + tsc + tests + build**

```bash
pnpm lint
npx tsc --noEmit
pnpm test --run
pnpm build
```
Expected: all clean. Build succeeds.

- [ ] **Step 6: Visual check at 4 viewports**

Start dev server, visit each viewport via browser:
```bash
pnpm dev
```
Verify `/team/nebojsa-jankovic` (most photos), `/team/una-stanojevic` (3 photos — non-sticky), `/team/srdjan-gombar` (period-jammed bullets corrected) at 1440, 1024, 768, 375 widths. Check:
- Bio card sticky for Nebojsa, non-sticky for Una.
- Photo zigzag stagger visible at ≥1024px.
- Mobile stack works at 375.
- All tokens render correctly in light + dark mode.

- [ ] **Step 7: Commit**

```bash
git add src/components/pages/team/team-member-detail.tsx src/components/pages/team/__tests__/team-member-detail.test.tsx
git commit -m "feat(team): rewrite /team/[slug] with legacy structure + new design language

Bio card (sticky if photos>=5) holds avatar + gradient name + role +
bio + qaItems + personalTraits + spareTimeBullets + contact pills +
LinkedIn CTA. Right column = lifestyle photos in zigzag stagger
(odd ml-0, even ml-[60px]) on >=1024px, aspect-aware (3/4 portrait
vs 4/3 landscape).

Mobile: single-column stack, non-sticky, photos below card.

Reads new structured fields (qaItems, personalTraits, spareTimeBullets,
lifestylePhotos). Falls back to bioParagraphs[] verbatim when both
bio and qaItems empty (transitional safety net for unmigrated docs).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Wire breadcrumb on team route

**Files:**
- Modify: `src/app/(site)/(pages)/team/[slug]/page.tsx`

- [ ] **Step 1: Import + render `BreadcrumbSchema`**

In `src/app/(site)/(pages)/team/[slug]/page.tsx`, add the import and render alongside `PersonSchema`:

```tsx
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
```

In the JSX return:

```tsx
<>
  <Suspense fallback={null}>
    <BreadcrumbSchema
      items={[
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about-us" },
        { name: member.name, href: `/team/${slug}` },
      ]}
    />
    <PersonSchema
      // existing props
    />
  </Suspense>
  <TeamMemberDetail member={member} />
</>
```

- [ ] **Step 2: Verify JSON-LD renders**

Run dev server, visit `/team/nebojsa-jankovic`, view source. Search for `"BreadcrumbList"`. Expected: payload renders with 3 items (Home, About Us, Nebojsa Jankovic).

- [ ] **Step 3: tsc + build**

```bash
npx tsc --noEmit
pnpm build
```
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(site\)/\(pages\)/team/\[slug\]/page.tsx
git commit -m "feat(team): wire BreadcrumbSchema on team detail route

Home > About Us > {Member Name}. Strengthens entity SEO + Google
sitelinks for branded queries. Codex G4 finding (component existed,
just unwired on this route).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Per-member OG image

**Files:**
- Create: `src/app/(site)/(pages)/team/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Inspect existing global OG**

Run: `cat src/app/opengraph-image.tsx 2>/dev/null || echo "missing"`. Note the design pattern (gradient bg, centered text, font, size).

If no existing per-route OG examples, the simplest baseline is the Next.js `ImageResponse` API.

- [ ] **Step 2: Write the team-member OG handler**

Create `src/app/(site)/(pages)/team/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

import { getTeamMemberBySlug } from "@/lib/sanity-data";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Heroic Rankings team profile";

export default async function TeamMemberOg({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = await getTeamMemberBySlug(slug);
  const name = member?.name ?? "Heroic Rankings";
  const role = member?.role ? member.role.replace(/^\/\s*|\s*\/$/g, "").trim() : "";
  const photo = member?.cardImageUrl || member?.photoUrl || null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#F4F4F4",
          fontFamily: "DM Sans, sans-serif",
          padding: 80,
          gap: 60,
          alignItems: "center",
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            height={470}
            src={photo}
            style={{
              borderRadius: 32,
              objectFit: "cover",
              border: "1px solid #E0E0E0",
            }}
            width={350}
          />
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {role ? (
            <div style={{ fontSize: 28, color: "#535353" }}>/ {role} /</div>
          ) : null}
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.1,
              color: "#151419",
              letterSpacing: -1.76,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 28, color: "#535353", marginTop: 24 }}>
            heroicrankings.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 3: Verify OG generates**

Build:
```bash
pnpm build
```

Visit dev server `/team/nebojsa-jankovic/opengraph-image`. Expected: 1200×630 PNG with photo + name + role.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(site\)/\(pages\)/team/\[slug\]/opengraph-image.tsx
git commit -m "feat(team): per-member OG image via Next ImageResponse

Codex G3 finding — was falling back to global /opengraph-image.
Now /team/[slug] gets its own 1200x630 with member photo + name + role.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Popup → full-profile link

**Files:**
- Modify: `src/components/sections/team-member-popup.tsx`

- [ ] **Step 1: Locate the popup body close to the bottom**

Find the desktop popup body — there should be a section near the existing "Save to Contacts" button or at the end of the bio body. Read lines around the existing nav arrows (the `Next` / `Previous` controls).

Run: `grep -n "Save to Contacts\|Next\|Previous\|className.*footer" src/components/sections/team-member-popup.tsx`

- [ ] **Step 2: Add "Read full profile →" link near close**

In the desktop popup, immediately after the bio body (before the prev/next arrows), insert:

```tsx
{member.slug ? (
  <Link
    aria-label={`Read full profile for ${member.name}`}
    className="motion-interactive mt-[20px] inline-flex items-center gap-[8px] text-[16px] font-medium leading-[24px] text-[var(--color-hr-dark)] underline-offset-4 hover:underline dark:text-[var(--color-text-inverse)]"
    href={`/team/${member.slug}`}
  >
    Read full profile
    <ArrowUpRightIcon className="size-4" aria-hidden />
  </Link>
) : null}
```

(Add the `Link` and `ArrowUpRightIcon` imports if not already present.)

In the mobile variant (`TeamMemberPopupMobile`), add the same link below the bio block before the bottom contact tile.

- [ ] **Step 3: Verify popup type has `slug`**

Open `src/components/sections/team-member-popup.tsx` (top of file) and confirm the `member` shape has a `slug` field. If not, add it to whichever data type the popup is fed and propagate from `about-us-team-data` / Sanity mapper.

- [ ] **Step 4: Lint + tsc**

```bash
pnpm lint
npx tsc --noEmit
```
Expected: clean.

- [ ] **Step 5: Visual check**

`pnpm dev`, visit `/about-us`, click any member card. Expected: popup opens, "Read full profile" link visible. Click → navigates to `/team/<slug>`.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/team-member-popup.tsx
git commit -m "feat(team): popup -> full profile link

Adds 'Read full profile' link inside team popup (desktop + mobile)
linking to /team/[slug]. Popup stays the quick-browse surface;
full route is the destination.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Final verification + push

- [ ] **Step 1: Full lint + tsc + tests + build**

```bash
pnpm lint && npx tsc --noEmit && pnpm test --run && pnpm build
```
Expected: every step exits 0.

- [ ] **Step 2: Visual sweep**

Run `pnpm dev`, walk through:
- `/about-us` — popup loads, "Read full profile" link works.
- `/team/nebojsa-jankovic` (6 photos, sticky), `/team/anastasija-jankovic` (5 photos, sticky), `/team/una-stanojevic` (3 photos, non-sticky), `/team/srdjan-gombar` (3 photos, period-jammed bullets corrected).
- Each member at 1440, 1024, 768, 375 widths.
- Light + dark mode.
- LinkedIn CTA opens correctly.
- Photos load progressively (LCP = lead photo only).

- [ ] **Step 3: SEO smoke**

Visit each `/team/<slug>` page source. Confirm:
- `<title>` includes name + role.
- BreadcrumbList JSON-LD present.
- ProfilePage JSON-LD present.
- OG image URL points to `/team/<slug>/opengraph-image`.
- Sitemap at `/sitemap.xml` includes 7 `/team/<slug>` URLs.

- [ ] **Step 4: Push branch**

```bash
git push -u origin worktree-team-detail-legacy-style
```

- [ ] **Step 5: Open PR**

```bash
gh pr create --title "feat(team): legacy-style /team/[slug] with structured fields + Codex gaps closed" --body "$(cat <<'EOF'
## Summary
- Restructures `/team/[slug]` to match legacy heroicrankings.com content density (bio + Q&A + traits + spare-time bullets + lifestyle photo column) styled with new design tokens.
- Adds `personalTraits`, `spareTimeBullets`, `qaItems`, `lifestylePhotos` to `teamMember` schema.
- Migrates 7 active members via revision-guarded patches with human-in-the-loop JSON review.
- Closes Codex stress-test gaps: GROQ/types now project new fields (G1), sitemap query filters `showOnAboutPage` (G2), per-member OG image (G3), breadcrumb JSON-LD wired (G4).
- Legacy `bioParagraphs` and `cards` stay hidden+readOnly one release before deletion.

## Test plan
- [x] `pnpm lint && npx tsc --noEmit && pnpm test --run && pnpm build` all pass
- [x] Visual at 1440/1024/768/375, light + dark, all 7 members
- [x] Sticky bio card only when photos>=5 (Una/Srdjan non-sticky)
- [x] Photo zigzag stagger renders at >=1024px
- [x] Sitemap includes 7 visible team URLs, no hidden members leak
- [x] BreadcrumbList JSON-LD on each member page
- [x] Per-member OG image renders at /team/<slug>/opengraph-image
- [x] Popup "Read full profile" link navigates correctly

## Follow-up (next release)
- Remove legacy `bioParagraphs` + `cards` schema fields after parity verified in production.
- Optional content pass: Nebojsa upgrades photo alts with location/event proper nouns.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**1. Spec coverage** (cross-checked against design doc EARS 1–11):
- EARS 1 (render route per member) — Tasks 8, 9 (component + breadcrumb).
- EARS 2 (full content blocks + breadcrumb) — Tasks 8, 9.
- EARS 3 (sticky on >=5 photos) — Task 8 Step 3 (`isStickyEligible`).
- EARS 4 (non-sticky <5) — Task 8 Step 3 (else branch).
- EARS 5 (mobile stack) — Task 8 Step 3 (single-col grid + Step 6 visual).
- EARS 6 (tokens only) — Task 7 (`--shadow-card`) + Task 8 (component uses only `--color-hr-*`, `--radius-*`, `--shadow-*`).
- EARS 7 (alt validation + migration refusal) — Task 1 (schema `validation.required()` on alt), Task 3 (apply refuses empty alts).
- EARS 8 (qaItems fallback to bioParagraphs) — Task 8 component `bioBlock` fallback chain + test.
- EARS 9 (popup → full-profile link) — Task 11.
- EARS 10 (per-member OG) — Task 10.
- EARS 11 (sitemap filter) — Task 2 Step 2.

**2. Placeholder scan** — none.

**3. Type consistency:**
- `SanityTeamMember.lifestylePhotos` shape matches GROQ projection (`url, alt, width, height, lqip`).
- Component renders `member.qaItems` (always array, never null) — `mapTeamMember` filter guarantees this.
- Migration `lifestylePhotos[].alt` empty check matches schema validation.

---
