
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
  login: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
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

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (token) {
          const userData = await spotifyAuth.getCurrentUser(token);
          // Sanitize and store minimal user data
          const sanitizedUser = sanitizeUserData(userData);
          setUser(sanitizedUser);
          
          // Store only essential data in localStorage
          localStorage.setItem('user_profile', JSON.stringify(sanitizedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (!USE_DUMMY_DATA) {
          // Only clear tokens if not using dummy data
          localStorage.removeItem('spotify_access_token');
          localStorage.removeItem('spotify_refresh_token');
        }
        localStorage.removeItem('user_profile');
      } finally {
        setIsLoading(false);
      }
    };

    // Check if we have cached user data first
    const cachedUser = localStorage.getItem('user_profile');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
        setIsLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing cached user data:', error);
        localStorage.removeItem('user_profile');
      }
    }

    initAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // Clear all stored data
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('user_profile');
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('spotify_refresh_token');
      if (refreshToken) {
        const tokens = await spotifyAuth.refreshAccessToken(refreshToken);
        localStorage.setItem('spotify_access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
        }
        localStorage.setItem('spotify_token_expiry', (Date.now() + tokens.expires_in * 1000).toString());
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      if (!USE_DUMMY_DATA) {
        logout();
      }
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    refreshToken,
  };
};

export { AuthContext };
