# BRIOFRAME Public Demo Library Architecture

Date: 2026-08-30  
Status: Approved architecture  
Repository: `BRIOFRAME/BRIOFRAME.github.io`

## Purpose

This repository hosts public, browser-ready working demonstrations for BRIOFRAME Template Studio. Shopify remains the live sales storefront. Shopify Digital Products delivers protected customer ZIP packages after purchase.

## Security boundary

Only files required to render public demonstrations may be committed here. Never commit:

- customer ZIP files or paid source packages;
- Shopify theme packages, Liquid source exports, or product-delivery files;
- editable design masters;
- credentials, tokens, API keys, environment files, or customer information;
- internal pricing, vendor, operational, or fulfillment records;
- KSK files, assets, references, or repositories.

A working front-end demo is inherently viewable in a browser. Public demos must therefore be demo-specific builds, not the complete paid package.

## Repository structure

```text
/
├── index.html                  # BRIOFRAME demo-library landing page
├── 404.html                    # Branded recovery page
├── assets/                     # Shared public brand and interface assets
│   ├── css/
│   ├── js/
│   └── images/
├── data/
│   └── templates.json          # Public catalog metadata
├── demos/
│   └── <template-slug>/        # One isolated working demo per template
│       ├── index.html
│       └── assets/
├── docs/
│   └── architecture/
├── .gitignore
├── README.md
└── RIGHTS.md
```

## URL model

- Library: `https://brioframe.github.io/`
- Demo: `https://brioframe.github.io/demos/<template-slug>/`

Template slugs are lowercase, descriptive, and stable. Existing demo URLs are not renamed after Shopify products link to them.

## Catalog contract

Each public template record contains only:

- stable template ID and slug;
- public name, category, and short description;
- preview image path;
- demo URL;
- Shopify product URL;
- public availability state.

No download URL, private storage path, fulfillment identifier, customer data, or protected-package filename belongs in the public catalog.

## Demo requirements

Each demo must:

- run as a static GitHub Pages site;
- work on desktop and mobile;
- display BRIOFRAME demo identification and a return-to-library control;
- use nonfunctional or clearly simulated forms, checkout, account, and payment actions;
- link purchase calls to the corresponding Shopify product;
- contain no secrets, private APIs, customer data, or paid ZIP;
- remain isolated so one template cannot break another.

## Publishing workflow

1. Build and test the demo outside the public repository.
2. Remove protected, editable, customer, and fulfillment material.
3. Verify all links, responsive layouts, and simulated actions.
4. Verify the GitHub owner is `BRIOFRAME` and repository is `BRIOFRAME.github.io`.
5. Commit only the sanitized demo build and its public catalog entry.
6. Verify GitHub Pages deployment.
7. Test the public URL on desktop and mobile.
8. Add the verified demo URL to its Shopify product.

## Rights

This repository will not include an open-source license. Public visibility does not grant permission to resell, redistribute, repackage, or claim BRIOFRAME materials. A dedicated `RIGHTS.md` notice will state these restrictions.

## Recovery and change control

The `main` branch is the production source for GitHub Pages. Changes must use descriptive commits. Before every write, confirm both the signed-in GitHub owner and exact repository identity. If either differs from `BRIOFRAME/BRIOFRAME.github.io`, stop without writing.

## Success criteria

The architecture is complete when:

- GitHub Pages serves the BRIOFRAME library at the account-level URL;
- public demos load from stable `/demos/<slug>/` paths;
- Shopify product pages link to verified demos;
- protected paid ZIP files exist only in Shopify Digital Products;
- repository scans find no secrets, archives, customer data, paid packages, or KSK material.
