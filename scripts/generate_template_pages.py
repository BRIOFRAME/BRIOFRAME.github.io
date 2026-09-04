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
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical}">
  <meta property="og:title" content="{og_title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:site_name" content="BRIOFRAME Template Studio">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{og_title}">
  <meta name="twitter:description" content="{description}">
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
    <p id="template-detail-status" class="detail-page__status" role="status" aria-live="polite">Loading template details…</p>
    <div id="template-detail"></div>
  </main>

  <footer class="site-footer">
    <p>© 2026 BRIOFRAME. All rights reserved.</p>
    <p>Public demonstrations are provided for evaluation and are not licensed for resale or redistribution.</p>
  </footer>
</body>
</html>
"""


def main() -> None:
    catalog = json.loads((ROOT / "data" / "templates.json").read_text(encoding="utf-8"))
    taxonomy = json.loads((ROOT / "data" / "taxonomy.json").read_text(encoding="utf-8"))
    labels = {item["id"]: item["label"] for item in taxonomy["industries"]}

    for item in catalog:
        slug = item["slug"]
        industry = labels.get(item["industry"], item["industry"])
        canonical = f"{SITE}/templates/{slug}/"
        title = f"{item['name']} | BRIOFRAME Template Details"
        og_title = f"{item['name']} | BRIOFRAME"
        description = (
            f"{item['name']} — {industry} / {item['category']} website template from BRIOFRAME. "
            "Review details, open the working demo, and purchase through Shopify when available."
        )
        if len(description) > 165:
            description = (
                f"{item['name']} — {industry} template by BRIOFRAME. "
                "Review details, explore the working demo, and purchase via Shopify."
            )

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
        if item.get("availability") == "Available" and item.get("shopifyProductUrl"):
            ld["offers"] = {
                "@type": "Offer",
                "url": item["shopifyProductUrl"],
                "availability": "https://schema.org/InStock",
                "seller": {"@type": "Organization", "name": "BRIOFRAME"},
            }

        page = PAGE.format(
            description=html.escape(description, quote=True),
            canonical=canonical,
            og_title=html.escape(og_title, quote=True),
            title=html.escape(title, quote=True),
            ld_json=json.dumps(ld, ensure_ascii=True, separators=(",", ":")),
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
