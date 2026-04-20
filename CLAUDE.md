# Heroic Rankings Engineering Notes

## Figma MCP server rules

### Stack and project conventions
- Framework: Next.js App Router with TypeScript under `src/`.
- Styling: Tailwind CSS v4 with shared tokens in `src/app/globals.css`.
- Components: reusable primitives under `src/components/ui` and layout wrappers under `src/components/layout`.
- Sections: homepage blocks under `src/components/sections` and composed from `src/app/page.tsx`.
- Utilities: keep simple helpers in `src/lib`.

### Token and styling rules
- Define and maintain all visual constants in `:root` and `@theme` inside `src/app/globals.css`.
- Token naming is deterministic:
  - Colors: `--color-*`
  - Typography: `--font-*`, `--font-size-*`, `--line-*`
  - Spacing and sizes: `--space-*`, `--size-*`
  - Radius and shadow: `--radius-*`, `--shadow-*`
- Components must consume tokenized values only (no raw hex values in component files).
- Use global typography utility classes (`.type-h1`, `.type-h2`, `.type-paragraph`, etc.) for consistency.

### Component authoring rules
- Shared UI primitives should be used before creating section-specific styles:
  - `Button`, `SectionLabel`, `GradientText`, `Container`.
- Prefer data arrays and typed section models for repeated cards/links.
- Keep section components focused and semantic (`section`, `nav`, `header`, `footer`).
- Include accessible interaction patterns for menu/dropdown behavior and keyboard navigation.

### Asset handling and placeholders
- During foundation and section build passes, use neutral placeholders for images/logos with exact frame dimensions from Figma.
- Use real image assets only in a dedicated image pass.

### Figma extraction caching (MANDATORY)
- **Every** Figma MCP call (`get_design_context`, `get_screenshot`, `get_metadata`) MUST be cached to `docs/figma-cache/extractions/`.
- File naming: `YYYY-MM-DD-<page>-section-<NN>-<name>.md` (e.g. `2026-02-17-about-us-section-04-cta.md`).
- Each extraction doc MUST include: file key, page node, section node IDs, layout coordinates, typography + color specs, and verification notes.
- Screenshots from `get_screenshot` cannot be saved as files (inline images). Instead, document the node ID and visual observations in the extraction doc.
- **Prefer using `mcp__plugin_figma_figma__*` (remote/API)** over `mcp__plugin_figma_figma-desktop__*` — remote has separate rate limits and doesn't require Figma Desktop open.
- Before calling Figma MCP, always check `docs/figma-cache/extractions/` for existing cached data. Reuse cache when possible to conserve rate limits.

### Implementation workflow for each section
1. Check `docs/figma-cache/extractions/` for existing cached extraction data.
2. If no cache exists: read Figma context (`get_design_context`) and screenshot (`get_screenshot`) for the section node.
3. If context is large/truncated, inspect `get_metadata` and fetch child nodes individually.
4. **Save all extraction data** to `docs/figma-cache/extractions/` (MANDATORY — see above).
5. Translate structure into section component code using shared tokens and primitives.
6. Compose the section into `src/app/page.tsx`.
7. Validate with lint/build and responsive checks.

### Quality gates
- `npm run lint` must pass.
- `npm run build` must pass.
- Verify responsive behavior at 1440, 1024, 768, and 375 widths.
- Verify keyboard access for interactive controls (dropdowns, mobile menu).
