# Figma Parity Finalization Plan (2026-04-15)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring every user-facing page to pixel-perfect parity with the Figma source of truth (file key `iIVCGkNIrd9sc6j9NKmGIF`), fix all issues flagged in the 2026-04-15 Nejsa review, wire Sanity CMS where applicable, and pass a senior-developer bar at 1440/1024/768/375 light+dark across all pages.

**Architecture:**
- **Figma MCP** (`mcp__Figma__*`) is the authoritative design source — use `get_metadata` → `get_design_context` → `get_variable_defs` → `get_screenshot` per node.
- **Sequential page-by-page gate.** One page is fully verified before the next starts. This prevents shared-shell regressions and keeps context small.
- **Per page, per section** workflow (non-negotiable): EXTRACT → AUDIT → FIX → VERIFY → COMMIT (see Phase 0.3 for the exact recipe).
- **Playwright visual diff** at four breakpoints (1440/1024/768/375) both light + dark is the mandatory gate before marking a page done.
- **Sanity CMS** is already wired with graceful fallbacks. Layout fixes land first, then CMS content seeding (Phase 21).

**Tech Stack:** Next.js 16.1 (App Router, React 19, Turbopack) · Tailwind CSS v4 · Sanity 4 (project `5cr26y9m`, dataset `production`) · Playwright · Figma Remote MCP · Vitest · Codex CLI

**Figma file key:** `iIVCGkNIrd9sc6j9NKmGIF`

