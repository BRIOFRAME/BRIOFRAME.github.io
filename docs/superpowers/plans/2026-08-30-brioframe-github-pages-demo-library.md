# BRIOFRAME GitHub Pages Demo Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a secure-by-design BRIOFRAME GitHub Pages shell for public working demos while keeping paid customer packages exclusively in Shopify Digital Products.

**Architecture:** `BRIOFRAME/BRIOFRAME.github.io` serves one account-level static site from `main`. A catalog-driven landing page reads sanitized public metadata from `data/templates.json`; each demo is isolated under `demos/<template-slug>/`. Repository guardrails and a standard-library validation script prevent archives, secrets, customer material, KSK material, and fulfillment identifiers from entering the public tree.

**Tech Stack:** GitHub Pages, semantic HTML5, CSS3, vanilla JavaScript, JSON, Python 3 standard library

**Spec:** `docs/architecture/2026-08-30-brioframe-demo-library-design.md`

## Global Constraints

- Shopify remains the live BRIOFRAME sales storefront.
- Shopify Digital Products is the only delivery location for protected customer ZIP packages.
- The GitHub owner must be `BRIOFRAME` and repository must be `BRIOFRAME.github.io` before every write.
- No KSK files, assets, references, repositories, or branding may be accessed or committed.
- No open-source license may be added.
- Public demos are sanitized, browser-ready demonstrations, never complete paid source packages.
- Template slugs are lowercase, descriptive, stable, and must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- Forms, checkout, account, payment, and private API behavior in demos must be nonfunctional or clearly simulated.
- Every task ends with `python3 tests/validate_site.py` passing before commit.

## File map

- `.gitignore`: blocks archives, source packages, credentials, editable masters, customer exports, and platform packages.
- `RIGHTS.md`: BRIOFRAME copyright and no-resale/no-redistribution notice.
- `README.md`: public purpose, boundaries, structure, publishing checklist, and Shopify relationship.
- `tests/validate_site.py`: dependency-free structural, catalog, link, forbidden-file, and forbidden-text checks.
- `data/templates.json`: sanitized public catalog; starts as an empty JSON array until a reviewed demo is ready.
- `assets/css/site.css`: BRIOFRAME cream, navy, warm-gold, responsive presentation system.
- `assets/js/library.js`: catalog loading, safe card rendering, empty state, and load-error state.
- `index.html`: public BRIOFRAME Template Studio demo-library shell.
- `404.html`: branded recovery page returning visitors to the library.
- `demos/README.md`: exact contract for adding one isolated sanitized demo.
- `.nojekyll`: forces direct static-file publication.
- `docs/operations/publishing-checklist.md`: repeatable pre-publication and Shopify-linking procedure.

---

### Task 1: Repository protection guardrails

**Files:**
- Create: `tests/validate_site.py`
- Create: `.gitignore`
- Create: `RIGHTS.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: repository tree rooted at the script's parent directory.
- Produces: command `python3 tests/validate_site.py` with exit code 0 on a safe tree and nonzero on violations.

- [ ] **Step 1: Write the failing validator**

Create `tests/validate_site.py` with:

```python
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_SUFFIXES = {".zip", ".7z", ".rar", ".env", ".liquid", ".psd", ".ai", ".sketch"}
FORBIDDEN_PARTS = {"customer-files", "paid-source", "shopify-export", "fulfillment"}
FORBIDDEN_TEXT = re.compile(r"(api[_-]?key|access[_-]?token|private[_-]?key|Kia Supreme Kreations|\bKSK\b)", re.I)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

errors = []
for path in ROOT.rglob("*"):
    if ".git" in path.parts or not path.is_file():
        continue
    rel = path.relative_to(ROOT)
    if path.suffix.lower() in FORBIDDEN_SUFFIXES:
        errors.append(f"forbidden file type: {rel}")
    if any(part.lower() in FORBIDDEN_PARTS for part in rel.parts):
        errors.append(f"forbidden path: {rel}")
    if path.suffix.lower() in {".md", ".html", ".css", ".js", ".json", ".txt"}:
        text = path.read_text(encoding="utf-8", errors="ignore")
        if FORBIDDEN_TEXT.search(text):
            errors.append(f"forbidden text: {rel}")

