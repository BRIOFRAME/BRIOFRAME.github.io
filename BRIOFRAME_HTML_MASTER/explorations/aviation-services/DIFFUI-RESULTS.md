# BRIOFRAME Aviation Services — Diffui Exploration Results

**Date:** 2026-09-21  
**Agent:** Cursor Cloud Agent (controlled Diffui test)  
**Identity:** BRIOFRAME Identity B / “Measured Leg”  
**Scope:** Isolated HTML-first exploration only. No Shopify publish/deploy. No production overwrite.

---

## Diffui execution state reached

| State | Reached? | Evidence |
|---|---|---|
| **CONNECTED** | **NO** | No `diffui` namespace in the Cloud Agent MCP catalog. Pattern search for Diffui tools returned zero matches. Hosted endpoint `https://diffui.ai/mcp` responds `401` / `missing bearer token`. No `~/.diffui/credentials`, no `DIFFUI_API_KEY` env secret, no Diffui entry in agent MCP config. |
| **SUBMITTED** | **NO** | Blocked by CONNECTED failure. Prompt was not transmitted. |
| **RUNNING** | **NO** | No Diffui job/process started. |
| **COMPLETED** | **NO** | No Diffui completion confirmation. |
| **VERIFIED** | **PARTIAL (blocker only)** | Cursor inspected MCP catalog, Composio tool search, Diffui hosted MCP endpoint, local credentials paths, and workspace layout. No concept artifacts exist to verify. |

**Highest honest state:** connection inspection complete; Diffui **not connected**.

---

## Connection inspection log

### MCP catalog (this Cloud Agent)

Available namespaces at inspection time:

- `Composio` (ready after `mcp_auth`)
- `cursor`
- `cursor-cloud`
- `cursor-subscriptions`

**Diffui namespace:** absent.

Composio plugin MCP config present:

```json
{ "mcpServers": { "composio": { "url": "https://connect.composio.dev/mcp" } } }
```

No Diffui hosted MCP config (`url: https://diffui.ai/mcp` + `Authorization: Bearer dui_...`) was found for this environment.

### Composio search for “Diffui”

`COMPOSIO_SEARCH_TOOLS` with Diffui-targeted queries did **not** return a Diffui toolkit. Closest unrelated substitutes (intentionally **not** used):

- `magic_patterns_mcp` (not Diffui; no active connection)
- `htmlcss_to_image` (not Diffui; no active connection)
- `higgsfield_mcp` (image/video gen; not Diffui; no active connection)
- `canva_mcp` (not Diffui)

Per task rules, Cursor did **not** substitute Magic Patterns, Canva, Higgsfield, or hand-authored “fake Diffui” concepts.

### Diffui hosted MCP probe

```text
GET https://diffui.ai/mcp
→ HTTP 401
→ {"error":{"code":-32001,"message":"missing bearer token"},"id":null,"jsonrpc":"2.0"}
```

Diffui requires Cursor-style config:

```json
{
  "mcpServers": {
    "diffui": {
      "url": "https://diffui.ai/mcp",
      "headers": {
        "Authorization": "Bearer dui_..."
      }
    }
  }
}
```

### Cost / spend control

- Diffui auto top-up: **not enabled** (no Diffui session opened).
- Additional Diffui spend: **not authorized / not incurred**.
- Repeated/regenerative Diffui runs: **not initiated**.

**DIFFUI COST:** `$0.00` (no Diffui API calls authenticated or billed).

---

## Files / artifacts generated

### Created by this run (scaffolding only)

```text
BRIOFRAME_HTML_MASTER/
  explorations/
    aviation-services/
      README.md
      DIFFUI-RESULTS.md          ← this file
      concept-a-executive-fbo/
        .gitkeep
        STATUS.md
      concept-b-aviation-operations/
        .gitkeep
        STATUS.md
      concept-c-private-terminal/
        .gitkeep
        STATUS.md
```

### Diffui-generated design/code artifacts

**None.** Concept folders are empty placeholders awaiting a connected Diffui run.

---

## Concept A — Executive FBO — architecture summary

**Not available.** Diffui did not generate Concept A. No architecture, hero composition, or code to summarize.

Planned brief (for the future Diffui submission only; not executed):

- Premium executive aviation / arrival + concierge emphasis
- Warm Measured Leg palette (cream / deep ink / warm gold)
- Distinct hero + service-request CTA

---

## Concept B — Aviation Operations — architecture summary

**Not available.** Diffui did not generate Concept B.

Planned brief (not executed):

- Operational / AOG / ground ops / maintenance coordination
- Precise, information-efficient architecture
- Rapid assistance CTA

---

## Concept C — Private Terminal Editorial — architecture summary

**Not available.** Diffui did not generate Concept C.

Planned brief (not executed):

- Cinematic private-terminal editorial
- Hospitality + destinations storytelling
- Reservations / service-request path

---

## Responsive readiness

**Not assessable** — no generated HTML/CSS.

## Accessibility observations

**Not assessable** — no generated UI. Future Diffui output must still be checked for:

- focus order / visible focus
- contrast on cream / ink / gold
- `prefers-reduced-motion`
- semantic landmarks and CTA labeling

## Implementation feasibility

**Blocked upstream.** Once Diffui connects and completes one controlled run, Cursor can assess HTML/CSS/JS reproducibility against BRIOFRAME’s HTML-first pipeline.

## Reusable components

None from Diffui. Scaffolding folder layout is reusable for the resumed run.

## Missing / broken elements

- Diffui MCP connection on this Cloud Agent
- Diffui API bearer token (`DIFFUI_API_KEY` / `dui_...`)
- All three concept artifacts
- Cost/balance readout from Diffui (unreachable without auth)

## External dependencies

Required to proceed:

1. Diffui account API key (`dui_...`)
2. Diffui MCP registered on **this** Cloud Agent environment (hosted `https://diffui.ai/mcp`)
3. Existing Diffui balance only (no auto top-up)

## Maintenance problems

None introduced to Shopify production or public demos. Exploration path is isolated under `BRIOFRAME_HTML_MASTER/explorations/`.

## What can move directly into production HTML

**Nothing yet** — no Diffui artifacts.

## What should go to Lovable for visual refinement

**Nothing yet** — stop condition forbids automatic Lovable handoff.

## What should be rejected

- Substituting Magic Patterns / Canva / Higgsfield / Cursor-authored HTML as if they were Diffui output
- Regenerating repeatedly without a first verified Diffui completion
- Writing into active Shopify storefront paths
- Publishing / deploying exploration work

---

## Requested unblocking actions (recorded)

Environment setup actions requested for the user:

1. Add secret `DIFFUI_API_KEY`
2. External action: register Diffui MCP on this Cloud Agent and confirm namespace readiness

After Diffui shows as **CONNECTED**, resume with a **single** controlled submission for Concepts A/B/C (separate Diffui prompt nodes, one project), then Cursor inspection → update this file through VERIFIED.

---

## STOP CONDITION COMPLIANCE

- Three Diffui concepts: **not generated** (blocked)
- No Shopify conversion
- No publish / deploy
- No second Diffui generation
- No automatic Lovable send
- Artifacts (scaffolding + this report) left intact for Nova / Darron review
