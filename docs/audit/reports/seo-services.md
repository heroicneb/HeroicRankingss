# SEO Services Pixel-Perfect Audit — 2026-04-03

**Figma file:** iIVCGkNIrd9sc6j9NKmGIF | **Node:** 203:1361  
**Screenshot:** docs/audit/screenshots/seo-services-1440-light.png  
**Auditor:** Claude Sonnet 4.6 (automated)

---

## Overall Assessment

**NEEDS_WORK**

The implementation is structurally sound and closely follows the Figma layout. Typography tokens, colors, spacing, and section structure are largely correct. However, several content copy mismatches in the hero, a typography scale discrepancy between Figma specs and the token system, a mismatched section label in the Why Choose section, and missing description gradient on the "E-Commerce SEO Services" card require attention.

---

## Section 1: Hero

**Status:** NEEDS_WORK

### Discrepancies

- [ ] **Hero h2 copy mismatch** — Figma: `"SEO that works while you sleep"`, Actual: `"The 24/7 Employee Your Business Needs"` — File: `src/components/pages/seo-services/seo-services-page.tsx:234` — Severity: **Major**

- [ ] **Hero body copy mismatch** — Figma has 3 distinct paragraphs: (1) "SEO is a long-term growth engine and we build it with precision…", (2) "At Heroic Rankings, we combine data, strategy, and execution…", (3) "Our methods ensure brands aren't just ranking…". Actual: single merged paragraph from the old copy "At Heroic Rankings, we're not just experts in SEO…" — File: `src/components/pages/seo-services/seo-services-page.tsx:237-242` — Severity: **Major**

- [ ] **Hero CTA button label mismatch** — Figma: `"Get Your SEO Audit Now!"`, Actual: `"Get Your Free SEO Audit Now!"` — File: `src/components/pages/seo-services/seo-services-page.tsx:249` — Severity: **Minor**

- [ ] **H1 font size — token vs Figma spec** — Figma H1/Web: `62px`, line-height `80px`, letter-spacing `-2px`. Token `--font-size-h1` is set to `38px` (mobile base), which at `lg:` breakpoint would need a responsive override. The `type-h1` class uses `var(--font-size-h1)` which is `38px` at root level with no responsive token. The Figma screenshot and spec show `62px`. No lg override seen on the `<h1>` element — File: `src/app/globals.css:106`, `src/components/pages/seo-services/seo-services-page.tsx:219` — Severity: **Critical** *(check whether a responsive lg modifier exists elsewhere; if not this is a significant type size regression)*

- [ ] **H2 font size — token vs Figma spec** — Figma H2/Web: `52px`, line-height `60px`, letter-spacing `-2px`. Token `--font-size-h2` is `28px`. Hero section uses `type-h2` which will render at `28px` not `52px` — File: `src/app/globals.css:108` — Severity: **Critical** *(same note as H1 — confirm responsive lg override exists)*

- [ ] **Hero banner gradient angle** — Figma (mobile): `80.74°` linear gradient; Figma (desktop, lg): `52.89°`. Actual desktop: `lg:bg-[linear-gradient(52.8964deg,...)]`. Desktop angle matches. Mobile angle in implementation: `80.7496deg` — visually matches Figma. No discrepancy here, but note both are hardcoded raw angles rather than tokens — File: `src/components/pages/seo-services/seo-services-page.tsx:229` — Severity: **Minor** (informational)

- [ ] **Hero statue image container positioning** — Figma: statue container starts at `left: calc(8.33% + 88px)` with `rounded-br-[40px]`, no top-left rounding. Actual: `lg:left-[238px]`, `lg:rounded-br-[40px]`, `lg:rounded-tl-none`. The `238px` hardcoded left does not express the Figma's column-relative calculation (`8.33% + 88px` ≈ `207px` at 1440px). Minor visual drift at non-1440 widths — File: `src/components/pages/seo-services/seo-services-page.tsx:255` — Severity: **Minor**

