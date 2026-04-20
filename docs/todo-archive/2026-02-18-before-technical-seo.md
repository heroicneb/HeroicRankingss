# SEO Services Page TODO (Desktop First, Figma 1:1)

## Workflow Lock
- [x] Follow `/Users/pavle/Developer/codex/Heorics/CODEX.md`
- [x] Page-first extraction completed for `203:1361` (metadata + screenshot + key context)
- [x] Figma assets localized to `/public/seo-services/`
- [x] Playwright verification required before close-out

## Extraction + Cache
- [x] Save `get_design_context` cache for `203:1361` to `figma-cache/203-1361-design-context.xml`
- [x] Save `get_metadata` cache for `203:1361` to `figma-cache/203-1361-metadata.xml`
- [x] Save `get_screenshot` cache for `203:1361` to `figma-cache/203-1361-screenshot.json`
- [x] Save decoded screenshot to `figma-cache/203-1361-screenshot.png`
- [x] Save extraction notes to `docs/figma-cache/extractions/2026-02-18-seo-services-page.md`

## Section 01: Hero (`203:1404`, `203:1405`, `204:1714`, `310:2`, `204:1700`, `204:1701`, `204:1703`, `204:1705`)
- [x] Figma context captured
- [x] implementation complete
- [x] Playwright compare complete (`2560/2048/1440/1280/1024`)

## Section 02: SEO Solutions Grid (`204:1715`, `204:1716`, `204:1798`, `204:1799`, `204:1800`, `204:1812`, `204:1838`, `204:1842`, `204:1834`)
- [x] Figma context captured
- [x] implementation complete
- [x] Playwright compare complete (`2560/2048/1440/1280/1024`)

## Section 03: Why Choose (`211:2034`, `211:2035`, `211:2036`, `211:2037`, `213:2135`, `213:2143`, `213:2164`, `213:2165`, `213:2188`)
- [x] Figma context captured
- [x] implementation complete
- [x] Playwright compare complete (`2560/2048/1440/1280/1024`)

## Section 04: Success Stories (`216:2194`, `216:2195`, `791:149`, `222:123`)
- [x] Figma context captured
- [x] implementation complete
- [x] Playwright compare complete (`2560/2048/1440/1280/1024`)

## Section 05: FAQ (`222:128`, `222:129`, `222:131`, `222:133`, `222:138`, `222:141`, `222:150`, `222:151`)
- [x] Figma context captured
- [x] implementation complete
- [x] Playwright compare complete (`2560/2048/1440/1280/1024`)

## Shared Layout Reuse
- [x] Navbar reused and active SEO state matches Figma
- [x] Footer reused and SEO variant copy matches Figma

## Close-Out Gate
- [x] Lint passes (`npm run lint`)
- [x] Final full-page screenshot captured in `output/playwright/`

## Hotfix: Hero Panel Alignment (`204:1714`)
- [x] `get_design_context` cached to `figma-cache/204-1714-design-context.xml`
- [x] `get_screenshot` cached to `figma-cache/204-1714-screenshot.json` + `figma-cache/204-1714-screenshot.png`
- [x] Statue image moved right to match Figma geometry (`x=208`, inner offset `34.77%`)
- [x] Removed blur/overlay layer over hero image
- [x] Verification capture saved to `output/playwright/seo-services-hero-fix-1440.png`
