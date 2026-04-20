# Figma MCP Server — Complete Tool Reference

> Last updated: 2026-02-16 | Sources: Figma Developer Docs, GitHub figma/mcp-server-guide, Figma Forum, practitioner reports

---

## Setup

### Desktop MCP (recommended for iterative work)
- **Endpoint:** `http://127.0.0.1:3845/mcp`
- **Requires:** Figma Desktop app running + file open + Dev Mode enabled (Shift+D)
- **Seat:** Dev or Full seat on paid plan
- **Feature:** Selection-based prompting (select in Figma, agent sees it automatically)

### Remote MCP (for URL-based workflows)
- **Endpoint:** `https://mcp.figma.com/mcp`
- **Setup:** `claude mcp add --transport http figma https://mcp.figma.com/mcp`
- **No Figma app needed**, works with URLs only
- **Missing:** No selection-based prompting, no `whoami` on desktop

### Claude Code Plugin (current setup)
```json
// ~/.claude/settings.json
"enabledPlugins": {
  "figma@claude-plugins-official": true
}
```

### Critical Environment Variable
```bash
export MAX_MCP_OUTPUT_TOKENS=100000
```
Default is 25,000 — too low for complex frames. Set to 100k to prevent truncation.

---

## Tools Reference

### 1. `get_design_context` — PRIMARY TOOL

**Purpose:** Fetches comprehensive design data and generates React + Tailwind code.

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `fileKey` | string | Remote only | From URL: `/design/{fileKey}/...` |
| `nodeId` | string | Yes | From URL: `?node-id=702-10152` → `702:10152` |

**Returns:**
- Layout properties (spacing, sizing, positioning)
- Typography (font families, weights, sizes, line heights)
- Colors (exact hex)
- Design tokens and variables
- Component hierarchy
- React + Tailwind code (default output)

**Limits:**
- Can return 200k+ tokens on large frames
- Default 25k token limit causes truncation (fix: `MAX_MCP_OUTPUT_TOKENS`)
- Timeout on deeply nested frames

**When to use:** Primary tool for every section. Always try this first.

**When NOT to use:** If frame is too large/complex. Use `get_metadata` first to find child nodes.

**Fallback pattern:**
```
1. get_design_context(nodeId) → if truncated/fails:
2. get_metadata(nodeId) → get child node IDs
3. get_design_context(childNodeId) → fetch each child individually
```

---

### 2. `get_metadata` — NAVIGATION/DISCOVERY

**Purpose:** Lightweight XML representation of design structure.

| Param | Type | Required |
|-------|------|----------|
| `fileKey` | string | Remote only |
| `nodeId` | string | Yes |

**Returns:** Sparse XML with:
- Layer IDs, names, types
- Positions and dimensions
- Hierarchical structure
- **NO styling info**

**When to use:**
- When `get_design_context` is too large
- To discover child node IDs before targeted extraction
- For navigating complex design files

---

### 3. `get_screenshot` — VISUAL REFERENCE

**Purpose:** Visual rendering of design as image.

| Param | Type | Required |
|-------|------|----------|
| `fileKey` | string | Remote only |
| `nodeId` | string | Yes |

**Returns:** Image of the design

**When to use:** ALWAYS alongside `get_design_context`. This is your visual source of truth.

**Token impact:** Adds image tokens to context, but worth it for accuracy.

---

### 4. `get_variable_defs` — DESIGN TOKENS

**Purpose:** Extracts all design variables and styles.

| Param | Type | Required |
|-------|------|----------|
| `fileKey` | string | Remote only |
| `nodeId` | string | Optional (page/file level recommended) |

**Returns:**
- Colors (hex values)
- Spacing tokens
- Typography (font families, weights, sizes, line heights)
- Border radius
- Shadows
- All design system tokens

**Limitations:**
- Only reads default/first variable mode
- Multiple modes (light/dark) require manual switching in Figma
- Select at page level for ALL tokens, not individual frames

