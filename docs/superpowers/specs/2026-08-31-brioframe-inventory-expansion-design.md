# BRIOFRAME Inventory Expansion Design

## Objective
Expand the BRIOFRAME Template Studio public working-demo inventory beyond the validated Batch 1 baseline, prioritizing revenue-ready breadth while preserving the secure GitHub Pages → Shopify purchase architecture.

## Approved Starting Wave
1. Northstar Advisory Group — Professional Services
2. Maison Élan Catering — Luxury Catering
3. Pulsewell Studio — Fitness / Wellness
4. Encore Creator Studio — Creator / Entertainment

This wave is not the stopping point. Subsequent waves should broaden BRIOFRAME into additional approved commercial verticals while maintaining distinct visual and conversion structures.

## Architecture
The existing GitHub Pages library remains catalog-driven through `data/templates.json`. Each template receives an isolated sanitized demo under `demos/<slug>/` plus a preview asset under `assets/previews/`. Public demos demonstrate layout, responsive behavior, navigation, service/product presentation, and simulated lead/booking interactions without exposing paid source packages, customer information, credentials, or fulfillment data.

Shopify remains the sales and payment destination. A public Shopify CTA may be added only after the exact BRIOFRAME product destination for that template has been verified. Until then, a template may be built and validated without a fabricated purchase URL.

## Design Principles
- Every template must be structurally and visually distinct, not a reskin of Batch 1 or another expansion template.
- Premium polish and conversion readiness take priority over raw inventory count.
- Desktop and mobile layouts must both be intentional and usable.
- Navigation and CTA hierarchy must make the visitor's next action obvious.
- Forms, booking, checkout, account, quote, and private API behaviors remain simulated in public demos.
- Each template should reflect the needs of its vertical rather than forcing a generic site structure.

## Starting-Wave Concepts
### Northstar Advisory Group
Executive professional-services presentation focused on credibility, expertise, service lines, outcomes, insights, and consultation conversion. Corporate editorial structure with restrained premium styling.

### Maison Élan Catering
Editorial luxury-catering presentation focused on events, signature menus, presentation imagery, service occasions, process, testimonials, and inquiry conversion. Hospitality-first structure rather than a generic restaurant layout.

### Pulsewell Studio
Energetic wellness studio presentation focused on programs/classes, instructor credibility, schedule discovery, membership pathways, transformation benefits, and simulated trial/booking conversion.

### Encore Creator Studio
Media-forward creator/entertainment presentation focused on portfolio/showreel, services, collaborations, audience proof, featured work, and booking/contact conversion. Designed to feel materially different from corporate or commerce templates.

## Catalog and Sales Flow
Each released record uses the established catalog contract: `id`, `slug`, `name`, `category`, `description`, `previewImage`, `demoUrl`, `shopifyProductUrl`, and `availability`. IDs remain unique and slugs remain lowercase and stable. Library → Demo and Demo → exact Shopify product navigation must be verified before a template is labeled Available for purchase.

## Security and Separation
- Repository owner must be `BRIOFRAME` and repository `BRIOFRAME.github.io` on `main` before every public write.
- No Kia Supreme Kreations material or branding may be accessed or committed.
- No paid source archives, customer files, credentials, secrets, fulfillment identifiers, or editable commercial masters may be published.
- No open-source license is added.
- Public visibility does not grant resale or redistribution rights.

## Validation and Release
Every expansion template must pass the existing repository validator, basic JavaScript syntax validation where applicable, responsive/live-browser QA, internal navigation checks, and exact purchase-link verification when a Shopify product URL is present. Batch 1 remains unchanged except for shared-library changes required to display additional validated inventory.

## Expansion Strategy After Starting Wave
Continue with additional approved verticals in revenue-oriented waves, favoring categories with clear small-business demand and strong visual differentiation. Approved directions include aviation and aviation services, aircraft detailing, aviation catering, aviation clubs/knowledge resources, boating/marine, fishing/charter fishing, clubs/membership organizations, villas/luxury vacation properties, wholesale/distributor, beauty, food/catering, professional services, fitness/wellness, creator/entertainment, and e-commerce.

## Success Criteria
- Batch 1 remains functional and unchanged in behavior.
- Four starting-wave demos are distinct, responsive, sanitized, and validator-clean.
- The public library can present the new inventory without breaking existing cards.
- Exact Shopify purchase CTAs are never guessed.
- Expansion can continue in repeatable waves without restructuring the core library architecture.