catalog_path = ROOT / "data" / "templates.json"
if catalog_path.exists():
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    if not isinstance(catalog, list):
        errors.append("catalog root must be an array")
    else:
        required = {"id", "slug", "name", "category", "description", "previewImage", "demoUrl", "shopifyProductUrl", "availability"}
        for index, item in enumerate(catalog):
            missing = required - set(item)
            if missing:
                errors.append(f"catalog[{index}] missing: {sorted(missing)}")
            if "slug" in item and not SLUG.fullmatch(item["slug"]):
                errors.append(f"catalog[{index}] invalid slug")
            for forbidden in {"downloadUrl", "packagePath", "customerId", "fulfillmentId", "protectedFilename"}:
                if forbidden in item:
                    errors.append(f"catalog[{index}] forbidden key: {forbidden}")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print("BRIOFRAME public-site validation passed")
```

- [ ] **Step 2: Run the validator and confirm the safety test fails**

Run: `python3 tests/validate_site.py`  
Expected: FAIL because the architecture specification deliberately contains the forbidden KSK safety term.

- [ ] **Step 3: Scope forbidden-text scanning to publishable content**

Change the text-scan condition to exclude `docs/`, `tests/`, and `README.md`:

```python
publishable = rel.parts[0] not in {"docs", "tests"} and rel.name != "README.md"
if publishable and path.suffix.lower() in {".html", ".css", ".js", ".json", ".txt"}:
    text = path.read_text(encoding="utf-8", errors="ignore")
    if FORBIDDEN_TEXT.search(text):
        errors.append(f"forbidden text: {rel}")
```

- [ ] **Step 4: Add ignore and rights policies**

Create `.gitignore` containing:

```gitignore
*.zip
*.7z
*.rar
*.env
.env.*
*.liquid
*.psd
*.ai
*.sketch
*.fig
customer-files/
paid-source/
protected-packages/
shopify-export/
fulfillment/
vendor-private/
credentials/
.DS_Store
Thumbs.db
```

Create `RIGHTS.md` stating that BRIOFRAME retains all rights and prohibits resale, redistribution, repackaging, source extraction for commercial reuse, and false attribution; clarify that public visibility is not an open-source license.

- [ ] **Step 5: Replace README with the operational boundary**

Document the public-demo purpose, Shopify sales and delivery roles, repository tree, prohibited material, validation command, and the rule that every write requires visible verification of `BRIOFRAME/BRIOFRAME.github.io`.

- [ ] **Step 6: Run validation**

Run: `python3 tests/validate_site.py`  
Expected: `BRIOFRAME public-site validation passed`

- [ ] **Step 7: Commit**

```bash
git add .gitignore RIGHTS.md README.md tests/validate_site.py
git commit -m "chore: add public repository protection guardrails"
```

### Task 2: Public catalog contract and rendering logic

**Files:**
- Create: `data/templates.json`
- Create: `assets/js/library.js`
- Modify: `tests/validate_site.py`

**Interfaces:**
- Consumes: JSON array at `/data/templates.json`.
- Produces: safe cards inside `#template-grid`, status text inside `#library-status`, and links limited to `demoUrl` and `shopifyProductUrl`.

- [ ] **Step 1: Add failing catalog existence assertions**

Add assertions that `data/templates.json` and `assets/js/library.js` exist. Run the validator and expect failure naming both missing files.

- [ ] **Step 2: Create the empty sanitized catalog**

Create `data/templates.json` containing exactly:

```json
[]
```

- [ ] **Step 3: Implement safe catalog rendering**

Create `assets/js/library.js` using `fetch("/data/templates.json")`, `document.createElement`, and `textContent` only. For each record render its public name, category, description, preview image, “View working demo” link, and “View in Shopify” link. Render “Working demos are being prepared” for an empty array and a clear retry message on fetch failure. Do not use `innerHTML`.

- [ ] **Step 4: Extend validator checks**

Require every `demoUrl` to equal `/demos/{slug}/`, every preview path to begin `/assets/`, every Shopify URL to use HTTPS, and every catalog ID to be unique.

- [ ] **Step 5: Run validation and commit**

Run: `python3 tests/validate_site.py`  
Expected: PASS

```bash
git add data/templates.json assets/js/library.js tests/validate_site.py
git commit -m "feat: add sanitized public template catalog"
```

### Task 3: Branded GitHub Pages shell

**Files:**
- Create: `index.html`
- Create: `404.html`
- Create: `assets/css/site.css`
- Create: `.nojekyll`
- Modify: `tests/validate_site.py`

**Interfaces:**
- Consumes: `/assets/css/site.css`, `/assets/js/library.js`, and catalog-rendering DOM IDs.
- Produces: responsive library at `/` and recovery route at `/404.html`.

