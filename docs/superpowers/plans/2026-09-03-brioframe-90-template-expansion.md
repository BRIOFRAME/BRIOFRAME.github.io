# BRIOFRAME 90-Template Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the BRIOFRAME public template catalog from the current 17-record baseline to a locked total of 90 premium, distinct, responsive templates without breaking the existing 16 verified purchase paths.

**Architecture:** Keep the public library catalog-driven through `data/templates.json`, preserve existing commercial entries, and add new previews in controlled waves. Generalize validation so it enforces the catalog contract instead of hard-coding a 17-record ceiling. Shared runtime code may handle common behavior, but new variants may use dedicated markup/styles to ensure real structural differentiation.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, JSON catalog/config data, Python inventory validator, GitHub Pages, Shopify purchase links.

**Spec:** `docs/superpowers/specs/2026-08-31-brioframe-inventory-expansion-design.md`

## Global Constraints
- Locked catalog target: 90 total templates.
- Preserve all 16 existing verified Shopify purchase URLs exactly.
- Never fabricate a Shopify purchase URL; use `Preview` until an exact destination is verified.
- Repository remains `BRIOFRAME/BRIOFRAME.github.io`; no KSK material may enter the repo.
- Every variant must be materially distinct in structure and buyer journey, not merely color/image changes.
- Desktop/mobile quality and thumbnail/demo identity must both pass QA.
- Forms and private interactions remain simulated in public demos.

---

### Task 1: Generalize Inventory Validation for Expansion

**Files:**
- Modify: `tests/validate_inventory.py`

**Interfaces:**
- Consumes: `data/templates.json` catalog contract.
- Produces: validator capable of checking 17–90 records without a hard-coded 17 ceiling while preserving exact checks for the original 16 verified Shopify links.

- [ ] **Step 1: Add failing expansion expectations**
  - Replace the exact `len(catalog) != 17` expectation with lower/upper target checks.
  - Require each record to contain `id`, `slug`, `name`, `category`, `description`, `previewImage`, `demoUrl`, `shopifyProductUrl`, `availability`.
  - Require `availability` to be either `Available` or `Preview`.

- [ ] **Step 2: Preserve exact legacy commercial checks**
  - Keep the existing 16 `REQUIRED_ACTIVE_INVENTORY` exact names and Shopify URLs unchanged.

- [ ] **Step 3: Add generic preview/available behavior validation**
  - `Available` records must contain one Shopify product URL and `data-purchase-link="verified"` in the demo.
  - `Preview` records must contain no Shopify product URL and no verified purchase marker.

- [ ] **Step 4: Add demo/preview existence and identity validation for every record**
  - Resolve `previewImage` and `demoUrl` from the catalog instead of only hard-coded slugs.
  - Reject missing preview/demo files, forbidden brand text, missing BRIOFRAME marker, and absent library return link.

- [ ] **Step 5: Run validator and commit**
  - Expected current baseline result: pass with 17 records while reporting progress toward 90.

### Task 2: Build Expansion Wave 1 — Four Premium Preview Templates

**Files:**
- Modify: `data/templates.json`
- Modify: `data/demo-config.json`
- Create: `demos/northstar-advisory-group/index.html`
- Create: `demos/maison-elan-catering/index.html`
- Create: `demos/pulsewell-studio/index.html`
- Create: `demos/encore-creator-studio/index.html`
- Create: `assets/previews/northstar-advisory-group.svg`
- Create: `assets/previews/maison-elan-catering.svg`
- Create: `assets/previews/pulsewell-studio.svg`
- Create: `assets/previews/encore-creator-studio.svg`

**Interfaces:**
- Consumes: shared demo runtime and catalog schema.
- Produces: four new `Preview` catalog entries, taking the public-development inventory from 17 to 21.

- [ ] **Step 1: Create four distinct catalog records**
  - IDs `bf-018` through `bf-021`.
  - Leave `shopifyProductUrl` empty and set `availability` to `Preview`.

- [ ] **Step 2: Add vertical-specific demo configuration**
  - Northstar Advisory Group: executive consulting / authority-led.
  - Maison Élan Catering: boutique hospitality / editorial-led.
  - Pulsewell Studio: fitness/wellness / action-led.
  - Encore Creator Studio: media/portfolio / immersive-led.

- [ ] **Step 3: Create sanitized demo shells**
  - Each demo includes the exact template identity, BRIOFRAME marker, library return link, simulated-form disclosure, and Premium Preview copy.

