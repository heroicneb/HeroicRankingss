# Homepage Section 05 — Stats And Featured Headings

- Date: 2026-04-20
- File key: `7qZIJIngHrkTeaq9nWZkSa`
- Page node: homepage composition in `Heroic Rankings - Website (Copy)`
- Section nodes:
  - Stats heading: `702:10219`
  - Featured logos heading: `702:10348`

## Stats Heading

- Node ID: `702:10219`
- Purpose: dark "Guided by Data" section primary desktop heading
- Text:
  - `Proven Success Through`
  - `Data-Driven`
  - `SEO Strategies`
- Typography:
  - Style: `H2/Web`
  - Font size: `52px`
  - Line height: `60px`
  - Weight: `400`
  - Letter spacing: approximately `-2`
- Color:
  - Base text: white
  - Gradient emphasis: brand gradient on `Data-Driven`
- Visual observations from Figma screenshot:
  - Heading is presented as a compact three-line stack on desktop.
  - Gradient applies only to `Data-Driven`.
  - `SEO` remains on the second row, with `Strategies` alone on the third row.
- Verification notes:
  - Implemented explicit desktop line breaks to preserve the Figma row structure regardless of browser wrapping variance.

## Featured Logos Heading

- Node ID: `702:10348`
- Purpose: heading above the featured publication logos strip
- Text: `Featured and Recognized by Industry Leaders`
- Typography:
  - Style: `H3/Web`
  - Font size: `32px`
  - Line height: `100%`
  - Weight: `400`
  - Letter spacing: approximately `-2`
- Color:
  - Base text: white
  - Gradient emphasis: brand gradient on `Recognized` and `Industry Leaders`
- Layout observations:
  - Heading sits centered above the bordered logo rail.
  - Gradient spans need full descender/baseline room inside the line box.
- Verification notes:
  - Added inline-block gradient span padding and heading bottom room to prevent baseline clipping visible in local browser rendering.
