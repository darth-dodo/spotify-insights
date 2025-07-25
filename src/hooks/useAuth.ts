import { createContext, useContext } from 'react';
import { useAuthState, type User } from './useAuthState';
import { useAuthHelpers } from './useAuthHelpers';
import { useAuthActions } from './useAuthActions';
import { useAuthInitialization } from './useAuthInitialization';
import React from 'react';

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

export const useAuthProvider = () => {
  const { user, setUser, isLoading, setIsLoading, error, setError, clearError } = useAuthState();
  
  const { clearAllUserData, fetchAndSetUser } = useAuthHelpers(setUser, setError);
  
  const { login, logout, refreshToken } = useAuthActions(
    setIsLoading,
    setError,
    setUser,
    fetchAndSetUser,
    clearAllUserData
  );

  useAuthInitialization(
    setIsLoading,
    setError,
    setUser,
    fetchAndSetUser,
    clearAllUserData
  );

  // Detect token that appears AFTER initial mount (no hard reload)
  const lateFetchDone = React.useRef(false);
  React.useEffect(() => {
    if (user || lateFetchDone.current) return;

    const token = localStorage.getItem('spotify_access_token');
    const isDemoToken = token === 'demo_access_token';

    if (token && !isDemoToken) {
      lateFetchDone.current = true; // avoid loops
      (async () => {
        try {
          setIsLoading(true);
          await fetchAndSetUser();
        } catch (err) {
          console.error('Late auth fetch failed:', err);
          // allow retry on subsequent effect runs
          lateFetchDone.current = false;
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [user, fetchAndSetUser, setIsLoading]);

  // --- Auto-refresh access token one minute before expiry (skip demo) ---
  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      const token = localStorage.getItem('spotify_access_token');
      const expiry = Number(localStorage.getItem('spotify_token_expiry') || 0);
      const isDemo = token === 'demo_access_token';
      if (!token || !expiry || isDemo) return; // nothing to schedule

      const now = Date.now();
      const msBeforeExpiry = expiry - now;
      const msBeforeRefresh = msBeforeExpiry - 60_000; // refresh 1 min early
      if (msBeforeRefresh <= 0) {
        refreshToken().catch(console.error);
        return;
      }
      timer = setTimeout(() => refreshToken().catch(console.error), msBeforeRefresh);
    };

    schedule();

    // Re-schedule when user or auth state changes (e.g., logout)
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user]);

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
export type { User };
