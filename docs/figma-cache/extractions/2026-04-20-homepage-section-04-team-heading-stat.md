# Homepage Team Section: desktop heading and stat

- Date: 2026-04-20
- File key: `7qZIJIngHrkTeaq9nWZkSa`
- Page: Homepage
- Section: Team
- Section label node context: `/ The Team /`

## Extraction 1: Desktop heading

- Figma node: `702:10218`
- Text content: `We stand out by turning search into a measurable revenue engine`
- Coordinates from MCP context: `x=280`, `y=322`, `w=506`, `h=240`
- Typography:
  - Font family: `Clash Display`
  - Weight: `400`
  - Size: `52px`
  - Line height: `60px`
  - Letter spacing: `-1.04px`
  - Color: `#151419`
- Structure from MCP context:
  - Paragraph 1: `We stand out ` + `by turning search into `
  - Paragraph 2: `a measurable revenue engine`
- Screenshot verification notes:
  - Desktop render wraps to four lines.
  - Visual line breaks in Figma screenshot:
    1. `We stand out by`
    2. `turning search into`
    3. `a measurable`
    4. `revenue engine`
- Implementation note:
  - Forced explicit desktop line breaks in `team.tsx` to preserve the exact Figma wrap at the target desktop width.

## Extraction 2: Desktop stat

- Figma node: `702:10226`
- Text content: `20+`
- Coordinates from MCP context: `x=280`, `y=677`, `w=209`, `h=120`
- Typography:
  - Font family: `Clash Display`
  - Weight: `600`
  - Size: `120px`
  - Line height: `100%`
  - Letter spacing: `-2.4px`
  - Fill: `transparent`
- Screenshot verification notes:
  - The stat is not gradient-filled.
  - The visible treatment is a thin purple outline on transparent text.
- Implementation note:
  - Reused the project’s existing outlined-text pattern via transparent fill and `-webkit-text-stroke` with `var(--color-hr-accent)`.

## Verification notes

- Source of truth used:
  - `get_design_context(fileKey="7qZIJIngHrkTeaq9nWZkSa", nodeId="702:10218")`
  - `get_screenshot(fileKey="7qZIJIngHrkTeaq9nWZkSa", nodeId="702:10218")`
  - `get_design_context(fileKey="7qZIJIngHrkTeaq9nWZkSa", nodeId="702:10226")`
  - `get_screenshot(fileKey="7qZIJIngHrkTeaq9nWZkSa", nodeId="702:10226")`
- Expected desktop outcome after patch:
  - Team heading lines match the Figma screenshot.
  - `20+` appears as outlined purple text rather than filled gradient text.
