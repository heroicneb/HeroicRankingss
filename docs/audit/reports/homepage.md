# Homepage Pixel-Perfect Audit — 2026-04-03

**Figma file:** `iIVCGkNIrd9sc6j9NKmGIF` | **Node:** `702:10152` (HR - Homepage, 1440px)
**Screenshot reference:** `docs/audit/screenshots/index-1440-light.png`
**Figma extraction cache:** `docs/figma-cache/extractions/2026-04-03-homepage-section-00-full-audit.md`

---

## Overall Assessment

**NEEDS_WORK** — The implementation is structurally sound and matches the Figma layout in most areas. Typography tokens, card sizes, grid columns, and spacing are largely correct. However, there are 7 confirmed discrepancies ranging from a critical gradient mismatch on the Partnerships panel to minor spacing and letter-spacing differences. No section completely fails, but Partnerships and Stats have the most significant visual drift.

---

## Section 1: Hero

**Status:** NEEDS_WORK

### What matches:
- H1 text `max-w-[857px]` centered — Figma H1 at x=291 on 1440px canvas = `(1440-857)/2 = 291.5` ✓
- H1 typography: 62px, weight 400, tracking -1.24px, line-height 1.29 (80px/62px) ✓
- Body paragraph `max-w-[670px]` centered — Figma at x=385 = `(1440-670)/2 = 385` ✓
- Body paragraph `min-h-[116px]` — Figma paragraph node height = 116px ✓
- Hero image wrapper: `max-w-[1440px] md:px-[10px]` → 1420px at 1440 viewport — Figma rect 1420px ✓
- Image border-radius: `rounded-[30px]` mobile, `lg:rounded-[var(--radius-card)]` (40px) ✓

### Discrepancies:

- [ ] **Hero section top padding too small** (Figma: 104px, Actual: 90px) — Severity: Minor
  - Figma: Navbar height = 69px, H1 starts at canvas y=173. Gap below navbar = 173−69 = **104px**
  - Code: `pt-[90px]` on `lg:` breakpoint = 90px
  - Fix: Change `pt-[90px]` to `pt-[104px]` at `lg:`
  - File: `src/components/sections/hero.tsx:9`

- [ ] **Hero image margin-top too small on desktop** (Figma: ~116px, Actual: 80px) — Severity: Minor
  - Figma: Hero text+CTA ends ~y=504, image starts y=620. Gap = **~116px**
  - Code: `lg:mt-20` = 80px
  - Fix: Change `lg:mt-20` to `lg:mt-[116px]`
  - File: `src/components/sections/hero.tsx:46`

---

## Section 2: Services

**Status:** PASS

### What matches:
- Section label, H2 max-width 760px, CTA button layout — all match Figma positions
- Service card dimensions: `h-[560px] w-[413px]` at desktop ✓
- Card border-radius: `rounded-[var(--radius-card)]` = 40px ✓
- Card inner padding: `p-[30px]` at desktop ✓
- `mt-[69px]` before scroll rail — Figma gap from CTA to cards = ~69px ✓
- Horizontal scroll rail with wheel intercept — matches Figma carousel intent ✓
- CTA "Book a Strategy Call" button — Figma width=212px, code uses `w-auto` (content-driven, equivalent) ✓

### Discrepancies:
- None confirmed.

---

## Section 3: About

**Status:** PASS

### What matches:
- Grid layout: `xl:grid-cols-[522px_630px] xl:gap-32` = 522+128+630 = 1280px = content area ✓
- About image: `xl:h-[588px]` matches Figma h=588px ✓
- About paragraph `xl:max-w-[485px]` — Figma width=484px (1px rounding) ✓
- Logo marquee opacity-50 in light mode — appropriate for visual hierarchy
- SectionLabel, H2 typography all use correct tokens ✓

### Discrepancies:
- None confirmed.

---

## Section 4: Team

**Status:** PASS

