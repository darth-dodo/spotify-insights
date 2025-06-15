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
  images?: Array<{ url: string; height: number; width: number }>; // Keep for avatar display
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

  // Helper function to safely store profile image
  const storeProfileImage = (userData: any) => {
    try {
      if (userData?.images?.[0]?.url) {
        localStorage.setItem('user_profile_image', userData.images[0].url);
        console.log('Profile image stored securely');
      }
    } catch (error) {
      console.warn('Failed to store profile image:', error);
    }
  };

  // Helper function to clear all user data safely
  const clearAllUserData = () => {
    try {
      const keysToRemove = [
        'spotify_access_token',
        'spotify_refresh_token', 
        'spotify_token_expiry',
        'user_profile',
        'user_profile_image'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('All user data cleared successfully');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Helper function to fetch and set user data
  const fetchAndSetUser = async (token: string) => {
    try {
      console.log('Fetching user data with token...');
      const userData = await spotifyAuth.getCurrentUser(token);
      const sanitizedUser = sanitizeUserData(userData);
      
      setUser(sanitizedUser);
      localStorage.setItem('user_profile', JSON.stringify(sanitizedUser));
      storeProfileImage(userData);
      
      console.log('User data fetched and stored successfully');
      return sanitizedUser;
    } catch (apiError: any) {
      console.error('Failed to fetch user data:', apiError);
      
      // Handle different types of API errors
      if (apiError.message?.includes('401') || apiError.message?.includes('invalid_token')) {
        setError('Your session has expired. Please log in again.');
        clearAllUserData();
        setUser(null);
      } else if (apiError.message?.includes('403')) {
        setError('Access denied. Please check your Spotify account permissions.');
      } else if (apiError.message?.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Unable to connect to Spotify. Please check your internet connection and try again.');
      }
      throw apiError;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have a valid token
        const token = localStorage.getItem('spotify_access_token');
        const tokenExpiry = localStorage.getItem('spotify_token_expiry');
        
        console.log('Initializing auth - token exists:', !!token);

        if (!token) {
          console.log('No token found, user not authenticated');
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (tokenExpiry) {
          const isExpired = Date.now() > parseInt(tokenExpiry);
          if (isExpired && !USE_DUMMY_DATA) {
            console.log('Token expired, clearing auth data');
            clearAllUserData();
            setUser(null);
            setIsLoading(false);
            return;
          }
        }

        // Try to get cached user data first
        const cachedUser = localStorage.getItem('user_profile');
        if (cachedUser) {
          try {
            const parsedUser = JSON.parse(cachedUser);
            console.log('Using cached user data');
            setUser(parsedUser);
            
            // For dummy data, we can trust the cached data completely
            if (USE_DUMMY_DATA) {
              setIsLoading(false);
              return;
            }
            
            // For real auth, validate the token by making a quick API call
            try {
              await fetchAndSetUser(token);
            } catch (validationError) {
              console.warn('Token validation failed, but keeping cached user for now');
              // Keep the cached user but set an error for background issues
              setError('Connection issues detected. Some features may be limited.');
            }
            
            setIsLoading(false);
            return;
          } catch (parseError) {
            console.error('Error parsing cached user data:', parseError);
            localStorage.removeItem('user_profile');
          }
        }

        // No cached user data, fetch fresh data
        await fetchAndSetUser(token);
        
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication. Please refresh the page and try again.');
        setUser(null);
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
      
      console.log('Starting login process...');
      await spotifyAuth.login();
      
      if (USE_DUMMY_DATA || spotifyAuth.isDummyMode()) {
        // For dummy data, manually set the user after fake login
        const token = localStorage.getItem('spotify_access_token');
        if (token) {
          await fetchAndSetUser(token);
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
