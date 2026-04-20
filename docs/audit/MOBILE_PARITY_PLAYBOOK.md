# Mobile Figma Parity Playbook

Use this checklist when porting any page section to 1:1 Figma mobile parity without desktop regressions.

## 1) Isolate mobile from desktop first
- Keep desktop markup/geometry untouched (`lg+`).
- Add a mobile-only branch (`lg:hidden`) or mobile-only properties that reset at `lg`.
- Reference: `src/components/sections/testimonials.tsx:160-237` (mobile rail) and `src/components/sections/testimonials.tsx:237-278` (desktop preserved).

## 2) Pull exact Figma node geometry before editing
- Fetch `get_design_context` for the target mobile node and card children.
- Copy exact card width/height, gaps, paddings, and image crop transforms.
- Reference example values used directly from Figma:
  - services crops in `src/components/sections/services.tsx:32`, `src/components/sections/services.tsx:40`, `src/components/sections/services.tsx:49`, `src/components/sections/services.tsx:57`, `src/components/sections/services.tsx:66`, `src/components/sections/services.tsx:75`, `src/components/sections/services.tsx:84`, `src/components/sections/services.tsx:92`.

## 3) Fix image fidelity (not just geometry)
- Export high-resolution assets from Figma for mobile cards.
- Replace local assets one-by-one to avoid crop/source mismatches.
- Increase `next/image` candidate sizing to the real rendered width after transforms.
- Reference:
  - `src/components/sections/services.tsx:16`
  - `src/components/sections/services.tsx:286-293`
  - `public/figma/services/card-all-seo.png`
  - `public/figma/services/card-link-building.png`
  - `public/figma/services/card-on-page.png`
  - `public/figma/services/card-technical-1.png`
  - `public/figma/services/card-technical-2.png`
  - `public/figma/services/card-ecommerce.png`
  - `public/figma/services/card-content-1.png`
  - `public/figma/services/card-content-2.png`

## 4) Balance logo/mark visual weight inside fixed capsules
- Even with Figma-correct container sizes, logo PNG bounds can make marks feel too small.
- Add **mobile-only** per-logo visual scaling (or width overrides) while preserving desktop values.
- Reference:
  - metadata hook: `src/components/sections/testimonials.tsx:18-23`
  - per-logo mobile scales: `src/components/sections/testimonials.tsx:41`, `src/components/sections/testimonials.tsx:58`
  - mobile-only logo class application: `src/components/sections/testimonials.tsx:189-193`

## 5) Verify at mobile baseline with deterministic captures
- Use `390x844` viewport.
- Capture each card as an element screenshot, not only viewport screenshots.
- Keep artifacts in `output/playwright/`.
- Commands used in current implementation:
  - `npx eslint src/components/sections/<section>.tsx`
  - `npm run typecheck`
  - `npm run build`
  - Playwright element screenshots for each mobile card.

## 6) Acceptance gates before commit
- Figma parity: spacing/card geometry/typography/crops match at `390px`.
- Desktop regression: `lg+` layout unchanged by inspection + build.
- Audit memory updated:
  - `docs/audit/AUDIT.md`
  - `docs/audit/TODO.md`
  - `docs/audit/STATE_PACK.md`