### What matches:
- Desktop card dimensions: `h-[409px] w-[305px]` — Figma 305×409px ✓
- Card border-radius: `rounded-[var(--radius-card)]` = 40px ✓
- Team card 2 offset: `min-[1360px]:translate-y-[70px]` — Figma card2.y − card1.y = 3282−3212 = 70px ✓
- Grid column gap between cards: Figma gap = 1055−730−305 = 20px, code `gap-5` = 20px ✓
- Grid layout `min-[1360px]:grid-cols-[506px_630px]`: 80+506+144(gap-9=36? No—gap-[144px])+630 = 1360px. Verifying: code `min-[1360px]:gap-[144px]` → 506+144+630=1280 ✓
- Arrow button position: `top-[213px] right-5` — Figma button y=3425−3212=213px from card top, right edge gap ≈ 20px ✓
- "20+" outlined text with `-webkit-text-stroke` ✓
- H2 text matches Figma ("We stand out by turning search into a measurable revenue engine") ✓

### Discrepancies:
- None confirmed.

---

## Section 5: Stats + FeaturedLogos

**Status:** NEEDS_WORK

### What matches:
- Dark wrapper `surface-rect-5` background = `#151419` ✓
- Dark wrapper `md:mx-[10px]` at 1440px viewport → 1420px wide — Figma rect x=10 w=1420 ✓
- Dark wrapper `lg:rounded-[var(--radius-card)]` = 40px ✓
- Stats image sizes: img1&2 = 376×376px, img3 = 359×359px — Figma ✓
- Stats label centered, H2 centered, max-w-[724px] paragraph ✓
- FeaturedLogos heading: `type-h3` centered in white ✓
- FeaturedLogos border: `border-[var(--color-hr-accent)]` purple border around logo box ✓
- FeaturedLogos card `rounded-[var(--radius-card)]` = 40px ✓

### Discrepancies:

- [ ] **Stats key-point text letter-spacing incorrect** (Figma: −0.96px, Actual: −0.36px) — Severity: Major
  - Figma: `Key points/Web: SemiBold 48px, letterSpacing: −2 (−2% of 48 = −0.96px)`
  - Code: `.type-key-point { letter-spacing: var(--tracking-section-token) }` = `−0.32px` (mobile) / `−0.36px` (desktop)
  - The stat metrics appear significantly less tight than Figma design
  - Fix: Add explicit `letter-spacing: −0.96px` to `.type-key-point` OR update the token
  - File: `src/app/globals.css:354` (`.type-key-point` class)

- [ ] **Stats CTA button height** (Figma: 51px, Actual: 45px) — Severity: Minor
  - Figma node `702:10206` height = 51px for the "Get Started Today" button in Stats
  - Code: `h-[45px]` across all CTA buttons (consistent system-wide token)
  - This may be a Figma design artifact — all other CTAs are 45px. Flag for designer confirmation.
  - File: `src/components/sections/stats.tsx:57` and `:99`

---

## Section 6: CaseStudies + QuoteRotator

**Status:** NEEDS_WORK

### What matches:
- Case study card dimensions: `h-[501px]` desktop, `w-[413px]` — Figma 413×501px ✓
- Case study card header height: `lg:h-[305px]` — Figma header rect h=305px ✓
- Case study card border-radius: `lg:rounded-[var(--radius-card)]` = 40px ✓
- Card grid gap: `gap-5` = 20px — Figma card spacing ≈ 20−21px ✓
- Arrow button position: `lg:top-[213px] lg:right-5` — Figma verified ✓
- Card colors: `bg-[var(--color-hr-my-baskets)]`, `bg-[var(--color-hr-dark)]`, `bg-[var(--color-hr-art-maudsch)]` ✓
- QuoteRotator `max-w-[926px]` — Figma quote group width=926px ✓
- QuoteRotator `gap-[30px]` between quotes — Figma quote spacing=30px ✓
- Proven results photo panel: gradient `42.7625deg`, colors `#151419 → #4c4ab5` — Figma ✓
- Proven results photo panel: `max-w-[1440px] lg:px-[20px]` → 1400px wide — Figma 1400px ✓
- Case studies `lg:mt-[120px]` between cards and QuoteRotator — Figma gap=120px ✓

### Discrepancies:

- [ ] **Header-to-cards gap too small** (Figma: 80px, Actual: 56px) — Severity: Major
  - Figma: CS H2 ends at y=5656 (5476+180), cards start at y=5736. Gap = **80px**
  - Code: `Container className="mt-[60px] lg:mt-14"` → `lg:mt-14` = 56px
  - Fix: Change `lg:mt-14` to `lg:mt-20` on the cards container
  - File: `src/components/sections/case-studies.tsx:124`

