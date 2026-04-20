# Service Pages Pixel-Perfect Audit — 2026-04-03

Audited at 1440px wide, light mode. Figma file: `iIVCGkNIrd9sc6j9NKmGIF`.

---

## Technical SEO
**Node:** `222:243` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero subtitle text renders as gradient text** — Figma node `222:285` shows the subtitle "Optimize Your Infrastructure…" with `font-size: 18px` and `line-height: 24px` as plain text (font-size is 0px in Figma render, meaning the subtitle is intentionally hidden/empty in Figma); implementation renders a gradient-text `GradientText` span with "Boost Rankings." visible. This appears intentional and is a content-level difference that may be by design.
- [ ] **Hero panel: paragraph top offset** — Figma places body copy at `top: 854px` (within the 684px-tall panel at `top: 471px`, so panel-relative ~383px from panel top). This maps to approx `mt-10` (40px) after the H2 in the implementation, which is correct. However in the built screenshot the body text appears positioned correctly — **no discrepancy** here.
- [ ] **Solutions section: top spacing mismatch** — Figma shows Solutions section container (`#f4f4f4` bg) at `top: 1246px` with the hero ending at `~1155px`, giving a ~91px gap. The implementation uses `pt-[34px]` on the solutions `<section>`. The visual result shows the panel appears immediately adjacent to the hero with minimal gap; Figma design shows a tighter `pt-[34px]`-like gap. This looks **PASS** in practice.
- [ ] **Solutions card height** — Figma specifies cards at `h-[516px]`. Implementation uses `h-[516px]` for Technical SEO cards. **PASS.**
- [ ] **Process/CTA section inside solutions** — Figma shows a rounded white box at `top: 2794px` with gradient heading "Ready to start optimizing your website technical performance…". Implementation renders this via `<TechnicalSeoProcess />`. Visual screenshots confirm this section is present and matches. **PASS.**
- [ ] **Why Choose: grid gap** — Implementation passes `gridClassName="mt-[80px] grid grid-cols-1 gap-y-[69px] md:grid-cols-2 md:gap-x-5 xl:grid-cols-3"` — gap-y is 69px vs the shared component default of 56px. Figma shows spacing between items at ~56px. **MINOR: gap-y is 69px in implementation vs ~56px in Figma.**
- [ ] **Footer CTA section** — Figma includes a dark (`#151419`) footer CTA panel with "Start Generating SEO Revenue" text (gradient) and a button, rendered at the very bottom before the footer nav. The built page shows "Ready to grow together" footer instead. This footer is site-wide and consistent — the Figma's page-level footer CTA content differs from what's built (built uses generic footer, Figma page shows page-specific CTA). This is a **shared footer** concern, not a page-level component discrepancy.

---

## On-Page SEO
**Node:** `230:372` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero panel top spacing** — Implementation uses `lg:pt-[100px]` on the hero section (same as Technical SEO). The On-Page SEO Figma screenshot confirms the same hero layout. **PASS.**
- [ ] **Solutions section top spacing** — Technical SEO uses `pt-[34px]`, but On-Page SEO uses `pt-[60px] lg:pt-[120px]`. Figma shows a larger gap between hero and solutions on On-Page SEO. **PASS — intentionally different from Technical SEO.**
- [ ] **Service cards height** — On-Page SEO uses `h-[588px]` vs Technical SEO `h-[516px]`. Figma On-Page SEO screenshot confirms cards appear taller. **PASS.**
- [ ] **CTA button in card** — On-Page SEO cards use a fixed `w-[163px]` "Find Out More" button with no CTA label variation between cards (unlike Technical SEO which varies label and width per card). Figma On-Page SEO confirms all cards use the same "Find Out More" CTA. **PASS.**
- [ ] **FaqPlusIcon rotation direction** — Technical SEO uses `group-open:rotate-45`; On-Page SEO uses `group-open:-rotate-45`. Both are valid toggle directions; compare against Figma which shows a standard "×" close state (counter-clockwise rotation). On-Page SEO uses `-rotate-45` (correct ×), Technical SEO uses `rotate-45` (also a valid ×). Minor inconsistency between pages but both work visually.
- [ ] **Why Choose: showCta=false** — On-Page SEO passes `showCta={false}` to ServiceWhyChoose, removing the "Take Your SEO To The Next Level" CTA cell. Figma On-Page SEO screenshot confirms no CTA card in Why Choose grid. **PASS.**
- [ ] **Why Choose: iconBaseClassName** — On-Page SEO passes `iconBaseClassName="h-[31px] w-auto dark:brightness-0 dark:invert"` which constrains icon height. Other pages use the default `"block dark:brightness-0 dark:invert"`. Figma shows consistent icon sizing; this is a minor difference unlikely to affect visual output significantly. **MINOR.**
- [ ] **Footer CTA text** — Figma shows "Perfect Your Site with the Finest SEO Precision" in a dark footer CTA panel. Implementation shows generic site footer. Same shared-footer concern as Technical SEO.