**Sources driving this plan:**
- `/Users/pavle/Downloads/Homepage.docx` (Nejsa written feedback — 2026-04-15)
- `/tmp/homepage_docx_text.txt` (docx text extraction)
- `/Users/pavle/Downloads/video-extraction.md` (video review extraction — 149 frames, Serbian narration)
- `docs/figma-cache/extractions/*` (prior Figma extractions, 2026-04-03)
- `docs/FIGMA_1_TO_1_WORKFLOW.md` (team's mandatory per-section workflow)

---

## Page Order (strict sequential gate)

| # | Page | Route | Figma Node | Priority |
|---|------|-------|------------|----------|
| 0 | Infrastructure | n/a | n/a | P0 |
| 1 | Shared Shell (Navbar + Footer + tokens) | shell | `554:2310` (footer) | P0 |
| 2 | Homepage | `/` | `702:10152` | P0 |
| 3 | About Us | `/about-us` | `189:5` | P1 |
| 4 | SEO Services Hub | `/seo-services` | `203:1361` | P1 |
| 5 | Link Building | `/link-building` | `246:2` | P1 |
| 6 | On-Page SEO | `/on-page-seo` | `230:372` | P2 |
| 7 | Technical SEO | `/technical-seo` | `222:243` | P2 |
| 8 | Local SEO | `/local-seo` | `233:728` | P2 |
| 9 | Content Creation | `/content-creation` | `233:1412` | P2 |
| 10 | E-commerce SEO | `/ecommerce-seo` | `240:2` | P2 |
| 11 | Keyword Strategy | `/keyword-strategy` | `233:1084` | P2 |
| 12 | Partnership | `/partnership` | `247:345` | P2 |
| 13 | Insights (hub + detail) | `/insights`, `/insights/[slug]` | `248:1541` | P1 |
| 14 | Case Studies (hub + detail) | `/case-studies`, `/case-studies/[slug]` | `248:1917` | P2 |
| 15 | Podcast (hub + detail) | `/podcast`, `/podcast/[slug]` | (new frames [89], [88]) | P1 |
| 16 | Contact | `/contact` | `249:2227` | P2 |
| 17 | Privacy Policy | `/privacy-policy` | TBD | P3 |
| 18 | Team detail | `/team/[slug]` | TBD | P3 |
| 19 | CMS content seeding | (all CMS-bound routes) | n/a | P1 |
| 20 | Perf / Lighthouse / Codex audit | all | n/a | P2 |

P0 = blocks launch. P1 = must ship before client sign-off. P2 = should ship. P3 = nice-to-have polish.

---

## Required Skills

- `superpowers:executing-plans` — drive task-by-task execution
- `superpowers:subagent-driven-development` — for per-page parallelism within a phase
- `superpowers:test-driven-development` — for all content/structure tests
- `superpowers:verification-before-completion` — mandatory gate before marking any task done
- `webapp-testing` — Playwright visual checks
- `gitnexus-impact-analysis` — before any shared-shell change

---

## Phase 0 — Infrastructure

### Task 0.1: Master parity tracker

**Files:**
- Create: `docs/audit/2026-04-15-figma-parity-tracker.md`
- Create: `docs/audit/reports/` (directory)
- Create: `docs/audit/screenshots/` (directory)

**Step 1: Create tracker document**

Create `docs/audit/2026-04-15-figma-parity-tracker.md`:

```markdown
# Figma Parity Tracker — 2026-04-15

| Page | Node | 1440 | 1024 | 768 | 375 | Dark | a11y | Status |
|------|------|------|------|------|------|------|------|--------|
| Shell | 554:2310 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Homepage | 702:10152 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| About Us | 189:5 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| SEO Services | 203:1361 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Link Building | 246:2 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| On-Page SEO | 230:372 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Technical SEO | 222:243 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Local SEO | 233:728 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Content Creation | 233:1412 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| E-commerce SEO | 240:2 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Keyword Strategy | 233:1084 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Partnership | 247:345 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Insights | 248:1541 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Case Studies | 248:1917 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Podcast | TBD | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Contact | 249:2227 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Privacy Policy | TBD | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |
| Team detail | TBD | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ | not started |

Legend: ⏳ pending · ✅ passed · ❌ failed · 🔁 in progress

## Global decisions (fill during extraction)

- [ ] Hero H1 — Figma spec text
- [ ] Footer nav — link count per Figma
- [ ] Copyright year — 2025 (Figma) vs 2026 (live) — awaiting client decision
- [ ] Trust badges — final count per Figma
```

**Step 2: Create directories**

Run: `mkdir -p docs/audit/reports docs/audit/screenshots`

**Step 3: Commit**

```bash
git add docs/audit/2026-04-15-figma-parity-tracker.md
git commit -m "chore(audit): add Figma parity tracker for 2026-04-15 finalization"
```

---

### Task 0.2: Playwright screenshot harness

**Files:**
- Create: `scripts/screenshot-audit.mjs`
- Create: `scripts/figma-vs-live-diff.mjs`
- Modify: `package.json`

**Step 1: Verify Playwright installed**

Run: `grep playwright package.json`
Expected: `"@playwright/test": "^1.59.1"` in devDependencies.

**Step 2: Install Chromium if missing**

Run: `npx playwright install chromium`
Expected: download completes, no errors.

**Step 3: Write screenshot harness**

Create `scripts/screenshot-audit.mjs`:

```javascript
#!/usr/bin/env node
/**
 * Usage: node scripts/screenshot-audit.mjs <route> <width> <theme>
 * Example: node scripts/screenshot-audit.mjs / 1440 light
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const [, , route = "/", widthArg = "1440", theme = "light"] = process.argv;
const width = Number(widthArg);
const HEIGHT_BY_WIDTH = { 1440: 900, 1024: 768, 768: 1024, 375: 812 };
const height = HEIGHT_BY_WIDTH[width] || 900;

const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
const outDir = "docs/audit/screenshots";
const outPath = join(outDir, `${slug}-${width}-${theme}.png`);
await mkdir(dirname(outPath), { recursive: true });

const baseUrl = process.env.AUDIT_BASE_URL || "http://localhost:3000";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

if (theme === "dark") {
  await page.evaluate(() => document.documentElement.classList.add("dark"));
}

await page.waitForTimeout(1000);
await page.screenshot({ path: outPath, fullPage: true });

console.log(`✓ ${outPath}`);
await browser.close();
```

**Step 4: Add npm script**

Edit `package.json`, add to `"scripts"`:

```json
"screenshot": "node scripts/screenshot-audit.mjs",
"screenshot:all": "for w in 1440 1024 768 375; do for t in light dark; do node scripts/screenshot-audit.mjs / $w $t; done; done"
```

**Step 5: Start dev server and smoke-test**

Run in one terminal: `pnpm dev`
Wait 5 seconds, then in another:
Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000`
Expected: `200`

**Step 6: Run first screenshot**

Run: `node scripts/screenshot-audit.mjs / 1440 light`
Expected: `docs/audit/screenshots/home-1440-light.png` exists, file size > 50KB.

**Step 7: Commit**

```bash
git add scripts/screenshot-audit.mjs package.json
git commit -m "chore(audit): add Playwright screenshot harness for Figma parity checks"
```

---

### Task 0.3: Define per-section workflow contract

**Files:**
- Create: `docs/audit/WORKFLOW.md`

**Step 1: Write the workflow contract**

Create `docs/audit/WORKFLOW.md`:

```markdown
# Per-Section Figma Parity Workflow

## Non-negotiable gate — every section passes these 5 phases in order.

### Phase A — EXTRACT
1. Confirm Figma node ID (from parity tracker or `get_metadata` on parent).
2. Call `mcp__Figma__get_design_context(nodeId=<id>, clientFrameworks="react,nextjs,tailwindcss", clientLanguages="typescript,tsx,css")`.
3. Call `mcp__Figma__get_variable_defs(nodeId=<id>, ...)` — capture color/typography/spacing tokens.
4. Call `mcp__Figma__get_screenshot(nodeId=<id>)` — reference image.
5. Cache to `docs/figma-cache/extractions/2026-04-15-<page>-section-<NN>-<name>.md` with:
   - Figma file key
   - Page node, section node IDs
   - Layout coordinates (x, y, w, h)
   - Typography specs (family, size, weight, line-height, letter-spacing)
   - Color specs (hex values + variable names)
   - Spacing (gap, padding, margin values)
   - Asset URLs (if any)
   - Verification notes

### Phase B — AUDIT (desktop-first)
6. Run dev server (`pnpm dev`) on localhost:3000.
7. Run Playwright: `node scripts/screenshot-audit.mjs <route> 1440 light`.
8. Compare screenshot to Figma reference — log discrepancies in `docs/audit/reports/<page>.md`:
   - geometry mismatch (> 2px)
   - typography (family/size/weight/line-height/letter-spacing)
   - color (raw hex diff)
   - spacing (padding/margin/gap)
   - hover/focus states
   - missing assets
   - copy mismatches

### Phase C — FIX
9. Smallest diff possible. Reuse shared primitives (`Container`, `SectionLabel`, `AppLink`, `GradientText`, etc.).
10. No raw hex — always use CSS variables from `src/app/globals.css`.
11. If content-editable per Sanity schema, update the schema field too.
12. Write/update Vitest tests for content assertions.

### Phase D — VERIFY
13. Re-screenshot at 1440 light — must match Figma within 2px.
14. Repeat at 1024 light.
15. Repeat at 768 light.
16. Repeat at 375 light (iPhone 14 Pro Max per reviewer's DevTools viewport).
17. Repeat at 1440 dark (dark mode toggle applied).
18. Run `pnpm typecheck` — must pass.
19. Run `pnpm lint` — must pass.
20. Run `pnpm test` — must pass.
21. Run axe-core on the page — 0 critical/serious violations.

### Phase E — COMMIT
22. Commit with message: `fix(<page>): <section> pixel-perfect match to Figma <node-id>`.
23. Update `docs/audit/2026-04-15-figma-parity-tracker.md` — mark row cells ✅ or ❌.
24. Only move to next section after all boxes pass.
```

**Step 2: Commit**

```bash
git add docs/audit/WORKFLOW.md
git commit -m "docs(audit): codify per-section Figma parity workflow contract"
```

---

### Task 0.4: Codify discrepancy report template

**Files:**
- Create: `docs/audit/reports/_TEMPLATE.md`

**Step 1: Write the template**

Create `docs/audit/reports/_TEMPLATE.md`:

```markdown
# <Page> Audit — 2026-04-15

**Route:** `/path`
**Figma node:** `X:Y`
**Reviewer:** Nejsa Janković (written feedback + video review)

## Section N: <Section Name>

**Figma node:** `X:Y`
**Component:** `src/components/<path>.tsx`

### Figma spec (from cached extraction)
- Layout: `X, Y, W×H`
- Typography: `font, size/weight/line-height/letter-spacing`
- Colors: `hex values + variable names`

### Live implementation (current)
- (paste relevant code or annotate)

### Discrepancies
- [ ] **Copy:** live `"..."` vs Figma `"..."`
- [ ] **Font:** live `type-h4` vs Figma H3/32px/400
- [ ] **Color:** live `#abc` vs Figma `#def`
- [ ] **Spacing:** live `mt-10` (40px) vs Figma `48px`
- [ ] **Asset:** live `surface-radial` placeholder vs Figma real image

### Fix plan
- Edit `<file>:<lines>`
- Add test: `<file>`
- Verify: Playwright at 1440/1024/768/375

### Verification
- [ ] 1440 light matches
- [ ] 1024 light matches
- [ ] 768 light matches
- [ ] 375 light matches
- [ ] 1440 dark matches
- [ ] a11y passes
- [ ] tests pass
- [ ] typecheck passes
- [ ] lint passes
```

**Step 2: Commit**

```bash
git add docs/audit/reports/_TEMPLATE.md
git commit -m "docs(audit): add discrepancy report template"
```

---

## Phase 1 — Shared Shell (Navbar + Footer + Global Tokens)

Shared shell fixed FIRST because it affects every page. Do not touch while auditing individual pages.

### Task 1.1: Extract navbar from Figma

**Files:**
- Create: `docs/figma-cache/extractions/2026-04-15-shell-section-01-navbar.md`

**Step 1: Get navbar node metadata**

Run via tool: `mcp__Figma__get_metadata(nodeId="702:10162")` (navbar node from cached homepage extraction).

**Step 2: Get design context for navbar**

Run via tool: `mcp__Figma__get_design_context(nodeId="702:10162", clientFrameworks="react,nextjs,tailwindcss", clientLanguages="typescript,tsx,css", artifactType="COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN")`.

**Step 3: Get variable defs**

Run via tool: `mcp__Figma__get_variable_defs(nodeId="702:10162", ...)`.

**Step 4: Save extraction**

Write all three outputs into `docs/figma-cache/extractions/2026-04-15-shell-section-01-navbar.md` following `_TEMPLATE.md` schema.

**Step 5: Commit**

```bash
git add docs/figma-cache/extractions/2026-04-15-shell-section-01-navbar.md
git commit -m "docs(figma-cache): extract navbar section from Figma 702:10162"
```

---

### Task 1.2: Write navbar content-parity tests

**Files:**
- Create: `src/components/layout/navbar.test.ts`

**Step 1: Write failing test**

Create `src/components/layout/navbar.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "./navbar";

describe("Navbar content parity with Figma 702:10162", () => {
  it("has exactly the Figma-spec nav items in order", () => {
    // Update this list AFTER Figma extraction confirms exact labels + order.
    const expected = [
      "Home",
      "About Us",
      "SEO",
      "Link Building",
      "Partnership",
      "Insights",
      "Case Studies",
      "Podcast",
      "Get Started",
    ];
    expect(NAV_ITEMS.map((i) => i.label)).toEqual(expected);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm test -- src/components/layout/navbar.test.ts`
Expected: FAIL — either NAV_ITEMS isn't exported or labels diverge.

**Step 3: Fix navbar.tsx to match Figma**

- If NAV_ITEMS isn't exported, export it.
- If labels diverge from Figma-confirmed list, update them.
- If Figma extraction reveals different order than the hardcoded `expected` above, update the test FIRST to reflect Figma (then the implementation).

**Step 4: Run test to verify it passes**

Run: `pnpm test -- src/components/layout/navbar.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/layout/navbar.tsx src/components/layout/navbar.test.ts
git commit -m "fix(navbar): align nav items + order with Figma 702:10162"
```

---

### Task 1.3: Navbar visual parity

**Step 1: Screenshot live navbar**

Run: `node scripts/screenshot-audit.mjs / 1440 light`.

**Step 2: Crop top 120px and compare to Figma screenshot**

Open both `docs/audit/screenshots/home-1440-light.png` and the Figma navbar screenshot side-by-side. Log discrepancies (typography, spacing, dropdown styling, CTA button) in `docs/audit/reports/shell.md`.

**Step 3: Fix discrepancies**

Edit `src/components/layout/navbar.tsx` + `navbar-active-links.tsx`. Smallest diff possible.

**Step 4: Re-screenshot and verify**

Run: `node scripts/screenshot-audit.mjs / 1440 light`
Compare to Figma — must match within 2px geometry, exact colors.

**Step 5: Repeat at 1024, 768, 375**

```bash
node scripts/screenshot-audit.mjs / 1024 light
node scripts/screenshot-audit.mjs / 768 light
node scripts/screenshot-audit.mjs / 375 light
```

Verify mobile menu opens/closes correctly at 375.

**Step 6: Dark mode pass**

```bash
node scripts/screenshot-audit.mjs / 1440 dark
node scripts/screenshot-audit.mjs / 375 dark
```

**Step 7: Commit**

```bash
git add src/components/layout/navbar.tsx src/components/layout/navbar-active-links.tsx src/components/layout/mobile-menu.tsx docs/audit/reports/shell.md docs/audit/screenshots/
git commit -m "fix(navbar): pixel-perfect alignment with Figma 702:10162"
```

---

### Task 1.4: Extract footer from Figma

**Step 1:** `mcp__Figma__get_design_context(nodeId="554:2310", ...)`.
**Step 2:** `mcp__Figma__get_variable_defs(nodeId="554:2310", ...)`.
**Step 3:** Save to `docs/figma-cache/extractions/2026-04-15-shell-section-02-footer.md`.
**Step 4:** Commit: `docs(figma-cache): extract footer section from Figma 554:2310`.

---

### Task 1.5: Footer content-parity tests

**Files:**
- Modify: `src/components/layout/footer.tsx` — export `NAV_LINKS`, `SOCIAL_LINKS`, `DEFAULT_COPYRIGHT` for testing.
- Create: `src/components/layout/footer.test.ts`

**Step 1: Write failing test**

```typescript
import { describe, expect, it } from "vitest";
import { NAV_LINKS, SOCIAL_LINKS } from "./footer";

describe("Footer content parity with Figma 554:2310", () => {
  it("has exactly the Figma-spec footer nav links", () => {
    // Update AFTER extraction. Reviewer says Figma has 5 items:
    const expected = ["Home", "About Us", "Services", "Partnership", "Privacy policy"];
    expect(NAV_LINKS.map((l) => l.label)).toEqual(expected);
  });

  it("has LinkedIn, Instagram, X social links", () => {
    expect(SOCIAL_LINKS.map((s) => s.label)).toEqual(["LinkedIn", "Instagram", "X"]);
  });
});
```

**Step 2: Run test, verify fail, fix, verify pass.**

**Step 3: Commit**

```bash
git add src/components/layout/footer.tsx src/components/layout/footer.test.ts
git commit -m "fix(footer): align nav links with Figma 554:2310"
```

---

### Task 1.6: Footer visual parity

Same as Task 1.3 but for footer bottom section. Include mobile layout fix (feedback explicitly flagged: *"mobile footer is absolutely different"*).

Commit: `fix(footer): pixel-perfect alignment with Figma 554:2310 incl. mobile`.

---

### Task 1.7: Resolve ©2025 vs ©2026 copyright decision

**Step 1:** Ask user: Figma shows `©2025` (stale) vs live `©2026`. Client decision needed.

**Step 2:** Apply chosen year in `src/components/layout/footer.tsx` AND `src/lib/sanity-data.ts` fallback default.

**Step 3:** Commit: `fix(footer): lock copyright year to <YEAR>`.

---

### Task 1.8: Global tokens sanity check

**Files:**
- Read: `src/app/globals.css`
- Modify if needed.

**Step 1: Get token defs from Figma homepage frame**

Run: `mcp__Figma__get_variable_defs(nodeId="702:10152", ...)`.

**Step 2: Compare to `src/app/globals.css` CSS variables**

For each Figma variable:
- `--color-*` — must match hex
- `--font-*` — must match family
- `--font-size-*` — must match px
- `--radius-*` — must match px
- `--space-*` — must match px

**Step 3: Log mismatches in `docs/audit/reports/shell.md`.**

**Step 4: Fix any mismatches in `globals.css`.**

**Step 5: Run typecheck + lint + tests.**

**Step 6: Commit**

```bash
git add src/app/globals.css docs/audit/reports/shell.md
git commit -m "fix(tokens): align globals.css with Figma variable defs"
```

---

### Task 1.9: Update parity tracker

Mark Shell row `✅` in `docs/audit/2026-04-15-figma-parity-tracker.md`.

Commit: `chore(audit): shell passed Figma parity gate`.

---

## Phase 2 — Homepage (`/`, node `702:10152`)

Homepage is the most broken page per feedback. 10 sections.

### Task 2.0: Extract homepage full tree

**Step 1:** `mcp__Figma__get_metadata(nodeId="702:10152", ...)` — dump to `docs/figma-cache/extractions/2026-04-15-homepage-metadata.md`.

**Step 2:** Identify section node IDs from metadata (match prior extraction at `docs/figma-cache/extractions/2026-04-03-homepage-section-00-full-audit.md`).

**Step 3:** Commit: `docs(figma-cache): refresh homepage tree from Figma 702:10152`.

---

### Task 2.1: Hero — copy + CTA (sections node `702:10216`, `702:10232`, `702:10201`)

**Files:**
- Modify: `src/components/sections/hero.tsx`
- Create: `src/components/sections/hero.test.ts`

**Step 1: Extract hero from Figma**

```
mcp__Figma__get_design_context(nodeId="702:10216", ...)  # H1
mcp__Figma__get_design_context(nodeId="702:10232", ...)  # body paragraph
mcp__Figma__get_design_context(nodeId="702:10201", ...)  # CTA
```

Cache to `docs/figma-cache/extractions/2026-04-15-homepage-section-01-hero.md`.

**Step 2: Write failing test**

Create `src/components/sections/hero.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";

describe("Hero copy parity with Figma 702:10216/10232/10201", () => {
  it("desktop headline matches Nejsa 2026-04-15 spec", () => {
    render(<Hero />);
    // Exact copy from docs/Homepage.docx rewrite #1:
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /If your audience can't find you, they'll choose the competitor who shows up\./i
    );
  });

  it("desktop sub-paragraph is the AI/LLM rewrite", () => {
    render(<Hero />);
    expect(screen.getByText(/Search has changed/)).toBeInTheDocument();
    expect(screen.getByText(/AI overviews, and LLM recommendations/)).toBeInTheDocument();
    expect(screen.getByText(/212\.6% growth rate and 100% client retention/)).toBeInTheDocument();
  });

  it("CTA label is 'Get Found Everywhere'", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /Get Found Everywhere/i })).toBeInTheDocument();
  });
});
```

**Step 3: Install missing test deps if needed**

Run: `grep -E "@testing-library|jsdom" package.json`
If missing: `pnpm add -D @testing-library/react @testing-library/jest-dom jsdom`
Update `vitest.config.ts` with `test: { environment: "jsdom" }`.

**Step 4: Run test, verify fail**

Run: `pnpm test -- src/components/sections/hero.test.ts`
Expected: FAIL on all three assertions.

**Step 5: Fix hero.tsx per feedback doc**

Apply the three rewrites from `/tmp/homepage_docx_text.txt`:
- H1 desktop `<span className="hidden lg:inline">` → update Figma-confirmed text (either "Others are not better" stays, OR the rewrite replaces it — extraction in Step 1 will confirm which).
- Body paragraph `lg:block` → rewrite to AI/LLM variant (full text in feedback doc).
- CTA label → `Get Found Everywhere`.

Keep mobile copy unchanged unless Figma mobile spec differs.

**Step 6: Run test, verify pass**

Run: `pnpm test -- src/components/sections/hero.test.ts`
Expected: PASS.

**Step 7: Run full test suite**

Run: `pnpm test`
Expected: PASS.

**Step 8: Playwright visual diff**

```bash
node scripts/screenshot-audit.mjs / 1440 light
node scripts/screenshot-audit.mjs / 1024 light
node scripts/screenshot-audit.mjs / 768 light
node scripts/screenshot-audit.mjs / 375 light
```

Compare to Figma hero screenshot. Log any geometry/typography/color drift in `docs/audit/reports/homepage.md`.

**Step 9: Commit**

```bash
git add src/components/sections/hero.tsx src/components/sections/hero.test.ts docs/figma-cache/extractions/2026-04-15-homepage-section-01-hero.md docs/audit/reports/homepage.md
git commit -m "fix(hero): apply Nejsa 2026-04-15 copy rewrites + align to Figma 702:10216"
```

---

### Task 2.2: Services carousel — reconstruct 8-card order (node `702:10217` and children)

**Files:**
- Modify: `src/components/sections/services.tsx`
- Create: `src/components/sections/services.test.ts`

**Step 1: Extract Figma services from node `702:10217` (Services H2 parent frame)**

Use `get_metadata` to find card nodes, then `get_design_context` per card.

Cache to `docs/figma-cache/extractions/2026-04-15-homepage-section-02-services.md` including for each card:
- title (exact)
- description (exact)
- image URL (download to `public/figma/services/`)
- href

**Step 2: Write failing test**

Create `src/components/sections/services.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { SERVICE_CARDS } from "./services";

describe("Services carousel parity with Figma (video-extraction 2026-04-15)", () => {
  it("has exactly 8 service cards in Figma order", () => {
    const titles = SERVICE_CARDS.map((c) => c.title);
    expect(titles).toEqual([
      "All SEO Services",
      "Link Building Services",
      "On-Page SEO Services",
      "Technical SEO Services",
      "Local SEO Services",
      "E-Commerce SEO Services",
      "Content Creation Services",
      "Keyword Strategy Services",
    ]);
  });

  it("has no mobileOnly flag on any card (all visible everywhere)", () => {
    const mobileOnly = SERVICE_CARDS.filter((c) => c.mobileOnly);
    expect(mobileOnly).toHaveLength(0);
  });

  it("has no duplicate titles", () => {
    const titles = SERVICE_CARDS.map((c) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("every card has valid href", () => {
    SERVICE_CARDS.forEach((c) => {
      expect(c.href).toMatch(/^\/[a-z-]+$/);
    });
  });
});
```

**Step 2a: Export `SERVICE_CARDS`**

Modify `src/components/sections/services.tsx`:
- Change `const SERVICE_CARDS` → `export const SERVICE_CARDS`

**Step 3: Run test, verify fail**

Run: `pnpm test -- src/components/sections/services.test.ts`
Expected: FAIL — current has 8 entries but wrong set (2 duplicates, missing Local + Keyword, Link Building mobileOnly).

**Step 4: Replace SERVICE_CARDS with Figma-correct set**

Per video-extraction Section 3 (Full SEO Service Catalog), reconstruct as 8 cards matching Figma order. Download missing images from Figma extraction to `public/figma/services/`:
- `card-local-seo.webp` (new)
- `card-keyword-strategy.webp` (new)
- Remove: `card-technical-2.webp` (dup), `card-content-2.webp` (dup)

Update each card's `backDescription` to exactly match Figma description (from extraction in Step 1).

**Step 5: Run test, verify pass**

Run: `pnpm test -- src/components/sections/services.test.ts`
Expected: PASS.

**Step 6: Playwright visual diff**

```bash
node scripts/screenshot-audit.mjs / 1440 light  # desktop carousel
node scripts/screenshot-audit.mjs / 375 light   # mobile rail
```

Verify:
- Desktop: 8 cards visible in horizontal rail
- Mobile: 8 cards in scroll rail with indicator dots (8 dots, not 9)

**Step 7: Commit**

```bash
git add src/components/sections/services.tsx src/components/sections/services.test.ts public/figma/services/ docs/figma-cache/extractions/2026-04-15-homepage-section-02-services.md
git commit -m "fix(services): reconstruct 8-card carousel to match Figma (+Local +Keyword, -dupes)"
```

---

### Task 2.3: About section — verify vs Figma (node `702:10231`)

**Step 1:** Extract Figma about section.

**Step 2:** Compare current `src/components/sections/about.tsx` — the feedback says layout should match columnar spec. Check:
- Is the current scroll-progress + logo-marquee design still in Figma? Or has it changed?
- If Figma shows a different layout, rebuild. If same, only adjust spacing/typography per extraction.

**Step 3:** Write copy-parity test for H2 + body paragraph.

**Step 4:** Fix, verify, Playwright diff at 4 breakpoints.

**Step 5:** Commit: `fix(about): align to Figma 702:10231`.

---

### Task 2.4: Stats/Guided by Data — fix middle column alignment (node `702:10219`)

**Files:**
- Modify: `src/components/sections/stats.tsx`
- Create: `src/components/sections/stats.test.ts`

**Step 1: Extract Figma stats section**

`get_design_context(nodeId="702:10219", ...)`.

Look for the 3 stat entries and their exact casing/text/detail.

**Step 2: Write failing test**

```typescript
import { describe, expect, it } from "vitest";
import { STATS } from "./stats";

describe("Stats/Guided by Data parity with Figma 702:10219", () => {
  it("all 3 metrics use consistent uppercase casing for stroke render", () => {
    // Middle was "Certified experts" (mixed) — fix to Figma-spec casing
    STATS.forEach((s) => {
      expect(s.metric).toMatch(/^[A-Z0-9\s%]+$/); // allow only upper + digits + %
    });
  });

  it("middle metric text matches Figma exactly", () => {
    expect(STATS[1].metric).toBe("CERTIFIED EXPERTS"); // verify from Figma extraction
    expect(STATS[1].detail).toBe("in SEO and digital marketing"); // or whatever Figma says
  });
});
```

**Step 3: Run test, verify fail.**

**Step 4: Fix STATS entries per Figma extraction.**

Export `STATS` from stats.tsx.

**Step 5: Verify middle column vertical alignment at all 4 breakpoints.**

**Step 6: Run test, verify pass, Playwright diff, commit.**

```bash
git commit -m "fix(stats): align middle column + copy to Figma 702:10219"
```

---

### Task 2.5: Add 6 Proven Results stats (per feedback doc request)

**Files:**
- Modify: `src/components/sections/quote-rotator.tsx` OR wherever the proven results strip lives.
- Modify: `src/sanity/schemaTypes/documents/testimonial.ts` (if using Sanity for stats).

**Step 1: Decide data source**

- Option A: Hardcode 9 stats (3 existing + 6 new) in a TS file.
- Option B: Add a new `provenResultStat` Sanity schema with `metric`, `description`, `featured` fields.

Recommendation: Option B (editable per Nejsa request).

**Step 2: If Option B — create Sanity schema**

Create `src/sanity/schemaTypes/documents/provenResultStat.ts`:

```typescript
import { defineField, defineType } from "sanity";

export const provenResultStat = defineType({
  name: "provenResultStat",
  title: "Proven Result Stat",
  type: "document",
  fields: [
    defineField({ name: "client", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", validation: (r) => r.required() }),
    defineField({ name: "metric", type: "string" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
});
```

Register in `src/sanity/schemaTypes/index.ts`.

**Step 3: Write GROQ query + fetcher**

Add to `src/sanity/lib/queries.ts`:

```typescript
export const PROVEN_RESULT_STATS_QUERY = groq`*[_type == "provenResultStat"] | order(order asc, _createdAt asc) {
  _id,
  client,
  description,
  metric,
  featured
}`;
```

Add `getProvenResultStats()` to `src/lib/sanity-data.ts`.

**Step 4: Seed the 6 new stats** (do in Phase 19 — just prepare schema now)

**Step 5: Wire component to read from CMS with hardcoded fallback** (matching existing pattern in `blog.tsx`, `testimonials.tsx`).

**Step 6: Hardcoded fallback contains the 9 stats** (3 existing + 6 from feedback doc):

```typescript
export const PROVEN_RESULT_STATS_FALLBACK = [
  // existing 3
  { client: "Affinda", description: "...", metric: "+156%" },
  { client: "My Basket's", description: "...", metric: "2×" },
  { client: "Number Artist", description: "...", metric: "top seller in 9 months" },
  // new 6 from 2026-04-15 feedback
  { client: "SupportAdventure", description: "grew organic traffic by 113% in 6 months through targeted link building and content strategy.", metric: "+113%" },
  { client: "Warrior Willpower", description: "reached top 3 positions for 10+ high-intent keywords within 2 months of launching their link-building campaign.", metric: "top 3" },
  { client: "Cirrus Insight", description: "increased qualified organic leads by 40% after a full SEO strategy implementation and authority link-building push.", metric: "+40%" },
  { client: "Nursa", description: "expanded its search visibility across all targeted pages and grew organic sessions by 20% within the first year.", metric: "+20%" },
  { client: "Infobip", description: "strengthened its core pages and their authority through a targeted link building campaign.", metric: "stronger" },
  { client: "FrontBrick", description: "went from near-zero organic presence to qualified monthly visitors in under 6 months.", metric: "zero → qualified" },
];
```

**Step 7: Write test.**

**Step 8: Run test, verify, Playwright diff, commit.**

```bash
git commit -m "feat(proven-results): wire 9 stats (3 existing + 6 from Nejsa 2026-04-15 feedback), CMS-backed"
```

---

### Task 2.6: Trust Authority — fix column axis (node `767:2741`)

**Files:**
- Modify: `src/components/sections/trust-authority-rail.tsx`

**Step 1: Extract Figma trust rail**

`get_design_context(nodeId="767:2741", ...)`.

Find: exact column count, direction per column, badge count.

**Step 2: Fix COLUMN_CONFIGS per Figma**

Per reviewer: *"middle column should be going the same way as first and third column."*

Current (4 columns): `up, down, up, down`.
Figma: likely all 4 same direction, OR 3 columns instead of 4.

Verify from extraction. If Figma has 3 columns:
- Change `grid-cols-4` → `grid-cols-3`
- COLUMN_CONFIGS → 3 entries, all `direction: "up"` with staggered delays

If Figma has 4 columns same direction:
- COLUMN_CONFIGS → all 4 `direction: "up"` with staggered delays

**Step 3: Write test**

```typescript
describe("Trust rail parity with Figma 767:2741", () => {
  it("all columns scroll in same direction", () => {
    const directions = COLUMN_CONFIGS.map((c) => c.direction);
    expect(new Set(directions).size).toBe(1);
  });
});
```

**Step 4: Verify at 4 breakpoints. Commit.**

```bash
git commit -m "fix(trust-rail): unify column scroll direction per Figma 767:2741"
```

---

### Task 2.7: Trust Authority badges — reconcile to Figma 12-badge spec

**Files:**
- Modify: `src/components/sections/trust-authority.tsx`

**Step 1: Extract Figma badge list from `702:10353` + children.**

**Step 2: Rewrite `TRUST_AUTHORITY_ITEMS` to exactly the Figma 12 badges** (Google Analytics + 4 Google Ads + 7 HubSpot typical per video extraction Section 5.6).

**Step 3: Write test asserting count + order.**

**Step 4: Verify, commit.**

```bash
git commit -m "fix(trust-authority): reconcile badges to Figma 12-item spec"
```

---

### Task 2.8: Partnerships — fix vertical spacing + CTA (node `702:10161`)

Same per-section workflow.

Commit: `fix(partnerships): align vertical spacing + CTA to Figma 702:10161`.

---

### Task 2.9: Blog preview — add real images + quote marks + fix font (nodes `702:10382-10384`)

**Files:**
- Modify: `src/components/sections/blog.tsx`
- Modify: `src/data/blog-posts.ts`

**Step 1: Extract Figma blog card**

Get design context for one blog card (e.g. `702:10382`). Capture:
- image (download to `public/figma/blog-preview/card-N.webp`)
- title font (should be H3, not H4 per current code)
- quote mark styling
- excerpt styling
- CTA "View More Blogs" styling (current uses `type-cta` h-[45px] border — verify)

**Step 2: Replace placeholder div with real image**

Current `blog.tsx:86`:
```tsx
<div className="surface-radial h-[174px] rounded-[20px] lg:h-[207px] lg:rounded-[30px]" />
```

Replace with:
```tsx
<div className="relative h-[174px] overflow-hidden rounded-[20px] lg:h-[207px] lg:rounded-[30px]">
  <Image
    alt={blog.mainImageAlt}
    className="object-cover"
    fill
    sizes="(min-width: 1024px) 413px, 348px"
    src={blog.mainImageUrl}
  />
</div>
```

Where `blog.mainImageUrl` comes from `SanityPostSummary` (already in the data model — it just wasn't rendered).

Update `BlogCardItem` type to include `mainImageUrl` + `mainImageAlt` + `mainImageLqip`.

Update `mapCmsPosts` + `PUBLISHED_BLOG_POSTS` fallback to provide these fields.

**Step 3: Add quotation marks on title**

Per feedback: *"ovde navodnici isto fale"* (quotation marks missing).

Check Figma extraction — do they wrap the title in curly quotes? Or show an accent quote glyph? Implement accordingly.

**Step 4: Fix font**

Feedback: *"ovde font na koji ima kao neki nekakav drugi font, nije taj font koji mi koristimo. Proveri na figma kako bi trebalo."*

If Figma uses H3 (32px/400), change `type-h4 font-normal` → `type-h3 font-normal` (or whatever Figma extraction confirms).

**Step 5: Restyle "View More Blogs" CTA**

Extraction will show the Figma CTA style. Apply.

**Step 6: Add blog card fallback images**

Download 3 fallback blog images to `public/figma/blog-preview/`. Reference in `PUBLISHED_BLOG_POSTS`.

**Step 7: Test + Playwright + commit.**

```bash
git commit -m "fix(blog-preview): real images, quote marks, H3 font, CTA restyle per Figma 702:10400"
```

---

### Task 2.10: Testimonials — add 4th card + fix quote style + font (node `702:10352`)

**Files:**
- Modify: `src/components/sections/testimonials.tsx`

**Step 1: Extract Figma testimonials**

Feedback says Figma has 4 cards, currently 3 are hardcoded.

**Step 2: Find the 4th testimonial in Figma or Sanity**

If Figma shows a 4th (with exact quote + name + role + logo), add to `TESTIMONIALS` array. Otherwise verify CMS data has a 4th.

**Step 3: Fix quote marks**

Current uses curly `"`. Figma may use an accent glyph or different styling. Match exactly.

**Step 4: Fix font**

Current uses `type-h4` for quote. Verify vs Figma. Probably H3 (32px).

**Step 5: Test + Playwright + commit.**

```bash
git commit -m "fix(testimonials): add 4th card, align quote style + H3 font per Figma 702:10352"
```

---

### Task 2.11: Homepage footer CTA — reconcile copy

**Files:**
- Modify: `src/components/layout/footer-cta-variant.tsx` (check which variant homepage uses)

**Step 1: Extract Figma footer CTA from homepage frame**

Video extraction says Figma shows:
> "Ready to Elevate Your Online Presence? / Scale your business with a framework that is adjustable to any industry. Contact us today to start your SEO journey with Heroic Rankings. / Get Started Today"

Current live:
> "Ready to grow together / We grow by helping our clients grow... / Start Growing"

**Step 2: Apply exact Figma copy.**

Also: Homepage.docx feedback says to update sitewide footer to:
> *"Our success is measured in your results. We built Heroic Rankings on a simple belief - a real SEO agency can only grow by growing its clients. So we don't just run campaigns. We build long-term partnerships where your growth is the only metric that matters."*

This is a DIFFERENT block (sitewide copy, possibly below the CTA). Clarify with client which goes where.

**Step 3: Update Sanity `siteSettings` footerCta fields to match.**

**Step 4: Test + Playwright + commit.**

```bash
git commit -m "fix(footer-cta): align to Figma + Nejsa sitewide copy directive"
```

---

### Task 2.12: Homepage final parity sweep

**Step 1: Full-page Playwright at 1440 light, 1440 dark, 1024, 768, 375**

```bash
for w in 1440 1024 768 375; do for t in light dark; do node scripts/screenshot-audit.mjs / $w $t; done; done
```

**Step 2: Compare each to Figma homepage screenshot**

For each discrepancy, open a sub-task to fix.

**Step 3: Run a11y**

```bash
npx @axe-core/cli http://localhost:3000 --exit
```

Fix any critical/serious.

**Step 4: Update parity tracker — mark Homepage row ✅ for each column.**

**Step 5: Commit**

```bash
git add docs/audit/2026-04-15-figma-parity-tracker.md docs/audit/reports/homepage.md docs/audit/screenshots/
git commit -m "chore(audit): homepage passes Figma parity gate at 1440/1024/768/375 light+dark"
```

---

## Phase 3 — About Us (`/about-us`, node `189:5`)

Follow the per-section workflow (`docs/audit/WORKFLOW.md`). Sections:

- 3.1 Hero
- 3.2 Trust + Process
- 3.3 CTA
- 3.4 Team Grid
- 3.5 Testimonials (reused — verify same fix as Phase 2.10 applies)
- 3.6 Blog (reused — verify same fix as Phase 2.9 applies)

Each section:
- Extract Figma (`get_design_context` on the node from `189:5` metadata)
- Write content test
- Fix
- Playwright diff at 4 breakpoints
- Commit: `fix(about-us): <section> align to Figma 189:<subnode>`

After all sections: update parity tracker, commit gate-pass.

---

## Phase 4 — SEO Services Hub (`/seo-services`, node `203:1361`)

Sections:
- 4.1 Hero
- 4.2 Services Grid (mobile rail + desktop flip cards)
- 4.3 **FIX HOVER BLUR** — apply `filter: blur(14px)` to `.seo-service-card-back` image in `src/app/globals.css` (matching `.service-card-back-image` behavior)
- 4.4 Why Choose
- 4.5 Success Stories
- 4.6 FAQ

Same workflow. Commits per section.

Special Task 4.3.1:
- Modify `src/app/globals.css`
- Add between lines 615-627:
  ```css
  .seo-service-card-back-image {
    filter: blur(14px);
    transform: scale(1.08);
    transform-origin: center;
  }
  ```
- Modify `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx` line 68: add `seo-service-card-back-image` className to the back Image
- Playwright + commit: `fix(seo-services): restore hover blur on back card image per Figma`

---

## Phase 5 — Link Building (`/link-building`, node `246:2`)

**Critical fixes:**

### Task 5.1: Add Listicle Backlinks 6th pillar

**Files:**
- Modify: `src/components/pages/link-building/link-building-page.tsx`

**Step 1: Extract Figma Listicle Backlinks card from `246:2` children.**

**Step 2: Add to `SERVICE_CARDS` array in `link-building-page.tsx`:**

```typescript
{
  title: "Listicle Backlinks",
  subtitle: "Boost LLM Performance Through Curated Listicles",
  body: "Listicle posts on authoritative sites act as high-trust signals both for search engines and large-language-model answer engines. We place your brand in the right lists — the ones that are already cited by competitors and already surface in AI overviews — so your site becomes part of the canonical answer set.",
  ctaLabel: "Boost LLM Visibility",
  iconSrc: "/link-building/imgListicle.svg", // download from Figma
  iconWidth: 32,
  iconHeight: 32,
},
```

Body text must match Figma extraction exactly.

**Step 3: Download icon asset from Figma to `public/link-building/imgListicle.svg`.**

**Step 4: Write test — expect 6 service cards.**

**Step 5: Playwright + commit: `feat(link-building): add 6th pillar Listicle Backlinks per Figma 246:<N>`.**

### Task 5.2: Why Choose 6th item

Feedback says 6 items in Figma. Current has 5. Add the 6th per Figma extraction.

Commit: `feat(link-building): add 6th Why Choose item per Figma`.

### Task 5.3+: Remaining sections follow standard workflow.

---

## Phase 6-11 — Service detail pages

These share a template. Workflow:

1. Audit ONE representative page fully (e.g. On-Page SEO).
2. Identify the shared template components.
3. If shared template needs fix, fix once — propagates.
4. For each remaining service page: Playwright diff, fix route-specific content only.

Per-page commits: `fix(<service>): align to Figma <node>`.

Pages: `/on-page-seo`, `/technical-seo`, `/local-seo`, `/content-creation`, `/ecommerce-seo`, `/keyword-strategy`.

---

## Phase 12 — Partnership (`/partnership`, node `247:345`)

Standard workflow. Commit per section.

---

## Phase 13 — Insights (`/insights` + `/insights/[slug]`, node `248:1541`)

### Task 13.1: Hub page

Sections: Hero, Subscribe, Catalog grid, Filters.

**Feedback-driven fixes:**
- Wire filters to Sanity categories
- Add ChatGPT/AI reference block (reviewer says it's missing — verify in Figma extraction)

### Task 13.2: Detail page

Currently shows `"Full article content will appear here as soon as it is published in CMS."` placeholder.

**Step 1: Verify Sanity has at least one published post.** If not → seed in Phase 19.
**Step 2: Verify `POST_BY_SLUG_QUERY` returns the body.**
**Step 3: Verify PortableText renders correctly with the Figma-spec typography.**

Commit: `fix(insights-detail): render Sanity-backed post body per Figma 248:<N>`.

---

## Phase 14 — Case Studies (`/case-studies` + `/case-studies/[slug]`)

Standard workflow. Includes detail template per Figma node `[96]` in prior extraction.

---

## Phase 15 — Podcast (`/podcast` + `/podcast/[slug]`) — FULL REDESIGN

Reviewer: *"podcast mi fale slike, skroz i drugačiji dizajn"* — missing images, completely different design.

### Task 15.1: Extract Figma podcast hub (`[89]` in prior extraction)

Full section walk. Capture every asset.

### Task 15.2: Extract Figma podcast detail (`[88]`)

### Task 15.3: Create podcast episode Sanity schema

Create `src/sanity/schemaTypes/documents/podcastEpisode.ts`:

```typescript
import { defineField, defineType } from "sanity";

export const podcastEpisode = defineType({
  name: "podcastEpisode",
  title: "Podcast Episode",
  type: "document",
  fields: [
    defineField({ name: "episodeNumber", type: "number", validation: (r) => r.required() }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "guest", type: "string", validation: (r) => r.required() }),
    defineField({ name: "guestRole", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "duration", type: "string" }),
    defineField({ name: "part", type: "string" }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "youtubeUrl", type: "url" }),
    defineField({ name: "keyTakeaways", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "transcript", type: "array", of: [{ type: "block" }] }),
  ],
});
```

Register in schema index.

### Task 15.4: Rebuild `podcast-page.tsx` to Figma

Remove hardcoded static data. Wire CMS. Use Figma-extracted layout.

### Task 15.5: Rebuild `podcast-episode-page.tsx` to Figma

### Task 15.6: Seed episode cover images

Download from Figma extraction → `public/podcast/episode-NN.webp`.

### Task 15.7: Playwright visual diff for both routes at 4 breakpoints + dark mode.

Commits:
- `feat(podcast): add Sanity schema for podcast episodes`
- `refactor(podcast): rebuild hub page to Figma <node> with CMS wiring`
- `refactor(podcast): rebuild episode detail page to Figma <node>`
- `chore(podcast): add episode cover images from Figma extraction`

---

## Phase 16 — Contact (`/contact`, node `249:2227`)

Standard workflow.

---

## Phase 17 — Privacy Policy (`/privacy-policy`)

Figma node TBD — search via `get_metadata` on root file. Then standard workflow.

---

## Phase 18 — Team detail (`/team/[slug]`)

Figma node TBD. Standard workflow.

---

## Phase 19 — Mobile parity full sweep (all pages @ 375px)

Per feedback: mobile was neglected on every page. Reviewer flagged:
- Hero section order
- Partnership button
- Footer (completely different)
- Proven results statue order
- Certificates row
- Blog cards

Most should be caught by per-page 375px Playwright gate. This phase verifies nothing slipped.

### Task 19.1: Screenshot every page at 375 light + dark

```bash
for route in / /about-us /seo-services /link-building /on-page-seo /technical-seo /local-seo /content-creation /ecommerce-seo /keyword-strategy /partnership /insights /case-studies /podcast /contact /privacy-policy; do
  for t in light dark; do
    node scripts/screenshot-audit.mjs $route 375 $t
  done
done
```

### Task 19.2: Side-by-side vs Figma mobile frames

Figma should have mobile variants for every page (verify via `get_metadata` on root file).

### Task 19.3: Fix any residual mobile bugs

Commit per fix.

---

## Phase 20 — Dark mode full sweep

Same approach but for dark mode.

---

## Phase 21 — CMS content seeding

### Task 21.1: Populate `siteSettings` singleton

Via Sanity Studio at `http://localhost:3000/studio`:
- Company name
- Phone
- Email
- Social links
- Copyright
- Nav items
- Footer nav items
- Footer CTA fields
- Header CTA fields

### Task 21.2: Populate `post` documents

Minimum 3 published posts per feedback (Market Research Made Simple, Outsourcing Link Building, Top 5 SEO Myths). Each with real body content.

### Task 21.3: Populate `caseStudy` documents

Minimum 3 (My Baskets, Nagish, Art by Maudsch per video extraction).

### Task 21.4: Populate `testimonial` documents

Minimum 4 (per Figma count).

### Task 21.5: Populate `partnerLogo` documents

Current live logos: omzare digital, VEZA Digital, TCF, White Label Agency, digitalsorbtive.

### Task 21.6: Populate `podcastEpisode` documents

Minimum 15 (per hero copy "15+ Episodes"). Use existing `src/data/podcast-episodes.ts` as seed source.

### Task 21.7: Populate `faqItem` documents per service

### Task 21.8: Populate `teamMember` documents

Minimum 2 (Nebojša Janković Founder & CEO, Anastasija Janković Co-Founder & CHRO per video extraction + "20+ professionals in our team").

### Task 21.9: Populate `servicePage` singletons (one per service)

### Task 21.10: Populate `partnershipPage`, `contactPage`, `legalPage` singletons

### Task 21.11: Populate `provenResultStat` — 9 stats from Phase 2.5

### Task 21.12: Verify live site uses CMS data everywhere

Screenshot each page with CMS empty vs populated — should render the populated content.

Commit: `content: seed Sanity with full content set from Nejsa 2026-04-15 feedback`.

---

## Phase 22 — Performance + Codex final audit

Reuse the existing plan `docs/plans/2026-04-03-finalization-audit.md` Phases 2-4:

- 22.1 Animation audit (GPU compositing, prefers-reduced-motion)
- 22.2 Image optimization (WebP, next/image, lazy-loading)
- 22.3 Bundle & loading (client boundaries, dynamic imports, fonts)
- 22.4 Core Web Vitals (LCP, CLS, INP via Lighthouse)
- 22.5 Metadata & SEO (per-page titles, descriptions, OG, JSON-LD)
- 22.6 Security headers (middleware)
- 22.7 Error handling (error.tsx, not-found.tsx, loading.tsx)
- 22.8 a11y (axe-core on every page + keyboard nav + contrast)
- 22.9 Code quality (raw hex removal, unused queries, dead code)

### Task 22.10: Codex full audit

Use `/codex` skill:

```
Review the Heroic Rankings Next.js 16 codebase as a senior web developer.
Evaluate across these dimensions:
1. Architecture (server/client boundaries)
2. Performance (renders, bundle, CLS)
3. Security (CSP, XSS)
4. Accessibility (ARIA, keyboard, contrast)
5. SEO (metadata, structured data, canonical)
6. Dark mode (unthemed elements, contrast)
7. Responsive (1440/1024/768/375)
8. Code quality (DRY, dead code, types)
9. Next.js best practices
10. Sanity CMS integration (graceful fallbacks, types)

Severity: Critical / Major / Minor / Suggestion.
File path + line + what's wrong + how to fix.
```

Fix all Critical and Major issues. Re-run Codex for validation. Commit.

### Task 22.11: Final Lighthouse

Target >= 95 on Performance, a11y, Best Practices, SEO.

---

## Open Decisions (block specific tasks)

Before execution, user must answer:

1. **Hero H1 desktop** — keep current "Others are not better..." or replace with Figma-confirmed text? (Phase 2.1)
2. **Footer nav count** — 5 items (Figma per video) or 9 (current)? (Phase 1.5)
3. **Copyright year** — 2025 (Figma stale) or 2026 (current)? (Phase 1.7)
4. **Trust badges count** — 12 (Figma) or 19 (current)? (Phase 2.7)
5. **Blog images source** — CMS upload or bake static? (Phase 2.9)
6. **Podcast scope** — full redesign per Figma (Phase 15) or incremental fix?
7. **CMS seeding** — do we seed from Pavle's side, or does Nejsa do it via Studio?

**These are GATING questions — Phases that need them are blocked.** If the user says "proceed with Figma truth," we extract first and implement whatever Figma shows.

---

## Execution Mode

This plan contains ~150 discrete tasks across 22 phases over ~16 pages.

Recommended: **Subagent-driven per-phase, sequential phases**.

Rationale:
- Sequential gate per page prevents shared-shell regressions.
- Within a phase, sections can be fanned out to subagents (same skill: `superpowers:subagent-driven-development`).
- Frequent commits (target: 50+ commits by end of Phase 2 alone).
- Code review subagent dispatched after every phase (not task).

---

## Definition of Done (per page)

- [ ] Every section has a cached Figma extraction doc
- [ ] Playwright 1440/1024/768/375 light + dark all match Figma within 2px / 1 color tolerance
- [ ] Zero console errors on every route
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] axe-core 0 critical / 0 serious
- [ ] Parity tracker row marked ✅
- [ ] All content comes from CMS with hardcoded fallback (or is explicitly marked non-CMS)
- [ ] Commit history shows per-section fix commits with Figma node refs

## Definition of Done (overall)

All 18 pages above pass Definition of Done per page. Codex audit returns 0 Critical + 0 Major. Lighthouse ≥ 95 on all pages. Client sign-off from Nejsa.
