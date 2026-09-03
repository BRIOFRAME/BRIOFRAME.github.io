# BRIOFRAME Services + Pricing Design

## Purpose

BRIOFRAME needs a public service path that clearly separates fast template purchasing from higher-touch custom work while preserving one coherent brand experience.

Template Studio remains the product-led path for customers who want to launch quickly from an existing BRIOFRAME template. Design Studio becomes the service-led path for customers who need customization, a fully custom website, or managed launch support.

## Customer Journey

The primary public flow will be:

1. Services overview
2. Template customization
3. Full custom website design
4. Starting-price guidance
5. Consultation call to action
6. Clear return path to Template Studio for customers better served by an existing template

The current template library remains the catalog experience and must not be converted into a crowded agency homepage.

## Information Architecture

### Existing Template Studio

The current `/` experience remains the public template library. It keeps its industry search, filters, demo cards, exact Shopify paths for purchasable templates, and preview-only treatment for non-purchasable concepts.

A restrained Design Studio navigation entry and service CTA will connect customers to the service path without interfering with catalog browsing.

### New Design Studio Service Pages

Create a focused `/services/` landing page with two primary service paths:

- **Template Customization** — for customers who choose an existing BRIOFRAME template but want BRIOFRAME to adapt it to their business, content, branding, and launch requirements.
- **Custom Website Design** — for customers whose needs justify a tailored structure, original page system, content architecture, and launch implementation.

The service landing page will explain the difference between these paths, show who each is for, display transparent starting-price guidance, and route serious prospects into a consultation action.

## Pricing Presentation

Pricing must be framed as **starting prices**, not fixed promises, because project complexity can vary.

The public structure should use three service tiers:

### Template Customization

Entry service for customers beginning with an existing BRIOFRAME template. Public pricing should communicate a clear starting point and that the template purchase itself is separate unless explicitly bundled later.

### Custom Website Design

Higher-value service for businesses requiring an original site structure rather than adaptation of an existing template. Public copy should emphasize strategy, tailored UX, responsive implementation, and launch readiness.

### Managed Launch / Expanded Scope

An optional higher-scope path for customers needing additional pages, migrations, integrations, content entry, or launch coordination. This is not positioned as an unlimited package and should route to consultation for scoping.

Exact dollar values must not be invented in the GitHub implementation. The implementation should use approved values only. Until approved service prices exist, the UI may use clearly marked `Starting price available during consultation` treatment rather than fabricated numbers.

## Conversion Structure

Each service page should follow this order:

1. Clear business-outcome hero
2. Who the service is for
3. What is included
4. Process / how BRIOFRAME works
5. Starting-price treatment
6. Boundaries and what may require additional scope
7. Consultation CTA
8. Cross-link to the other service path and Template Studio

The consultation CTA should not pretend a backend form exists if none is connected. Any public contact interaction must either point to an existing verified destination or be explicitly labeled as a non-transmitting demonstration until a real intake path is connected.

## Visual System

The service experience will use the established BRIOFRAME visual identity:

- cream / white base
- navy primary text and surfaces
- warm gold accents
- refined serif-led display typography
- restrained premium spacing
- strong mobile responsiveness
- clear hierarchy without visual clutter

The service pages should look like the same company as Template Studio while feeling more consultative and bespoke.

## Navigation

The public header should expose both arms without adding unnecessary menu complexity:

- Templates
- Services
- BRIOFRAME / home identity

Services should lead to `/services/`. Template links return to the existing catalog experience.

On mobile, navigation must remain compact and must not reproduce the previously observed persistent-dropdown behavior.

## SEO and Public Metadata

The new service pages require:

- unique title and meta description
- canonical URL
- inclusion in `sitemap.xml`
- semantic heading structure
- descriptive internal links between Template Studio and Design Studio

No schema markup will be added unless it can be accurate from current verified business information.

## Safety and Brand Boundaries

- Do not alter or remove the existing 16 purchasable template paths or the Aviation premium preview contract.
- Do not fabricate Shopify product URLs.
- Do not fabricate service prices, testimonials, client logos, client counts, project counts, or performance claims.
- Do not introduce KSK branding or content into BRIOFRAME public assets.
- Do not expose private customer files, fulfillment paths, credentials, or paid source packages.
- Public forms must not claim to transmit data unless a real verified intake endpoint exists.

## Technical Approach

Use static GitHub Pages-compatible HTML/CSS/JavaScript and follow the existing repository architecture. Prefer a shared service stylesheet and minimal JavaScript over adding a framework or build tool.

Expected implementation areas:

- `services/index.html`
- `assets/css/services.css`
- optional `assets/js/services.js` only if interaction requires it
- `index.html` for restrained cross-navigation
- `sitemap.xml`
- `tests/validate_site.py` and/or a focused service validator

The implementation should extend the current automated validation workflow so regressions in canonical URLs, navigation paths, service-page identity, sitemap coverage, fabricated pricing placeholders, and unverified contact behavior are caught before merge.

## Acceptance Criteria

The feature is ready when:

- `/services/` presents Template Customization and Custom Website Design as distinct service paths.
- Template Studio remains the existing catalog-first experience.
- Users can move between Templates and Services from desktop and mobile navigation.
- No unapproved price is displayed as fact.
- No fake purchase or contact endpoint exists.
- Service pages include canonical metadata and sitemap coverage.
- Automated tests validate the new public contract.
- Existing catalog and demo validators remain green.
- Final browser QA confirms responsive layout and correct internal navigation.
