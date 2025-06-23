import { test, expect } from '@playwright/test';
import { 
  mockSpotifyAuth, 
  mockSpotifyData, 
  waitForDataLoad,
  clearAuthState,
  simulateNetworkError,
  restoreNetworkConnectivity
} from './helpers';

test.describe('Critical User Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await clearAuthState(page);
  });

  test.describe('Authentication Flow', () => {
    test('should complete full OAuth flow successfully', async ({ page }) => {
      // Start from landing page
      await page.goto('/');
      
      // Should show landing page with auth options
      await expect(page.locator('[data-testid="landing-page"]')).toBeVisible();
      await expect(page.locator('text=Connect with Spotify')).toBeVisible();
      
      // Click connect button
      await page.click('text=Connect with Spotify');
      
      // Should redirect to Spotify OAuth (mocked)
      await mockSpotifyAuth(page);
      
      // Should redirect back to callback
      await page.waitForURL('/callback*');
      
      // Should show loading state
      await expect(page.locator('[data-testid="loading-screen"]')).toBeVisible();
      
      // Should eventually redirect to dashboard
      await page.waitForURL('/dashboard', { timeout: 10000 });
      
      // Should show dashboard content
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      await expect(page.locator('text=Your Music Insights')).toBeVisible();
    });

    test('should handle OAuth callback errors gracefully', async ({ page }) => {
      // Navigate to callback with error
      await page.goto('/callback?error=access_denied');
      
      // Should show error dialog
      await expect(page.locator('[data-testid="error-dialog"]')).toBeVisible();
      await expect(page.locator('text=Authentication failed')).toBeVisible();
      
      // Should provide retry option
      await expect(page.locator('text=Try Again')).toBeVisible();
      
      // Click try again should go back to landing
      await page.click('text=Try Again');
      await page.waitForURL('/');
      await expect(page.locator('[data-testid="landing-page"]')).toBeVisible();
    });

    test('should handle expired tokens correctly', async ({ page }) => {
      // Set up expired token
      await page.addInitScript(() => {
        localStorage.setItem('spotify_access_token', 'expired_token');
        localStorage.setItem('spotify_token_expiry', String(Date.now() - 1000));
      });
      
      // Navigate to dashboard
      await page.goto('/dashboard');
      
      // Should redirect to login due to expired token
      await page.waitForURL('/');
      await expect(page.locator('[data-testid="login-page"]')).toBeVisible();
      await expect(page.locator('text=Your session has expired')).toBeVisible();
    });

    test('should maintain auth state across page refreshes', async ({ page }) => {
      // Set up valid auth state
      await mockSpotifyAuth(page);
      await page.goto('/dashboard');
      await waitForDataLoad(page);
      
      // Refresh page
      await page.reload();
      
      // Should still be on dashboard
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      
      // Should not show login page
      await expect(page.locator('[data-testid="login-page"]')).not.toBeVisible();
    });
  });

  test.describe('Data Loading Flow', () => {
    test('should load dashboard data progressively', async ({ page }) => {
      await mockSpotifyAuth(page);
      await mockSpotifyData(page);
      
      await page.goto('/dashboard');
      
      // Should show loading state initially
      await expect(page.locator('[data-testid="loading-screen"]')).toBeVisible();
      
      // Should show progressive loading indicators
      await expect(page.locator('[data-testid="progressive-loader"]')).toBeVisible();
      
      // Should eventually show data
      await waitForDataLoad(page);
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      
      // Should show actual data sections
      await expect(page.locator('[data-testid="top-tracks-preview"]')).toBeVisible();
      await expect(page.locator('[data-testid="stats-overview"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-heatmap"]')).toBeVisible();
    });

    test('should handle network errors during data loading', async ({ page }) => {
      await mockSpotifyAuth(page);
      await simulateNetworkError(page);
      
      await page.goto('/dashboard');
      
      // Should show loading initially
      await expect(page.locator('[data-testid="loading-screen"]')).toBeVisible();
      
      // Should eventually show error state
      await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Unable to load your music data')).toBeVisible();
      
      // Should provide retry option
      await expect(page.locator('text=Retry')).toBeVisible();
      
      // Restore connectivity and retry
      await restoreNetworkConnectivity(page);
      await mockSpotifyData(page);
      await page.click('text=Retry');
      
      // Should load successfully
      await waitForDataLoad(page);
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
    });

    test('should handle partial data loading gracefully', async ({ page }) => {
      await mockSpotifyAuth(page);
      
      // Mock partial data (some endpoints fail)
      await page.route('**/api/v1/me/top/tracks*', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [] })
      }));
      
      await page.route('**/api/v1/me/top/artists*', route => route.abort());
      
      await page.goto('/dashboard');
      await waitForDataLoad(page);
      
      // Should show available data
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      
      // Should show empty state for failed sections
      await expect(page.locator('[data-testid="no-data-message"]')).toBeVisible();
      
      // Should not crash the entire app
      await expect(page.locator('[data-testid="error-boundary"]')).not.toBeVisible();
    });
  });

  test.describe('Sandbox Mode Flow', () => {
    test('should access sandbox mode without authentication', async ({ page }) => {
      await page.goto('/sandbox');
      
      // Should show sandbox banner
      await expect(page.locator('[data-testid="sandbox-banner"]')).toBeVisible();
      await expect(page.locator('text=Demo Mode')).toBeVisible();
      
      // Should show dashboard with demo data
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      
      // Should show demo data indicators
      await expect(page.locator('text=Sample Data')).toBeVisible();
      await expect(page.locator('[data-testid="demo-data-badge"]')).toBeVisible();
    });

    test('should switch between real and sandbox modes', async ({ page }) => {
      // Start with real auth
      await mockSpotifyAuth(page);
      await page.goto('/dashboard');
      await waitForDataLoad(page);
      
      // Navigate to sandbox
      await page.goto('/sandbox');
      
      // Should show sandbox mode
      await expect(page.locator('[data-testid="sandbox-banner"]')).toBeVisible();
      
      // Go back to dashboard
      await page.goto('/dashboard');
      
      // Should show real data mode
      await expect(page.locator('[data-testid="sandbox-banner"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
    });

    test('should show sandbox data quality', async ({ page }) => {
      await page.goto('/sandbox');
      
      // Should show diverse sample data
      await expect(page.locator('[data-testid="top-tracks-preview"]')).toBeVisible();
      
      // Should show genre diversity
      await page.click('[data-testid="genre-analysis-tab"]');
      await expect(page.locator('text=Heavy Metal')).toBeVisible();
      await expect(page.locator('text=Classic Rock')).toBeVisible();
      await expect(page.locator('text=Jazz')).toBeVisible();
      await expect(page.locator('text=Classic Pop')).toBeVisible();
      
      // Should show realistic track counts
      await expect(page.locator('text=2000+ tracks')).toBeVisible();
      await expect(page.locator('text=50 curated artists')).toBeVisible();
    });
  });

  test.describe('Navigation Flow', () => {
    test('should navigate between dashboard sections smoothly', async ({ page }) => {
      await mockSpotifyAuth(page);
      await mockSpotifyData(page);
      await page.goto('/dashboard');
      await waitForDataLoad(page);
      
      // Test overview section
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      
      // Navigate to listening trends
      await page.click('[data-testid="nav-listening-trends"]');
      await expect(page.locator('[data-testid="listening-trends"]')).toBeVisible();
      
      // Navigate to genre analysis
      await page.click('[data-testid="nav-genre-analysis"]');
      await expect(page.locator('[data-testid="genre-analysis"]')).toBeVisible();
      
      // Navigate to artist exploration
      await page.click('[data-testid="nav-artist-exploration"]');
      await expect(page.locator('[data-testid="artist-exploration"]')).toBeVisible();
      
      // Back to overview
      await page.click('[data-testid="nav-overview"]');
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
    });

    test('should handle direct URL navigation', async ({ page }) => {
      await mockSpotifyAuth(page);
      await mockSpotifyData(page);
      
      // Navigate directly to specific sections
      await page.goto('/dashboard/genre-analysis');
      await waitForDataLoad(page);
      await expect(page.locator('[data-testid="genre-analysis"]')).toBeVisible();
      
      await page.goto('/dashboard/listening-trends');
      await waitForDataLoad(page);
      await expect(page.locator('[data-testid="listening-trends"]')).toBeVisible();
      
      await page.goto('/dashboard/artist-exploration');
      await waitForDataLoad(page);
      await expect(page.locator('[data-testid="artist-exploration"]')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle 429 rate limiting gracefully', async ({ page }) => {
      await mockSpotifyAuth(page);
      
      // Mock rate limiting response
      await page.route('**/api/v1/me/top/**', route => route.fulfill({
        status: 429,
        headers: { 'Retry-After': '60' },
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Rate limit exceeded' } })
      }));
      
      await page.goto('/dashboard');
      
      // Should show rate limit message
      await expect(page.locator('text=Rate limit exceeded')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Please try again in a few minutes')).toBeVisible();
      
      // Should not crash the app
      await expect(page.locator('[data-testid="error-boundary"]')).not.toBeVisible();
    });

    test('should handle 403 forbidden errors', async ({ page }) => {
      await mockSpotifyAuth(page);
      
      // Mock forbidden response
      await page.route('**/api/v1/me/**', route => route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Insufficient permissions' } })
      }));
      
      await page.goto('/dashboard');
      
      // Should show permission error
      await expect(page.locator('text=Insufficient permissions')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=Please re-authenticate')).toBeVisible();
      
      // Should provide re-auth option
      await expect(page.locator('text=Re-authenticate')).toBeVisible();
    });

    test('should recover from temporary network issues', async ({ page }) => {
      await mockSpotifyAuth(page);
      
      // Start with network error
      await simulateNetworkError(page);
      await page.goto('/dashboard');
      
      // Should show error state
      await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible({ timeout: 10000 });
      
      // Restore network and retry
      await restoreNetworkConnectivity(page);
      await mockSpotifyData(page);
      
      // Should recover automatically or with retry
      await page.click('text=Retry');
      await waitForDataLoad(page);
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within acceptable time limits', async ({ page }) => {
      await mockSpotifyAuth(page);
      await mockSpotifyData(page);
      
      const startTime = Date.now();
      await page.goto('/dashboard');
      
      // Should show loading state quickly
      await expect(page.locator('[data-testid="loading-screen"]')).toBeVisible({ timeout: 1000 });
      
      // Should complete loading within 5 seconds
      await waitForDataLoad(page, 5000);
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
    });

    test('should handle large datasets without performance degradation', async ({ page }) => {
      await mockSpotifyAuth(page);
      
      // Mock large dataset
      await page.route('**/api/v1/me/top/tracks*', route => {
        const largeDataset = {
          items: Array.from({ length: 2000 }, (_, i) => ({
            id: `track_${i}`,
            name: `Track ${i}`,
            artists: [{ name: `Artist ${i}` }],
            popularity: Math.floor(Math.random() * 100),
            duration_ms: 180000 + Math.floor(Math.random() * 120000)
          }))
        };
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(largeDataset)
        });
      });
      
      await page.goto('/dashboard');
      await waitForDataLoad(page);
      
      // Should render without issues
      await expect(page.locator('[data-testid="dashboard-overview"]')).toBeVisible();
      
      // Should be responsive to interactions
      await page.click('[data-testid="nav-listening-trends"]');
      await expect(page.locator('[data-testid="listening-trends"]')).toBeVisible({ timeout: 2000 });
    });
  });
}); 