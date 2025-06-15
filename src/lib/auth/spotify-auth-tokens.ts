
import { isDemoMode, getClientId, getRedirectUri } from './spotify-auth-core';

export const handleCallback = async (code: string, state: string): Promise<void> => {
  if (isDemoMode()) {
    throw new Error('Callback should not be called in demo/sandbox mode');
  }

  const storedState = localStorage.getItem('auth_state');
  const codeVerifier = localStorage.getItem('code_verifier');

  if (state !== storedState) {
    throw new Error('State mismatch error');
  }

  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: getClientId()!,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: getRedirectUri(),
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limited during authentication. Please try again later.');
    }
    throw new Error('Token exchange failed');
  }

  const tokens = await response.json();
  
  localStorage.setItem('spotify_access_token', tokens.access_token);
  localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
  localStorage.setItem('spotify_token_expiry', (Date.now() + tokens.expires_in * 1000).toString());

  localStorage.removeItem('code_verifier');
  localStorage.removeItem('auth_state');
};

export const refreshAccessToken = async (refreshToken: string): Promise<any> => {
  if (isDemoMode()) {
    return {
      access_token: 'demo_access_token_refreshed',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken
    };
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: getClientId()!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limited during token refresh. Please try again later.');
    }
    throw new Error('Token refresh failed');
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('user_profile');
  localStorage.removeItem('user_profile_image');
  localStorage.removeItem('code_verifier');
  localStorage.removeItem('auth_state');
  
  console.log('All authentication data cleared from logout');
};
