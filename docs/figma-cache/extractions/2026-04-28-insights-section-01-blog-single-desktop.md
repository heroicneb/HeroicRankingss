# Insights Blog Single Page — Desktop

## Source

- **Figma file key:** `LrfQdM6RTwf95gfkga3tJl` (separate file from main `7qZIJIngHrkTeaq9nWZkSa`)
- **Figma file name:** Heroic Rankings - Website (Copy)
- **Section node ID:** `2339:27`
- **URL:** https://www.figma.com/design/LrfQdM6RTwf95gfkga3tJl/Heroic-Rankings---Website--Copy-?node-id=2339-27&m=dev
- **Extracted:** 2026-04-28
- **Mobile variant:** **NOT YET CAPTURED** — needs separate Figma URL from Pavle/Nebojša
- **Sample article in design:** "Market Research Made Simple: A Practical Guide to Exploring New Opportunities" by Nebojsa Jankovic / Category: SEO

## Layout overview (desktop, full-width 1440)

Single article view with sticky TOC + author card on the left, hero image + body on the right. Standard navbar at top, footer at bottom.

### Section map (top → bottom)

1. **Navbar** (`2339:28`) — `Insights` pill active (dark `#151419` background)
2. **Article header** (`2339:67` left-aligned, w-1280):
   - Byline (`2339:70`): `by` (regular) + `Nebojsa Jankovic` (bold) + gradient bullet `·` + `in` (regular) + `SEO` (bold) — 18/24
   - H1 gradient title (`2339:71`): full gradient applied to entire title text, 62/80, tracking -1.24, max-w-1280 (wraps to 2-3 lines depending on length)
   - **AI Summary pills row** (`2339:72`):
     - "Get summary" label, 18/24 dark
     - 5 outlined pills with `#998aff` border, rounded-[20px], py-6 px-14, text 14: `ChatGPT`, `Preplexity` (sic — typo in Figma), `Claude`, `Google AI Mode`, `Grok`
3. **Divider line** (`2339:85`) — 1px full-width
4. **Two-column body** (`2339:86`):
   - **Left column (305 wide)** — sticky:
     - **Table of Contents** (`2339:89`) stacked pills, w-305, gap-10:
       - First item: dark `#151419` background, light `#f4f4f4` text — currently-active item indicator
       - Subsequent items: `#f4f4f4` background, `#535353` grey text
       - 7 TOC items in this sample: "Define Your Buyer Persona", "Conduct Market and Competitor Analysis", "Choose Between Primary and Secondary Research", "Analyze and Interpret Data", "Use Market Research Tools and Automation", "Wrap Up", "Frequently Asked Questions (FAQ)"
     - **Author card** (`2339:106`) — bordered `#e0e0e0`, rounded-[40px], w-305:
       - Photo: 305×305 square, rounded-[40px] top corners
       - Name: 24/medium, tracking -0.48, dark
       - Role: `/  Founder & CEO  /` 18/24 grey
       - Bio: 18/24 grey
       - **LinkedIn FAB** (`2339:113`): white circle, size 72, positioned absolute top-right of card (over photo), with LinkedIn icon centered
   - **Right column (933 wide)**:
     - Hero image (`2339:122`): 933×466.5, rounded-[30px]
     - Body content (`2339:123`): 18/24 paragraphs, dark text, plenty of vertical breathing
       - Inline links: bold gradient text with no underline OR plain underline (depends on emphasis)
       - Bulleted lists: standard list-disc with mb-5 between items
       - Headings within body: not visible in this sample (all H2-equivalents are paragraph-level)
5. **Share bar** (`2339:159`) at end of right column:
   - Divider line (`2339:158`)
   - "Share this article" 24/medium dark
   - 3 share pills (LinkedIn, X, Facebook) `#f4f4f4` bg, dark text
   - Right-aligned: link icon + "Copy link to article" 16/medium dark
6. **Footer CTA panel** (`2339:124`) — same dark `#151419` panel pattern as case study + podcast pages with "/ Start Scaling /" + "Ready to Elevate Your Online Presence?" + "Get Started Today" outlined button

## Tokens used

All existing project tokens. **No new tokens required.**

| Figma name | Hex | Token |
|---|---|---|
| HR Dark | `#151419` | `var(--color-hr-dark)` |
| HR Off White | `#F4F4F4` | `var(--color-hr-off-white)` |
| HR Light Grey | `#E0E0E0` | `var(--color-hr-light-grey)` |
| HR Grey | `#535353` | `var(--color-hr-grey)` |
| HR Pure White | `#FFFFFF` | `var(--color-hr-pure-white)` |
| HR Accent (purple border) | `#998AFF` | `var(--color-hr-accent)` |
| HR Gradient | matches existing | `gradient-text-brand-*` |

