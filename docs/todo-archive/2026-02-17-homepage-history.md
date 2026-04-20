# Heroic Rankings Figma Implementation TODO

## Active Loop: Codex Visual Audit — Pixel Perfect Verification (Desktop 1440)

- [x] Confirm persistent TTY dev server on `http://localhost:3000`
- [x] Build strict section order from app flow and bind each to Figma node IDs
- [x] Create audit cache log: `docs/figma-cache/extractions/2026-02-17-visual-audit-pass-01.md`
- [x] Validate current working Figma homepage key and cache it locally (`iIVCGkNIrd9sc6j9NKmGIF`)
- [x] For each section run exact loop: `get_design_context` -> `get_screenshot` -> save extracted facts locally -> Playwright screenshot + computed styles -> compare -> fix -> verify -> commit (in progress)
- [x] Section audit: Navbar
- [x] Section audit: Hero
- [x] Section audit: Services
- [x] Section audit: About
- [x] Section audit: Team
- [x] Section audit: Stats
- [x] Section audit: Featured Logos
- [x] Section audit: Case Studies
- [x] Section audit: Trust & Authority
- [x] Section audit: Partnerships
- [x] Section audit: Featured Blogs
- [x] Section audit: Testimonials
- [x] Section audit: Footer
- [x] Full-page 1440 verification and cross-section gap/alignment pass
- [x] Final full-page commit: `fix: pixel-perfect full-page verification complete`

## Active Loop: Accent-Word Color Re-Audit (Desktop)

- [x] Re-extract accent heading/text nodes from Figma MCP (`702:10219`, `702:10348`, `702:10351`, `702:10352`, `702:10223`, `702:10224`, `702:10225`)
- [x] Save extraction outputs immediately in local cache notes
- [x] Compare live accent words with Figma (word-by-word color treatment)
- [x] Fix missing/wrong accent-word styling angles per section
- [x] Re-verify in Playwright via computed styles + section screenshots
- [x] Commit accent-word audit fix

## Active Loop: Accent-Word Color Re-Audit Pass 03 (Live MCP + Desktop)

- [x] Confirm persistent dev server on `http://127.0.0.1:3000`
- [x] Run sparse live Figma MCP extraction for all accent text nodes (`702:10219`, `702:10348`, `702:10351`, `702:10352`, `702:10223`, `702:10224`, `702:10225`, `702:10226`)
- [x] Capture sparse MCP screenshots for key accent headings (`702:10219`, `702:10348`, `702:10351`, `702:10352`)
- [x] Save extraction immediately to local cache (`docs/figma-cache/extractions/2026-02-17-word-level-color-audit.md`)
- [x] Re-verify all accent words on live DOM using Playwright computed styles
- [x] Re-verify Team metric `20+` typography/stroke treatment against extracted Figma values
- [x] Determine whether any code patch is required for accent-word treatment (none required in this pass)
- [x] Run `npm run lint` and `npm run build` for close-out
- [x] Commit this audit checkpoint

## Active Loop: Accent Typography Hotfix Pass 04 (User Review)

- [x] Apply temporary solid accent color to validate user-reported rendering issue
- [x] Restore Figma gradient treatment after user confirmation
- [x] Add anti-line rendering safeguards (`-webkit-text-fill-color: transparent`, `display: inline-block`)
- [x] Re-verify all accent spans in Playwright (gradient present, text fill transparent)
- [x] Run `npm run lint` and `npm run build`
- [x] Commit Pass 04 hotfix

## Post-Refactor Optimization Audit (Code-Only, Zero Visual Delta)

- [x] Phase 1: Code quality scan cleanup completed (`any`/ts-ignore scan, dead file cleanup, exported prop interfaces, semantic heading fix)
- [x] Phase 1 verification: `npm run lint` passed
- [x] Phase 1 verification: `npm run build` passed
- [x] Phase 2: Performance optimization pass (`$vercel-react-best-practices`)
- [x] Phase 2 verification: `npm run build`
- [x] Phase 3: Metadata and SEO foundation updates
- [x] Phase 3 verification: `npm run build`
- [x] Phase 4: Security hardening checks
- [x] Phase 4 verification: `npm run build`
- [x] Phase 5: Lint + typecheck + build clean verification
- [x] Phase 5 verification: `npx next lint` attempted (Next 16 CLI reports invalid `lint` subcommand), `npx tsc --noEmit` passed, `npm run lint` passed, `npm run build` passed
- [x] Phase 6: Temporary optimization summary (`OPTIMIZATION_LOG.md`) created and removed
- [x] Phase 6 final commit: `optimize: post-refactor optimization complete — ready for visual audit`

