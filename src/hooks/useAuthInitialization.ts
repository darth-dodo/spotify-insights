import { useEffect, useRef } from 'react';
import type { User } from './useAuthState';
import { useLoading } from '@/components/providers/LoadingProvider';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useAuthInitialization = (
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setUser: (user: User | null) => void,
  fetchAndSetUser: () => Promise<any>,
  clearAllUserData: () => void
) => {
  const hasInitialized = useRef(false);
  const { setError: setLoadingError } = useLoading();

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
              // Clear any previous auth error
              setError(null);
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
          setError(null);
        } else {
          console.log('No token found, user not authenticated');
          setIsLoading(false);
        }
        
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        
        // Provide more specific error messages based on the error type
        const getSpecificErrorMessage = (error: any): string => {
          const errorMessage = error?.message || '';
          
          if (errorMessage.includes('CLIENT_ID') || errorMessage.includes('client_id')) {
            return 'Spotify app configuration error. Please check your client ID setup.';
          }
          
          if (errorMessage.includes('401') || errorMessage.includes('invalid_token')) {
            return 'Your Spotify session has expired. Please log in again.';
          }
          
          if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
            return 'Access denied. Please check your Spotify app permissions.';
          }
          
          if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
            return 'Too many requests. Please wait a moment and try again.';
          }
          
          if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
            return 'Network connection error. Please check your internet connection.';
          }
          
          if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
            return 'Configuration error. Please check your redirect URI settings.';
          }
          
          // Generic fallback
          return 'Authentication initialization failed. Please refresh and try again.';
        };
        
        // On root path, gracefully fall back to demo mode instead of showing error
        if (window.location.pathname === '/') {
          console.log('Auth error on root path, falling back to demo mode');
          setError(null);
          setLoadingError(null);
          setUser(null);
        } else if (window.location.pathname.startsWith('/dashboard')) {
          // On dashboard paths, only show error if it's not a simple token expiration
          if (error?.message?.includes('401') || error?.message?.includes('invalid_token')) {
            console.log('Token expired on dashboard, clearing auth silently');
            clearAllUserData();
            setError(null);
            setLoadingError(null);
            setUser(null);
            // Redirect to home for re-authentication
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          } else {
            const errorMessage = getSpecificErrorMessage(error);
            setError(errorMessage);
            setLoadingError(errorMessage);
            setUser(null);
          }
        } else {
          // For other paths, show the specific error
          const errorMessage = getSpecificErrorMessage(error);
          setError(errorMessage);
          setLoadingError(errorMessage);
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
