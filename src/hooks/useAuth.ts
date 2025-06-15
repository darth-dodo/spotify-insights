
import { createContext, useContext, useEffect, useState } from 'react';
import { spotifyAuth } from '@/lib/spotify-auth';
import { sanitizeUserData, hashData } from '@/lib/data-utils';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

// Minimal user interface - only essential data
interface User {
  id: string; // hashed user ID
  display_name: string; // truncated display name
  has_image: boolean; // boolean flag instead of storing image URLs
  country: string; // 2-letter country code only
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have cached user data first
        const cachedUser = localStorage.getItem('user_profile');
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            setUser(parsedUser);
            setIsLoading(false);
            
            // Still validate the token in background
            const token = localStorage.getItem('spotify_access_token');
            if (token && !USE_DUMMY_DATA) {
              try {
                await spotifyAuth.getCurrentUser(token);
              } catch (tokenError) {
                console.warn('Token validation failed, will need re-auth:', tokenError);
                // Don't immediately clear - let user try to use the app first
              }
            }
            return;
          } catch (parseError) {
            console.error('Error parsing cached user data:', parseError);
            localStorage.removeItem('user_profile');
          }
        }

        const token = localStorage.getItem('spotify_access_token');
        if (token) {
          try {
            const userData = await spotifyAuth.getCurrentUser(token);
            const sanitizedUser = sanitizeUserData(userData);
            setUser(sanitizedUser);
            localStorage.setItem('user_profile', JSON.stringify(sanitizedUser));
          } catch (apiError: any) {
            console.error('Failed to fetch user data:', apiError);
            
            // Handle different types of API errors
            if (apiError.message?.includes('401') || apiError.message?.includes('invalid_token')) {
              setError('Your session has expired. Please log in again.');
              if (!USE_DUMMY_DATA) {
                localStorage.removeItem('spotify_access_token');
                localStorage.removeItem('spotify_refresh_token');
                localStorage.removeItem('user_profile');
              }
            } else if (apiError.message?.includes('403')) {
              setError('Access denied. Please check your Spotify account permissions.');
            } else if (apiError.message?.includes('429')) {
              setError('Too many requests. Please wait a moment and try again.');
            } else {
              setError('Unable to connect to Spotify. Please check your internet connection and try again.');
            }
          }
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication. Please refresh the page and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await spotifyAuth.login();
      
      if (USE_DUMMY_DATA) {
        // For dummy data, we need to manually set the user after fake login
        const userData = await spotifyAuth.getCurrentUser('dummy_token');
        const sanitizedUser = sanitizeUserData(userData);
        setUser(sanitizedUser);
        localStorage.setItem('user_profile', JSON.stringify(sanitizedUser));
        setIsLoading(false);
      }
      // For real auth, the redirect will handle the rest
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message?.includes('popup_closed')) {
        setError('Login was cancelled. Please try again.');
      } else if (error.message?.includes('Client ID')) {
        setError('Spotify configuration error. Please contact support.');
      } else {
        setError('Login failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    // Clear all stored data
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('user_profile');
  };

  const refreshToken = async () => {
    try {
      setError(null);
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      if (refreshToken) {
        const tokens = await spotifyAuth.refreshAccessToken(refreshToken);
        localStorage.setItem('spotify_access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
        }
        localStorage.setItem('spotify_token_expiry', (Date.now() + tokens.expires_in * 1000).toString());
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

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    clearError,
  };
};

export { AuthContext };
