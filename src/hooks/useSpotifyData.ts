import { useQuery } from '@tanstack/react-query';
import { spotifyAPI } from '@/lib/spotify-api';
import { spotifyDataIntegration } from '@/lib/spotify-data-integration';

export const useSpotifyData = () => {
  const getAccessToken = () => {
    const token = localStorage.getItem('spotify_access_token');
    
    // Check if we're in demo mode
    const isDemoMode = window.location.pathname === '/sandbox' || 
      (window.location.pathname === '/' && (!token || token === 'demo_access_token'));
    
    if (isDemoMode) {
      console.log('Demo mode detected, using demo token');
      return 'demo_access_token';
    }
    
    if (!token) {
      throw new Error('No access token found. Please authenticate with Spotify.');
    }
    return token;
  };

  // Enhanced hooks using the integration service
  const useEnhancedRecentlyPlayed = (limit: number = 200) => {
    return useQuery({
      queryKey: ['enhanced-recently-played', limit],
      queryFn: () => spotifyDataIntegration.getEnhancedRecentlyPlayed(limit),
      staleTime: 1000 * 60 * 2,
      enabled: true,
      retry: (failureCount, error) => {
        // Don't retry on rate limits or auth errors
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  const useEnhancedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 2000) => {
    return useQuery({
      queryKey: ['enhanced-top-tracks', timeRange, totalLimit],
      queryFn: async () => {
        try {
          const tracks = await spotifyDataIntegration.getEnhancedTopTracks(timeRange, totalLimit);
          if (!tracks?.length) {
            console.warn('No tracks returned from getEnhancedTopTracks');
            return [];
          }
          return tracks;
        } catch (error) {
          console.warn('Error fetching enhanced top tracks:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 10,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      }
    });
  };

  const useEnhancedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 2000) => {
    return useQuery({
      queryKey: ['enhanced-top-artists', timeRange, totalLimit],
      queryFn: async () => {
        try {
          const artists = await spotifyDataIntegration.getEnhancedTopArtists(timeRange, totalLimit);
          if (!artists?.length) {
            console.warn('No artists returned from getEnhancedTopArtists');
            return [];
          }
          return artists;
        } catch (error) {
          console.warn('Error fetching enhanced top artists:', error);
          return [];
        }
      },
      staleTime: 1000 * 60 * 10,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      }
    });
  };

  // Legacy hooks for backward compatibility
  const useTopTracks = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-tracks', timeRange, limit],
      queryFn: () => {
        try {
          return spotifyAPI.getTopTracks(getAccessToken(), timeRange, limit);
        } catch (error) {
          console.warn('Failed to fetch top tracks, using empty data:', error);
          return { items: [] };
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: true,
      retry: false, // Disable retry in demo mode to prevent 401 loops
    });
  };

  const useTopArtists = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-artists', timeRange, limit],
      queryFn: () => {
        try {
          return spotifyAPI.getTopArtists(getAccessToken(), timeRange, limit);
        } catch (error) {
          console.warn('Failed to fetch top artists, using empty data:', error);
          return { items: [] };
        }
      },
      staleTime: 1000 * 60 * 5,
      enabled: true,
      retry: false, // Disable retry in demo mode to prevent 401 loops
    });
  };

  const useExtendedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-tracks', timeRange, totalLimit],
      queryFn: () => {
        try {
          return spotifyAPI.getExtendedTopTracks(getAccessToken(), timeRange, totalLimit);
        } catch (error) {
          console.warn('Failed to fetch extended top tracks, using empty data:', error);
          return { items: [] };
        }
      },
      staleTime: 1000 * 60 * 15,
      enabled: true,
      retry: false, // Disable retry in demo mode to prevent 401 loops
    });
  };

  const useExtendedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-artists', timeRange, totalLimit],
      queryFn: () => {
        try {
          return spotifyAPI.getExtendedTopArtists(getAccessToken(), timeRange, totalLimit);
        } catch (error) {
          console.warn('Failed to fetch extended top artists, using empty data:', error);
          return { items: [] };
        }
      },
      staleTime: 1000 * 60 * 15,
      enabled: true,
      retry: false, // Disable retry in demo mode to prevent 401 loops
    });
  };

  const useRecentlyPlayed = (limit: number = 50) => {
    return useQuery({
      queryKey: ['recently-played', limit],
      queryFn: () => {
        try {
          return spotifyAPI.getRecentlyPlayed(getAccessToken(), limit);
        } catch (error) {
          console.warn('Failed to fetch recently played, using empty data:', error);
          return { items: [] };
        }
      },
      staleTime: 1000 * 60 * 1,
      enabled: true,
      retry: false, // Don't retry frequently updated data, especially in demo mode
    });
  };

  const useCurrentPlayback = () => {
    return useQuery({
      queryKey: ['current-playback'],
      queryFn: () => {
        try {
          return spotifyAPI.getCurrentPlayback(getAccessToken());
        } catch (error) {
          console.warn('Failed to fetch current playback, using empty data:', error);
          return null;
        }
      },
      staleTime: 1000 * 30,
      enabled: true,
      retry: false,
    });
  };

  const useListeningStats = (timeRange: string = 'medium_term') => {
    return useQuery({
      queryKey: ['listening-stats', timeRange],
      queryFn: async () => {
        try {
          const tracks = await spotifyDataIntegration.getEnhancedTopTracks(timeRange, 1000);
          const timeRangeLabel = timeRange === 'short_term' ? 'Last 4 Weeks' :
                                timeRange === 'medium_term' ? 'Last 6 Months' :
                                'All Time';
          return spotifyDataIntegration.calculateListeningStats(tracks, timeRangeLabel);
        } catch (error) {
          console.warn('Failed to fetch listening stats, using default data:', error);
          return { totalTracks: 0, totalArtists: 0, topGenres: [] };
        }
      },
      staleTime: 1000 * 60 * 10,
      enabled: true,
      retry: false, // Disable retry in demo mode to prevent 401 loops
    });
  };

  return {
    useEnhancedRecentlyPlayed,
    useEnhancedTopTracks,
    useEnhancedTopArtists,
    useListeningStats,
    useTopTracks,
    useTopArtists,
    useExtendedTopTracks,
    useExtendedTopArtists,
    useRecentlyPlayed,
    useCurrentPlayback,
  };
};
