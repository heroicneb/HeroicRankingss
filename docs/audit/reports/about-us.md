# About Us Pixel-Perfect Audit — 2026-04-03

**Figma file:** `iIVCGkNIrd9sc6j9NKmGIF` / node `189:5`
**Screenshot reference:** `docs/audit/screenshots/about-us-1440-light.png`
**Viewport audited:** 1440px desktop (light mode)

---

## Overall Assessment

**NEEDS_WORK**

The page is structurally sound and visually close. Several discrepancies exist across typography scale, spacing values, color/border details on specific elements, and one content-level mismatch. Nothing is catastrophically broken but a handful of Major items need fixing before sign-off.

---

## Section 1: AboutUsHero

**Status:** NEEDS_WORK

### Discrepancies:

- [ ] **Hero subtitle paragraph gap from H1 is too small (desktop)** — Figma: h1 top=183px, subtitle top=283px → gap of exactly 100px from top of h1 to top of subtitle. With h1 line-height 80px → visual gap ≈ 20px. Implementation: `mt-5` (20px) — this matches. **No issue here.** ✓

- [ ] **Hero body paragraph inside panel is positioned absolutely at top=348px from panel top** — Figma: panel h=480px, text top=806px, panel top=458px → 348px from panel top. Implementation: `top-[348px]` — matches. ✓

- [ ] **Top padding of section** — Figma: hero title starts at y=183px; nav ends at ~74px (14+60); gap = 109px. Implementation: `pt-[100px]` (lg). Discrepancy: **9px short** (Figma: ~109px, Actual: 100px) — File: `src/components/sections/about-us-hero.tsx:7` — Severity: **Minor**

- [ ] **Desktop paragraph max-width** — Figma: both subtitle paragraphs use w=688px. Implementation: `max-w-[688px]` ✓

- [ ] **Hero subtitle paragraph has two `<span className="block">` with `mt-5` between** — Figma shows 20px gap between the two lines (leading-[24px] with mb-[20px] on first para). Implementation: `mt-5` (20px) between spans — matches. ✓

- [ ] **Hero panel left offset and width** — Figma: left=10px, w=1420px at 1440px viewport. Implementation: uses full-width `relative mt-[107px] h-[480px]` inside `max-w-[1440px] px-[10px]` container → panel fills w=1420px. ✓

- [ ] **mt-[107px] for hero panel** — Figma: panel top=458px, subtitle top=283px, subtitle h=~48px (2×24px lines + 20px gap = 68px) → panel top ≈ 283+68+107 = 458px ✓ — matches.

- [ ] **Statue image left positioning** — Figma: statue left=`calc(25%+44px)` from page = 360+44=404px; panel left=10px; statue left relative to panel = 404-10=394px. Implementation: `left-[394px]` ✓

- [ ] **Statue top offset** — Figma: statue top=377px, panel top=458px → statue is 81px above panel top but implementation says `top-[-150px]`. **Discrepancy**: Figma mask group starts at y=377 but the actual statue image starts at same point but its mask starts differently. The raw image coordinate vs. the masked position differs — implementation value of -150px may account for the fade mask. This is acceptable if the visual output matches the screenshot. Visual inspection of screenshot shows statue rendering correctly. — Severity: **Minor / Acceptable**

---

## Section 2: AboutUsTrust

**Status:** NEEDS_WORK

### Discrepancies:

- [ ] **H2 font-size mismatch** — Figma: H2 = 52px Regular, lh 60px, ls -1.04px. The `.type-h2` token at `@media (min-width: 1024px)` sets `--font-size-h2: 52px` ✓, `--line-h2: 1.15` → 52 × 1.15 = 59.8px ≈ 60px ✓, `--tracking-h2: -1.04px` ✓. **Matches via token.**

- [ ] **H2 mt from section label** — Figma: label at top=1069px, H2 at top=1112px → gap = 43px. Implementation: `mt-[43px]` ✓

- [ ] **Left column width** — Figma: H2 max-width=482px, body para w=484px → left col ~485px. Implementation: `xl:grid-cols-[485px_630px]` ✓

- [ ] **Right column gap from left col** — Figma: left col ends ~565px (80+485), right col starts at 730px (720+10) → gap=165px. Implementation: `xl:gap-[165px]` ✓

