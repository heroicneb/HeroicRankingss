# Remaining Pages Pixel-Perfect Audit — 2026-04-03

> Figma file key: `iIVCGkNIrd9sc6j9NKmGIF`
> All screenshots compared at 1440px wide, light mode.

---

## Partnership

**Status: FAIL**

### Critical Issues

- [ ] **CMS STUB IS RENDERING INSTEAD OF FULL DESIGN** — Root cause confirmed. The route at `src/app/(site)/(pages)/partnership/page.tsx` calls `getPartnershipPage()` from Sanity. If a CMS record exists, it renders `CmsPartnershipPage` — a minimal stub with only a hero heading, intro text, CTA button, and Portable Text body block. If no CMS record exists, it calls `notFound()`. The richly-designed `partnership-page.tsx` component is **never rendered** by any route. Sanity has a partnership page record populated, so the CMS stub renders. The Playwright screenshot confirms this: it shows the "Partnership Program" title, an intro paragraph, "Become a Partner" CTA, and a body text block — all from `CmsPartnershipPage`. The full multi-section design (statues hero, 3-card amplify grid, logo grid, differentiators list, FAQ, etc.) is completely bypassed.

  **Two possible resolutions:**
  1. Use the Sanity CMS to populate and extend the full partnership design (complex).
  2. Remove the CMS branch and always render `partnership-page.tsx` (hardcoded, matches Figma exactly).

  Until resolved, the page as seen by users does not match the Figma design at all — the gap is effectively the entire page.

### Design vs Built Discrepancies (based on comparing Figma node `247:345` to `partnership-page.tsx`)

Assuming the correct component does eventually render, the following additional discrepancies are noted from code analysis:

- [ ] **FAQ section label mismatch** — Figma shows `/ Find Your Answers /` as the section label above the FAQ. Code hardcodes no section label inside `ServiceFaq` and relies on the outer wrapper only — the FAQ section label is absent from the rendered output.
- [ ] **FAQ `<h2>` heading missing** — Figma shows `Frequently Asked / Questions` (with "Questions" in gradient) as an h2 above the FAQ items inside the FAQ panel. The `ServiceFaq` component does not render this heading inside `partnership-page.tsx`. The `ServiceFaq` call has no `heading` prop and no heading is passed.
- [ ] **Footer CTA text mismatch** — Figma shows "Ready to Elevate / Your Online Presence?" with purple gradient. The built site (via `FooterCtaVariant`) serves "Ready to grow together" on the `/partnership` route (only `/insights`, `/case-studies`, and `/contact` get the Elevate variant). Figma for this page shows the Elevate variant.
- [ ] **Logo grid row layout in Figma is 4 columns, 3 rows** — Figma shows all 10 partner logos in a 4-column grid that wraps into 3 rows. Code uses `grid-cols-4` at `xl:` which matches, but the `sm:grid-cols-4` below `xl` drops to 2 columns — minor responsive gap but acceptable.
- [ ] **Dark CTA section: top padding** — Code uses `pt-[110px]` inside the dark panel. Figma measures `top-[4190px]` for the heading inside a panel that starts at `top-[4080px]`, which gives ~110px internal top padding. This matches.
- [ ] **Section "Amplify Authority" label used twice** — Both the "Amplify Authority" and "Partnerships Designed to Scale" sections use the label `/ Amplify Authority /`. The second section should use `/ Amplify Authority /` per the Figma source code context (same label appears in Figma at both `top-[2053px]` and `top-[3457px]`). This is faithful to Figma but is a content issue to flag.
- [ ] **Partner logo grid right-alignment** — Figma shows the logo grid aligned to the right at `xl:`. Code uses `xl:justify-self-end` which is correct.

---

## Insights (Blog)

**Status: NEEDS_WORK**

### Discrepancies

