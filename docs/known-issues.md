# Known Issues & Workarounds — Figma MCP

> Compiled from Figma Forum, GitHub issues, developer reports (2025-2026)

---

## 1. Frame Too Large / Response Truncated

**Symptoms:**
- `get_design_context` returns incomplete data
- Response cut off mid-output
- Error: "MCP tool response exceeds maximum allowed tokens"

**Root cause:** Default token limit is 25,000. Complex frames can produce 200k+ tokens.

**Fixes:**
1. **Increase token limit:**
   ```bash
   export MAX_MCP_OUTPUT_TOKENS=100000
   ```
2. **Break into smaller pieces:**
   ```
   get_metadata(nodeId)        → get child node IDs
   get_design_context(childId) → fetch each child individually
   ```
3. Select individual components, NOT full pages/sections

---

## 2. MCP Server Freeze / Hang

**Symptoms:**
- Tool call hangs indefinitely
- "Lost connection to MCP server"
- Need to restart Figma frequently

**Root causes:**
- Large selection (>1500px wide or >2000px tall)
- Deep nesting (5-6k+ tokens)
- License validation failure inside MCP
- Desktop app connection timeout

**Fixes:**
1. Select smaller areas (components, not full sections)
2. Restart Figma Desktop app
3. Don't prompt "only use get_code" — let agent pick tools naturally
4. Try `/sse` endpoint as fallback: `http://127.0.0.1:3845/sse`
5. Close and reopen file in Figma

---

## 3. Desktop MCP Connection Issues

**Symptoms:**
- "Invalid sessionId" JSON-RPC errors
- Tools not loading in Claude Code
- MCP server option not visible in Figma

**Root causes:**
- Desktop app not running
- File not open in Dev Mode
- Token permissions wrong
- MCP moved from Preferences to Dev Mode panel

**Fixes:**
1. Verify setup:
   - Figma Desktop running
   - File open and active (don't switch to other files)
   - Dev Mode enabled (Shift+D)
   - MCP server toggle ON in Dev Mode panel
2. Regenerate API token with design access + server config scopes
3. Restart both Figma and Claude Code
4. Check `curl http://localhost:3845/mcp` returns metadata

---

## 4. Rate Limit 429 Errors

**Symptoms:**
- "429 Too Many Requests"
- Tools suddenly stop working

**Limits:**
- Pro plan: 15 calls/min, 200/day
- Enterprise: 20 calls/min, 600/day
- View/Collab seat: 6 calls/MONTH (unusable for real work)

**Fixes:**
1. Throttle calls — wait 5-10 seconds between rapid calls
2. Use `get_metadata` instead of multiple `get_design_context` calls
3. Cache responses (copy to local file for reference)
4. Upgrade to Dev/Full seat if on View/Collab

---

## 5. Variable Modes Not Supported

**Symptoms:**
- `get_variable_defs` only returns default theme tokens
- Dark mode variables missing
- Responsive breakpoint variables incomplete

**Root cause:** MCP reads only the default/first variable mode.

**Fixes:**
1. Switch to desired mode in Figma → run `get_variable_defs` → repeat for each mode
2. Use third-party tools for full export (fig2tw plugin)
3. Manually add dark mode tokens based on Figma specs

---

## 6. Wrong Frame / Content Mismatch

**Symptoms:**
- Generated code has completely different text/layout than expected
- Sections don't match what you see in Figma

**Root cause:** Wrong node-id used. Multiple frames in file may look similar.

**THIS IS HOW THE PREVIOUS PROJECT FAILED!**

**Fixes:**
1. **ALWAYS verify frame:** Right-click in Figma → "Copy link to selection" → check node-id
2. Homepage frame is `702:10152` — NOT `1:3`
3. Run `get_screenshot` first and visually confirm it's the right content
4. If content looks wrong, STOP and verify the node-id

---

## 7. Asset URLs Not Loading

**Symptoms:**
- Images from `localhost:3845/assets/*` return 404
- Assets don't load in generated code

**Root causes:**
- Figma Desktop not running
- File not active (switched to another file/tab)
- Asset endpoint changes between sessions

**Fixes:**
1. Keep Figma Desktop running with file open
2. Use asset URLs directly as provided by MCP (don't modify them)
3. For production: export assets manually from Figma → save to `public/`
4. Never rely on localhost URLs in production code

---

## 8. Code Quality Issues

**Symptoms:**
- Generated code uses hardcoded values instead of design tokens
- Components not reused (re-generated each time)
- Inconsistent patterns across sections

**Root causes:**
- No design system rules configured
- No Code Connect mappings
- Context lost between `/clear` sessions

**Fixes:**
1. Run `create_design_system_rules` FIRST and save to CLAUDE.md
2. Set up Code Connect mappings for shared components
3. After every `/clear`, first prompt: "Read CLAUDE.md design system rules"
4. Explicitly tell agent: "Use existing Button/SectionLabel/Container components"

---

## 9. Model-Specific Issues

**Symptoms:**
- Claude Sonnet 4 crashes with `get_image`
- Inconsistent output quality between models

**Fixes:**
- Use Claude Opus 4.6 for complex sections
- Use Claude Sonnet 4.5 for simpler sections
- If crashes occur with screenshots, try without `get_screenshot` temporarily

---

## 10. Context Window Overflow

**Symptoms:**
- Quality degrades after 2-3 sections in same conversation
- Agent starts hallucinating or mixing up sections
- Responses become generic/wrong

**Root cause:** Context window filling up with previous section data.

**Fixes:**
1. **`/clear` between EVERY section** — this is non-negotiable
2. One section per conversation
3. Keep prompts focused on single section
4. Don't paste previous section code into new conversations

---

## Quick Troubleshooting Flowchart

```
Tool call fails?
├─ Truncated → increase MAX_MCP_OUTPUT_TOKENS to 100000
├─ Hangs → restart Figma, select smaller area
├─ 429 error → wait 1 min, then retry
├─ Connection error → verify Dev Mode on, file open, restart app
├─ Wrong content → check node-id (702:10152 for homepage)
└─ Low quality → re-read CLAUDE.md rules, use Code Connect
```
