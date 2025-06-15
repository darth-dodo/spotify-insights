
import { login } from './auth/spotify-auth-login';
import { handleCallback, refreshAccessToken, logout } from './auth/spotify-auth-tokens';
import { 
  isAuthenticated, 
  getAccessToken, 
  getCurrentUser, 
  validateTokenScopes 
} from './auth/spotify-auth-core';

class SpotifyAuth {
  async login(): Promise<void> {
    return login();
  }

  async handleCallback(code: string, state: string): Promise<void> {
    return handleCallback(code, state);
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    return refreshAccessToken(refreshToken);
  }

  async logout(): Promise<void> {
    return logout();
  }

  async getCurrentUser(): Promise<any> {
    return getCurrentUser();
  }

  isAuthenticated(): boolean {
    return isAuthenticated();
  }

  getAccessToken(): string | null {
    return getAccessToken();
  }

  validateTokenScopes(requiredScopes: string[] = ['streaming']): boolean {
    return validateTokenScopes(requiredScopes);
  }
}

export const spotifyAuth = new SpotifyAuth();
