# Diffui agent build instructions


## Multi-page build

This build contains 14 pages. Implement shared UI first, then each page.

### Pages in this build


#### Page 1: Home

Design image: https://diffui.ai/image/Home.webp?authToken=qcZJT65fPWYj


#### Page 2: Services Overview

Design image: https://diffui.ai/image/Services_Overview.webp?authToken=qcZJT65fPWYj


#### Page 3: Aircraft Arrival Service

Design image: https://diffui.ai/image/Aircraft_Arrival_Service.webp?authToken=qcZJT65fPWYj


#### Page 4: Concierge Services

Design image: https://diffui.ai/image/Concierge_Services.webp?authToken=qcZJT65fPWYj


#### Page 5: Passenger Services

Design image: https://diffui.ai/image/Passenger_Services.webp?authToken=qcZJT65fPWYj


#### Page 6: Crew Services

Design image: https://diffui.ai/image/Crew_Services.webp?authToken=qcZJT65fPWYj


#### Page 7: Ground Handling

Design image: https://diffui.ai/image/Ground_Handling.webp?authToken=qcZJT65fPWYj


#### Page 8: Fueling Services

Design image: https://diffui.ai/image/Fueling_Services.webp?authToken=qcZJT65fPWYj


#### Page 9: Hospitality & Amenities

Design image: https://diffui.ai/image/Hospitality_Amenities.webp?authToken=qcZJT65fPWYj


#### Page 10: Ground Transportation

Design image: https://diffui.ai/image/Ground_Transportation.webp?authToken=qcZJT65fPWYj


#### Page 11: Hangar & Extended Services

Design image: https://diffui.ai/image/Hangar_Extended_Services.webp?authToken=qcZJT65fPWYj


#### Page 12: Arrival Notification

Design image: https://diffui.ai/image/Arrival_Notification.webp?authToken=qcZJT65fPWYj


#### Page 13: Service Request

Design image: https://diffui.ai/image/Service_Request.webp?authToken=qcZJT65fPWYj


#### Page 14: Contact / FBO Information

Design image: https://diffui.ai/image/Contact_FBO_Information.webp?authToken=qcZJT65fPWYj



### Recommended workflow

1. Download every Diffui URL in this document to local files before referencing them in code (see **Local assets** below).
2. Download and inspect every design image before writing code.
3. Compare layouts, navigation, and repeated patterns across pages.
4. Identify shared elements (navigation, footer, buttons, cards, form controls) and per-page bespoke sections.
5. Inspect the target repo and choose the tech stack (see **Project setup** below).
6. Implement the shared foundation first — layout, tokens, and reusable components using the chosen stack.
7. Implement each page using the shared foundation. Match the diffusion renders faithfully — do not redesign.





## Local assets

**Required:** download every Diffui URL in this document to local project files **before** referencing them in HTML, CSS, or JavaScript. Do not hotlink remote Diffui URLs in the implementation.

This applies to:

- Design reference images (inspect locally before writing UI code)
- Images returned from asset generation (`build_generate_image`, `build_generate_svg`, `build_remove_background`, `build_create_texture`, `build_create_maps`)
- Any other Diffui image URL in this document

Save downloads under a project folder such as `assets/` and reference those local paths in code.

### Downloading design images

Design renders are visual specifications. **Download each image and inspect it before writing code.** Do not rely on text summaries alone.


**To save an asset to disk, download its URL with `curl`.** Every URL this build returns already carries a capability token, so a plain `curl` works — no API key, no headers:

```bash
curl -fL -o assets/page.png "https://diffui.ai/image/Page_Name.webp?authToken=qcZJT65fPWYj&format=png"
```

Keep the `-f` flag. Without it curl writes the response body on an error status, and you get a file containing a picture of an error message instead of your asset.

Use the MCP tool `build_get_image` (with `build_id` `e39a21cc-2b90-456e-a2e8-36fe20602282` and an alias like `Page_Name.webp`) **to look at an image**, not to save one — it returns the image for vision analysis, and a tool result cannot be written to a file. Inspect with `build_get_image`, save with `curl`.

Bearer-style file URLs (`https://diffui.ai/api/agent-build/e39a21cc-2b90-456e-a2e8-36fe20602282/files/...`) also exist, but they require the Diffui API key and are only usable from inside the MCP server. Prefer the tokenized URL above. Never paste or print the API key into the project.


**Do not use design crops as final page assets.** Never crop a hero image, photo, or illustration out of the design reference and place that crop in your HTML/CSS. The design image is a **specification only** — generate real high-resolution assets via `build_generate_image` (see **Generating image assets** below). Cropping the design is not a substitute for generation.

The `&crop=x,y,width,height` query param is for **inspection and intermediate pipelines only** (e.g. measuring a region, or feeding a large illustration into image-to-SVG). It must **not** appear in any `<img src>`, CSS `background-image`, or other shipped asset path.

## Project setup

Inspect the target repository before choosing a stack:

| Situation | What to do |
|-----------|------------|
| **Existing project** | Use the framework, tooling, and patterns already present. Do not introduce a different stack. |
| **Empty repo + linked npm package** (see Brand context) | Scaffold the minimum project that package requires, install it, then implement. Do not default to vanilla HTML/CSS when a brand package is linked. |
| **Empty repo, no linked package** | Use vanilla HTML, CSS, and JavaScript. |

