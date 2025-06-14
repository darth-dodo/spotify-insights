
import { 
  dummySpotifyUser, 
  dummyTopTracks, 
  dummyTopArtists, 
  dummyRecentlyPlayed, 
  dummyCurrentPlayback 
} from './dummy-data';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
const BASE_URL = 'https://api.spotify.com/v1';

export class SpotifyAPI {
  private async makeRequest(endpoint: string, accessToken?: string) {
    if (USE_DUMMY_DATA) {
      // Return dummy data based on endpoint
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      switch (endpoint) {
        case '/me':
          return dummySpotifyUser;
        case '/me/top/tracks':
          return dummyTopTracks;
        case '/me/top/artists':
          return dummyTopArtists;
        case '/me/player/recently-played':
          return dummyRecentlyPlayed;
        case '/me/player':
          return dummyCurrentPlayback;
        default:
          throw new Error(`Dummy data not available for endpoint: ${endpoint}`);
      }
    }

    // Real API call
    if (!accessToken) {
      throw new Error('Access token required for real API calls');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(accessToken?: string) {
    return this.makeRequest('/me', accessToken);
  }

  async getTopTracks(accessToken?: string, timeRange = 'medium_term', limit = 50) {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString()
    });
    return this.makeRequest(`/me/top/tracks?${params}`, accessToken);
  }

  async getTopArtists(accessToken?: string, timeRange = 'medium_term', limit = 50) {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString()
    });
    return this.makeRequest(`/me/top/artists?${params}`, accessToken);
  }

  async getRecentlyPlayed(accessToken?: string, limit = 50) {
    const params = new URLSearchParams({
      limit: limit.toString()
    });
    return this.makeRequest(`/me/player/recently-played?${params}`, accessToken);
  }

  async getCurrentPlayback(accessToken?: string) {
    return this.makeRequest('/me/player', accessToken);
  }
}

export const spotifyAPI = new SpotifyAPI();
