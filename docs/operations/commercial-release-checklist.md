# BRIOFRAME Commercial Release Checklist

Use this checklist before promoting any template from Preview to a live purchasable state.

## 1. Public Demo Verification

- Confirm the template exists in `data/templates.json` and `data/commerce.json`.
- Run the working demo on desktop and mobile widths.
- Confirm the detail page has the correct category, preview image, description, and demo path.
- Confirm there are no console errors or broken local assets.
- Keep `commercialStatus` as `preview` while any commercial dependency is unverified.

## 2. Protected Package Preparation

- Work only inside the private Links100 delivery workspace, never inside the public repo.
- Prepare customer source under the private workspace `working/` area.
- Do not invent package filenames before an actual package exists.
- When a package is created, place it under the private `packages/` area.
- Update the private manifest from `not_started` to `packaged` only after the package file exists.
- Run `tests/validate_private_delivery.py --root <private-root>` and require PASS.

## 3. Shopify Verification

- Verify the correct BRIOFRAME Shopify store is connected before making product changes.
- Verify the exact Shopify product record and exact product URL.
- Do not reuse, guess, or synthesize a product URL from a title or slug.
- Keep the public template non-purchasable until the product destination is confirmed.

## 4. Promotion to Live

- Set the commerce record to `live` only after the exact Shopify URL is verified.
- Copy that exact URL into the matching public catalog record and mark it `Available`.
- Regenerate template pages with `python scripts/generate_template_pages.py`.
- Run `python tests/validate_commercial_release.py` and require PASS.
- Run the complete public validation suite and browser regression.

## 5. Publication

- Review `git diff --check` and the staged diff for protected-source leakage.
- Confirm no ZIP, archive, customer file, credential, export, or private workspace path is staged.
- Push the feature branch and require all GitHub Actions checks to pass.
- Merge only a green, mergeable pull request.
- Verify the post-merge `main` workflow and GitHub Pages deployment.

## Status Meanings

- `preview`: public evaluation only; no Shopify product URL is exposed.
- `ready_for_sale`: private preparation may be complete, but the public page remains non-purchasable until Shopify verification.
- `live`: exact Shopify product path is verified and matches the public catalog.