- [ ] **Step 1: Add failing HTML contract checks**

Require `index.html`, `404.html`, `assets/css/site.css`, and `.nojekyll`; assert `index.html` contains one `id="template-grid"`, one `id="library-status"`, a stylesheet link, and a deferred library script. Run and expect missing-file failures.

- [ ] **Step 2: Create semantic library HTML**

Build `index.html` with skip link, header wordmark, “BRIOFRAME Template Studio” hero, explanation that Shopify handles secure purchase and delivery, status region, template grid, Design Studio cross-reference, and footer rights notice. Use only public copy; do not embed customer, fulfillment, or package information.

- [ ] **Step 3: Create the visual system**

Implement cream/white foundation, navy `#10243E`, warm gold `#C39A4A`, refined serif headings, accessible focus states, responsive cards, and a single-column mobile layout in `assets/css/site.css`.

- [ ] **Step 4: Create recovery and static marker files**

Create `404.html` with a branded explanation and absolute return link `/`. Create an empty `.nojekyll` file.

- [ ] **Step 5: Validate and commit**

Run: `python3 tests/validate_site.py`  
Expected: PASS

```bash
git add index.html 404.html assets/css/site.css .nojekyll tests/validate_site.py
git commit -m "feat: add BRIOFRAME GitHub Pages library shell"
```

### Task 4: Demo publishing contract and operations

**Files:**
- Create: `demos/README.md`
- Create: `docs/operations/publishing-checklist.md`
- Modify: `tests/validate_site.py`

**Interfaces:**
- Consumes: a sanitized demo folder and matching catalog record.
- Produces: a repeatable publication gate before a Shopify product receives a demo URL.

- [ ] **Step 1: Add failing operations-file assertions**

Require both operations documents. Run the validator and expect both missing-file failures.

- [ ] **Step 2: Document the demo-folder contract**

Specify required `demos/<slug>/index.html`, local `assets/`, BRIOFRAME demo badge, return-to-library link, Shopify product link, mobile behavior, simulated-form labeling, and prohibition on protected packages or private integrations.

- [ ] **Step 3: Document the publishing checklist**

Include local validation, forbidden-file scan, owner/repository verification, descriptive commit, Pages deployment check, desktop and mobile checks, public URL verification, and only then adding the demo URL to Shopify.

- [ ] **Step 4: Extend validator for demo isolation**

For each catalog record, require `demos/<slug>/index.html` and check that the demo contains a `/` return link and the same Shopify product URL as the catalog.

- [ ] **Step 5: Validate and commit**

Run: `python3 tests/validate_site.py`  
Expected: PASS with the empty catalog.

```bash
git add demos/README.md docs/operations/publishing-checklist.md tests/validate_site.py
git commit -m "docs: add controlled demo publishing workflow"
```

### Task 5: GitHub Pages publication and verification

**Files:**
- Modify: repository Pages settings only.
- Verify: public URLs and GitHub Actions deployment.

**Interfaces:**
- Consumes: `main` branch root.
- Produces: public site `https://brioframe.github.io/`.

- [ ] **Step 1: Run final repository validation**

Run: `python3 tests/validate_site.py`  
Expected: PASS

- [ ] **Step 2: Verify repository identity immediately before settings write**

Confirm the browser shows owner `BRIOFRAME`, repository `BRIOFRAME.github.io`, visibility `Public`, and branch `main`. Stop if any value differs.

- [ ] **Step 3: Configure Pages**

In Settings → Pages, select “Deploy from a branch,” branch `main`, folder `/(root)`, then save.

- [ ] **Step 4: Verify deployment**

Wait for the Pages workflow to complete successfully. Open `https://brioframe.github.io/` and verify the BRIOFRAME hero, library status, stylesheet, JavaScript, and no console errors.

- [ ] **Step 5: Verify responsive behavior and recovery**

Test desktop and narrow mobile widths. Open a nonexistent safe path and confirm the branded 404 returns to the library.

- [ ] **Step 6: Security audit**

Confirm the repository tree contains no archives, paid source packages, credentials, customer data, fulfillment identifiers, editable masters, or KSK material. Confirm no Shopify protected download URL is present.

- [ ] **Step 7: Record completion**

Report every file created or modified, every repository setting changed, commit SHAs, Pages deployment result, verified public URL, security-audit result, and explicitly state that Shopify and KSK were not modified.
