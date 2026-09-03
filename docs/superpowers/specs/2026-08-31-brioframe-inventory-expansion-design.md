# BRIOFRAME Inventory Expansion Design

## Objective
Expand the BRIOFRAME Template Studio public working-demo inventory to a locked target of **90 total premium templates**. The existing 16 published templates remain the validated commercial foundation, Altitude Aviation Services remains the first aviation preview, and the remaining inventory is built in controlled waves until the catalog reaches 90 distinct entries.

The objective is not raw quantity. Every additional template must be premium, commercially credible, visually and structurally distinct, responsive, sanitized for public demo use, and appropriate to its industry.

## Locked Inventory Target
- Total target: **90 templates**.
- Existing verified commercial foundation: **16 Available templates**.
- Existing premium preview: **1 Aviation template**.
- Remaining expansion requirement from the current 17-record baseline: **73 additional templates**.
- Most categories should carry 3–4 genuinely distinct variants where commercially appropriate.
- Variants must differ in information architecture, hero treatment, section order, conversion path, visual language, and buyer journey—not just color, imagery, or copy.

## Approved Industry Directions
The 90-template catalog may draw from the approved BRIOFRAME roadmap, including:
- Nail Salon & Nail Tech
- Braiding & Hair Stylist
- Wholesale & Distribution
- Corporate IT & Technology
- Law Firm & Legal Services
- Real Estate & Property
- Consulting & Coaching
- Healthcare & Medical
- Accounting & Tax
- Financial Advisory & Wealth
- Auto Detailing & Automotive
- Logistics & Freight
- Nonprofit & Community
- Dental & Medical Practice
- Daycare & Childcare
- Photography & Creative Studio
- HVAC & Home Services
- Luxury Catering & Events
- Fitness & Wellness
- Creator & Entertainment
- E-commerce
- Aviation
- Aviation Services
- Aircraft Detailing
- Aviation Catering
- Aviation Clubs
- Aviation Knowledge Library / Aviation Education Resource Portal
- Boating / Marine
- Fishing / Charter Fishing
- Clubs / Membership Organizations
- Villas / Luxury Villa & Vacation Property

Additional closely related commercial sub-verticals may be used when they improve catalog breadth without weakening the approved brand direction.

## Competitor Benchmark Rule
Before producing variants for a vertical, study current premium competitors and strong commercial website/template patterns. Use that research only to identify expectations, weaknesses, missed opportunities, conversion patterns, visual standards, and differentiation opportunities. Never copy competitor layouts, copy, imagery, branding, or protected creative expression.

Required sequence:
**Competitor benchmark → identify weaknesses/opportunities → design beyond benchmark → BRIOFRAME QA → publish only when premium standard is met.**

## Architecture
The existing GitHub Pages library remains catalog-driven through `data/templates.json`. Each template receives an isolated sanitized demo under `demos/<slug>/` plus a preview asset under `assets/previews/`. Public demos demonstrate layout, responsive behavior, navigation, service/product presentation, and simulated lead/booking interactions without exposing paid source packages, customer information, credentials, or fulfillment data.

Shared runtime code may support reusable behaviors, accessibility, form simulation, and catalog mechanics, but it must not force every template into the same structural design. Premium variants may use dedicated markup and stylesheet modules where necessary to preserve meaningful visual and structural differentiation.

Shopify remains the sales and payment destination. A public Shopify CTA may be added only after the exact BRIOFRAME product destination for that template has been verified. Until then, a completed design may be published as `Preview` without a fabricated purchase URL.

## Design Principles
- Every template must be structurally and visually distinct from its sibling variants and from the original Batch 1 foundation.
- Premium polish and conversion readiness take priority over speed.
- Desktop and mobile layouts must both be intentional and usable.
- Hero and interior imagery must be equally sharp and appropriate to the industry.
- Thumbnail imagery must match the actual demo identity and design.
- Navigation and CTA hierarchy must make the visitor's next action obvious.
- Forms, booking, checkout, account, quote, and private API behaviors remain simulated in public demos.
- Each template must reflect the needs of its vertical rather than forcing a generic site structure.
- The strongest, most premium templates should become the public face/featured showcase of BRIOFRAME Template Studio.
- Catalog imagery should remain inclusive across age, gender, and racial representation where people are shown.

## Initial Expansion Wave After the Existing 17
The first expansion wave should produce distinct premium concepts in four high-value directions:
1. Northstar Advisory Group — Professional Services / Consulting
2. Maison Élan Catering — Luxury Catering
3. Pulsewell Studio — Fitness / Wellness
4. Encore Creator Studio — Creator / Entertainment

These four are the first tranche, not the stopping point. Subsequent waves continue until the locked 90-template target is reached.

## Variant Families
Within a category, use multiple design families rather than repeated skins. Examples include:
- Editorial authority / trust-led
- High-conversion service / action-led
- Immersive visual / portfolio-led
- Operational / proof-and-metrics-led
- Boutique luxury / hospitality-led
- Community / membership-led
- Knowledge / resource-portal-led
- Commerce / catalog-led

A category with four variants should normally use at least three materially different structural families.

## Catalog and Sales Flow
Each released record uses the established catalog contract: `id`, `slug`, `name`, `category`, `description`, `previewImage`, `demoUrl`, `shopifyProductUrl`, and `availability`. IDs remain unique and slugs remain lowercase and stable. Library → Demo and Demo → exact Shopify product navigation must be verified before a template is labeled `Available` for purchase.

Industry search/filtering must remain usable as the catalog approaches 90 items; users should not be expected to scroll the entire inventory to find their industry.

## Security and Separation
- Repository owner must be `BRIOFRAME` and repository `BRIOFRAME.github.io` before every public write.
- No Kia Supreme Kreations material or branding may be accessed or committed.
- No paid source archives, customer files, credentials, secrets, fulfillment identifiers, or editable commercial masters may be published.
- No open-source license is added.
- Public visibility does not grant resale or redistribution rights.

## Validation and Release
Every expansion template must pass:
- catalog-schema and unique-ID/slug validation;
- preview and demo existence checks;
- BRIOFRAME demo identity marker validation;
- simulated-form disclosure validation where a form is shown;
- legacy/separate-brand text rejection;
- responsive/mobile QA;
- interior-image sharpness review;
- thumbnail-to-demo identity match;
- navigation and CTA checks;
- exact Shopify purchase-link verification before `Available` status;
- no invented Shopify product URL for `Preview` status.

The validator must be generalized away from a hard-coded 16/17-record ceiling so the catalog can grow safely to 90.

## Success Criteria
- The public catalog contains **90 premium, distinct templates**.
- The original 16 verified commercial templates remain functional.
- Existing Altitude Aviation Services remains functional as an aviation preview unless later promoted to Available with a verified Shopify URL.
- Each added template has a matching preview and working responsive demo.
- Variants within a category are materially different, not cosmetic reskins.
- Industry filtering remains fast and understandable at 90 items.
- Exact Shopify purchase CTAs are never guessed.
- Public demos remain sanitized and safe to expose.
- The strongest templates are clearly suitable to serve as BRIOFRAME's public showcase.
