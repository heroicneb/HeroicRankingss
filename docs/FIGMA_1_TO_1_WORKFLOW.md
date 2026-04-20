# Figma 1:1 Section Workflow (Mandatory)

## Goal
Deliver pixel-perfect implementation from Figma **section by section**, never whole-page-at-once.

## Non-Negotiable Rules
- Work one section at a time.
- Do not move to the next section until the current one is fully verified.
- Save every extraction locally immediately.
- Save every Figma asset locally immediately.
- Run Playwright visual verification against Figma before closing the section.
- Track every section status in `todo.md`.

## Required Folder Conventions
- Extraction notes: `docs/figma-cache/extractions/<date>-<page>-section-<nn>-<name>.md`
- Downloaded assets: `public/figma/<page>/<section>/*`
- Playwright captures: `output/playwright/<page>-section-<nn>-<width>.png`

## Per-Section Gate (must pass in order)
1. Scope section
- Add/confirm section task in `todo.md` as unchecked.
- Record exact Figma node IDs for this section.

2. Figma extraction
- Pull only this section’s nodes (`get_design_context` + `get_screenshot`).
- Capture text styling details, especially gradient-word vs black-word boundaries.
- Save findings to extraction note in `docs/figma-cache/extractions/`.

3. Asset persistence
- Download all section assets from Figma URLs.
- Store under `public/figma/<page>/<section>/`.
- Record local paths in the extraction note.

4. Implementation
- Reuse existing project components first.
- Match geometry, spacing, typography, gradients, and icon sizes to the extracted values.
- Keep changes scoped to the active section only.

5. Playwright verification (required before next section)
- Open local page and capture section screenshots at desktop widths: `2048`, `1440`, `1280`, `1024`.
- Compare live section screenshot(s) against Figma screenshot for that same section.
- Validate text-color treatment word-by-word:
  - gradient words stay gradient
  - non-gradient words stay black/white as designed
- If mismatch exists: add fix item to `todo.md`, patch, and re-capture.

6. Section close
- Mark section checkbox in `todo.md` as complete.
- Append final parity notes (what matched, what changed) in extraction note.
- Only then start the next section.

## Page Close Gate
After all sections are complete:
- Confirm route assembly order matches Figma.
- Run `npm run lint`.
- Run `npm run build`.
- Capture one full-page desktop screenshot and store in `output/playwright/`.
- Update `todo.md` integration checkboxes.

## Rate-Limit / Failure Fallback
If Figma MCP is rate-limited:
- Stop requesting new nodes.
- Continue from already saved extraction notes + saved assets.
- Explicitly log fallback usage in the current extraction note.
- Resume fresh extraction the next day only for unresolved nodes.

## Quick Section Checklist Template
Copy this into `todo.md` per section:
- [ ] Figma nodes confirmed
- [ ] `get_design_context` + `get_screenshot` saved locally
- [ ] assets downloaded to `public/figma/<page>/<section>/`
- [ ] implementation complete
- [ ] Playwright captures saved (`2048/1440/1280/1024`)
- [ ] visual parity confirmed vs Figma
- [ ] section marked complete
