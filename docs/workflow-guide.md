# Figma-to-Code Workflow Guide

> Step-by-step workflow for converting Heroic Rankings Figma design to Next.js code.

---

## Figma File Info

- **URL:** `https://www.figma.com/design/iIVCGkNIrd9sc6j9NKmGIF/Heroic-Rankings---Website--Copy---Copy-`
- **File key:** `iIVCGkNIrd9sc6j9NKmGIF`
- **Homepage frame:** `702:10152` (NOT `1:3` — that's the wrong test frame!)
- **Page size:** 1440x10899px, 13+ sections

---

## Phase 0: Foundation (do once)

### 0.1 Environment
```bash
export MAX_MCP_OUTPUT_TOKENS=100000
```

### 0.2 Design System Rules
```
Run create_design_system_rules for this project.
Save the output to CLAUDE.md under "## Figma MCP server rules"
```

### 0.3 Design Tokens
```
Run get_variable_defs on the homepage frame (node 702:10152).
Extract all colors, typography, spacing, radius tokens.
Convert to Tailwind v4 @theme block in src/app/globals.css.
```

### 0.4 Shared Components
Build these BEFORE any sections:
- `Button.tsx` — variants: gradient, outline, pill
- `SectionLabel.tsx` — "/ Label /" pattern
- `Container.tsx` — max-width wrapper
- `GradientText.tsx` — brand gradient

### 0.5 Code Connect
```
Run get_code_connect_suggestions for the file.
Review and confirm mappings with send_code_connect_mappings.
Add any missing mappings with add_code_connect_map.
```

### 0.6 Git Commit
```bash
git add -A && git commit -m "feat: design system foundation — tokens, shared components, Figma rules"
```

---

## Phase 1: Section-by-Section (the main work)

### Golden Rule: ONE SECTION PER CONVERSATION

After each section: `git commit` → `/clear` → start fresh

### Per-Section Template

Copy this prompt for each section, replacing `[SECTION]` and `[NODE_ID]`:

```
Read the CLAUDE.md design system rules first.

Implement the [SECTION] section for the Heroic Rankings homepage.

Figma file: iIVCGkNIrd9sc6j9NKmGIF
Node ID: [NODE_ID]

Steps:
1. get_screenshot to see the visual layout
2. get_design_context to get code/styling data
3. If get_design_context fails (too large), use get_metadata first,
   then fetch child nodes individually
4. Create src/components/sections/[SectionName].tsx
5. Use existing shared components (Button, SectionLabel, Container, GradientText)
6. Use gray placeholder divs for images with correct dimensions
7. Import into src/app/page.tsx
8. Verify it builds: npm run dev
```

### Section Map

| # | Section | Node ID | Prompt Notes |
|---|---------|---------|-------------|
| 1 | Navbar | `702:10162` | Dropdown menu, sticky, logo + nav links + CTA |
| 2 | Hero | `702:10155` | Centered text, one CTA button, statue image |
| 3 | Services | `766:115` | Horizontal scroll cards, 8 services |
| 4 | About | `702:10237` area | 2-column layout, partner logos |
| 5 | Team | `702:10247`, `702:10260` | Staggered cards, team member photos |
| 6 | Stats | `702:10272` | Dark background, stat grid |
| 7 | Featured Logos | `702:10288` | Logo row/grid, simple |
| 8 | Case Studies | `702:10410` | Cards + marquee animation |
| 9 | Certifications | `767:2741` | Animated grid of cert badges |
| 10 | Partnerships | y:7900 area | Logo display, simple |
| 11 | Blog | y:8477 area | 3 blog cards |
| 12 | Testimonials | y:9307 area | 3 testimonial cards |
| 13 | Footer | `803:4113` | CTA section + footer links |

### Visual QA (after each section)

1. Run `npm run dev`
2. Open `localhost:3000`
3. Compare with Figma side-by-side
4. Note specific differences (font size, spacing, colors, layout)
5. Fix issues with specific descriptions

### Fix Prompt Template
```
The [SECTION] section needs fixes:
- [specific issue 1]
- [specific issue 2]
- [specific issue 3]

Check the Figma screenshot again and fix these issues.
Keep using design tokens from globals.css, not hardcoded values.
```

---

## Phase 2: Image Pass

After ALL 13 sections are structurally correct:

1. Export images from Figma (use asset endpoint or manual export)
2. Save to `public/images/`, `public/logos/`, `public/icons/`
3. Replace gray placeholder divs with `<Image>` components
4. Verify all images load and display correctly

---

## Phase 3: Polish

1. **Responsive:** Test at 1440px, 1024px, 768px, 375px
2. **Animations:** framer-motion scroll reveals, marquee effects
3. **Interactions:** Hover states, dropdown menus, focus rings
4. **Accessibility:** Tab navigation, aria-labels, contrast
5. **Performance:** Next.js Image optimization, lazy loading
6. **Full QA:** Complete top-to-bottom comparison with Figma

---

## Critical Rules

1. **NEVER select full page** — individual sections only
2. **`/clear` between EVERY section** — context pollution kills quality
3. **Re-read CLAUDE.md after clear** — re-ground in design system
4. **One section per conversation** — no batching
5. **Gray placeholders** — images come last
6. **Verify frame ID** — `702:10152` is correct, `1:3` is wrong
7. **get_design_context fails?** → `get_metadata` → children individually
8. **YOU are QA** — look at it, compare, describe what's wrong
9. **Use design tokens** — never hardcode colors, spacing, fonts
10. **Reuse shared components** — Button, SectionLabel, Container, GradientText