- [ ] **Missing email subscribe bar** — Figma (node `248:1541`) shows an email input + "Subscribe" button row between the hero area and the category tab row. The built implementation has no subscribe widget — this entire UI element is absent.
- [ ] **Hero description text differs** — Figma: "The Heroic Rankings blog: where SEO knowledge converts into strategy. Discover the latest trends, industry insights, and actionable tactics that turn search data into measurable growth for your brand." Built: "Explore our blog for expert insights on SEO strategies, industry trends, and valuable tips to boost your online presence and rankings." — Different copy.
- [ ] **Hero heading width constraint** — Code uses `w-[294px]` for the h1 element which is very narrow (mobile-style). At 1440px wide the "Our Blog" heading renders tiny and left-constrained compared to Figma's centred, properly-spaced heading. The `h1` should not be width-capped at 294px; this appears to be a leftover mobile width.
- [ ] **Hero heading type class not used** — The h1 uses raw `text-[38px]` instead of the global `type-h1` class. Figma specifies H1/Web: 62px, leading 80px. At desktop the heading renders at 38px — significantly undersized vs design.
- [ ] **Hero subtitle width constraint** — The `<p>` below the heading also has `w-[294px]` hardcoded, making it render narrow at desktop. Should scale with container.
- [ ] **Article card read-time missing** — Figma cards show date AND read-time (e.g., "July 30, 2024 — 6 min read"). Built cards show date only (e.g., "October 2, 2024"). The "— 6 min read" suffix is absent.
- [ ] **"Show More" pagination button** — Figma shows a "Show More" button below the second row of 3 cards. Built implementation has no Show More / pagination control visible in the catalog.
- [ ] **Footer CTA — Body text mismatch** — Figma shows "We grow by helping our clients grow. We partner with you to build long-term SEO growth." The `FooterCtaVariant` for `/insights` resolves to the `ELEVATE_VARIANT` body: "Scale your business with a framework that is adjustable to any industry…" — different copy. Screenshot confirms the Elevate variant is rendering but Figma for insights uses this same Elevate variant — body matches Figma visually. However, the screenshot body reads "We grow by helping our clients grow. We partner with you to build long-term SEO growth." which is the DEFAULT_VARIANT body. This suggests the footer CTA variant routing may not be working correctly in the deployed preview either (the screenshot shows "Ready to grow together" with the default body, not the Elevate variant).

  **Note:** The footer CTA code correctly maps `/insights` to `ELEVATE_VARIANT`, but the screenshot shows "Ready to grow together." This discrepancy may be a Playwright viewport/routing issue, or the deployed preview build is stale. Flag for verification.

- [ ] **Card image top labels ("Top 5 SEO", "A Dive into…")** — Figma shows blog cards with floating category labels over the image thumbnail. Built cards do not render these floating labels.

---

## Case Studies

**Status: NEEDS_WORK**

### Discrepancies

- [ ] **Missing email subscribe bar** — Figma (node `248:1917`) shows an email input + "Subscribe" button row below the hero subtitle, before the card grid. The built implementation has no subscribe widget.
- [ ] **Card order differs from Figma** — Figma row 1: Affinda, My Baskets, Nagish. Row 2: Art by Maudsch, DesignRush, Number Artist. Built row 1: Art by Maudsch, Nagish, Number Artist. Row 2: Affinda, DesignRush, My Baskets. The card order in `CASE_STUDY_CARDS` does not match Figma's intended order.
- [ ] **Decorative dot between rows** — Code places a decorative `/case-studies/imgImage39.png` image between row 1 and row 2. This detail is absent from the visible Figma screenshot at this zoom level but the asset exists and appears intentional.
- [ ] **Hero heading type class mismatch** — Code uses raw `text-[48px] sm:text-[56px] xl:text-[62px]` with `font-normal`. Figma spec is H1/Web (62px, leading 80px, tracking -2). At 1440px this is equivalent — matches.
- [ ] **Footer CTA — "Ready to grow together" vs "Ready to Elevate"** — The code correctly maps `/case-studies` to `ELEVATE_VARIANT`. The Playwright screenshot, however, shows "Ready to grow together" body text, which matches the DEFAULT_VARIANT. Same concern as Insights — may be stale preview or routing issue. Figma design for this page shows the Elevate variant with "Ready to Elevate / Your Online Presence?" heading, which matches the code. Flag for verification in live environment.
- [ ] **Card panel label positioning** — Figma shows "Affinda" label at `left: 35px` from the card edge. Code uses `left-[35px]` — matches. "My Baskets" at `left: 126px` — code uses `left-[126px]` — matches. Other cards use `left-1/2 -translate-x-1/2` — matches. Fine.
- [ ] **Card description font size** — Built card description is `text-[18px]`. Figma description appears at ~18px. Matches.
- [ ] **Card date color** — Built uses `text-[var(--color-hr-grey)]`. Figma has the date in a lighter grey below the description. Tokens appear correct.

