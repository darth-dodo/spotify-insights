
import { useQuery } from '@tanstack/react-query';
import { spotifyAPI } from '@/lib/spotify-api';
import { spotifyDataIntegration } from '@/lib/spotify-data-integration';

// Use dummy data in sandbox mode OR when on root with no authentication
const USE_DUMMY_DATA = window.location.pathname === '/sandbox' || 
                      (window.location.pathname === '/' && !localStorage.getItem('spotify_access_token'));

export const useSpotifyData = () => {
  const getAccessToken = () => {
    if (USE_DUMMY_DATA) return undefined;
    
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      throw new Error('No access token found. Please authenticate with Spotify.');
    }
    return token;
  };

  // Enhanced hooks using the integration service
  const useEnhancedRecentlyPlayed = (limit: number = 200) => {
    return useQuery({
      queryKey: ['enhanced-recently-played', limit, USE_DUMMY_DATA],
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

  const useEnhancedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['enhanced-top-tracks', timeRange, totalLimit, USE_DUMMY_DATA],
      queryFn: () => spotifyDataIntegration.getEnhancedTopTracks(timeRange, totalLimit),
      staleTime: 1000 * 60 * 10,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  const useEnhancedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['enhanced-top-artists', timeRange, totalLimit, USE_DUMMY_DATA],
      queryFn: () => spotifyDataIntegration.getEnhancedTopArtists(timeRange, totalLimit),
      staleTime: 1000 * 60 * 10,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  // Legacy hooks for backward compatibility
  const useTopTracks = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-tracks', timeRange, limit, USE_DUMMY_DATA],
      queryFn: () => spotifyAPI.getTopTracks(getAccessToken(), timeRange, limit),
      staleTime: 1000 * 60 * 5,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  const useTopArtists = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-artists', timeRange, limit, USE_DUMMY_DATA],
      queryFn: () => spotifyAPI.getTopArtists(getAccessToken(), timeRange, limit),
      staleTime: 1000 * 60 * 5,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  const useExtendedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-tracks', timeRange, totalLimit, USE_DUMMY_DATA],
      queryFn: () => spotifyAPI.getExtendedTopTracks(getAccessToken(), timeRange, totalLimit),
      staleTime: 1000 * 60 * 15,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  const useExtendedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-artists', timeRange, totalLimit, USE_DUMMY_DATA],
      queryFn: () => spotifyAPI.getExtendedTopArtists(getAccessToken(), timeRange, totalLimit),
      staleTime: 1000 * 60 * 15,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
    });
  };

  const useRecentlyPlayed = (limit: number = 50) => {
    return useQuery({
      queryKey: ['recently-played', limit, USE_DUMMY_DATA],
      queryFn: () => spotifyAPI.getRecentlyPlayed(getAccessToken(), limit),
      staleTime: 1000 * 60 * 1,
      enabled: true,
      retry: false, // Don't retry frequently updated data
    });
  };

  const useCurrentPlayback = () => {
    return useQuery({
      queryKey: ['current-playback', USE_DUMMY_DATA],
      queryFn: () => spotifyAPI.getCurrentPlayback(getAccessToken()),
      staleTime: 1000 * 30,
      enabled: true,
      retry: false,
    });
  };

  const useListeningStats = (timeRange: string = 'medium_term') => {
    return useQuery({
      queryKey: ['listening-stats', timeRange, USE_DUMMY_DATA],
      queryFn: async () => {
        const tracks = await spotifyDataIntegration.getEnhancedTopTracks(timeRange, 1000);
        const timeRangeLabel = timeRange === 'short_term' ? 'Last 4 Weeks' :
                              timeRange === 'medium_term' ? 'Last 6 Months' :
                              'All Time';
        return spotifyDataIntegration.calculateListeningStats(tracks, timeRangeLabel);
      },
      staleTime: 1000 * 60 * 10,
      enabled: true,
      retry: (failureCount, error) => {
        if (error?.message?.includes('429') || error?.message?.includes('401')) {
          return false;
        }
        return failureCount < 2;
      },
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
