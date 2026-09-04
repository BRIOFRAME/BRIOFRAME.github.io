# BRIOFRAME Catalog Taxonomy (Phase 1)

Date: 2026-09-04  
Status: Phase 1 implementation  
Repository: `BRIOFRAME/BRIOFRAME.github.io`

## Purpose

Provide a stable industry taxonomy so the public demo library can scale toward 90 templates without hardcoding filter logic into page markup.

## Model

- `data/taxonomy.json` — source of truth for industry groups (`id`, `label`, `order`).
- `data/templates.json` — one record per template.
  - `industry` — stable taxonomy id (filter key).
  - `category` — specialty label shown on cards (existing commercial wording preserved).
  - `tags` — optional search keywords; not shown as primary UI chips in Phase 1.
  - Existing commercial fields (`id`, `slug`, `name`, `description`, `previewImage`, `demoUrl`, `shopifyProductUrl`, `availability`) remain unchanged in meaning.

## Library filtering

The library supports:

1. Free-text search across name, industry label, specialty, tags, description, and availability.
2. Industry dropdown (taxonomy-backed; only industries with published templates are listed).
3. Specialty dropdown (categories scoped to the selected industry when one is chosen).
4. Availability dropdown (`Available` / `Preview`).
5. Clearable active-filter chips and shareable query params (`q`, `industry`, `category`, `availability`).

Demo URLs, Shopify URLs, sitemap rules, and Phase 0 SEO constraints are unchanged.