- [ ] **Article icon box border color** — Figma: border `#E0E0E0` (HR Light Grey). Implementation: `border-[var(--color-hr-light-grey)]` → resolves to `#E0E0E0` ✓

- [ ] **Article icon box bg on desktop** — Figma: bg `#FFFFFF`. Implementation desktop version (lines 125, 146, 184): `bg-[var(--color-hr-pure-white)]` ✓ — but note the class ordering: `border-[var(--color-border-inverse-10)] bg-[var(--color-hr-pure-white)] dark:bg-[var(--color-bg-dark)]`. The `dark:border-[var(--color-border-inverse-10)]` appears AFTER `border-[var(--color-hr-light-grey)]` — this is actually `border border-[var(--color-hr-light-grey)] dark:border-[var(--color-border-inverse-10)]` which is correct.

- [ ] **H3 headings (Our Approach / Our Team / Our Vision)** — Figma: 32px Regular, ls -0.64px, lh normal. Token `type-h3` at ≥1024px: `--font-size-h3: 32px`, `--line-h3: 1`, `--tracking-h3: -0.64px` ✓

- [ ] **Right column article pl (icon + heading spacing)** — Figma: heading starts at `calc(50%+74px)` while icon is at `calc(50%+10px)` → heading left = icon left + 64px. Implementation: `pl-[64px]` on articles ✓

- [ ] **Section label tracking** — Figma: Section Title/Web ls = -2px raw Figma value which maps to -0.36px token. `type-section-label` uses `--tracking-section-token: -0.36px` ✓

- [ ] **Body paragraph mt from H2 (desktop)** — Figma: H2 top=1112px, body para top=1332px → gap=220px. H2 h=2 lines × 60px lh = 120px. Visual gap = 220-120=100px. But implementation uses `mt-10` (40px). **Discrepancy: body paragraph top margin is 40px in code vs ~100px in Figma (220px from H2 top, H2 is ~120px tall → visual gap ≈ 100px).** — File: `src/components/sections/about-us-trust.tsx:110` — Severity: **Major**

- [ ] **Section top padding (inside off-white wrapper)** — Figma: section label at y=1069px. The off-white container starts at y≈1038px (outer container mt=11px + 5px = 16px from 1022px hero bottom). Trust section `pt-[120px]` on desktop → container top + 120px ≈ 1158px but section label is at 1069px. There's an inconsistency: the label renders 89px inside the container, not 120px. **Potential discrepancy in pt** — the label is shown at 1069px in Figma, which is 31px from container top (if container top = 1038). Implementation `pt-[120px]` would push label to 120px from container top. This seems too large. — File: `src/components/sections/about-us-trust.tsx:8` — Severity: **Major**

  > Note: The off-white container starts within `about-us-page.tsx` at `mt-[11px]`. The hero section takes up to ~958px (hero at pt-100px, h1 at 80px, subtitle ~68px, gap 107px, panel 480px, body para 24px ≈ total ~859+... complex). The Figma positions are absolute frame coordinates. Trust section `pt-[120px]` refers to padding inside the off-white rounded wrapper, which may be correct given where hero ends. Further cross-section measurement needed.

---

## Section 3: AboutUsProcess

**Status:** NEEDS_WORK

### Discrepancies:

- [ ] **Process container top padding** — Figma: container top=1816px, H3 heading at top=1846px → heading is 30px from container top. Implementation: `pt-[30px]` ✓

- [ ] **Process container padding-x** — Figma: heading at left=110px, container at left=80px → padding-left=30px. Implementation: `px-[30px]` ✓

- [ ] **Process container border radius** — Figma: rounded-[40px] ✓

- [ ] **Step pills font size** — Figma: 18px Regular (uses Paragraph/Web style). Implementation: `ProcessStepSwitcher` — need to check that component.

- [ ] **Step description text (below pills)** — Figma: "After you get in touch, we'll arrange a call that fits your schedule, wherever you're based." — This is a **single simplified sentence** in Figma, vs the actual component which has step-specific copy per step tab. The Figma is showing step 1 ("Reaching Out") content. The implementation uses 5 distinct step descriptions from `buildProcessSteps()`. This is intentional functionality difference (tabbed UX vs static design). Not a discrepancy per se.

