import { spotifyAuth } from '@/lib/spotify-auth';
import { sanitizeUserData } from '@/lib/data-utils';
import { useLoading } from '@/components/providers/LoadingProvider';
import type { User } from './useAuthState';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useAuthHelpers = (
  setUser: (user: User | null) => void,
  setError: (error: string | null) => void
) => {
  const { setStage } = useLoading();

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
        'user_profile_image',
        'auth_state_list'
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
  const fetchAndSetUser = async () => {
    try {
      console.log('Fetching user data...');
      const userData = await spotifyAuth.getCurrentUser();
      const sanitizedUser = sanitizeUserData(userData);
      
      // Clear any previous authentication errors
      setError(null);
      setUser(sanitizedUser);
      localStorage.setItem('user_profile', JSON.stringify(sanitizedUser));
      storeProfileImage(userData);
      setStage('profile');
      
      console.log('User data fetched and stored successfully:', sanitizedUser);
      return sanitizedUser;
    } catch (apiError: any) {
      console.error('Failed to fetch user data:', apiError);
      
      // Enhanced error handling with more specific messages
      const getDetailedErrorMessage = (error: any): string => {
        const errorMessage = error?.message || '';
        const errorStatus = error?.status || error?.response?.status;
        
        // Check for specific HTTP status codes
        if (errorStatus === 401 || errorMessage.includes('401') || errorMessage.includes('invalid_token')) {
          return 'Your Spotify session has expired. Please log in again.';
        }
        
        if (errorStatus === 403 || errorMessage.includes('403') || errorMessage.includes('forbidden')) {
          return 'Access denied. Your Spotify app may need additional permissions.';
        }
        
        if (errorStatus === 429 || errorMessage.includes('429') || errorMessage.includes('rate limit')) {
          return 'Too many requests to Spotify. Please wait a moment and try again.';
        }
        
        if (errorStatus === 500 || errorMessage.includes('500') || errorMessage.includes('internal server')) {
          return 'Spotify service is temporarily unavailable. Please try again later.';
        }
        
        if (errorMessage.includes('CLIENT_ID') || errorMessage.includes('client_id')) {
          return 'Spotify app configuration error. Please check your app settings.';
        }
        
        if (errorMessage.includes('redirect_uri') || errorMessage.includes('REDIRECT_URI')) {
          return 'Redirect URI mismatch. Please check your Spotify app configuration.';
        }
        
        if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('NetworkError')) {
          return 'Network connection error. Please check your internet connection.';
        }
        
        if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
          return 'Cross-origin request blocked. Please check your app configuration.';
        }
        
        // Generic fallback
        return 'Unable to connect to Spotify. Please check your connection and try again.';
      };
      
      const detailedError = getDetailedErrorMessage(apiError);
      
      // Handle different types of API errors with enhanced logic
      if (apiError.message?.includes('401') || apiError.message?.includes('invalid_token')) {
        clearAllUserData();
        setUser(null);
        // Only set error if we're not on the root path (to avoid showing errors on landing page)
        if (window.location.pathname !== '/') {
          setError(detailedError);
        }
      } else if (apiError.message?.includes('403')) {
        setError(detailedError);
      } else if (apiError.message?.includes('429')) {
        setError(detailedError);
      } else {
        // For other errors, only show them if we're not on the root path
        if (window.location.pathname !== '/') {
          setError(detailedError);
        }
      }
      throw apiError;
    }
  };

  return {
    storeProfileImage,
    clearAllUserData,
    fetchAndSetUser,
  };
};
