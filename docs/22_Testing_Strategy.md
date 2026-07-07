# 22_Testing_Strategy

## Purpose

The Testing Strategy defines the validation tools, automation pipelines, unit testing targets, visual regression checks, and manual verification routines for the **Solar Portfolio**. It ensures visual rendering and server integrations remain stable.

## Goals

1. **WebGL Canvas Verification:** Validate that Three.js and R3F compile and render scene objects correctly.
2. **Clean Integrations:** Ensure forms and API actions are verified under automated testing flows.
3. **Prevention of Visual Regressions:** Detect unintended visual changes or layout shifts in HUD panels.

## Architecture

The testing suite is split into three core layers: **Unit Tests** (validating helper logic and state hooks), **End-to-End Tests** (validating user journeys and canvas rendering), and **Visual Regression Tests** (verifying HUD UI layouts).

```
┌──────────────────────────────────────────────────────────┐
│                   Playwright E2E Runner                  │
│  - Asserts page load states                              │
│  - Simulates planet warp clicks & validates URL changes   │
│  - Captures pixel diff screenshots (Visual Regression)  │
└────────────────────────────┬─────────────────────────────┘
                             │
       ┌─────────────────────┴─────────────────────┐
       ▼                                           ▼
┌──────────────────────────────┐            ┌──────────────────────────────┐
│     Vitest Unit Engine       │            │      Manual Verification     │
│  - Validation schemas (Zod)  │            │  - Mobile swipe testing      │
│  - State adjustments (Zustand)│            │  - Performance frame checks  │
└──────────────────────────────┘            └──────────────────────────────┘
```

## Decisions

### 1. Testing Framework Registry

- **Vitest:** Selected over Jest for unit and React Hook tests. Vitest runs faster and integrates seamlessly with Vite and Next.js compiler settings.
- **Playwright:** Selected for End-to-End (E2E) testing. Playwright offers native WebGL headless browser configurations, making it perfect for testing our 3D space canvas canvas outputs.
- **Playwright Visual Comparisons:** Configured to capture screenshots of HUD panels and compare them against baseline visual files, catching rendering bugs.

### 2. Testing Targets

#### Unit Testing Target Areas

- **Zustand State transitions:** Ensure actions like `warpToPlanet` update coordinate values correctly.
- **Zod Schemas:** Test form inputs with valid and invalid payloads.
- **Budget calculations:** Verify estimate math logic in the services panel.

#### E2E Testing Target Areas

- **Initial Page Load:** Confirm the loader screen mounts and resolves.
- **Warp Travel flow:** Click Mars -> Verify camera transitions -> Assert planet HUD slide-in -> Assert URL resolves to `/services`.
- **Form submission pipeline:** Mock contact inputs -> Assert API response maps to Success -> Verify database insertion logs.

## Tradeoffs

- **Mocking Supabase APIs vs. Local Test Instances:** Mocking is fast but can miss database rule errors. _Decision:_ Use mock handlers (MSW - Mock Service Worker) for unit tests, but connect to a real, isolated Supabase staging database during E2E integration tests to verify RLS rules.
- **WebGL Headless Limitations:** Headless browsers can struggle to run heavy shaders. _Decision:_ Configure Playwright to use Chromium with GPU acceleration enabled (`--use-gl=angle` and `--headless=new` options), and provide mock canvas checks if GPU drivers are missing in CI containers.

## Future Expansion

- **Lighthouse CI Pipeline:** Add automated Lighthouse audits to the GitHub action sequence to prevent bundle size increases from harming PageSpeed scores.

## Risks

- **Flaky E2E Tests due to Animation Delays:** Camera warp transitions take 1.6 seconds. If tests don't wait for animations to complete, assertions will fail. _Mitigation:_ Use Playwright's `locator().waitFor()` hooks to monitor HUD element visibility states before triggering assertions.

## Acceptance Criteria

- Standard unit tests pass with zero errors.
- Core user journeys (Home, Projects, Services, Contact) pass automated E2E checks in Chromium, Firefox, and WebKit (Safari).
- Pull requests require all automated checks to pass before merging into the main branch.

## Engineering Notes

- **Playwright E2E Test Script Blueprint (`tests/navigation.spec.ts` outline):**

```ts
import { expect, test } from '@playwright/test';

test.describe('Solar System Navigation', () => {
  test('User can warp to Mars node and view services panel', async ({ page }) => {
    await page.goto('/projects'); // Start on projects route

    // Open Quick Warp Select Menu
    await page.click('[aria-label="Quick Warp Portal"]');
    await page.click('text=Services');

    // Assert camera transition and URL route update
    await expect(page).toHaveURL(/\/services/);

    // Assert visual slide panel visibility
    const servicesPanel = page.locator('[data-testid="services-panel"]');
    await expect(servicesPanel).toBeVisible({ timeout: 5000 });
  });
});
```

- **Running Tests command:** Use `npm run test` for unit tests and `npx playwright test` for E2E suites.
