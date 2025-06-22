// @ts-ignore -- dev dependency type
export const setDemoAuth = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('spotify_access_token', 'demo_access_token');
    localStorage.setItem('spotify_refresh_token', 'demo_refresh_token');
    localStorage.setItem('spotify_token_expiry', (Date.now() + 3600_000).toString());
  });
}; 