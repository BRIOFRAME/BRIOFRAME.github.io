# BRIOFRAME Services + Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium public BRIOFRAME Design Studio service path at `/services/` while preserving Template Studio as the catalog-first purchasing path.

**Architecture:** Add one static GitHub Pages-compatible services landing page, one focused shared stylesheet, restrained cross-navigation on the existing library, and sitemap coverage. The page exposes Template Customization and Custom Website Design as distinct paths plus Managed Launch / Expanded Scope as a consultation-scoped extension; no framework, backend form, fabricated price, or unverified endpoint is introduced.

**Tech Stack:** Static HTML5, existing BRIOFRAME CSS architecture, optional vanilla JavaScript only if required, Python release validators, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-02-services-pricing-design.md`

## Global Constraints

- Template Studio `/` remains catalog-first and keeps its existing search, filters, demo cards, exact Shopify purchase paths, and preview-only contract.
- Preserve all 16 purchasable template paths and the Aviation premium preview contract.
- Service pricing is starting-price guidance only; no dollar amount may be added until explicitly approved.
- Until approved prices exist, display `Starting price available during consultation`.
- Do not fabricate Shopify URLs, contact endpoints, testimonials, client logos, counts, performance claims, or schema data.
- No KSK branding or content may appear in BRIOFRAME public assets.
- No public form may claim to transmit data unless a verified intake endpoint exists.
- Use cream/white, navy, warm gold, refined serif-led display typography, restrained spacing, and mobile-first responsive behavior.
- Public navigation exposes Templates and Services without a persistent mobile dropdown.
- `/services/` requires unique metadata, canonical URL, semantic headings, descriptive internal links, and sitemap coverage.
- Existing public-site, catalog, demo, JSON, and JavaScript validators must remain green.

---

### Task 1: Lock the Services Public Contract in Tests

**Files:**
- Create: `tests/validate_services.py`
- Modify: `.github/workflows/validate.yml`

**Interfaces:**
- Consumes: approved design spec and existing repository root layout.
- Produces: executable validator `python tests/validate_services.py` that later tasks must satisfy.

- [ ] **Step 1: Write the failing service validator**

Create `tests/validate_services.py` with checks for:

```python
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SERVICE = ROOT / "services" / "index.html"
SITEMAP = ROOT / "sitemap.xml"
INDEX = ROOT / "index.html"
errors = []

if not SERVICE.is_file():
    errors.append("missing services/index.html")
else:
    html = SERVICE.read_text(encoding="utf-8")
    required = {
        '<link rel="canonical" href="https://brioframe.github.io/services/">': "services canonical",
        "Template Customization": "template customization path",
        "Custom Website Design": "custom website path",
        "Managed Launch": "managed launch scope",
        "Starting price available during consultation": "non-fabricated pricing treatment",
        'href="/"': "Template Studio return path",
    }
    for needle, label in required.items():
        if needle not in html:
            errors.append(f"services page missing {label}")
    forbidden = ("<form", "data-purchase-link=", "myshopify.com/products/")
    for needle in forbidden:
        if needle in html:
            errors.append(f"services page contains unverified behavior: {needle}")

if INDEX.is_file():
    index_html = INDEX.read_text(encoding="utf-8")
    if 'href="/services/"' not in index_html:
        errors.append("Template Studio missing Services navigation")

if SITEMAP.is_file():
    sitemap = SITEMAP.read_text(encoding="utf-8")
    if "https://brioframe.github.io/services/" not in sitemap:
        errors.append("sitemap missing services URL")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("BRIOFRAME services validation passed")
```

- [ ] **Step 2: Run the validator and verify RED**

Run: `python tests/validate_services.py`

Expected: FAIL with at least `missing services/index.html`, `Template Studio missing Services navigation`, and `sitemap missing services URL`.

- [ ] **Step 3: Add the validator to GitHub Actions**

Add this step after the existing public-site validation step in `.github/workflows/validate.yml`:

```yaml
      - name: Validate Design Studio services
        run: python tests/validate_services.py