**Conversion to Tailwind v4:**
```css
@theme {
  --color-primary: #998aff;
  --color-background: #ffffff;
  --font-heading: "DM Sans", sans-serif;
  --spacing-section: 120px;
  /* ... from get_variable_defs output */
}
```

---

### 5. `create_design_system_rules` — AGENT RULES

**Purpose:** Generates a rules file that teaches the AI agent your project conventions.

| Param | Type | Required |
|-------|------|----------|
| (none) | — | Scans codebase automatically |

**Returns:** Markdown rules file containing:
- Token definitions
- Component library patterns
- Style hierarchies
- Naming conventions
- Implementation workflow

**When to use:** Once at project start. Save output to CLAUDE.md.

**Impact:** All subsequent `get_design_context` calls will follow these rules, dramatically improving consistency.

**For Claude Code:** Save under `## Figma MCP server rules` in CLAUDE.md

---

### 6. `get_code_connect_map` — READ MAPPINGS

**Purpose:** Retrieve existing Figma node → code component mappings.

| Param | Type | Required |
|-------|------|----------|
| `fileKey` | string | Remote only |

**Returns:** Object mapping node IDs to `{codeConnectSrc, codeConnectName}`

---

### 7. `add_code_connect_map` — CREATE MAPPINGS

**Purpose:** Map Figma components to your codebase components.

**Impact:** After mapping, `get_design_context` generates code that references YOUR components instead of generic HTML.

**Before mapping:** `<div className="inline-flex px-4 py-2 bg-blue-500...">`
**After mapping:** `<Button variant="primary" size="md">Click me</Button>`

---

### 8. `get_code_connect_suggestions` — AUTO-DETECT

**Purpose:** Auto-detects potential Figma → code component mappings.

**Workflow:**
```
1. get_code_connect_suggestions() → review suggestions
2. send_code_connect_mappings() → confirm good mappings
3. add_code_connect_map() → add any missing ones manually
```

---

### 9. `send_code_connect_mappings` — CONFIRM SUGGESTIONS

**Purpose:** Confirms and saves auto-detected mappings from `get_code_connect_suggestions`.

---

### 10-12. FigJam & Utility Tools

- **`generate_diagram`** — Create FigJam diagrams from Mermaid syntax
- **`get_figjam`** — Extract FigJam to XML metadata
- **`whoami`** — Auth check (remote MCP only)

---

## Desktop vs Remote Comparison

| Feature | Desktop | Remote |
|---------|---------|--------|
| Selection-based prompting | Yes | No |
| Requires Figma app | Yes | No |
| File must be open | Yes | No |
| Connection stability | Less stable | More stable |
| `whoami` tool | No | Yes |
| Asset URLs | `localhost:3845/assets/*` | Remote hosted |
| Setup | Enable in Dev Mode | Add MCP endpoint |

**Recommendation:** Desktop for design work (selection prompting is faster). Remote for CI/automated workflows.

---

## Rate Limits

| Seat Type | Plan | Per-Minute | Per-Day |
|-----------|------|------------|---------|
| View/Collab | Any | N/A | 6/month |
| Dev/Full | Starter | 10/min | N/A |
| Dev/Full | Pro | 15/min | 200/day |
| Dev/Full | Organization | 20/min | 200/day |
| Dev/Full | Enterprise | 20/min | 600/day |

**For this project (13 sections):** ~40-60 calls total. Well within Pro limits.

---

## Sources

- [Figma MCP Introduction](https://developers.figma.com/docs/figma-mcp-server/)
- [Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Add Custom Rules](https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/)
- [Known Issues](https://developers.figma.com/docs/figma-mcp-server/mcp-clients-issues/)
- [Plans & Permissions](https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/)
- [GitHub mcp-server-guide](https://github.com/figma/mcp-server-guide)
- [implement-design Skill](https://github.com/figma/mcp-server-guide/blob/main/skills/implement-design/SKILL.md)
