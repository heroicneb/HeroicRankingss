# Heroic Rankings — Finalization Audit & Pixel-Perfect QA Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring every page to pixel-perfect Figma fidelity, optimize all animations and performance to blazing-fast standards, apply Next.js best practices, and pass a Codex senior-developer audit.

**Architecture:** 4-phase approach — (1) Figma pixel-perfect verification per page, (2) animation & performance optimization, (3) Next.js best practices hardening, (4) independent Codex audit with fix loop. Each page is verified at 1440px (desktop), 768px (tablet), 375px (mobile) in both light and dark mode.

**Tech Stack:** Next.js 16.1 (App Router, React 19, Turbopack), Tailwind CSS v4, Sanity CMS, Playwright (screenshots), Figma MCP (design source of truth), Codex CLI (audit)

**Figma file key:** `iIVCGkNIrd9sc6j9NKmGIF`

---

## Phase 1: Figma Pixel-Perfect Verification (14 pages)

> For each page: Figma screenshot → Playwright screenshot at 1440px → side-by-side comparison → log every discrepancy → fix → re-verify. Repeat for dark mode. Repeat for 768px and 375px.

### Figma Node Reference

| Page | Route | Figma Node |
|------|-------|------------|
| Homepage | `/` | `702:10152` |
| About Us | `/about-us` | `189:5` |
| SEO Services | `/seo-services` | `203:1361` |
| Technical SEO | `/technical-seo` | `222:243` |
| On-Page SEO | `/on-page-seo` | `230:372` |
| Local SEO | `/local-seo` | `233:728` |
| Content Creation | `/content-creation` | `233:1412` |
| E-commerce SEO | `/ecommerce-seo` | `240:2` |
| Keyword Strategy | `/keyword-strategy` | `233:1084` |
| Link Building | `/link-building` | `246:2` |
| Partnership | `/partnership` | `247:345` |
| Insights (Blog) | `/insights` | `248:1541` |
| Case Studies | `/case-studies` | `248:1917` |
| Contact | `/contact` | `249:2227` |

---

### Task 1.0: Set Up Playwright Screenshot Tooling

**Files:**
- Create: `scripts/screenshot-audit.mjs`
- Modify: `package.json` (add script)

**Step 1: Install Playwright as dev dependency**

Run: `cd /Users/pavle/Developer/clients/heroic/heroic-rankings && pnpm add -D @playwright/test && npx playwright install chromium`

**Step 2: Create screenshot script**

Create `scripts/screenshot-audit.mjs` — a Node script that:
- Takes a route, viewport width, and theme (light/dark) as arguments
- Launches Playwright Chromium
- Navigates to `http://localhost:3000{route}`
- If theme=dark, injects `document.documentElement.classList.add('dark')`
- Waits for network idle + 1s for animations to settle
- Takes a full-page screenshot
- Saves to `docs/audit/screenshots/{route}-{width}-{theme}.png`

```bash
node scripts/screenshot-audit.mjs / 1440 light
node scripts/screenshot-audit.mjs / 1440 dark
node scripts/screenshot-audit.mjs / 768 light
node scripts/screenshot-audit.mjs / 375 light
```

**Step 3: Add npm script**

Add to `package.json`:
```json
"screenshot": "node scripts/screenshot-audit.mjs"
```

**Step 4: Create output directory**

```bash
mkdir -p docs/audit/screenshots docs/audit/reports
```

**Step 5: Verify dev server runs**

```bash
pnpm dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
```

**Step 6: Take test screenshot**

```bash
node scripts/screenshot-audit.mjs / 1440 light
# Expected: docs/audit/screenshots/index-1440-light.png exists
```

**Step 7: Commit**

```bash
git add scripts/screenshot-audit.mjs package.json pnpm-lock.yaml docs/audit/
git commit -m "chore: add Playwright screenshot audit tooling"
```

---

### Task 1.1: Homepage — Pixel-Perfect Audit

