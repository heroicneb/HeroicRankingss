# Heroic Figma Page-by-Page Audit Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Compare every user-facing page in the Heroic Rankings site against the canonical Figma design, document mismatches, and then fix pages one at a time with evidence.

**Architecture:** Treat the Figma design as the source of truth and the repo as the implementation under audit. Work in three lanes for each page: design-source extraction, code/screenshot inspection, and discrepancy reporting. Re-check shared shell and global tokens before page-specific work because those can affect multiple routes at once.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Figma MCP workflow, cached extraction docs under `docs/figma-cache/extractions`, local `.fig` artifact, Playwright/browser verification when visual checks begin.

---

## Canonical Sources

- Primary remote Figma file key: `iIVCGkNIrd9sc6j9NKmGIF`
- Primary local design artifact: `Heroic Rankings - Website (Copy).fig`
- Known page nodes already identified:
  - Homepage: `702:10152`
  - About Us: `189:5`
  - SEO Services: `203:1361`
- Existing extraction docs:
  - `docs/figma-cache/extractions/2026-04-03-homepage-section-00-full-audit.md`
  - `docs/figma-cache/extractions/2026-04-03-about-us-page-full.md`
  - `docs/figma-cache/extractions/2026-04-03-seo-services-section-00-full-page.md`
  - `docs/figma-cache/extractions/2026-04-03-new-pages-text-extraction.md`

## Required Skills

- `brainstorming`
- `writing-plans`
- `figma`
- `agent-browser` for browser-based visual verification
- `webapp-testing` when we start live page checks
- `verification-before-completion` before claiming any page is done

## Agent Roles

- `researcher`
  - Owns Figma provenance, cached extraction lookup, and route/component mapping.
- `researcher`
  - Owns page-specific implementation map for each route before comparison starts.
- `auditor`
  - Owns discrepancy review after each page comparison and checks whether findings are real issues or acceptable implementation differences.
- `implementer`
  - Owns fixes only after a page audit is approved for implementation.
- `tester`
  - Owns route-level verification after fixes land.

## Compare Checklist For Every Page

1. Confirm the canonical Figma node ID for the page.
2. Reuse cache if present; otherwise extract `get_design_context`, `get_metadata` if needed, and `get_screenshot`, then cache the result in `docs/figma-cache/extractions/`.
3. Map the live route to the exact Next.js page entry and top-level section components.
4. Compare shared shell impact first:
   - Navbar
   - Footer
   - global spacing and typography tokens
   - background treatments
5. Compare page-specific structure:
   - section order
   - layout widths and spacing
   - typography scale and weights
   - colors, gradients, shadows, borders
   - images, logos, and exported assets
   - CTA variants and link targets
6. Compare interaction and responsive behavior:
   - hover/focus states
   - menus/dropdowns
   - sliders/carousels
   - breakpoints at `1440`, `1024`, `768`, `375`
7. Produce an audit artifact with:
   - matched items
   - mismatches
   - severity
   - fix owner
   - blocked items if the Figma source is ambiguous

## Page Order

### Task 1: Foundation Pass

**Files:**
- Review: `src/app/(site)/layout.tsx`
- Review: `src/app/globals.css`
- Review: `src/components/layout/*`
- Review: `docs/workflow-guide.md`

**Step 1: Verify the global source of truth**

- Confirm the canonical Figma file key is still `iIVCGkNIrd9sc6j9NKmGIF`.
- Confirm whether the local `.fig` file and remote source appear aligned or potentially drifted.

**Step 2: Audit shared shell before page work**

- Verify navbar, footer, type scale, and token system.
- Record any global mismatches separately so they do not get repeated on every page.

### Task 2: Homepage

**Route:** `/`

**Figma Node:** `702:10152`

**Implementation Entry:**
- `src/app/(site)/page.tsx`
- `src/components/pages/home/home-page.tsx`

**Step 1: Reuse or refresh cached homepage extraction**

- Start with `docs/figma-cache/extractions/2026-04-03-homepage-section-00-full-audit.md`.
- If incomplete, re-extract and cache updated notes.

**Step 2: Audit section-by-section**

- Hero
- Services
- About
- Team
- Stats/Logos
- Case Studies
- Trust/Authority
- Partnerships
- Blog
- Testimonials

**Step 3: Produce homepage report**

- Create or update a focused audit report with findings and screenshots/references.

### Task 3: About Us

**Route:** `/about-us`

**Figma Node:** `189:5`

**Implementation Entry:**
- `src/app/(site)/(pages)/about-us/page.tsx`
- `src/components/pages/about/about-us-page.tsx`

**Step 1: Reuse existing extraction**

- Start with `docs/figma-cache/extractions/2026-04-03-about-us-page-full.md`.

**Step 2: Audit page stack**

- Hero
- Trust
- Process
- CTA
- Team
- Testimonials
- Blog

**Step 3: Produce about-us report**

- Separate global shell issues from page-local issues.

### Task 4: SEO Services Hub

**Route:** `/seo-services`

**Figma Node:** `203:1361`

**Implementation Entry:**
- `src/app/(site)/(pages)/seo-services/page.tsx`
- Service page component tree discovered for this route

**Step 1: Verify actual render mode**

- Confirm whether the page is rendering CMS content or fallback content.

**Step 2: Reuse existing extraction**

- Start with `docs/figma-cache/extractions/2026-04-03-seo-services-section-00-full-page.md`.

**Step 3: Produce services-hub report**

- Document layout parity and any CMS-driven drift.

### Task 5: Remaining Static Marketing Pages

**Routes:**
- `/partnership`
- `/contact`
- `/privacy-policy`

**Step 1: Identify matching Figma nodes**

- Pull from cache if already available.
- Otherwise extract and cache.

**Step 2: Audit route-by-route**

- Compare structure, copy, CTAs, and responsive behavior.

### Task 6: Service Detail Pages

**Routes:**
- `/on-page-seo`
- `/technical-seo`
- `/local-seo`
- `/link-building`
- `/keyword-strategy`
- `/ecommerce-seo`
- `/content-creation`

**Step 1: Confirm whether these pages share one design template or several**

- Group pages by shared layout before auditing to avoid duplicate work.

**Step 2: For each template group, audit one representative page first**

- Only then fan out to route-specific content differences.

### Task 7: Content Listing Pages

**Routes:**
- `/insights`
- `/case-studies`
- `/podcast`

**Step 1: Identify node mappings and cache missing extractions**

**Step 2: Audit card grids, subscribe blocks, filters, and content ordering**

### Task 8: Dynamic Detail Templates

**Routes:**
- `/insights/[slug]`
- `/case-studies/[slug]`
- `/podcast/[slug]`
- `/team/[slug]`

**Step 1: Audit layout template first**

- Ignore content-instance noise at first pass.

**Step 2: Pick one real slug per template for live verification**

- Verify CMS or fallback data does not break parity.

## Deliverables Per Page

- Cached extraction doc if missing
- Audit report with concrete mismatches
- Decision:
  - `ready to fix`
  - `needs better Figma source`
  - `matches well enough`

## Execution Mode

- Recommended: Subagent-driven, page by page, starting with the foundation pass and homepage.
- Rationale: it keeps each compare/fix loop small, preserves context, and isolates global-token issues before we touch route-specific components.
