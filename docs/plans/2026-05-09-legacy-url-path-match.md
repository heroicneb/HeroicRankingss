# Legacy URL Path Match — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename 12 new-site routes so URL paths literally match the legacy heroicrankings.com site. Drop most redirects (only keep slug-change for `/case-study/number-artist/` → `/case-study/diy-craft-ecom-brand/`). Per Nebojsa's request 2026-05-09.

**Architecture:** Atomic phases — one route family per phase, one commit per phase, dev-server smoke after each. `next.config.ts` `trailingSlash: true` so URLs match legacy `/path/` exactly. Component folder names under `src/components/pages/` stay as-is (internal — not user-facing). Only ROUTE folders under `src/app/(site)/(pages)/` rename. `src/lib/site.ts` URL constants update to reflect new paths.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, Sanity CMS (presentation tool preview pane resolver in `src/sanity/presentation/resolve.ts` must follow), TypeScript.

**Inventory (current → legacy match):**

| Current | Legacy match | Folder rename |
|---|---|---|
| `/insights` | `/blog/` | `(pages)/insights/` → `(pages)/blog/` |
| `/insights/[slug]` | `/blog/[slug]/` | nested under above |
| `/case-studies` | `/case-study/` | `(pages)/case-studies/` → `(pages)/case-study/` |
| `/case-studies/[slug]` | `/case-study/[slug]/` | nested |
| `/about-us` | `/about/` | `(pages)/about-us/` → `(pages)/about/page.tsx` (merge) |
| `/team/[slug]` | `/about/[slug]/` | `(pages)/team/[slug]/` → `(pages)/about/[slug]/` |
| `/seo-services` | `/seo/` | `(pages)/seo-services/page.tsx` → `(pages)/seo/page.tsx` |
| `/technical-seo` | `/seo/technical/` | merge under `seo/` parent |
| `/on-page-seo` | `/seo/on-page/` | merge under `seo/` |
| `/local-seo` | `/seo/local/` | merge under `seo/` |
| `/keyword-strategy` | `/seo/keyword-research/` | merge under `seo/` (note slug change too) |
| `/content-creation` | `/seo/content-creation/` | merge under `seo/` |
| `/ecommerce-seo` | `/seo/e-commerce/` | merge under `seo/` (note slug change) |
| `/link-building` | `/seo/linkbuilding/` | merge under `seo/` (note slug change) |

Routes that stay unchanged: `/`, `/contact`, `/partnership`, `/privacy-policy`, `/podcast`, `/podcast/[slug]`.

**Inventory totals (Python grep, 2026-05-09):**

| Path | src/ href hits | docs+scripts hits |
|---|---:|---:|
| /insights | 35 | 211 |
| /case-studies | 60 | 139 |
| /about-us | 36 | 64 |
| /team | 27 | 125 |
| /link-building | 37 | 87 |
| /technical-seo | 31 | 67 |
| /on-page-seo | 28 | 64 |
| /local-seo | 25 | 59 |
| /keyword-strategy | 24 | 58 |
| /content-creation | 28 | 102 |
| /ecommerce-seo | 26 | 59 |
| /seo-services | 33 | 101 |

Most docs/scripts hits are component file paths (e.g. `src/components/pages/about-us/`) — those stay.

---

## Phase 0 — Preparation

### Task 0.1: Verify clean working tree

**Step 1: Confirm git status**

Run: `git status --short`
Expected: only untracked artifacts (.claude/, audit screenshots, etc), no staged or unstaged source changes.

**Step 2: Confirm latest origin/main**

Run: `git fetch origin main && git log --oneline origin/main..HEAD HEAD..origin/main`
Expected: empty output both sides (in sync).

### Task 0.2: Configure `trailingSlash: true`

**Files:**
- Modify: `next.config.ts`

**Step 1: Read current config**

