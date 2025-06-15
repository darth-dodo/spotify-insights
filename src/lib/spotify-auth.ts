import { spotifyAPI } from './spotify-api';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`;

// Only use sandbox mode when explicitly on /sandbox route
const USE_DUMMY_DATA = window.location.pathname === '/sandbox';

const SCOPES = [
  'user-read-private',
  'user-top-read',
  'user-read-recently-played',
  'streaming'  // Added streaming scope for Web Playback SDK
].join(' ');

class SpotifyAuth {
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  private async sha256(plain: string): Promise<ArrayBuffer> {
    if (!crypto || !crypto.subtle) {
      console.warn('Web Crypto API not available, using fallback');
      const encoder = new TextEncoder();
      return encoder.encode(plain + '_fallback').buffer;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
  }

  private base64encode(input: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  async login(): Promise<void> {
    // Only use dummy data in sandbox mode
    if (USE_DUMMY_DATA) {
      console.log('Using dummy data for sandbox authentication');
      localStorage.setItem('spotify_access_token', 'sandbox_access_token');
      localStorage.setItem('spotify_refresh_token', 'sandbox_refresh_token');
      localStorage.setItem('spotify_token_expiry', (Date.now() + 3600 * 1000).toString());
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    // Require real authentication for production mode
    if (!CLIENT_ID) {
      throw new Error('Spotify Client ID not configured. Please set VITE_SPOTIFY_CLIENT_ID in your environment variables.');
    }

    const codeVerifier = this.generateRandomString(64);
    const hashed = await this.sha256(codeVerifier);
    const codeChallenge = this.base64encode(hashed);
    const state = this.generateRandomString(16);

    localStorage.setItem('code_verifier', codeVerifier);
    localStorage.setItem('auth_state', state);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state: state,
      redirect_uri: REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  }

  async handleCallback(code: string, state: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      throw new Error('Callback should not be called in sandbox mode');
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
        client_id: CLIENT_ID!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
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
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    if (USE_DUMMY_DATA) {
      return {
        access_token: 'sandbox_access_token_refreshed',
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
        client_id: CLIENT_ID!,
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
  }

  async logout(): Promise<void> {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  }

  async getCurrentUser(): Promise<any> {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      throw new Error('No access token found');
    }
    return spotifyAPI.getCurrentUser(token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (!token || !expiry) {
      return false;
    }
    
    return Date.now() < parseInt(expiry);
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (!token || !expiry || Date.now() >= parseInt(expiry)) {
      return null;
    }
    
    return token;
  }
}

export const spotifyAuth = new SpotifyAuth();
