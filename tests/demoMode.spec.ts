// @ts-nocheck
import { test, expect } from '@playwright/test';
import { setDemoAuth } from './helpers';

/**
 * When demo token is present (or /sandbox route), the app should load the dashboard
 * without hitting Spotify and GlobalLoader should complete within timeout.
 */

test('dashboard loads with demo auth token', async ({ page }) => {
  await setDemoAuth(page);
  await page.goto('/dashboard');

  // Wait for dashboard indicators (e.g., side bar) to appear
  const sidebar = page.locator('[data-tour="sidebar"]');
  await sidebar.waitFor({ state: 'visible' });
  expect(await sidebar.isVisible()).toBeTruthy();
}); 