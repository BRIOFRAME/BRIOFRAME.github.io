# BRIOFRAME Commercial Release Foundation Design

## Purpose
Turn the completed 35-template public demo catalog into a safe commercial release pipeline without exposing paid source packages in the public GitHub repository.

## Architecture
The public GitHub repository remains the sanitized showroom. A separate private workspace on Links100 holds delivery-ready customer packages. A commerce manifest bridges public templates to verified Shopify products and prevents Preview items from becoming purchasable without a verified destination.

## Commercial states
Every template has exactly one state: `preview`, `ready`, or `live`.
- `preview`: demo may be public; purchase action is disabled.
- `ready`: commercial package passes local delivery validation but Shopify destination is not yet verified.
- `live`: package passes validation and an exact BRIOFRAME Shopify product URL has been verified.

## Public detail experience
Template detail pages explain target business, business outcome, included page types, responsive behavior, customization path, and demo capability. Copy must not invent licensing, support, fulfillment, pricing, or Shopify availability.

## Private delivery workspace
Create `C:\Users\NOVA\BRIOFRAME-commercial` outside the public repository. It contains manifests, package source folders, generated ZIP output, documentation templates, and validation scripts. Paid source files and generated customer ZIPs must never be copied into the public GitHub tree.
## Commerce verification
Shopify activation is fail-closed. A template cannot become `live` unless its exact product destination is verified against the BRIOFRAME store. The currently connected Shopify catalog did not expose BRIOFRAME products, so no Shopify writes are part of this stage until the correct store is verified.

## Automated protection
Validation must fail when:
- a `live` item lacks a verified Shopify destination;
- a `preview` item exposes a purchase URL;
- required package files are missing;
- protected package/ZIP paths appear inside the public repository;
- a public demo/detail path is broken;
- manifest slugs do not match the public catalog.

## Expansion contract
Future premium modules—AI/chat, booking, CRM/email capture, ecommerce/payments, memberships/subscriptions, multilingual support, analytics/conversion, accessibility, voice/Alexa, and industry modules—attach through explicit extension metadata rather than requiring core catalog redesign.

## Completion criteria
This foundation is complete when the public catalog validates against the commerce manifest, commercial states render correctly, the private workspace and package validator exist outside GitHub, protected-source leakage checks pass, existing Phase 3/4 regressions remain green, and no unverified Shopify link is exposed.

## Non-goals
No return to a 90-template target. No filler templates. No invented Shopify products, prices, licenses, support promises, or delivery claims. No paid source packages committed to the public repository.