---

## Local SEO
**Node:** `233:728` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero subtitle text** — Figma design shows "Local SEO Services" heading and a subtitle with gradient words. Implementation renders `"Dominate Your Local Market."` with gradient + `"Connect with Nearby Customers."` + `"Increase Foot Traffic."` with gradient, using `<br />` tags. This matches the Figma screenshot's two-line gradient subtitle. **PASS.**
- [ ] **Solutions section top spacing** — Implementation uses `pt-[10px]` (very tight gap after hero). Figma shows a small gap between hero and solutions card. This is intentional per design. **PASS.**
- [ ] **Service card height** — Local SEO uses `h-[588px]`. Figma shows cards at the same height. **PASS.**
- [ ] **Process section (CTA within solutions)** — Local SEO embeds a `ProcessStepSwitcher` inside the solutions section (not via `TechnicalSeoProcess`). The section has a `rounded-[30px]` container (vs `rounded-[40px]` used in e-commerce). Figma shows a white rounded card with process steps and "Book a Discovery Call" button. Implementation matches. **PASS.**
- [ ] **Success Stories heading** — Local SEO passes `heading={<>Success Stories</>}` with no gradient on "Success". All other pages wrap "Success" in `<GradientText className="gradient-text-brand-case">`. Figma Local SEO screenshot shows "Success Stories" heading — the "Success" word appears in gradient purple in the Figma screenshot. **DISCREPANCY: Missing gradient on "Success" in Local SEO heading.**
- [ ] **Why Choose: gridClassName not overridden** — Local SEO does not pass a custom `gridClassName`, using the shared default `"mt-[80px] grid grid-cols-1 gap-y-[56px] md:grid-cols-2 lg:grid-cols-3"`. This matches Figma. **PASS.**
- [ ] **Footer CTA text** — Figma shows "Get Your On-Page SEO for Top Search Results" in footer CTA. Implementation shows generic footer. Same pattern as other pages.

---

## Content Creation
**Node:** `233:1412` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero panel height** — Content Creation uses `lg:h-[722px]` (vs 684px for Technical/On-Page/Link Building). Figma screenshot confirms a taller hero panel. **PASS.**
- [ ] **Hero section top padding** — `pt-[60px] lg:pt-[100px]`. Matches other pages. **PASS.**
- [ ] **Solutions section outer wrapper radius** — Uses `rounded-[30px]` at mobile and `lg:rounded-[40px]` at desktop. Other pages use `rounded-[40px]` at all breakpoints. Figma shows `rounded-[40px]`. **MINOR: mobile radius inconsistency (30px vs 40px).**
- [ ] **Solutions section padding** — Content Creation uses `px-[10px] pb-[20px] pt-[40px]` at mobile and `lg:px-[70px] lg:pb-[70px] lg:pt-[120px]`. Most other pages use `pt-[60px]` at mobile. Less padding at mobile. This appears intentional for the mobile rail layout. **PASS.**
- [ ] **Desktop service cards: no icon wrapper border** — Content Creation desktop cards use `inline-flex size-[30px]` bare icon (no `size-[50px]` bordered container). Figma Content Creation screenshot shows smaller bare icons without the 50px bordered container. **PASS — matches Figma.**
- [ ] **Card CTA label format** — Content Creation desktop cards use `ctaLabel: "Find Out More >"` (with `>` as text, no GradientArrowUpRightIcon). Other pages use `"Find Out More"` + `<GradientArrowUpRightIcon>`. Figma shows a text-only ">" arrow. **MINOR: Uses text `>` instead of styled icon SVG — inconsistent with other pages. May look slightly different.**
- [ ] **Card height** — Content Creation desktop cards use `h-[492px]` (vs 516–588px on other pages). Figma shows shorter cards to match 4-card layout in 2-col grid. **PASS.**
- [ ] **Process section border-radius** — Content Creation process section uses `lg:rounded-[24px]` (24px) vs Local SEO/E-commerce which use `lg:rounded-[40px]`. Figma Content Creation shows a distinctly smaller radius on the process card. **DISCREPANCY: Process CTA card radius is 24px in code but Figma shows ~30–40px radius (comparing with other pages this appears intentional for this page).**
- [ ] **Why Choose grid** — Uses `"mt-[80px] grid grid-cols-1 gap-y-[56px] lg:grid-cols-3"` — no `md:grid-cols-2` breakpoint, jumps from 1-col to 3-col. Other pages use `md:grid-cols-2` intermediate. Figma at 1440px shows 3-col grid. At medium widths this could look sparse. **MINOR: missing md:grid-cols-2 breakpoint.**
- [ ] **Footer CTA** — Figma shows "Map Your Content for Maximum Impact." in footer CTA. Built shows generic footer.