**Figma node:** `702:10152`
**Route:** `/`
**Component:** `src/components/pages/home/home-page.tsx`
**Sections to verify (10):**

| # | Section | Component File |
|---|---------|---------------|
| 1 | Hero | `src/components/sections/hero.tsx` |
| 2 | Services (flip cards) | `src/components/sections/services.tsx` |
| 3 | About (scroll progress) | `src/components/sections/about.tsx` |
| 4 | Team | `src/components/sections/team.tsx` |
| 5 | Stats + Featured Logos | `src/components/sections/stats.tsx` + `featured-logos.tsx` |
| 6 | Case Studies + Quotes | `src/components/sections/case-studies.tsx` + `quote-rotator.tsx` |
| 7 | Trust/Certifications | `src/components/sections/trust-authority.tsx` + `trust-authority-rail.tsx` |
| 8 | Partnerships CTA | `src/components/sections/partnerships.tsx` |
| 9 | Blog Preview | `src/components/sections/blog.tsx` |
| 10 | Testimonials | `src/components/sections/testimonials.tsx` |

**Step 1: Get Figma screenshot**

```
mcp__claude_ai_Figma__get_screenshot(fileKey: "iIVCGkNIrd9sc6j9NKmGIF", nodeId: "702:10152")
```

**Step 2: Get Figma design context for each section**

For each section, use `get_design_context` on the section's node ID. Extract:
- Exact colors (hex, rgba)
- Font sizes, weights, line heights
- Padding, margin, gap values
- Border radius, shadows
- Element dimensions

Cache results to `docs/figma-cache/extractions/2026-04-03-homepage-section-NN-name.md`

**Step 3: Take Playwright screenshots**

```bash
node scripts/screenshot-audit.mjs / 1440 light
node scripts/screenshot-audit.mjs / 1440 dark
node scripts/screenshot-audit.mjs / 768 light
node scripts/screenshot-audit.mjs / 375 light
```

**Step 4: Compare and log discrepancies**

Create `docs/audit/reports/homepage.md`:
```markdown
# Homepage Audit — 2026-04-03

## Section 1: Hero
- [ ] Heading font-size: Figma=XX, Actual=YY
- [ ] CTA button gradient: Figma=XX, Actual=YY
- [ ] Hero image position: Figma=XX, Actual=YY
...
```

**Step 5: Fix each discrepancy**

Edit the component files. Every fix must reference the Figma spec.

**Step 6: Re-screenshot and re-compare**

Repeat until all discrepancies are resolved.

**Step 7: Commit**

```bash
git add src/components/sections/ src/components/pages/home/ docs/audit/
git commit -m "fix(homepage): pixel-perfect alignment with Figma 702:10152"
```

---

### Task 1.2: About Us — Pixel-Perfect Audit

**Figma node:** `189:5`
**Route:** `/about-us`
**Component:** `src/components/pages/about-us/about-us-page.tsx`
**Sections:**

| # | Section | Component File |
|---|---------|---------------|
| 1 | Hero | `src/components/sections/about-us-hero.tsx` |
| 2 | Trust + Process | `src/components/sections/about-us-trust.tsx` + `about-us-process.tsx` |
| 3 | CTA | `src/components/sections/about-us-cta.tsx` |
| 4 | Team Grid | `src/components/sections/about-us-team.tsx` |
| 5 | Testimonials (reused) | `src/components/sections/testimonials.tsx` |
| 6 | Blog (reused) | `src/components/sections/blog.tsx` |

**Steps:** Same workflow as Task 1.1 — Figma screenshot → design context → Playwright screenshot → compare → fix → re-verify → commit.

---

### Task 1.3: SEO Services Hub — Pixel-Perfect Audit

**Figma node:** `203:1361`
**Route:** `/seo-services`
**Component:** `src/components/pages/seo-services/seo-services-page.tsx`
**Sections:**