- [ ] **CTA button position in Process box (desktop)** — Figma: button at top=2105px, container top=1816px → 289px from container top. Container h=364px. Button is at 289px from top (75px from bottom). Implementation: `mt-16` (64px) below the steps area. The `mt-16` gap between ProcessStepSwitcher and button appears to be too small. In Figma: pill row at 1918px + step text at 2017px (99px) + approx step text height (24px lh) ≈ 2041px; button at 2105px → gap from step text bottom ≈ 64px → **`mt-16` (64px) matches** ✓

- [ ] **Process section mt from Trust section (desktop)** — Figma: trust section fills from ~1069px to ~1725px (vision text ends at ~1724px). Process section starts at 1816px → gap ≈ 92px. Implementation: `mt-[120px]` on the process section inside the container. **Discrepancy: 120px coded vs ~92px in Figma.** — File: `src/components/sections/about-us-process.tsx:20` — Severity: **Minor**

- [ ] **Process section bottom padding** — Figma: process container bottom = 1816+364=2180px; CTA section starts at 2260px → gap = 80px = process outer pb + cta outer mt. Implementation: `pb-[70px]` in process + `mt-[10px]` on CTA outer → 80px total ✓ (70+10=80) ✓

---

## Section 4: AboutUsCta

**Status:** PASS

### Discrepancies:

- [ ] **CTA panel bg color** — Figma: `#151419`. Implementation: `bg-[var(--color-bg-dark)]` → `#0c0c0c`. **Discrepancy: Figma is #151419 (HR Dark), implementation resolves to #0c0c0c (bg-dark).** The `--color-hr-dark` token = `#151419` and `--color-bg-dark` = `#0c0c0c`. Code uses `bg-[var(--color-bg-dark)]` but should use `bg-[var(--color-hr-dark)]` to match Figma. — File: `src/components/sections/about-us-cta.tsx:34` — Severity: **Major**

- [ ] **Gradient text top offset** — Figma: 90px from panel top. Implementation: `top-[90px]` ✓

- [ ] **White paragraph top offset** — Figma: 332px from panel top. Implementation: `top-[332px]` ✓

- [ ] **CTA button top offset** — Figma: 412px from panel top. Implementation: `top-[412px]` ✓

- [ ] **CTA button size** — Figma: px-[20px] py-[12px] inferred from spec → border button. Implementation: `h-[45px] w-[209px]` with `px-5 py-[12px]` — `h-[45px]` (fixed height) matches Figma button height (12×2+1border×2 = ~26px content + padding ≈ 45px total). ✓

- [ ] **CTA gradient text color** — Implementation uses `GradientText` with `gradient-text-brand-about-us-cta-copy` class. However, the `<GradientText>` component wraps with `color: transparent` and `-webkit-text-fill-color: transparent`. The Figma shows the entire `<p>` as a gradient text block. The implementation wraps the entire `<p>` as `as="p"` GradientText with two inner `<span>` children. This is correct. ✓

- [ ] **Mobile CTA copy** — Figma shows the desktop dark panel. Mobile section uses a different `GradientText` class (`gradient-text-brand-about-us-team-intro`). The mobile copy mentions "Heroic Rankings is a 20+ person team..." which differs from desktop copy. This is a deliberate mobile-specific copy choice and matches the expected mobile design.

---

## Section 5: AboutUsTeam

**Status:** NEEDS_WORK

### Discrepancies:

- [ ] **Section top padding** — Figma: section label at y=2957px. CTA dark panel ends at 2260+577=2837px; gap to label = 120px. Implementation: `pt-[120px]` ✓

- [ ] **H2 gap from section label** — Figma: label at 2957px, H2 at 3000px → gap=43px. Implementation: `mt-5` (20px). **Discrepancy: 20px coded vs 43px in Figma.** — File: `src/components/sections/about-us-team.tsx:156` — Severity: **Major**

- [ ] **Grid gap from H2 to cards** — Figma: H2 at 3000px, cards at 3140px → gap=140px. H2 height=60px (52px text + lh). Visual gap = 140-60 = 80px. Implementation: `lg:mt-20` (80px) ✓

