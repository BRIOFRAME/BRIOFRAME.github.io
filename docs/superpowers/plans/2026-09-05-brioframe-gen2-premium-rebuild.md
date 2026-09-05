# BRIOFRAME Generation 2 Premium Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish BRIOFRAME Generation 2 with a protected legacy catalog, a new premium architecture, and the first flagship Corporate IT template that proves the new quality bar before scaling.

**Architecture:** Keep the existing static GitHub Pages platform and Phase 0–2 infrastructure. Add explicit generation/status metadata to the catalog, create Gen 2-specific shared utilities only for invisible engineering concerns, and build flagship templates as independently composed demo experiences rather than a configuration-driven shared visible skeleton. The first implementation slice delivers the new catalog model plus one Corporate IT flagship so quality can be reviewed before three more design directions and additional industries are multiplied.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, JSON catalog data, Python repository validators, GitHub Pages, Shopify purchase links.

**Spec:** `docs/superpowers/specs/2026-09-05-brioframe-gen2-premium-rebuild-design.md`

## Global Constraints

- Production baseline is `5b75fe14035983be899e6674bc8087e41bf63401`.
- Main remains untouched until Nova/BRIOFRAME review approves merge.
- Existing 26 products remain publicly available as Generation 1 legacy inventory until Gen 2 replacements are approved.
- Do not use the existing shared `demo-runtime.js` as the customer-visible Gen 2 composition engine.
- Shared Gen 2 code may cover accessibility helpers, reduced motion, simulated-form behavior, purchase-link safeguards, and non-visual utilities.
- Gen 2 templates must have original industry-specific copy, hierarchy, composition, mobile behavior, and conversion logic.
- No external template copying.
- No heavy framework introduction unless a requirement cannot be met in the current static architecture.
- All public demo forms remain simulated and must not transmit or store visitor data.
- Every live purchase action must map to the correct Shopify product URL.
- Run `python3 tests/validate_site.py` before every commit and `python3 tests/validate_inventory.py` when catalog semantics change.

---

## File Structure

### Existing files to modify

- `data/templates.json` — add generation/status/design-direction metadata while preserving existing availability and links.
- `tests/validate_inventory.py` — enforce valid Gen 1/Gen 2 metadata and legacy/flagship status rules.
- `tests/validate_site.py` — add Gen 2 structural safeguards and prohibit Gen 2 demos from using the Gen 1 shared visible runtime.
- `index.html` — surface Generation 2 without hiding or breaking Gen 1 inventory once the first flagship is approved for catalog exposure.
- `sitemap.xml` — add Gen 2 demo/detail routes only when the flagship becomes catalog-visible.

### New shared Gen 2 files

- `assets/css/gen2-foundation.css` — tokens and accessibility/motion primitives only; no complete page skeleton.
- `assets/js/gen2-demo.js` — simulated-form completion, reduced-motion hooks, and defensive interaction utilities only.

### First flagship files

- `demos/commandline-it/index.html` — Corporate IT / Enterprise Command composition.
- `demos/commandline-it/style.css` — template-owned layout, art direction, responsive behavior, and animation.
- `demos/commandline-it/app.js` — template-owned interactions that are genuinely specific to this experience.
- `assets/previews/commandline-it.svg` — sanitized catalog preview art for the flagship.
- `templates/commandline-it/index.html` — commercial detail route using the existing Phase 2 detail experience pattern or a compatible thin route fed from catalog data.

---

### Task 1: Introduce Generation Metadata Without Changing Public Inventory

**Files:**
- Modify: `data/templates.json`
- Modify: `tests/validate_inventory.py`

**Interfaces:**
- Consumes: current 26 catalog records and existing validator entry points.
- Produces: catalog records with `generation`, `status`, and `designDirection`; validator rules that later Gen 2 tasks rely on.

- [ ] **Step 1: Write the failing inventory validation rules**

Add validator assertions that every catalog record contains:

```python
required_generation_fields = {"generation", "status", "designDirection"}
allowed_generations = {1, 2}
allowed_statuses = {"legacy", "flagship", "available", "retired"}

for template in templates:
    missing = required_generation_fields - template.keys()
    assert not missing, f"{template['slug']} missing generation metadata: {sorted(missing)}"
    assert template["generation"] in allowed_generations
    assert template["status"] in allowed_statuses
    if template["generation"] == 1:
        assert template["status"] in {"legacy", "retired"}
    if template["generation"] == 2:
        assert template["designDirection"].strip()
```

