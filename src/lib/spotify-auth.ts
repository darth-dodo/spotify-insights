import { spotifyAPI } from './spotify-api';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback`;
const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true' || !CLIENT_ID;

// Reduced scope - only essential permissions for analytics
const SCOPES = [
  'user-read-private',        // Basic profile info (name, country)
  'user-top-read',           // Top tracks and artists
  'user-read-recently-played' // Recent listening history
].join(' ');

class SpotifyAuth {
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  private async sha256(plain: string): Promise<ArrayBuffer> {
    // Check if Web Crypto API is available
    if (!crypto || !crypto.subtle) {
      console.warn('Web Crypto API not available, using fallback');
      // Simple fallback - just return a consistent buffer for development
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
    // Always use dummy data if no Client ID is configured
    if (USE_DUMMY_DATA) {
      console.log('Using dummy data for authentication');
      
      localStorage.setItem('spotify_access_token', 'dummy_access_token');
      localStorage.setItem('spotify_refresh_token', 'dummy_refresh_token');
      localStorage.setItem('spotify_token_expiry', (Date.now() + 3600 * 1000).toString());
      
      // Simulate a brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    if (!CLIENT_ID) {
      throw new Error('Spotify Client ID not configured. Please set VITE_SPOTIFY_CLIENT_ID in your environment variables or use dummy data.');
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
      // For dummy data, we shouldn't reach this callback
      throw new Error('Callback should not be called when using dummy data');
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
      throw new Error('Token exchange failed');
    }

    const tokens = await response.json();
    
    localStorage.setItem('spotify_access_token', tokens.access_token);
    localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
    localStorage.setItem('spotify_token_expiry', (Date.now() + tokens.expires_in * 1000).toString());

    // Clean up temporary storage
    localStorage.removeItem('code_verifier');
    localStorage.removeItem('auth_state');
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    if (USE_DUMMY_DATA) {
      // Return dummy token response
      return {
        access_token: 'dummy_access_token_refreshed',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: refreshToken // Keep the same refresh token
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
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    // Always pass the access token - the SpotifyAPI will handle dummy data internally
    return spotifyAPI.getCurrentUser(accessToken);
  }

  // Helper method to check if using dummy data
  isDummyMode(): boolean {
    return USE_DUMMY_DATA;
  }
}

export const spotifyAuth = new SpotifyAuth();
