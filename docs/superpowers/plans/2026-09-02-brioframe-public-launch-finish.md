# BRIOFRAME Public Launch Finish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the BRIOFRAME GitHub Pages demo library launch-ready with explicit SEO/indexing files and validator coverage while preserving the three approved Batch 1 demo purchase paths.

**Architecture:** Keep the existing static catalog architecture intact. Extend the single repository validator to treat canonical metadata, robots.txt, and sitemap.xml as required launch artifacts, then add only the minimal static files/head metadata needed to satisfy those checks.

**Tech Stack:** Static HTML/CSS/JavaScript, JSON catalog, Python 3 validator, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-02-brioframe-emergency-finish-design.md`

## Global Constraints

- Preserve the existing Batch 1 demo identities and exact Shopify destinations.
- Keep the public repository sanitized: no KSK material, credentials, paid source archives, customer data, or protected commercial masters.
- Do not label a public demo available unless its demo index and exact Shopify CTA are valid.
- Remove or block legacy LaunchPoint naming from publishable files.
- Future template verticals are outside this emergency-launch plan.

---

### Task 1: Add SEO/indexing requirements to the repository validator

**Files:**
- Modify: `tests/validate_site.py`

**Interfaces:**
- Consumes: repository root files and existing `errors` accumulator.
- Produces: validator failures when `robots.txt`, `sitemap.xml`, homepage canonical metadata, or homepage robots metadata are missing or incorrect.

- [ ] **Step 1: Write the failing validation rules**

Add `robots.txt` and `sitemap.xml` to the required-path tuple. Add homepage checks requiring exactly one `rel="canonical"` link with `https://brioframe.github.io/`, exactly one `name="robots"` meta containing `index,follow`, and verify robots.txt contains `User-agent: *`, `Allow: /`, and `Sitemap: https://brioframe.github.io/sitemap.xml`. Verify sitemap.xml contains the canonical homepage and all three approved Batch 1 demo URLs.

- [ ] **Step 2: Run validator to verify failure**

Run: `python3 tests/validate_site.py`
Expected: FAIL reporting missing `robots.txt`, missing `sitemap.xml`, and missing homepage canonical/robots metadata.

- [ ] **Step 3: Commit the failing test change**

Run: `git add tests/validate_site.py && git commit -m "test: require launch indexing metadata"`

---

### Task 2: Add minimal launch indexing artifacts

**Files:**
- Modify: `index.html`
- Create: `robots.txt`
- Create: `sitemap.xml`

**Interfaces:**
- Consumes: validator requirements from Task 1.
- Produces: canonical homepage metadata and crawl/index discovery files for GitHub Pages.

- [ ] **Step 1: Add homepage head metadata**

Insert these lines after the existing description meta tag:

```html
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="https://brioframe.github.io/">
```

- [ ] **Step 2: Create robots.txt**

```text
User-agent: *
Allow: /

Sitemap: https://brioframe.github.io/sitemap.xml
```

- [ ] **Step 3: Create sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://brioframe.github.io/</loc></url>
  <url><loc>https://brioframe.github.io/demos/velvet-nail-atelier/</loc></url>
  <url><loc>https://brioframe.github.io/demos/amara-braid-house/</loc></url>
  <url><loc>https://brioframe.github.io/demos/meridian-supply-co/</loc></url>
</urlset>
```

- [ ] **Step 4: Run validator to verify pass**

Run: `python3 tests/validate_site.py`
Expected: `BRIOFRAME public-site validation passed`

- [ ] **Step 5: Commit launch metadata**

Run: `git add index.html robots.txt sitemap.xml && git commit -m "feat: add launch indexing metadata"`

---

### Task 3: Release verification and merge

**Files:**
- Read/verify: `data/templates.json`
- Read/verify: `demos/velvet-nail-atelier/index.html`
- Read/verify: `demos/amara-braid-house/index.html`
- Read/verify: `demos/meridian-supply-co/index.html`

**Interfaces:**
- Consumes: branch changes from Tasks 1-2.
- Produces: a reviewed PR merged to `main` only after validator and exact CTA checks pass.

- [ ] **Step 1: Re-run the full validator**

Run: `python3 tests/validate_site.py`
Expected: `BRIOFRAME public-site validation passed`

- [ ] **Step 2: Verify exact Batch 1 URLs**

Confirm each demo contains exactly its catalog URL:

```text
Velvet Nail Atelier -> https://1gsa1w-f1.myshopify.com/products/velvet-nail-atelier
Amara Braid House -> https://1gsa1w-f1.myshopify.com/products/amara-braid-house
Meridian Supply Co. -> https://1gsa1w-f1.myshopify.com/products/meridian-supply-co
```

- [ ] **Step 3: Review branch diff against main**

Expected changed launch files: spec/plan docs, `tests/validate_site.py`, `index.html`, `robots.txt`, `sitemap.xml`. No KSK or protected commercial files.

- [ ] **Step 4: Open and merge PR**

Create a PR from `nova/emergency-finish-2026-09-02` to `main`, review the diff/status, then merge only if verification is clean.

- [ ] **Step 5: Verify deployed public URLs**

Confirm homepage, robots.txt, sitemap.xml, all three demos, and all three exact Shopify product links return successfully after GitHub Pages deployment.