## Architecture Refactor Loop (Next.js 16, Desktop-Exact Output)

- [x] Phase 1: Deep audit completed and `REFACTOR_PLAN.md` created
- [x] Phase 2: Design token system implemented; hardcoded color usage removed from section components
- [x] Phase 3: Folder structure prepared (`src/types`, `src/hooks`) and shared interfaces created
- [x] Phase 4: Atomic UI primitives extracted (`button`, `card`, `badge`, `input`, `heading`, `container`)
- [x] Phase 5: Layout components extracted (`layout/navbar`, `layout/navbar-mobile`, `layout/footer`)
- [x] Phase 6: Section modules standardized and wired to shared data types
- [x] Phase 7: Root layout now composes navbar/footer; homepage is section-only composition
- [x] Phase 8: Performance/best-practice cleanup applied (next/font, metadata, next/image above fold)
- [x] Phase 9: Dark-mode token scaffolding prepared (`.dark` token mirror + theme provider placeholder)
- [x] Phase 10: Responsive-prep TODO anchors added for targeted mobile pass
- [x] Phase 11: Final cleanup completed (kebab-case files, ui barrel export, unused wrappers removed)
- [x] Verification: `npm run lint` passed
- [x] Verification: `npm run build` passed
- [x] Verification note: `npm run test` script is missing in this repository

## Global Execution Rules (from CODEX.md)

- [x] Enforce section-by-section workflow
- [x] Enforce mandatory loop: Figma MCP extract -> build -> Playwright compare -> iterate -> commit
- [x] Enforce atomic task tracking
- [x] Keep committing frequently after each completed loop step
- [x] Enforce per-section extraction notes update in `REFACTOR.md`
- [x] Enforce desktop-first delivery; defer mobile until dedicated mobile design pass

## Ultra-Strict Full Homepage Desktop Re-Audit (Mandatory)

- [x] Reopen full desktop audit from Section 1 through Section 13 (do not skip completed labels)
- [x] Keep persistent dev server running during entire audit loop
- [x] For every section, run exact loop: Figma extract -> save local cache -> code -> Figma compare -> Playwright compare -> iterate
- [x] For every successful Figma MCP extraction, save results immediately under `docs/figma-cache/extractions/` and `public/figma/<section>/` when assets exist
- [x] For every section, capture Playwright desktop snapshots at `2048`, `1440`, `1280`, `1024`
- [x] For every mismatch, add a concrete fix task in `todo.md` before editing code
- [x] Update `REFACTOR.md` after each section with extraction findings and maintainability notes
- [x] Run `npm run lint` and `npm run build` after each section-close loop
- [x] Run repository command check at end (`npm run lint`, `npm run test`, `npm run build`) and record missing scripts explicitly
- [x] Repository command note: `npm run test` script is missing in this repo
- [x] Section 1 re-audit complete (Navbar)
- [x] Section 2 re-audit complete (Hero)
- [x] Section 3 re-audit complete (Services)
- [x] Section 4 re-audit complete (About)
- [x] Section 5 re-audit complete (Team)
- [x] Section 6 re-audit complete (Stats)
- [x] Section 7 re-audit complete (Featured Logos)
- [x] Section 8 re-audit complete (Case Studies)
- [x] Section 9 re-audit complete (Trust & Authority)
- [x] Section 10 re-audit complete (Partnerships)
- [x] Section 11 re-audit complete (Featured Blogs)
- [x] Section 12 re-audit complete (Testimonials)
- [x] Section 13 re-audit complete (Footer)

## Active Loop: Desktop Pixel Hardening Pass 03 (Team + Trust + Testimonials + Footer)

