// @ts-ignore -- dev dependency type
export const setDemoAuth = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('spotify_access_token', 'demo_access_token');
    localStorage.setItem('spotify_refresh_token', 'demo_refresh_token');
    localStorage.setItem('spotify_token_expiry', (Date.now() + 3600_000).toString());
  });
};

// @ts-ignore -- dev dependency type
export const mockSpotifyAuth = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('spotify_access_token', 'mock_valid_token');
    localStorage.setItem('spotify_refresh_token', 'mock_refresh_token');
    localStorage.setItem('spotify_token_expiry', (Date.now() + 3600_000).toString());
  });
};

// @ts-ignore -- dev dependency type
export const clearAuthState = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_user_data');
  });
};

// @ts-ignore -- dev dependency type
export const mockSpotifyData = async (page: import('@playwright/test').Page) => {
  // Mock user profile
  await page.route('**/api/v1/me', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 'mock_user',
      display_name: 'Mock User',
      email: 'mock@example.com',
      country: 'US',
      followers: { total: 100 },
      images: []
    })
  }));

  // Mock top tracks
  await page.route('**/api/v1/me/top/tracks*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      items: Array.from({ length: 20 }, (_, i) => ({
        id: `track_${i}`,
        name: `Track ${i}`,
        artists: [{ id: `artist_${i}`, name: `Artist ${i}` }],
        album: { id: `album_${i}`, name: `Album ${i}`, images: [] },
        popularity: 80 - i,
        duration_ms: 180000 + (i * 1000),
        external_urls: { spotify: `https://open.spotify.com/track/track_${i}` }
      }))
    })
  }));

  // Mock top artists
  await page.route('**/api/v1/me/top/artists*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      items: Array.from({ length: 20 }, (_, i) => ({
        id: `artist_${i}`,
        name: `Artist ${i}`,
        genres: i % 2 === 0 ? ['rock', 'alternative'] : ['pop', 'electronic'],
        popularity: 85 - i,
        followers: { total: 10000 - (i * 100) },
        images: [],
        external_urls: { spotify: `https://open.spotify.com/artist/artist_${i}` }
      }))
    })
  }));

  // Mock recently played
  await page.route('**/api/v1/me/player/recently-played*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      items: Array.from({ length: 10 }, (_, i) => ({
        played_at: new Date(Date.now() - (i * 3600000)).toISOString(),
        track: {
          id: `recent_track_${i}`,
          name: `Recent Track ${i}`,
          artists: [{ name: `Recent Artist ${i}` }],
          album: { name: `Recent Album ${i}` },
          duration_ms: 200000
        }
      }))
    })
  }));

  // Mock saved tracks
  await page.route('**/api/v1/me/tracks*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      items: Array.from({ length: 20 }, (_, i) => ({
        added_at: new Date(Date.now() - (i * 86400000)).toISOString(),
        track: {
          id: `saved_track_${i}`,
          name: `Saved Track ${i}`,
          artists: [{ name: `Saved Artist ${i}` }],
          album: { name: `Saved Album ${i}` },
          duration_ms: 190000
        }
      }))
    })
  }));
};

// @ts-ignore -- dev dependency type
export const waitForDataLoad = async (page: import('@playwright/test').Page, timeout: number = 10000) => {
  // Wait for loading screen to disappear
  await page.waitForSelector('[data-testid="loading-screen"]', { state: 'hidden', timeout });
  
  // Wait for dashboard content to appear
  await page.waitForSelector('[data-testid="dashboard-overview"]', { state: 'visible', timeout });
  
  // Wait for any progressive loaders to finish
  await page.waitForFunction(() => {
    const progressiveLoaders = document.querySelectorAll('[data-testid="progressive-loader"]');
    return progressiveLoaders.length === 0 || 
           Array.from(progressiveLoaders).every(loader => 
             (loader as HTMLElement).style.display === 'none'
           );
  }, { timeout });
};

// @ts-ignore -- dev dependency type
export const simulateNetworkError = async (page: import('@playwright/test').Page) => {
  // Abort all Spotify API requests to simulate network issues
  await page.route('**/api.spotify.com/**', route => route.abort());
  await page.route('**/accounts.spotify.com/**', route => route.abort());
};

// @ts-ignore -- dev dependency type
export const restoreNetworkConnectivity = async (page: import('@playwright/test').Page) => {
  // Remove all route handlers to restore normal network behavior
  await page.unroute('**/api.spotify.com/**');
  await page.unroute('**/accounts.spotify.com/**');
};

// @ts-ignore -- dev dependency type
export const waitForAuthRedirect = async (page: import('@playwright/test').Page) => {
  // Wait for redirect to Spotify OAuth
  await page.waitForURL('**/accounts.spotify.com/**', { timeout: 5000 });
  
  // Mock successful OAuth callback
  await page.goto('/callback?code=mock_auth_code&state=mock_state');
};

// @ts-ignore -- dev dependency type
export const simulateSlowNetwork = async (page: import('@playwright/test').Page, delayMs: number = 2000) => {
  await page.route('**/api/v1/me/**', async route => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.continue();
  });
};

// @ts-ignore -- dev dependency type
export const mockEmptySpotifyData = async (page: import('@playwright/test').Page) => {
  // Mock empty responses for users with no data
  await page.route('**/api/v1/me/top/tracks*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] })
  }));

  await page.route('**/api/v1/me/top/artists*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] })
  }));

  await page.route('**/api/v1/me/player/recently-played*', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] })
  }));
};

// @ts-ignore -- dev dependency type
export const mockSpotifyError = async (page: import('@playwright/test').Page, statusCode: number, errorMessage: string) => {
  await page.route('**/api/v1/me/**', route => route.fulfill({
    status: statusCode,
    contentType: 'application/json',
    body: JSON.stringify({
      error: {
        status: statusCode,
        message: errorMessage
      }
    })
  }));
};

// @ts-ignore -- dev dependency type
export const setupDemoMode = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    // Set demo mode indicators
    localStorage.setItem('spotify_access_token', 'demo_access_token');
    localStorage.setItem('demo_mode', 'true');
  });
};

// @ts-ignore -- dev dependency type
export const verifyDashboardLoaded = async (page: import('@playwright/test').Page) => {
  // Verify all key dashboard components are loaded
  await page.waitForSelector('[data-testid="dashboard-overview"]', { state: 'visible' });
  await page.waitForSelector('[data-testid="stats-overview"]', { state: 'visible' });
  await page.waitForSelector('[data-testid="top-tracks-preview"]', { state: 'visible' });
};

// @ts-ignore -- dev dependency type
export const navigateToSection = async (page: import('@playwright/test').Page, section: string) => {
  await page.click(`[data-testid="nav-${section}"]`);
  await page.waitForSelector(`[data-testid="${section}"]`, { state: 'visible' });
}; 