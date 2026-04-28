# Podcast Episode Single Page — Mobile

## Source
- **Figma file key:** `7qZIJIngHrkTeaq9nWZkSa`
- **Section node ID:** `2223:723`
- **URL:** https://www.figma.com/design/7qZIJIngHrkTeaq9nWZkSa/Heroic-Rankings---Website--Copy-?node-id=2223-723&m=dev
- **Extracted:** 2026-04-28
- **Note:** Pavle initially labeled this as "blog post single mobile" but extraction confirms it's the **podcast episode single** mobile design (same content as desktop 2223:49). Blog post designs are still pending.

## Page structure (top → bottom, single column)

Mobile is full content reflow of desktop into a vertical stack of `rounded-[30px]` panels with mobile-scaled typography.

1. **Navbar** (`2223:724`) — collapsed: logo + small group + hamburger menu (`2223:742`)
2. **Hero** (`2223:746`) — vertical stack:
   - EP•9 / 1h 44min pills (centered)
   - H1 gradient mixed 38/1.2 "Marketing That Actually Works"
   - "with **Trevor Longino** • Founder, CrowdTamers" caption (mixed gradient bold + black)
   - 304-wide centered body paragraph
   - 350×197 hero thumbnail with overlay play button (38×29.5)
3. **Key Insights panel** (`2223:761`) — `#F4F4F4` rounded-[40px], 380 wide, padding 60×15:
   - H2 mixed gradient + black "25 Years of Marketing Lessons, Compressed Into One Conversation" 28/1.2 centered
   - 300-wide body paragraph
   - "Ask Podcast AI" outlined button (centered)
   - 4 stacked dark `#0C0C0C` topic pills with `Medium` 16 white text (full-width)
   - 7 stacked insight cards, each full-width `#F4F4F4` with `#E0E0E0` border, rounded-[20px], padding 12 — body 16/1.3 centered
   - **Best Moments card** at bottom: white shadow card, padding 60×15:
     - H2 mixed gradient + black "Best Moments From This Episode" 28/1.2 centered
     - body
     - 3 stacked reel thumbnails 320×320 each, rounded-[20px] with play overlay vectors (38×29.5)
4. **Full Episode Transcript** (`2223:807`) — `#151419` dark panel rounded-[40px], 380 wide, padding 60×20:
   - section label "/ Full Episode Transcript /" white centered
   - transcript card on `#151419` with `#2A2A2A` border, rounded-[40px], padding 20: bold "Nebojsa:" prefix + body
   - "Read Full Transcript" with arrow
   - "Share this podcast" 16 white centered
   - 3 share pills (LinkedIn / X / Facebook) on `#F4F4F4` light bg
   - "Copy link to podcast" with link icon
5. **More From The Podcast** (`2223:829`) — vertical stack of 3 episode cards, each 350-wide, rounded-[40px]:
   - **Image area** 305 tall: episode thumbnail with EP•14 / duration pills overlay + larger circular play overlay (66×66 white bg)
   - **Body area** 195 tall: H3 22/normal title + "with **Guest Name**" gradient bold caption + 16/1.3 body + "Ask AI" outlined small button with sparkle icon
   - Sample episodes (matching desktop): Organic Growth (Jason Rivera) / SEO, AEO & AI Growth (Sara Miller) / SEO Wind (Tom Winter)
6. **Final CTA Footer** (`2223:903`) — same dark `#151419` panel as desktop but mobile-stacked:
   - "/ Start Scaling /" label centered
   - H2 mixed white + light gradient "Ready to Elevate Your Online Presence?" 28/1.2
   - body
   - full-width outlined "Get Started Today" button
   - footer rows (fax/email stacked, dividers, social pills, copyright)

## Differences vs Desktop

| Aspect | Desktop | Mobile |
|---|---|---|
| Container radius | 40px | 30px / 40px (transcript panel keeps 40 since it's the "main" surface) |
| H1 | 62/80 | 38/1.2 |
| H2 | 52/60 | 28/1.2 |
| H3 | 32/1.2 | 22/normal |
| Body | 18/24 | 16/1.3 |
| Hero layout | 2-column (text + image) | stacked (text → image) |
| Insights | 2-col (left header + right cards) | single-column stack |
| Best Moments | row of 3 thumbnails (197px each) | stack of 3 thumbnails (320px each) |
| Episode cards in More From | 3-col grid 413 wide | vertical stack 350 wide |
| Episode card image height | 305 (top of card) | 305 (full-width inside card) |
| Share row | inline with transcript header right-aligned | stacked below transcript |

## Tokens & Typography

Same as desktop podcast extraction. Mobile-specific type scales (H1/Mobile 38, H2/Mobile 28, H3/Mobile 22, Section Title/Mobile 16, Paragraph/Mobile 16/1.3) are already documented in design system.

## Verification notes

- ✅ Same Sanity data fields cover desktop + mobile — purely presentational difference
- ⚠️ "Best Moments" mobile thumbnails are noticeably larger (320px) than desktop (197px) — better engagement on mobile
- ⚠️ Share pills lighter color on mobile vs desktop (both use `#F4F4F4` per spec)
- ⚠️ Mobile hero play-button is smaller (38×29.5) — extract as small SVG or scale via CSS