- [ ] **"See For Yourself" CTA button over-wide** (Figma: 181px, Actual: max-w-251px) — Severity: Major
  - Figma node `702:10359` width = **181px**
  - Code: `max-w-[251px]` at desktop, `w-full` → renders ~181px content-driven but may expand
  - At desktop, the grid column right side has `max-w-[413px]` container
  - Fix: Change `max-w-[251px]` to `max-w-[181px]` for `min-[1360px]:` breakpoint
  - File: `src/components/sections/case-studies.tsx:113`

---

## Section 7: TrustAuthority

**Status:** NEEDS_WORK

### What matches:
- Grid layout: `grid-cols-[600px_670px] gap-[10px]` — 600+10+670=1280px ✓
- H2 `max-w-[413px]` — Figma H2 width=413px ✓
- CTA button `w-[303px]` — Figma CTA node `702:10366` width=303px ✓
- Trust card dimensions: `h-[100px] w-[160px]` ✓
- Trust card border-radius: `rounded-[20px]` ✓
- Trust Authority Rail width: `w-[670px]` — Figma rail frame width=670px ✓

### Discrepancies:

- [ ] **Trust Authority Rail height too tall** (Figma: 580px, Actual: 660px) — Severity: Major
  - Figma node `767:2741` (Frame 177113): height = **580px**
  - Code: `h-[660px]` in `TrustAuthorityRail`
  - The rail overflows 80px beyond the Figma frame, causing excessive section height
  - Fix: Change `h-[660px]` to `h-[580px]` in TrustAuthorityRail and verify the mask-image gradient covers the new height
  - File: `src/components/sections/trust-authority-rail.tsx:112`

---

## Section 8: Partnerships

**Status:** FAIL

### What matches:
- Inner panel padding: `lg:px-[70px] lg:py-20` — Figma inner content starts at x=80 from panel left (panel at x=10 → inner padding = 70px) ✓
- Text content and gradient-text classes ✓
- Section label style ✓

### Discrepancies:

- [ ] **Partnerships panel width drastically narrower than Figma** (Figma: 1420px, Actual: ~1280px) — Severity: Critical
  - Figma: Panel rect `702:10161` at x=10, w=**1420px** (10px margins from viewport edge)
  - Code: Panel sits inside `Container` with `px-[80px]` → panel = 1440−160 = **1280px**
  - The panel is 140px narrower than designed (70px each side)
  - Fix: Remove the `Container` wrapper. Use a full-width approach with `mx-[10px]` to mirror the hero image and stats wrapper pattern. Keep `lg:px-[70px]` as inner padding.
  - File: `src/components/sections/partnerships.tsx:10`

- [ ] **Partnerships panel gradient angle and stops wrong** (Figma: 40.9°/2-stop, Actual: 103°/3-stop) — Severity: Critical
  - Figma: `linear-gradient(40.898deg, #151419 35.359%, #4c4ab5 142.03%)`
  - Code: `bg-[linear-gradient(103deg,var(--color-hr-gradient-start)_4%,var(--color-hr-gradient-mid)_52%,var(--color-hr-gradient-end)_108%)]`
  - The gradient goes in the wrong direction (103° = upper-left to lower-right vs Figma lower-left to upper-right at ~41°)
  - The end color is also wrong: Figma uses `#4c4ab5` (Art-by-Maudsch purple), code uses `#7468cb` (brand-600)
  - The global CSS token `.about-hero-panel-gradient` and `.partnership-hero-panel-gradient` both use the correct 42.36° angle — these should be referenced
  - Fix: Replace the inline gradient with `bg-[linear-gradient(40.898deg,var(--color-bg-inverse)_35.359%,var(--color-case-art-maudsch)_142.03%)]` (matching the proven results panel pattern)
  - File: `src/components/sections/partnerships.tsx:10`

---

## Section 9: Blog

**Status:** PASS

### What matches:
- Blog card height: `lg:h-[467px]` — Figma rect h=467px ✓
- Blog card border-radius: `lg:rounded-[var(--radius-card)]` = 40px ✓
- Blog card inner padding: `p-5` = 20px — Figma text at x=100, card at x=80 → 20px ✓
- Blog image area: `lg:h-[207px]` — Figma image area h=207px ✓
- Blog image area border-radius: `lg:rounded-[30px]` ✓
- Grid `lg:grid-cols-3` with `gap-5` (20px) — Figma card spacing = 514−80−413 = 21px ✓
- Header-to-cards margin: `lg:mt-20` = 80px — Figma gap = 8720−8640 = 80px ✓
- CTA "View More Blogs" at right: `lg:justify-end` — Figma CTA at x=1176 (far right) ✓