---

## Contact

**Status: NEEDS_WORK**

### Discrepancies

- [ ] **Intro body text differs** — Figma shows: "Whether you have questions about your current strategy, a project that feels too big, or don't even know where to start, fill out the form and let our team guide you." Built renders CMS-sourced text: "Whether you have questions about your strategy, a project that feels too big, or need a clear starting point, our team is ready to help." — Condensed/different copy. This is driven by Sanity CMS content. Not a code issue, but a content issue.
- [ ] **Heading gradient angle** — Figma for contact title uses a gradient at ~222.6°. Code applies `gradient-text-contact-title` which sets `--gradient-angle: 222.624deg` — matches.
- [ ] **Email link prefix** — Figma shows `/ &nbsp;&nbsp; sales@heroicrankings.com`. Code renders `/ &nbsp;&nbsp; {email}` where `email` comes from CMS (`cmsPage?.email`). Screenshot shows `/ sales@heroicrankings.com` — correct, email is populated from CMS.
- [ ] **Form field "Full Name" border** — Figma shows Full Name with a purple/accent border in default state. Code applies `border-[var(--color-hr-accent)]` when no error (correct). Company Name uses the subtle grey border in default state — Figma shows this field also with a grey/subtle border. This is consistent.
- [ ] **Form field grid at 1440px** — Figma shows a 2-column form grid (Full Name | Company Name, Company Email | How did you hear, then full-width textarea). Code uses `md:grid-cols-[305px_305px]` — at desktop this renders as two 305px columns totalling 635px + gap. Figma form column appears wider (~420px each). Minor discrepancy in column widths.
- [ ] **Company Email field placeholder** — Code: `placeholder="@"`. Figma: `@` as placeholder. Matches.
- [ ] **Textarea height** — Code uses `h-[200px]`. Figma textarea appears taller (roughly ~120px internal at this scale). The built textarea looks proportionally correct vs screenshot.
- [ ] **"Begin Your Path to Digital Success" CTA** — Built and Figma both show this label. Matches.
- [ ] **Page top padding** — Code applies `pt-[60px] lg:pt-[120px]`. At 1440px the form starts fairly high. Figma shows ~120px of white space before the heading. At lg breakpoint this matches. OK.
- [ ] **Missing `notFound()` guard** — `ContactPage` does NOT call `notFound()` when `cmsPage` is null — it falls back to default heading "Contact" and omits intro/email. This is safer than the note suggested. However, the Partnership page component also does not call `notFound()` — it is entirely hardcoded. Neither page has a 404 risk from the component code itself. The routing issue for Partnership (seeing wrong page) is unrelated to a `notFound()` call.

---

## Cross-Page Systemic Issues

- [ ] **Footer CTA variant routing** — The Playwright screenshots for Insights and Case Studies show the DEFAULT footer CTA ("Ready to grow together") rather than the ELEVATE variant the code intends. This may indicate the deployed preview is running with an old build, or there is a client-side hydration issue with `usePathname()` in the `FooterCtaVariant` component.
- [ ] **Subscribe bar** — Figma shows an email subscribe widget on both Insights and Case Studies pages. This feature is completely unimplemented across the codebase. Needs to be built.
- [ ] **Blog card read-time metadata** — No `readTime` field exists in `BlogPostEntry` or Sanity schema mappings. Requires schema extension and display component change.
- [ ] **Partnership page not rendering** — The wrong component/page is served at `/partnership` in the Playwright test environment. The rich `partnership-page.tsx` component is fully built but not visible. Needs investigation into the route file at `src/app/partnership/page.tsx`.