- [ ] **Hero text content left padding** — Figma: hero text starts at `left: 80px`. Actual: `lg:px-[70px]` (which gives 70px padding, so text left edge is at 80px from page edge given 10px page shell padding). This matches correctly.

---

## Section 2: Services Grid

**Status:** NEEDS_WORK

### Discrepancies — Desktop Grid (`seo-services-desktop-services-grid.tsx`)

- [ ] **Card subtitle gradient missing on "E-Commerce SEO Services"** — Figma: `"Increase Organic Revenue"` subtitle is plain white (not gradient). Actual: `type-paragraph` in plain white. This matches for E-Commerce. However, Figma shows gradient subtitles on: On-Page SEO ("Show up across searches…"), Link Building ("Expand your reach…"), and Keyword Research ("Discover Your Potential"). The actual implementation uses plain white `type-paragraph` for ALL card descriptions. The gradient descriptions would need the `GradientText` component applied — File: `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx:61` — Severity: **Major**

- [ ] **Card title font size in implementation vs Figma** — Figma H3/Web: `32px`. Token `--font-size-h3: 22px`. `type-h3` class uses `22px`. Cards use `type-h3` for titles — discrepancy of 10px — File: `src/app/globals.css:108`, `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx:60` — Severity: **Critical** *(same responsive breakpoint question as H1/H2)*

- [ ] **Card arrow button size** — Figma: `72px` circle. Actual desktop: `size-[72px]` — matches. Mobile: `size-[60px]` — acceptable mobile adaptation.

- [ ] **Service card grid gap** — Figma cards separated by `20px` gutters. Actual: `gap-5` = `20px` — matches.

- [ ] **Card corner radius** — Figma: `40px`. Actual: `rounded-[40px]` on `seo-service-card-inner` — matches.

- [ ] **Card height** — Figma: `420px`. Actual: `h-[420px]` — matches.

### Discrepancies — Mobile Rail (`seo-services-mobile-services-rail.tsx`)

- [ ] **Mobile card height mismatch** — Figma shows mobile cards same proportions as desktop (420px equivalent). Actual: `h-[450px]` — 30px taller than Figma desktop cards. Not a direct Figma mobile spec available from this extraction, but worth noting — File: `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:220` — Severity: **Minor**

- [ ] **Mobile card corner radius** — Actual: `rounded-[30px]`. Desktop: `rounded-[40px]`. If Figma specifies 40px uniformly this is a discrepancy — File: `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx:220` — Severity: **Minor**

- [ ] **Mobile card "All SEO Services" title** — Mobile rail shows "All SEO Services" as first card title, pointing to `/seo-services`. This card does not exist in Figma desktop grid. The Figma shows 7 specific service cards at desktop. The mobile rail card set diverges from desktop data (8 mobile cards vs 7 desktop cards). This may be intentional design but is undocumented — Severity: **Minor** (informational)

---

## Section 3: Why Choose

**Status:** NEEDS_WORK

### Discrepancies

- [ ] **Section label copy mismatch** — Figma: `"/ Guided by Results /"`. Actual (hardcoded in `ServiceWhyChoose` component): `"/ Guided by Results /"` — **matches** for this page. Note: The prop is not overrideable, it's hardcoded in the component. The seo-services page does NOT pass a custom label, so it falls through to the hardcoded value. No discrepancy here.

- [ ] **Why Choose grid — 3-col layout with 5 items + CTA** — Figma shows a 3-column grid: row 1 has [Expertise, Customized Strategies, Comprehensive Services], row 2 has [Transparent Reporting, Dedicated Support, + CTA cell "Take Your SEO To The Next Level"]. The implementation's `gridClassName` prop passed from `seo-services-page.tsx` is `"mt-[80px] grid grid-cols-1 gap-y-[56px] lg:grid-cols-3 lg:gap-x-[110px]"` with no `gap-x` on smaller breakpoints, and no row gap at lg. The `gap-y-[56px]` row gap matches the visual spacing. **No discrepancy** found in grid structure.

