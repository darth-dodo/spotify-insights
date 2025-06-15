
import { spotifyAPI } from '../spotify-api';
import { extensiveTopTracks, extensiveTopArtists, extensiveRecentlyPlayed } from '../extensive-dummy-data';
import type { IntegratedTrackData, IntegratedArtistData } from '../spotify-data-types';

export const shouldUseDummyData = (): boolean => {
  return window.location.pathname === '/sandbox';
};

export const ensurePositive = (value: number): number => {
  const result = Math.max(0, value || 0);
  if (value < 0) {
    console.warn('Negative value detected and corrected:', value, '→', result);
  }
  return result;
};

export const validateTrackData = (track: any): boolean => {
  if (!track || !track.id || !track.name) {
    console.warn('Invalid track data:', track);
    return false;
  }
  return true;
};

export const fetchRecentlyPlayedData = async (limit: number = 200): Promise<any[]> => {
  if (shouldUseDummyData()) {
    return extensiveRecentlyPlayed.items.slice(0, limit);
  }

  const token = localStorage.getItem('spotify_access_token');
  if (!token) {
    throw new Error('No access token available. Please authenticate with Spotify to view your listening data.');
  }

  let apiTracks: any[] = [];
  let nextUrl = null;
  let totalFetched = 0;

  do {
    const response = await spotifyAPI.getRecentlyPlayed(token, Math.min(50, limit - totalFetched));
    if (response?.items) {
      apiTracks.push(...response.items);
      nextUrl = response.next;
      totalFetched += response.items.length;
    } else {
      break;
    }
  } while (nextUrl && totalFetched < limit);

  if (apiTracks.length === 0) {
    throw new Error('No recently played tracks found. Start listening to music on Spotify to see your activity here.');
  }

  return apiTracks;
};

export const fetchTopTracksData = async (timeRange: string, totalLimit: number): Promise<any> => {
  if (shouldUseDummyData()) {
    return { items: extensiveTopTracks.items.slice(0, totalLimit) };
  }

  const token = localStorage.getItem('spotify_access_token');
  if (!token) {
    throw new Error('No access token available. Please authenticate with Spotify to view your top tracks.');
  }

  // Cap at 2000 for performance optimization
  const performanceLimit = Math.min(totalLimit, 2000);
  return spotifyAPI.getExtendedTopTracks(token, timeRange, performanceLimit);
};

export const fetchTopArtistsData = async (timeRange: string, totalLimit: number): Promise<any> => {
  if (shouldUseDummyData()) {
    return { items: extensiveTopArtists.items.slice(0, totalLimit) };
  }

  const token = localStorage.getItem('spotify_access_token');
  if (!token) {
    throw new Error('No access token available. Please authenticate with Spotify to view your top artists.');
  }

  // Cap at 2000 for performance optimization
  const performanceLimit = Math.min(totalLimit, 2000);
  return spotifyAPI.getExtendedTopArtists(token, timeRange, performanceLimit);
};
