
import { useEffect, useRef } from 'react';
import type { User } from './useAuthState';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useAuthInitialization = (
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setUser: (user: User | null) => void,
  fetchAndSetUser: () => Promise<any>,
  clearAllUserData: () => void
) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;

    const initAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        hasInitialized.current = true;

        // Check if we're on root path without authentication - this is demo mode
        if (window.location.pathname === '/') {
          const token = localStorage.getItem('spotify_access_token');
          console.log('Root path auth check - token exists:', !!token);

          if (!token) {
            console.log('No token found on root path, entering demo mode');
            setIsLoading(false);
            return;
          }

          // Check if token is expired
          const tokenExpiry = localStorage.getItem('spotify_token_expiry');
          if (tokenExpiry) {
            const isExpired = Date.now() > parseInt(tokenExpiry);
            if (isExpired && !USE_DUMMY_DATA) {
              console.log('Token expired on root path, entering demo mode');
              clearAllUserData();
              setUser(null);
              setIsLoading(false);
              return;
            }
          }
        }

        // Regular auth flow for other paths or when token exists
        const token = localStorage.getItem('spotify_access_token');
        console.log('Regular auth initialization - token exists:', !!token);

        if (!token) {
          console.log('No token found, user not authenticated');
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        const tokenExpiry = localStorage.getItem('spotify_token_expiry');
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
        
        // On root path, gracefully fall back to demo mode instead of showing error
        if (window.location.pathname === '/') {
          console.log('Auth error on root path, falling back to demo mode');
          setError(null);
          setUser(null);
        } else {
          setError('Failed to initialize authentication. Please refresh the page and try again.');
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // Empty dependency array to run only once

  // Reset initialization flag when component unmounts
  useEffect(() => {
    return () => {
      hasInitialized.current = false;
    };
  }, []);
};