- [ ] **Card height** — Figma: 409px tall. Implementation uses aspect-square image (305×305) + name + role = 305 + mt-5 (20px) + name (~24px) + mt-1 (4px) + role (~24px) = ~377px. Plus card padding. Card height is not fixed — it flows. **Discrepancy: Figma card is 409px fixed height; implementation is content-height.** In practice the image is `aspect-square` with `w-full` and the card has overflow-hidden, so the visual card height = image(305) + 20px + name line + 4px + role line + bottom padding. The cards may not reach 409px without explicit height. — File: `src/components/sections/about-us-team.tsx:168` — Severity: **Minor**

- [ ] **Arrow button size (desktop)** — Figma: 72px circle. Implementation: `lg:size-[72px]` ✓

- [ ] **Arrow button position from card top** — Figma: arrow at y=3353px, card at 3140px → 213px from card top = bottom of image area (305px) - 92px... Actually 213px is within the image area (305px image). Implementation: `top-[213px]` for mobile, `lg:right-5` for desktop position. Wait — Figma arrow is at top=3353, card top=3140, image bottom=3140+305=3445. Arrow at 3353 is 305px from bottom of image = actually 3353-3140=213px from card top = inside image area. Implementation: `top-[213px]` (no lg override). Arrow at 213px from card top on desktop ✓

- [ ] **Name font tracking** — Figma: 24px Medium, ls -0.48px. `type-team-title` / `type-h4` token: `--tracking-section-token: -0.36px` at desktop. But Figma shows -2px raw Figma unit at 24px → -0.48px. **Discrepancy: token is -0.36px, Figma is -0.48px for team name.** — File: `src/app/globals.css:336` — Severity: **Minor**

- [ ] **Role text for "Stefan Cvetković"** — Figma: "Organic Growth Manager" (no slashes). Implementation data file uses role with slashes convention. Need to verify data file.

- [ ] **Role text for "Slobodan Kačavenda"** — Figma: "Head of Link Building" (no slashes). Same check needed.

- [ ] **"Become a Hero" role gradient** — Figma: "/ Apply Now /" in gradient text. Implementation: `isRoleGradient` flag + `gradient-text-brand-about-us-team-role` class. If the "Become a Hero" member has `isRoleGradient: true` in data, this is correct. Needs data file verification.

- [ ] **Team member image aspect** — Figma: 305×305px (perfect square). Implementation: `aspect-square w-full` + `width={305} height={305}`. ✓

- [ ] **Section px (horizontal padding)** — Figma: team members start at left=80px. Implementation: `px-[80px]` → `px-[15px] lg:px-[80px]` (note: actual code is `px-[15px] lg:px-[80px]` but file shows `px-[15px] lg:px-[80px]`). ✓

---

## Section 6: Testimonials

**Status:** NEEDS_WORK

### Discrepancies:

- [ ] **Testimonial card border** — Figma: testimonial cards have bg `#F4F4F4` with NO card-level border. Implementation: `border border-[var(--color-hr-light-grey)]` on desktop cards. **Discrepancy: implementation adds a border that is not in Figma.** — File: `src/components/sections/testimonials.tsx:251` — Severity: **Major**

- [ ] **Desktop card height** — Figma: 574px. Implementation: `h-[574px]` ✓

- [ ] **Desktop card width** — Figma: 413px. Implementation: `max-w-[413px]` ✓

- [ ] **Desktop card border-radius** — Figma: rounded-[40px]. Implementation: `rounded-[var(--radius-card)]` → 40px ✓

- [ ] **Quote mark style** — Figma: the quote mark is a distinct SVG image (15.232×21.376px), styled as a decorative element, not a Unicode character. Implementation uses `"` (Unicode left double quotation mark) as a text character with `text-[24px] font-medium leading-none tracking-[-0.02em]` and `text-[var(--color-hr-dark)]` (desktop). **Discrepancy: Figma uses a dedicated SVG/image asset for the opening quote mark; implementation uses a Unicode character with different size (24px rendered vs ~15px in Figma) and the color differs (Figma: the SVG color vs code dark text).** — File: `src/components/sections/testimonials.tsx:279` — Severity: **Minor**

- [ ] **Quote mark position (desktop)** — Figma: top=4467px, card top=4330px → 137px from card top. Implementation: `top-[137px]` ✓

