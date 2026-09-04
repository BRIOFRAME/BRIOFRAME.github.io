# Phase 2 — Template detail experience

Date: 2026-09-04  
Status: Implemented on branch (pending Nova re-review)

## Goal

Improve discovery → trust → purchase conversion without changing Phase 1 filter behavior.

## URL / deep-link strategy

Stable canonical detail routes:

`https://brioframe.github.io/templates/<slug>/`

- Generated static HTML includes meaningful core commercial content (H1, industry/specialty, description, preview image, demo CTA, Shopify CTA when available, Design Studio CTA).
- Unique title, meta description, canonical, Open Graph/Twitter (including preview `og:image` / `twitter:image`), and Product JSON-LD.
- Shared runtime `/assets/js/template-detail.js` progressively enhances with feature/launch notes and must not duplicate the static core.
- Library cards deep-link to the matching detail route.
- Phase 1 library filter query params remain on `/` only (`q`, `industry`, `category`, `availability`).

## Structured data

Product JSON-LD includes name, description, brand, category, URL, and image.

`offers` is included only when the catalog record already contains authoritative `price` and `priceCurrency`. Incomplete offers are rejected by validators. Current catalog has no authoritative pricing, so generated pages omit `offers`.

## Phase 1 risk controls

- No changes to taxonomy IDs, demo URLs, Shopify URLs, or availability values
- Filter matching, URL hydration, chips, empty state, and popstate handlers remain in `library.js`
- Detail pages are additive routes; sitemap/validators updated to include them