### Discrepancies:

- [ ] **Blog card title font-weight** (Figma: likely 500/Medium, Actual: 400/Normal) — Severity: Minor (needs designer confirmation)
  - Blog card `h3` at desktop uses `font-normal` (400)
  - Figma `H4/Web` token specifies `weight: 500` (Medium)
  - If blog titles use H4 token, they should be `font-medium`
  - File: `src/components/sections/blog.tsx:44`
  - Note: The mobile style uses `text-[28px]` which is H2 mobile size — inconsistent scaling

---

## Section 10: Testimonials

**Status:** PASS

### What matches:
- Desktop card height: `h-[574px]` — Figma rect h=574px ✓
- Desktop card width: `max-w-[413px]` — Figma card w=413px ✓
- Desktop card border-radius: `rounded-[var(--radius-card)]` = 40px ✓
- Desktop card background: `bg-[var(--color-hr-off-white)]` = #F4F4F4 — Figma screenshot confirms off-white ✓
- Avatar position: `absolute left-5 top-5` (20px from edges) ✓
- Logo pill: `absolute left-[233px] top-5 h-[77px] w-[160px]` — Figma confirmed ✓
- Testimonials grid `xl:grid-cols-[393px_1fr]` — Figma H2 width=393px ✓
- CTA max-width: `xl:max-w-[253px]` — Figma CTA node w=253px ✓
- Quote mark position: `absolute left-5 top-[137px]` — positioned relative to card top ✓
- Quote text: `absolute left-5 top-[191px]` — 191-137=54px from quote mark ✓
- Name: `absolute left-5 top-[480px]` ✓
- Role: `absolute left-5 top-[521px]` — 521-480=41px gap ✓
- Cards-to-header margin: `lg:mt-[69px]` — Figma gap 9539−9307−(23+120+45) ≈ 69px ✓

### Discrepancies:
- None confirmed.

---

## Summary Table

| # | Section | Status | Issues |
|---|---|---|---|
| 1 | Hero | NEEDS_WORK | 2 spacing discrepancies (minor) |
| 2 | Services | PASS | — |
| 3 | About | PASS | — |
| 4 | Team | PASS | — |
| 5 | Stats + FeaturedLogos | NEEDS_WORK | Key-point tracking (major), CTA height (minor) |
| 6 | CaseStudies + QuoteRotator | NEEDS_WORK | Cards gap (major), CTA width (major) |
| 7 | TrustAuthority | NEEDS_WORK | Rail height 660→580px (major) |
| 8 | Partnerships | FAIL | Panel width critical, gradient critical |
| 9 | Blog | PASS | Title weight uncertain (minor) |
| 10 | Testimonials | PASS | — |

---

## Prioritized Fix List

### Critical (visual breakage / layout wrong)
1. **Partnerships panel width** — should be `mx-[10px]` not inside `Container` — `partnerships.tsx:10`
2. **Partnerships gradient** — wrong angle (103° vs 41°) and wrong colors — `partnerships.tsx:10`

### Major (visible difference at 1440px)
3. **Stats key-point letter-spacing** — `−0.36px` → `−0.96px` — `globals.css:354`
4. **CaseStudies cards gap** — `lg:mt-14` (56px) → `lg:mt-20` (80px) — `case-studies.tsx:124`
5. **TrustAuthority rail height** — `h-[660px]` → `h-[580px]` — `trust-authority-rail.tsx:112`
6. **CaseStudies CTA button width** — `max-w-[251px]` → `max-w-[181px]` on desktop — `case-studies.tsx:113`

### Minor (subtle, <15px difference)
7. **Hero top padding** — `lg:pt-[90px]` → `lg:pt-[104px]` — `hero.tsx:9`
8. **Hero image margin-top** — `lg:mt-20` (80px) → `lg:mt-[116px]` — `hero.tsx:46`
9. **Stats CTA button height** — 45px vs Figma 51px (may be design artifact) — `stats.tsx:57,99`
10. **Blog card title font-weight** — `font-normal` → `font-medium` if H4 token applies — `blog.tsx:44`