When a linked npm package implies a specific framework (React, Vue, etc.) or tooling (Tailwind, shadcn CLI), scaffold that stack with sensible defaults — e.g. Next.js or Vite for React-based design systems — even if this document does not spell out every init command.

## Implementation guidelines

You are an elite frontend engineer and design-to-code specialist. The design image is the primary source of truth; your code is the translation layer. Do not reinterpret or "improve" the design into something generic — reproduce it faithfully.

Before writing code, analyze the image like a design specification:

- **Layout & structure:** overall grid, section ordering, alignment, column logic, content width.
- **Typography:** extract visible text verbatim; size/weight hierarchy, display vs body contrast, line height, tracking, serif vs sans.
- **Spacing:** section padding, gutters, gaps, card padding, image-to-text distance. Preserve generous spacing; do not compress.
- **Color:** background, panels, accents, button fills, text hierarchy, borders, shadows. Preserve the exact palette you observe; do not substitute generic web colors.
- **Textures & surfaces:** Look for repeating photographic or organic surfaces used as tiled backgrounds — paper grain, linen, concrete, stone, wood grain, fabric weave, film noise, subtle marbling. Note tiling direction if visible: omnidirectional repeat → `both`; stripe or band patterns that repeat on one axis only → `horizontal` or `vertical`. Do **not** generate textures for flat solid fills, simple CSS gradients, hero photos, or illustrations — use CSS or `build/generate-image` instead. Only call `build/create-texture` when a seamless repeating surface is clearly part of the shipped design. Request extra PBR maps (`normal`, `roughness`, etc.) **only** when the user explicitly wants WebGL-style lighting or physically based shading — not for ordinary CSS `background-repeat` tiles.
- **Components:** buttons (shape, radius, fill vs outline, padding, primary/secondary), cards, inputs, badges, dividers, icons.
- **Imagery:** Match the container silhouette, not just the asset. Non-rectangular boundaries are first-class layout — implement with clip/mask, not border-radius. Generate high-res images via `build/generate-image`; generate seamless repeating surfaces via `build/create-texture` when the design calls for them; never ship crops from the design reference as final artwork.

Implementation discipline:

- Preserve layout logic, spacing rhythm, section ordering, text/image balance, typography mood, and component styling.
- Use the actual visible text from the image, not placeholder copy.
- Match colors and spacing to what you observe, not to defaults.
- Do not add nested box-in-box wrappers, decorative pills, fake status labels, or micro-UI clutter not in the image.
- Avoid AI-slop (default purple/blue gradients, glow, glassmorphism, generic card spam) unless the image clearly shows it.
- Keep the first viewport clean and readable; responsive in spirit while keeping the desktop composition faithful.
- Follow the **Project setup** rules above: match an existing repo's stack, scaffold for a linked npm package on an empty repo, or use vanilla HTML/CSS/JS when no package is linked.

Resolve ambiguity in this order: preserve the visible design language, then layout/spacing logic, then component family, then mood/polish — only then fall back to a faithful choice. The final result should look like the same design in the image, translated into real code.

## Generating image assets

When the design needs photos or illustrations (avatars, hero images, product shots, lineup photos, etc.), **generate them via Diffui** — do not use placeholders and **do not crop them out of the design reference**.


**Build id for this package:** `e39a21cc-2b90-456e-a2e8-36fe20602282`

Use the MCP tools below. They authenticate with the MCP's existing Diffui API key — do **not** invent, print, or paste one yourself. The `authToken` already embedded in the URLs these tools return is not something you invented, and using it in a `curl` is the intended download path.

### build_generate_image

Required args: `build_id`, `prompt`, `width`, `height`. Optional: `quality` (`medium` default, or `high`), `reference_image_url` (high quality only), `transparent_background` (high quality only).

The returned `url` is directly downloadable — `curl -fL -o assets/name.png "<url>&format=png"`. Do that before referencing it in code.

**Transparent backgrounds:** when a **new** generated asset must composite over other UI — a floating hero image, overlay illustration, isolated product/object, backdrop artwork layered over other elements, icon, or chart — set `transparent_background: true` with `quality: "high"`. The PNG comes back with a native alpha channel in the same billed call; do **not** generate opaque and then call `build_remove_background` for new assets. Full-bleed photos, scenes, and filled backgrounds stay opaque (leave the flag off). `build_remove_background` remains for cutting out already-generated or user-provided bitmaps.

### Choosing quality

| Use **medium** (default, 1¢) | Use **high** (17¢) |
|------------------------------|---------------------|
| Profile pictures, avatars | Large hero / banner images |
| Product shots, thumbnails | Anything needing ~2K resolution |
| Icons, small decorative images | Illustrations, artistic focal imagery |
| Most page assets | Main visual focus of the page |
| | Any asset needing a transparent background |

Size rules match the HTTP docs: medium (z-image) min edge 512 / max 2048 / max 3:1; high (gpt-image-2) multiples of 16, min 655,360 pixels, max edge 2048.

### build_create_texture

For seamless repeating surfaces only. Args: `build_id`, `prompt`, optional `tiling_mode` / `maps`. Cost 3¢ + 1¢/map.

### build_remove_background

Args: `build_id`, `image_url` (a Diffui asset URL from this build). Cost 1¢.

### build_generate_svg

Args: `build_id`, `view_box`, and exactly one of `prompt` (icons) or `image_url` (complex illustrations). Cost 2¢.

### build_get_image

Download design or generated assets. Args: `build_id`, `alias` (e.g. `Hero.webp` or `generated_….webp`), optional `format` / `crop`.


