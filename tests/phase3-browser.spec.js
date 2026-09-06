const { test, expect } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:4173';

test('catalog loads and industry shortcuts preserve Phase 1 filtering', async ({ page }) => {
  await page.goto(`${baseURL}/`);
  await expect(page.locator('#library-status')).toContainText('working demo');
  const cards = page.locator('.template-card');
  await expect(cards.first()).toBeVisible();

  const shortcut = page.locator('#industry-shortcuts .filter-chip').first();
  await expect(shortcut).toBeVisible();
  await shortcut.click();

  const selectedIndustry = await page.locator('#industry-filter').inputValue();
  expect(selectedIndustry).not.toBe('');
  await expect(page).toHaveURL(new RegExp(`industry=${encodeURIComponent(selectedIndustry)}`));
  const visibleIndustries = await cards.evaluateAll((items) => items.map((item) => item.dataset.industry));
  expect(visibleIndustries.length).toBeGreaterThan(0);
  expect(new Set(visibleIndustries)).toEqual(new Set([selectedIndustry]));
});

test('detail page exposes conversion path and same-industry discovery', async ({ page }) => {
  await page.goto(`${baseURL}/templates/amara-braid-house/`);
  await expect(page.locator('#detail-path-title')).toHaveText('Choose the right BRIOFRAME path');
  await expect(page.getByRole('heading', { name: 'Template Studio', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Design Studio', exact: true })).toBeVisible();
  await expect(page.locator('#detail-related-title')).toBeVisible();
  await expect(page.locator('.detail-related a').first()).toHaveAttribute('href', /\/templates\//);
});

test('reduced motion makes revealed content immediately visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${baseURL}/`);
  await expect(page.locator('.template-card').first()).toBeVisible();
  await expect(page.locator('.template-card').first()).toHaveClass(/phase3-reveal--visible/);
});

test('mobile catalog, detail and recovery demos avoid horizontal overflow', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  const paths = [
    '/',
    '/templates/amara-braid-house/',
    '/demos/velvet-nail-atelier/',
    '/demos/amara-braid-house/',
    '/demos/meridian-supply-co/',
    '/demos/altitude-aviation-services/'
  ];

  for (const path of paths) {
    await page.goto(`${baseURL}${path}`);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }

  await context.close();
});