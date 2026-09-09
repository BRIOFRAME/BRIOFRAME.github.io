# Commercial Release Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the finished BRIOFRAME public demo library into a guarded commercial-release foundation that supports verified Shopify states and protected customer delivery without exposing paid source in GitHub.

**Architecture:** Keep `data/templates.json` as the public catalog and add `data/commerce.json` as the explicit commercial-state contract. Generated detail pages consume both contracts. Separate tooling creates and validates a private delivery workspace outside the public repo; no customer package content is committed publicly.

**Tech Stack:** Static HTML/CSS/JavaScript, Python 3 validators/generators, JSON, GitHub Pages/GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-08-commercial-release-foundation-design.md`

## Global Constraints

- The public GitHub repository remains a sanitized showroom only.
- Do not expose paid source, customer files, credentials, Shopify exports, or delivery ZIPs publicly.
- Do not invent Shopify product URLs, pricing, licensing terms, support promises, or package contents.
- Preview templates must remain non-purchasable until a verified Shopify product destination exists.
- The private delivery workspace must live outside the public repository.

---

### Task 1: Commercial State Contract

**Files:**
- Create: `data/commerce.json`
- Create: `tests/validate_commercial_release.py`
- Modify: `tests/validate_site.py`

**Interfaces:**
- Consumes: `data/templates.json` catalog records keyed by `slug`.
- Produces: one commerce record per template with `slug`, `commercialStatus`, and `shopifyProductUrl`.
- [ ] **Step 1: Write the failing commercial-contract validator**

Require `data/commerce.json`; require exactly one record for every catalog slug; allow only `preview`, `ready_for_sale`, or `live`; require blank product URL for `preview`; require HTTPS `/products/` URL for `live`; require a `live` URL to exactly match the catalog URL; reject duplicate or unknown slugs.

- [ ] **Step 2: Run the validator and confirm RED**

Run: `python tests/validate_commercial_release.py`
Expected: FAIL because `data/commerce.json` does not exist.

- [ ] **Step 3: Add the minimal commerce contract**

Create 35 records. Preserve existing catalog items with established `Available` product URLs as `live`; keep the nine Phase 4 items as `preview` with empty URLs. Do not fabricate `ready_for_sale` records.

- [ ] **Step 4: Strengthen the public-site validator**

Add `data/commerce.json` and `tests/validate_commercial_release.py` to required release files. Expand forbidden public path parts to include `protected-packages`, `vendor-private`, and `credentials`.

- [ ] **Step 5: Run commercial and site validators**

Run: `python tests/validate_commercial_release.py` and `python tests/validate_site.py`
Expected: PASS.

- [ ] **Step 6: Commit Task 1**

Commit message: `feat: add commercial release contract`

### Task 2: Commercial Detail Experience

**Files:**
- Modify: `scripts/generate_template_pages.py`
- Modify: `assets/js/template-detail.js`
- Modify: `tests/validate_commercial_release.py`
- Regenerate: `templates/*/index.html`, `sitemap.xml`
**Interfaces:**
- Consumes: catalog record plus matching commerce record.
- Produces: static commercial sections and CTA state on every template detail page.

- [ ] **Step 1: Extend validator expectations first**

Require every generated detail page to contain static sections titled `Built for this business`, `What the working demo proves`, and `Customization path`. Require `live` items to expose the exact Shopify CTA and `preview` items to expose no product URL.

- [ ] **Step 2: Run validator and confirm RED**

Run: `python tests/validate_commercial_release.py`
Expected: FAIL because the new static sections are missing.

- [ ] **Step 3: Update the page generator**

Load `data/commerce.json`, match by slug, and generate three static commercial sections from existing category, tags, description, demo URL, and status. Keep wording factual and avoid invented deliverables or support promises.

- [ ] **Step 4: Update progressive enhancement**

Teach `template-detail.js` to respect the commerce contract when enhancing status/highlights, without changing static-core accessibility or requiring JavaScript for core commercial information.

- [ ] **Step 5: Regenerate and verify**

Run: `python scripts/generate_template_pages.py`, then `python tests/validate_commercial_release.py`, `python tests/validate_site.py`, and `python tests/validate_phase3.py`.
Expected: PASS.

- [ ] **Step 6: Commit Task 2**

Commit message: `feat: add commercial detail experience`

### Task 3: Protected Delivery Workspace Tooling

**Files:**
- Create: `scripts/init_private_delivery.py`
- Create: `tests/validate_private_delivery.py`
- Create: `docs/operations/commercial-release-checklist.md`
**Interfaces:**
- Consumes: public catalog and commerce contract.
- Produces: a private-root manifest plus `working/`, `packages/`, and `docs/` directories outside the public repo.

- [ ] **Step 1: Write the private-workspace validator first**

Validator accepts `--root`. It must reject a root inside the public repo, require `manifest.json`, require all 35 slugs exactly once, allow only `not_started`, `packaged`, or `verified` delivery states, and require packaged/verified entries to reference files that exist under the private root.

- [ ] **Step 2: Run validator and confirm RED on a missing workspace**

Run against a fresh temporary path and confirm failure.

- [ ] **Step 3: Implement the initializer**

`init_private_delivery.py --root <path>` must refuse public-repo descendants, create the directory structure, and write a manifest with every catalog slug set to `not_started` and no invented package filenames.

- [ ] **Step 4: Test initializer + validator in a temporary root**

Run initializer, then validator. Expected: PASS with 35 `not_started` entries.

- [ ] **Step 5: Create the actual Links100 private workspace**

Initialize `C:\Users\NOVA\BRIOFRAME-private-delivery` and validate it. Existing content must never be overwritten destructively.

- [ ] **Step 6: Document release promotion**

Checklist sequence: demo verified â†’ private package prepared â†’ package validator green â†’ Shopify product verified â†’ commerce status promoted â†’ public validators green â†’ publish.

- [ ] **Step 7: Commit Task 3**

Commit message: `feat: add protected delivery workspace tooling`

### Task 4: Full Release Verification and Publication

- [ ] Run all Python validators: inventory, site, Phase 3, Phase 4 inventory, premium visuals, commercial release, private delivery temporary-root test.
- [ ] Run JavaScript syntax checks and repository browser regression exactly as CI does.
- [ ] Review `git diff --check`, `git status`, and staged diff for accidental source/package leakage.
- [ ] Push `feature/commercial-release-foundation`, open a PR to `main`, and wait for all GitHub Actions gates.
- [ ] Merge only after CI is green and the PR is mergeable.
- [ ] Verify the post-merge `main` workflow and GitHub Pages deployment from the merge commit.