| # | Section | Component File |
|---|---------|---------------|
| 1 | Hero | inline in seo-services-page.tsx |
| 2 | Services Grid (mobile rail + desktop flip) | `seo-services-mobile-services-rail.tsx` + `seo-services-desktop-services-grid.tsx` |
| 3 | Why Choose | `src/components/pages/shared/` → `service-why-choose.tsx` |
| 4 | Success Stories | `src/components/pages/shared/` → `service-success-stories.tsx` |
| 5 | FAQ | `src/components/sections/shared/service-faq.tsx` |

**Steps:** Same workflow.

---

### Task 1.4: Technical SEO — Pixel-Perfect Audit

**Figma node:** `222:243` | **Route:** `/technical-seo`
**Component:** `src/components/pages/technical-seo/technical-seo-page.tsx`
**Steps:** Same workflow.

### Task 1.5: On-Page SEO — Pixel-Perfect Audit

**Figma node:** `230:372` | **Route:** `/on-page-seo`
**Component:** `src/components/pages/on-page-seo/on-page-seo-page.tsx`
**Steps:** Same workflow.

### Task 1.6: Local SEO — Pixel-Perfect Audit

**Figma node:** `233:728` | **Route:** `/local-seo`
**Component:** `src/components/pages/local-seo/local-seo-page.tsx`
**Steps:** Same workflow.

### Task 1.7: Content Creation — Pixel-Perfect Audit

**Figma node:** `233:1412` | **Route:** `/content-creation`
**Component:** `src/components/pages/content-creation/content-creation-page.tsx`
**Steps:** Same workflow.

### Task 1.8: E-commerce SEO — Pixel-Perfect Audit

**Figma node:** `240:2` | **Route:** `/ecommerce-seo`
**Component:** `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx`
**Steps:** Same workflow.

### Task 1.9: Keyword Strategy — Pixel-Perfect Audit

**Figma node:** `233:1084` | **Route:** `/keyword-strategy`
**Component:** `src/components/pages/keyword-strategy/keyword-strategy-page.tsx`
**Steps:** Same workflow.

### Task 1.10: Link Building — Pixel-Perfect Audit

**Figma node:** `246:2` | **Route:** `/link-building`
**Component:** `src/components/pages/link-building/link-building-page.tsx`
**Steps:** Same workflow.

### Task 1.11: Partnership — Pixel-Perfect Audit

**Figma node:** `247:345` | **Route:** `/partnership`
**Component:** `src/components/pages/partnership/partnership-page.tsx`
**Steps:** Same workflow.

### Task 1.12: Insights (Blog) — Pixel-Perfect Audit

**Figma node:** `248:1541` | **Route:** `/insights`
**Component:** `src/components/pages/insights/insights-page.tsx`
**Steps:** Same workflow.

### Task 1.13: Case Studies — Pixel-Perfect Audit

**Figma node:** `248:1917` | **Route:** `/case-studies`
**Component:** `src/components/pages/case-studies/case-studies-page.tsx`
**Steps:** Same workflow.

### Task 1.14: Contact — Pixel-Perfect Audit

**Figma node:** `249:2227` | **Route:** `/contact`
**Component:** `src/components/pages/contact/contact-page.tsx`
**Steps:** Same workflow.

---

### Task 1.15: Shared Layout — Navbar & Footer Audit

**Files:**
- `src/components/layout/navbar.tsx`
- `src/components/layout/navbar-active-links.tsx`
- `src/components/layout/mobile-menu.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/footer-cta-variant.tsx`

**Figma footer node:** `554:2310`

**Step 1:** Screenshot navbar in isolation (top 120px of homepage)
**Step 2:** Get Figma design context for navbar area
**Step 3:** Verify: logo size, nav item spacing, dropdown styling, CTA button, theme toggle, mobile hamburger
**Step 4:** Screenshot footer in isolation (bottom section of homepage)
**Step 5:** Get Figma design context for footer node `554:2310`
**Step 6:** Verify: footer layout, link columns, social icons, gradient accent, copyright text
**Step 7:** Fix all discrepancies
**Step 8:** Commit