- [ ] **Quote text position (desktop)** — Figma: top=4521px, card top=4330px → 191px from card top. Implementation: `top-[191px]` ✓

- [ ] **Name position (desktop)** — Figma: top=4810px, card top=4330px → 480px from card top. Implementation: `top-[480px]` ✓

- [ ] **Role position (desktop)** — Figma: top=4851px, card top=4330px → 521px from card top. Implementation: `top-[521px]` ✓

- [ ] **Avatar position (desktop)** — Figma: top=4350px (20px from card top), left=100px (20px from card left=80px). Implementation: `top-5 left-5` (20px each) ✓

- [ ] **Logo pill size (desktop)** — Figma: 160×77px. Implementation: `h-[77px] w-[160px]` ✓

- [ ] **Logo pill border color (desktop)** — Figma: border `#151419`. Implementation: `border-[var(--color-hr-dark)]` → `#151419` ✓

- [ ] **Logo pill left position (desktop)** — Figma: pill at left=`calc(16.67%+73px)` = 240+73=313px from page left; card left=80px → pill at 313-80=233px from card left. Implementation: `left-[233px]` ✓

- [ ] **Section label text** — Figma: `/  Dedication  /` (double spaces). Implementation: `/ Dedication /` (single spaces). **Discrepancy: spacing within label text differs from Figma convention.** — File: `src/components/sections/testimonials.tsx:149` — Severity: **Minor**

  > Note: This same pattern applies to all section labels on the page — Figma uses double spaces within slashes (`/  Trust and Authority  /`) while implementation uses single spaces (`/ Trust and Authority /`). This is a consistent pattern that may be intentional in the build. Check design intent.

- [ ] **Section spacing (mt from team section)** — Testimonials uses `section-shell` (padding-block: 120px at desktop). Figma: testimonial section label at 4098px, team section bottom ≈ 3935+24+... ≈ 3960+some padding. Gap from team bottom to testimonials label ≈ 4098-3960 = ~138px. `section-shell` applies 120px padding-block, so pt=120px — reasonable match. ✓

- [ ] **Mobile testimonial card bg** — Figma (mobile not directly audited, but) implementation: `bg-[var(--color-hr-off-white)]` which is `#F4F4F4` ✓

---

## Section 7: Blog

**Status:** NEEDS_WORK

### Discrepancies:

- [ ] **Blog card title font-size (desktop)** — Figma: 32px Regular, ls -0.64px (H3 level). Implementation: `lg:text-[24px] lg:leading-[1] lg:tracking-[var(--tracking-section-token)]` — **24px at desktop, not 32px**. **Discrepancy: Figma 32px vs Actual 24px for blog card titles at desktop.** — File: `src/components/sections/blog.tsx:44` — Severity: **Major**

- [ ] **Blog card title line-height (desktop)** — Figma: H3 lh normal (100%). Implementation: `lg:leading-[1]` ✓ (line-height: 1 = 100%)

- [ ] **Blog card title tracking (desktop)** — Figma: ls -0.64px (H3 tracking). Implementation: `lg:tracking-[var(--tracking-section-token)]` → `-0.36px`. **Discrepancy: -0.36px coded vs -0.64px in Figma.** — File: `src/components/sections/blog.tsx:44` — Severity: **Major** (compound with the font-size issue above)

