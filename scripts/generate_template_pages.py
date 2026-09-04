#!/usr/bin/env python3
"""Regenerate /templates/<slug>/ pages and sitemap.xml from the catalog."""

from __future__ import annotations

from pathlib import Path
import html
import json

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://brioframe.github.io"

PAGE = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{meta_description}">
  <link rel="canonical" href="{canonical}">
  <meta property="og:title" content="{og_title}">
  <meta property="og:description" content="{meta_description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{og_image}">
  <meta property="og:site_name" content="BRIOFRAME Template Studio">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{og_title}">
  <meta name="twitter:description" content="{meta_description}">
  <meta name="twitter:image" content="{og_image}">
  <title>{title}</title>
  <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/fonts.css">
  <link rel="stylesheet" href="/assets/css/site.css">
  <script type="application/ld+json">{ld_json}</script>
  <script src="/assets/js/template-detail.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#template-detail">Skip to template details</a>
  <header class="site-header">
    <a class="brand" href="/" aria-label="BRIOFRAME demo library home">
      <span class="brand__mark" aria-hidden="true">BR</span>
      <span class="brand__text">BRIOFRAME</span>
    </a>
    <span class="site-header__label">Template Studio</span>
  </header>

  <main class="detail-page" id="main-content">
    <p class="eyebrow">Template details</p>
    <p id="template-detail-status" class="detail-page__status" role="status">{status_text}</p>
    <div id="template-detail" data-static-detail="true" data-slug="{slug}">
{static_body}
    </div>
  </main>

  <footer class="site-footer">
    <p>© 2026 BRIOFRAME. All rights reserved.</p>
    <p>Public demonstrations are provided for evaluation and are not licensed for resale or redistribution.</p>
  </footer>
</body>
</html>
"""


def escape(value: str) -> str:
    return html.escape(value, quote=True)


def build_product_ld(item: dict, canonical: str) -> dict:
    """Build Product JSON-LD without inventing commercial Offer pricing."""
    ld = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": item["name"],
        "description": item["description"],
        "brand": {"@type": "Brand", "name": "BRIOFRAME"},
        "category": item["category"],
        "url": canonical,
        "image": f"{SITE}{item['previewImage']}",
    }

    price = item.get("price")
    currency = item.get("priceCurrency")
    shopify_url = item.get("shopifyProductUrl") or ""
    if (
        item.get("availability") == "Available"
        and shopify_url
        and price not in (None, "")
        and currency not in (None, "")
    ):
        ld["offers"] = {
            "@type": "Offer",
            "url": shopify_url,
            "price": str(price),
            "priceCurrency": str(currency),
            "availability": "https://schema.org/InStock",
            "seller": {"@type": "Organization", "name": "BRIOFRAME"},
        }
    return ld


def build_static_body(item: dict, industry_label: str) -> str:
    name = escape(item["name"])
    industry = escape(industry_label)
    category = escape(item["category"])
    availability = escape(item["availability"])
    description = escape(item["description"])
    preview = escape(item["previewImage"])
    demo_url = escape(item["demoUrl"])
    library_href = escape(f"/?industry={item['industry']}#templates")

    shopify_block = ""
    if item.get("availability") == "Available" and item.get("shopifyProductUrl"):
        shopify_url = escape(item["shopifyProductUrl"])
        shopify_block = (
            f'          <a class="button button--secondary" href="{shopify_url}" '
            f'rel="noopener noreferrer">View in Shopify</a>\n'
        )
    else:
        shopify_block = (
            '          <span class="button button--secondary" aria-disabled="true" '
            'title="Shopify listing coming soon">Premium Preview</span>\n'
        )

    return f"""      <div class="detail-layout">
        <div class="detail-media">
          <img class="detail-media__image" src="{preview}" alt="{name} template preview" width="1280" height="800">
        </div>
        <div class="detail-content">
          <div class="detail-meta">
            <p class="detail-meta__industry">{industry}</p>
            <p class="detail-meta__category">{category}</p>
            <p class="detail-meta__availability" data-availability="{availability}">{availability}</p>
          </div>
          <h1 class="detail-title">{name}</h1>
          <p class="detail-description">{description}</p>
          <div class="detail-actions" aria-label="Template actions">
            <a class="button button--primary" href="{demo_url}">View working demo</a>
{shopify_block}            <a class="button button--ghost" href="/#design-studio">Need customization? Design Studio</a>
            <a class="text-link detail-back" href="{library_href}">Back to library</a>
          </div>
        </div>
      </div>"""


def main() -> None:
    catalog = json.loads((ROOT / "data" / "templates.json").read_text(encoding="utf-8"))
    taxonomy = json.loads((ROOT / "data" / "taxonomy.json").read_text(encoding="utf-8"))
    labels = {item["id"]: item["label"] for item in taxonomy["industries"]}

    for item in catalog:
        slug = item["slug"]
        industry = labels.get(item["industry"], item["industry"])
        canonical = f"{SITE}/templates/{slug}/"
        og_image = f"{SITE}{item['previewImage']}"
        title = f"{item['name']} | BRIOFRAME Template Details"
        og_title = f"{item['name']} | BRIOFRAME"
        meta_description = (
            f"{item['name']} — {industry} / {item['category']} website template from BRIOFRAME. "
            "Review details, open the working demo, and purchase through Shopify when available."
        )
        if len(meta_description) > 165:
            meta_description = (
                f"{item['name']} — {industry} template by BRIOFRAME. "
                "Review details, explore the working demo, and purchase via Shopify."
            )

        ld = build_product_ld(item, canonical)
        page = PAGE.format(
            meta_description=escape(meta_description),
            canonical=canonical,
            og_title=escape(og_title),
            og_image=escape(og_image),
            title=escape(title),
            ld_json=json.dumps(ld, ensure_ascii=True, separators=(",", ":")),
            status_text=escape(f"{industry} · {item['category']}"),
            slug=escape(slug),
            static_body=build_static_body(item, industry),
        )
        out = ROOT / "templates" / slug / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(page, encoding="utf-8")

    urls = [f"{SITE}/"]
    urls += [f"{SITE}/templates/{item['slug']}/" for item in catalog]
    urls += [f"{SITE}/demos/{item['slug']}/" for item in catalog]
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for index, url in enumerate(urls):
        priority = "1.0" if index == 0 else ("0.9" if "/templates/" in url else "0.8")
        lines.append(
            f"  <url><loc>{url}</loc><changefreq>weekly</changefreq><priority>{priority}</priority></url>"
        )
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generated {len(catalog)} template detail pages and sitemap with {len(urls)} URLs")


if __name__ == "__main__":
    main()
