# Homepage About Copy, Logos, and Hero CTA Extraction

- Date: 2026-04-20
- File key: `7qZIJIngHrkTeaq9nWZkSa`
- Page context: Homepage copy file, about/hero nodes under the homepage frame
- Section nodes:
  - About heading: `702:10231`
  - About body copy: `702:10236`
  - About logos row: `702:10238`
  - Hero CTA: `702:10959`

## Node `702:10231` — About Heading

- Text structure:
  - `A Data-Driven SEO Agency and `
  - gradient text: `Trusted Growth Partner`
- Typography:
  - Font size: `52px`
  - Line height: `60px`
  - Letter spacing: `-1.04px`
- Color:
  - Base text: dark brand text
  - Gradient: brand violet-to-lilac treatment already implemented via shared gradient utility
- Visual wrap observed in Figma screenshot at desktop width:
  - Line 1: `A Data-Driven SEO`
  - Line 2: `Agency and Trusted`
  - Line 3: `Growth Partner`
- Implementation note:
  - Desktop rendering should force the three-line composition above.

## Node `702:10236` — About Body Copy

- Typography:
  - Font size: `18px`
  - Line height: `24px`
- Layout:
  - Three separate paragraph blocks
  - First paragraph bottom margin: `20px`
  - Second paragraph bottom margin: `20px`
- Exact grouped copy:
  1. `Committed to delivering data-driven results and ` + gradient `long-term success for your business.`
  2. `We believe in building strong relationships with our clients, rooted in trust, collaboration, and transparency. Our goal is to craft ` + gradient `strategies that align with your vision, ` + `ensuring growth and success for every business we serve.`
  3. `What drives us? ` + gradient `Seeing our clients achieve their goals` + ` and thrive in a competitive market. Our team is driven by creativity, dedication, and the hard work to push boundaries in digital marketing.`
- Verification note:
  - Figma screenshot shows clear paragraph separation; previous implementation incorrectly collapsed this into a single paragraph.

## Node `702:10238` — About Logos Row

- Structure:
  - Horizontal flex row of partner/client logos
  - Reduced opacity treatment in Figma: approximately `0.5`
- Visual observation:
  - Logos appear in a dark/grey treatment on the light section background
  - No light-mode variant is visible in the referenced Figma node screenshot
- Implementation note:
  - Homepage about marquee should always render the dark logo sprites instead of theme-switching to light assets.

## Node `702:10959` — Hero CTA

- Text: `Get Started Today`
- Button treatment:
  - Medium weight body/CTA text
  - Border color: `#998AFF`
  - Radius: `16px`
- Verification note:
  - Previous homepage hero CTA label `Book a Strategy Call` did not match the Figma node.

## Applied Verification Notes

- Updated homepage About heading to match the observed three-line desktop wrap.
- Split About body content into three paragraphs with `20px` separation on the first two blocks.
- Forced the About logo marquee to use dark logo sprites across themes to match the referenced Figma row.
- Updated the hero CTA label to `Get Started Today`.
