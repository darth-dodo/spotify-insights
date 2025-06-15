import { useEffect } from 'react';
import type { User } from './useAuthState';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useAuthInitialization = (
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setUser: (user: User | null) => void,
  fetchAndSetUser: () => Promise<any>,
  clearAllUserData: () => void
) => {
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
              await fetchAndSetUser();
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
        await fetchAndSetUser();
        
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication. Please refresh the page and try again.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setIsLoading, setError, setUser, fetchAndSetUser, clearAllUserData]);
};
