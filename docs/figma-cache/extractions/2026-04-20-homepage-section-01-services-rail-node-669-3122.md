# Figma Extraction — Homepage Services Rail
**Date:** 2026-04-20
**File Key:** 7qZIJIngHrkTeaq9nWZkSa
**Page Context:** 702:10152 (`HR - Homepage`)
**Homepage Services Rail Frame:** 766:115 (`Group 177033`)
**Target Node:** 669:3122 (`Group 177008`)

## Layout Coordinates

| Element | Node ID | x | y | w | h | Notes |
|---|---|---|---|---|---|---|
| Homepage services rail frame | 766:115 | 80 | 1525 | 3444 | 560 | Absolute homepage coordinates from `HR - Homepage` metadata |
| Current-copy services rail group | 669:3122 | 0 | 0 | 3444 | 560 | Target rail size from node metadata |
| Link Building Services card | 766:175 | 513 | 1525 | 414 | 560 | Visible in homepage rail metadata and expected in desktop rail |

## Card Order

1. `All SEO Services`
2. `Link Building Services`
3. `On-Page SEO`
4. `Technical SEO Services`
5. `Technical SEO Services`
6. `E-Commerce SEO Services`
7. `Content Services`
8. `Content Services`

## Typography + Color Specs

| Token | Value |
|---|---|
| H3/Web | DM Sans, 32px, 400, 32px line-height, -0.64px letter-spacing |
| Foreground | `#FFFFFF` |
| Dark tone | `#151419` |
| Card radius | 40px (`--radius-card`) |
| Card CTA size | 72px desktop / 60px mobile |

## Visual Observations

- The target node is a single horizontal rail of eight 413px service cards with 20px desktop gaps.
- The screenshot for `669:3122` shows all eight cards visible in sequence on desktop, including `Link Building Services`.
- The card front face is image-led with a dark overlay, white H3 copy, and a circular bottom-right CTA.
- The current code structure already matches the layout pattern closely; the main confirmed parity miss is the desktop-hidden `Link Building Services` card.

## Verification Notes

- `mcp__codex_apps__figma._get_metadata` confirmed `669:3122` is an eight-card services rail sized `3444×560`.
- `mcp__codex_apps__figma._get_design_context` returned React/Tailwind code plus tokens aligned with existing homepage card dimensions and typography.
- `mcp__codex_apps__figma._get_screenshot` visually confirmed the desktop rail includes `Link Building Services`.
- No screenshot file was saved locally; visual observations are documented here per repo rules.
- Current code mismatch before fix: `/src/components/sections/services.tsx` marked `Link Building Services` as `mobileOnly`, which injected `lg:hidden` and broke desktop parity.
