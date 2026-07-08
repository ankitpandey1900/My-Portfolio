import { expect, test } from '@playwright/test';

test('resume page renders profile content', async ({ page }) => {
  await page.goto('/resume');

  await expect(page.locator('h1')).toContainText(/Ankit Pandey/i);
  await expect(page.getByRole('heading', { name: /experience/i })).toBeVisible();
});

test('resume API redirects to HTML resume', async ({ request }) => {
  const response = await request.get('/api/resume', { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers().location).toMatch(/\/resume$/);
});