---

### Task 1.16: Dark Mode Full Audit

**Step 1:** For every page, take dark mode screenshots at 1440px
**Step 2:** Get Figma dark mode frames (if separate dark frames exist in Figma)
**Step 3:** Verify dark mode for every page:
- Background colors correct (`#0c0c0c` body, dark card surfaces)
- Text contrast meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Brand accent `#998aff` renders correctly on dark backgrounds
- Images/icons have proper dark variants or opacity adjustments
- Borders use `--color-border-inverse-*` tokens correctly
- No white flashes or unthemed elements
- Form inputs (contact page) have proper dark styling

**Step 4:** Fix all discrepancies
**Step 5:** Commit

---

### Task 1.17: Responsive Audit (768px + 375px)

**Step 1:** For every page, take screenshots at 768px and 375px (light mode)
**Step 2:** Verify at 375px (mobile):
- Mobile menu opens/closes correctly
- No horizontal overflow (no horizontal scrollbar)
- Touch targets >= 44x44px
- Text is readable (no text smaller than 14px)
- Images scale properly (no cropping, no overflow)
- Service card rails scroll horizontally on touch
- Cards stack vertically
- Proper spacing (no cramped or oversized gaps)

**Step 3:** Verify at 768px (tablet):
- Grid layouts adapt (2-column where appropriate)
- Navigation still works (mobile menu or adapted desktop)
- Images and cards resize proportionally

**Step 4:** Fix all issues
**Step 5:** Commit

---

## Phase 2: Animation & Performance Optimization

### Task 2.1: Audit All Animations

**Files to audit:**
- `src/components/sections/services.tsx` — flip card 3D transform + horizontal scroll
- `src/components/sections/quote-rotator.tsx` — interval-driven fade transitions
- `src/components/sections/trust-authority-rail.tsx` — infinite scroll animation (IntersectionObserver)
- `src/components/sections/about.tsx` — scroll-progress bar + logo marquee
- `src/components/ui/scroll-progress-bar.tsx` — pointer drag/scroll sync
- `src/components/sections/process-step-switcher.tsx` — touch/button step switching
- `src/components/sections/testimonials.tsx` — carousel rotation
- `src/components/layout/mobile-menu.tsx` — menu open/close animation
- `src/components/layout/navbar-active-links.tsx` — dropdown transitions
- `src/app/globals.css` — `.theme-transitioning` class (200ms transition)
- `src/components/sections/featured-logos.tsx` — marquee animation

**Step 1: Read every animation component listed above**

**Step 2: Check each animation for:**
- Uses `transform` and `opacity` only (GPU-composited, no layout thrashing)
- Uses `will-change` sparingly (only on elements that actually animate)
- Respects `prefers-reduced-motion` (already in quote-rotator and trust-rail — verify ALL)
- No `setInterval` without cleanup
- No forced reflows in animation loops (reading `offsetHeight`, `getBoundingClientRect` in RAF)
- CSS animations prefer `@keyframes` over JS-driven transforms where possible
- Animations use `contain: layout` or `contain: paint` where appropriate for isolation

**Step 3: Log issues to `docs/audit/reports/animations.md`**

**Step 4: Fix each issue**

**Step 5: Commit**

```bash
git commit -m "perf(animations): optimize all animations for GPU compositing and reduced-motion"
```

---

### Task 2.2: Image Optimization

**Step 1: Audit all images in `public/`**

```bash
find public/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | wc -l
find public/ -type f -name "*.webp" | wc -l
find public/ -type f -name "*.svg" | wc -l
```

**Step 2: Check all `<img>` and Next.js `<Image>` usage**

```bash
grep -rn "<img " src/ | wc -l
grep -rn "<Image " src/ | wc -l
grep -rn "next/image" src/ | wc -l
```