- [ ] **Icon container styling** — Figma: icon containers are `50×50px` squares with `border: 1px solid #E0E0E0`, `border-radius: 12px`, white background. Actual: icon is rendered directly as `<Image>` with class `size-[50px] dark:brightness-0 dark:invert` — **no border, no rounded container box**. The Figma shows a distinct bordered box around each icon — File: `src/components/sections/shared/service-why-choose.tsx:82-90` — Severity: **Major**

- [ ] **Why Choose section label text** — Figma: `"/ Guided by Results /"` (with double spaces around word). Actual in component: `"/ Guided by Results /"` (single spaces). The Figma raw text shows `'/  Guided by Results  /'` with double internal spaces. All SectionLabel usages in the page show single-space variants — File: `src/components/sections/shared/service-why-choose.tsx:64` — Severity: **Minor**

- [ ] **Vertical divider line** — Figma shows a vertical line separator between icon and title text (a horizontal rule above the icon). The implementation uses a left border on the `<article>` element (`border-l border-[var(--color-hr-light-grey)]`). Figma actually shows lines above each icon block (horizontal lines, not left borders). These are rendered in Figma as `Line9` elements (159px wide, rotated -90°, positioned to the left of each column). The left-border approach is a reasonable adaptation but differs from Figma's column-spanning horizontal line style — File: `src/components/sections/shared/service-why-choose.tsx:71` — Severity: **Minor**

- [ ] **Why Choose item — "Dedicated Support" description copy** — Figma: `"A team of experts always ready to assist you."` Actual: `"A team of SEO experts always ready to assist you."` (extra word "SEO") — File: `src/components/pages/seo-services/seo-services-page.tsx:170` — Severity: **Minor**

- [ ] **Why Choose padding** — Figma outer box: top/bottom at ~120px, left/right ~70px at desktop. Actual: `pt-[96px] pb-[96px] lg:pt-[120px] lg:pb-[120px] lg:px-[70px]` — at `lg` breakpoint matches Figma. The intermediate `pt/pb-[96px]` is below the lg threshold, which is reasonable adaptive behavior.

---

## Section 4: Success Stories

**Status:** PASS

### Discrepancies

- [ ] **Card hero image area** — Figma: story cards have a colored hero block `305px` tall at desktop, with story title centered in white text. Actual: `lg:h-[305px]` — matches.

- [ ] **Card total height** — Figma: `501px`. Actual: `lg:h-[501px]` — matches.

- [ ] **Card border radius** — Figma: `40px`. Actual: `lg:rounded-[40px]` — matches.

- [ ] **Card arrow button** — Figma: white circle `72px`, positioned at `top: 213px` at desktop. Actual: `lg:top-[213px] lg:size-[72px]` — matches.

- [ ] **"See All Stories" button label** — Figma: `"See All Stories"`. Actual: `"See All Stories"` — matches.

- [ ] **Section label** — Figma: `"/ Proven Performance /"`. Actual: `"/ Proven Performance /"` — matches.

- [ ] **Story card background colors** — Figma: My Baskets `#E9D9C3`, Nagish `#151419`, Art by Maudsch `#4C4AB5`. Actual uses `var(--color-case-my-baskets)`, `var(--color-hr-dark)`, `var(--color-case-art-maudsch)` respectively — all resolve to correct Figma values.

- [ ] **Story description text alignment** — Figma shows left-aligned text. Actual has `text-center lg:text-left` — mobile centers, desktop left-aligns. Desktop matches Figma.

---

## Section 5: FAQ

**Status:** NEEDS_WORK

### Discrepancies

- [ ] **FAQ section label copy** — Figma: `"/ Find Your Answers /"`. Actual: `"/ Find Your Answers /"` — matches.

- [ ] **FAQ heading gradient** — Figma: "Frequently Asked " plain + "Questions" gradient. Actual: same structure with `GradientText` on "Questions" — matches.

