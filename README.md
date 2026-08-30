# BRIOFRAME Public Demo Library

This repository powers the public working-demo library for BRIOFRAME Template Studio at `https://brioframe.github.io/`.

## Platform roles

- **Shopify:** BRIOFRAME's live sales storefront.
- **GitHub Pages:** public, browser-ready working demonstrations.
- **Shopify Digital Products:** protected delivery of paid customer ZIP packages.

No paid package, customer file, credential, editable design master, Shopify theme export, or fulfillment record belongs in this public repository.

## Planned structure

```text
/
├── index.html
├── 404.html
├── assets/
├── data/templates.json
├── demos/<template-slug>/
├── docs/
├── tests/validate_site.py
├── .gitignore
├── .nojekyll
└── RIGHTS.md
```

## Validation

Run before every commit:

```bash
python3 tests/validate_site.py
```

## Publishing boundary

Only sanitized files required to render a public demonstration may be committed. Each demo must clearly identify itself as a demonstration, use simulated forms and commerce actions, and direct purchases to its corresponding BRIOFRAME Shopify product.

Before every GitHub write, visibly confirm that the signed-in owner is `BRIOFRAME` and the repository is `BRIOFRAME.github.io`. Stop without writing if either identity differs.

See [RIGHTS.md](RIGHTS.md) for usage restrictions and [the approved architecture](docs/architecture/2026-08-30-brioframe-demo-library-design.md) for the complete operating model.