**Step 3: For every raster image (PNG/JPG):**
- Convert to WebP if not already
- Verify proper `width`/`height` attributes (prevents CLS)
- Verify `loading="lazy"` on below-fold images
- Verify hero/above-fold images have `priority` prop

**Step 4: For every SVG:**
- Verify inline SVGs don't have unnecessary metadata
- Consider `<Image>` component for large SVGs for lazy loading

**Step 5: Verify Next.js `<Image>` component usage:**
- All raster images should use `next/image` (not raw `<img>`)
- `sizes` prop set correctly for responsive images
- `placeholder="blur"` with `blurDataURL` for hero images

**Step 6: Commit**

```bash
git commit -m "perf(images): convert to WebP, add proper sizing, lazy loading"
```

---

### Task 2.3: Bundle & Loading Optimization

**Step 1: Run build and analyze bundle**

```bash
pnpm build
```

Check output for:
- Total bundle size
- Largest page sizes
- Any pages > 200KB first-load JS

**Step 2: Verify `"use client"` boundaries are minimal**

Cross-reference with ARCHITECTURE.md client component inventory (16 files listed).
Grep for any new `"use client"` that shouldn't be there:

```bash
grep -rn '"use client"' src/ | wc -l
```

Every `"use client"` must be justified. No page-level client components.

**Step 3: Check dynamic imports**

Verify large client components use `next/dynamic`:
- `InsightsCatalog` already uses dynamic import (confirmed)
- `TeamMemberPopup` uses dynamic import in controller (confirmed)
- Consider: `services.tsx` (flip cards with 3D transforms — large)
- Consider: `trust-authority-rail.tsx` (animation code)

**Step 4: Font optimization**

- Verify DM Sans is self-hosted (not loaded from Google Fonts CDN)
- Verify `font-display: swap` is set
- Verify only needed weights are loaded (not the entire family)
- Check: `src/app/layout.tsx` for font configuration

**Step 5: Third-party scripts**

- Verify `@vercel/analytics` and `@vercel/speed-insights` are loaded properly
- No render-blocking third-party scripts

**Step 6: Commit**

```bash
git commit -m "perf(bundle): optimize client boundaries, dynamic imports, fonts"
```

---

### Task 2.4: Core Web Vitals Optimization

**Step 1: Run Lighthouse CI**

```bash
npx lighthouse http://localhost:3000 --output json --output html --output-path docs/audit/lighthouse-homepage
```

Target scores:
- Performance: >= 95
- Accessibility: >= 95
- Best Practices: >= 95
- SEO: >= 95

**Step 2: Check LCP (Largest Contentful Paint)**
- Hero image must have `priority` and `fetchPriority="high"`
- Hero image should be preloaded in `<head>`
- No render-blocking CSS above the fold

**Step 3: Check CLS (Cumulative Layout Shift)**
- All images have explicit `width`/`height`
- Fonts have `font-display: swap` with proper fallback metrics
- No dynamic content injection above the fold

**Step 4: Check INP (Interaction to Next Paint)**
- Click handlers are not blocking the main thread
- Heavy computations wrapped in `startTransition`
- No synchronous localStorage reads in render path

**Step 5: Fix all issues, re-run Lighthouse**

**Step 6: Commit**

```bash
git commit -m "perf(cwv): optimize LCP, CLS, INP for Core Web Vitals"
```

---

## Phase 3: Next.js Best Practices Hardening

### Task 3.1: Metadata & SEO Audit

**Step 1: Verify every page has proper metadata**

For each page in `src/components/pages/*/`:
- `title` — unique, descriptive, < 60 chars
- `description` — unique, < 160 chars
- `openGraph` — title, description, images, type
- `twitter` — card, title, description
- `canonical` — properly set
- `alternates` — if applicable

**Step 2: Verify structured data (JSON-LD)**

```bash
grep -rn "application/ld+json" src/
```

