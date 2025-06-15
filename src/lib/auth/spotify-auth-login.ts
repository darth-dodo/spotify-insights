
import { isDemoMode, getClientId, getRedirectUri, getScopes } from './spotify-auth-core';
import { generateRandomString, sha256, base64encode } from './spotify-auth-crypto';

export const login = async (): Promise<void> => {
  if (isDemoMode()) {
    console.log('Using dummy data for demo/sandbox authentication');
    localStorage.setItem('spotify_access_token', 'demo_access_token');
    localStorage.setItem('spotify_refresh_token', 'demo_refresh_token');
    localStorage.setItem('spotify_token_expiry', (Date.now() + 3600 * 1000).toString());
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  }

  const CLIENT_ID = getClientId();
  if (!CLIENT_ID) {
    throw new Error('Spotify Client ID not configured. Please set VITE_SPOTIFY_CLIENT_ID in your environment variables.');
  }

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const state = generateRandomString(16);

  localStorage.setItem('code_verifier', codeVerifier);
  localStorage.setItem('auth_state', state);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  const params = {
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: getScopes(),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state: state,
    redirect_uri: getRedirectUri(),
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
};