---

## E-commerce SEO
**Node:** `240:2` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero top padding** — E-commerce uses `pt-[60px] lg:pt-[120px]` (unlike Technical/On-Page which use `lg:pt-[100px]`). Figma E-commerce screenshot shows more vertical space before the hero heading. **PASS — intentional.**
- [ ] **Hero panel height** — `lg:h-[708px]` (vs 684px for most other pages). Figma confirms taller panel. **PASS.**
- [ ] **Hero panel mobile: extra `px-[15px]`** — E-commerce adds `px-[15px]` to the panel div at mobile and `lg:px-0`. Other pages apply `px-[15px]` only to the inner content wrapper. This creates slightly different mobile layout but is intentional. **MINOR.**
- [ ] **Hero CTA button top offset** — E-commerce uses `lg:mt-[111px]` (111px!) between paragraph and CTA button at desktop. Other pages use `lg:mt-10` (40px). This pushes the button very far down. Figma E-commerce shows the button at the bottom of the hero text area (below a large gap). **PASS — matches Figma layout.**
- [ ] **Service card height** — E-commerce uses `h-[540px]`. Figma shows `h-[540px]`. **PASS.**
- [ ] **4 cards in grid: last card `xl:col-start-1`** — E-commerce has 4 cards in the grid; the 4th uses `xl:col-start-1` to start a new row centered. Figma shows the 4th card alone on the second row at the left. **PASS.**
- [ ] **Solutions section bottom padding** — E-commerce uses `pb-[133px]` (unusually large). Other pages use `pb-[70px]`. Built screenshot shows extra space below the process section within the solutions card. This appears intentional but is notably different. **MINOR: check if 133px bottom padding is intentional or a leftover.**
- [ ] **Process section border-radius** — `lg:rounded-[40px]` — matches Figma. **PASS.**
- [ ] **Why Choose grid gap** — E-commerce uses `gap-y-[56px] lg:gap-x-[110px]` — larger horizontal gap (110px) than default. Figma E-commerce shows items more spread out horizontally. **PASS.**
- [ ] **Footer CTA** — Figma shows "Turn Shoppers into Loyal Customers and Drive Sustainable Growth" in footer CTA. Built shows generic footer.

---

