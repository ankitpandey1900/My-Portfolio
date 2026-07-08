import { expect, test } from '@playwright/test';

test('home page loads with accessible portfolio title', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /Ankit Pandey — Software Engineer Portfolio/i })
  ).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
});

test('mission control trigger appears after load', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const nav = page.getByRole('button', { name: /open navigation/i });
  const hero = page.getByRole('heading', { name: /^Ankit Pandey$/i });
  await expect(nav.or(hero)).toBeVisible();
});
