# About Us Page TODO (Desktop Light, Figma 1:1)

## Workflow Lock
- [x] Follow `/Users/pavle/Developer/codex/Heorics/docs/FIGMA_1_TO_1_WORKFLOW.md`
- [x] Enforce section-by-section implementation only
- [x] Enforce local persistence for extraction + assets per section
- [x] Enforce Playwright verification before section close

## Section 01: About Hero (`189:473`, `189:474`, `189:477`, `190:484`, `189:478`)
- [x] Figma nodes confirmed
- [x] `get_design_context` + `get_screenshot` saved locally
- [x] assets downloaded to `public/figma/about-us/hero/`
- [x] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 02: SEO Excellence / Trust block (`190:486`, `190:485`, `191:507`, `192:29`, `191:509`, `191:510`, `191:511`, `191:512`, `191:513`, `197:476`, `197:471`, `197:470`, `197:558`, `192:2`, `193:34`)
- [x] Figma nodes confirmed
- [x] `get_design_context` + `get_screenshot` saved locally
- [x] assets downloaded to `public/figma/about-us/trust/`
- [x] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 03: Process strip (`493:1624`)
- [x] Figma nodes confirmed
- [x] `get_design_context` + `get_screenshot` saved locally
- [x] assets downloaded to `public/figma/about-us/process/`
- [x] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 04: Dark CTA strip (`197:341`, `196:102`, `196:103`, `196:104`)
- [x] Figma nodes confirmed
- [ ] `get_design_context` + `get_screenshot` saved locally
- [ ] assets downloaded to `public/figma/about-us/cta/`
- [ ] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 05: Core Heroes team grid (`196:109`, `659:6567`, `659:6651`, `659:6645`, `659:6646`, `659:6650`, `659:6649`, `659:6648`, `659:6647`)
- [ ] Figma nodes confirmed
- [ ] `get_design_context` + `get_screenshot` saved locally
- [ ] assets downloaded to `public/figma/about-us/team/`
- [ ] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 06: Testimonials heading variant + reuse cards (`197:409`, `197:407`, `197:415`)
- [ ] Figma nodes confirmed
- [ ] `get_design_context` + `get_screenshot` saved locally
- [ ] assets downloaded to `public/figma/about-us/testimonials/` (if new assets required)
- [ ] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 07: Blog heading variant + reuse cards (`197:408`, `197:406`, `197:410`, `774:75`)
- [ ] Figma nodes confirmed
- [ ] `get_design_context` + `get_screenshot` saved locally
- [ ] assets downloaded to `public/figma/about-us/blog/` (if new assets required)
- [ ] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Section 08: Footer About variant (`554:3465`)
- [ ] Figma nodes confirmed
- [ ] `get_design_context` + `get_screenshot` saved locally
- [ ] assets downloaded to `public/figma/about-us/footer/`
- [ ] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete

## Integration + Close-Out Gate
- [ ] Add `/about-us` page route and assemble all sections in exact Figma order
- [ ] Update navbar active state for About Us page
- [ ] Keep homepage intact (no visual regression)
- [ ] Full-page desktop screenshot saved in `output/playwright/`
- [ ] `npm run lint`
- [ ] `npm run build`

## Rate-Limit Fallback Log
- [x] 2026-02-17: Figma MCP rate limit hit while extracting Section 04 (`196:104` screenshot call)
- [x] Continue using saved extraction + local assets and resume unresolved node extraction when quota resets
