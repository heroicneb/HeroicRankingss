# Trust Authority Rail Extraction

- Date: 2026-04-20
- Figma file key: `7qZIJIngHrkTeaq9nWZkSa`
- Page node: homepage composition
- Section node: `767:2741`
- Overlay nodes: `767:3080`, `767:3079`
- Target component: `src/components/sections/trust-authority-rail.tsx`

## Layout
- Rail viewport width: `670px`
- Rail rendered as `4` columns
- Card size: `160px x 100px`
- Column gap: `10px`
- Vertical gap between cards: `10px`
- Visible desktop presentation shows a constrained viewport with top and bottom fade masks
- User requirement for implementation pass: preserve `4` visible rows in the rail instead of an unconstrained animated marquee

## Card styling
- Card background: white
- Card border: `1px` light gray
- Radius: `20px`
- Icon area centered near the top, around `28px`
- Copy color: muted gray
- Typeface: DM Sans
- Text size: `13px`
- Tracking: approximately `-0.26px`

## Visual observations
- Figma screenshot for `767:2741` shows a clipped badge rail, not a free-scrolling list
- Four columns remain visible simultaneously
- Content is vertically staggered by column
- Top and bottom white gradient overlays soften the crop
- Main mismatch in implementation before patch: infinite animated tracks caused too many visible rows and broken alignment

## Verification notes
- `get_design_context` used for nodes `767:2741`, `767:3080`, `767:3079`
- `get_screenshot` used for node `767:2741`
- Patch strategy: remove infinite motion, render fixed column stacks, keep constrained viewport and fade overlays