Check:
- Homepage: Organization schema
- Service pages: Service schema
- Blog posts: Article schema
- FAQ sections: FAQPage schema (already in `service-faq.tsx`)
- Case studies: Case study / Article schema

**Step 3: Verify `robots.txt` and `sitemap.xml`**

```bash
cat public/robots.txt 2>/dev/null || grep -rn "robots" src/app/
cat src/app/sitemap.ts 2>/dev/null
```

**Step 4: Fix any missing metadata**

**Step 5: Commit**

```bash
git commit -m "seo: complete metadata, structured data, and sitemap audit"
```

---

### Task 3.2: Security Headers & Middleware

**File:** `middleware.ts`

**Step 1: Read middleware.ts and verify headers**

Required headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — appropriate for the stack
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

**Step 2: Verify middleware matcher excludes static assets and API routes**

**Step 3: Fix any missing headers**

**Step 4: Commit**

```bash
git commit -m "security: verify and complete security headers in middleware"
```

---

### Task 3.3: Error Handling & Edge Cases

**Step 1: Verify error boundaries**

- `src/app/error.tsx` — global error boundary exists
- `src/app/not-found.tsx` — 404 page exists and is styled
- Loading states for each route group

**Step 2: Test error scenarios**

- Navigate to `/nonexistent-page` — should show styled 404
- What happens when Sanity is unreachable? (partnership, contact pages call `notFound()`)
- Blog post with invalid slug — should show 404

**Step 3: Verify loading states**

```bash
find src/app -name "loading.tsx" | sort
```

Every route group should have a loading state.

**Step 4: Fix any issues**

**Step 5: Commit**

```bash
git commit -m "fix: verify error boundaries, 404 pages, and loading states"
```

---

### Task 3.4: Accessibility Audit

**Step 1: Run axe-core on every page**

```bash
npx @axe-core/cli http://localhost:3000 --exit
npx @axe-core/cli http://localhost:3000/about-us --exit
# ... repeat for all routes
```

**Step 2: Manual keyboard navigation test**

For each page:
- Tab through all interactive elements
- Verify visible focus indicators
- Verify skip-to-content link
- Verify dropdown menus are keyboard accessible (Enter/Space to open, Escape to close)
- Verify mobile menu focus trap
- Verify team member popup dialog focus trap and Escape to close

**Step 3: Screen reader audit**

- Verify all images have meaningful `alt` text (or `alt=""` for decorative)
- Verify heading hierarchy (h1 → h2 → h3, no skipped levels)
- Verify ARIA labels on icon-only buttons
- Verify form labels and error messages are associated

**Step 4: Color contrast**

- Verify all text meets WCAG AA (4.5:1 body, 3:1 large text)
- Especially check: light gray text on white (`#535353` on `#ffffff` = 7.4:1 ✓)
- Check: accent text on dark backgrounds (`#998aff` on `#0c0c0c`)
- Check: white text on gradient backgrounds

**Step 5: Fix all issues**

**Step 6: Commit**

```bash
git commit -m "a11y: fix all accessibility issues from axe-core and manual audit"
```

---

### Task 3.5: Code Quality Cleanup

**Step 1: Fix known issues from audit**

- [ ] Raw hex values in `src/components/ui/icons/decorative.tsx` — replace with CSS variables
- [ ] Unused `TESTIMONIALS_QUERY` in Sanity queries — either wire up or remove
- [ ] Privacy policy fallback text "Privacy policy content is being prepared" — verify with client if acceptable
- [ ] Partnership page `notFound()` when no CMS doc — add hardcoded fallback or ensure CMS always has data
- [ ] Contact page `notFound()` when no CMS doc — same

**Step 2: Run linting and type checking**

```bash
pnpm lint
pnpm typecheck
```

Fix all errors and warnings.

**Step 3: Run tests**

```bash
pnpm test
```

Fix any failures.

**Step 4: Commit**

