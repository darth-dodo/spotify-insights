
import { useQuery } from '@tanstack/react-query';
import { spotifyAPI } from '@/lib/spotify-api';
import { spotifyDataIntegration } from '@/lib/spotify-data-integration';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useSpotifyData = () => {
  const getAccessToken = () => {
    return USE_DUMMY_DATA ? undefined : localStorage.getItem('spotify_access_token');
  };

  // Enhanced hooks using the integration service
  const useEnhancedRecentlyPlayed = (limit: number = 200) => {
    return useQuery({
      queryKey: ['enhanced-recently-played', limit],
      queryFn: () => spotifyDataIntegration.getEnhancedRecentlyPlayed(limit),
      staleTime: 1000 * 60 * 2, // 2 minutes
      enabled: true,
    });
  };

  const useEnhancedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['enhanced-top-tracks', timeRange, totalLimit],
      queryFn: () => spotifyDataIntegration.getEnhancedTopTracks(timeRange, totalLimit),
      staleTime: 1000 * 60 * 10, // 10 minutes
      enabled: true,
    });
  };

  const useEnhancedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['enhanced-top-artists', timeRange, totalLimit],
      queryFn: () => spotifyDataIntegration.getEnhancedTopArtists(timeRange, totalLimit),
      staleTime: 1000 * 60 * 10, // 10 minutes
      enabled: true,
    });
  };

  // Legacy hooks for backward compatibility
  const useTopTracks = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-tracks', timeRange, limit],
      queryFn: () => spotifyAPI.getTopTracks(getAccessToken(), timeRange, limit),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: true,
    });
  };

  const useTopArtists = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-artists', timeRange, limit],
      queryFn: () => spotifyAPI.getTopArtists(getAccessToken(), timeRange, limit),
      staleTime: 1000 * 60 * 5,
      enabled: true,
    });
  };

  const useExtendedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-tracks', timeRange, totalLimit],
      queryFn: () => spotifyAPI.getExtendedTopTracks(getAccessToken(), timeRange, totalLimit),
      staleTime: 1000 * 60 * 15,
      enabled: true,
    });
  };

  const useExtendedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-artists', timeRange, totalLimit],
      queryFn: () => spotifyAPI.getExtendedTopArtists(getAccessToken(), timeRange, totalLimit),
      staleTime: 1000 * 60 * 15,
      enabled: true,
    });
  };

  const useRecentlyPlayed = (limit: number = 50) => {
    return useQuery({
      queryKey: ['recently-played', limit],
      queryFn: () => spotifyAPI.getRecentlyPlayed(getAccessToken(), limit),
      staleTime: 1000 * 60 * 1,
      enabled: true,
    });
  };

  const useCurrentPlayback = () => {
    return useQuery({
      queryKey: ['current-playback'],
      queryFn: () => spotifyAPI.getCurrentPlayback(getAccessToken()),
      staleTime: 1000 * 30,
      enabled: true,
      retry: false,
    });
  };

  // Listening statistics calculation
  const useListeningStats = (timeRange: string = 'medium_term') => {
    return useQuery({
      queryKey: ['listening-stats', timeRange],
      queryFn: async () => {
        const tracks = await spotifyDataIntegration.getEnhancedTopTracks(timeRange, 1000);
        const timeRangeLabel = timeRange === 'short_term' ? 'Last 4 Weeks' :
                              timeRange === 'medium_term' ? 'Last 6 Months' :
                              'All Time';
        return spotifyDataIntegration.calculateListeningStats(tracks, timeRangeLabel);
      },
      staleTime: 1000 * 60 * 10,
      enabled: true,
    });
  };

  return {
    // Enhanced hooks with integration
    useEnhancedRecentlyPlayed,
    useEnhancedTopTracks,
    useEnhancedTopArtists,
    useListeningStats,
    
    // Legacy hooks
    useTopTracks,
    useTopArtists,
    useExtendedTopTracks,
    useExtendedTopArtists,
    useRecentlyPlayed,
    useCurrentPlayback,
  };
};
