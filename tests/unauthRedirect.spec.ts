// @ts-nocheck
import { test, expect } from '@playwright/test';

// Verify that unauthenticated users are redirected from /dashboard to landing page

test('unauthenticated access to /dashboard redirects to landing', async ({ page }) => {
  await page.goto('/dashboard');
  // App should redirect to root or login within reasonable time
  await page.waitForURL('**/');
  expect(page.url()).toMatch(/\/$/);
}); 