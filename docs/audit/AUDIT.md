# Next.js Senior Audit

## Section Plan (Priority Order)
1. [x] Section 1 — Contact Submission Flow (`src/app/actions/contact.ts`, `src/components/pages/contact/contact-form.tsx`, `.env.example`)
2. [x] Section 2 — Global App Shell, Security Headers, and Metadata (`src/app/layout.tsx`, `next.config.ts`, `src/lib/metadata.ts`, `src/lib/site.ts`)
3. [x] Section 3 — Dynamic Content and Routing Reliability (`src/app/(pages)/insights/[slug]/page.tsx`, `src/components/pages/insights/*`, `src/data/blog-posts.ts`)
4. [x] Section 4 — Client Component Performance Hotspots (`src/components/layout/*`, `src/components/ui/scroll-progress-bar.tsx`, `src/components/sections/*` client components)
5. [x] Section 5 — SEO Surfaces (`src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, per-page metadata exports)
6. [x] Section 6 — Test/CI/DevEx Baseline (`package.json`, `eslint.config.mjs`, repo CI config)
7. [x] Remediation Task 1A — Contact Hardening (`src/app/actions/contact.ts`, `.env.example`)
8. [x] Remediation Task 1B — CSP Enforcement Baseline (`next.config.ts`, `middleware.ts`, `src/lib/csp.ts`)
9. [x] Remediation Task 2 — Behavioral Tests + CI Test Gate (`src/**/*.test.ts`, `.github/workflows/ci.yml`, `package.json`)
10. [x] Remediation Task 3 — Unified Insights Registry (`src/data/insights-registry.ts`, `src/app/(pages)/insights/[slug]/page.tsx`, `src/app/sitemap.ts`)
11. [x] Section 7 — Contact Validation Contract (`src/lib/contact-validation.ts`, `src/app/actions/contact.ts`, `src/components/pages/contact/contact-form.tsx`)
12. [x] Section 8 — Contact Reliability Hardening (`src/app/actions/contact.ts`, `.env.example`)
13. [x] Section 9 — CSP Nonce Rollout (`middleware.ts`, `src/lib/csp.ts`, `src/app/layout.tsx`, `next.config.ts`)
14. [x] Section 10 — Navigation and Content UX Consistency (`src/lib/nav-active.ts`, `src/components/layout/*`, `src/components/sections/blog.tsx`)
15. [x] Section 11 — Client Scroll Performance Hardening (`src/components/sections/services.tsx`, `src/components/sections/about.tsx`, `src/components/ui/desktop-scroll-progress.tsx`)
16. [x] Section 12 — Production Rollout Verification Scaffolding (`scripts/verify-production-config.mjs`, `docs/audit/PRODUCTION_RUNBOOK.md`)
17. [x] Section 13 — Runtime Production Verification Automation (`scripts/verify-production-runtime.mjs`, `package.json`, `docs/audit/PRODUCTION_RUNBOOK.md`)
18. [x] Section 14 — Homepage Mobile Parity (Hero First Fold) (`src/components/sections/hero.tsx`)
19. [x] Section 15 — Homepage Mobile Parity (Services Carousel) (`src/components/sections/services.tsx`, `public/figma/services/card-link-building.png`)
20. [x] Section 16 — Homepage Mobile Parity (About Block) (`src/components/sections/about.tsx`)
21. [x] Section 17 — Homepage Mobile Parity (Team Block) (`src/components/sections/team.tsx`)
22. [x] Section 18 — Homepage Mobile Parity (Stats + Featured Logos) (`src/components/sections/stats.tsx`, `src/components/sections/featured-logos.tsx`)
23. [x] Section 19 — Homepage Mobile Parity (Case Studies Block) (`src/components/sections/case-studies.tsx`)
24. [x] Section 20 — Homepage Mobile Parity (Testimonials Block) (`src/components/sections/testimonials.tsx`)
25. [x] Section 21 — Homepage Mobile Parity (Services Image Fidelity) (`src/components/sections/services.tsx`, `public/figma/services/card-*.png`)
26. [x] Section 22 — Homepage Mobile Parity (Testimonials Logo Balance) (`src/components/sections/testimonials.tsx`, `docs/audit/MOBILE_PARITY_PLAYBOOK.md`)
27. [x] Section 22B — Testimonials Logo Balance QA Retune (`src/components/sections/testimonials.tsx`)
28. [x] Section 22C — Testimonials Logo Clean Sizing Fix (`src/components/sections/testimonials.tsx`)
29. [x] Section 23 — About Us Mobile Parity (Hero) (`src/components/sections/about-us-hero.tsx`, `src/app/globals.css`)
30. [x] Section 24 — About Us Mobile Parity (Trust + Process) (`src/components/sections/about-us-trust.tsx`, `src/components/sections/about-us-process.tsx`)
31. [x] Section 25 — SEO Services Mobile Parity (Services Rail Image Fidelity) (`src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`)
32. [x] Section 26 — SEO Services Interaction Parity (Rotating Cards: Mobile + Desktop) (`src/components/pages/seo-services/seo-services-page.tsx`, `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`, `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx`, `src/app/globals.css`)
33. [x] Section 27 — Remaining Non-Insights/Case-Studies Hero Mobile Parity (`src/components/pages/local-seo/local-seo-page.tsx`, `src/components/pages/on-page-seo/on-page-seo-page.tsx`, `src/components/pages/technical-seo/technical-seo-page.tsx`, `src/components/pages/link-building/link-building-page.tsx`, `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx`, `src/components/pages/content-creation/content-creation-page.tsx`, `src/components/pages/partnership/partnership-page.tsx`)
34. [ ] Section 28 — About Us Mobile Parity (CTA + Team) (`src/components/sections/about-us-cta.tsx`, `src/components/sections/about-us-team.tsx`)
35. [x] Section 29A — Mobile Deep Audit (/about-us) (`src/components/pages/about-us/about-us-page.tsx`, `src/components/sections/about-us-cta.tsx`, `src/components/sections/about-us-team.tsx`, `src/components/layout/footer.tsx`)
36. [x] Section 29B.1 — Mobile Deep Audit (/seo-services) (`src/components/pages/seo-services/seo-services-page.tsx`, `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`)
37. [x] Section 29B.2a — Mobile Deep Audit (/local-seo) (`src/components/pages/local-seo/local-seo-page.tsx`)
38. [x] Section 29B.2b — Mobile Deep Audit (Remaining Routes) (`src/app/page.tsx`, `src/app/(pages)/*/page.tsx`, `src/components/sections/*`)
39. [x] Section 29B.2b.1 — Mobile Deep Audit (Service Hero Crop Retune Batch) (`src/components/pages/on-page-seo/on-page-seo-page.tsx`, `src/components/pages/technical-seo/technical-seo-page.tsx`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx`, `src/components/pages/link-building/link-building-page.tsx`, `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx`, `src/components/pages/content-creation/content-creation-page.tsx`)
40. [x] Section 29B.2b.2 — Mobile Deep Audit (Homepage + Remaining Public Routes) (`src/components/pages/home/home-page.tsx`, `src/components/pages/case-studies/case-studies-page.tsx`, `src/components/pages/insights/insights-page.tsx`, `src/components/pages/insights/blog-post-detail-content.tsx`, `src/components/pages/contact/contact-page.tsx`, `src/components/pages/privacy-policy/privacy-policy-page.tsx`, `src/components/pages/partnership/partnership-page.tsx`)
41. [x] Section 29C — Figma Pixel Parity Verification (/on-page-seo, node `581:43`) (`src/components/pages/on-page-seo/on-page-seo-page.tsx`)
42. [x] Section 29D — Figma Pixel Parity Verification (/technical-seo, nodes `607:25`, `607:39`) (`src/components/pages/technical-seo/technical-seo-page.tsx`)
43. [x] Section 29E — Figma Pixel Parity Verification (/link-building, node `607:3323`)
44. [x] Section 29F — Figma Pixel Parity Verification (/ecommerce-seo, node `607:1392`)
45. [x] Section 29G — Figma Pixel Parity Verification (/keyword-strategy)
46. [x] Section 29H — Figma Pixel Parity Verification (/content-creation)
47. [x] Section 29E.1 — Figma Pixel Parity Verification (/local-seo hero transform compatibility, node `607:765`)
48. [x] Section 29H.1 — Figma Pixel Parity Verification (/content-creation hero, node `607:2005`)
49. [x] Section 29H.2 — Figma Pixel Parity Verification (/content-creation post-hero sections, node `607:2005`)
50. [x] Section 29H.3 — Content Creation Mobile Solutions Text-Center Retune (`src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx`)
51. [x] Section 29I — Link Building Mobile Hero Card Text-Center Retune (`src/components/pages/link-building/link-building-page.tsx`)
52. [x] Section 29I.1 — Link Building Mobile Hero Text-Center Hardening (`src/components/pages/link-building/link-building-page.tsx`)
53. [x] Section 29H.4 — Content Creation Mobile Solutions Text-Center Hardening (`src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx`)
54. [x] Section 29H.5 — Content Creation Mobile Solutions Frame Fit Retune (`src/components/pages/content-creation/content-creation-page.tsx`)

## Repo Snapshot
- Next.js + React: `next@16.1.6`, `react@19.2.3`, `react-dom@19.2.3` (`package.json:13-16`).
- Router mode: App Router (route files under `src/app/**`, including `src/app/page.tsx` and `src/app/(pages)/*`).
- Type safety: strict TS with `noUncheckedIndexedAccess` (`tsconfig.json:7-8`).
- Linting baseline: Next Core Web Vitals + TypeScript presets (`eslint.config.mjs:1-8`).
- Security headers baseline exists in config with enforced CSP (`next.config.ts:52-68`).
- Script baseline includes `lint`, `typecheck`, and `test` (`package.json:5-12`).
- Note: early-section findings are historical snapshots; current status is tracked by later remediation task entries.

## Section 1 — Contact Submission Flow

### Context
Audited the user-input path from client form to server action and outbound delivery hook:
- `src/components/pages/contact/contact-form.tsx`
- `src/app/actions/contact.ts`
- `.env.example`

### Findings

#### P0
- None in this section.

#### P1
1. What: Delivery remains deployment-sensitive; submissions are now blocked when webhook configuration is missing.
Where: `src/app/actions/contact.ts:23`, `src/app/actions/contact.ts:61-63`, `src/app/actions/contact.ts:162-166`, `.env.example:4-5`.
Why: Without `CONTACT_FORM_WEBHOOK_URL`, production submissions do not leave the app; this is lead-loss risk if env is not set.
Fix: Implemented hard-fail response and added `.env.example` variable so missing config is explicit.
Verification: Submit form without `CONTACT_FORM_WEBHOOK_URL` and confirm user gets the unavailable message.
Status: Open until deployment config is wired.

2. What: Contact dispatch is a single network attempt with no retry/durable queue.
Where: `src/app/actions/contact.ts:65-83`.
Why: Transient webhook downtime returns an error and drops submissions permanently.
Fix: Added timeout/exception handling in this section; queue/retry remains TODO.
Verification: Point webhook to an endpoint returning `500` and verify immediate error response.
Status: Open.

3. What: Input abuse protections were missing (unbounded payload shape + no anti-bot friction).
Where: `src/app/actions/contact.ts:93-150`, `src/components/pages/contact/contact-form.tsx:78-92`, `src/components/pages/contact/contact-form.tsx:126`, `src/components/pages/contact/contact-form.tsx:162`, `src/components/pages/contact/contact-form.tsx:191`, `src/components/pages/contact/contact-form.tsx:247`.
Why: Unbounded/invalid payloads increase abuse surface and can overload downstream delivery.
Fix: Implemented honeypot field, submit-timing check, required/optional type guards, option allowlist, and length limits on both server and client.
Verification: `npm run lint` and `npm run build` pass; manual submit with oversized fields now returns validation errors.
Status: Fixed in this section.

#### P2
1. What: Client and server validation constants are duplicated.
Where: `src/app/actions/contact.ts:17-21`, `src/components/pages/contact/contact-form.tsx:13-16`.
Why: Future edits can drift, causing UX/server mismatch.
Fix: TODO to extract shared schema/constants.
Verification: Add schema unit tests once extracted.
Status: Open.

2. What: Client email validation previously flagged only empty input.
Where: `src/components/pages/contact/contact-form.tsx:56-60`.
Why: Invalid-format emails could pass client UX checks and fail only server-side.
Fix: Added regex validation before submit feedback.
Verification: Enter `abc` in email field, blur, and confirm error styling.
Status: Fixed in this section.

#### P3
- None in this section.

### Changes Made
- Added webhook dispatch, payload normalization, anti-spam checks, and bounded validation in `src/app/actions/contact.ts`.
- Added hidden anti-spam fields, stricter email feedback, and max-length constraints in `src/components/pages/contact/contact-form.tsx`.
- Added `CONTACT_FORM_WEBHOOK_URL` to `.env.example`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run build` -> pass (noted 3 non-blocking CSS optimizer warnings during build output).

## Section 2 — Global App Shell, Security Headers, and Metadata

### Context
Audited global metadata, URL normalization, JSON-LD injection, and header policy:
- `src/app/layout.tsx`
- `src/lib/metadata.ts`
- `src/lib/site.ts`
- `next.config.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

### Findings

#### P0
- None in this section.

#### P1
1. What: CSP is still report-only and allows inline script/style.
Where: `next.config.ts:63-64`, `src/app/layout.tsx:89-92`.
Why: Report-only mode does not actively block script injection in production.
Fix: Logged as high-priority TODO; no enforcement flip yet to avoid unvalidated breakage.
Verification: Inspect response headers and confirm `Content-Security-Policy-Report-Only` is still emitted.
Status: Open.

2. What: Per-page metadata risked dropping Open Graph/Twitter richness when child metadata overwrote root object fields.
Where: `src/lib/metadata.ts:29-50`, `src/app/layout.tsx:39-60`.
Why: Missing OG image/card/siteName weakens social previews and SEO share quality.
Fix: Added complete OG/Twitter fields in `createPageMetadata` so route-level metadata remains share-complete.
Verification: `npm run build` passes; route metadata now includes `images`, `card`, and `siteName`.
Status: Fixed in this section.

3. What: Invalid `NEXT_PUBLIC_SITE_URL` values could crash metadata initialization.
Where: `src/lib/site.ts:4-23`, `src/app/layout.tsx:30`.
Why: `new URL(SITE_URL)` fails hard on malformed values, breaking app startup.
Fix: Added safe URL normalization with protocol guard and fallback.
Verification: `npm run lint` and `npm run build` pass with updated parsing logic.
Status: Fixed in this section.

#### P2
1. What: Sitemap `lastModified` value is hardcoded to a date string.
Where: `src/app/sitemap.ts:5-7`, `src/app/sitemap.ts:28-31`.
Why: Date becomes stale over time and weakens sitemap freshness signaling.
Fix: Logged TODO to derive value from build/deploy metadata.
Verification: Check generated `/sitemap.xml` and confirm date currently stays static.
Status: Open.

#### P3
- None in this section.

### Changes Made
- Expanded shared metadata helper in `src/lib/metadata.ts` with canonical path normalization, full Open Graph payload, and Twitter card/images defaults.
- Hardened site URL normalization in `src/lib/site.ts` to prevent malformed env crashes and enforce HTTP(S).

### Verification Commands
- `npm run lint` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 26 — SEO Services Interaction Parity (Rotating Cards: Mobile + Desktop)

### Context
Implemented card-flip interaction parity for the SEO Services cards to match the click-to-rotate behavior on both breakpoints:
- `src/components/pages/seo-services/seo-services-page.tsx`
- `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx`
- `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`
- `src/app/globals.css`

### Findings

#### P0
- None in this section.

#### P1
1. What: Desktop SEO cards were not click-persistent; rotation depended on transient hover/focus states.
Where: `src/app/globals.css:577-602`, `src/components/pages/seo-services/seo-services-page.tsx:260-263`, `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx:27-45`, `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx:89-97`.
Why: Users on non-hover/touch-first devices could not reliably keep card backs open for reading.
Fix: Added client-side `activeCardIndex` flip state on desktop cards and wired it to an explicit toggle button with `is-flipped` class.
Verification: Click desktop card CTA button and confirm card remains flipped until toggled back.
Status: Fixed in this section.

2. What: Mobile SEO rail cards rendered front-face-only presentation with no back-face rotation state.
Where: `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:210-281`, `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:243-269`, `src/app/globals.css:577-605`.
Why: Mobile users could not access detailed service copy expected from the rotated state.
Fix: Added front/back faces to mobile cards, added tap-to-toggle state (`activeCardIndex`), and switched card CTA control to rotation button behavior.
Verification: On mobile viewport, tap card CTA button and confirm front/back rotation and reverse toggle behavior.
Status: Fixed in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Added dedicated client desktop grid component with click/hover/focus flip state:
  - `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx:1-102`
- Replaced in-page desktop card map with the new interactive grid component:
  - `src/components/pages/seo-services/seo-services-page.tsx:7`, `src/components/pages/seo-services/seo-services-page.tsx:24`, `src/components/pages/seo-services/seo-services-page.tsx:260-263`
- Upgraded mobile rail cards to two-face rotating cards with per-card back content:
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:13-28`
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:172-280`
- Extended shared SEO card CSS selectors to support persistent `.is-flipped` state:
  - `src/app/globals.css:577-605`

### Verification Commands
- `npm run lint -- src/components/pages/seo-services/seo-services-page.tsx src/components/pages/seo-services/seo-services-mobile-services-rail.tsx src/components/pages/seo-services/seo-services-desktop-services-grid.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (existing non-blocking CSS optimizer warnings remain unchanged).

## Section 27 — Remaining Non-Insights/Case-Studies Hero Mobile Parity

### Context
Implemented mobile hero parity for the remaining inner service/partnership pages (user-scoped non-insights/case-studies hero surfaces):
- `src/components/pages/local-seo/local-seo-page.tsx`
- `src/components/pages/on-page-seo/on-page-seo-page.tsx`
- `src/components/pages/technical-seo/technical-seo-page.tsx`
- `src/components/pages/link-building/link-building-page.tsx`
- `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx`
- `src/components/pages/keyword-strategy/keyword-strategy-page.tsx`
- `src/components/pages/content-creation/content-creation-page.tsx`
- `src/components/pages/partnership/partnership-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Multiple page heroes used fixed-height overlay composition on mobile, which constrained CTA/copy readability and produced brittle image crops.
Where: `src/components/pages/local-seo/local-seo-page.tsx:171-209`, `src/components/pages/on-page-seo/on-page-seo-page.tsx:160-197`, `src/components/pages/technical-seo/technical-seo-page.tsx:192-230`, `src/components/pages/link-building/link-building-page.tsx:238-275`, `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:158-194`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:191-230`, `src/components/pages/content-creation/content-creation-page.tsx:173-211`.
Why: These hero blocks are above-the-fold conversion surfaces; mobile overflow/crop instability directly impacts first-impression clarity and CTA reachability.
Fix: Converted each hero to a responsive stacked mobile pattern (copy + CTA first, image rail below) while preserving desktop geometry behind `lg:*` classes in the same container.
Verification: Mobile hero branches now use `max-w-[298px]` content shell + `h-[331px]` image region with desktop-specific classes retained for `lg` breakpoints.
Status: Fixed in this section.

2. What: Partnership hero used desktop-first dimensions (`635px` container / `480px` gradient panel) on mobile.
Where: `src/components/pages/partnership/partnership-page.tsx:367-381`.
Why: The oversized hero panel caused inefficient first fold usage and inconsistent statue framing on phones.
Fix: Added mobile-specific hero geometry (`350x360`) and statue crop offsets while keeping original desktop dimensions at `lg`.
Verification: Partnership hero now scales to mobile-safe dimensions with preserved desktop dimensions under `lg:*`.
Status: Fixed in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Applied mobile-stacked hero composition with preserved desktop branch behavior in:
  - `src/components/pages/local-seo/local-seo-page.tsx:171-209`
  - `src/components/pages/on-page-seo/on-page-seo-page.tsx:160-197`
  - `src/components/pages/technical-seo/technical-seo-page.tsx:192-230`
  - `src/components/pages/link-building/link-building-page.tsx:238-275`
  - `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:158-194`
  - `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:191-230`
  - `src/components/pages/content-creation/content-creation-page.tsx:173-211`
- Applied partnership-specific mobile hero geometry/crop correction:
  - `src/components/pages/partnership/partnership-page.tsx:367-381`

### Verification Commands
- `npm run lint -- src/components/pages/local-seo/local-seo-page.tsx src/components/pages/on-page-seo/on-page-seo-page.tsx src/components/pages/technical-seo/technical-seo-page.tsx src/components/pages/link-building/link-building-page.tsx src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx src/components/pages/keyword-strategy/keyword-strategy-page.tsx src/components/pages/content-creation/content-creation-page.tsx src/components/pages/partnership/partnership-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (existing non-blocking CSS optimizer warnings remain unchanged).

## Section 29A — Mobile Deep Audit (/about-us)

### Context
Performed route-level mobile audit for `/about-us` after hero parity rollout:
- `src/components/pages/about-us/about-us-page.tsx`
- `src/components/sections/about-us-cta.tsx`
- `src/components/sections/about-us-team.tsx`
- `src/components/layout/footer.tsx`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
1. What: Team card images were requested with `50vw` on all sub-`lg` viewports even when rendered as single-column full-width cards.
Where: `src/components/sections/about-us-team.tsx:63-74`.
Why: On `390px` mobile widths this under-requests image candidates, reducing sharpness on high-DPR devices.
Fix: Updated `sizes` to `\"(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw\"` so one-column mobile cards receive correct image candidates.
Verification: `npm run lint -- src/components/sections/about-us-team.tsx src/components/sections/about-us-cta.tsx src/components/pages/about-us/about-us-page.tsx src/components/layout/footer.tsx` and `npm run typecheck` both pass.
Status: Fixed in this section.

#### P3
1. What: Mobile About Us CTA intro copy remains very dense in a single `type-h3` block.
Where: `src/components/sections/about-us-cta.tsx:10-21`.
Why: Dense copy at hero-adjacent conversion area can reduce scan speed and CTA comprehension on smaller phones.
Fix: Logged follow-up for content-density tune (split headline/body and tighten rhythm per Figma copy hierarchy).
Verification: Visual audit on `/about-us` mobile viewport.
Status: Open.

### Changes Made
- Tuned About Us team image `sizes` for accurate mobile candidate selection:
  - `src/components/sections/about-us-team.tsx:71`

### Verification Commands
- `npm run lint -- src/components/sections/about-us-team.tsx src/components/sections/about-us-cta.tsx src/components/pages/about-us/about-us-page.tsx src/components/layout/footer.tsx` -> pass.
- `npm run typecheck` -> pass.

## Section 29B.1 — Mobile Deep Audit (/seo-services)

### Context
Performed route-level mobile audit for `/seo-services` with focus on the mobile services rail interaction and image delivery:
- `src/components/pages/seo-services/seo-services-page.tsx`
- `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
1. What: Mobile card model carried an unused `description` field across all entries.
Where: `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:13-27`, `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:30-166`.
Why: Dead duplicated data increases maintenance drift risk during future content edits.
Fix: Removed unused `description` from card type and all descriptors.
Verification: `npm run lint -- src/components/pages/seo-services/seo-services-mobile-services-rail.tsx src/components/pages/seo-services/seo-services-page.tsx` and `npm run typecheck` pass.
Status: Fixed in this section.

2. What: First visible mobile service card image did not explicitly receive high-priority fetch treatment.
Where: `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:226-235`.
Why: Above-the-fold hero-adjacent card can load later than intended on slower mobile networks.
Fix: Marked first rail image as priority (`priority={index === 0}`) while leaving remaining cards lazy.
Verification: `npm run lint -- src/components/pages/seo-services/seo-services-mobile-services-rail.tsx src/components/pages/seo-services/seo-services-page.tsx` and `npm run typecheck` pass.
Status: Fixed in this section.

#### P3
- None in this section.

### Changes Made
- Removed dead mobile card descriptor field and associated values:
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:13-27`
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:30-166`
- Prioritized first visible mobile rail image:
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:226-235`

### Verification Commands
- `npm run lint -- src/components/pages/seo-services/seo-services-mobile-services-rail.tsx src/components/pages/seo-services/seo-services-page.tsx` -> pass.
- `npm run typecheck` -> pass.

## Section 29B.2a — Mobile Deep Audit (/local-seo)

### Context
Performed route-level mobile audit for `/local-seo` after hero/mobile updates:
- `src/components/pages/local-seo/local-seo-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- No code changes required for this route in this audit slice.

### Verification Commands
- Playwright mobile route snapshot on `http://localhost:3000/local-seo` reviewed against section hierarchy and control accessibility tree.
- Existing latest checks for this route remain green from Section 27:
  - `npm run lint -- src/components/pages/local-seo/local-seo-page.tsx ...` -> pass.
  - `npm run typecheck` -> pass.
  - `npm run build` -> pass.

## Section 29B.2b.1 — Mobile Deep Audit (Service Hero Crop Retune Batch)

### Context
Audited mobile hero behavior route-by-route for inner service pages and applied corrective retunes where the subject framing remained over-cropped:
- `src/components/pages/on-page-seo/on-page-seo-page.tsx`
- `src/components/pages/technical-seo/technical-seo-page.tsx`
- `src/components/pages/keyword-strategy/keyword-strategy-page.tsx`
- `src/components/pages/link-building/link-building-page.tsx`
- `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx`
- `src/components/pages/content-creation/content-creation-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Three service heroes still used a generic high-zoom mobile crop that cut key subject areas (face/body on statue hero, basket body on eCommerce hero).
Where: `src/components/pages/link-building/link-building-page.tsx:264-273`, `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:181-190`, `src/components/pages/content-creation/content-creation-page.tsx:198-207`.
Why: These are first conversion surfaces on mobile; poor framing weakens visual quality and design parity despite prior structural hero fixes.
Fix: Replaced generic mobile crop transforms with page-specific mobile crop geometry while preserving all `lg:*` desktop transforms.
Verification: Playwright mobile captures after retune (`tmp/mobile-audit/link-building-hero-image-zone-final.png`, `tmp/mobile-audit/ecommerce-seo-hero-image-zone-final-v2.png`, `tmp/mobile-audit/content-creation-hero-image-zone-final.png`) show improved subject framing with unchanged desktop classes.
Status: Fixed in this section.

#### P2
1. What: No additional mobile hero defects were found on `/on-page-seo`, `/technical-seo`, and `/keyword-strategy` during this slice.
Where: `src/components/pages/on-page-seo/on-page-seo-page.tsx:160-197`, `src/components/pages/technical-seo/technical-seo-page.tsx:192-230`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:191-230`.
Why: These routes still required explicit verification to avoid false completion of Section `29B.2b`.
Fix: Completed runtime Playwright checks and retained existing implementation.
Verification: Top-fold and hero-zone screenshots reviewed at `390x844` (`tmp/mobile-audit/on-page-seo-top.png`, `tmp/mobile-audit/technical-seo-top.png`, `tmp/mobile-audit/keyword-strategy-top.png` plus hero-zone captures).
Status: Fixed (verification complete, no code change required).

#### P3
- None in this section.

### Changes Made
- Retuned mobile hero image crop transforms in:
  - `src/components/pages/link-building/link-building-page.tsx:267`
  - `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:184`
  - `src/components/pages/content-creation/content-creation-page.tsx:201`
- Verified `/on-page-seo`, `/technical-seo`, and `/keyword-strategy` with no code updates needed in this slice.

### Verification Commands
- `npm run lint -- src/components/pages/link-building/link-building-page.tsx src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx src/components/pages/content-creation/content-creation-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (existing non-blocking CSS optimizer warnings remain unchanged).
- Playwright mobile checks (`390x844`) for top fold + hero image zones across six audited routes -> pass.

## Section 29B.2b.2 — Mobile Deep Audit (Homepage + Remaining Public Routes)

### Context
Completed the remaining mobile route audit sweep and applied one local performance fix:
- `src/components/pages/home/home-page.tsx`
- `src/components/pages/case-studies/case-studies-page.tsx`
- `src/components/pages/insights/insights-page.tsx`
- `src/components/pages/insights/blog-post-detail-content.tsx`
- `src/components/pages/contact/contact-page.tsx`
- `src/components/pages/privacy-policy/privacy-policy-page.tsx`
- `src/components/pages/partnership/partnership-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
1. What: Case-studies card media used a fixed `sizes="413px"` hint even on mobile-width cards.
Where: `src/components/pages/case-studies/case-studies-page.tsx:116-123`.
Why: On small screens this can request larger-than-rendered image candidates, increasing mobile image transfer cost for a high-visibility listing page.
Fix: Replaced static `sizes` value with responsive breakpoints aligned to mobile/tablet/desktop card widths.
Verification: `npm run lint -- src/components/pages/case-studies/case-studies-page.tsx` and `npm run typecheck` pass; Playwright mobile route snapshot confirms card layout remains unchanged.
Status: Fixed in this section.

2. What: No additional mobile layout defects were found across `/`, `/insights`, `/insights/market-research-guide`, `/contact`, `/privacy-policy`, `/partnership`, and `/navbar-preview`.
Where: `src/components/pages/home/home-page.tsx:23-40`, `src/components/pages/insights/insights-page.tsx:31-50`, `src/components/pages/contact/contact-page.tsx:16-40`, `src/components/pages/privacy-policy/privacy-policy-page.tsx:14-56`, `src/components/pages/partnership/partnership-page.tsx:355-383`.
Why: These routes were still pending in Section `29B.2b` and required explicit runtime confirmation before closing the full-route mobile audit pass.
Fix: Completed Playwright `390x844` snapshots and overflow checks; retained existing implementation.
Verification: Route-level overflow probe returned `0px` on all audited routes; screenshots reviewed for hero/heading/CTA integrity.
Status: Fixed (verification complete, no code change required).

#### P3
- None in this section.

### Changes Made
- Updated case-study card image candidate hinting for responsive mobile/tablet delivery:
  - `src/components/pages/case-studies/case-studies-page.tsx:121`
- Completed no-change verification for the remaining public routes in this pass.

### Verification Commands
- `npm run lint -- src/components/pages/link-building/link-building-page.tsx src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx src/components/pages/content-creation/content-creation-page.tsx src/components/pages/case-studies/case-studies-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (existing non-blocking CSS optimizer warnings remain unchanged).
- Playwright mobile route sweep (`390x844`) on `/`, `/case-studies`, `/insights`, `/insights/market-research-guide`, `/contact`, `/privacy-policy`, `/partnership`, `/navbar-preview` -> pass with `0px` horizontal overflow.

## Section 29C — Figma Pixel Parity Verification (/on-page-seo, node `581:43`)

### Context
Performed a route-specific pixel parity verification pass for `/on-page-seo` against Figma frame `581:43`:
- `src/components/pages/on-page-seo/on-page-seo-page.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=581:43`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero typography widths and statue crop geometry needed to match the latest Figma mobile frame values exactly.
Where: `src/components/pages/on-page-seo/on-page-seo-page.tsx:152-157`, `src/components/pages/on-page-seo/on-page-seo-page.tsx:184-190`.
Why: This is the first conversion surface on `/on-page-seo`; drift here is immediately visible and breaks page-level parity.
Fix: Applied Figma-matched hero constraints (`max-w-[294px]` for title/subtitle), image crop transforms (`left-[-19.96%] top-[-4.31%] h-[136.64%] w-[208.69%]`), and mobile `sizes` hint (`380px`).
Verification:
- Playwright mobile runtime probe at `393x852` returned `h1.width=294`, `subtitle.width=294`, matching crop classes, and `overflowX=0`.
- Full-page mobile capture: `output/playwright/on-page-seo-mobile-393-current.png`.
Status: Fixed in this section.

#### P2
1. What: No additional `/on-page-seo` parity defects were detected in the desktop branch after mobile retune.
Where: `src/components/pages/on-page-seo/on-page-seo-page.tsx:160-197`.
Why: Desktop geometry needed explicit regression validation after mobile-scoped updates in shared JSX blocks.
Fix: Verified and retained existing `lg:*` branch values; no further edits required.
Verification: Desktop capture at `1440x900` (`output/playwright/on-page-seo-desktop-1440-current.png`) and runtime probe showed stable desktop dimensions with `overflowX=0`.
Status: Fixed (verification complete, no additional code change required).

#### P3
- None in this section.

### Changes Made
- Finalized Figma-matched `/on-page-seo` hero mobile geometry in:
  - `src/components/pages/on-page-seo/on-page-seo-page.tsx:152-157`
  - `src/components/pages/on-page-seo/on-page-seo-page.tsx:184-190`
- Completed mobile + desktop runtime parity verification for this route (no extra non-hero edits required).

### Verification Commands
- `npm run lint -- src/components/pages/on-page-seo/on-page-seo-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/on-page-seo` with geometry probe -> pass (`h1/subtitle width=294`, crop transform match, `overflowX=0`).
  - `1440x900` desktop regression capture -> pass (`overflowX=0`, hero desktop branch intact).

## Section 29D — Figma Pixel Parity Verification (/technical-seo, nodes `607:25`, `607:39`)

### Context
Performed route-level Figma parity verification for `/technical-seo` against hero nodes `607:25` (text block) and `607:39` (hero image crop):
- `src/components/pages/technical-seo/technical-seo-page.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:25`, `nodeId=607:39`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero text geometry did not match the current Figma frame widths and spacing for the top fold.
Where: `src/components/pages/technical-seo/technical-seo-page.tsx:182-189`.
Why: This section is the first conversion surface on `/technical-seo`; width/spacing drift is visible immediately and breaks page-level parity.
Fix: Updated hero section top spacing and text width constraints to Figma values (`pt-[60px]`, title `max-w-[294px]`, subtitle `max-w-[212px]`) while preserving desktop values via `lg:*`.
Verification:
- Playwright runtime probe at `380x840` returned `sectionPaddingTop=60px`, `h1.width=294`, `h1.fontSize=38px`, `h1.letterSpacing=-0.76px`, `subtitle.width=212`, `subtitle.fontSize=16px`, `subtitle.lineHeight=20.8px`.
- Capture: `tmp/technical-seo-node-607-25-mobile-after.png`.
Status: Fixed in this section.

2. What: Mobile hero image crop was vertically offset, cutting the top of the building compared with Figma node `607:39`.
Where: `src/components/pages/technical-seo/technical-seo-page.tsx:216-223`.
Why: The hero image is the main visual anchor in the first fold; incorrect crop makes the section look visibly off-spec on phones.
Fix: Replaced mobile crop transforms with Figma values (`left-[-36.81%] top-0 h-full w-[202.46%]`) while keeping desktop `lg:*` crop unchanged.
Verification:
- Playwright style probe on `393x852` returned `top=0px`, `height=331px` in the `331px` container, confirming full-height crop placement.
- Captures: `tmp/technical-seo-node-607-39-mobile-after.png`, `tmp/technical-seo-node-607-39-mobile-full-after.png`.
Status: Fixed in this section.

#### P2
1. What: Desktop hero branch needed explicit regression confirmation after mobile-specific updates in shared JSX.
Where: `src/components/pages/technical-seo/technical-seo-page.tsx:182-189`.
Why: Mobile edits in shared component blocks can unintentionally alter desktop layout.
Fix: Kept desktop constraints unchanged (`lg:pt-[100px]`, `lg:max-w-[857px]`, `lg:max-w-[688px]`) and verified runtime output.
Verification:
- Playwright runtime probe at `1440x900` returned `sectionPaddingTop=100px`, `h1Width=857`, `subtitleWidth=688`.
- Capture: `tmp/technical-seo-node-607-25-desktop-after.png`.
Status: Fixed (verification complete, no further code change required).

#### P3
- None in this section.

### Changes Made
- Updated Figma-matched mobile hero text constraints for `/technical-seo`:
  - `src/components/pages/technical-seo/technical-seo-page.tsx:182-189`
- Updated Figma-matched mobile hero image crop for `/technical-seo`:
  - `src/components/pages/technical-seo/technical-seo-page.tsx:216-223`
- Verified desktop hero branch remains unchanged.

### Verification Commands
- `npm run lint -- src/components/pages/technical-seo/technical-seo-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- Playwright:
  - `380x840` and `393x852` on `http://127.0.0.1:3000/technical-seo` with geometry/style probes -> pass (Figma values matched for text + image crop).
  - `1440x900` desktop regression probe -> pass (desktop widths/spacing unchanged).

## Section 29E — Figma Pixel Parity Verification (/link-building, node `607:3323`)

### Context
Performed route-specific pixel parity verification for `/link-building` against Figma node `607:3323`:
- `src/components/pages/link-building/link-building-page.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:3323`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero text geometry and copy wrapping were not locked to the latest Figma node values.
Where: `src/components/pages/link-building/link-building-page.tsx:230-241`.
Why: This first-fold content is a primary conversion surface; width and line-break drift is immediately visible on phones.
Fix: Set mobile title width to `max-w-[294px]`, subtitle width to `max-w-[220px]`, and aligned subtitle copy flow (`Boost Authority. Improve Keyword Rankings. Increase Organic Traffic.` with mobile-only line break after the first sentence).
Verification:
- Playwright runtime probe at `393x852` returned `sectionPaddingTop=60px`, `h1.width=294`, `h1.fontSize=38px`, `h1.letterSpacing=-0.76px`, `subtitle.width=220`, `subtitle.fontSize=16px`, `subtitle.lineHeight=20.8px`, `overflowX=0`.
Status: Fixed in this section.

2. What: Mobile hero image crop did not match Figma’s statue framing for node `607:3323`.
Where: `src/components/pages/link-building/link-building-page.tsx:269-273`.
Why: The hero visual anchor appeared off-spec on mobile due to crop drift.
Fix: Replaced mobile crop transform with Figma-aligned values: `left-[3.41%] top-[-11.48%] h-[132.66%] w-[93.19%]`, keeping desktop `lg:*` crop unchanged.
Verification:
- Playwright style probe at `393x852` returned computed image geometry consistent with the updated crop (`left=12.2031px`, `top=-37.9844px`, `width=333.609px`, `height=439.094px`) inside the `h-[331px]` container.
Status: Fixed in this section.

#### P2
1. What: Desktop hero branch required explicit non-regression validation after mobile hero updates in shared JSX blocks.
Where: `src/components/pages/link-building/link-building-page.tsx:228-235`, `src/components/pages/link-building/link-building-page.tsx:272`.
Why: Mobile-scoped class edits can unintentionally affect desktop dimensions.
Fix: Preserved desktop constraints (`lg:pt-[120px]`, `lg:max-w-[857px]`, `lg:max-w-[688px]`, desktop image crop values) and verified at runtime.
Verification:
- Playwright runtime probe at `1440x900` returned `sectionPaddingTop=120px`, `h1Width=857`, `subtitleWidth=688`, `overflowX=0`.
Status: Fixed (verification complete, no further code change required).

#### P3
- None in this section.

### Changes Made
- Updated `/link-building` hero mobile typography widths and subtitle line flow:
  - `src/components/pages/link-building/link-building-page.tsx:230-241`
- Updated `/link-building` hero mobile image crop to Figma node values while preserving desktop `lg:*` crop:
  - `src/components/pages/link-building/link-building-page.tsx:269-273`
- Completed mobile + desktop runtime parity verification for this route.

### Verification Commands
- `npm run lint -- src/components/pages/link-building/link-building-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/link-building` with geometry/style probe -> pass (Figma mobile text widths and crop verified, `overflowX=0`).
  - `1440x900` desktop regression probe -> pass (desktop widths/spacing unchanged, `overflowX=0`).

## Section 29E.1 — Figma Pixel Parity Verification (/local-seo hero transform compatibility, node `607:765`)

### Context
Performed targeted hero-image parity + runtime compatibility validation for `/local-seo` against Figma node `607:765` after user-reported mobile orientation drift:
- `src/components/pages/local-seo/local-seo-page.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:765` (hero image snippet includes `"-scale-y-100 flex-none rotate-180 w-full"`)

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero image orientation relied on combined rotate/scale utility properties that can render inconsistently on some mobile browsers, producing wrong-side/wrong-rotation reports.
Where: `src/components/pages/local-seo/local-seo-page.tsx:198-200`.
Why: This is an above-the-fold conversion surface; transform inconsistency directly breaks visible first-fold parity and trust.
Fix: Replaced combined rotation stack with one explicit mobile matrix transform (`[transform:scaleX(-1)]`) and kept desktop reset (`lg:[transform:none]`).
Verification:
- Playwright probe at `393x852` on `/local-seo` now reports wrapper transform `matrix(-1, 0, 0, 1, 0, 0)` with `rotate=none` and `scale=none`.
- Mobile screenshot artifact: `tmp/local-seo-mobile-after-transform-fix.png`.
Status: Fixed in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Swapped mobile-only Local SEO hero wrapper transform to explicit horizontal mirror matrix while preserving desktop neutral transform:
  - `src/components/pages/local-seo/local-seo-page.tsx:198-200`
- Re-ran mobile and desktop runtime probes for `/local-seo` to confirm no desktop regression.

### Verification Commands
- `npm run lint -- src/components/pages/local-seo/local-seo-page.tsx` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/local-seo` with computed-style probe -> pass (mobile transform now matrix-based; no rotate/scale property dependency).
  - `1440x900` desktop regression probe -> pass (`transform=none`, desktop branch unchanged).

## Section 29F — Figma Pixel Parity Verification (/ecommerce-seo, node `607:1392`)

### Context
Performed route-specific pixel parity verification for `/ecommerce-seo` against Figma node `607:1392`:
- `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:1392`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero title/subtitle geometry and copy did not match the Figma node.
Where: `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:151-165`.
Why: This is the first-fold conversion surface; off-spec text width and copy drift were immediately visible on phones.
Fix: Set mobile title width to `max-w-[294px]`, mobile subtitle width to `max-w-[246px]`, and switched mobile subtitle copy to Figma text (`Optimize Your Online Store. Drive Conversions. Boost Sales.`) while preserving existing desktop copy in an `lg` branch.
Verification:
- Playwright probe at `393x852` reports `h1.width=294`, `subtitle.width=246`, `sectionPaddingTop=60px`, and `overflowX=0`.
Status: Fixed in this section.

2. What: Mobile hero card messaging and image framing diverged from Figma node `607:1418` child content.
Where: `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:167-210`.
Why: Hero heading/body CTA context and image crop define above-the-fold clarity; mismatch reduces 1:1 parity and visual consistency with the approved mobile design.
Fix: Updated mobile-only hero heading/body copy to Figma, aligned mobile content widths (`350/310`), and replaced image crop with Figma mobile values (`left-[-45.39%] top-[-120.23%] h-[262.79%] w-[186.39%]`). Applied a mobile-safe explicit transform matrix wrapper (`[transform:scaleX(-1)]`) and preserved desktop branch via `lg:[transform:none]`.
Verification:
- Playwright probe at `393x852` reports wrapper transform `matrix(-1, 0, 0, 1, 0, 0)` and no horizontal overflow.
- Mobile screenshot artifact: `tmp/ecommerce-seo-mobile-after.png`.
Status: Fixed in this section.

#### P2
1. What: Desktop branch needed explicit regression verification because mobile parity updates touch shared JSX blocks.
Where: `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:150-214`.
Why: Mobile updates can unintentionally alter desktop typography, spacing, or transforms when classes are shared.
Fix: Kept desktop copy/width/crop values in `lg:*` branches and verified runtime geometry unchanged.
Verification:
- Playwright probe at `1440x900` reports `sectionPaddingTop=120px`, `h1Width=857`, `subtitleWidth=622`, `wrapperTransform=none`, `overflowX=0`.
Status: Fixed (verification complete, no additional code change required).

#### P3
- None in this section.

### Changes Made
- Updated `/ecommerce-seo` hero mobile typography widths and mobile-only subtitle copy:
  - `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:151-165`
- Updated `/ecommerce-seo` hero mobile card heading/body copy and sizing with desktop-preserving `lg` branches:
  - `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:167-186`
- Updated `/ecommerce-seo` hero mobile image transform/crop to Figma node values while keeping desktop crop unchanged:
  - `src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx:199-210`

### Verification Commands
- `npm run lint -- src/components/pages/ecommerce-seo/ecommerce-seo-page.tsx` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/ecommerce-seo` with geometry/style probe -> pass (`h1=294`, `subtitle=246`, mobile transform matrix, no overflow).
  - `1440x900` desktop regression probe -> pass (desktop spacing/width/transform unchanged, no overflow).

## Section 29G — Figma Pixel Parity Verification (/keyword-strategy, node `607:2731`)

### Context
Performed route-specific pixel parity verification for `/keyword-strategy` against Figma node `607:2731`:
- `src/components/pages/keyword-strategy/keyword-strategy-page.tsx`
- `src/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:2731`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero typography geometry and statue framing were off-spec for the first fold.
Where: `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:231-241`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:253-266`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:279-283`.
Why: This is the immediate conversion surface; mismatched title/subtitle widths and hero crop were visible against Figma and reduced parity confidence.
Fix: Applied Figma mobile geometry for the hero block: section `pt-[60px]`, title `max-w-[294px]`, subtitle `max-w-[268px]` with mobile line breaks, hero content widths (`350/294`), and image crop (`left-[-14.45%] top-[-32.99%] h-[177.26%] w-[220.67%]`) while preserving desktop in `lg:*` classes.
Verification:
- Playwright `393x852` probe on `http://127.0.0.1:3000/keyword-strategy` reports `paddingTop=60px`, `h1.width=294`, `subtitle.width=268`, hero image class with expected crop values, and `overflowX=0`.
Status: Fixed in this section.

2. What: Solutions area used desktop-first card structure on mobile instead of the Figma horizontal rail model.
Where: `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:32-123`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:217-227`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:296-338`, `src/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail.tsx:10-124`.
Why: Figma node `607:2731` defines a mobile rail with `350x580` cards, `5px` spacing, specific CTA labels, and indicator dots; static desktop-first rendering caused visible drift.
Fix: Added typed mobile card metadata (`mobileCtaLabel`, per-card mobile icon geometry), mapped `mobileServiceCards`, and implemented `KeywordStrategyMobileSolutionsRail` with `snap-x`, `350x580` cards, `5px` gap, clickable indicators, and Figma CTA labels.
Verification:
- Playwright `393x852` probe reports `containerPaddingTop=40px`, `containerPaddingBottom=20px`, `containerRadius=30px`, `headingWidth=266`, `cardCount=5`, `firstCard=350x580`, `rail gap=5px`, `dots=5`, and expected CTA labels (`Discover Targeted Keywords`, `Analyze Competitors`, `Target Long-Tail Keywords`, `Map Your Keywords`, `Optimize for Trends`).
Status: Fixed in this section.

#### P2
1. What: Mobile rail integration required explicit desktop regression protection.
Where: `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:304-306`, `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:306-336`, `src/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail.tsx:58-103`.
Why: Shared section edits can unintentionally alter desktop grid behavior and CTA copy.
Fix: Kept mobile rail strictly `lg:hidden` and retained desktop card grid in `lg:grid` path with existing desktop CTA labels.
Verification:
- Playwright `1440x900` probe reports `mobileRailDisplay=none`, `desktopGridDisplay=grid`, `desktopCardCount=5`, desktop CTA labels unchanged, and `overflowX=0`.
Status: Fixed in this section.

#### P3
- None in this section.

### Changes Made
- Added typed mobile descriptor fields and mapping for Keyword Strategy cards:
  - `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:32-123`
  - `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:217-227`
- Updated hero mobile geometry and crop to match Figma node `607:2731`:
  - `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:231-289`
- Updated solutions wrapper geometry and integrated mobile rail while preserving desktop grid:
  - `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:296-338`
- Added new mobile rail component:
  - `src/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail.tsx:1-124`

### Verification Commands
- `npm run -s lint -- src/components/pages/keyword-strategy/keyword-strategy-page.tsx src/components/pages/keyword-strategy/keyword-strategy-mobile-solutions-rail.tsx` -> pass.
- `npm run -s typecheck` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/keyword-strategy` geometry/style probe -> pass (hero + solutions metrics match node geometry; no overflow).
  - `1440x900` desktop regression probe -> pass (`mobile rail hidden`, `desktop grid visible`, desktop card labels unchanged).
  - Captures: `tmp/keyword-strategy-mobile-after-29G.png`, `tmp/keyword-strategy-desktop-after-29G.png`.

## Section 29H.1 — Figma Pixel Parity Verification (/content-creation hero, node `607:2005`)

### Context
Performed route-specific parity work for `/content-creation` against Figma node `607:2005`, with primary implementation focus on the hero and explicit verification pass over the remainder of the mobile page:
- `src/components/pages/content-creation/content-creation-page.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:2005`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile hero used desktop-first spacing and widths, causing above-the-fold drift from Figma.
Where: `src/components/pages/content-creation/content-creation-page.tsx:164-182`.
Why: The first screen is a high-visibility conversion surface; oversized widths and spacing break mobile parity and readability hierarchy.
Fix: Changed section top padding to mobile `60px` (`lg:100px` preserved), set title width to `294px`, subtitle width to `246px`, and aligned mobile subtitle line breaks with Figma copy.
Verification:
- Playwright `393x852`: `sectionPaddingTop=60px`, `h1.width=294`, `subtitle.width=246`, `overflowX=0`.
Status: Fixed in this section.

2. What: Hero card copy block and image framing were off-spec (including text centering and crop orientation).
Where: `src/components/pages/content-creation/content-creation-page.tsx:186-220`.
Why: Misaligned card text and incorrect statue crop were visually obvious and reduced 1:1 fidelity.
Fix: Set mobile card content widths to Figma values (`350` container, `292` body), added `mx-auto` centering for mobile heading/body, updated mobile image crop to `left-[-0.15%] top-[-77.95%] h-[207.04%] w-[106.29%]`, and used explicit mobile matrix mirror (`[transform:scaleX(-1)]`) with desktop reset.
Verification:
- Playwright `393x852`: `h2.width=328`, `body.width=292`, both centered, wrapper transform `matrix(-1, 0, 0, 1, 0, 0)`.
- Screenshot artifact: `tmp/content-creation-mobile-after-final.png`.
Status: Fixed in this section.

3. What: The rest of the mobile page is not yet 1:1 with node `607:2005` after hero completion.
Where: `src/components/pages/content-creation/content-creation-page.tsx:228-376` (solutions layout and cards), `src/components/pages/content-creation/content-creation-page.tsx:228-234`, `src/components/pages/content-creation/content-creation-page.tsx:236-269`.
Why: Figma mobile uses a horizontal rail with `350x580` cards and section-specific CTA labels, while current page still renders a vertical single-column grid (`h-[492px]`) with generic `Find Out More >` CTA text.
Fix: Logged as remaining P1 parity work for next slice (Section `29H` continuation), to avoid unsafe broad refactor in this hero-focused patch.
Verification:
- Full-page Playwright capture `tmp/content-creation-mobile-full-after-final.png` vs Figma node screenshot confirms hero parity but downstream layout mismatch remains.
Status: Open.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Updated `/content-creation` hero mobile spacing, widths, line breaks, and mobile image framing/orientation:
  - `src/components/pages/content-creation/content-creation-page.tsx:164-220`
- Added mobile-only centering hardening for hero heading/body text blocks:
  - `src/components/pages/content-creation/content-creation-page.tsx:188-193`
- Completed full-page verification pass and recorded remaining non-hero parity gaps for the next section.

### Verification Commands
- `npm run lint -- src/components/pages/content-creation/content-creation-page.tsx` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/content-creation` geometry/style probe -> pass for hero parity.
  - `1440x900` desktop regression probe -> pass (`sectionPaddingTop=100px`, `h1.width=857`, `subtitle.width=688`, wrapper `transform=none`, `overflowX=0`).
  - `393x1200` full-page mobile capture (`tmp/content-creation-mobile-full-after-final.png`) -> confirms remaining downstream drift outside hero.

## Section 29H.2 — Figma Pixel Parity Verification (/content-creation post-hero sections, node `607:2005`)

### Context
Completed the remaining `/content-creation` mobile parity work after hero completion, focused on the Solutions block and immediate downstream spacing:
- `src/components/pages/content-creation/content-creation-page.tsx`
- `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx`
- Figma MCP: `fileKey=iIVCGkNIrd9sc6j9NKmGIF`, `nodeId=607:2043`, `nodeId=799:214`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile Solutions area was still a desktop-first layout path (single-column static cards and desktop CTA labels), not the Figma horizontal rail model.
Where: `src/components/pages/content-creation/content-creation-page.tsx:273-316` (solutions wrapper + desktop grid branch), `src/components/pages/content-creation/content-creation-page.tsx:46-99` (card metadata lacked mobile CTA/icon geometry), `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:10-124` (new rail implementation).
Why: This section is in the first mobile viewport after hero; structure drift made the page visibly non-1:1 and reduced parity confidence for the full route.
Fix: Added a dedicated mobile rail component with `350x580` cards, `5px` rail gap, centered copy, per-card mobile CTA labels, and interactive indicator dots; kept desktop grid fully isolated behind `lg:grid`.
Verification:
- Figma context confirms mobile card geometry and CTA labels (`nodeId=799:214`).
- Playwright `393x852` runtime probe reports: `sectionPaddingTop=40px`, `sectionPaddingBottom=20px`, `sectionRadius=30px`, `headingWidth=266`, `firstCard={350x580}`, `dots=4`, CTA labels = `Plan and Create Content`, `Start Blogging`, `Create Visual Content`, `Develop Your Calendar`.
- Mobile full-page capture: `tmp/content-creation-mobile-after-29H2.png`.
Status: Fixed in this section.

2. What: Mobile-to-desktop branching needed explicit regression hardening after introducing the rail component.
Where: `src/components/pages/content-creation/content-creation-page.tsx:281-316`, `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:58-103`.
Why: Shared JSX/class edits in this route have previously caused desktop regressions; this required explicit branch checks before closure.
Fix: Kept mobile rail in `lg:hidden`, retained original desktop card grid with unchanged `Find Out More >` CTA copy and card dimensions.
Verification:
- Playwright `1440x900` probe reports `mobileRailDisplay=none`, `desktopGridDisplay=grid`, `desktopCardCount=4`, desktop CTA labels remain all `Find Out More >`.
- Desktop full-page capture: `tmp/content-creation-desktop-after-29H2.png`.
Status: Fixed in this section.

#### P2
1. What: Service card metadata needed explicit typing to safely carry both desktop and mobile presentation fields.
Where: `src/components/pages/content-creation/content-creation-page.tsx:32-44`, `src/components/pages/content-creation/content-creation-page.tsx:46-99`, `src/components/pages/content-creation/content-creation-page.tsx:195-204`.
Why: Without explicit shape, mobile-only descriptor expansion can drift and silently break card mapping between branches.
Fix: Added `ContentCreationServiceCard` type and mapped typed `mobileServiceCards` to rail props.
Verification: `npm run lint -- src/components/pages/content-creation/content-creation-page.tsx src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` and `npm run typecheck` pass.
Status: Fixed in this section.

#### P3
- None in this section.

### Changes Made
- Added mobile solutions rail component with scroll-snap cards and indicator controls:
  - `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:1-124`
- Added typed mobile descriptor fields and rail data mapping:
  - `src/components/pages/content-creation/content-creation-page.tsx:32-99`
  - `src/components/pages/content-creation/content-creation-page.tsx:195-204`
- Updated Solutions wrapper/headline spacing to Figma mobile geometry and integrated the mobile rail while preserving desktop grid branch:
  - `src/components/pages/content-creation/content-creation-page.tsx:273-316`
- Tightened mobile spacing before the process/CTA card (`mt-5`) while preserving desktop spacing (`lg:mt-[120px]`):
  - `src/components/pages/content-creation/content-creation-page.tsx:318`

### Verification Commands
- `npm run lint -- src/components/pages/content-creation/content-creation-page.tsx src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` -> pass.
- `npm run typecheck` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/content-creation` with geometry probe -> pass (`40/20` section paddings, `30px` radius, `266px` heading width, `350x580` card, 4 dots, no horizontal overflow).
  - `1440x900` desktop regression probe -> pass (`mobile rail hidden`, `desktop grid visible`, `4` cards, desktop CTA text unchanged).
  - Captures: `tmp/content-creation-mobile-after-29H2.png`, `tmp/content-creation-desktop-after-29H2.png`.

## Section 29H.3 — Content Creation Mobile Solutions Text-Center Retune

### Context
Applied a focused mobile-only fix for `/content-creation` Solutions card text alignment, per QA feedback that card copy was visually off-center:
- `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile rail cards inherited `text-align: start` at the card container level, which made text alignment depend on nested wrappers and produced inconsistent visual centering across card content.
Where: `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:61-89`.
Why: This section is a key mobile conversion surface immediately below hero; inconsistent text centering is visible and undermines parity quality.
Fix: Added `text-center` on the mobile card `article` container, preserving all existing spacing, sizing, and desktop behavior (`lg:hidden` rail).
Verification:
- Playwright `393x852` probe confirms `articleTextAlign=center`, `h3TextAlign=center`, `subtitleTextAlign=center`, `bodyTextAlign=center`, `ctaTextAlign=center`.
- Capture: `tmp/content-creation-mobile-solutions-after-centering-fix.png`.
Status: Fixed in this section.

#### P2
1. What: Mobile-only alignment fix needed explicit desktop non-regression verification.
Where: `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:58-63`.
Why: Shared component edits can unintentionally leak into desktop render paths.
Fix: Kept change inside mobile rail component only and revalidated desktop visibility boundary.
Verification:
- Playwright `1440x900` probe reports `mobileRailDisplay=none` and `overflowX=0`.
Status: Fixed (verification-only).

#### P3
- None in this section.

### Changes Made
- Added explicit card-level text centering in mobile solutions rail:
  - `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:62`

### Verification Commands
- `npm run -s lint -- src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/content-creation` text-alignment probe -> pass.
  - `1440x900` desktop regression probe -> pass (`mobile rail hidden`, no horizontal overflow).
  - Capture: `tmp/content-creation-mobile-solutions-after-centering-fix.png`.

## Section 29I — Link Building Mobile Hero Card Text-Center Retune

### Context
Applied a mobile-only centering retune for the `/link-building` hero card headline/body block after QA feedback:
- `src/components/pages/link-building/link-building-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: The mobile hero heading/body text blocks were width-constrained but not horizontally centered inside the card content container.
Where: `src/components/pages/link-building/link-building-page.tsx:247-252`.
Why: On mobile, this made the hero message (“Strengthen Your Off-Page SEO for Long-Term Growth”) read visually left-shifted in the first fold.
Fix: Added `mx-auto` for mobile and `lg:mx-0` for desktop on the hero `h2` and supporting paragraph.
Verification:
- Playwright `393x852` probe on `http://127.0.0.1:3000/link-building` reports `centerOffsetFromContentBox=0` for both `h2` (`width=254`) and body copy (`width=274`), with `overflowX=0`.
- Capture: `tmp/link-building-mobile-hero-center-fix.png`.
Status: Fixed in this section.

#### P2
1. What: Mobile centering change required explicit desktop non-regression verification.
Where: `src/components/pages/link-building/link-building-page.tsx:247-252`.
Why: Shared hero JSX is used by both breakpoints; mobile alignment fixes must not shift desktop layout.
Fix: Scoped centering to mobile (`mx-auto`) and restored desktop behavior with `lg:mx-0`.
Verification:
- Playwright `1440x900` probe confirms desktop `h2TextAlign=left`, `h2MarginLeft=0px`, and `overflowX=0`.
Status: Fixed (verification-only).

#### P3
- None in this section.

### Changes Made
- Centered mobile-only hero heading/body blocks while preserving desktop alignment:
  - `src/components/pages/link-building/link-building-page.tsx:247-252`

### Verification Commands
- `npm run -s lint -- src/components/pages/link-building/link-building-page.tsx` -> pass.
- Playwright:
  - `393x852` on `http://127.0.0.1:3000/link-building` center-offset probe -> pass (`h2` and body center offsets `0`).
  - `1440x900` desktop regression probe -> pass (`h2` left-aligned, no overflow).
  - Capture: `tmp/link-building-mobile-hero-center-fix.png`.

## Section 29I.1 — Link Building Mobile Hero Text-Center Hardening

### Context
Applied a stricter mobile-only hardening pass for the same `/link-building` hero text block after QA reported it still looked off-center on device:
- `src/components/pages/link-building/link-building-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: The hero heading/body depended on inherited centering from parent wrappers; this is fragile and can look left-shifted when wrapper-level styles change.
Where: `src/components/pages/link-building/link-building-page.tsx:245-252`.
Why: This is first-fold copy and QA reported visual off-centering on mobile despite the prior retune.
Fix: Added explicit mobile centering hardening on wrapper and text blocks: `mx-auto w-full` wrapper plus `w-full text-center` on `h2` and body, with `lg:*` classes preserving desktop left alignment.
Verification:
- `npm run -s lint -- src/components/pages/link-building/link-building-page.tsx` -> pass.
- Playwright runtime probes:
  - `393x852` on `http://localhost:3000/link-building` -> `headingTextAlign=center`, `bodyTextAlign=center`, `headingOffsetFromHeroTextBox=0`, `bodyOffsetFromHeroTextBox=0`, `overflowX=0`.
  - `1440x900` on `http://localhost:3000/link-building` -> `headingTextAlign=left`, `bodyTextAlign=left`, `marginLeft=0px`, `overflowX=0`.
Status: Fixed in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Hardened mobile hero text centering with explicit wrapper/text classes while preserving desktop alignment:
  - `src/components/pages/link-building/link-building-page.tsx:245-252`

### Verification Commands
- `npm run -s lint -- src/components/pages/link-building/link-building-page.tsx` -> pass.
- Playwright:
  - `393x852` runtime center probe on `/link-building` -> pass.
  - `1440x900` desktop regression probe on `/link-building` -> pass.

## Section 29H.4 — Content Creation Mobile Solutions Text-Center Hardening

### Context
Applied a second-pass mobile hardening for `/content-creation` solution cards after QA continued to report off-center copy:
- `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile solution cards had centered text alignment but still relied on full-width text blocks, creating optical drift on long titles/body copy.
Where: `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:65-93`.
Why: QA feedback remained open on this section; this is a conversion-visible block directly below hero.
Fix: Hardened card text layout with explicit centered text widths (`mx-auto max-w-[290px]` for title/subtitle, `mx-auto max-w-[310px]` for body) and enforced full-width centered stack container (`w-full`).
Verification:
- `npm run -s lint -- src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` -> pass.
- `npm run -s typecheck` -> pass.
- Playwright `393x852` probe on `http://localhost:3000/content-creation` -> all 4 cards report `h3/subtitle/body/cta centerOffset=0`, `textAlign=center`, `overflowX=0`.
Status: Fixed in this section.

#### P2
1. What: Mobile hardening required explicit desktop branch verification because the same section renders desktop cards from the parent page.
Where: `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:58-108`, `src/components/pages/content-creation/content-creation-page.tsx:281-316`.
Why: Repeated mobile retunes in this area risk accidental desktop drift if branch boundaries are unclear.
Fix: Kept changes inside the mobile rail component and revalidated branch visibility.
Verification:
- Playwright `1440x900` on `/content-creation` -> `mobileRailDisplay=none`, `desktopGridDisplay=grid`, `overflowX=0`.
Status: Fixed (verification-only).

#### P3
- None in this section.

### Changes Made
- Hardened mobile card text stack and centered max-width text blocks for title/subtitle/body:
  - `src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx:65-93`

### Verification Commands
- `npm run -s lint -- src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` -> pass.
- `npm run -s typecheck` -> pass.
- Playwright:
  - `393x852` runtime center probe on `/content-creation` -> pass for all 4 cards.
  - `1440x900` desktop regression probe on `/content-creation` -> pass (`mobile rail hidden`, `desktop grid visible`, no overflow).

## Section 29H.5 — Content Creation Mobile Solutions Frame Fit Retune

### Context
Retuned the mobile solutions section frame spacing after device QA reported cards looked shifted right on Samsung due to not fully fitting in-frame:
- `src/components/pages/content-creation/content-creation-page.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Content Creation solutions wrapper used larger mobile horizontal padding than the working Keyword Strategy pattern, reducing visible rail width and causing first-card right-edge clipping on narrower Android viewports.
Where: `src/components/pages/content-creation/content-creation-page.tsx:275`, compared against `src/components/pages/keyword-strategy/keyword-strategy-page.tsx:298`.
Why: On phone runtimes this made the first card appear shifted/right-clipped, matching QA feedback.
Fix: Aligned Content Creation solutions wrapper to keyword-strategy spacing by changing mobile padding from `px-[15px]` to `px-[10px]`.
Verification:
- `npm run -s lint -- src/components/pages/content-creation/content-creation-page.tsx src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` -> pass.
- `npm run -s typecheck` -> pass.
- Playwright runtime probes on `http://localhost:3000/content-creation`:
  - `384x854`: first card fully visible (`clippedRight=0`, `fullyVisible=true`).
  - `412x915`: first card fully visible (`clippedRight=0`, `fullyVisible=true`).
  - `393x852`: first card fully visible and centered copy offsets remain `0`.
Status: Fixed in this section.

#### P2
1. What: Mobile spacing adjustment required desktop branch non-regression verification.
Where: `src/components/pages/content-creation/content-creation-page.tsx:275`, `src/components/pages/content-creation/content-creation-page.tsx:283-316`.
Why: Same section serves both breakpoints.
Fix: Kept change mobile-only; desktop `lg:px-[70px]` unchanged.
Verification:
- Playwright `1440x900` on `/content-creation` reports `mobileRailDisplay=none`, `desktopGridDisplay=grid`, `overflowX=0`.
Status: Fixed (verification-only).

#### P3
- None in this section.

### Changes Made
- Matched mobile wrapper padding to keyword-strategy reference to improve rail frame fit:
  - `src/components/pages/content-creation/content-creation-page.tsx:275`

### Verification Commands
- `npm run -s lint -- src/components/pages/content-creation/content-creation-page.tsx src/components/pages/content-creation/content-creation-mobile-solutions-rail.tsx` -> pass.
- `npm run -s typecheck` -> pass.
- Playwright:
  - `384x854`, `412x915`, `393x852` probes on `/content-creation` -> pass (first card fully visible; text offsets remain centered).
  - `1440x900` desktop regression probe -> pass.

## Section 25 — SEO Services Mobile Parity (Services Rail Image Fidelity)

### Context
Audited and fixed the mobile-only SEO services rail image rendering against Figma node `609:4323`:
- `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile rail cards were using one shared intrinsic image size path (`width/height`) instead of per-asset intrinsic dimensions, which can produce inconsistent decode behavior and softness artifacts on high-density screens when combined with aggressive crop scaling.
Where: `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:14-24`, `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:27-111`, `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:155-164`.
Why: This section renders above-the-fold on `/seo-services` mobile and each card applies large transform-based crops; inaccurate intrinsic metadata increases risk of quality drift across devices.
Fix: Implemented per-card intrinsic dimensions (`imageWidth`, `imageHeight`) and passed them directly to `next/image` while keeping existing Figma crop offsets and per-card `sizes` values.
Verification:
- `npx eslint src/components/pages/seo-services/seo-services-mobile-services-rail.tsx next.config.ts src/components/pages/seo-services/seo-services-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- Playwright mobile runtime check confirms per-card `sizes` and distinct `_next/image` widths with matching intrinsic attrs; screenshot artifact: `output/playwright/seo-services-mobile-after-intrinsic-dims.png`.
Status: Fixed in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Added `imageWidth`/`imageHeight` metadata for each mobile service card and used those values in the `Image` component:
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:14-24`
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:27-111`
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:155-164`
- Preserved existing mobile-only crop geometry and desktop isolation (`lg:hidden` rail remains unchanged):
  - `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:145-205`

### Verification Commands
- `npx eslint src/components/pages/seo-services/seo-services-mobile-services-rail.tsx next.config.ts src/components/pages/seo-services/seo-services-page.tsx` -> pass.
- `npm run typecheck` -> pass.
- Playwright runtime checks:
  - Per-card source/size inspection script on `/seo-services` at `390x844` -> pass.
  - Visual capture: `output/playwright/seo-services-mobile-after-intrinsic-dims.png`.

## Section 23 — About Us Mobile Parity (Hero)

### Context
Implemented the first non-homepage hero mobile parity slice for About Us using Figma node `688:3883` and hero child nodes `688:3906`, `688:3909`, and `688:3912`:
- `src/components/sections/about-us-hero.tsx`
- `src/app/globals.css`

### Findings

#### P0
- None in this section.

#### P1
1. What: The About Us hero used a desktop-first single layout on mobile, with mismatched copy, spacing, and image crop versus Figma.
Where: `src/components/sections/about-us-hero.tsx:7-38` (pre-fix baseline); fixed in `src/components/sections/about-us-hero.tsx:7-43`.
Why: This is the above-the-fold section on `/about-us`; mobile drift is immediately visible and breaks approved design parity.
Fix: Added a dedicated `lg:hidden` mobile hero branch using Figma-exact geometry (`350px` text/image width, `360px` image panel, `255px` gradient base, and statue crop offsets `left:-7.66% top:-13.89%`), while preserving desktop markup in an isolated `hidden lg:block` branch.
Verification: Playwright mobile capture at `390x844` (`output/playwright/about-us-hero-mobile-section23.png`) matches Figma screenshot geometry and crop.
Status: Fixed in this section.

2. What: Figma mobile gradient angles for hero title/body accent did not have dedicated tokens in project styles.
Where: `src/app/globals.css:414-415`.
Why: Reusing desktop gradient token values causes subtle but visible color-angle drift in the mobile heading/copy highlight.
Fix: Added mobile-specific gradient token classes (`gradient-text-brand-about-us-hero-title-mobile`, `gradient-text-brand-about-us-hero-copy-mobile`) and applied them in mobile hero copy.
Verification: `npx eslint src/components/sections/about-us-hero.tsx` passes; Playwright mobile screenshot confirms token usage in the intended text spans.
Status: Fixed in this section.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Added a mobile-only hero render path and preserved desktop hero render path in `src/components/sections/about-us-hero.tsx`.
- Added two mobile-specific gradient angle token classes in `src/app/globals.css`.
- Captured mobile and desktop verification artifacts:
  - `output/playwright/about-us-hero-mobile-section23.png`
  - `output/playwright/about-us-hero-desktop-regression-section23.png`

### Verification Commands
- `npx eslint src/components/sections/about-us-hero.tsx` -> pass.
- `npm run lint` -> pass with one pre-existing warning in `src/components/pages/insights/blog-post-detail-content.tsx:111` (unused eslint-disable directive).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings about generated `var(...)` utility tokenization).
- Playwright visual verification:
  - Mobile `390x844` capture: `output/playwright/about-us-hero-mobile-section23.png`.
  - Desktop regression capture: `output/playwright/about-us-hero-desktop-regression-section23.png`.

## Section 24 — About Us Mobile Parity (Trust + Process)

### Context
Implemented the next About Us mobile parity slice for trust and process blocks under Figma frame `688:3883`:
- `src/components/pages/about-us/about-us-page.tsx`
- `src/components/sections/about-us-trust.tsx`
- `src/components/sections/about-us-process.tsx`
- `src/components/sections/process-step-switcher.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Trust and Process blocks were still desktop-first on mobile, causing content flow and spacing drift right after the About Us hero.
Where: `src/components/pages/about-us/about-us-page.tsx:23-26`, `src/components/sections/about-us-trust.tsx:8-103`, `src/components/sections/about-us-process.tsx:20-47`.
Why: This section sits above the fold continuation on `/about-us`; drift was visible immediately on `390px` screens.
Fix: Added mobile-specific render branches (`lg:hidden`) for trust and process with Figma-aligned widths/spacing and preserved desktop structures under `hidden lg:*` branches.
Verification: Mobile Playwright captures now show centered trust cards and the mobile process card format (`output/playwright/about-us-mobile-section24-trust.png`, `output/playwright/about-us-mobile-section24-process.png`).
Status: Fixed in this section.

2. What: Process switcher mobile dots needed tighter spacing/sizing for parity without changing desktop stepper behavior.
Where: `src/components/sections/process-step-switcher.tsx:14-25`, `src/components/sections/process-step-switcher.tsx:129-136`, `src/components/sections/about-us-process.tsx:30-34`.
Why: Shared defaults were too large for this Figma card variant and introduced visual mismatch in the process footer controls.
Fix: Added optional `mobileDotsRowClassName` and `mobileDotClassName` props, then applied section-specific values only in About Us process.
Verification: Process card screenshot shows compact 5-dot indicator matching the mobile card rhythm (`output/playwright/about-us-mobile-section24-process.png`).
Status: Fixed in this section.

#### P2
1. What: Fresh Figma MCP pulls are currently blocked by seat plan call limits during this slice.
Where: `mcp__figma__get_design_context` / `mcp__figma__get_screenshot` responses during Section 24 execution.
Why: Live node refetch was unavailable for this run, reducing ability to re-pull node payloads on demand.
Fix: Continued from previously fetched node specs and validated implementation with local Playwright snapshots at target viewport.
Verification: `output/playwright/about-us-mobile-section24-full.png` confirms integrated Trust+Process mobile rendering.
Status: Open (external tool limit).

#### P3
- None in this section.

### Changes Made
- Updated About Us trust/process container spacing/radius in `src/components/pages/about-us/about-us-page.tsx`.
- Added dedicated mobile trust layout while preserving desktop trust layout in `src/components/sections/about-us-trust.tsx`.
- Added dedicated mobile process card and preserved desktop process layout in `src/components/sections/about-us-process.tsx`.
- Added optional mobile dot tuning props in `src/components/sections/process-step-switcher.tsx`.
- Captured verification artifacts:
  - `output/playwright/about-us-mobile-section24-full.png`
  - `output/playwright/about-us-mobile-section24-trust.png`
  - `output/playwright/about-us-mobile-section24-process.png`
  - `output/playwright/about-us-desktop-section24-regression.png`

### Verification Commands
- `npx eslint src/components/pages/about-us/about-us-page.tsx src/components/sections/about-us-trust.tsx src/components/sections/about-us-process.tsx src/components/sections/process-step-switcher.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass.
- Playwright visual verification:
  - Mobile `390x844` full page: `output/playwright/about-us-mobile-section24-full.png`.
  - Mobile trust block: `output/playwright/about-us-mobile-section24-trust.png`.
  - Mobile process block: `output/playwright/about-us-mobile-section24-process.png`.
  - Desktop regression full page: `output/playwright/about-us-desktop-section24-regression.png`.

## Section 13 — Runtime Production Verification Automation

### Context
Added executable runtime smoke checks and verified repo behavior against live deployment behavior:
- `scripts/verify-production-runtime.mjs`
- `package.json`
- `docs/audit/PRODUCTION_RUNBOOK.md`

### Findings

#### P0
- None in this section.

#### P1
1. What: Current public production host is missing multiple required security headers.
Where: `scripts/verify-production-runtime.mjs:41-60`; exact runtime output snippet from `npm run verify:prod-runtime -- https://heroicrankings.com`: `[FAIL] CSP header present (missing)`, `[FAIL] x-powered-by header removed (Next.js)`, `[FAIL] X-Content-Type-Options set ()`, `[FAIL] X-Frame-Options set ()`.
Why: Missing CSP and baseline headers reintroduce XSS/clickjacking/MIME-sniffing exposure even though repo-side middleware/config is hardened.
Fix: Implemented deterministic runtime verifier; deployment/infrastructure must be updated until production passes all checks.
Verification: Command currently fails with 6 checks on `https://heroicrankings.com`, while local production server passes all checks.
Status: Open (external remediation required).

#### P2
1. What: Repository lacked an executable post-deploy runtime gate for security-header and basic SEO endpoint checks.
Where: `scripts/verify-production-runtime.mjs:3-82`, `package.json:12-14`, `docs/audit/PRODUCTION_RUNBOOK.md:29-35`.
Why: Manual spot checks are easy to skip and do not produce consistent pass/fail output for release signoff.
Fix: Added `npm run verify:prod-runtime -- "$BASE_URL"` and integrated it into the runbook.
Verification: Local production verification passes against `http://127.0.0.1:4010`.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Added runtime verification script in `scripts/verify-production-runtime.mjs`.
- Added `verify:prod-runtime` npm command in `package.json`.
- Updated runbook post-deploy section to include automated runtime verification in `docs/audit/PRODUCTION_RUNBOOK.md`.

### Verification Commands
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- `npm run verify:prod-runtime -- https://heroicrankings.com` -> fail with 6 checks (CSP/security header drift on live deployment).
- `npm run verify:prod-runtime -- http://127.0.0.1:4010` (against local `npm run start -- --hostname 127.0.0.1 --port 4010`) -> pass.

## Section 14 — Homepage Mobile Parity (Hero First Fold)

### Context
Implemented the first mobile-only parity slice for homepage against Figma node `609:755` + `609:758`:
- `src/components/sections/hero.tsx`

### Findings

#### P1
1. What: Homepage hero mobile copy, spacing, CTA width, and image crop did not match the Figma mobile first fold.
Where: `src/components/sections/hero.tsx:12-55`; Figma nodes `609:756`, `609:757`, `609:1094`, `609:758`.
Why: First-screen mobile mismatch creates immediate visual drift from approved design.
Fix: Added mobile-only hero heading/body copy with gradient emphasis, set exact mobile widths (`350px` heading/CTA, `342px` paragraph), kept CTA at `45px` height, and switched mobile hero image crop to Figma-aligned framing (`left: -52.16%`, `width: 210.21%`, `height: 180px`) while preserving desktop behavior via `lg:` overrides.
Verification: `npx eslint src/components/sections/hero.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed for hero first fold.

#### P2
1. What: Route-level visual verification in Playwright is partially blocked by CSP/runtime script violations in local production run.
Where: Playwright console output during `http://127.0.0.1:4010/` load (local run), existing CSP/runtime behavior tracked in `docs/audit/TODO.md:7`.
Why: Blocked scripts reduce confidence in fully automated visual regression checks during local runtime validation.
Fix: Used Figma node screenshots as source of truth for this slice; left runtime header/CSP remediation in existing P1 deployment task.
Verification: Playwright snapshot captures shell and reports CSP/script blocking errors; build/typecheck remain green.
Status: Open (tracked by production header parity task).

#### P3
- None in this section.

### Changes Made
- Updated mobile-only hero markup/copy and dimensions in `src/components/sections/hero.tsx`.
- Kept desktop hero content and desktop image framing intact via `lg:` breakpoints.

### Verification Commands
- `npx eslint src/components/sections/hero.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright navigation to `http://127.0.0.1:4010/` -> loads page shell; console reports CSP/script blocking (existing known issue).

## Section 15 — Homepage Mobile Parity (Services Carousel)

### Context
Implemented the second mobile-only homepage parity slice against Figma services nodes `652:106`, `766:389`, and `652:201`:
- `src/components/sections/services.tsx`
- `public/figma/services/card-link-building.png`

### Findings

#### P0
- None in this section.

#### P1
1. What: Services mobile heading/CTA spacing and carousel geometry did not match Figma (centered text block, `350x45` CTA, `350x450` cards, `10px` rail gaps, and dot indicator row).
Where: `src/components/sections/services.tsx:237-349`; Figma nodes `652:107-111`, `766:389`, `652:201`.
Why: Mid-page mobile section had visible layout drift from approved design, reducing design fidelity after the hero fold.
Fix: Added mobile-scoped layout parity while preserving desktop via `lg:` overrides: centered `324px` heading block, `350px` CTA, snap-enabled horizontal rail, `350x450` cards, mobile `60px` action buttons, and 8-dot carousel indicator with click-to-scroll.
Verification: `npx eslint src/components/sections/services.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed.

2. What: Figma mobile sequence contains a dedicated “Link Building Services” card that was absent from homepage services cards.
Where: `src/components/sections/services.tsx:23-41`; `public/figma/services/card-link-building.png`; Figma node `766:398`.
Why: Missing service card causes content mismatch in mobile flow and changes expected carousel count/progression.
Fix: Added Figma-derived link-building asset and inserted a `mobileOnly` card entry so mobile matches the 8-card sequence without changing desktop card lineup.
Verification: Build includes new asset and cards render from updated `SERVICE_CARDS` source.
Status: Fixed for mobile.

#### P2
1. What: Runtime Playwright visual pass remains partially blocked by existing CSP/runtime gate failures, limiting fully automated visual confirmation.
Where: Playwright console output for `http://127.0.0.1:4010/`; tracked in `docs/audit/TODO.md` runtime header task.
Why: Inline script/style blocking interrupts full client hydration in local production runtime checks.
Fix: Continued using Figma node screenshots + deterministic lint/typecheck/build checks for this section; runtime header remediation remains separately tracked as P1.
Verification: Playwright still reports CSP script/style blocking during local production snapshot.
Status: Open (tracked externally).

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/services.tsx` for mobile-only services parity:
  - Added mobile-centered heading/CTA layout with Figma dimensions.
  - Added snap-based mobile carousel geometry and indicator dots.
  - Added per-card mobile image crop classes and title width constraints.
  - Added mobile-only “Link Building Services” card entry while preserving desktop via `lg:hidden`.
- Added `public/figma/services/card-link-building.png` from Figma asset export.

### Verification Commands
- `npx eslint src/components/sections/services.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright mobile navigation to `http://127.0.0.1:4010/` -> route loads but hydration/scripts blocked by existing CSP/runtime issue (known open risk).

## Section 16 — Homepage Mobile Parity (About Block)

### Context
Implemented the third mobile-only homepage parity slice against Figma about nodes `609:1884` and `609:2005`:
- `src/components/sections/about.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: About mobile section geometry diverged from Figma in vertical rhythm, heading/body widths, and hero-image sizing.
Where: `src/components/sections/about.tsx:93-134`; Figma nodes `609:1885`, `609:1992`, `609:1994`.
Why: Mobile section looked denser/taller than approved design and broke visual continuity after the services block.
Fix: Aligned mobile structure to Figma values while preserving desktop via `lg/xl` overrides: section `60px` top/bottom spacing, centered heading block (`306px`) and body (`316px`), and `352x329` about image panel with mobile radius treatment.
Verification: `npx eslint src/components/sections/about.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed.

2. What: About logo marquee did not match Figma mobile gap/entry offset.
Where: `src/components/sections/about.tsx:136-183`; Figma node `609:2005`.
Why: Incorrect initial logo segment and spacing caused visible mismatch at the end of the About section.
Fix: Updated mobile logo-row top spacing (`40px`), set mobile logo gap to `40px`, and added a mobile-only wrapper offset (`-564px`) to align the first visible logo segment with the Figma composition; desktop resets at `lg`.
Verification: Build compiles updated marquee layout and keeps existing desktop classes.
Status: Fixed.

#### P2
1. What: Runtime Playwright visual pass is still blocked by existing CSP/runtime gate failures, so full hydrated viewport diffing remains limited.
Where: Playwright console output for `http://127.0.0.1:4010/`; tracked in runtime-header TODO.
Why: Blocked inline script/style execution prevents complete client hydration during local production screenshots.
Fix: Continued Figma screenshot-led validation plus deterministic lint/typecheck/build for this section.
Verification: Playwright still reports CSP script/style blocking.
Status: Open (tracked externally).

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/about.tsx` with mobile-only parity adjustments:
  - Centered about heading/body with Figma-matched widths and spacing.
  - Resized mobile image panel to Figma dimensions.
  - Tuned mobile marquee spacing and entry offset to match Figma logo strip composition.
  - Preserved desktop behavior with explicit `lg/xl` fallbacks.

### Verification Commands
- `npx eslint src/components/sections/about.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright mobile navigation to `http://127.0.0.1:4010/` -> route loads but hydration/scripts blocked by existing CSP/runtime issue (known open risk).

## Section 17 — Homepage Mobile Parity (Team Block)

### Context
Implemented the fourth mobile-only homepage parity slice against Figma team node `609:2015`:
- `src/components/sections/team.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Team mobile section diverged in heading copy/treatment, stat sizing, card geometry, and CTA placement.
Where: `src/components/sections/team.tsx:29-89`; Figma nodes `609:2016`, `609:2034`, `702:660`, `702:675`, `609:2035`.
Why: Visual mismatch in a high-trust conversion section reduces parity with approved mobile design and weakens continuity between homepage sections.
Fix: Added dedicated mobile block (`lg:hidden`) with Figma-matched values: centered heading with gradient accents, outlined `20+` stat at `120px`, two stacked `350x454` profile cards (`350x350` image + `60px` action button), and full-width `350x45` “More About Us” CTA.
Verification: `npx eslint src/components/sections/team.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed.

2. What: Mobile parity work risked changing existing desktop layout behavior.
Where: `src/components/sections/team.tsx:91-140`.
Why: Shared responsive edits in one tree can unintentionally alter desktop spacing/card offsets.
Fix: Preserved original desktop implementation in a separate `lg:grid` subtree and kept prior desktop copy/card sizing/offset logic intact.
Verification: Desktop markup is kept in a dedicated branch with original class structure and only key namespace updates (`key={`desktop-${member.name}`}`).
Status: Fixed.

#### P2
1. What: Runtime Playwright visual pass remains blocked by CSP/runtime gate failures.
Where: Playwright console output for `http://127.0.0.1:4010/`; tracked in runtime-header TODO.
Why: Blocked inline script/style execution prevents full hydration, limiting browser-level visual assertions.
Fix: Continued Figma screenshot-led validation plus deterministic lint/typecheck/build checks.
Verification: Playwright still reports CSP script/style blocking.
Status: Open (tracked externally).

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/team.tsx`:
  - Added mobile-only Figma-matched team block.
  - Kept desktop layout isolated in a `lg:grid` branch to avoid regressions.
  - Matched mobile card dimensions, typography, and CTA geometry to Figma.

### Verification Commands
- `npx eslint src/components/sections/team.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright mobile navigation to `http://127.0.0.1:4010/` -> route loads but hydration/scripts blocked by existing CSP/runtime issue (known open risk).

## Section 18 — Homepage Mobile Parity (Stats + Featured Logos)

### Context
Implemented the fifth mobile-only homepage parity slice against Figma node `609:896`:
- `src/components/sections/stats.tsx`
- `src/components/sections/featured-logos.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile stats block diverged from Figma in spacing, heading/body widths, CTA width, and stat-card circle/text geometry.
Where: `src/components/sections/stats.tsx:43-126`; Figma nodes `609:897`, `609:2195`.
Why: The “Guided by Data” section is a credibility-heavy conversion area; geometry mismatch weakens consistency and perceived polish on mobile.
Fix: Added dedicated mobile stats rendering (`lg:hidden`) with Figma-matched dimensions: `264px` heading, `300px` body copy, `350px` CTA, `266/254px` stat circles, and `34px` outlined key-point typography; desktop rendering remains isolated under `lg:block`.
Verification: `npx eslint src/components/sections/stats.tsx src/components/sections/featured-logos.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed.

2. What: Mobile “Featured and Recognized” block was rendering as a desktop-style horizontal logo row instead of Figma’s `2x2` logo grid card.
Where: `src/components/sections/featured-logos.tsx:7-116`; Figma nodes `609:2280`, `609:2219`.
Why: Incorrect logo layout and spacing break parity in the final part of the dark data section and reduce readability on narrow screens.
Fix: Added mobile-only featured-logos composition (`350x115` bordered card with `2x2` grid and Figma-aligned logo sizing), while preserving original desktop implementation in a `hidden lg:block` path.
Verification: Build compiles both mobile and desktop trees with no type/lint regressions.
Status: Fixed.

#### P2
1. What: Runtime Playwright visual pass remains blocked by CSP/runtime gate failures.
Where: Playwright console output for `http://127.0.0.1:4010/`; tracked in runtime-header TODO.
Why: Blocked inline script/style execution prevents full hydration, limiting browser-level visual verification.
Fix: Continued Figma screenshot-led validation plus deterministic lint/typecheck/build checks.
Verification: Playwright still reports CSP script/style blocking.
Status: Open (tracked externally).

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/stats.tsx` with mobile-only Figma-matched layout and dimensions; desktop block preserved.
- Updated `src/components/sections/featured-logos.tsx` with mobile `2x2` logo grid card and separate preserved desktop block.

### Verification Commands
- `npx eslint src/components/sections/stats.tsx src/components/sections/featured-logos.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright mobile navigation to `http://127.0.0.1:4010/` -> route loads but hydration/scripts blocked by existing CSP/runtime issue (known open risk).

## Section 19 — Homepage Mobile Parity (Case Studies Block)

### Context
Implemented the sixth mobile-only homepage parity slice against Figma node `609:968`:
- `src/components/sections/case-studies.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Case studies mobile section diverged in top-copy length, CTA width, card heights/content spacing, and date values.
Where: `src/components/sections/case-studies.tsx:75-186`; Figma nodes `609:969`, `669:2853`, `702:574`, `702:557`, `702:591`.
Why: Case-study cards are social-proof content; mismatched geometry/copy weakens trust signal consistency and breaks 1:1 mobile parity.
Fix: Added dedicated mobile rendering (`lg:hidden`) with Figma-aligned header/CTA, stacked `350px` cards with per-card heights (`435/477/456`), `250px` card tops, `60px` action buttons, centered `266px` summaries, and Figma-matching mobile dates.
Verification: `npx eslint src/components/sections/case-studies.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed.

2. What: Mobile view included an extra bottom “proven results photo” panel not present in the audited Figma mobile frame.
Where: `src/components/sections/case-studies.tsx:192-206`; Figma frame `609:968` ends at quote stack (`609:2296`).
Why: Extra visual block creates post-quote drift and changes section flow on mobile.
Fix: Scoped the bottom image panel to desktop only (`hidden lg:block`) while keeping existing desktop behavior.
Verification: Build compiles and desktop path remains intact.
Status: Fixed.

#### P2
1. What: Runtime Playwright visual pass remains blocked by CSP/runtime gate failures.
Where: Playwright console output for `http://127.0.0.1:4010/`; tracked in runtime-header TODO.
Why: Blocked inline script/style execution prevents full hydration, limiting browser-level visual verification.
Fix: Continued Figma screenshot-led validation plus deterministic lint/typecheck/build checks.
Verification: Playwright still reports CSP script/style blocking.
Status: Open (tracked externally).

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/case-studies.tsx`:
  - Added mobile-specific header/body/CTA block and mobile card stack.
  - Added per-card mobile height/date controls for Figma parity.
  - Preserved desktop implementation under `lg` paths.
  - Hidden bottom photo panel on mobile to match Figma section boundary.

### Verification Commands
- `npx eslint src/components/sections/case-studies.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright mobile navigation to `http://127.0.0.1:4010/` -> route loads but hydration/scripts blocked by existing CSP/runtime issue (known open risk).

## Section 20 — Homepage Mobile Parity (Testimonials Block)

### Context
Implemented the seventh mobile-only homepage parity slice against Figma testimonials node `609:2929`:
- `src/components/sections/testimonials.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Testimonial logos were clipped on smaller phones because mobile layout inherited desktop absolute positioning assumptions.
Where: `src/components/sections/testimonials.tsx:157-214` (new mobile flex layout) and desktop-only absolute layout isolation at `src/components/sections/testimonials.tsx:234-275`.
Why: The previous fixed-position logo pill geometry was tuned for wider cards and could overflow/clamp on narrow mobile card widths, causing visible logo cutoff.
Fix: Added dedicated `lg:hidden` mobile cards that use a `350px` Figma-width flex header row (`77px` avatar + `160px` logo capsule with per-logo paddings), and moved the previous absolute geometry into the desktop-only branch.
Verification: `npx eslint src/components/sections/testimonials.tsx`, `npm run typecheck`, and `npm run build` pass.
Status: Fixed.

2. What: Mobile testimonials structure did not match Figma’s horizontal card rail and indicator behavior.
Where: `src/components/sections/testimonials.tsx:14-131` and `src/components/sections/testimonials.tsx:157-232`; Figma nodes `766:492`, `766:493`, `766:505`, `766:517`, `609:3152`.
Why: The prior stacked mobile rendering broke the intended swipeable social-proof flow and did not preserve card rhythm from the approved design.
Fix: Implemented snap-based mobile carousel (`350px` cards, `5px` gaps), defaulted initial position to the center card, and added 3-dot mobile indicator controls with smooth scroll targets.
Verification: Build compiles the new mobile rail state/effects and desktop grid remains isolated under `lg` paths.
Status: Fixed.

#### P2
1. What: Runtime Playwright visual pass remains blocked by CSP/runtime gate failures.
Where: Local runtime navigation behavior tracked in `docs/audit/TODO.md` security-header task and runtime verifier checks (`scripts/verify-production-runtime.mjs:41-60`).
Why: Blocked inline script/style execution limits full hydration-based visual assertions in local production checks.
Fix: Continued Figma screenshot-led validation plus deterministic lint/typecheck/build checks for this section.
Verification: Build/typecheck/lint pass; runtime header parity remains separately tracked.
Status: Open (tracked externally).

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/testimonials.tsx`:
  - Added mobile-only testimonial carousel with Figma-matched card geometry and logo capsules.
  - Added mobile dot indicators and card-scroll synchronization.
  - Isolated prior absolute testimonial card layout to desktop-only rendering to avoid desktop regression.
  - Kept CTA/header responsive with `350px` mobile width and desktop `xl` constraints.

### Verification Commands
- `npx eslint src/components/sections/testimonials.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 21 — Homepage Mobile Parity (Services Image Fidelity)

### Context
Completed the services-card image fidelity hardening for mobile Figma parity (assets + render quality):
- `src/components/sections/services.tsx`
- `public/figma/services/card-all-seo.png`
- `public/figma/services/card-link-building.png`
- `public/figma/services/card-on-page.png`
- `public/figma/services/card-technical-1.png`
- `public/figma/services/card-technical-2.png`
- `public/figma/services/card-ecommerce.png`
- `public/figma/services/card-content-1.png`
- `public/figma/services/card-content-2.png`

### Findings

#### P0
- None in this section.

#### P1
1. What: Mobile services cards were visually soft/mismatched because front assets were not consistently sourced from high-resolution Figma exports and candidate sizing was too small for transformed crops.
Where: `src/components/sections/services.tsx:27-93`, `src/components/sections/services.tsx:286-293`, and front assets in `public/figma/services/card-all-seo.png`, `public/figma/services/card-link-building.png`, `public/figma/services/card-on-page.png`, `public/figma/services/card-technical-1.png`, `public/figma/services/card-technical-2.png`, `public/figma/services/card-ecommerce.png`, `public/figma/services/card-content-1.png`, `public/figma/services/card-content-2.png`.
Why: These cards use oversized percentage crops (`w` up to `229.11%`); undersized responsive candidates produce blur on phone DPR screens.
Fix: Replaced all front-card sources with fresh Figma exports and raised front-image selection from `350px` to `820px` mobile candidate via `MOBILE_FRONT_IMAGE_SIZES`, plus `quality={95}` on the front `Image`.
Verification: `npx eslint src/components/sections/services.tsx`, `npm run typecheck`, and `npm run build` pass; mobile viewport capture confirms sharper card imagery at `390px`.
Status: Fixed.

#### P2
1. What: One Figma technical-card node reports a mirrored transform (`w-[-183.54%]`) that can be mis-translated by CSS tooling.
Where: Figma services node `766:422` (`get_design_context`) and mapped crop in `src/components/sections/services.tsx:66`.
Why: Negative width tokens are not directly representable in Tailwind-like class tokens and can cause future implementation drift.
Fix: Documented this transform caveat in audit notes and preserved the current empirically matched crop values for this section; follow-up parity checks should validate this node first when updating services cards.
Verification: Playwright card sweep (`output/playwright/section21-services-card-*.png`) shows expected temple framing across the mobile rail.
Status: Mitigated.

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/services.tsx`:
  - Added `MOBILE_FRONT_IMAGE_SIZES` constant for larger mobile candidate widths.
  - Applied `quality={95}` to front card image rendering.
- Replaced front image assets with high-resolution Figma exports:
  - `public/figma/services/card-all-seo.png`
  - `public/figma/services/card-link-building.png`
  - `public/figma/services/card-on-page.png`
  - `public/figma/services/card-technical-1.png`
  - `public/figma/services/card-technical-2.png`
  - `public/figma/services/card-ecommerce.png`
  - `public/figma/services/card-content-1.png`
  - `public/figma/services/card-content-2.png`

### Verification Commands
- `npx eslint src/components/sections/services.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright mobile sweep at `390x844` -> captured `output/playwright/section21-services-card-1.png` through `output/playwright/section21-services-card-8.png`.

## Section 22 — Homepage Mobile Parity (Testimonials Logo Balance)

### Context
Adjusted mobile-only testimonial logo rendering to balance logo visual weight in the shared capsule and documented the repeatable approach for other pages:
- `src/components/sections/testimonials.tsx`
- `docs/audit/MOBILE_PARITY_PLAYBOOK.md`

### Findings

#### P0
- None in this section.

#### P1
1. What: `DesignRush` and `bcms` logos rendered visibly smaller than `GSD` in mobile testimonial cards, despite matching capsule geometry.
Where: `src/components/sections/testimonials.tsx:25-59`, `src/components/sections/testimonials.tsx:183-193`; mobile card captures in `output/playwright/section22-testimonials-card-element-1-v2.png`, `output/playwright/section22-testimonials-card-element-2-v2.png`, `output/playwright/section22-testimonials-card-element-3-v2.png`.
Why: Mark visual-weight imbalance in trust cards weakens readability/brand consistency on the mobile viewport.
Fix: Added a mobile-only per-logo scale hook (`mobileLogoScaleClassName`) and applied tuned values to `DesignRush`/`bcms` while preserving desktop logo geometry.
Verification: `npx eslint src/components/sections/testimonials.tsx`, `npm run typecheck`, and `npm run build` pass; Playwright element captures show balanced logo presence in the `160x77` pill without clipping.
Status: Fixed.

#### P2
1. What: Mobile parity implementations were previously repeated ad hoc across sections, increasing drift risk for upcoming inner-page hero fixes.
Where: Process baseline now captured in `docs/audit/MOBILE_PARITY_PLAYBOOK.md:1-53`.
Why: Without a codified implementation protocol, repeated parity work tends to regress desktop behavior or skip fidelity checks.
Fix: Added a reusable playbook covering mobile/desktop isolation, Figma-node extraction, image fidelity tuning, visual-weight balancing, and verification gates.
Verification: Playbook references active code paths in services/testimonials and required commands for section-by-section rollout.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/testimonials.tsx`:
  - Added optional `mobileLogoScaleClassName` in testimonial metadata.
  - Applied mobile-only scale tuning for `DesignRush` and `bcms`.
  - Kept desktop logo dimensions/positioning unchanged.
- Added `docs/audit/MOBILE_PARITY_PLAYBOOK.md` to document the repeatable mobile parity method for other pages.

### Verification Commands
- `npx eslint src/components/sections/testimonials.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright element captures at `390x844`:
  - `output/playwright/section22-testimonials-card-element-1-v2.png`
  - `output/playwright/section22-testimonials-card-element-2-v2.png`
  - `output/playwright/section22-testimonials-card-element-3-v2.png`

## Section 22B — Testimonials Logo Balance QA Retune

### Context
Applied a QA-driven retune after mobile review feedback that the first two testimonial logos were still too small:
- `src/components/sections/testimonials.tsx`

### Findings

#### P1
1. What: Initial logo-balance tuning still under-sized `DesignRush` and `bcms` relative to `GSD` on real phone viewport, and an aggressive interim scale clipped `DesignRush`.
Where: `src/components/sections/testimonials.tsx:41`, `src/components/sections/testimonials.tsx:58`, `src/components/sections/testimonials.tsx:184-191`; review captures `output/playwright/section22-testimonials-card-element-1-v3.png` and final `output/playwright/section22-testimonials-card-element-1-v4.png`.
Why: Testimonial trust marks are visible identity anchors; inconsistent visual weight lowers perceived quality and readability in the highest-conversion social-proof area.
Fix: Retuned to balanced mobile scales (`DesignRush scale-[1.34]`, `bcms scale-[1.38]`) and added `overflow-hidden` to the mobile logo capsule so overshoot cannot clip outside pill boundaries.
Verification: `npx eslint src/components/sections/testimonials.tsx`, `npm run typecheck`, and `npm run build` pass; final mobile card captures show first two logos visually aligned with `GSD` without clipping.
Status: Fixed.

#### P2
- None in this section.

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/testimonials.tsx`:
  - Retuned `mobileLogoScaleClassName` values for `DesignRush` and `bcms`.
  - Added `overflow-hidden` on mobile logo pill container.

### Verification Commands
- `npx eslint src/components/sections/testimonials.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright final captures at `390x844`:
  - `output/playwright/section22-testimonials-card-element-1-v4.png`
  - `output/playwright/section22-testimonials-card-element-2-v4.png`
  - `output/playwright/section22-testimonials-card-element-3-v4.png`

## Section 22C — Testimonials Logo Clean Sizing Fix

### Context
Replaced transform-based mobile logo scaling with explicit rendered logo dimensions per testimonial card:
- `src/components/sections/testimonials.tsx`

### Findings

#### P1
1. What: Mobile logo balance relied on CSS scale transforms, which upscaled small selected image candidates and produced unstable visual weight on device.
Where: prior approach in `src/components/sections/testimonials.tsx` (replaced in current file), now corrected at `src/components/sections/testimonials.tsx:18-23`, `src/components/sections/testimonials.tsx:41-42`, `src/components/sections/testimonials.tsx:58-59`, `src/components/sections/testimonials.tsx:183-196`.
Why: The previous method amplified perception drift between logos and made QA outcomes inconsistent across phones.
Fix: Removed transform scaling and padding-based logo inflation. Added explicit per-logo mobile dimensions (`mobileLogoWidth`/`mobileLogoHeight`) and centered rendering in a fixed `160x77` capsule.
Verification: Runtime metrics now show deterministic rendered sizes and matching `sizes` hints (`DesignRush 132x30.41`, `bcms 126x40.36`, `GSD 90x30.94`) with clean card captures.
Status: Fixed.

#### P2
1. What: Prior mobile logo implementation mixed layout padding and transform scaling, making future tuning brittle.
Where: replaced mobile logo metadata/model in `src/components/sections/testimonials.tsx:18-23`, `src/components/sections/testimonials.tsx:38-42`, `src/components/sections/testimonials.tsx:55-59`, `src/components/sections/testimonials.tsx:72-75`.
Why: Coupled knobs (padding + transform) increase regressions and are harder to reason about than explicit dimensions.
Fix: Simplified to one control model: explicit width/height per mobile logo.
Verification: Typecheck/lint/build pass with simplified type and rendering path.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Updated `src/components/sections/testimonials.tsx`:
  - Replaced `mobileLogoPaddingClassName`/`mobileLogoScaleClassName` with `mobileLogoWidth`/`mobileLogoHeight`.
  - Centered logos in the mobile capsule with stable `items-center justify-center`.
  - Kept desktop logo rendering unchanged.

### Verification Commands
- `npx eslint src/components/sections/testimonials.tsx` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
- Playwright captures at `390x844`:
  - `output/playwright/section22-testimonials-card-element-clean-1.png`
  - `output/playwright/section22-testimonials-card-element-clean-2.png`
  - `output/playwright/section22-testimonials-card-element-clean-3.png`

## Section 8 — Contact Reliability Hardening (Persistent Limiter + Observability)

### Context
Audited and hardened production reliability for contact submissions:
- `src/app/actions/contact.ts`
- `src/app/actions/contact.test.ts`
- `.env.example`

### Findings

#### P0
- None in this section.

#### P1
1. What: Rate limiting was single-instance memory only.
Where: `src/app/actions/contact.ts:53-70`, `src/app/actions/contact.ts:224-290`, `.env.example:14-16`.
Why: On multi-instance/serverless deployments, users could bypass limits by hopping instances.
Fix: Added distributed rate-limit path using Upstash Redis REST (`UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`) with explicit fallback to in-memory limiter when unavailable.
Verification: New unit test covers distributed limiter behavior (`src/app/actions/contact.test.ts:140-178`); `npm run test` passes.
Status: Fixed (requires env wiring in production).

#### P2
1. What: Contact submission observability was mostly ad-hoc console errors.
Where: `src/app/actions/contact.ts:76-94`, `src/app/actions/contact.ts:246-269`, `src/app/actions/contact.ts:420-606`.
Why: Weak, inconsistent logs slow incident triage and can hide delivery/rate-limit failure modes.
Fix: Added structured redacted event logs for validation failures, rate-limit backend status, dispatch failures, and delivery success/failure paths.
Verification: Test run emits structured `contact_form_event` entries in expected failure/success flows; `npm run test` passes.
Status: Fixed.

2. What: Production webhook env misconfiguration had no early signal.
Where: `src/app/actions/contact.ts:89-94`.
Why: Missing webhook URL/secret silently degrades into runtime user-facing failures unless logs are inspected.
Fix: Added production startup warning event when webhook env is incomplete.
Verification: Static inspection confirms warning path is gated to `NODE_ENV=production`.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Added Upstash-backed distributed limiter with in-memory fallback in `src/app/actions/contact.ts`.
- Added structured, PII-safe contact event logging in `src/app/actions/contact.ts`.
- Added production config warning signal for missing webhook env in `src/app/actions/contact.ts`.
- Extended test coverage for distributed limiter in `src/app/actions/contact.test.ts`.
- Added distributed limiter env placeholders in `.env.example`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (6 files, 11 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 9 — CSP Nonce Rollout (Remove unsafe-inline)

### Context
Completed CSP hardening to remove inline execution allowances and bind scripts/styles to per-request nonces:
- `middleware.ts`
- `src/lib/csp.ts`
- `src/app/layout.tsx`
- `next.config.ts`
- `src/lib/csp.test.ts`

### Findings

#### P0
- None in this section.

#### P1
1. What: CSP policy still relied on `'unsafe-inline'` in both `script-src` and `style-src`.
Where: `src/lib/csp.ts:3-15`, `middleware.ts:6-20`, `src/app/layout.tsx:32-40`, `next.config.ts:49-64`.
Why: Inline allowances materially expand XSS blast radius in production.
Fix: Moved CSP construction to middleware with per-request nonce (`x-nonce`), removed static CSP from `next.config.ts`, and attached nonce to inline JSON-LD script via Suspense-wrapped server component.
Verification: `src/lib/csp.test.ts:6-13` asserts nonce directives and no `'unsafe-inline'`; full `lint/test/typecheck/build` pass.
Status: Fixed.

#### P2
1. What: CSP behavior had no direct regression assertion.
Where: `src/lib/csp.test.ts:1-14`.
Why: Future policy edits could silently reintroduce unsafe directives.
Fix: Added targeted unit test for generated CSP policy shape.
Verification: `npm run test` passes `src/lib/csp.test.ts`.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Added nonce-based CSP builder in `src/lib/csp.ts`.
- Added middleware nonce injection and CSP response header in `middleware.ts`.
- Updated root layout JSON-LD script to consume middleware nonce via Suspense-wrapped async server component in `src/app/layout.tsx`.
- Removed static CSP header from `next.config.ts` to avoid conflicting policies.
- Added CSP policy regression test in `src/lib/csp.test.ts`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (7 files, 12 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 10 — Navigation and Content UX Consistency

### Context
Resolved duplicated nav matching logic and homepage blog-link mismatch:
- `src/lib/nav-active.ts`
- `src/components/layout/mobile-menu.tsx`
- `src/components/layout/navbar-active-links.tsx`
- `src/data/blog-posts.ts`
- `src/components/sections/blog.tsx`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
1. What: Desktop and mobile nav used separate active-route rules.
Where: `src/lib/nav-active.ts:1-46`, `src/components/layout/mobile-menu.tsx:11-23`, `src/components/layout/mobile-menu.tsx:191-204`, `src/components/layout/navbar-active-links.tsx:22-24`.
Why: Divergent logic can produce inconsistent active highlighting after route updates.
Fix: Added shared `isNavItemActive` matcher and switched both nav implementations to consume it.
Verification: Added matcher tests (`src/lib/nav-active.test.ts:5-18`) and full `npm run test` pass.
Status: Fixed.

2. What: Homepage featured blog cards still rendered unpublished entries as clickthrough article links.
Where: `src/data/blog-posts.ts:19-30`, `src/components/sections/blog.tsx:3`, `src/components/sections/blog.tsx:35-50`.
Why: Users could click expecting article detail and hit catalog fallback behavior.
Fix: Added `PUBLISHED_BLOG_POSTS` subset and switched homepage blog section to render published entries only.
Verification: Added dataset assertions (`src/data/blog-posts.test.ts:5-14`) and full `npm run test` pass.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Added shared nav matcher utility in `src/lib/nav-active.ts`.
- Updated mobile and desktop nav components to reuse shared matcher.
- Added published-blog subset export in `src/data/blog-posts.ts`.
- Updated homepage blog section to use published subset only.
- Added regression tests for nav matcher and blog dataset behavior.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (9 files, 17 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 12 — Production Rollout Verification Scaffolding

### Context
Added executable production rollout checks for the remaining external deployment work:
- `scripts/verify-production-config.mjs`
- `package.json`
- `docs/audit/PRODUCTION_RUNBOOK.md`

### Findings

#### P1
1. What: Final production readiness still depends on external secret wiring and runtime smoke checks.
Where: `scripts/verify-production-config.mjs:3-71`, `package.json:6-13`, `docs/audit/PRODUCTION_RUNBOOK.md:3-53`.
Why: Without explicit verification steps, deployments can go live with missing webhook/secret configuration or unverified CSP/rate-limit behavior.
Fix: Added `npm run verify:prod-config` plus a concrete runbook for pre-deploy and post-deploy checks.
Verification: `npm run verify:prod-config` fails when env is missing and passes with valid env values.
Status: Partially fixed (external deployment execution still required).

#### P2
1. What: No repository-native command existed to validate production-required env contract.
Where: `scripts/verify-production-config.mjs:3-71`, `package.json:12`.
Why: Manual env checks are error-prone and frequently skipped under release pressure.
Fix: Added script to validate required keys, URL shape, and Upstash pair consistency.
Verification:
- `npm run verify:prod-config` -> fails with missing required keys.
- `NEXT_PUBLIC_SITE_URL=... CONTACT_FORM_WEBHOOK_URL=... CONTACT_FORM_WEBHOOK_SECRET=... npm run verify:prod-config` -> passes.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Added production config verifier script in `scripts/verify-production-config.mjs`.
- Added `verify:prod-config` npm command in `package.json`.
- Added rollout and smoke-test procedure in `docs/audit/PRODUCTION_RUNBOOK.md`.

### Verification Commands
- `npm run verify:prod-config` -> fails as expected when required env vars are unset.
- `NEXT_PUBLIC_SITE_URL='https://heroicrankings.com' CONTACT_FORM_WEBHOOK_URL='https://example.com/webhook' CONTACT_FORM_WEBHOOK_SECRET='example-secret' npm run verify:prod-config` -> pass.
- `npm run lint` -> fail due unrelated local drift in `src/components/pages/contact/contact-form.tsx:52` (not part of this atomic slice).

## Section 11 — Client Scroll Performance Hardening

### Context
Audited remaining scroll interaction hotspots and reduced unnecessary client work:
- `src/components/sections/services.tsx`
- `src/components/sections/about.tsx`
- `src/components/ui/desktop-scroll-progress.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Services wheel interception previously engaged whenever pinned-zone conditions matched.
Where: `src/components/sections/services.tsx:81-175`.
Why: Broad interception window increases chance of perceived jank while users are not actively interacting with the horizontal rail.
Fix: Added explicit interaction gating (hover/focus), plus vertical-intent ratio check before preventing default and mutating horizontal scroll.
Verification: `npm run build` pass; behavior now only intercepts in active rail interaction contexts.
Status: Fixed.

#### P2
1. What: Scroll progress bar hydrated eagerly even where desktop-only behavior mattered most.
Where: `src/components/sections/about.tsx:4`, `src/components/sections/about.tsx:95`, `src/components/ui/desktop-scroll-progress.tsx:1-38`.
Why: Eager hydration can add avoidable client work on mobile where the control provides limited value.
Fix: Introduced desktop-gated dynamic wrapper (`ssr: false` + media-query match) and replaced direct usage in `About` section.
Verification: `npm run build` pass and route output remains stable with deferred desktop-only mount path.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Tuned services wheel interception in `src/components/sections/services.tsx` with interaction + intent gating.
- Added `DesktopScrollProgress` wrapper to defer loading and mount only on desktop.
- Switched `About` section to use `DesktopScrollProgress`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (9 files, 17 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 7 — Contact Validation Contract (Client + Server)

### Context
Audited duplicated validation rules in the contact flow and unified them:
- `src/lib/contact-validation.ts`
- `src/app/actions/contact.ts`
- `src/components/pages/contact/contact-form.tsx`
- `src/lib/contact-validation.test.ts`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
1. What: Contact validation rules (email format, length limits, allowed source options) were duplicated between client and server.
Where: `src/components/pages/contact/contact-form.tsx:8-15`, `src/app/actions/contact.ts:6-13`, `src/lib/contact-validation.ts:1-30`.
Why: Duplicated contracts drift over time, causing form UX to accept values that server later rejects (or vice versa).
Fix: Added shared validation module and switched both action + form to import the same constants/helpers.
Verification: `npm run test` passes with new helper tests (`src/lib/contact-validation.test.ts:10-21`) and existing contact action coverage.
Status: Fixed.

#### P3
- None in this section.

### Changes Made
- Added shared contact validation contract in `src/lib/contact-validation.ts`.
- Updated server validation to use shared helpers/constants in `src/app/actions/contact.ts`.
- Updated client form validation/options/maxlength values to use shared constants in `src/components/pages/contact/contact-form.tsx`.
- Added helper regression tests in `src/lib/contact-validation.test.ts`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (6 files, 10 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Remediation Task 3 — Unified Insights Registry Across Catalog, Route, and Sitemap

### Context
Closed the open Section 3 routing/crawl alignment gap by making one typed source of truth for published insights:
- `src/data/insights-registry.ts`
- `src/data/blog-posts.ts`
- `src/app/(pages)/insights/[slug]/page.tsx`
- `src/components/pages/insights/insights-catalog.tsx`
- `src/app/sitemap.ts`

### Findings

#### P1
1. What: Published insight slug inventory was still split across data, route generation, and crawl output.
Where: `src/data/insights-registry.ts:15-67`, `src/app/(pages)/insights/[slug]/page.tsx:6-33`, `src/app/sitemap.ts:3-27`.
Why: Split inventories can publish stale/invalid crawl links or omit valid detail routes when content changes.
Fix: Implemented a typed registry (`INSIGHT_REGISTRY` + `PUBLISHED_INSIGHTS`) and derived both `generateStaticParams` and sitemap insight URLs from that shared source.
Verification: `npm run test` now asserts sitemap contains only published insight slugs (`src/app/sitemap.test.ts:5-13`) and route static params match registry (`src/app/(pages)/insights/[slug]/page.test.ts:7-10`).
Status: Fixed.

2. What: Published detail-page component coverage had no compile-time guard.
Where: `src/app/(pages)/insights/[slug]/page.tsx:9-11`, `src/data/insights-registry.ts:56-57`.
Why: Marking an entry as published without wiring a component can lead to runtime 404 drift.
Fix: Added `PublishedInsightSlug` type and required `INSIGHT_ARTICLE_COMPONENTS` to satisfy `Record<PublishedInsightSlug, ComponentType>`.
Verification: `npm run typecheck` pass confirms type contract holds.
Status: Fixed.

#### P2
1. What: Unpublished cards in the insights catalog looked like regular article links.
Where: `src/data/blog-posts.ts:24-27`, `src/components/pages/insights/insights-catalog.tsx:57-76`.
Why: Users can click expecting detail content and be routed back to the catalog, creating misleading navigation.
Fix: Render unpublished entries as non-clickthrough `<article>` cards with a visible "Coming soon" state.
Verification: Manual UI check on `/insights`; unpublished entries now show badge and are not anchors.
Status: Fixed.

#### P3
- None in this task.

### Changes Made
- Added typed registry exports and published-entry helpers in `src/data/insights-registry.ts`.
- Updated `src/data/blog-posts.ts` to consume shared registry types.
- Updated insight dynamic route metadata/static params resolution to derive from published registry in `src/app/(pages)/insights/[slug]/page.tsx`.
- Updated catalog card rendering to make unpublished entries explicit non-clickthrough in `src/components/pages/insights/insights-catalog.tsx`.
- Updated sitemap insight URL generation to derive from `PUBLISHED_INSIGHTS` in `src/app/sitemap.ts`.
- Added route/sitemap regression coverage in `src/app/(pages)/insights/[slug]/page.test.ts` and `src/app/sitemap.test.ts`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (5 files, 8 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Remediation Task 1A — Contact Hardening (Signing + Retry + Throttle)

### Context
Applied P1 remediation directly on the contact server action and env contract:
- `src/app/actions/contact.ts`
- `.env.example`

### Findings

#### P1
1. What: Outbound webhook calls lacked origin authentication.
Where: `src/app/actions/contact.ts:178-189`, `src/app/actions/contact.ts:219-225`, `.env.example:7-8`.
Why: Receiver could not verify request authenticity.
Fix: Added HMAC SHA-256 signature headers (`X-Heroic-Signature*`) keyed by `CONTACT_FORM_WEBHOOK_SECRET`.
Verification: `npm run lint`, `npm run typecheck`, `npm run build` all pass.
Status: Fixed.

2. What: Webhook dispatch lacked retry controls for transient failures.
Where: `src/app/actions/contact.ts:35`, `src/app/actions/contact.ts:192-199`, `src/app/actions/contact.ts:207-252`.
Why: Single-attempt delivery drops leads on transient 5xx/429/network failures.
Fix: Added bounded retry loop with status-code retry gating, per-attempt timeout, and exponential backoff.
Verification: `npm run build` pass confirms route compilation with retry path.
Status: Fixed.

3. What: Submission throttling was absent beyond honeypot/timing checks.
Where: `src/app/actions/contact.ts:118-176`, `src/app/actions/contact.ts:270-278`.
Why: Repeated scripted submissions could still flood the action.
Fix: Added hashed-header keyed in-memory rate limiter with configurable window and max submissions.
Verification: `npm run lint` pass and no type/runtime errors in build.
Status: Partially fixed (store is per-instance, not shared).

### Changes Made
- Added signed webhook dispatch and retry/backoff logic in `src/app/actions/contact.ts`.
- Added in-memory rate-limit guard keyed by hashed request metadata in `src/app/actions/contact.ts`.
- Added `CONTACT_FORM_WEBHOOK_SECRET` and optional rate-limit env keys in `.env.example`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same non-blocking CSS optimizer warnings).

## Remediation Task 2 — Behavioral Tests + CI Test Gate

### Context
Added executable coverage for critical app logic and wired CI to enforce it:
- `package.json`
- `.github/workflows/ci.yml`
- `vitest.config.ts`
- `src/app/actions/contact.test.ts`
- `src/app/robots.test.ts`
- `src/app/sitemap.test.ts`
- `src/lib/metadata.test.ts`

### Findings

#### P1
1. What: CI did not run behavioral tests.
Where: `.github/workflows/ci.yml:27-31` (pre-change), `.github/workflows/ci.yml:30-34` (post-change).
Why: Logic regressions could merge if static checks passed.
Fix: Added `npm run test` to CI pipeline.
Verification: Local `npm run test` passes and workflow now includes test step.
Status: Fixed.

2. What: Contact action had no direct regression tests for delivery safeguards.
Where: `src/app/actions/contact.test.ts:1-136`.
Why: Validation, retries, and throttling are business-critical behaviors.
Fix: Added unit tests for unavailable-config handling, retry success, and rate-limit rejection.
Verification: `npm run test` passes all 6 tests.
Status: Fixed.

#### P2
1. What: SEO output routes and metadata helper lacked regression tests.
Where: `src/app/robots.test.ts:1-14`, `src/app/sitemap.test.ts:1-13`, `src/lib/metadata.test.ts:1-26`.
Why: SEO regressions can be silent unless output is asserted.
Fix: Added route-output and metadata shape tests.
Verification: `npm run test` passes and assertions cover canonical, OG/Twitter defaults, robots directives, and sitemap entries.
Status: Fixed.

### Changes Made
- Added Vitest and `npm test` script.
- Added `vitest.config.ts` with project alias resolution.
- Added contact, metadata, robots, and sitemap tests.
- Updated CI to run tests before build.

### Verification Commands
- `npm run lint` -> pass.
- `npm run test` -> pass (4 files, 6 tests).
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same non-blocking CSS optimizer warnings).

## Remediation Task 1B — CSP Enforcement Baseline

### Context
Applied production header hardening in Next.js config:
- `next.config.ts`

### Findings

#### P1
1. What: CSP had remained report-only in runtime headers.
Where: `next.config.ts:63-64` (pre-change), `next.config.ts:64` (post-change).
Why: Policy violations were observable but not blocked.
Fix: Switched to enforced `Content-Security-Policy` header with current-compatible directives.
Verification: `npm run lint`, `npm run typecheck`, `npm run build` pass with enforced header config.
Status: Fixed.

2. What: CSP still includes `'unsafe-inline'` allowances.
Where: `next.config.ts:14`, `src/app/layout.tsx:89-92`.
Why: Inline allowances preserve a broader execution surface than nonce/hash-only policy.
Fix: Logged follow-up TODO for nonce/hash rollout to remove unsafe-inline.
Verification: Follow-up required with middleware-based nonce implementation and browser validation.
Status: Open.

### Changes Made
- Replaced `Content-Security-Policy-Report-Only` with enforced `Content-Security-Policy` in `next.config.ts`.
- Added reusable CSP policy constant for maintainability in `next.config.ts`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same non-blocking CSS optimizer warnings).

## Section 6 — Test/CI/DevEx Baseline

### Context
Audited local and CI verification surface for regression prevention:
- `package.json`
- `eslint.config.mjs`
- `tsconfig.json`
- `.github/workflows/ci.yml`

### Findings

#### P0
- None in this section.

#### P1
1. What: Automated test execution is still absent from project scripts and CI.
Where: `package.json:5-11`, `.github/workflows/ci.yml:21-31`.
Why: Regressions in business logic can pass lint/build without behavioral coverage.
Fix: Left as open TODO; CI baseline is now present but test suite is not yet implemented.
Verification: `package.json` has no `test` script and workflow currently runs lint/typecheck/build only.
Status: Open.

2. What: CI verification workflow was missing.
Where: `.github/workflows/ci.yml:1-31`.
Why: Without CI, pull requests had no automated quality gate.
Fix: Added CI workflow for install, lint, typecheck, and build on pull requests.
Verification: Workflow file exists with required steps and references `.nvmrc`.
Status: Fixed in this section.

#### P2
1. What: Type-checking was not exposed as an explicit script command.
Where: `package.json:5-11`.
Why: Separate typecheck command improves local/CI clarity and shortens diagnosis loops.
Fix: Added `typecheck` script (`tsc --noEmit`).
Verification: `npm run typecheck` passes locally.
Status: Fixed in this section.

#### P3
- None in this section.

### Changes Made
- Added `typecheck` script in `package.json`.
- Added baseline CI workflow at `.github/workflows/ci.yml` (lint + typecheck + build).

### Verification Commands
- `npm run lint` -> pass.
- `npm run typecheck` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 5 — SEO Surfaces

### Context
Audited crawl/index metadata surfaces and machine-readable output routes:
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/opengraph-image.tsx`
- `src/app/layout.tsx`
- `src/lib/metadata.ts`

### Findings

#### P0
- None in this section.

#### P1
- None in this section.

#### P2
1. What: Sitemap `lastModified` was manual and drift-prone.
Where: `src/app/sitemap.ts:5-6`, `src/app/sitemap.ts:28-31`.
Why: Static hardcoded timestamps quickly become stale and reduce freshness signal quality.
Fix: Replaced manual constant with build-time timestamp generation.
Verification: `npm run build` passes and `/sitemap.xml` emits generated ISO timestamp.
Status: Fixed in this section.

2. What: Internal preview route needed crawler-level disallow in robots policy.
Where: `src/app/robots.ts:7-12`, `src/app/navbar-preview/page.tsx:4-11`.
Why: Keeping preview/dev routes out of crawl pipelines reduces accidental index pollution.
Fix: Added `disallow: [\"/navbar-preview\"]` in `robots` rules while preserving page-level `noindex`.
Verification: `npm run build` passes and `/robots.txt` includes disallow directive.
Status: Fixed in this section.

3. What: Sitemap route coverage still does not align with catalog post slug inventory.
Where: `src/app/sitemap.ts:21-23`, `src/data/blog-posts.ts:18`, `src/data/blog-posts.ts:28`, `src/data/blog-posts.ts:38`.
Why: Divergent slug inventories can hide intended content from search discovery when publishing expands.
Fix: Logged TODO to unify published-article registry and derive sitemap coverage from it.
Verification: Compare sitemap routes against `BLOG_POSTS` slugs.
Status: Open.

#### P3
- None in this section.

### Changes Made
- Updated `src/app/sitemap.ts` to use build-time `lastModified` generation.
- Updated `src/app/robots.ts` to disallow `/navbar-preview`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 4 — Client Component Performance Hotspots

### Context
Audited interactive client-heavy UI modules with focus on event handling, hydration behavior, and keyboard UX:
- `src/components/layout/mobile-menu.tsx`
- `src/components/layout/navbar-active-links.tsx`
- `src/components/layout/navbar.tsx`
- `src/components/ui/scroll-progress-bar.tsx`
- `src/components/sections/services.tsx`

### Findings

#### P0
- None in this section.

#### P1
1. What: Services section intercepts wheel events with a non-passive listener during a pinned zone.
Where: `src/components/sections/services.tsx:96-137`.
Why: Scroll hijacking in a large section can increase scroll jank risk on low-end devices and trackpads.
Fix: Logged TODO to profile and tune interception thresholds/behavior.
Verification: Profile wheel scroll in performance tools while traversing `#services`.
Status: Open.

2. What: Scroll progress drag math could run when rail is non-scrollable, causing unstable behavior under edge geometry.
Where: `src/components/ui/scroll-progress-bar.tsx:82-106`, `src/components/ui/scroll-progress-bar.tsx:170-174`.
Why: Zero-width offset math and missing pointer-cancel cleanup can leave drag interactions inconsistent.
Fix: Added non-scrollable guards and pointer-cancel drag cleanup.
Verification: `npm run lint` and `npm run build` pass; dragging with no overflow no longer mutates scroll position.
Status: Fixed in this section.

#### P2
1. What: Mobile menu did not restore focus to trigger when closed via Escape/backdrop/close button.
Where: `src/components/layout/mobile-menu.tsx:66-74`, `src/components/layout/mobile-menu.tsx:96-99`, `src/components/layout/mobile-menu.tsx:140-159`, `src/components/layout/mobile-menu.tsx:191-195`.
Why: Keyboard users can lose interaction context after dismissing the overlay.
Fix: Added trigger ref and optional focus restoration path in close handlers.
Verification: Open menu via keyboard, close with Escape, confirm focus returns to menu button.
Status: Fixed in this section.

2. What: Active-nav routing rules are duplicated across desktop and mobile components.
Where: `src/components/layout/mobile-menu.tsx:24-34`, `src/components/layout/navbar-active-links.tsx:21-43`.
Why: Duplicate path logic is prone to drift when routes are added/renamed.
Fix: Logged TODO for shared nav activation utility.
Verification: Compare active-state rules between both files and confirm they currently diverge risk-wise.
Status: Open.

#### P3
- None in this section.

### Changes Made
- Hardened drag safety and pointer cleanup in `src/components/ui/scroll-progress-bar.tsx`.
- Added focus restoration and body scroll-lock class toggling in `src/components/layout/mobile-menu.tsx`.

### Verification Commands
- `npm run lint` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).

## Section 3 — Dynamic Content and Routing Reliability

### Context
Audited the insights listing/detail path and route metadata generation:
- `src/app/(pages)/insights/[slug]/page.tsx`
- `src/components/pages/insights/insights-catalog.tsx`
- `src/components/pages/insights/insights-page.tsx`
- `src/components/pages/insights/blog-post-detail-content.tsx`
- `src/data/blog-posts.ts`

### Findings

#### P0
- None in this section.

#### P1
1. What: Insights catalog cards currently loop back to `/insights` instead of navigating to detail routes.
Where: `src/data/blog-posts.ts:23`, `src/data/blog-posts.ts:33`, `src/data/blog-posts.ts:43`, `src/components/pages/insights/insights-catalog.tsx:22`.
Why: Users cannot discover article detail routes from the catalog UI, reducing content depth and engagement.
Fix: Logged TODO for shared published-article registry and deterministic card href derivation.
Verification: Click any catalog card and observe route remains `/insights`.
Status: Open.

2. What: Detail route slug handling and metadata were previously hardcoded to a single constant path.
Where: `src/app/(pages)/insights/[slug]/page.tsx:14-61`.
Why: Hardcoded checks increase drift risk and make additional article rollout error-prone.
Fix: Implemented `INSIGHT_ARTICLES` map with `generateStaticParams`, typed slug guard, and slug-aware `generateMetadata`.
Verification: `npm run lint` and `npm run build` pass; `/insights/market-research-guide` resolves and unknown slugs 404 through guard.
Status: Fixed in this section.

#### P2
1. What: Published route slugs and catalog data are maintained in separate sources.
Where: `src/app/(pages)/insights/[slug]/page.tsx:14-21`, `src/data/blog-posts.ts:16-47`.
Why: Dual sources make it easy to publish mismatched slugs or stale links.
Fix: Partial mitigation done with route map; unification remains TODO.
Verification: Compare `INSIGHT_ARTICLES` keys with `BLOG_POSTS[*].slug`.
Status: Open.

#### P3
- None in this section.

### Changes Made
- Refactored `src/app/(pages)/insights/[slug]/page.tsx` to use a typed article map for slug validation, static params generation, and metadata generation.

### Verification Commands
- `npm run lint` -> pass.
- `npm run build` -> pass (same 3 non-blocking CSS optimizer warnings).
