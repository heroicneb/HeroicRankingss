# Homepage Section 08 — The Value We Bring copy + CTA

- Date: 2026-04-20
- Figma file key: `7qZIJIngHrkTeaq9nWZkSa`
- Page: Homepage
- Section: The Value We Bring
- Nodes:
  - Heading copy: `702:10221`
  - Right paragraph: `702:10365`
  - CTA: `702:10376`

## Heading Copy (`702:10221`)
- Text style: `H3/Web`
- Font: `DM Sans Regular`
- Font size: `32`
- Tracking: `-2`
- Fill:
  - Base text: `#FFFFFF`
  - Accent text: gradient tokenized in app as brand gradient
- Copy fragments:
  1. `At Heroic Rankings, we offer `
  2. `various partnership`
  3. ` opportunities for businesses and individuals looking to expand their service offerings `
  4. `through our expertise.`
- Visual verification notes:
  - The desktop composition is intentionally art-directed, not natural browser wrapping.
  - `various partnership` sits as its own emphasized phrase near the upper-left copy block.
  - `through our expertise.` is isolated as the final accent line.

## Right Paragraph (`702:10365`)
- Text style: `Paragraph/Web`
- Font: `DM Sans Regular`
- Font size: `18`
- Line height: `24`
- Fill: `#FFFFFF`
- Figma paragraph split:
  1. `Whether you're interested in reselling our services, partnering as an affiliate, or utilizing our white-label options, we provide flexible solutions to meet your needs.`
  2. `Our partnership programs are designed to help you grow your business while delivering exceptional SEO results to your clients.`
- Visual verification notes:
  - This is two distinct paragraphs with visible vertical separation.
  - The current implementation compressed both into one block, which changes rhythm and wrapping.

## CTA (`702:10376`)
- Label: `Become a Partner`
- Border color: `#998AFF`
- Radius: `16`
- Padding: `20px` horizontal, `12px` vertical
- Icon: top-right arrow, approx `10x10`, purple gradient treatment
- Visual verification notes:
  - The arrow is larger and more prominent than the current plain white icon.
  - The button remains outline-only, with a transparent interior.

## Implementation Notes
- Use explicit desktop-only line groups for the left copy to match Figma instead of relying on browser line wrapping.
- Preserve a simpler stacked mobile composition.
- Render the right copy as two paragraph elements with controlled spacing.
- Replace the plain arrow with the project’s gradient decorative arrow icon.
