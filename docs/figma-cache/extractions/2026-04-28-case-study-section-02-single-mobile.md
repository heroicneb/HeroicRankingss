# Case Study Single Page — Mobile

## Source
- **Figma file key:** `7qZIJIngHrkTeaq9nWZkSa`
- **Section node ID:** `2255:1378`
- **URL:** https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=2255-1378&m=dev
- **Extracted:** 2026-04-28

## Page structure (top → bottom, single column)

Mobile is the same content as desktop reflowed to a vertical stack with smaller typography. Each section is a rounded-[30px] panel with consistent padding.

1. **Navbar** (`2255:1379`) — collapsed: logo + small icons + hamburger menu (`2255:1397`)
2. **Hero** (`2255:1401`) — H1 gradient (38/1.2) two-tone + subtitle + **3 stacked metric tiles** (Months / Revenue / Visitors) full-width on `#F4F4F4` rounded-[20px]
3. **Hero image strip** (`2255:1414`) — 350×255 dark gradient rounded-[30px]
4. **Case Overview** (`2255:1416`) — same content as desktop, centered, H2 28/1.2
5. **Objective & Challenges** (`2255:1420`) — `#F4F4F4` rounded-[30px] panel, H2 28/1.2, 3 numbered cards stacked vertically with horizontal divider lines, all centered
6. **Six Pillars** (`2255:1452`) — section header + body + horizontal scrolling rail of 6 cards (350px wide each, gap 5), each card white rounded-[30px] with icon box + H3 32/1.2 title + intro + bullets — **mobile rail with scroll dots indicator at bottom** (`2255:1535` 51×6 progress bar)
7. **Journey to Success** (`2255:1542`) — `#F4F4F4` panel, header + horizontal scrolling rail of 4 steps; only first step is fully visible, rest are blurred (`blur-[6px]`) suggesting parallax/scroll progress; progress bar indicator
8. **The Numbers That Matter** (`2255:1570`) — `#151419` dark panel rounded-[30px], section label "/ White Label SEO Process /" + H2 with light gradient "Oh, You're Ready To Partner With Us?" / "What's Next..." subhead, body paragraph, then 8 metric cards in horizontal scrolling rail (350px each, gap 5), each card 350×472 `#0C0C0C` with `#2A2A2A` border + 80×80 icon + 80px ExtraBold gradient number + 32px H3 + 18px sub-caption
9. **Growth Trajectory chart** (`2255:1661`) — same dark section, smaller chart sized to mobile (235×312 plot area), legend pills above, axis labels at 13px, callout panel below chart showing DEC25 metrics
10. **Proof Is in the Data** (`2255:1764`) — vertical stack of 6 analytics cards, each 370 wide on `#F4F4F4` rounded-[22px] containing: 340×N image + H3 title + body + metric tag pills stacked vertically full-width
11. **Before vs After** (`2255:1822`) — section label + H2 "Before vs After" + 2 legend pills (Before March 24 / Present) stacked + horizontal rail of 5 stat columns (similar to desktop but in a horizontal scroll)
12. **Conclusion** (`2255:1865`) — `#F4F4F4` rounded-[22px] panel, H3 32/1.2 "Conclusion" black + gradient 22/normal subhead + 18/24 body
13. **Footer CTA** (`2255:1869`) — same dark panel as desktop with start-scaling label + H2 28/1.2 "Ready to Write Your Own Success Story?" + body + 2 stacked full-width buttons (gradient + outlined) + footer rows (fax/email, dividers, social, copyright)

## Differences vs Desktop

| Aspect | Desktop | Mobile |
|---|---|---|
| Container radius | 40px | 30px (most), 20px (hero metric tiles) |
| H1 | 62/80 | 38/1.2 |
| H2 | 52/60 | 28/1.2 |
| H3 | 32/1.2 | 22/normal (some), 32/1.2 (rail cards keep desktop size) |
| Section label | 18 | 16 |
| Body paragraph | 18/24 | 16/1.3 |
| Big metric numbers (ExtraBold gradient) | 80 | **stays 80** on rail cards |
| Six Pillars layout | 3×2 grid | horizontal rail with scroll progress bar |
| Journey timeline | horizontal w/ all 4 visible | rail w/ blur on offscreen items + progress bar |
| Numbers That Matter | 4×2 grid | horizontal rail |
| Proof Data | mixed grid 3×2 + 2×1 full-width | vertical single-column stack |
| Before/After | horizontal row w/ vertical dividers | horizontal scrolling row |

## Mobile-specific patterns to implement

- **Horizontal rail with progress bar** (5 instances on this page): Six Pillars, Journey Timeline, Numbers That Matter, Before/After. Pattern = `overflow-x-auto snap-x snap-mandatory` + dots/bar indicator below
- **Blur fade on offscreen items**: Journey timeline mobile uses `blur-[6px]` on items further from viewport center to suggest scroll progress
- **Stack-as-card pattern**: many cards that were in 3-col grid on desktop become single-column stack on mobile

## Tokens used

Same as desktop. No new tokens required. Note: same `HR Gradient Light` palette appears here for dark-section big numbers.

## Verification notes

- ✅ All sections present and equivalent to desktop content
- ⚠️ 5 horizontal rails — implement as one shared `<MobileRail>` component (similar to existing `seo-services-mobile-services-rail.tsx`, `keyword-strategy-mobile-solutions-rail.tsx` patterns) to avoid duplication
- ⚠️ Blur-on-offscreen pattern is novel for this project — will need IntersectionObserver-driven CSS variable for blur radius per item
- ⚠️ Sanity-driven content must be the **same data** as desktop — only presentation differs
