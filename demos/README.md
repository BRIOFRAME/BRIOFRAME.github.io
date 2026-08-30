# BRIOFRAME Demo Folder Contract

Each public working demonstration lives in an isolated folder using this structure:

```text
demos/<template-slug>/
├── index.html
└── assets/
    ├── css/
    ├── js/
    └── images/
```

## Required behavior

- The slug must be lowercase, descriptive, hyphen-separated, and permanent after Shopify links to it.
- `index.html` must render without a build server or private API.
- The page must identify itself as a BRIOFRAME working demonstration.
- A visible link must return to the library at `/`.
- The purchase action must use the exact HTTPS Shopify product URL listed in `data/templates.json`.
- Forms, checkout, account, payment, quote, and submission actions must be disabled or clearly labeled as simulated.
- Layout and navigation must work on desktop and mobile.
- Assets must remain inside the demo folder unless they are approved shared BRIOFRAME public assets.

## Prohibited content

Never include paid ZIP packages, editable masters, customer information, credentials, tokens, private integrations, platform exports, fulfillment identifiers, vendor records, or protected package filenames.

Run `python3 tests/validate_site.py` before every commit. A demo is not ready for Shopify linking until its public Pages URL has been verified on desktop and mobile.