```

- [ ] **Step 4: Commit the red contract**

```bash
git add tests/validate_services.py .github/workflows/validate.yml
git commit -m "test: define Design Studio services contract"
```

### Task 2: Build the Design Studio Services Page

**Files:**
- Create: `services/index.html`
- Create: `assets/css/services.css`
- Test: `tests/validate_services.py`

**Interfaces:**
- Consumes: `/assets/css/site.css`, BRIOFRAME brand identity, root Template Studio path `/`.
- Produces: `/services/` public page and `/assets/css/services.css` presentation layer.

- [ ] **Step 1: Create semantic services HTML**

Create `services/index.html` with this page contract:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="BRIOFRAME Design Studio provides template customization, custom website design, and managed launch support for businesses that need more than an off-the-shelf website.">
  <link rel="canonical" href="https://brioframe.github.io/services/">
  <title>BRIOFRAME Design Studio | Website Design Services</title>
  <link rel="stylesheet" href="/assets/css/site.css">
  <link rel="stylesheet" href="/assets/css/services.css">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to services</a>
  <header class="site-header service-header">
    <a class="brand" href="/" aria-label="BRIOFRAME home">
      <span class="brand__mark" aria-hidden="true">BR</span>
      <span class="brand__text">BRIOFRAME</span>
    </a>
    <nav class="public-nav" aria-label="Primary navigation">
      <a href="/">Templates</a>
      <a href="/services/" aria-current="page">Services</a>
    </nav>
  </header>
  <main id="main-content">
    <section class="service-hero">
      <p class="eyebrow">BRIOFRAME Design Studio</p>
      <h1>Website design built around where your business needs to go.</h1>
      <p>Start with a proven BRIOFRAME template or commission a tailored site experience. We help turn the right starting point into a polished, responsive, launch-ready website.</p>
      <div class="service-actions">
        <a class="service-button service-button--primary" href="#service-paths">Explore services</a>
        <a class="service-button" href="/">Browse templates</a>
      </div>
    </section>

    <section id="service-paths" class="service-section" aria-labelledby="paths-title">
      <p class="eyebrow">Choose your path</p>
      <h2 id="paths-title">The right level of support for the way you want to launch.</h2>
      <div class="service-grid">
        <article class="service-card">
          <h3>Template Customization</h3>
          <p>For businesses that want to begin with an existing BRIOFRAME template and adapt the content, branding, structure, and launch details to fit their business.</p>
          <ul><li>Brand and content adaptation</li><li>Responsive page refinement</li><li>Business-specific launch preparation</li></ul>
          <p class="price-treatment"><strong>Starting price available during consultation</strong></p>
        </article>
        <article class="service-card">
          <h3>Custom Website Design</h3>
          <p>For businesses that need an original structure, tailored user experience, and a website system designed around their goals rather than an existing template.</p>
          <ul><li>Original page architecture</li><li>Tailored responsive UX</li><li>Launch-ready implementation</li></ul>
          <p class="price-treatment"><strong>Starting price available during consultation</strong></p>
        </article>
        <article class="service-card service-card--wide">
          <h3>Managed Launch / Expanded Scope</h3>
          <p>For projects that require additional pages, migrations, integrations, content entry, or coordinated launch work. Scope is defined during consultation rather than presented as an unlimited package.</p>
          <p class="price-treatment"><strong>Starting price available during consultation</strong></p>
        </article>
      </div>
    </section>

    <section class="service-section service-process" aria-labelledby="process-title">
      <p class="eyebrow">How BRIOFRAME works</p>
      <h2 id="process-title">A focused path from direction to launch.</h2>
      <ol class="process-list"><li>Choose the right service path.</li><li>Define business goals, content, brand direction, and scope.</li><li>Build and refine the responsive experience.</li><li>Validate the launch experience and handoff.</li></ol>
    </section>

    <section class="service-section consultation" aria-labelledby="consult-title">
      <p class="eyebrow">Consultation</p>
      <h2 id="consult-title">Have a project that needs more than a template?</h2>
      <p>Consultation intake is being connected. Until the verified intake destination is live, no information is collected or transmitted from this page.</p>
      <a class="service-button" href="/">Not sure yet? Explore Template Studio</a>
    </section>
  </main>
  <footer class="site-footer"><p>© 2026 BRIOFRAME. All rights reserved.</p><p>Template Studio and Design Studio are two paths within BRIOFRAME.</p></footer>
</body>
</html>
```

- [ ] **Step 2: Add focused responsive styling**

Create `assets/css/services.css` using existing site variables/classes where available and only service-specific layout rules. Required behavior:

```css
.public-nav { display:flex; align-items:center; gap:1.25rem; }
.public-nav a { color:inherit; text-decoration:none; font-weight:700; }
.public-nav a[aria-current="page"] { text-decoration:underline; text-underline-offset:.35rem; }
.service-hero, .service-section { width:min(1180px, calc(100% - 2rem)); margin-inline:auto; }
.service-hero { padding:clamp(4rem, 9vw, 8rem) 0; }
.service-hero h1 { max-width:900px; }
.service-actions { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:2rem; }
.service-button { display:inline-flex; min-height:48px; align-items:center; justify-content:center; padding:.75rem 1.1rem; border:1px solid currentColor; text-decoration:none; }
.service-grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:1rem; }
.service-card { padding:clamp(1.5rem, 4vw, 2.5rem); border:1px solid rgba(18,32,52,.16); background:#fff; }
.service-card--wide { grid-column:1 / -1; }
.price-treatment { margin-top:1.5rem; }
.process-list { display:grid; gap:1rem; padding-left:1.25rem; }
.consultation { margin-block:4rem; padding-block:3rem; border-top:1px solid rgba(18,32,52,.16); }
@media (max-width:720px) {
  .site-header.service-header { align-items:flex-start; gap:1rem; }
  .public-nav { gap:.85rem; flex-wrap:wrap; }
  .service-grid { grid-template-columns:1fr; }
  .service-card--wide { grid-column:auto; }
}
```

- [ ] **Step 3: Run the focused validator**

Run: `python tests/validate_services.py`

Expected: still FAIL only for missing root Services navigation and sitemap entry.

- [ ] **Step 4: Commit the services page**

