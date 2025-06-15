
import { spotifyAuth } from '@/lib/spotify-auth';
import { sanitizeUserData } from '@/lib/data-utils';
import type { User } from './useAuthState';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useAuthHelpers = (
  setUser: (user: User | null) => void,
  setError: (error: string | null) => void
) => {
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
        'user_profile_image'
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
      
      setUser(sanitizedUser);
      localStorage.setItem('user_profile', JSON.stringify(sanitizedUser));
      storeProfileImage(userData);
      
      console.log('User data fetched and stored successfully:', sanitizedUser);
      return sanitizedUser;
    } catch (apiError: any) {
      console.error('Failed to fetch user data:', apiError);
      
      // Handle different types of API errors
      if (apiError.message?.includes('401') || apiError.message?.includes('invalid_token')) {
        setError('Your session has expired. Please log in again.');
        clearAllUserData();
        setUser(null);
      } else if (apiError.message?.includes('403')) {
        setError('Access denied. Please check your Spotify account permissions.');
      } else if (apiError.message?.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Unable to connect to Spotify. Please check your internet connection and try again.');
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
