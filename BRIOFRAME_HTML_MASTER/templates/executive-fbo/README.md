# Executive FBO — Measured Leg HTML Family

Diffui handoff implementation for **BRIOFRAME Identity B (Measured Leg)** executive FBO aviation site.

- **Auth token build:** `lYgauvXzh4a4`
- **Instructions:** https://diffui.ai/build/Prompt_build.md?authToken=lYgauvXzh4a4
- **Stack:** vanilla HTML / CSS / JS (no build step)
- **Forms:** simulated only (`data-bf-demo-form`)

## Pages (15)

| File | Page |
|---|---|
| `index.html` | Executive FBO homepage |
| `private-terminal.html` | Luxury private terminal editorial homepage |
| `services.html` | Services overview |
| `aircraft-arrival.html` | Aircraft Arrival Service |
| `concierge.html` | Concierge Services |
| `passenger-services.html` | Passenger Services |
| `crew-services.html` | Crew Services |
| `ground-handling.html` | Ground Handling |
| `fueling.html` | Fueling Services |
| `hospitality-amenities.html` | Hospitality & Amenities |
| `ground-transportation.html` | Ground Transportation |
| `hangar-services.html` | Hangar & Extended Services |
| `arrival-notification.html` | Arrival Notification (simulated form) |
| `service-request.html` | Service Request (simulated form) |
| `contact.html` | Contact / FBO Information |

## Assets

Generated via Diffui `build/generate-image` (downloaded locally — not hotlinked):

- `assets/images/heroes/` — cinematic heroes
- `assets/images/services/` — service photography
- `assets/images/sections/` — hospitality / editorial panels
- `assets/images/brand/wing.svg` — brand mark

Wallet exhausted mid-batch; a few service images reuse related generated photography rather than design-reference crops.

## Preview

From repo root:

```bash
python3 -m http.server 8080
```

Open `/BRIOFRAME_HTML_MASTER/templates/executive-fbo/`

## Regenerate HTML

```bash
python3 scripts/generate_pages.py
```

Not published. No Shopify. No live operational claims.
