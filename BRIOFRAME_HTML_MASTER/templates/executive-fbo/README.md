# Executive FBO — BRIOFRAME HTML Master

**Approved visual source:** Diffui Concept A — Executive FBO — **Option A** (`42eab6ff-151d-4069-a7a9-02f6d90cb082`)

**Status:** Milestone 1 (homepage architecture + responsive shell) — awaiting Darron review.

## Isolation

- Lives under `BRIOFRAME_HTML_MASTER/templates/` — not Shopify, not public demo library.
- Private Terminal (Concept C Option A) remains in `explorations/` only — not merged here.
- Aviation Operations remains **HOLD** — not built.

## Brand

- Identity B / Measured Leg tokens in `css/tokens.css`
- Logo: approved repo mark (`BR` lockup + BRIOFRAME wordmark) — **no invented wing marks**
- Favicon: `/assets/brand/favicon.svg` (serve from repository root)

## Preview

From the **repository root**:

```bash
python3 -m http.server 8080
```

Open:

http://localhost:8080/BRIOFRAME_HTML_MASTER/templates/executive-fbo/

Forms are **simulated** in this milestone.

## Structure

```text
executive-fbo/
  index.html
  css/tokens.css, base.css, components.css
  js/main.js
  assets/images/hero-arrival.webp  ← from approved Diffui Option A
```

## Next (after review)

- Replace placeholder hospitality photography with client/Links100 assets
- Additional interior pages (Services, Hangar, Contact)
- Wire forms to real endpoints
- Extract shared BRIOFRAME master partials if multiple templates share components
