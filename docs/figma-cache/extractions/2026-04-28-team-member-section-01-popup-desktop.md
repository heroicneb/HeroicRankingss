# Team Member Single — Pop Up (Desktop)

## Source

- **Figma file key:** `7qZIJIngHrkTeaq9nWZkSa`
- **Figma file name:** Heroic Rankings - Website (Copy)
- **Page node:** (parent page — not yet captured separately)
- **Section node ID:** `197:891`
- **URL:** https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=197-891&m=dev
- **Extracted:** 2026-04-28
- **Tool:** `mcp__plugin_figma_figma__get_design_context`

## Layout overview

Full-bleed off-white modal panel with rounded `40px` corners. Two-column information layout on the left (~75% width) plus a tall photo card on the right (~25%, 305px wide) carrying a glass-effect contact overlay at the bottom. Header has top-right `Close` link. Footer has bottom-left `Previous` and bottom-right `Next` arrows for sibling-member navigation.

### Coordinate map (relative to popup root)

| Node | Position | Size | Purpose |
|------|----------|------|---------|
| `197:935` Subtitle "/ Founder & CEO /" | left 80, top 129 | w 162 | Section label, 18/24 |
| `197:934` Name "Nebojša Janković" | left 80, top 173 | w 480 | Hero, 62/80 with HR Gradient |
| `199:1350` Divider line | left 80, top 293 | w 867, h 0 (1px raster) | Splits header from body |
| `199:1237` Body col 1 (2 paragraphs) | left 80, top 393 | w 413 | 18/24 |
| `199:1348` Body col 2 (2 paragraphs) | calc(33.33%+56), top 393 | w 414 | 18/24 |
| `199:1300` Photo background | calc(75%-25), top 129 | 305 × 642 | rounded-[40px], grey fill `#A9A9A9` under photo |
| `199:1297` Photo border | same | same | 1px `#E0E0E0` border |
| `199:1331` Glass contact tile | calc(75%-18), top 424 | w 291 | Glass overlay anchored bottom-of-photo |
| `199:1275` Pill: phone | inside tile | h 27, px 14, py 6 | "no phone" placeholder, off-white pill |
| `199:1276` Pill: email | inside tile | full-width | "info@heroicrankings.com" |
| `199:1277` Pill: Instagram | inside tile | h 27 | |
| `199:1278` Pill: LinkedIn | inside tile | h 27 | |
| `199:1279` Pill: X | inside tile | h 27 | |
| `199:1317` "Save to Contacts" button | inside tile | full-width | 1px white border, rounded-[16px] |
| `199:1347` "Close" link | calc(91.67%-7), top 40 | nowrap | 18/24 grey |
| `203:1351` "Next" link | calc(91.67%-16), top 836 | nowrap | 18/24 with right-arrow vector |
| `203:1358` "Previous" link | left 97, top 836 | nowrap | 18/24 grey with left-arrow (vector flipped) |

## Tokens used

| Figma name | Hex | Project token (existing) |
|---|---|---|
| HR Off White | `#F4F4F4` | `var(--color-hr-off-white)` ✅ |
| HR Dark | `#151419` | `var(--color-hr-dark)` ✅ |
| HR Light Grey | `#E0E0E0` | `var(--color-hr-light-grey)` ✅ |
| HR Grey | `#535353` | `var(--color-hr-grey)` ✅ |
| HR Gradient | `linear-gradient(205.65deg, rgb(153,138,255) 18.30%, rgb(153,86,175) 40.66%, rgb(42,34,96) 129.53%)` | matches existing `gradient-text-brand-*` pattern (verify exact angle vs existing classes — about-us-trust-title gradient is closest) |
| Glass effect | type=GLASS, radius=12 | New — see "Glass tile" below |

### Glass tile background (199:1331 — contact overlay)

Two stacked linear gradients:
1. `linear-gradient(180deg, rgba(32,32,32,0) 0%, rgba(32,32,32,0.15) 100%)`
2. `linear-gradient(90deg, rgba(32,32,32,0.24) 0%, rgba(32,32,32,0.24) 100%)` — flat 24% black tint

Combined effect = a slightly darkened glassy panel that sits over the photo. The glass effect probably applies a backdrop-blur (radius 12) which is not encoded in the gradients alone — `backdrop-filter: blur(12px)` should be added on the actual element.

## Typography

- **Subtitle label**: DM Sans Regular, 18 / 24 line-height, color `#151419`
- **Name (hero)**: DM Sans Regular, 62 / 80 line-height, tracking `-1.24px`, fill = HR Gradient (text-clipped)
- **Body paragraphs**: DM Sans Regular, 18 / 24, color `#151419`, paragraph-bottom margin 20px
- **Pills (light)**: DM Sans Regular, 18 / 27 (or 18 / 24 for email), color `#151419`, on `#F4F4F4` pill bg
- **Save to Contacts button**: DM Sans Medium, 16, color `#F4F4F4`, 1px white border (over the dark glass)
- **Close / Previous / Next**: DM Sans Regular, 18 / 24, color `#151419` (Close, Next) or `#535353` (Previous)

`fontVariationSettings: 'opsz' 14` is set on every text node — preserves DM Sans optical-size axis used elsewhere on the site.

## Existing components in the project to reuse / replace

| Existing | Status |
|---|---|
| `src/components/sections/team-member-popup.tsx` | Current popup component — needs rebuild to match this design (different layout from current implementation). Currently dialog with focus trap, keyboard handling — keep that wiring. |
| `src/components/sections/about-us-team-popup-controller.tsx` | Hash-driven open/close, prev/next member transitions — wire to "Next"/"Previous" arrows here. |
| `src/components/sections/about-us-team-data.ts` | Currently only Nebojša populated. Will be replaced by Sanity-driven `teamMember` documents (already defined schema). |

## Required Sanity fields (to populate from `teamMember` schema)

The existing `teamMember` schema covers everything this popup needs:

- `name` → Hero name (197:934)
- `role` → Subtitle (197:935)
- `bioParagraphs[]` → Two-column body (199:1237 + 199:1348). Need 4 paragraphs to fill cleanly. Schema field is text[] — split between cols by index.
- `cardImage` → Photo (199:1300)
- `contact.phone` → Phone pill (199:1241), with placeholder "no phone" when empty
- `contact.email` → Email pill (199:1243)
- `socialLinks[]` (Instagram / X / LinkedIn) → Social pills (199:1250 / 1257 / 1259)
- "Save to Contacts" button — generates a vCard from contact + socials (new feature)

## Verification notes

- ✅ Photo card rendered correctly with grey fill behind for transparent / missing photo states.
- ⚠️ "Next" / "Previous" labels position slightly offset — `Next` is at `calc(91.67%-16px)` (text) but its arrow is at `inset-[93.44%_5.56%_5%_93.96%]`. Implement as flex pair with right-aligned + left-aligned containers, ignore exact pixel offset.
- ⚠️ Body text wraps in 2 columns at this width (~867px). On narrower viewport (<1024px), reflow to single column.
- ✅ Tokens map cleanly to existing project variables — no new color values needed.
- ⚠️ `fontVariationSettings: 'opsz' 14` not currently applied site-wide. Confirm if this is desired here or globally — easiest path: add to `body` selector in `globals.css`.
- ⚠️ Glass tile uses `backdrop-filter: blur(12px)` (not encoded in the get_design_context output but implied by Figma's "Glass" effect type) — verify against actual Figma render via `get_screenshot`. Screenshot rendering matches glass-blur expectation.
