# Figma Extraction — Homepage Services Copy And Layout
**Date:** 2026-04-20
**File Key:** 7qZIJIngHrkTeaq9nWZkSa
**Page Context:** 702:10152 (`HR - Homepage`)
**Target Section Node:** 502:4
**Supporting Nodes:** 669:3122 (`Group 177008`), 766:115 (`Group 177033`), 702:10217 (services heading), 702:10228 (services label), 659:5116 (front card reference)

## Layout Coordinates

| Element | Node ID | x | y | w | h | Notes |
|---|---|---|---|---|---|---|
| Services rail group | 669:3122 | 0 | 0 | 3444 | 560 | Eight-card horizontal rail from current-copy homepage |
| Services rail frame | 766:115 | 80 | 1525 | 3444 | 560 | Parent frame exposing front-card positions plus one explicit back-copy node |
| Link Building back-copy text | 766:180 | 543 | 1585 | 295.87 | 168 | Exact current-copy text node from metadata |
| Services heading | 702:10217 | n/a | n/a | n/a | n/a | Screenshot confirmed desktop wrap across exactly two lines |
| Services label | 702:10228 | n/a | n/a | n/a | n/a | Design context confirmed exact label text `/  Services  /` |

## Typography + Color Specs

| Token | Value |
|---|---|
| Services H2/Web | DM Sans, 52px, 400, 60px line-height, -1.04px letter-spacing |
| Services card H3/Web | DM Sans, 32px, 400, 32px line-height, -0.64px letter-spacing |
| Services back-copy/Web | 18px text observed in prior parity verification for the same section |
| Foreground | `#FFFFFF` |
| Dark tone | `#151419` |
| Card radius | 40px |

## Visual Observations

- The homepage hero in current-copy Figma does not include a `/ Services /` label above the desktop H1.
- The services heading wraps as:
  1. `Strategies for sustainable`
  2. `success and proven growth.`
- The gradient emphasis spans `sustainable success`, split across the two desktop lines.
- The current-copy services rail keeps the existing front-card titles:
  1. `All SEO Services`
  2. `Link Building Services`
  3. `On-Page SEO`
  4. `Technical SEO Services`
  5. `Technical SEO Services`
  6. `E-Commerce SEO Services`
  7. `Content Services`
  8. `Content Services`
- `766:115` metadata exposed the exact Link Building back-copy node and confirmed the back-copy width is about 296px, which aligns with the current card text container.

## Current-Copy Back-Face Copy

1. `All SEO Services`
   `Comprehensive support to ensure every aspect of your SEO strategy is optimized for success and tailored to your business needs.`
2. `Link Building Services`
   `Gain visibility on top-tier websites and connect with your target audience to increase your site's authority and improve rankings. Strengthen online presence with exceptional link building strategies and reporting.`
3. `On-Page SEO`
   `Refine your website's content and architecture for enhanced search engine visibility and better search rankings.`
4. `Technical SEO Services`
   `Optimize Your Infrastructure. Enhance User Experience. Boost Rankings.`
5. `Technical SEO Services`
   `Dominate Your Local Market. Connect with Nearby Customers. Increase Foot Traffic.`
6. `E-Commerce SEO Services`
   `Optimize Your Online Store. Drive Conversions and Sales.`
7. `Content Services`
   `Tell stories that matter. Connect with your audience. Turn engagement into conversions.`
8. `Content Services`
   `Get the most out of your content. Target the Right Search. Find More Customers.`

## Verification Notes

- `mcp__codex_apps__figma._get_metadata(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=669:3122)` confirmed the eight-card desktop rail and front-card order.
- `mcp__codex_apps__figma._get_design_context(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=659:5116)` confirmed front-card typography and styling for the current-copy rail.
- `mcp__codex_apps__figma._get_screenshot(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=502:4)` was used for visual copy/layout verification of the services section. No screenshot file was stored locally; observations are documented here per repo rules.
- `mcp__codex_apps__figma._get_screenshot(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=702:10217)` confirmed the services heading renders in exactly two desktop rows.
- `mcp__codex_apps__figma._get_design_context(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=702:10217)` confirmed the heading text content and H2 typography.
- `mcp__codex_apps__figma._get_design_context(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=702:10228)` confirmed the exact services label text.
- `mcp__codex_apps__figma._get_metadata(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=766:115)` exposed the exact Link Building back-copy node `766:180`.
- `mcp__codex_apps__figma._get_design_context(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=502:4)` timed out.
- `mcp__codex_apps__figma._get_metadata(fileKey=7qZIJIngHrkTeaq9nWZkSa, nodeId=502:4)` timed out twice.
- The last `Content Services` back-face line is inferred from the `502:4` screenshot plus prior verification text truncation (`Get the most out of your content. Target the Right Search. F...`).