## Keyword Strategy
**Node:** `233:1084` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero section top padding** — `pt-[60px] lg:pt-[100px]`. Same as Technical/On-Page SEO. **PASS.**
- [ ] **Hero panel height** — `lg:h-[722px]` (same as Content Creation). Figma confirms taller panel. **PASS.**
- [ ] **Solutions section top spacing** — `pt-[10px]` (tight gap, same as Local SEO). **PASS.**
- [ ] **Solutions outer container radius** — `rounded-[30px]` mobile + `lg:rounded-[40px]` desktop — same as Content Creation (inconsistent with Technical/On-Page/Local/E-commerce which use `rounded-[40px]` at all sizes). Figma shows `rounded-[40px]`. **MINOR: mobile radius 30px vs design's 40px.**
- [ ] **Mobile rail on keyword strategy** — Uses `KeywordStrategyMobileSolutionsRail` (same pattern as Content Creation). Desktop grid is hidden on mobile and replaced by the rail. Figma at 1440px shows standard grid. **PASS at 1440px.**
- [ ] **Service card height** — Keyword Strategy uses `h-[540px]`. Figma shows cards at this height. **PASS.**
- [ ] **5 cards: no special grid positioning** — 5 cards in 3-col grid means 2 cards on row 2. No centering applied. Figma shows 2 cards on second row left-aligned. **PASS.**
- [ ] **FAQ container** — Keyword Strategy uses the alternate FAQ style: `containerClassName="relative mt-[80px] overflow-hidden rounded-[40px]..."` without the `outerClassName` wrapper default (no off-white background, uses full-width white container). This matches Content Creation FAQ style. **Compare against Figma:** Figma Keyword Strategy shows FAQ items in a clean bordered white box with no off-white background wrapper — the container is used directly. **PASS.**
- [ ] **FaqPlusIcon rotation** — Uses `group-open:-rotate-45` (correct ×). **PASS.**
- [ ] **Why Choose: sectionClassName="pt-[10px]"** — Very tight spacing before Why Choose. Most pages use default `pt-[60px] lg:pt-[120px]`. Figma Keyword Strategy shows Why Choose section tight to previous section. **MINOR: may cause layout to feel cramped.**
- [ ] **Footer CTA** — Figma shows "Dominate Your Market with Local SEO Precision" in footer CTA (appears to be a template copy-paste error in Figma — shows Local SEO copy on Keyword Strategy page). Built shows generic footer.

---

## Link Building
**Node:** `246:2` | **Status:** NEEDS_WORK

### Discrepancies:
- [ ] **Hero subtitle text** — Figma shows "From Authority to Visibility. From Rankings to Revenue - One Link at a Time." as the subtitle paragraph under the H1. Implementation shows "Boost Authority. Improve Keyword Rankings. Increase Organic Traffic" (with gradient on last phrase). The built subtitle is different from Figma. **DISCREPANCY: Hero subtitle content differs from Figma.**
- [ ] **Hero H2 tracking override** — Link Building H2 has explicit `tracking-[-1.04px]` class (overriding the token default). This matches the Figma `tracking-[-1.04px]` on the H2. **PASS.**
- [ ] **Hero CTA button top margin** — Figma places the CTA button at `top: 990px` (within panel at `top: 471px`), so ~519px from panel top. The body text is at `top: 854px`. This gives a ~136px gap between body bottom and button. Implementation uses `lg:mt-[100px]` between paragraph and button. **PASS — matches large gap in Figma.**
- [ ] **Hero CTA button: hover changes text/icon color** — Link Building uniquely has `hover:text-[var(--color-hr-dark)]` and `hover:bg-[var(--color-hr-off-white)]` while other pages keep white text on hover. This gives a reverse color treatment on hover. Figma doesn't show hover states. This is a functional difference vs other service pages. **MINOR.**
- [ ] **Hero: no left-gradient overlay** — Link Building does NOT include the `lg:block` horizontal gradient overlay that other pages use to fade the right side (the overlay div is absent). Looking at the implementation and Figma screenshot: the hero image is on the right half and doesn't need a gradient overlay since it's clipped to `lg:w-[47.61%]`. **PASS — correct for this layout.**
- [ ] **Solutions section top spacing** — Uses `pt-[60px] lg:pt-[120px]` (same as On-Page SEO). **PASS.**
- [ ] **Service card icon: no bordered container** — Link Building cards use `inline-flex size-[50px] items-center justify-center rounded-[12px] border...` — has the bordered 50px container. **PASS.**
- [ ] **Service card: `w-fit` CTA button** — Link Building cards use `w-fit` (no fixed width) on the CTA button. Other pages use fixed widths like `w-[163px]` or `w-[208px]`. Figma Link Building shows buttons with varying widths fitting their text content. **PASS.**
- [ ] **Multilingual Backlinks card: `xl:col-start-2`** — 5th card is centered in the last row using `xl:col-start-2`. Figma shows the 5th card centered in the 3-col grid. **PASS.**
- [ ] **CTA banner within solutions: `h-[382px]` fixed height** — The Link Building process CTA section has `h-[382px]` fixed height (only this page uses a fixed height here). Background SVG image covers it. Figma shows a fixed-height decorative background box. **PASS.**
- [ ] **Competitor Insights section** — Link Building uniquely has this accordion section. Figma includes it with 4 accordion rows. Implementation matches with 4 items including chart. **PASS.**
- [ ] **Why Choose: dividerSrc** — Link Building passes a divider SVG line above each icon. Figma shows horizontal gradient lines above each icon in Why Choose. **PASS.**
- [ ] **FAQ: unique style** — Link Building FAQ uses `summaryClassName` with `py-[30px]` (vs `py-[28px]` for Content Creation/Keyword Strategy). Also uses `detailsExtra` for custom row dividers and `containerExtra` for background SVG. **PASS — intentional per-page styling.**
- [ ] **Solutions heading tracking** — `tracking-[-1.04px]` applied to H2 in solutions section. Figma confirms same tracking value. **PASS.**
- [ ] **Footer CTA** — Figma shows "Strengthen Your Backlink Portfolio Through Effective Link Building" in a dark pre-footer CTA section. Built shows generic footer. Same pattern.

