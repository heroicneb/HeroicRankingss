# Insights Blog Single Page — Mobile

## Source

- **Figma file key:** `LrfQdM6RTwf95gfkga3tJl`
- **Section node ID:** `2339:195`
- **URL:** https://www.figma.com/design/LrfQdM6RTwf95gfkga3tJl/Heroic-Rankings---Website--Copy-?node-id=2339-195
- **Extracted:** 2026-04-28

## Layout overview (mobile, ~390 wide rounded panel)

Single-column stack. Container is itself rounded-[15px] with 5px padding (mobile-card pattern matching case study + podcast mobile frames).

### Stacking order

1. **Navbar** (`2339:196`) — collapsed: logo + small icons + hamburger menu
2. **Article header block** (`2339:218`) — centered:
   - Byline (`2339:221`) 16/normal, tracking -0.32, centered, w-294: `by **Nebojsa Jankovic** · in **SEO**`
   - H1 gradient (`2339:222`) — full gradient applied to entire title, **38/1.2**, tracking -0.76, centered, w-294
   - **"Get summary" dropdown** (`2339:223`) — collapsed dropdown card, w-350, white bg with `#e0e0e0` border, rounded-[16px]: "Get summary" label left + chevron right (`imgVector`). On tap, expands to show 5 AI engine pills (ChatGPT, Perplexity, Claude, Google AI Mode, Grok). Different from desktop where pills render inline.
   - Divider line (`2339:227`) full-width
3. **Body block** (`2339:228`):
   - Hero image (`2339:229`): 350×175, rounded-[20px]
   - Body paragraphs (`2339:230`): **16/1.3 centered** body text, max-w-350, dark
   - Divider (`2339:231`) full-width
4. **Share bar** (`2339:233`) — centered:
   - "Share this article" 16/1.3
   - 3 share pills (LinkedIn / X / Facebook) on `#f4f4f4` bg
   - "Copy link to article" pill on `#f5f5f5` bg, rounded-[30px]
5. **Author card** (`2339:248`) — w-350:
   - "Author" label centered, 24/medium, tracking -0.48
   - Card with `#e0e0e0` border, rounded-[40px]:
     - Photo: 350×350 square, rounded-[40px]
     - Name 24/medium dark
     - Role: `/  Founder & CEO  /` 18/24 grey
     - Bio: 18/24 grey
     - LinkedIn FAB (`2339:257`): white circle 72×72, positioned absolute top-right of card (over photo edge)
6. **Footer CTA** (`2339:265`) — same dark `#151419` panel pattern as other mobile pages

## Differences vs Desktop

| Aspect | Desktop | Mobile |
|---|---|---|
| Container radius | full-bleed | 15px outer container, 30px inner panels |
| Layout | 2-column (TOC sidebar + body) | single-column |
| **TOC** | 7 stacked pills with active highlight | **dropped on mobile** (no TOC visible — body flows continuously) |
| H1 | 62/80 full gradient | 38/1.2 full gradient (smaller) |
| Body text | 18/24 left-aligned | 16/1.3 **center-aligned** |
| Hero image | 933×466 right column | 350×175 full-width below header |
| Get summary | inline label + 5 outlined pills | **collapsed dropdown** with chevron — pills appear on tap |
| Share | inline row, right-aligned copy-link | stacked centered, copy-link as separate pill |
| Author card | left column, beneath TOC, 305 wide | bottom of page, 350 wide, same internal layout |
| Author bio text | 18/24 grey | 18/24 grey (kept desktop-size on mobile) |

## Tokens used

Same as desktop. **No new tokens required.**

## Typography

- **H1 mobile**: DM Sans Regular 38 / 1.2, tracking -0.76 (mobile variant of desktop's 62/80)
- **H2 mobile**: DM Sans Regular 28 / 1.2, tracking -0.56 (would apply to body H2 if present)
- **H3 mobile**: DM Sans Regular 22 / normal, tracking -0.44
- **Paragraph mobile**: DM Sans Regular 16 / 1.3
- **Section Title mobile**: DM Sans Regular 16 / 100, tracking -0.32

## Required Sanity fields

Same as desktop — single `post` document drives both layouts. Layout differences are purely presentational.

## Implementation notes

- **TOC removed on mobile** — when `(max-width: 1023px)` the TOC sidebar is hidden. No mobile equivalent rail/dropdown for it.
- **Get summary dropdown** is a controlled `<details>` or click-toggle div. On open, reveals the 5 AI pills inside the same card or in a popover below.
- **Body text centered on mobile vs left-aligned on desktop** — apply `text-center` only at mobile breakpoint (`text-left lg:text-left text-center` won't conflict; actually use `text-center lg:text-left` since mobile is default).
- **AI pills**: same 5 deep-link patterns from the desktop extraction — wrapped in the dropdown UI on mobile.
- Consistent with podcast/case study mobile patterns: 30px rounded panels, dark footer block at bottom with stacked links.

## Verification notes

- ✅ Same `post` schema fields cover both layouts
- ⚠️ TOC absent on mobile — confirm with Pavle if that's intentional (might want a "jump to section" select dropdown for accessibility) or just a Figma omission
- ⚠️ AI pills inside dropdown is tap-revealed — slight UX cost; consider tap-to-open with auto-focus on first pill
- ⚠️ Body centered on mobile — unusual editorial choice but matches Figma. If readability concerns arise during stress test, propose left-align as a tweak