Preserve the validator's existing reporting style rather than replacing the whole test file.

- [ ] **Step 2: Run inventory validation and confirm failure**

Run:

```bash
python3 tests/validate_inventory.py
```

Expected: failure because current records lack Generation 2 metadata.

- [ ] **Step 3: Update all existing catalog records as Gen 1 legacy**

For every current `bf-001` through `bf-026` record add exactly:

```json
"generation": 1,
"status": "legacy",
"designDirection": "Legacy Gen 1"
```

Do not change `availability`, `shopifyProductUrl`, `slug`, `demoUrl`, or product identity.

- [ ] **Step 4: Run inventory and site validation**

Run:

```bash
python3 tests/validate_inventory.py
python3 tests/validate_site.py
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/templates.json tests/validate_inventory.py
git commit -m "feat: classify existing catalog as Gen 1 legacy"
```

---

### Task 2: Add Gen 2 Structural Guardrails

**Files:**
- Modify: `tests/validate_site.py`
- Create: `assets/css/gen2-foundation.css`
- Create: `assets/js/gen2-demo.js`

**Interfaces:**
- Consumes: Generation metadata from Task 1.
- Produces: `gen2-foundation.css` and `gen2-demo.js`; validator constraints that every later Gen 2 flagship must pass.

- [ ] **Step 1: Add failing Gen 2 validator cases**

Extend the site validator so that for every catalog record where `generation == 2`:

```python
assert demo_html_path.exists(), f"Gen 2 demo missing for {slug}"
html = demo_html_path.read_text(encoding="utf-8")
assert "/assets/js/demo-runtime.js" not in html, f"Gen 2 demo {slug} uses legacy shared visible runtime"
assert 'data-brioframe-gen="2"' in html, f"Gen 2 marker missing for {slug}"
assert "Simulated" in html or "simulated" in html, f"Gen 2 demo disclosure missing for {slug}"
```

Also require at least one `<main`, one `<nav`, one `<h1`, one canonical URL, and a purchase link or an explicitly unavailable purchase state using the validator's existing HTML parsing conventions.

- [ ] **Step 2: Create shared Gen 2 foundation CSS**

Create `assets/css/gen2-foundation.css` containing only cross-template primitives:

```css
:root {
  --gen2-focus: 3px solid currentColor;
  --gen2-radius-sm: .75rem;
  --gen2-radius-md: 1.5rem;
  --gen2-page-inline: clamp(1rem, 4vw, 5rem);
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; }
a, button, input, textarea, select { font: inherit; }
:focus-visible { outline: var(--gen2-focus); outline-offset: 4px; }
.skip-link { position: fixed; left: 1rem; top: -5rem; z-index: 9999; }
.skip-link:focus { top: 1rem; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

Do not place hero, cards, service sections, grids, color themes, or template-specific layout rules here.

- [ ] **Step 3: Create shared Gen 2 demo behavior**

Create `assets/js/gen2-demo.js` with a small exported/global initializer:

```javascript
window.BRIOFRAME_GEN2 = {
  initSimulatedForms(root = document) {
    root.querySelectorAll("[data-demo-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const output = form.querySelector("[data-form-status]");
        if (output) output.textContent = "Demo complete — no information was sent or stored.";
      });
    });
  }
};
```

Do not generate page markup from JavaScript.

- [ ] **Step 4: Run validation**

Run:

```bash
python3 tests/validate_site.py
python3 tests/validate_inventory.py
```

Expected: PASS; there are not yet Gen 2 catalog records, but shared files and checks compile/load cleanly.

- [ ] **Step 5: Commit**

```bash
git add tests/validate_site.py assets/css/gen2-foundation.css assets/js/gen2-demo.js
git commit -m "test: add Gen 2 architecture guardrails"
```

---

### Task 3: Build the First Flagship — Corporate IT / Enterprise Command

**Files:**
- Create: `demos/commandline-it/index.html`
- Create: `demos/commandline-it/style.css`
- Create: `demos/commandline-it/app.js`
- Create: `assets/previews/commandline-it.svg`

**Interfaces:**
- Consumes: `gen2-foundation.css`, `gen2-demo.js`.
- Produces: a fully standalone premium Gen 2 demo at `/demos/commandline-it/` and sanitized preview art.

- [ ] **Step 1: Add a temporary fixture record locally for validator-driven development**

Before catalog publication, add a local/uncommitted test fixture or validator fixture representing:

```json
{
  "id": "bf-g2-001",
  "slug": "commandline-it",
  "name": "Commandline IT",
  "industry": "technology",
  "category": "Corporate IT & Technology",
  "generation": 2,
  "status": "flagship",
  "designDirection": "Enterprise Command",
  "availability": "Preview"
}
```

Use the validator's existing fixture mechanism if present; otherwise implement the HTML first and defer the actual catalog record to Task 5 rather than committing a partial public record.

- [ ] **Step 2: Build semantic page structure**

The HTML must contain this business-specific sequence:

```text
Demo notice
Header / navigation / consultation CTA
Hero: enterprise confidence + operational control
Trust strip: response / coverage / satisfaction / environments
Capabilities: Managed IT, Cybersecurity, Cloud & Infrastructure, Projects
Environment proof: Microsoft 365 / Azure / endpoint / network / identity context
Executive risk section: downtime, security exposure, fragmented ownership
Engagement model: Assess → Stabilize → Modernize → Operate
Case-study style proof block
Leadership / senior-engineer access promise
Consultation section with simulated form
Purchase / template evaluation CTA
Footer
```

Use actual category-specific copy. Do not reuse the generic Gen 1 service paragraphs from `demo-runtime.js`.

- [ ] **Step 3: Implement independent visual composition**

`style.css` must define the entire visible page architecture for Commandline IT. Required characteristics:

```text
- restrained enterprise palette with high contrast
- asymmetric hero rather than the Gen 1 shared hero structure
- deliberate information density suitable for B2B buyers
- strong typographic hierarchy
- dashboard/system-inspired visual language created with CSS/SVG, not copied screenshots
- distinct section pacing
- mobile navigation and CTA hierarchy designed explicitly below 760px
- no horizontal overflow at 320px
```

- [ ] **Step 4: Add template-specific interaction**

`app.js` may implement only interactions belonging to this concept, for example:

```javascript
const capabilityButtons = document.querySelectorAll("[data-capability]");
const capabilityPanel = document.querySelector("[data-capability-panel]");

capabilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    capabilityButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    capabilityPanel.textContent = button.dataset.detail;
  });
});

window.BRIOFRAME_GEN2.initSimulatedForms();
```

All interaction must work with keyboard input and without blocking core content when JavaScript is unavailable.

- [ ] **Step 5: Create preview SVG**

Create an original sanitized preview representation of the Commandline IT hero/interface. It must not embed copyrighted third-party screenshots, customer data, or paid package assets.

- [ ] **Step 6: Run a local server and inspect responsive states**

Run:

```bash
python3 -m http.server 8000
```

Inspect `/demos/commandline-it/` at minimum widths:

```text
320px
390px
768px
1024px
1440px
```

Verify no overflow, readable type, visible focus states, usable navigation, and reduced-motion behavior.

- [ ] **Step 7: Run repository validation**

```bash
python3 tests/validate_site.py
python3 tests/validate_inventory.py
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add demos/commandline-it assets/previews/commandline-it.svg
git commit -m "feat: build Gen 2 Enterprise Command flagship"
```

---

### Task 4: Perform the Premium Quality Gate Before Catalog Publication

**Files:**
- Modify only if review identifies defects in `demos/commandline-it/*` or Gen 2 shared primitives.

**Interfaces:**
- Consumes: completed first flagship.
- Produces: an approved or rejected quality-gate decision; no catalog exposure occurs on rejection.

- [ ] **Step 1: Compare against the design spec failure conditions**

Explicitly record PASS/FAIL for:

```text
Distinct from Gen 1 visible skeleton
Industry-specific copy
Industry-specific conversion path
Intentional desktop composition
Intentional mobile composition
Trust-building depth
Accessible keyboard interaction
Reduced motion
No console errors
No broken links
No generic placeholder content
No irrelevant imagery
```

- [ ] **Step 2: Run final technical checks**

```bash
python3 tests/validate_site.py
python3 tests/validate_inventory.py
git diff 5b75fe14035983be899e6674bc8087e41bf63401 --check
```

Expected: all validators PASS and `git diff --check` emits no whitespace errors.

- [ ] **Step 3: Fix every review blocker before proceeding**

Do not classify cosmetic issues that materially affect perceived quality as optional. Any issue that makes the flagship look template-like, generic, cramped, repetitive, or unfinished blocks publication.

- [ ] **Step 4: Commit corrections if needed**

```bash
git add demos/commandline-it assets/css/gen2-foundation.css assets/js/gen2-demo.js tests
git commit -m "fix: address Gen 2 flagship quality review"
```

---

### Task 5: Publish the First Gen 2 Record to the Catalog Branch

**Files:**
- Modify: `data/templates.json`
- Create: `templates/commandline-it/index.html`
- Modify: `sitemap.xml`
- Modify: `index.html` only as required to expose generation/status presentation without changing Gen 1 availability.

**Interfaces:**
- Consumes: quality-approved Commandline IT demo.
- Produces: first real Gen 2 catalog record and discoverable detail/demo route on the feature branch.

- [ ] **Step 1: Add the approved Gen 2 catalog record**

Add:

```json
{
  "id": "bf-g2-001",
  "slug": "commandline-it",
  "name": "Commandline IT",
  "industry": "technology",
  "category": "Corporate IT & Technology",
  "tags": ["it", "managed services", "cybersecurity", "enterprise"],
  "description": "A premium enterprise IT services experience built around operational confidence, cybersecurity trust, infrastructure clarity, executive proof, and consultation conversion.",
  "previewImage": "/assets/previews/commandline-it.svg",
  "demoUrl": "/demos/commandline-it/",
  "shopifyProductUrl": "",
  "availability": "Preview",
  "generation": 2,
  "status": "flagship",
  "designDirection": "Enterprise Command"
}
```

Keep the purchase URL empty until a corresponding Shopify product actually exists. The UI must render this as premium preview rather than inventing a purchase path.

- [ ] **Step 2: Create the commercial detail route**

Use the established Phase 2 detail-page conventions, but ensure the page communicates:

```text
Generation 2 Flagship
Corporate IT & Technology
Enterprise Command design direction
Preview status when Shopify URL is absent
View live demo CTA
No fake purchase button
```

- [ ] **Step 3: Update sitemap and library exposure**

Add the Gen 2 demo/detail URLs. If the library supports generation badges through catalog data, prefer data-driven rendering. Do not hide Gen 1.

- [ ] **Step 4: Run validators**

```bash
python3 tests/validate_inventory.py
python3 tests/validate_site.py
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/templates.json templates/commandline-it/index.html sitemap.xml index.html
git commit -m "feat: publish first Gen 2 flagship preview"
```

---

### Task 6: Open Review PR and Stop Before Merge

**Files:**
- No product-code changes unless CI/review requires corrections.

**Interfaces:**
- Consumes: fully validated Gen 2 branch.
- Produces: draft PR for Nova/BRIOFRAME review.

- [ ] **Step 1: Re-run full validation from clean branch state**

```bash
python3 tests/validate_inventory.py
python3 tests/validate_site.py
git status --short
git diff 5b75fe14035983be899e6674bc8087e41bf63401 --check
```

Expected: validators PASS, no uncommitted files, no diff-check errors.

- [ ] **Step 2: Push branch and open draft PR**

Use title:

```text
Phase 3: BRIOFRAME Gen 2 premium architecture + first flagship
```

PR body must explicitly state:

```text
- Gen 1 remains live and unchanged in availability.
- This PR introduces generation metadata and Gen 2 guardrails.
- Commandline IT / Enterprise Command is the first quality-bar flagship.
- No merge is authorized until Nova/BRIOFRAME visual and technical review.
```

- [ ] **Step 3: Wait at review gate**

Do not merge, deploy, retire Gen 1, or begin mass production of the remaining variants until the first flagship passes review.

---

## Follow-on Work After Flagship Approval

Only after Task 6 receives approval, create separate implementation plans for:

1. Corporate IT — Modern Infrastructure + Executive Technology.
2. Luxury Catering — Editorial Luxury + Private Dining + Modern Event Atelier.
3. DJ/Event Entertainment — Nightlife Editorial + Luxury Celebration + Production Studio.
4. Content Creator — Editorial Creator + Brand Partnership Studio + Creator Commerce.
5. Category-by-category Gen 1 retirement and Shopify replacement mapping.
6. Phase 3 acquisition funnels and template-to-service upsells after the Gen 2 product quality bar is proven.

## Self-Review

- Spec coverage: protected baseline, Gen 1 continuity, visible-originality rule, accessibility, SEO, simulated forms, mobile quality, conversion depth, and review gating are all mapped to tasks.
- Placeholder scan: no TBD/TODO/implement-later instructions remain.
- Type/property consistency: `generation`, `status`, `designDirection`, `availability`, and `shopifyProductUrl` names are consistent across tasks.
- Scope control: initial execution proves one flagship before multiplying twelve designs, preventing a low-quality shared system from being scaled.
