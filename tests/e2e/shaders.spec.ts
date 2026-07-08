import { test, expect } from '@playwright/test';

test('home page has no WebGL shader compile errors', async ({ page }) => {
  const shaderErrors: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('Shader Error') || text.includes('Fragment shader is not compiled')) {
      shaderErrors.push(text);
    }
  });

  await page.goto('/', { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForTimeout(8000);

  expect(shaderErrors, shaderErrors.join('\n')).toEqual([]);
});
