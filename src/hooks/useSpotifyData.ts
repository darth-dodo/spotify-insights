
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
    useRecentlyPlayed,
    useCurrentPlayback,
  };
};