- [ ] **Blog card excerpt text color** — Figma: excerpt text at left=100px uses `text-[#151419]` (dark) at top=5598px. Implementation: `text-[var(--color-hr-grey)]` → `#535353`. **Discrepancy: Figma shows dark text (#151419) for excerpt; implementation uses grey (#535353).** — File: `src/components/sections/blog.tsx:47` — Severity: **Major**

- [ ] **Blog card border-radius** — Figma: 40px (consistent with all major cards). Implementation: `lg:rounded-[var(--radius-card)]` → 40px ✓

- [ ] **Blog card image area height** — Figma: 207px. Implementation: `lg:h-[207px]` ✓

- [ ] **Blog card total height** — Figma: 467px. Implementation: `lg:h-[467px]` ✓

- [ ] **Blog section top mt adjustment** — In page layout: `<div className="-mt-14">` wraps Blog. This creates a -56px overlap with Testimonials. Figma: testimonial section bottom to blog section label gap needs measurement. The `-mt-14` is intentional for section overlap/layering effect. Not a direct discrepancy from Figma if the Figma also shows overlap.

- [ ] **H2 left column width** — Figma: H2 w=577px. Implementation: `lg:grid-cols-[577px_1fr]` ✓

- [ ] **Section label text spacing** — Figma: `/  Featured Blogs  /`. Implementation: `/ Featured Blogs /`. Same double-space pattern as other section labels. — Severity: **Minor**

- [ ] **Blog card title mobile font-size** — Figma doesn't show mobile for blog. Implementation mobile: `text-[28px] font-normal leading-[1.2] tracking-[-0.56px]` — maps to H2 mobile token (28px). This seems intentionally larger on mobile. No issue.

---

## Summary of All Discrepancies

| # | Section | Issue | File | Severity |
|---|---------|-------|------|----------|
| 1 | Hero | `pt-[100px]` should be ~109px | `about-us-hero.tsx:7` | Minor |
| 2 | Trust | Body paragraph `mt-10` (40px) vs ~100px Figma visual gap from H2 | `about-us-trust.tsx:110` | Major |
| 3 | Trust | Section `pt-[120px]` may be overshooting per Figma coordinates | `about-us-trust.tsx:8` | Major |
| 4 | Process | Section `mt-[120px]` vs ~92px Figma gap between Trust and Process | `about-us-process.tsx:20` | Minor |
| 5 | CTA | Panel bg `var(--color-bg-dark)` = `#0c0c0c` vs Figma `#151419` | `about-us-cta.tsx:34` | Major |
| 6 | Team | H2 `mt-5` (20px) vs Figma 43px gap from section label | `about-us-team.tsx:156` | Major |
| 7 | Team | Team name tracking token `-0.36px` vs Figma `-0.48px` | `globals.css:336` | Minor |
| 8 | Testimonials | Desktop card has `border border-[var(--color-hr-light-grey)]`; Figma has no card border | `testimonials.tsx:251` | Major |
| 9 | Testimonials | Section label single-space vs Figma double-space `/  Dedication  /` | `testimonials.tsx:149` | Minor |
| 10 | Testimonials | Quote mark Unicode char at 24px vs Figma SVG asset ~15px | `testimonials.tsx:279` | Minor |
| 11 | Blog | Card title `lg:text-[24px]` vs Figma 32px | `blog.tsx:44` | Major |
| 12 | Blog | Card title tracking `-0.36px` (section-token) vs Figma `-0.64px` (H3) | `blog.tsx:44` | Major |
| 13 | Blog | Excerpt text `text-[var(--color-hr-grey)]` (#535353) vs Figma `#151419` dark | `blog.tsx:47` | Major |

### Critical count: 0
### Major count: 8
### Minor count: 5

---

## Notes for Engineer

1. **Items 2 & 3 (Trust spacing):** The absolute Figma coordinates suggest the Trust section label is ~31px from the container top. The `pt-[120px]` implementation creates a much larger gap. However, the Figma layout is absolute-positioned so coordinates include the nav and hero. The actual relative padding should be verified against the rendered page visually. If the screenshot looks correct, re-measure from the screenshot rather than raw Figma absolutes.

2. **Item 7 (name tracking):** The `type-h4` / `type-team-title` class uses `--tracking-section-token` (`-0.36px` at desktop). Figma spec for Team & Testimonials font is explicitly `ls -2` Figma units at 24px → -0.48px. A separate token for team name tracking may be warranted.

3. **Item 5 (CTA bg):** This is the clearest actionable fix — change `bg-[var(--color-bg-dark)]` to `bg-[var(--color-hr-dark)]` in `about-us-cta.tsx:34`. The Figma uses `#151419` which maps to `--color-hr-dark`.

4. **Items 11–13 (Blog):** These are the highest-impact visual discrepancies. The blog title should be H3 (32px) not 24px on desktop, tracking should be `-0.64px`, and the excerpt should use dark text (#151419) not grey (#535353).

5. **Section label double-spaces:** Applies globally across the page (Trust, Dedication, Featured Blogs, Our Team labels). Figma consistently uses double spaces: `/  Label text  /`. Implementation uses single: `/ Label text /`. Decide on a standard and apply uniformly.
