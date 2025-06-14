
import { createContext, useContext, useEffect, useState } from 'react';
import { spotifyAuth } from '@/lib/spotify-auth';

interface User {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  country: string;
  followers: { total: number };
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
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      await spotifyAuth.login();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
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
      logout();
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