- [ ] **Step 4: Create matching preview assets**
  - Each SVG must show the correct template name/category and a visual motif appropriate to that vertical.

- [ ] **Step 5: Run validator and commit**
  - Expected result: 21 catalog records, 16 Available + 5 Preview.

### Task 3: Establish Variant Architecture for the 90-Template Catalog

**Files:**
- Modify: `assets/js/demo-runtime.js`
- Modify: `assets/css/demo-runtime.css`
- Modify: `data/demo-config.json`

**Interfaces:**
- Consumes: per-template configuration records.
- Produces: multiple structural families rather than a single repeated three-service layout.

- [ ] **Step 1: Define reusable structural families**
  - editorial authority
  - conversion/service
  - immersive portfolio
  - operational/proof
  - boutique hospitality
  - membership/community
  - knowledge/resource portal
  - commerce/catalog

- [ ] **Step 2: Extend runtime to render family-specific section orders and content modules**
  - Allow family-specific hero, proof, services/programs, gallery/resource, CTA, and contact structures.

- [ ] **Step 3: Add family-specific responsive CSS**
  - Keep common accessibility and form behavior shared.

- [ ] **Step 4: Re-run baseline QA**
  - Existing 17 demos must remain functional.

### Task 4: Build Waves 2–5 to Reach Approximately 45 Templates

**Files:**
- Modify catalog/config data.
- Create new demo and preview files per template.

**Interfaces:**
- Consumes: generalized validator + variant architecture.
- Produces: broad commercial coverage with 3–4 variants in the strongest categories.

- [ ] **Step 1: Aviation family**
  - Aviation Services, Aircraft Detailing, Aviation Catering, Aviation Clubs, Aviation Knowledge Library.

- [ ] **Step 2: Marine family**
  - Boating/Marine, Charter Fishing, yacht/boat services variants.

- [ ] **Step 3: Property/hospitality family**
  - Villas/Luxury Vacation Property plus real-estate variants.

- [ ] **Step 4: Professional services family**
  - Consulting, technology, legal, accounting, wealth, healthcare variants.

- [ ] **Step 5: Beauty/food/wellness/creator family**
  - Nail, braiding, catering, wellness, creator variants.

- [ ] **Step 6: Validate after each wave and commit independently**

### Task 5: Build Waves 6–9 to Reach 90 Templates

**Files:**
- Modify catalog/config data.
- Create demo and preview files per template.

**Interfaces:**
- Consumes: proven variant families from Tasks 3–4.
- Produces: final 90-template catalog.

- [ ] **Step 1: Fill approved category gaps without duplicate-looking variants**
- [ ] **Step 2: Maintain balanced mix of service, portfolio, membership, knowledge, hospitality, and commerce designs**
- [ ] **Step 3: Confirm every category has enough variants to be useful without unnecessary filler**
- [ ] **Step 4: Stop only when `data/templates.json` contains exactly 90 validated records**

### Task 6: Catalog UX, Filtering, and Featured Showcase

**Files:**
- Modify: `index.html`
- Modify: `library.js`
- Modify relevant library CSS.

**Interfaces:**
- Consumes: 90-record catalog.
- Produces: usable industry filtering/search and a featured-premium showcase.

- [ ] **Step 1: Verify industry dropdown remains usable with full category set**
- [ ] **Step 2: Add/verify search across name, category, and description**
- [ ] **Step 3: Feature the strongest premium templates without hiding full inventory**
- [ ] **Step 4: Mobile QA catalog browsing and filtering**

### Task 7: Final QA and Release Readiness

**Files:**
- Modify: `sitemap.xml`
- Modify validator if final gaps are discovered.

**Interfaces:**
- Consumes: final catalog and demos.
- Produces: verified 90-template release candidate.

- [ ] **Step 1: Run full Python inventory validator**
- [ ] **Step 2: Validate JavaScript syntax**
- [ ] **Step 3: Verify every demo identity, navigation, thumbnail match, and simulated interaction**
- [ ] **Step 4: Verify every `Available` Shopify URL exactly; leave all unverified products as `Preview`**
- [ ] **Step 5: Review mobile responsiveness and interior-image quality across the catalog**
- [ ] **Step 6: Confirm sitemap/library discovery for all 90 entries**
- [ ] **Step 7: Create release PR from `brioframe-90-template-expansion` only after all checks pass**
