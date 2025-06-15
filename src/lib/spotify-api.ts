import { 
  dummySpotifyUser, 
  dummyCurrentPlayback 
} from './dummy-data';
import { 
  extensiveTopTracks, 
  extensiveTopArtists, 
  extensiveRecentlyPlayed 
} from './extensive-dummy-data';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true' || window.location.pathname === '/sandbox';
const BASE_URL = 'https://api.spotify.com/v1';

export class SpotifyAPI {
  private async makeRequest(endpoint: string, accessToken?: string) {
    if (USE_DUMMY_DATA || window.location.pathname === '/sandbox') {
      // Return extensive dummy data based on endpoint
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      switch (endpoint) {
        case '/me':
          return dummySpotifyUser;
        case '/me/top/tracks':
          return extensiveTopTracks;
        case '/me/top/artists':
          return extensiveTopArtists;
        case '/me/player/recently-played':
          return extensiveRecentlyPlayed;
        case '/me/player':
          return dummyCurrentPlayback;
        default:
          if (endpoint.startsWith('/me/top/tracks')) {
            return extensiveTopTracks;
          }
          if (endpoint.startsWith('/me/top/artists')) {
            return extensiveTopArtists;
          }
          if (endpoint.startsWith('/me/player/recently-played')) {
            return extensiveRecentlyPlayed;
          }
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

  // New method to fetch paginated top tracks (up to 1000)
  async getExtendedTopTracks(accessToken?: string, timeRange = 'medium_term', totalLimit = 1000) {
    if (USE_DUMMY_DATA || window.location.pathname === '/sandbox') {
      // For dummy data, generate extended dataset up to 1000 items
      await new Promise(resolve => setTimeout(resolve, 800));
      const baseItems = extensiveTopTracks.items;
      const extendedItems = [];
      
      // Generate up to totalLimit items by repeating and modifying the base set
      for (let i = 0; i < Math.min(totalLimit, 1000); i++) {
        const baseIndex = i % baseItems.length;
        const baseItem = baseItems[baseIndex];
        extendedItems.push({
          ...baseItem,
          id: `${baseItem.id}_${i}`,
          name: i < baseItems.length ? baseItem.name : `${baseItem.name} (Extended ${i})`,
          popularity: Math.max(1, baseItem.popularity - Math.floor(i / 20)) // Gradually decrease popularity
        });
      }
      
      return {
        items: extendedItems,
        total: extendedItems.length,
        limit: 50,
        offset: 0,
        next: null,
        previous: null
      };
    }

    // Real API calls with pagination
    const allItems = [];
    const maxLimit = 50; // Spotify API limit per request
    let offset = 0;
    
    while (allItems.length < totalLimit && offset < 1000) { // Spotify limits to 1000 total
      const currentLimit = Math.min(maxLimit, totalLimit - allItems.length);
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: currentLimit.toString(),
        offset: offset.toString()
      });
      
      try {
        const response = await this.makeRequest(`/me/top/tracks?${params}`, accessToken);
        
        if (!response.items || response.items.length === 0) {
          break; // No more items available
        }
        
        allItems.push(...response.items);
        offset += currentLimit;
        
        // Add delay between requests to respect rate limits
        if (offset < totalLimit) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error fetching tracks at offset ${offset}:`, error);
        break;
      }
    }
    
    return {
      items: allItems,
      total: allItems.length,
      limit: maxLimit,
      offset: 0,
      next: null,
      previous: null
    };
  }

  // New method to fetch paginated top artists (up to 1000)
  async getExtendedTopArtists(accessToken?: string, timeRange = 'medium_term', totalLimit = 1000) {
    if (USE_DUMMY_DATA || window.location.pathname === '/sandbox') {
      // For dummy data, generate extended dataset up to 1000 items
      await new Promise(resolve => setTimeout(resolve, 800));
      const baseItems = extensiveTopArtists.items;
      const extendedItems = [];
      
      // Generate up to totalLimit items by repeating and modifying the base set
      for (let i = 0; i < Math.min(totalLimit, 1000); i++) {
        const baseIndex = i % baseItems.length;
        const baseItem = baseItems[baseIndex];
        extendedItems.push({
          ...baseItem,
          id: `${baseItem.id}_${i}`,
          name: i < baseItems.length ? baseItem.name : `${baseItem.name} (Extended ${i})`,
          popularity: Math.max(1, baseItem.popularity - Math.floor(i / 20)),
          followers: {
            total: Math.max(1000, baseItem.followers.total - (i * 2000))
          }
        });
      }
      
      return {
        items: extendedItems,
        total: extendedItems.length,
        limit: 50,
        offset: 0,
        next: null,
        previous: null
      };
    }

    // Real API calls with pagination
    const allItems = [];
    const maxLimit = 50; // Spotify API limit per request
    let offset = 0;
    
    while (allItems.length < totalLimit && offset < 1000) { // Spotify limits to 1000 total
      const currentLimit = Math.min(maxLimit, totalLimit - allItems.length);
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: currentLimit.toString(),
        offset: offset.toString()
      });
      
      try {
        const response = await this.makeRequest(`/me/top/artists?${params}`, accessToken);
        
        if (!response.items || response.items.length === 0) {
          break; // No more items available
        }
        
        allItems.push(...response.items);
        offset += currentLimit;
        
        // Add delay between requests to respect rate limits
        if (offset < totalLimit) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error fetching artists at offset ${offset}:`, error);
        break;
      }
    }
    
    return {
      items: allItems,
      total: allItems.length,
      limit: maxLimit,
      offset: 0,
      next: null,
      previous: null
    };
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
