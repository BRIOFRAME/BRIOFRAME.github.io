# Phase 2 — Template detail experience

Date: 2026-09-04  
Status: Implemented on branch (pending Nova review)

## Goal

Improve discovery → trust → purchase conversion without changing Phase 1 filter behavior.

## URL / deep-link strategy

Stable canonical detail routes:

`https://brioframe.github.io/templates/<slug>/`

- One thin static HTML shell per catalog slug (unique title, meta description, canonical, Open Graph/Twitter, JSON-LD Product).
- Shared runtime: `/assets/js/template-detail.js` loads `templates.json` + `taxonomy.json` and renders the detail body.
- Library cards deep-link to the matching detail route.
- Phase 1 library filter query params remain on `/` only (`q`, `industry`, `category`, `availability`) and are unchanged.

## Card upgrades

Cards keep existing demo and Shopify URLs / availability rules, and add:

- Stronger industry / specialty / availability hierarchy
- Title + preview image link to template details
- Explicit “View template details” link
- Clear primary (“View working demo”) vs secondary (“View in Shopify”) actions

## Detail content (from existing catalog data)

Rendered fields: name, industry label, specialty/category, description, availability, demo CTA, Shopify CTA when Available.

Derived (not new commercial claims):

- Key features from industry, specialty, tags, availability
- Shared launch notes for responsive/mobile-ready, SEO-ready structure, and Design Studio customization path

Design Studio CTA links to `/#design-studio`.

## Phase 1 risk controls

- No changes to taxonomy IDs, demo URLs, Shopify URLs, or availability values
- Filter matching, URL hydration, chips, empty state, and popstate handlers remain in `library.js`
- Detail pages are additive routes; sitemap/validators updated to include them
