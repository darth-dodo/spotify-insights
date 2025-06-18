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

        // Get current token state
        const token = localStorage.getItem('spotify_access_token');
        const isDemoToken = token === 'demo_access_token';
        const isOnSandboxPath = window.location.pathname === '/sandbox';
        const isOnRootPath = window.location.pathname === '/';

        console.log('Auth initialization:', { 
          token: !!token, 
          isDemoToken, 
          isOnSandboxPath, 
          isOnRootPath 
        });

        // If we're on root path without any token, enter demo mode
        if (isOnRootPath && !token) {
          setIsLoading(false);
          return;
        }

        // If we have a demo token but we're not on sandbox path, clear it
        if (isDemoToken && !isOnSandboxPath) {
          console.log('Demo token found outside sandbox, clearing auth data');
          clearAllUserData();
          setUser(null);
          setIsLoading(false);
          return;
        }

        // If we're on sandbox but don't have demo token, we're coming from normal mode
        if (isOnSandboxPath && token && !isDemoToken) {
          console.log('Real token found on sandbox path, this should not happen');
          // Don't clear the token, let sandbox mode handle it
          setIsLoading(false);
          return;
        }

        // Check if token is expired for real tokens
        if (token && !isDemoToken) {
          const tokenExpiry = localStorage.getItem('spotify_token_expiry');
          if (tokenExpiry) {
            const isExpired = Date.now() > parseInt(tokenExpiry);
            if (isExpired) {
              console.log('Real token expired, clearing auth data');
              clearAllUserData();
              setUser(null);
              setIsLoading(false);
              return;
            }
          }
        }

        // If we have a valid token, try to get user data
        if (token) {
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
        } else {
          console.log('No token found, user not authenticated');
          setIsLoading(false);
        }
        
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
