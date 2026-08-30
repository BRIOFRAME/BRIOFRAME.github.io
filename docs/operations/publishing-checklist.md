# BRIOFRAME Demo Publishing Checklist

Use this sequence for every public working demonstration.

## Prepare locally

- [ ] Create the demo at `demos/<stable-slug>/index.html`.
- [ ] Keep its assets isolated under `demos/<stable-slug>/assets/`.
- [ ] Add the public catalog record to `data/templates.json`.
- [ ] Confirm the demo is a sanitized browser build, not the paid package.
- [ ] Label forms and commerce behavior as simulated.
- [ ] Confirm the purchase action uses the exact HTTPS Shopify product URL.
- [ ] Confirm a visible control returns to `/`.

## Security gate

- [ ] Run `python3 tests/validate_site.py` and require a passing result.
- [ ] Confirm there are no archives, paid source packages, customer files, credentials, editable masters, platform exports, private APIs, fulfillment records, or protected-package filenames.
- [ ] Review every new public asset for intended disclosure.

## GitHub write gate

- [ ] Visibly verify the signed-in owner is `BRIOFRAME`.
- [ ] Visibly verify the repository is `BRIOFRAME.github.io`.
- [ ] Visibly verify the target branch is `main` or an approved feature branch.
- [ ] Stop without writing if any identity differs.
- [ ] Use a descriptive commit message naming the demo or control changed.

## Deployment gate

- [ ] Confirm the GitHub Pages workflow completes successfully.
- [ ] Open `https://brioframe.github.io/demos/<stable-slug>/`.
- [ ] Test desktop navigation, images, buttons, and simulated actions.
- [ ] Test a narrow mobile viewport for overflow, readability, and navigation.
- [ ] Confirm the return-to-library control works.
- [ ] Confirm the Shopify product link opens the intended product.
- [ ] Confirm no console errors or failed public assets remain.

## Shopify handoff

- [ ] Add the verified public demo URL to the matching Shopify product only after all earlier checks pass.
- [ ] Keep the protected customer ZIP attached only through Shopify Digital Products.
- [ ] Record the demo URL, commit SHA, deployment result, desktop check, and mobile check in the completion report.
