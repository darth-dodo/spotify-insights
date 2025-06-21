const BASE_URL = 'https://api.spotify.com/v1';

export class SpotifyAPI {
  private async makeRequest(endpoint: string, accessToken?: string) {
    // Check if we're in demo mode (root path without real auth or sandbox)
    const isDemoMode = window.location.pathname === '/sandbox' || 
      (window.location.pathname === '/' && (!accessToken || accessToken === 'demo_access_token'));

    if (isDemoMode) {
      console.log('Demo mode detected, skipping real API call for:', endpoint);
      // Return empty data structure to prevent errors
      return { items: [], total: 0 };
    }

    if (!accessToken || accessToken === 'demo_access_token') {
      throw new Error('Access token required. Please authenticate with Spotify.');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(`Rate limited. Retry after ${retryAfter || 60} seconds.`);
      }
      
      if (response.status === 401) {
        throw new Error('Unauthorized. Please re-authenticate with Spotify.');
      }
      
      if (response.status === 403) {
        // Handle playback-related 403 errors gracefully
        if (endpoint.includes('/me/player')) {
          console.warn('Playback API access denied - this requires Spotify Premium or special app permissions');
          return null; // Return null instead of throwing for playback endpoints
        }
        throw new Error('Access denied. Your Spotify app may need additional permissions.');
      }
      
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

  async getExtendedTopTracks(accessToken?: string, timeRange = 'medium_term', totalLimit = 2000) {
    // Check for demo mode early
    const isDemoMode = window.location.pathname === '/sandbox' || 
      (window.location.pathname === '/' && (!accessToken || accessToken === 'demo_access_token'));

    if (isDemoMode) {
      console.log('Demo mode detected, returning empty data for extended top tracks');
      return { items: [], total: 0, limit: 50, offset: 0, next: null, previous: null };
    }

    const allItems = [];
    const maxLimit = 50;
    let offset = 0;
    
    while (allItems.length < totalLimit && offset < 2000) {
      const currentLimit = Math.min(maxLimit, totalLimit - allItems.length);
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: currentLimit.toString(),
        offset: offset.toString()
      });
      
      try {
        const response = await this.makeRequest(`/me/top/tracks?${params}`, accessToken);
        
        if (!response.items || response.items.length === 0) {
          break;
        }
        
        allItems.push(...response.items);
        offset += currentLimit;
        
        // Respect rate limits with delays
        if (offset < totalLimit) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error fetching tracks at offset ${offset}:`, error);
        throw error; // Re-throw to trigger error boundary
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

  async getExtendedTopArtists(accessToken?: string, timeRange = 'medium_term', totalLimit = 2000) {
    // Check for demo mode early
    const isDemoMode = window.location.pathname === '/sandbox' || 
      (window.location.pathname === '/' && (!accessToken || accessToken === 'demo_access_token'));

    if (isDemoMode) {
      console.log('Demo mode detected, returning empty data for extended top artists');
      return { items: [], total: 0, limit: 50, offset: 0, next: null, previous: null };
    }

    const allItems = [];
    const maxLimit = 50;
    let offset = 0;
    
    while (allItems.length < totalLimit && offset < 2000) {
      const currentLimit = Math.min(maxLimit, totalLimit - allItems.length);
      const params = new URLSearchParams({
        time_range: timeRange,
        limit: currentLimit.toString(),
        offset: offset.toString()
      });
      
      try {
        const response = await this.makeRequest(`/me/top/artists?${params}`, accessToken);
        
        if (!response.items || response.items.length === 0) {
          break;
        }
        
        allItems.push(...response.items);
        offset += currentLimit;
        
        // Respect rate limits with delays
        if (offset < totalLimit) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Error fetching artists at offset ${offset}:`, error);
        throw error; // Re-throw to trigger error boundary
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