Run: `grep -n trailingSlash next.config.ts || echo "absent"`
Expected: `absent` (we'll add it).

**Step 2: Edit `next.config.ts`** — add `trailingSlash: true` to the top-level config object.

**Step 3: Boot dev server, verify**

Run: `PORT=3030 pnpm dev` (background)
Run: `curl -sI http://localhost:3030/contact | grep -iE "^location|^HTTP"`
Expected: 308 redirect from `/contact` to `/contact/`.

**Step 4: Commit**

```bash
git add next.config.ts
git commit -m "chore(routing): enable trailingSlash for legacy URL parity"
```

---

## Phase 1 — Service category renames (largest, do first)

### Task 1.1: Create `seo/` parent route folder

**Files:**
- Create: `src/app/(site)/(pages)/seo/layout.tsx` (passthrough — only if needed for nested routing; verify Next 16 doesn't require)

**Step 1: Move `seo-services/page.tsx` → `seo/page.tsx`**

Run: `git mv 'src/app/(site)/(pages)/seo-services' 'src/app/(site)/(pages)/seo'`

**Step 2: Boot dev, verify `/seo/` renders**

Run: `curl -sI http://localhost:3030/seo/`
Expected: HTTP 200.

### Task 1.2: Move technical-seo under seo/

**Step 1:** `git mv 'src/app/(site)/(pages)/technical-seo' 'src/app/(site)/(pages)/seo/technical'`
**Step 2:** Verify `/seo/technical/` renders → 200.

### Task 1.3: Move on-page-seo under seo/

**Step 1:** `git mv 'src/app/(site)/(pages)/on-page-seo' 'src/app/(site)/(pages)/seo/on-page'`
**Step 2:** Verify `/seo/on-page/` → 200.

### Task 1.4: Move local-seo under seo/

**Step 1:** `git mv 'src/app/(site)/(pages)/local-seo' 'src/app/(site)/(pages)/seo/local'`
**Step 2:** Verify `/seo/local/` → 200.

### Task 1.5: Move keyword-strategy under seo/ (slug rename)

**Step 1:** `git mv 'src/app/(site)/(pages)/keyword-strategy' 'src/app/(site)/(pages)/seo/keyword-research'`
**Step 2:** Verify `/seo/keyword-research/` → 200.

### Task 1.6: Move content-creation under seo/

**Step 1:** `git mv 'src/app/(site)/(pages)/content-creation' 'src/app/(site)/(pages)/seo/content-creation'`
**Step 2:** Verify `/seo/content-creation/` → 200.

### Task 1.7: Move ecommerce-seo under seo/ (slug rename)

**Step 1:** `git mv 'src/app/(site)/(pages)/ecommerce-seo' 'src/app/(site)/(pages)/seo/e-commerce'`
**Step 2:** Verify `/seo/e-commerce/` → 200.

### Task 1.8: Move link-building under seo/ (slug rename)

**Step 1:** `git mv 'src/app/(site)/(pages)/link-building' 'src/app/(site)/(pages)/seo/linkbuilding'`
**Step 2:** Verify `/seo/linkbuilding/` → 200.

### Task 1.9: Update internal href strings for SEO routes

**Files:**
- Modify: any `*.tsx` / `*.ts` in `src/` containing `href="/seo-services"`, `href="/technical-seo"`, etc.
- Modify: `src/lib/site.ts` if it has SEO URL constants.
- Modify: `src/components/sections/services-grid*.tsx` (likely lists service hrefs).
- Modify: navbar SEO dropdown menu items (`src/components/layout/navbar.tsx`).
- Modify: footer service links (`src/components/layout/footer.tsx`).

**Step 1: Grep all old SEO paths**

Run:
```bash
python3 -c "
import subprocess, re
paths = [
  ('/seo-services', '/seo'),
  ('/technical-seo', '/seo/technical'),
  ('/on-page-seo', '/seo/on-page'),
  ('/local-seo', '/seo/local'),
  ('/keyword-strategy', '/seo/keyword-research'),
  ('/content-creation', '/seo/content-creation'),
  ('/ecommerce-seo', '/seo/e-commerce'),
  ('/link-building', '/seo/linkbuilding'),
]
for old, new in paths:
    out = subprocess.run(['grep', '-rln', f'href=\"{old}\"', 'src/'], capture_output=True, text=True).stdout
    if out:
        print(f'OLD {old} → NEW {new}')
        print(out)
"
```

**Step 2: Replace each old href with new href.** Use `sed -i ''` per file or `Edit` tool per occurrence. For each file containing a hit, run:

```bash
sed -i '' 's|href="/seo-services"|href="/seo"|g; s|href="/technical-seo"|href="/seo/technical"|g; s|href="/on-page-seo"|href="/seo/on-page"|g; s|href="/local-seo"|href="/seo/local"|g; s|href="/keyword-strategy"|href="/seo/keyword-research"|g; s|href="/content-creation"|href="/seo/content-creation"|g; s|href="/ecommerce-seo"|href="/seo/e-commerce"|g; s|href="/link-building"|href="/seo/linkbuilding"|g' "$file"
```

**Step 3: Re-grep — confirm no stale references in `src/`**

Run: `grep -rE 'href="(/seo-services|/technical-seo|/on-page-seo|/local-seo|/keyword-strategy|/content-creation|/ecommerce-seo|/link-building)' src/ || echo "clean"`
Expected: `clean`.

**Step 4: Browser test all 8 service routes**

Visit each new URL in dev. Confirm renders match before-rename baseline.

**Step 5: Lint + typecheck**

```bash
NODE_OPTIONS=--max-old-space-size=8192 npx eslint 'src/components/sections/services*.tsx' 'src/components/layout/navbar.tsx' 'src/components/layout/footer.tsx' 'src/components/pages/seo*/'
npx tsc --noEmit
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat(routing): nest service pages under /seo/ to match legacy URL paths"
```

---

## Phase 2 — Content sections (insights → blog, case-studies → case-study)

### Task 2.1: Rename insights → blog

**Step 1:** `git mv 'src/app/(site)/(pages)/insights' 'src/app/(site)/(pages)/blog'`

**Step 2: Update internal href strings**

```bash
grep -rln 'href="/insights"' src/ | xargs sed -i '' 's|href="/insights"|href="/blog"|g'
grep -rln 'href="/insights/' src/ | xargs sed -i '' 's|href="/insights/|href="/blog/|g'
grep -rln '`/insights/' src/ | xargs sed -i '' 's|`/insights/|`/blog/|g'
```

**Step 3: Update `src/lib/site.ts` if it has an INSIGHTS_URL constant**

Read first; replace with `BLOG_URL` or rename in place to `/blog`.

**Step 4: Update `src/app/sitemap.ts`** — replace `/insights` literals with `/blog`.

**Step 5: Update Sanity preview resolver `src/sanity/presentation/resolve.ts`** — `post` document type preview path changes to `/blog/${slug}/`.

**Step 6: Browser test `/blog/`, `/blog/<known-slug>/`**

**Step 7: Lint + typecheck + commit**

```bash
git add -A
git commit -m "feat(routing): /insights → /blog to match legacy paths"
```

### Task 2.2: Rename case-studies → case-study

**Step 1:** `git mv 'src/app/(site)/(pages)/case-studies' 'src/app/(site)/(pages)/case-study'`

**Step 2: Update internal hrefs**

```bash
grep -rln 'href="/case-studies"' src/ | xargs sed -i '' 's|href="/case-studies"|href="/case-study"|g'
grep -rln 'href="/case-studies/' src/ | xargs sed -i '' 's|href="/case-studies/|href="/case-study/|g'
grep -rln '`/case-studies/' src/ | xargs sed -i '' 's|`/case-studies/|`/case-study/|g'
```

**Step 3: Update sitemap.ts, presentation/resolve.ts, lib/site.ts**

**Step 4: Update existing redirect in `next.config.ts`** — keep the `/case-studies/number-artist` → `/case-studies/diy-craft-ecom-brand` redirect but rewrite source/destination to `/case-study/...`.

**Step 5: Browser test `/case-study/`, `/case-study/affinda/`**

**Step 6: Lint + typecheck + commit**

```bash
git add -A
git commit -m "feat(routing): /case-studies → /case-study to match legacy paths"
```

---

## Phase 3 — People (about-us + team merge into about)

### Task 3.1: Merge about-us + team under `/about/`

This is the trickiest because two separate folders merge into one.

**Step 1:** `git mv 'src/app/(site)/(pages)/about-us' 'src/app/(site)/(pages)/about'`

**Step 2: Move team[slug] into about/[slug]**

`git mv 'src/app/(site)/(pages)/team/[slug]' 'src/app/(site)/(pages)/about/[slug]'`

**Step 3: Verify `team/` folder is now empty, remove**

`rmdir 'src/app/(site)/(pages)/team' 2>/dev/null || ls 'src/app/(site)/(pages)/team'`

If non-empty (e.g. team/loading.tsx), git mv each remaining file into about/ first.

**Step 4: Update internal hrefs**

```bash
grep -rln 'href="/about-us"' src/ | xargs sed -i '' 's|href="/about-us"|href="/about"|g'
grep -rln 'href="/about-us/' src/ | xargs sed -i '' 's|href="/about-us/|href="/about/|g'
grep -rln 'href="/team/' src/ | xargs sed -i '' 's|href="/team/|href="/about/|g'
grep -rln '`/team/' src/ | xargs sed -i '' 's|`/team/|`/about/|g'
```

**Step 5: Update presentation/resolve.ts** — `teamMember` preview path → `/about/${slug}/`.

**Step 6: Update sitemap + JSON-LD breadcrumbs in team-member-detail.tsx**

**Step 7: Browser test `/about/`, `/about/nebojsa-jankovic/`**

**Step 8: Lint + typecheck + commit**

```bash
git add -A
git commit -m "feat(routing): merge /about-us + /team/[slug] into /about/[slug] to match legacy paths"
```

---

## Phase 4 — Final wiring

### Task 4.1: Audit `src/lib/site.ts` URL constants

**Files:**
- Modify: `src/lib/site.ts`

**Step 1: Read it; identify any URL constants**
**Step 2: Update each to new path**
**Step 3: Run any test that imports from site.ts** — if test file exists, run `npx vitest run path/to/test`.

### Task 4.2: Audit scripts URL fixtures

**Files:**
- Modify: `scripts/audit/render-audit.mjs`
- Modify: `scripts/audit/verify-redirects.mjs`
- Modify: `scripts/audit/case-study-coverage.mjs`
- Modify: `scripts/audit/post-migration-audit.mjs`
- Modify: `scripts/audit/figma-alignment-capture.mjs`

**Step 1: Grep each script for old paths**

```bash
grep -rE '(/case-studies|/insights|/about-us|/team|/seo-services|/technical-seo|/on-page-seo|/local-seo|/keyword-strategy|/content-creation|/ecommerce-seo|/link-building)' scripts/audit/
```

**Step 2: Replace per file**

### Task 4.3: Update redirect map

**Files:**
- Modify: `docs/migration/redirect-map.md`
- Modify: `next.config.ts` redirects() array

**Step 1: Edit redirect-map.md** — rewrite section "Static page redirects" to note that legacy paths now map identity (no redirect). Keep:
- `/case-study/number-artist/` → `/case-study/diy-craft-ecom-brand/` (slug rename within same path namespace)
- `/blog/:slug/` and `/seo/managed/:slug/` patterns IF blog post slug structure differs — but since `/blog/` now matches, only `/seo/managed/:slug/` needs a redirect to `/blog/:slug/`.

**Step 2: Edit next.config.ts redirects() array** to match.

### Task 4.4: Final verification sweep

**Step 1: Boot dev clean**

`PORT=3030 pnpm dev`

**Step 2: Browser-test the 12 renamed routes**

Run via Playwright OR manually:
- `/seo/` → 200
- `/seo/technical/` → 200
- `/seo/on-page/` → 200
- `/seo/local/` → 200
- `/seo/keyword-research/` → 200
- `/seo/content-creation/` → 200
- `/seo/e-commerce/` → 200
- `/seo/linkbuilding/` → 200
- `/blog/` → 200
- `/blog/<known-slug>/` → 200
- `/case-study/` → 200
- `/case-study/affinda/` → 200
- `/about/` → 200
- `/about/nebojsa-jankovic/` → 200

**Step 3: Curl test the legacy slug-only redirects still work**

```bash
curl -sI http://localhost:3030/case-study/number-artist/ | grep -iE "^location|^HTTP"
# Expected: 308 redirect to /case-study/diy-craft-ecom-brand/

curl -sI http://localhost:3030/seo/managed/best-ahrefs-alternatives/ | grep -iE "^location|^HTTP"
# Expected: 308 redirect to /blog/best-ahrefs-alternatives/
```

**Step 4: Production build**

`pnpm build` — confirm no broken internal links cause build to fail.

**Step 5: Final lint + typecheck**

```bash
NODE_OPTIONS=--max-old-space-size=8192 pnpm lint || true   # baseline noisy, only check our files
npx tsc --noEmit
```

**Step 6: Commit any lingering changes**

```bash
git add -A
git commit -m "chore(routing): final sweep — audit scripts + redirect map + sitemap aligned to legacy paths"
```

---

## Phase 5 — Push + content task handoff

### Task 5.1: Push

```bash
git push origin main
```

Vercel auto-builds. Confirm production renders all 14 routes.

### Task 5.2: Update CHATBOT_INTEGRATION.md if it references paths

`grep -E '/podcast|/insights|/case-studies' docs/CHATBOT_INTEGRATION.md` — if hits, update.

### Task 5.3: Heads-up to Pavle/Nebojsa

The Sanity Studio preview-pane URLs now resolve to legacy-matching paths automatically. No editor action needed beyond previewing.

---

## Risk register

| Risk | Mitigation |
|---|---|
| External backlinks to old new-site paths break | Old new-site paths weren't published in production search yet (still on legacy domain). Internal links updated above. |
| Stale `Link href=` in component file we missed | Phase 4.4 grep sweep + browser test 14 routes |
| Sanity preview pane mis-resolves | Phase 2 task 2.1 + 2.2 + 3.1 explicitly update `src/sanity/presentation/resolve.ts` |
| Sitemap.xml emits stale paths | sitemap.ts updated per phase |
| Trailing-slash collisions with existing redirects() rules | Phase 0 enables flag; subsequent rules verified in Phase 4.3 |
| Build failures from importing renamed route segments | Component imports use `@/components/pages/<name>/` — those paths unchanged. Only `app/(site)/(pages)/` paths move. |

## Rollback plan

If any phase breaks dev or build:

```bash
git reset --hard HEAD~1   # undo last phase commit
PORT=3030 pnpm dev         # confirm restore
```

Each phase = single commit so rollback is granular.

## Done criteria

- All 14 routes under `src/app/(site)/(pages)/` match the legacy heroicrankings.com structure.
- `next.config.ts` has `trailingSlash: true` and a minimal redirects() (only slug renames + per-blog-category redirects).
- `pnpm build` succeeds.
- `npx tsc --noEmit` clean.
- 14 browser smoke tests at `localhost:3030` pass.
- Production deploy renders without errors.
- `docs/migration/redirect-map.md` reflects the new minimal redirect surface.
