# BRIOFRAME Emergency Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the BRIOFRAME emergency revenue route complete by publishing working demos for all 16 active Shopify templates, exact purchase paths, filtering, SEO/indexing files, and final validation without modifying Kia Supreme Kreations.

**Architecture:** Preserve the existing GitHub Pages catalog architecture. `data/templates.json` remains the source of truth; every active Shopify template gets one public sanitized demo under `demos/<slug>/index.html` plus one sharp SVG preview. The public library renders and filters the catalog, while exact Shopify product URLs remain the only purchase destinations.

**Tech Stack:** Static HTML/CSS/JavaScript, JSON catalog, SVG previews, Python repository validator, GitHub Pages, Shopify.

**Spec:** `docs/superpowers/specs/2026-08-31-brioframe-inventory-expansion-design.md`

## Global Constraints

- Preserve BRIOFRAME Batch 1 behavior and the approved Shopify storefront baseline v9.19.
- Repository must remain `BRIOFRAME/BRIOFRAME.github.io`; public changes merge to `main` only after validation.
- Do not access, edit, publish, or reference Kia Supreme Kreations material.
- Do not invent Shopify destinations; use only verified active BRIOFRAME product handles from Shopify.
- Public forms are simulated and transmit/store no visitor data.
- No paid source archives, customer files, credentials, secrets, fulfillment identifiers, or editable commercial masters are published.
- Every new demo must be responsive, keyboard-usable, clearly branded as a BRIOFRAME demo, and visually distinct for its vertical.
- Current competitor research informs conversion structure and usability, but no competitor layout, copy, imagery, or code is copied.

---

### Task 1: Lock the 16-template inventory contract

**Files:**
- Modify: `tests/validate_site.py`
- Modify: `data/templates.json`

**Interfaces:**
- Consumes: Shopify active-product handles and exact HTTPS product URLs.
- Produces: one canonical record per active template with `id`, `slug`, `name`, `category`, `description`, `previewImage`, `demoUrl`, `shopifyProductUrl`, and `availability`.

- [ ] **Step 1: Write the failing validation contract**

Add a `REQUIRED_ACTIVE_INVENTORY` mapping containing all 16 verified handles and exact `https://1gsa1w-f1.myshopify.com/products/<handle>` URLs, then require each catalog record and demo to contain the exact URL once.

- [ ] **Step 2: Verify the contract fails before catalog expansion**

Run: `python tests/validate_site.py`
Expected: FAIL because 13 active Shopify products are not yet registered in the public catalog.

- [ ] **Step 3: Expand the catalog minimally**

Add the 13 missing records while preserving the three Batch 1 records and their IDs.

- [ ] **Step 4: Re-run validation**

Run: `python tests/validate_site.py`
Expected: FAIL only for missing demo/preview artifacts until Tasks 2–4 are complete.

- [ ] **Step 5: Commit**

Commit message: `test: lock 16-template BRIOFRAME inventory contract`

### Task 2: Publish professional-services and trust-driven demos

**Files:**
- Create: `demos/avery-cole-law/index.html`
- Create: `demos/crescent-private-wealth/index.html`
- Create: `demos/harbor-dental-studio-dental-medical-practice-website-template/index.html`
- Create: `demos/ledgerline-tax-accounting-accounting-firm-website-template/index.html`
- Create: `demos/nexa-systems/index.html`
- Create: matching SVG preview files under `assets/previews/`

**Interfaces:**
- Consumes: catalog slugs and exact Shopify URLs from Task 1.
- Produces: responsive working demos with a single verified purchase CTA, return-to-library link, `data-brioframe-demo="true"`, simulated-form disclosure, and `data-demo-form` where lead capture is shown.

- [ ] **Step 1: Create each distinct trust-led demo**
- [ ] **Step 2: Confirm every CTA points to its exact Shopify product**
- [ ] **Step 3: Confirm mobile layout at 360px and desktop layout at 1440px**
- [ ] **Step 4: Run `python tests/validate_site.py`**
- [ ] **Step 5: Commit with message `feat: publish professional-services demo set`**

### Task 3: Publish home-service and operational demos

**Files:**
- Create: `demos/apex-auto-detail-auto-detailing-website-template/index.html`
- Create: `demos/atlas-freight-logistics-logistics-freight-website-template/index.html`
- Create: `demos/northstar-home-climate-hvac-home-services-website-template/index.html`
- Create: matching SVG preview files under `assets/previews/`

**Interfaces:** Same public-demo contract as Task 2.

- [ ] **Step 1: Create conversion-first operational demos with vertical-specific hierarchy**
- [ ] **Step 2: Verify exact Shopify CTAs and simulated forms**
- [ ] **Step 3: Verify mobile emergency/service CTAs remain visible and usable**
- [ ] **Step 4: Run `python tests/validate_site.py`**
- [ ] **Step 5: Commit with message `feat: publish service-business demo set`**

### Task 4: Publish hospitality, mission, education, creative, and property demos

**Files:**
- Create: `demos/common-ground-foundation-nonprofit-community-website-template/index.html`
- Create: `demos/elevate-catering/index.html`
- Create: `demos/little-grove-early-learning-daycare-childcare-website-template/index.html`
- Create: `demos/lumiere-photography-studio-photography-website-template/index.html`
- Create: `demos/monarch-estates/index.html`
- Create: matching SVG preview files under `assets/previews/`

**Interfaces:** Same public-demo contract as Task 2.

- [ ] **Step 1: Create five visually distinct demos shaped around each vertical’s primary conversion**
- [ ] **Step 2: Verify exact Shopify CTAs and accessible navigation**
- [ ] **Step 3: Verify responsive content order and typography**
- [ ] **Step 4: Run `python tests/validate_site.py`**
- [ ] **Step 5: Commit with message `feat: publish hospitality creative and property demos`**

### Task 5: Upgrade library discovery and indexing

**Files:**
- Modify: `index.html`
- Modify: `assets/js/library.js`
- Modify: `assets/css/site.css`
- Create: `robots.txt`
- Create: `sitemap.xml`

**Interfaces:**
- Consumes: expanded 16-record catalog.
- Produces: category dropdown, keyword search, result count, SEO canonical metadata, robots rules, and sitemap entries for the library plus every demo.

- [ ] **Step 1: Add the Industry dropdown and keyword search markup**
- [ ] **Step 2: Add deterministic client-side filtering by category/name/description**
- [ ] **Step 3: Add canonical/social metadata plus `robots.txt` and `sitemap.xml`**
- [ ] **Step 4: Run validator and JavaScript syntax checks**
- [ ] **Step 5: Commit with message `feat: finish BRIOFRAME library discovery and SEO`**

### Task 6: Final release validation

**Files:**
- Verify: all public files
- Update if necessary: `docs/operations/publishing-checklist.md`

**Interfaces:**
- Consumes: Tasks 1–5.
- Produces: a release candidate where all 16 library cards open the correct demo and each demo opens the exact Shopify product.

- [ ] **Step 1: Run `python tests/validate_site.py` and require PASS**
- [ ] **Step 2: Scan repository text for `LaunchPoint`, `LP Inbox`, `Kia Supreme Kreations`, and `KSK`; require no publishable matches**
- [ ] **Step 3: Verify all 16 demo URLs and all 16 exact Shopify purchase URLs**
- [ ] **Step 4: Verify no duplicate IDs/slugs and no missing preview/demo assets**
- [ ] **Step 5: Merge the validated release branch to `main` and confirm public GitHub Pages navigation**