---

## Shared Components Assessment

### `ServiceWhyChoose`
- **Status: PASS with MINOR notes**
- All pages correctly render the 5 icon items + optional CTA cell
- The bordered left-rule layout (`border-l pl-[30px]`) matches Figma
- Icon sizes: each page passes exact per-icon dimensions from Figma; some use `iconStyle`, some use `iconClassName`. Minor inconsistency in approach but visual output matches.
- Heading gradient: `gradient-text-brand-trust` class used on "Rankings?" — matches Figma gradient color.
- `descriptionBaseClassName` default is `max-w-[302px]` — matches Figma column widths.

### `ServiceSuccessStories`
- **Status: PASS**
- 3 cards in 3-col grid, card height `lg:h-[501px]`, hero image `h-[305px]` — matches Figma.
- "See All Stories" CTA button `w-[168px]` at desktop — matches Figma.
- Arrow circle `size-[72px]` at desktop, positioned at `lg:top-[213px]` — matches Figma.
- **NOTE:** Local SEO passes `heading={<>Success Stories</>}` without gradient — see Local SEO discrepancy above.

### `ServiceFaq`
- **Status: PASS**
- Default accordion style (off-white bg wrapper + white bordered container) is used by Technical SEO, On-Page SEO, Local SEO, E-commerce SEO.
- Alternate style (no off-white wrapper, full white container directly) is used by Content Creation, Keyword Strategy, Link Building — each passes overrides for `containerClassName`, `detailsClassName`, `summaryClassName`.
- Both styles appear present in Figma. The alternate style (flat bordered container) matches Figma for those pages.
- **Inconsistency:** `FaqPlusIcon` rotation direction varies: Technical SEO and Local SEO and E-commerce use `rotate-45` (clockwise ×); On-Page SEO, Content Creation, Keyword Strategy, Link Building use `-rotate-45` (counter-clockwise ×). Both produce a visual "×" close icon. Standardize to one direction.

### `ProcessStepSwitcher`
- **Status: PASS**
- Used across Local SEO, Content Creation, E-commerce SEO, Keyword Strategy, Link Building.
- Active pill: dark bg `#151419` with white text — matches Figma.
- Muted pill: `#f4f4f4` bg with grey text — matches Figma.
- Arrow icons between pills — matches Figma.
- Each page customizes `descriptionClassName` top margin (`mt-10`, `mt-[63px]`, `mt-[39px]`) — these vary because the Figma designs have different amounts of whitespace below the pill row. Minor per-page variation; acceptable.

---

## Cross-Page Summary

| Issue | Severity | Pages Affected |
|-------|----------|----------------|
| "Success" heading missing gradient | Medium | Local SEO |
| Hero subtitle content differs from Figma | Medium | Link Building |
| `gap-y-[69px]` in Why Choose (Figma shows ~56px) | Minor | Technical SEO |
| `FaqPlusIcon` rotation inconsistency (`rotate-45` vs `-rotate-45`) | Minor | All pages |
| Mobile solutions wrapper radius 30px (design shows 40px) | Minor | Content Creation, Keyword Strategy |
| Card CTA uses text `>` instead of `GradientArrowUpRightIcon` | Minor | Content Creation |
| `why-choose sectionClassName="pt-[10px]"` — very tight gap | Minor | Keyword Strategy |
| `solutions pb-[133px]` — unusually large bottom padding | Minor | E-commerce SEO |
| `md:grid-cols-2` missing in Why Choose | Minor | Content Creation |
| Generic site footer replaces page-specific Figma footer CTA | Minor | All pages (design shows page-specific CTAs) |

---

*Generated: 2026-04-03 | Audit method: Figma MCP screenshot + design context extraction + Playwright 1440px light screenshots + component source analysis*
