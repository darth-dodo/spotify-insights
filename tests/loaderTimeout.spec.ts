// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Simulate GlobalLoader timeout by shortening the timeout interval via patching setTimeout.
 */

test('loader timeout clears auth and redirects', async ({ page }) => {
  // Patch setTimeout early to accelerate timeout (replace 30000 with 100)
  await page.addInitScript(() => {
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = (handler, timeout, ...args) => {
      if (timeout === 30_000) {
        timeout = 100; // shorten
      }
      return originalSetTimeout(handler, timeout, ...args);
    };
  });

  // Store a fake token so the app attempts to load dashboard but stay at 0 progress
  await page.addInitScript(() => {
    localStorage.setItem('spotify_access_token', 'stale_token');
    localStorage.setItem('spotify_token_expiry', (Date.now() + 60_000).toString());
  });

  await page.goto('/dashboard');

  // Wait for redirect to root triggered by timeout guard
  await page.waitForURL('**/');
  expect(page.url()).toMatch(/\/$/);

  // load_error flag should be in localStorage
  const loadError = await page.evaluate(() => localStorage.getItem('load_error'));
  expect(loadError).toBe('timeout');
}); 