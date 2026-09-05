# BRIOFRAME Generation 2 Premium Rebuild — Design Specification

## Decision

BRIOFRAME Phase 3 is a premium product reset, not an incremental expansion of the existing 26-template catalog.

The current 26 templates are classified as **Generation 1 legacy inventory**. They remain available until superior Generation 2 replacements are production-ready, then are retired category-by-category. Do not delete Gen 1 before replacements pass review.

## Goal

Build BRIOFRAME Generation 2 as a premium template studio whose products feel like bespoke professional agency work rather than recolored variants of a shared runtime skeleton.

The quality target is: **a buyer should feel they are receiving the design foundation of a multi-thousand-dollar custom website at template pricing.**

## Protected Baseline

- Production baseline: `5b75fe14035983be899e6674bc8087e41bf63401`
- Main remains protected while Gen 2 is developed.
- Existing Phase 0–2 routing, SEO foundations, accessibility utilities, validators, Shopify purchase architecture, sitemap logic, catalog taxonomy, and template-detail system should be reused where they remain sound.
- No production deletions or Gen 1 removals during initial Gen 2 development.

## Product Principles

1. **Business-first design** — each template starts from the target industry's customer journey, decision process, proof requirements, and conversion action.
2. **Visible originality** — customer-facing composition must be genuinely distinct between industries and between variants. Shared infrastructure is acceptable; shared visible skeletons are not.
3. **Three design directions per major industry** — variants must differ in hierarchy, composition, interaction pattern, pacing, art direction, and conversion strategy, not just color and imagery.
4. **Premium desktop and mobile** — mobile is designed intentionally rather than treated as a collapsed desktop layout.
5. **Conversion depth** — every template must include industry-specific trust signals, decision support, proof, objections, and calls to action.
6. **SEO by construction** — semantic headings, metadata, canonical URLs, structured data where appropriate, crawlable content, internal linking, and performance-conscious implementation.
7. **Accessibility by construction** — keyboard navigation, visible focus, landmarks, reduced-motion support, usable contrast, semantic forms, and meaningful labels.
8. **Original copy and structure** — no generic reusable service paragraphs across unrelated industries.
9. **No external template copying** — competitors may be studied for patterns and expectations, but BRIOFRAME compositions and code must be independently created.
10. **Gen 1 continuity** — keep legacy products live until Gen 2 replacements are approved.

## First Flagship Collection

The first Generation 2 collection establishes the standard before catalog scaling.

### Industry A — Corporate IT Services

Design directions:
- **Enterprise Command** — authoritative enterprise systems / managed services positioning, proof-heavy, executive confidence.
- **Modern Infrastructure** — contemporary technical systems presentation, architecture/service clarity, modern visual rhythm.
- **Executive Technology** — premium fractional CIO / strategic technology consulting, restrained luxury and high-trust presentation.

Primary conversion actions: schedule consultation, request assessment, discuss project.

Required industry modules: capabilities, environments/platforms, proof/metrics, engagement process, security/reliability language, case-study pattern, consultation CTA.

### Industry B — Luxury Catering

Design directions:
- **Editorial Luxury** — magazine-like hospitality storytelling and strong food/event art direction.
- **Private Dining** — intimate, high-touch experience emphasizing menus, chef/service approach, and exclusivity.
- **Modern Event Atelier** — event design + catering positioning with visually structured packages and inquiry flow.

Primary conversion actions: inquire for event, request proposal, explore menus.

Required industry modules: occasions, menu direction, presentation/service, gallery/art direction, event process, social proof, inquiry CTA.

### Industry C — DJ / Event Entertainment

Design directions:
- **Nightlife Editorial** — high-energy event storytelling and performance-forward composition.
- **Luxury Celebration** — weddings/private events with premium presentation and trust-first booking flow.
- **Production Studio** — DJ + lighting + sound + event production as a professional services system.

Primary conversion actions: check availability, request quote, book consultation.

Required industry modules: event types, experience/services, media/performance proof, packages or service logic, event workflow, testimonials, availability CTA.

### Industry D — Content Creator / Creator Portfolio

Design directions:
- **Editorial Creator** — strong personal brand, campaigns, press, portfolio.
- **Brand Partnership Studio** — conversion-focused for sponsorships and collaborations.
- **Creator Commerce** — content, products, services, newsletter/community pathway.

Primary conversion actions: work together, view media kit, inquire about partnership.

Required industry modules: featured work, audience/proof, partnership formats, selected campaigns, testimonials/press, inquiry CTA.

## Generation 2 Architecture

### Shared engineering layer

Reuse shared primitives only where they are invisible or utility-oriented:
- typography tokens
- spacing tokens
- focus/accessibility utilities
- button primitives
- form behavior
- reduced-motion helpers
- analytics/data hooks where already present
- demo notice / simulated-form safeguards
- purchase-link verification

### Template-specific layer

Each Gen 2 template owns:
- page composition
- layout logic
- content hierarchy
- section sequencing
- typography pairing/scale choices within approved brand constraints
- imagery/art-direction treatment
- motion choreography
- conversion pathway
- category-specific copy
- mobile composition decisions

A single runtime that swaps configuration values into the same visible page skeleton is prohibited for Gen 2.

## Catalog Model

Add explicit generation metadata to the catalog.

Expected fields for each template record:
- `generation`: `1` or `2`
- `status`: `legacy`, `flagship`, `available`, or `retired`
- `industry`
- `designDirection`
- `slug`
- `shopifyProductUrl`
- `availability`

Gen 1 records initially become `generation: 1`, `status: legacy` without changing public availability.

Gen 2 records are introduced only after their demos and QA are complete.

## Visual Quality Gate

A Gen 2 template fails review if any of these are true:
- it visually reads as a recolor of another template
- hero, proof, services, and CTA sequence substantially mirror another industry without business justification
- generic copy could be pasted into another industry unchanged
- mobile experience is merely stacked desktop content without intentional hierarchy
- spacing/typography feels default or framework-like
- there is no clear trust-building or conversion logic
- imagery is irrelevant, repetitive, low quality, or visually inconsistent
- interactions harm performance or accessibility

## Functional Quality Gate

Before approval each flagship must pass:
- current repository validators
- template-link verification
- simulated-form safeguards
- keyboard navigation
- no console errors
- responsive checks at representative mobile/tablet/desktop widths
- metadata/canonical verification
- sitemap/catalog consistency
- reduced-motion behavior
- no broken internal or purchase links

## Rollout Strategy

1. Preserve Gen 1 in production.
2. Build the Gen 2 architecture and one flagship first.
3. Validate the quality bar before multiplying the pattern.
4. Complete the first four-industry flagship collection.
5. Publish Gen 2 category replacements only after approval.
6. Retire corresponding Gen 1 products progressively.
7. Scale toward the broader catalog target using meaningful design directions, never filler variants.

## Non-Goals for Initial Gen 2 Phase

- Do not immediately build all 90 templates.
- Do not rebuild unrelated production infrastructure that is already working.
- Do not redesign Shopify itself in this phase.
- Do not remove all Gen 1 inventory before Gen 2 replacements exist.
- Do not introduce a heavy frontend framework unless a demonstrated requirement cannot be met with the current static architecture.

## Review Authority

Nova/BRIOFRAME review is a mandatory gate before merge or production replacement. CI passing alone does not qualify a Gen 2 template as premium-ready.
