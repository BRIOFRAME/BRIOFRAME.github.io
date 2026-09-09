# BRIOFRAME Industry-Differentiated Template System — Design Spec

## Goal
Replace the current repeated-layout catalog feel with genuinely distinct, premium HTML/CSS/JS experiences by industry while preserving BRIOFRAME quality, responsiveness, accessibility, and commerce integration.

## Locked design rules
- No shared page skeleton with only image/copy/color swaps.
- HTML templates may and should reach premium Shopify-theme-level visual polish without becoming Shopify Liquid themes.
- Each industry gets its own information architecture, hero composition, navigation behavior, section rhythm, typography pairing, imagery treatment, CTA model, and motion language.
- Templates inside the same industry must still vary meaningfully.
- Preserve local demo media and self-contained preview generation; no external image dependencies.
- Preserve working detail/demo/purchase paths and mobile behavior.
- Do not merge or deploy PR #12 until Darron visually approves the differentiated catalog.

## Industry directions
- Beauty: editorial luxury, immersive service/product storytelling, appointment-led conversion.
- Aviation: cinematic precision, fleet/services/capability modules, technical trust.
- Legal/Professional: restrained authority, practice-area/case/credential architecture.
- Automotive: performance-led, before/after galleries, packages, booking conversion.
- Hospitality/Villas/Marine: destination immersion, property/vessel storytelling, availability/inquiry flow.
- Wholesale/Operations/Logistics: structured operational catalog, capabilities, proof, quote flow.
- Healthcare/Wellness: calm clinical trust, provider/services, insurance/appointment path.- Technology/Consulting/Finance: modern systems credibility, outcomes, proof, lead qualification.
- Community/Club/Creator/Nonprofit: membership/content/community-first structures rather than commercial-service clones.

## Acceptance criteria
A reviewer looking at cards or full demos should not reasonably describe the catalog as the same website with different photos and words. Representative desktop and mobile screenshots must show obvious structural differentiation across industries. All existing release validators must pass after being updated only where prior tests encode obsolete assumptions.
## Optional media capability
Selected templates where motion materially improves the customer experience must offer a media-player variant rather than forcing video into every template.

Appropriate families include aviation, hospitality/villas, automotive, photography/creator, clubs/events, media/publication-style experiences, and selected premium service sites.

The module must be reusable and serviceable by BRIOFRAME: responsive player shell, poster image, native controls, captions/accessibility hooks, lazy loading, reduced-motion awareness, and clean source adapters for local/hosted video or future embedded providers. Autoplay with sound is prohibited.

## Optional slider and gallery capability
Selected image-rich templates may include reusable sliders, carousels, before/after views, lightboxes, and gallery variants where they support the industry experience.

Priority families include Beauty, Automotive, Villas/Hospitality, Aviation, Photography/Creator, Marine, Catering, Real Estate, and portfolio-heavy services.

Gallery modules must be responsive, touch/swipe friendly, keyboard accessible, lazy-loaded, preserve image proportions, support optional thumbnails/lightbox behavior, and remain modular so BRIOFRAME can service and upgrade them independently.