```bash
git add services/index.html assets/css/services.css
git commit -m "feat: build Design Studio services page"
```

### Task 3: Connect Template Studio and Design Studio

**Files:**
- Modify: `index.html`
- Test: `tests/validate_services.py`

**Interfaces:**
- Consumes: `/services/` from Task 2.
- Produces: visible Templates/Services cross-navigation from the catalog without changing catalog filtering or purchase behavior.

- [ ] **Step 1: Add restrained navigation to the existing header**

Replace the existing header label-only treatment with a compact navigation while preserving the brand link:

```html
<header class="site-header">
  <a class="brand" href="/" aria-label="BRIOFRAME demo library home">
    <span class="brand__mark" aria-hidden="true">BR</span>
    <span class="brand__text">BRIOFRAME</span>
  </a>
  <nav class="public-nav" aria-label="Primary navigation">
    <a href="/" aria-current="page">Templates</a>
    <a href="/services/">Services</a>
  </nav>
</header>
```

Add `/assets/css/services.css` after `/assets/css/site.css` on the root page so the shared compact `.public-nav` rules apply without JavaScript.

- [ ] **Step 2: Convert the existing Design Studio note into a real service handoff**

Keep the existing explanatory copy and add this link inside `.service-note`:

```html
<a class="text-link" href="/services/">Explore Design Studio services <span aria-hidden="true">→</span></a>
```

- [ ] **Step 3: Run focused and existing validators**

Run:

```bash
python tests/validate_services.py
python tests/validate_site.py
python tests/validate_inventory.py
```

Expected: service validator now fails only for sitemap coverage; existing validators PASS.

- [ ] **Step 4: Commit cross-navigation**

```bash
git add index.html
git commit -m "feat: connect Template Studio to Design Studio"
```

### Task 4: Add SEO and Sitemap Coverage

**Files:**
- Modify: `sitemap.xml`
- Test: `tests/validate_services.py`

**Interfaces:**
- Consumes: canonical `/services/` URL.
- Produces: discoverable service path in the public sitemap.

- [ ] **Step 1: Add the canonical services URL**

Add this URL entry to `sitemap.xml` using the same formatting as existing entries:

```xml
<url>
  <loc>https://brioframe.github.io/services/</loc>
</url>
```

- [ ] **Step 2: Run the focused validator and verify GREEN**

Run: `python tests/validate_services.py`

Expected: `BRIOFRAME services validation passed`.

- [ ] **Step 3: Run the full release suite**

Run:

```bash
python tests/validate_site.py
python tests/validate_inventory.py
python tests/validate_services.py
node --check assets/js/library.js
node --check assets/js/demo-runtime.js
python -m json.tool data/templates.json > /dev/null
```

Expected: all commands exit 0.

- [ ] **Step 4: Commit sitemap coverage**

```bash
git add sitemap.xml
git commit -m "feat: publish Design Studio service URL"
```

### Task 5: Browser QA and Release Gate

**Files:**
- Modify only if QA finds a defect: `services/index.html`, `assets/css/services.css`, `index.html`
- Test: GitHub Actions `Validate BRIOFRAME public release`

**Interfaces:**
- Consumes: complete service implementation from Tasks 1-4.
- Produces: release-ready PR with responsive and navigation evidence.

- [ ] **Step 1: Open the feature branch preview or local static server at desktop width**

Verify `/services/` shows BRIOFRAME identity, Templates/Services navigation, two distinct primary service cards, Managed Launch scope, consultation-safe pricing treatment, and no transmitting form.

- [ ] **Step 2: Verify mobile behavior at approximately 390px width**

Confirm no persistent dropdown exists, navigation wraps compactly if needed, service cards become one column, headings do not overflow, and buttons remain at least 48px high.

- [ ] **Step 3: Verify customer paths**

Check these routes manually:

```text
/ → /services/
/services/ → /
/ → existing template demo
existing Available demo → exact existing Shopify product URL
/ → Aviation preview → no purchase URL
```

Expected: every path preserves its approved contract.

- [ ] **Step 4: Push/open PR and wait for GitHub Actions**

Expected workflow result: `Validate BRIOFRAME public release` = success, including `Validate Design Studio services`.

- [ ] **Step 5: Review changed files before merge**

Expected feature diff is limited to:

```text
tests/validate_services.py
.github/workflows/validate.yml
services/index.html
assets/css/services.css
index.html
sitemap.xml
```

plus the approved spec and this plan document. No KSK files, paid packages, or unrelated demos change.

- [ ] **Step 6: Merge only after green verification**

After merge, verify the main-branch validation workflow succeeds and GitHub Pages deploys the same main commit before reporting the service system live.

## Self-Review

- Spec coverage: customer journey, service separation, pricing safety, consultation safety, navigation, visual identity, SEO, sitemap, mobile behavior, existing catalog protection, and release validation are each assigned to a task.
- Placeholder scan: no implementation step relies on TBD/TODO or fabricated future values; unapproved pricing is represented by the exact approved consultation treatment.
- Type/name consistency: `/services/`, `tests/validate_services.py`, `.public-nav`, and the exact pricing treatment are used consistently across tasks.
