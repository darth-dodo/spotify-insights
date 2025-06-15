import { useQuery } from '@tanstack/react-query';
import { spotifyAPI } from '@/lib/spotify-api';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

export const useSpotifyData = () => {
  const getAccessToken = () => {
    return USE_DUMMY_DATA ? undefined : localStorage.getItem('spotify_access_token');
  };

  const useTopTracks = (timeRange: string = 'medium_term', limit: number = 50) => {
    return useQuery({
      queryKey: ['top-tracks', timeRange, limit],
      queryFn: () => spotifyAPI.getTopTracks(getAccessToken(), timeRange, limit),
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: true, // Always enabled since we handle dummy data in the API
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

  // Updated hook for extended top tracks (default to 1000)
  const useExtendedTopTracks = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-tracks', timeRange, totalLimit],
      queryFn: () => spotifyAPI.getExtendedTopTracks(getAccessToken(), timeRange, totalLimit),
      staleTime: 1000 * 60 * 15, // 15 minutes (longer cache for larger datasets)
      enabled: true,
    });
  };

  // Updated hook for extended top artists (default to 1000)
  const useExtendedTopArtists = (timeRange: string = 'medium_term', totalLimit: number = 1000) => {
    return useQuery({
      queryKey: ['extended-top-artists', timeRange, totalLimit],
      queryFn: () => spotifyAPI.getExtendedTopArtists(getAccessToken(), timeRange, totalLimit),
      staleTime: 1000 * 60 * 15, // 15 minutes (longer cache for larger datasets)
      enabled: true,
    });
  };

  const useRecentlyPlayed = (limit: number = 50) => {
    return useQuery({
      queryKey: ['recently-played', limit],
      queryFn: () => spotifyAPI.getRecentlyPlayed(getAccessToken(), limit),
      staleTime: 1000 * 60 * 1, // 1 minute for recent data
      enabled: true,
    });
  };

  const useCurrentPlayback = () => {
    return useQuery({
      queryKey: ['current-playback'],
      queryFn: () => spotifyAPI.getCurrentPlayback(getAccessToken()),
      staleTime: 1000 * 30, // 30 seconds for current playback
      enabled: true,
      retry: false, // Don't retry if no current playback
    });
  };

  return {
    useTopTracks,
    useTopArtists,
    useExtendedTopTracks,
    useExtendedTopArtists,
    useRecentlyPlayed,
    useCurrentPlayback,
  };
};