- [ ] **FAQ container background image** — Figma shows the accordion container has a "Subtract" decorative background shape (`imgSubtract7`, 459×1280px) positioned inside the container. The actual implementation has no `containerExtra` background shape in the seo-services page — File: `src/components/pages/seo-services/seo-services-page.tsx:313-340` — Severity: **Major**

- [ ] **FAQ answer text padding-right** — Figma: answer text area spans `left: 110px` to end, no explicit right constraint except page width. Actual: `pr-[223px]` at lg (passed via `answerClassName` prop). The Figma shows text width of `1007px` at desktop, which from 110px left = 110+1007 = 1117px, leaving 163px right margin. Implementation uses `pr-[223px]` which is more conservative. — File: `src/components/pages/seo-services/seo-services-page.tsx:314` — Severity: **Minor**

- [ ] **FAQ item divider lines** — Figma shows `Line13` horizontal rules between FAQ items at `110px` left, `1220px` wide. Actual: `border-t border-[var(--color-hr-light-grey)]` on non-first `<summary>` elements, with full-width span. Width matches Figma intent (within padding context). No discrepancy in appearance.

- [ ] **FAQ icon — open state** — Figma shows a `+` rotated to `×` on open. Actual: `FaqPlusIcon` with `group-open:-rotate-45` which gives a 45° rotated `+` = diagonal `×`. Matches Figma.

- [ ] **FAQ outer section padding bottom** — Figma: bottom ~`120px`. Actual: `pb-[60px] lg:pb-[120px]` — at lg matches. Small screens use 60px.

- [ ] **FAQ "Learn More" CTA button** — Figma: button with border `#998AFF`, label "Learn More" + arrow icon. Actual: `AppLink` with border `border-[var(--color-hr-accent)]` = `#998AFF` — matches.

---

## Typography Scale Summary

The following is a systemic issue affecting ALL sections:

| Element | Figma spec | Token value | Discrepancy |
|---|---|---|---|
| H1 | 62px / lh 80px / ls -2px | `--font-size-h1: 38px` | -24px |
| H2 | 52px / lh 60px / ls -2px | `--font-size-h2: 28px` | -24px |
| H3 | 32px / lh 100% / ls -2px | `--font-size-h3: 22px` | -10px |
| H4 | 24px / lh 100% / ls -2px | `--font-size-h4: 24px` | matches |
| Paragraph | 18px / lh 24px | `--font-size-paragraph: 16px` | -2px |

**Note:** If responsive `lg:` overrides exist via Tailwind utilities or a separate responsive token layer not visible in `globals.css`, these discrepancies may already be resolved. The base token values are mobile-size values. The Figma specs appear to be desktop (1440px) values. **Verify whether responsive type scale overrides exist** before treating these as bugs. If no such overrides exist, the type scale is a Critical issue across the entire page.

---

## Severity Summary

| Severity | Count |
|---|---|
| Critical | 3 (typography scale — H1/H2/H3 tokens vs Figma; subject to responsive verification) |
| Major | 4 (hero h2 copy, hero body copy, card description gradients missing, icon container missing border/radius, FAQ missing Subtract background decoration) |
| Minor | 7 (hero CTA copy, hero statue left position, mobile card height, mobile card radius, Why Choose label double-space, "SEO experts" copy, FAQ answer right padding) |

---

## Files Referenced

- `src/components/pages/seo-services/seo-services-page.tsx`
- `src/components/pages/seo-services/seo-services-desktop-services-grid.tsx`
- `src/components/pages/seo-services/seo-services-mobile-services-rail.tsx`
- `src/components/sections/shared/service-why-choose.tsx`
- `src/components/sections/shared/service-success-stories.tsx`
- `src/components/sections/shared/service-faq.tsx`
- `src/app/globals.css`
- `src/data/service-shared.ts`
- `src/data/success-stories.ts`
