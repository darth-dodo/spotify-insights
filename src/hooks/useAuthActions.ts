
import { spotifyAuth } from '@/lib/spotify-auth';
import type { User } from './useAuthState';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useAuthActions = (
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setUser: (user: User | null) => void,
  fetchAndSetUser: () => Promise<any>,
  clearAllUserData: () => void
) => {
  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Starting login process...');
      await spotifyAuth.login();
      
      if (USE_DUMMY_DATA || window.location.pathname === '/sandbox') {
        // For dummy data, manually set the user after fake login
        const token = localStorage.getItem('spotify_access_token');
        if (token) {
          console.log('Dummy data login completed, fetching user data...');
          await fetchAndSetUser();
          console.log('User data set successfully after dummy login');
        }
      }
      // For real auth, the redirect will handle the rest and the useEffect will pick up the changes
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message?.includes('popup_closed')) {
        setError('Login was cancelled. Please try again.');
      } else if (error.message?.includes('Client ID')) {
        setError('Spotify configuration error. Please contact support.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user...');
      setUser(null);
      setError(null);
      clearAllUserData();
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if there's an error
      setUser(null);
      setError(null);
      clearAllUserData();
    }
  };

  const refreshToken = async () => {
    try {
      setError(null);
      const refreshTokenValue = localStorage.getItem('spotify_refresh_token');
      if (refreshTokenValue) {
        console.log('Refreshing access token...');
        const tokens = await spotifyAuth.refreshAccessToken(refreshTokenValue);
        localStorage.setItem('spotify_access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
        }
        localStorage.setItem('spotify_token_expiry', (Date.now() + tokens.expires_in * 1000).toString());
        console.log('Token refreshed successfully');
      }
    } catch (error: any) {
      console.error('Token refresh error:', error);
      
      if (error.message?.includes('invalid_grant')) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Failed to refresh session. Please log in again.');
      }
      
      if (!USE_DUMMY_DATA) {
        logout();
      }
    }
  };

  return {
    login,
    logout,
    refreshToken,
  };
};
