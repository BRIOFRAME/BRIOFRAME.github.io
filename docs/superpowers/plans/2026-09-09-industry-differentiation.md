# BRIOFRAME Industry Differentiation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the catalog so each industry has a distinct premium HTML experience comparable in polish to high-end Shopify themes.

**Architecture:** Keep the current catalog/detail/demo pipeline, but introduce industry-specific layout systems instead of a single repeated composition. Preserve local media, preview generation, responsive behavior, and commerce state while redesigning representative templates first and propagating only industry-appropriate patterns.

**Tech Stack:** HTML5, CSS, JavaScript, Python validators/generators, Playwright screenshot tooling.

**Spec:** docs/superpowers/specs/2026-09-09-industry-differentiation-design.md

## Global Constraints
- No template-family cloning by copy/image/color swap.
- Premium Shopify-theme-level visual polish is the benchmark; output remains HTML/CSS/JS.
- Preserve local demo media and self-contained previews.
- Desktop and mobile must both be reviewed.
- PR #12 must not merge/deploy without explicit user visual approval.

---

### Task 1: Lock differentiated visual contract
**Files:** Modify `tests/validate_premium_visuals.py`; Create `tests/validate_industry_differentiation.py`.
- [ ] Add failing assertions that local `/assets/demo-media/*.jpg` is valid premium photography when the file exists and is substantive.
- [ ] Add structural-signature checks that representative industry templates do not all expose the same hero/section sequence.
- [ ] Run tests and confirm the new differentiation check fails against the current repeated layouts.
- [ ] Implement only the validator changes required to represent the new contract.
- [ ] Commit the contract tests.
### Task 2: Beauty family redesign
**Files:** Modify Beauty demo HTML/CSS/config for Velvet Nail Atelier, Amara Braid House, Aurelia Med Spa, Sable Skin Studio; regenerate screenshots/previews.
- [ ] Give each beauty template a distinct editorial/service architecture rather than one shared composition.
- [ ] Validate desktop/mobile and preview assets.
- [ ] Commit Beauty redesign.

### Task 3: Aviation family redesign
**Files:** Modify Altitude Aviation Services, AeroLustre, Runway Club, SkyTable Aviation Catering demos; regenerate screenshots/previews.
- [ ] Build distinct cinematic/technical/member/catering structures appropriate to each aviation niche.
- [ ] Validate desktop/mobile and preview assets.
- [ ] Commit Aviation redesign.

### Task 4: Legal, Finance, Technology redesign
**Files:** Modify Avery Cole Law, Sterling Family Law, Crescent Private Wealth, Ledgerline, Nexa Systems, Vertex Cyber Partners, Northstar Advisory; regenerate screenshots/previews.
- [ ] Replace repeated service-site rhythm with authority, proof, case/capability, and lead-qualification structures suited to each niche.
- [ ] Validate desktop/mobile and preview assets.
- [ ] Commit Professional redesign.

### Task 5: Automotive, Operations, Logistics redesign
**Files:** Modify Apex Auto Detail, Meridian Supply Co, Atlas Freight, Northstar HVAC; regenerate screenshots/previews.
- [ ] Introduce performance/gallery/booking, catalog/quote, logistics proof, and home-service conversion patterns respectively.
- [ ] Validate desktop/mobile and preview assets.
- [ ] Commit Operations redesign.
### Task 6: Hospitality, Villa, Marine redesign
**Files:** Modify Azure Cay, Solara Villa, Tidalmark Yacht Charter, Bluewater Charter Fishing, Mariners House; regenerate screenshots/previews.
- [ ] Use immersive hospitality and marine structures with distinct inquiry/availability/member flows.
- [ ] Validate desktop/mobile and preview assets.
- [ ] Commit Hospitality redesign.

### Task 7: Healthcare, Wellness, Community, Creator redesign
**Files:** Modify Meridian Concierge Medicine, Harbor Dental, Pulsewell, Common Ground, Founders Circle, Encore Creator Studio, Little Grove and remaining catalog demos; regenerate screenshots/previews.
- [ ] Give each vertical an appropriate trust/content/community/appointment structure.
- [ ] Validate desktop/mobile and preview assets.
- [ ] Commit remaining redesign.

### Task 8: Full visual/release QA
**Files:** Regenerate all affected `assets/screenshots/*`, `assets/previews/*`; update validators only for intentional new architecture.
- [ ] Run local-media, preview-screen, site, inventory, storefront, premium-visual and differentiation validators.
- [ ] Run Playwright representative desktop/mobile review across all industry groups.
- [ ] Run `git diff --check` and inspect representative screenshots visually.
- [ ] Push PR #12 only after all automated QA is green; stop at user visual approval gate before merge/deploy.