- [x] Confirm persistent dev server availability on `3000` before edits
- [x] Probe Figma MCP once; if rate-limited, continue cache-first without repeated calls
- [x] Add concrete mismatch tasks before editing code (this loop)
- [x] Team: fix desktop clipping of second member card at `1280/1024` while preserving `1440` Figma geometry
- [x] Trust & Authority: remove separate-window feel by using seamless rail fade treatment (no visible mask slab)
- [x] Testimonials: re-verify card rhythm and typography against cached extraction + reference screenshot (`1440` + `1024`)
- [x] Footer: fix `1024` content clipping while preserving `1440` frame fidelity
- [x] Capture Playwright screenshots for this loop (`2048`, `1440`, `1280`, `1024`)
- [x] Update `docs/figma-cache/extractions/2026-02-17-homepage-pass-02.md` with MCP status + cache-first decision
- [x] Update `REFACTOR.md` with new maintainability notes from this pass
- [x] Run `npm run lint` and `npm run build`

## Active Loop: Services + About Re-Audit Pass 03 (Desktop)

- [x] Run Playwright captures for Services front + hover at `2048`, `1440`, `1280`, `1024`
- [x] Run Playwright captures for About at `2048`, `1440`, `1280`, `1024`
- [x] Verify no clipping/overflow and no interaction regressions against cached references
- [x] Record artifacts and findings in `docs/figma-cache/extractions/2026-02-17-homepage-pass-02.md`
- [x] Update `REFACTOR.md` with pass result
- [x] No code changes required for Services/About in this pass

## Active Loop: Stats + Case Studies Desktop Hardening Pass 03

- [x] Capture desktop QA artifacts for Stats/Featured and Case Studies at `2048`, `1440`, `1280`, `1024`
- [x] Stats: resolve `1024` metric-label overlap while preserving `1440` Figma geometry
- [x] Case Studies: resolve `1024` top-block clipping (fixed two-column heading/copy layout)
- [x] Case Studies: keep card and quote/photo visual parity after responsive fix
- [x] Re-run Playwright verification for both sections at `2048`, `1440`, `1280`, `1024`
- [x] Update extraction log and `REFACTOR.md` for this pass
- [x] Run `npm run lint` and `npm run build`

## Active Hotfix Loop: Hero + Navbar Fidelity

- [x] Scope override: desktop-first implementation pass only (mobile deferred until later)
- [x] Refresh Figma MCP extraction for Hero media (`702:10157`) and Navbar (`702:10162`)
- [x] Fix Hero wide-screen stretch path by matching Figma frame geometry
- [x] Fix Navbar CTA overflow/leak on intermediate desktop widths
- [x] Playwright desktop compare pass at 2560 / 2048 / 1440 / 1280 / 1024
- [ ] Mobile compare pass deferred (768 / 375) until desktop parity cycle is complete
- [x] Lint and build pass after hotfixes
- [x] Commit hotfix as atomic checkpoint

## Active Loop: Services Cards (Images + Hover Backface)

