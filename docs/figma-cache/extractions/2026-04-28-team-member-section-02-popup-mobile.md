# Team Member Single — Pop Up (Mobile)

## Source

- **Figma file key:** `7qZIJIngHrkTeaq9nWZkSa`
- **Figma file name:** Heroic Rankings - Website (Copy)
- **Section node ID:** `672:4109`
- **URL:** https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=672-4109&m=dev
- **Extracted:** 2026-04-28
- **Tool:** `mcp__plugin_figma_figma__get_design_context`

## Layout overview

Single-column vertically stacked sheet, 20px border radius, padded (`px-15 py-20`). Header band: prev arrow / `Close` / next arrow. Centered photo (`126.432 × 126.432`, rounded-[30px]). Subtitle + gradient name. Single-column body (4 paragraphs). Footer: dark pills cluster (phone / email / Instagram + X + LinkedIn row) plus outlined "Save to Contacts" button.

### Stacking order (top → bottom, all centered)

1. **Header row** (`673:28`) — `flex items-center justify-between` full width:
   - Left: rotated 180° arrow vector (`673:24`, 14×7)
   - Center: "Close" label (`673:23`, 18/24, `#151419`)
   - Right: arrow vector (`673:26`, 14×7)
2. **Photo** (`673:3`) — 126.432 × 126.432, rounded-[30px], grey fill `#A9A9A9` under image
3. **Subtitle / name block** (`672:4113`):
   - "/ Founder & CEO /" — 18/normal, tracking -0.36px, `#151419`
   - "Nebojša Janković" — 28/1.2, tracking -0.56px, HR Gradient (clipped) — note **smaller than desktop's 62**
4. **Body** (`672:4117`) — 16/1.2, centered, max width 254, `#151419`. Same 4 paragraphs as desktop. Each paragraph `mb-[10px]`.
5. **Pills cluster** (`673:7`) — width 240, gap 10:
   - Phone pill (`673:8`) — dark `#151419` bg, light `#F4F4F4` text, "+381 60 123 4567" placeholder
   - Email pill (`673:10`) — full-width, dark bg
   - Social row (`673:21`) — three pills side-by-side: Instagram / X / LinkedIn
6. **Save to Contacts** (`673:18`) — width 251, 1px `#151419` border, rounded-[16px], DM Sans Medium 16 dark text — outlined dark variant (different from desktop's white-border-on-glass)

## Tokens used

Same as desktop. No new tokens.

## Differences vs Desktop (197:891)

| Aspect | Desktop | Mobile |
|---|---|---|
| Container radius | 40px | 20px |
| Layout | 2-column body + side photo card | Single column, photo on top |
| Photo size | 305 × 642 | 126.432 × 126.432 (square thumbnail) |
| Photo position | Right column with glass overlay | Top, centered |
| Name size | 62 / 80 | 28 / 1.2 |
| Subtitle position | Above name | Above name (under photo) |
| Pills bg | Off-white `#F4F4F4` (light pills on glass) | Dark `#151419` (filled dark pills) |
| Pill text color | `#151419` | `#F4F4F4` |
| "Save to Contacts" | White border on glass tile | Dark border on off-white sheet |
| Phone placeholder | "no phone" (label says missing) | "+381 60 123 4567" (mock filled) |
| Navigation | "Previous" / "Next" labels at bottom | Prev / Next arrows in header |

## Required Sanity fields

Identical mapping as desktop — same `teamMember` schema. Layout differences are purely presentational.

## Verification notes

- ✅ Both popups expose the same data — single Sanity query feeds both.
- ⚠️ Mobile photo is square (126.432 × 126.432) vs desktop's tall portrait card (305 × 642). Sanity `cardImage` field must crop to square for mobile and portrait for desktop. Two options:
  - (a) Use Sanity image hotspot + responsive crops via `urlFor(image).width(W).height(H).fit('crop')` with different W/H per viewport.
  - (b) Store one image, let Tailwind `object-cover` handle the crop — relies on hotspot to keep face in frame.
- ⚠️ Phone "+381 60 123 4567" is mock data — actual `contact.phone` may be empty for most members; render conditionally (hide pill if empty) and fall back to "no phone" only as a last resort.
- ✅ Tokens reuse — no new colors.
- ⚠️ `fontVariationSettings: 'opsz' 14` consistent with desktop — apply at root.