```bash
git commit -m "chore: fix code quality issues, lint, and type errors"
```

---

## Phase 4: Independent Codex Senior Developer Audit

### Task 4.1: Codex Full Audit

**Step 1: Run Codex audit on the entire codebase**

Use the `/codex` skill with the following audit template:

```
Review the Heroic Rankings Next.js 16 codebase as a senior web developer.
Evaluate across these dimensions:

1. **Architecture** — Is the component hierarchy clean? Are server/client boundaries correct?
2. **Performance** — Any render-blocking resources? Unnecessary re-renders? Bundle size concerns?
3. **Security** — XSS vectors? CSP issues? Unsafe HTML rendering?
4. **Accessibility** — ARIA patterns correct? Keyboard navigation complete?
5. **SEO** — Metadata complete? Structured data correct? Canonical URLs?
6. **Dark Mode** — Any unthemed elements? Contrast issues?
7. **Responsive** — Any broken layouts at common breakpoints?
8. **Code Quality** — DRY violations? Dead code? Type safety gaps?
9. **Next.js Best Practices** — Proper use of App Router patterns? Image optimization? Font loading?
10. **Sanity CMS Integration** — Graceful fallbacks? Type safety with CMS data?

For each issue found:
- Severity: Critical / Major / Minor / Suggestion
- File path and line number
- What's wrong
- How to fix it
```

**Step 2: Triage Codex findings**

Sort by severity. Fix all Critical and Major issues.

**Step 3: Fix all Critical issues**

**Step 4: Fix all Major issues**

**Step 5: Re-run Codex for validation**

Fresh Codex session — verify all Critical and Major issues are resolved.

**Step 6: Commit**

```bash
git commit -m "fix: resolve all critical and major issues from Codex audit"
```

---

### Task 4.2: Final Build Verification

**Step 1: Clean build**

```bash
rm -rf .next
pnpm build
```

Expected: Build succeeds with no warnings.

**Step 2: Production smoke test**

```bash
pnpm start &
sleep 3
```

Visit every page route and verify:
- Page loads without errors
- No console errors
- Images load
- Dark mode toggle works
- Mobile menu works
- All links navigate correctly

**Step 3: Final Lighthouse run**

```bash
npx lighthouse http://localhost:3000 --output html --output-path docs/audit/lighthouse-final
```

Target: All scores >= 95.

**Step 4: Commit final state**

```bash
git add -A
git commit -m "chore: final build verification — all pages passing"
```

**Step 5: Push to GitHub**

```bash
git push origin main
```

---

## Execution Order Summary

```
Phase 1 (Figma Pixel-Perfect):
  1.0  → Screenshot tooling setup
  1.1  → Homepage
  1.2  → About Us
  1.3  → SEO Services Hub
  1.4  → Technical SEO
  1.5  → On-Page SEO
  1.6  → Local SEO
  1.7  → Content Creation
  1.8  → E-commerce SEO
  1.9  → Keyword Strategy
  1.10 → Link Building
  1.11 → Partnership
  1.12 → Insights
  1.13 → Case Studies
  1.14 → Contact
  1.15 → Navbar & Footer
  1.16 → Dark Mode (all pages)
  1.17 → Responsive (all pages, 768px + 375px)

Phase 2 (Performance):
  2.1 → Animation audit & optimization
  2.2 → Image optimization
  2.3 → Bundle & loading optimization
  2.4 → Core Web Vitals

Phase 3 (Next.js Best Practices):
  3.1 → Metadata & SEO
  3.2 → Security headers
  3.3 → Error handling
  3.4 → Accessibility
  3.5 → Code quality cleanup

Phase 4 (Independent Audit):
  4.1 → Codex full audit + fix loop
  4.2 → Final build verification
```

**Estimated tasks:** 25 discrete tasks
**Parallelizable:** Tasks 1.1–1.14 can run in parallel (independent pages). Phase 2 and 3 tasks are mostly independent.
