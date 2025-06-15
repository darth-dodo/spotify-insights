
import { useState } from 'react';

// Minimal user interface - only essential data
interface User {
  id: string; // hashed user ID
  display_name: string; // truncated display name
  has_image: boolean; // boolean flag instead of storing image URLs
  country: string; // 2-letter country code only
  images?: Array<{ url: string; height: number; width: number }>; // Keep for avatar display
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError,
  };
};

export type { User };
