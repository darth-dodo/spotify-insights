
import { createContext, useContext } from 'react';
import { useAuthState, type User } from './useAuthState';
import { useAuthHelpers } from './useAuthHelpers';
import { useAuthActions } from './useAuthActions';
import { useAuthInitialization } from './useAuthInitialization';

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
