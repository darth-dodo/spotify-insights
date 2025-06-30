
import { spotifyAPI } from '../spotify-api';
import { improvedTopTracks, improvedTopArtists, improvedRecentlyPlayed } from '../improved-sandbox-data';
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
    return improvedRecentlyPlayed.items.slice(0, limit);
  }

  const token = localStorage.getItem('spotify_access_token');
  if (!token || token === 'demo_access_token') {
    console.warn('No valid access token available for recently played data');
    return [];
  }

  try {
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

    return apiTracks;
  } catch (error) {
    console.warn('Failed to fetch recently played data:', error);
    return [];
  }
};

export const fetchTopTracksData = async (timeRange: string, totalLimit: number): Promise<any> => {
  if (shouldUseDummyData()) {
    return { items: improvedTopTracks.items.slice(0, totalLimit) };
  }

  const token = localStorage.getItem('spotify_access_token');
  if (!token || token === 'demo_access_token') {
    console.warn('No valid access token available for top tracks data');
    return { items: [] };
  }

  try {
    return await spotifyAPI.getExtendedTopTracks(token, timeRange, totalLimit);
  } catch (error) {
    console.warn('Failed to fetch top tracks data:', error);
    return { items: [] };
  }
};

export const fetchTopArtistsData = async (timeRange: string, totalLimit: number): Promise<any> => {
  if (shouldUseDummyData()) {
    return { items: improvedTopArtists.items.slice(0, totalLimit) };
  }

  const token = localStorage.getItem('spotify_access_token');
  if (!token || token === 'demo_access_token') {
    console.warn('No valid access token available for top artists data');
    return { items: [] };
  }

  try {
    return await spotifyAPI.getExtendedTopArtists(token, timeRange, totalLimit);
  } catch (error) {
    console.warn('Failed to fetch top artists data:', error);
    return { items: [] };
  }
};