- [x] Confirm desktop-first scope (mobile compare deferred)
- [x] Refresh Figma MCP extraction for Services node (`766:115`) and back-state node (`766:175`)
- [x] Extract and save per-card image assets from Figma MCP localhost asset server
- [x] Rebuild Services card model with image fronts and hidden back content
- [x] Implement smooth hover/focus rotate reveal animation (front -> back)
- [x] Fix second card pre-revealed-text defect (text only on card back)
- [x] Playwright desktop compare pass for Services (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Lint and build pass after Services interactive updates
- [x] Commit Services interactive parity checkpoint

## Active Loop: Dedication + Footer Pixel Perfection (Desktop)

- [x] Start persistent TTY dev server on `3000` for uninterrupted QA loop
- [x] Re-run minimal Figma MCP extraction for active fixes only (`702:10219`, `767:2911`, testimonials/footer nodes)
- [x] Save every new extraction locally under `docs/figma-cache/extractions/` and `public/figma/*` immediately
- [x] Fix Team key metric styling (`20+`) to outlined purple treatment
- [x] Fix Trust & Authority rail cards to blend seamlessly with section background (no separate-window look)
- [x] Align accent-word gradient token to exact Figma stops
- [x] Implement Testimonials with real avatar/logo assets and exact card geometry (`413x574`)
- [x] Implement Footer frame geometry (`1420x610`) and spacing from Figma node `803:4113`
- [x] Run Playwright desktop iteration loop (`2048`, `1440`, `1024`) for Team + Trust + Testimonials + Footer
- [x] Run repo validation (`npm run lint`, `npm run build`; `npm run test` missing script)
- [ ] Start full homepage section-by-section desktop re-audit loop before moving to mobile

## Section 1: Navbar (`702:10162`) — COMPLETE

- [x] Figma MCP extraction available (context + screenshot)
- [x] Initial Navbar implementation created
- [x] Desktop dropdown behavior implemented (click + keyboard)
- [x] Mobile menu behavior implemented (open/close + escape)
- [x] Mobile focus trap implemented and verified
- [x] Desktop visual parity tuned to 1:1 with Figma
- [x] Responsive visual parity tuned (1440, 1024, 768, 375)
- [x] Playwright final verification pass for Navbar
- [x] Commit Navbar section as atomic checkpoint
- [x] Hotfix: Home nav item contrast fixed (text now white on dark active pill)

## Remaining Sections (blocked until current section loop is complete and committed)

- [x] Section 2: Hero
- [x] Section 3: Services
- [x] Section 4: About
- [x] Section 5: Team
- [x] Section 6: Stats
- [x] Section 7: Featured Logos
- [x] Section 8: Case Studies
- [x] Section 9: Trust & Authority
- [x] Section 10: Partnerships
- [x] Section 11: Blog
- [x] Section 12: Testimonials
- [x] Section 13: Footer

## Section 2: Hero (`702:10155`) — COMPLETE

- [x] Figma MCP attempt (rate-limited) and fallback to cached extraction
- [x] Extracted target geometry from cached context (`call_a8nY...`)
- [x] Updated Hero layout to match Figma coordinates on desktop
- [x] Verified Hero geometry in Playwright (x/y/width/height alignment)
- [x] Verified responsive Hero behavior (1440, 1024, 768, 375)
- [x] Lint and build pass after Hero changes
- [x] Commit Hero section as atomic checkpoint

## Section 3: Services (`766:115`) — REOPENED

- [x] Cached Figma extraction available (context + screenshot)
- [x] Validate current Services geometry against Figma
- [x] Tune Services layout and card sizing to match Figma
- [x] Verify Services behavior and visuals in Playwright
- [x] Lint and build pass after Services changes
- [x] Commit Services section as atomic checkpoint
- [x] Reopen for interactive front/back parity and per-card image pass

## Section 4: About (`702:10227`, `702:10231`, `702:10236`, `702:10237`, `702:10238`) — COMPLETE

- [x] Figma MCP extraction refreshed (metadata + context + screenshot)
- [x] Validate current About geometry against Figma
- [x] Tune About layout and logo strip sizing to match Figma
- [x] Verify About visuals in Playwright (1440, 1024, 768, 375)
- [x] Lint and build pass after About changes
- [x] Commit About section as atomic checkpoint

## Section 5: Team (`702:10229`, `702:10218`, `702:10247`, `702:10260`) — READY

- [x] Refresh Figma MCP extraction (context + screenshot + key geometry)
- [x] Update `REFACTOR.md` with Team extraction findings before finalizing section
- [x] Validate current Team geometry against Figma
- [x] Tune Team layout/cards to match Figma
- [x] Verify Team visuals in Playwright (1440, 1024, 768, 375)
- [x] Lint and build pass after Team changes
- [x] Commit Team section as atomic checkpoint

## Section 6: Stats (`702:10230`, `702:10219`, `702:10235`, `702:10206`, `702:10272`) — IN PROGRESS

- [x] Refresh Figma MCP extraction (context + screenshot + key geometry)
- [x] Update `REFACTOR.md` with Stats extraction findings before finalizing section
- [x] Replace placeholder stat visuals with Figma assets
- [x] Tune stats layout/typography/spacing to match Figma
- [x] Verify Stats visuals in Playwright desktop mode (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Mobile verification deferred for dedicated mobile-design pass
- [x] Lint and build pass after Stats changes
- [x] Commit Stats section as atomic checkpoint

## Section 7: Featured Logos (`702:10348`, `702:10288`) — IN PROGRESS

- [x] Refresh Figma MCP extraction (heading + logo frame context and screenshot)
- [x] Update `REFACTOR.md` with Featured Logos extraction findings before finalizing section
- [x] Replace logo placeholders with exact Figma logo assets
- [x] Tune heading gradient treatment and logo row spacing/border to match Figma
- [x] Verify Featured Logos visuals in Playwright desktop mode (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Mobile verification deferred for dedicated mobile-design pass
- [x] Lint and build pass after Featured Logos changes
- [x] Commit Featured Logos section as atomic checkpoint

## Section 8: Case Studies (`702:10354`, `702:10351`, `702:10358`, `702:10410`, `702:10222`) — IN PROGRESS

- [x] Refresh Figma MCP extraction (heading, side copy, cards, quotes)
- [x] Update `REFACTOR.md` with Case Studies extraction findings before finalizing section
- [x] Match case-study cards to full-bleed top blocks and exact card geometry
- [x] Match quote band treatment (light focused center quote with faded adjacent quotes)
- [x] Verify Case Studies visuals in Playwright desktop mode (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Mobile verification deferred for dedicated mobile-design pass
- [x] Lint and build pass after Case Studies changes
- [x] Commit Case Studies section as atomic checkpoint

## Section 9: Trust & Authority (`702:10356`, `702:10353`, `702:10366`, `767:2911`) — COMPLETE

- [x] Reconfirm section position in page flow (after Proven Results / before Partnerships) and use dedicated `TrustAuthority` component
- [x] Re-validate left-column geometry from cached Figma extraction (`x:80`, heading width `413`, CTA width `303`)
- [x] Build/retain dedicated animated rail component (`TrustAuthorityRail`) with modular card subcomponent
- [x] Match desktop layout geometry to Figma (`600 + 10 + 670` split, rail `670x660`, card `160x100`, gap `10`)
- [x] Implement continuous transform-only card motion with per-column direction/speed/phase offsets
- [x] Gate animation by viewport visibility (IntersectionObserver) and stop motion under `prefers-reduced-motion`
- [x] Keep zero layout shift by reserving static layout geometry and animating only `transform`
- [x] Re-run Playwright desktop QA snapshots (`2560`, `2048`, `1440`, `1280`, `1024`) at two animation timestamps
- [x] Re-run reduced-motion QA and confirm static transforms (`stable: true`)
- [x] Run lint + build after Trust & Authority parity pass
- [x] Commit Trust & Authority checkpoint

## Section 10: Partnerships (`/ The Value We Bring /`) — COMPLETE

- [x] Attempt fresh Figma MCP extraction for this section before implementation
- [x] Figma MCP blocked by rate-limit; continue using cached full-page geometry and user-provided reference frames
- [x] Tune gradient panel and spacing to match desktop reference
- [x] Fix CTA contrast on dark background (`Become a Partner`)
- [x] Remove desktop clipping regression at `1024px` by switching to responsive two-column sizing
- [x] Verify desktop visuals in Playwright (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Run lint + build after Partnerships parity pass
- [x] Commit Partnerships checkpoint

## Section 11: Featured Blogs (`/ Featured Blogs /`) — COMPLETE

- [x] Keep existing desktop layout geometry and typography aligned with current Figma parity baseline
- [x] Convert each blog window/card to full-surface semantic link behavior
- [x] Use placeholder `href="#"` values for unwired blog routes, keeping future route wiring data-driven
- [x] Ensure visible keyboard focus styles for blog-card links using existing ring pattern
- [x] Verify link coverage and geometry in Playwright (`3/3` cards clickable across full `h-[467px]` surface)
- [x] Verify desktop visuals in Playwright (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Run lint + build after Featured Blogs interaction pass
- [x] Commit Featured Blogs checkpoint

## Section 12: Testimonials (`702:10355`, `702:10352`, `702:10153`, `702:10790`, `702:10791`, `702:10792-702:10813`) — COMPLETE

- [x] Refresh minimal Figma MCP extraction for heading/CTA/card geometry and testimonial media nodes
- [x] Save extracted avatar/logo assets locally under `public/figma/testimonials/`
- [x] Match desktop heading/CTA geometry and testimonial card shells (`413x574`, `20px` gutters)
- [x] Replace placeholders with real avatars and logo chips from Figma exports
- [x] Match quote/content/name/role vertical rhythm and typography against Figma references
- [x] Verify desktop visuals in Playwright (`2048`, `1440`, `1024`) and iterate until no overlap/clipping
- [x] Run lint + build after Testimonials parity pass

## Section 13: Footer (`803:4113`) — COMPLETE

- [x] Extract full footer frame from Figma MCP and cache node geometry/assets locally
- [x] Match footer surface geometry (`1420x610`, `40px` radius, accent border) and content spacing
- [x] Match heading/body/CTA typography and bottom link-row grouping from Figma frame
- [x] Replace placeholder brand mark with exported vector asset and align copyright row
- [x] Verify desktop visuals in Playwright (`2048`, `1440`, `1024`) and iterate for seam/contrast fixes
- [x] Run lint + build after Footer parity pass

## Active Loop: Trust & Authority 1:1 Finalization (`702:10356`, `702:10353`, `702:10366`)

- [x] Attempt fresh Figma MCP extraction for section refresh
- [x] Figma MCP blocked by rate-limit; continue with cached geometry and provided reference screenshots
- [x] Validate frame-level parity against user-provided reference states (multiple timestamps)
- [x] Update `REFACTOR.md` with Trust & Authority extraction + implementation notes
- [x] Atomic commit after verification gates

## Active Loop: Partnerships + Featured Blogs Desktop Hardening

- [x] Keep desktop-first scope and defer tablet/mobile refinements to dedicated pass
- [x] Run one Figma MCP probe for extraction refresh; stop on rate-limit response (no repeated calls)
- [x] Close visual mismatches using cached references and Playwright desktop snapshots
- [x] Add/verify blog card link semantics and focus states
- [x] Update `todo.md` and `REFACTOR.md` with findings
- [x] Atomic commits for Partnerships and Featured Blogs

## Figma Cache Persistence (Offline Continuity)

- [x] Persist local Figma cache bundle under `docs/figma-cache/`
- [x] Save node map, asset manifest, and Playwright reference manifest
- [x] Add trusted geometry/motion notes for outage-mode implementation
- [x] Update `CODEX.md` with mandatory cache-first fallback rule

## Reopened QA Loop: Team Desktop Pixel Audit (`702:10229`, `702:10218`, `702:10247`, `702:10260`)

- [x] Refresh Figma MCP screenshots/context for Team reference nodes
- [x] Playwright desktop audit snapshots (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Log every Team mismatch in `REFACTOR.md` before changing code
- [x] Apply Team fixes for pixel parity (layout, spacing, typography, card offsets, focal crop)
- [x] Re-run Team Playwright desktop audit and confirm 1:1 parity
- [x] Lint and build pass after Team QA fixes
- [x] Commit Team QA hardening checkpoint

## Reopened QA Loop: Stats Desktop Pixel Audit (`702:10230`, `702:10219`, `702:10235`, `702:10206`, `702:10272`)

- [x] Refresh Figma MCP screenshots/context for Stats reference nodes
- [x] Playwright desktop audit snapshots (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Log every Stats mismatch in `REFACTOR.md` before changing code
- [x] Apply Stats fixes for pixel parity (panel geometry, spacing, CTA contrast, text stroke, image alignment)
- [x] Re-run Stats Playwright desktop audit and confirm pixel-perfect parity
- [x] Lint and build pass after Stats QA fixes
- [x] Commit Stats QA hardening checkpoint

## Reopened QA Loop: Proven Results Desktop Pixel Audit (`702:10354`, `702:10351`, `702:10358`, `702:10410`, `702:10222`)

- [x] Refresh Figma MCP screenshots/context for Proven Results reference nodes
- [x] Playwright desktop audit snapshots (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Log every Proven Results mismatch in `REFACTOR.md` before changing code
- [x] Apply Proven Results fixes for pixel parity (headline wrap, side-copy measure, card geometry, quote band treatment)
- [x] Re-run Proven Results Playwright desktop audit and confirm pixel-perfect parity
- [x] Lint and build pass after Proven Results QA fixes
- [x] Commit Proven Results QA hardening checkpoint

## Reopened QA Loop: Proven Results Missing Photo + Full Section Re-verify (`702:10158`, `702:10159`, `702:10160`, `702:10154`)

- [x] Re-extract missing post-quote photo node from Figma MCP (`702:10158`) with screenshot/context
- [x] Export full-quality image asset from Figma (not screenshot) and store under `public/figma/case-studies/`
- [x] Implement the missing `1400x480` photo band after quotes with exact `40px` radius and gradient+image layering
- [x] Re-tune quote-to-photo spacing to match Figma vertical rhythm
- [x] Re-run Playwright desktop audit snapshots for the full Proven Results section (`2560`, `2048`, `1440`, `1280`, `1024`)
- [x] Compare new captures against Figma section screenshot (`702:10154`) and close remaining mismatches
- [x] Run lint + build after the new Proven Results patch
- [x] Commit missing-photo + Proven Results QA re-verify checkpoint

## Hotfix Loop: Rectangle 5 Surface Fidelity (`702:10156`)

- [x] Re-extract Figma metadata/context for Rectangle 5 container
- [x] Confirm Guided by Data + Featured belong to one continuous Rectangle 5 section
- [x] Replace custom gradient background with exact Figma fill (`#151419`)
- [x] Re-verify combined section in Playwright desktop snapshot
- [x] Commit Rectangle 5 surface fidelity hotfix

## Reopened Interaction Loop: Proven Results Links + Quote Animation + Team Links

- [x] Convert Proven Results case cards to clickable link targets (placeholder anchors for future detail pages)
- [x] Add smooth looping quote-focus animation (one active line, two blurred lines)
- [x] Keep quote loop accessibility-safe with reduced-motion fallback
- [x] Convert both Team profile cards to clickable link targets (placeholder anchors for future profile pages)
- [x] Re-run Playwright interaction QA for links and quote loop state transitions
- [x] Run lint + build after interaction updates
- [x] Commit interaction-link/animation checkpoint

## Accent Typography Hotfix Pass 05 (Word-Level Color Corrections)

- [x] Apply gradient accent to `sustainable success` in Services heading
- [x] Apply gradient accent to `Trusted Growth Partner` in About heading
- [x] Apply gradient accents to About body phrases:
  - [x] `long-term success for your business.`
  - [x] `strategies that align with your vision,`
  - [x] `Seeing our clients achieve their goals`
- [x] Apply gradient accent to `Partnerships` in Trust & Authority heading
- [x] Apply gradient accents to Partnerships copy:
  - [x] `various partnership`
  - [x] `through our expertise.`
- [x] Apply gradient accent to `Most Popular Reads` in Featured Blogs heading
- [x] Commit accent typography hotfix pass 05

## Figma Cache Verification + Local Save Pass

- [x] Verify local presence of Figma-derived assets under `public/figma/**`
- [x] Verify local extraction metadata cache under `docs/figma-cache/**`
- [x] Verify local QA screenshot cache under `output/playwright/**`
- [x] Create stable canonical desktop section screenshot set under `docs/figma-cache/snapshots/desktop-1440/**`
- [x] Refresh cache manifests:
  - [x] `docs/figma-cache/assets-manifest.json`
  - [x] `docs/figma-cache/playwright-reference-manifest.json`
  - [x] `docs/figma-cache/cache-index.json`
  - [x] `docs/figma-cache/local-verification-2026-02-17.json`
- [x] Add explicit local cache status doc: `docs/figma-cache/LOCAL_CACHE_STATUS.md`
- [x] Create offline archives:
  - [x] `docs/figma-cache/archives/figma-cache-clean-*.tar.gz`
  - [x] `docs/figma-cache/archives/public-figma-assets-clean-*.tar.gz`

## Services Rail Scrollbar Hotfix

- [x] Revert to original thin divider line above `/ About /` (remove thick extra scrollbar line)
- [x] Keep Services rail scrollbar hidden
- [x] Add mouse-wheel-to-horizontal scroll behavior for Services rail
- [ ] Verify interaction in browser + run lint/build
