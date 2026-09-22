# Executive FBO — Build Milestone 1

**Date:** 2026-09-22  
**Source:** Approved Diffui Concept A Option A (no regeneration)  
**Pipeline doc:** `docs/operations/BRIOFRAME_MASTER_PIPELINE.md` was not present in this repository at build time; this milestone follows the Nova/Darron brief and `BRIOFRAME_HTML_MASTER/explorations/` rules.

## Execution protocol (engineering)

| State | Status | Evidence |
|---|---|---|
| CONNECTED | YES | Approved Diffui Option A assets on disk; hero copied to `assets/images/hero-arrival.webp` |
| SUBMITTED | N/A | No Diffui spend this step |
| RUNNING | YES | HTML/CSS/JS implementation |
| COMPLETED | YES | Milestone files committed |
| VERIFIED | YES | Local HTTP preview + file inspection |

## Sections implemented

1. Sticky header with services menu, amenities, hangar, contact, Service Request CTA  
2. Full-bleed hero with scrim, dual CTAs (Service Request + Arrival Notification)  
3. Nine-step service journey (tablist + panels, keyboard arrows)  
4. Hospitality split section with amenity list  
5. Arrival conversion band  
6. Footer  
7. Two `<dialog>` forms (simulated)

## Responsive / interactive

- Mobile nav toggle (< 900px)  
- Horizontal scroll journey tabs on small screens  
- Stacked hospitality and CTA layouts  
- Focus-visible rings, skip link, semantic landmarks  
- `prefers-reduced-motion` disables hero motion  
- Dialog open/close via native `<dialog>`

## Reusable modules

- Design tokens (`css/tokens.css`)  
- Button variants (`.bf-btn--ink`, `--gold`, `--ghost`)  
- Brand lockup (`.bf-brand`)  
- Hero pattern (`.bf-hero`)  
- Journey tablist (`.bf-journey`)  
- Hospitality split (`.bf-hospitality`)  
- CTA band (`.bf-cta-band`)  
- Dialog + form pattern (`.bf-dialog`, `.bf-form`)

## From Diffui Option A specifically

- Headline/subhead copy direction  
- Dual conversion CTAs in hero  
- Numbered horizontal service journey (9 FBO stages)  
- Hospitality + amenities band structure  
- Bottom “Let us know you’re arriving” conversion strip  
- Cream / deep ink / warm gold presentation  
- Hero photography sourced from approved Diffui generation file

## Remains

- Client-specific copy, photography (lounge), Links100 logo variants if distinct from public BR mark  
- Inner pages, hangar detail, legal/privacy  
- Production form endpoints and validation  
- Performance pass (self-host fonts optional)  
- Private Terminal build (separate approved direction — not started)  
- Aviation Operations (HOLD)