## Typography

| Style | Font / Size | Use |
|---|---|---|
| H1 / Web | DM Sans Regular 62 / 80, tracking -1.24 | Article title (full gradient) |
| Team & Testimonials | DM Sans Medium 24, tracking -0.48 | "Share this article", author name |
| Paragraph / Web | DM Sans Regular 18 / 24 | Body, byline, bio |
| CTA / Web | DM Sans Medium 16 | Share pills, copy link |
| 14px regular | DM Sans Regular 14 | TOC pills, AI summary pills |
| Footer | DM Sans Regular 14 | Footer rows |

## Required Sanity fields (existing `post` schema)

The existing `post` schema covers everything except the AI summary feature (which is a UI-level deep-link, no data needed). Mapping:

| Field on page | Sanity `post` field | Notes |
|---|---|---|
| Article title | `title` (full gradient on detail render) | |
| Author byline | `author->name` + `categories[0]` | "by {author.name} · in {categories[0]}" |
| H1 wraps to 2-3 lines | `title` | rendered with full HR Gradient — **different from existing pages** which use selective gradient on substring |
| Hero image | `mainImage` | 933×466.5 → use Sanity image transform `width(1866).height(932)` for retina |
| Body paragraphs / lists / inline links | `body` (portableText) | rendered via custom serializers in `src/sanity/lib/portable-text-components.tsx` |
| TOC items | derived from `body` H2 blocks at render time | client-side scroll-spy required for active state |
| Author photo | `author->photo` (resolved ref) | rounded-[40px] crop |
| Author name | `author->name` | 24/medium |
| Author role | `author->role` | 18/24 |
| Author bio | `author->bio` | 18/24 |
| Author LinkedIn FAB | `author->linkedinUrl` (NEW field on teamMember) | actually `teamMember.linkedin` already exists per the data shape |
| Share buttons | derived from current URL + post title | client-side share intents |

## New Sanity work (minor)

- The existing `teamMember` schema already has the fields needed for the author card (photo, name, role, bioParagraphs, linkedin). No schema changes.
- AI summary pills: 5 deep-link templates added as a constant in `src/data/ai-summary-pills.ts` — each pill is a URL that opens the corresponding AI tool with a "Summarize this article: {URL}" pre-fill.

## AI summary deep-link patterns (research-grounded — verify URLs work in 2026)

Each pill, on click, opens a new tab to the AI tool with the article URL passed as initial prompt. Patterns to test:

```ts
const aiSummaryLinks = (articleUrl: string, articleTitle: string) => {
  const prompt = `Please summarize this article: ${articleUrl}`;
  const encodedPrompt = encodeURIComponent(prompt);
  return [
    { label: "ChatGPT",       url: `https://chat.openai.com/?q=${encodedPrompt}` },
    { label: "Perplexity",    url: `https://www.perplexity.ai/?q=${encodedPrompt}` },
    { label: "Claude",        url: `https://claude.ai/new?q=${encodedPrompt}` },
    { label: "Google AI Mode", url: `https://www.google.com/search?udm=50&q=${encodedPrompt}` }, // udm=50 = AI Mode
    { label: "Grok",          url: `https://grok.com/?q=${encodedPrompt}` },
  ];
};
```

Verify each URL works in 2026 — some may require different param names (`prompt=`, `query=`, etc.). Smoke-test during PR 4 implementation.

## Verification notes

- ✅ All tokens map to existing project variables — no globals.css changes
- ⚠️ Full-gradient H1 is different from selective-substring gradient pattern used on case study + podcast pages. Implement as a single GradientText wrap rather than the two-tone TwoToneHeading pattern
- ⚠️ TOC client-side scroll-spy: needs `IntersectionObserver` watching H2/H3 blocks within the body. Active item: dark bg + white text; others: off-white bg + grey text. Reduced-motion friendly (no smooth-scroll if user prefers reduced motion)
- ⚠️ Body rendering: existing `portable-text-components.tsx` (planned in PR 4) needs to handle inline gradient links + plain-underlined links + bullet lists — extra serializers vs the basic version
- ⚠️ "Preplexity" typo in Figma label is corrected to "Perplexity" in code
- ⚠️ AI deep-link URLs need real verification before launch — Pavle/Nebojša confirm targets
- ⚠️ Mobile variant not yet captured. Pattern likely follows podcast/case study mobile: single column, TOC collapses to a select dropdown OR inline list at top, author card below body
