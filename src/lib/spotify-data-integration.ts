
import { spotifyAPI } from './spotify-api';
import { spotifyPlaybackSDK } from './spotify-playback-sdk';

interface IntegratedTrackData {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  duration_ms: number;
  popularity: number;
  playedAt?: string;
  playCount: number;
  totalListeningTime: number;
  source: 'api' | 'sdk' | 'combined';
}

interface IntegratedArtistData {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  playCount: number;
  totalListeningTime: number;
  source: 'api' | 'sdk' | 'combined';
}

interface ListeningSession {
  startTime: Date;
  endTime?: Date;
  tracks: IntegratedTrackData[];
  totalTime: number;
  isActive: boolean;
}

class SpotifyDataIntegration {
  private cachedRecentlyPlayed: any[] = [];
  private cachedTopTracks: Map<string, any[]> = new Map();
  private cachedTopArtists: Map<string, any[]> = new Map();
  private currentSession: ListeningSession | null = null;

  /**
   * Get enhanced recently played tracks combining API data with real-time SDK data
   */
  async getEnhancedRecentlyPlayed(limit: number = 200): Promise<IntegratedTrackData[]> {
    const token = localStorage.getItem('spotify_access_token');
    const recentTracks: IntegratedTrackData[] = [];

    try {
      // Fetch from API with pagination
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

      // Convert API data to integrated format
      const apiIntegratedTracks = apiTracks.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists,
        duration_ms: item.track.duration_ms,
        popularity: item.track.popularity,
        playedAt: item.played_at,
        playCount: 1,
        totalListeningTime: item.track.duration_ms,
        source: 'api' as const
      }));

      // Get SDK session data
      const sdkData = spotifyPlaybackSDK.getSessionTracks();
      const sdkIntegratedTracks = sdkData.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists,
        duration_ms: track.duration_ms,
        popularity: track.popularity || 50,
        playedAt: track.playedAt,
        playCount: track.playCount,
        totalListeningTime: track.totalListeningTime,
        source: 'sdk' as const
      }));

      // Combine and deduplicate
      const combinedTracks = this.combineTrackData([...apiIntegratedTracks, ...sdkIntegratedTracks]);
      
      // Cache the result
      this.cachedRecentlyPlayed = combinedTracks;
      
      return combinedTracks.slice(0, limit);
    } catch (error) {
      console.error('Error fetching enhanced recently played:', error);
      // Return cached data or SDK data as fallback
      return this.cachedRecentlyPlayed.length > 0 ? this.cachedRecentlyPlayed : 
             spotifyPlaybackSDK.getSessionTracks().slice(0, limit);
    }
  }

  /**
   * Get enhanced top tracks with extended dataset
   */
  async getEnhancedTopTracks(timeRange: string = 'medium_term', totalLimit: number = 1000): Promise<IntegratedTrackData[]> {
    const cacheKey = `${timeRange}_${totalLimit}`;
    
    if (this.cachedTopTracks.has(cacheKey)) {
      return this.cachedTopTracks.get(cacheKey)!;
    }

    const token = localStorage.getItem('spotify_access_token');
    
    try {
      // Use the extended API method
      const response = await spotifyAPI.getExtendedTopTracks(token, timeRange, totalLimit);
      
      if (response?.items) {
        const integratedTracks = response.items.map((track: any, index: number) => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
          duration_ms: track.duration_ms,
          popularity: track.popularity,
          playCount: Math.max(100 - index, 1), // Estimate based on ranking
          totalListeningTime: (Math.max(100 - index, 1)) * track.duration_ms,
          source: 'api' as const
        }));

        // Enhance with SDK data if available
        const sdkData = spotifyPlaybackSDK.getSessionTracks();
        const enhanced = this.enhanceTracksWithSDKData(integratedTracks, sdkData);
        
        this.cachedTopTracks.set(cacheKey, enhanced);
        return enhanced;
      }
    } catch (error) {
      console.error('Error fetching enhanced top tracks:', error);
    }

    // Fallback to cached or simulated data
    return this.cachedTopTracks.get(cacheKey) || [];
  }

  /**
   * Get enhanced top artists with extended dataset
   */
  async getEnhancedTopArtists(timeRange: string = 'medium_term', totalLimit: number = 1000): Promise<IntegratedArtistData[]> {
    const cacheKey = `${timeRange}_${totalLimit}`;
    
    if (this.cachedTopArtists.has(cacheKey)) {
      return this.cachedTopArtists.get(cacheKey)!;
    }

    const token = localStorage.getItem('spotify_access_token');
    
    try {
      const response = await spotifyAPI.getExtendedTopArtists(token, timeRange, totalLimit);
      
      if (response?.items) {
        const integratedArtists = response.items.map((artist: any, index: number) => ({
          id: artist.id,
          name: artist.name,
          genres: artist.genres,
          popularity: artist.popularity,
          playCount: Math.max(50 - Math.floor(index / 2), 1),
          totalListeningTime: (Math.max(50 - Math.floor(index / 2), 1)) * 180000, // Avg 3min per play
          source: 'api' as const
        }));

        this.cachedTopArtists.set(cacheKey, integratedArtists);
        return integratedArtists;
      }
    } catch (error) {
      console.error('Error fetching enhanced top artists:', error);
    }

    return this.cachedTopArtists.get(cacheKey) || [];
  }

  /**
   * Calculate real listening statistics
   */
  calculateListeningStats(tracks: IntegratedTrackData[], timeRangeLabel: string) {
    const totalPlayCount = tracks.reduce((sum, track) => sum + track.playCount, 0);
    const totalMinutes = Math.floor(tracks.reduce((sum, track) => sum + track.totalListeningTime, 0) / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const uniqueArtists = new Set(tracks.flatMap(track => track.artists.map(a => a.id))).size;
    
    // Calculate days for average
    const days = timeRangeLabel.includes('Week') ? 7 :
                 timeRangeLabel.includes('Month') ? 30 :
                 timeRangeLabel.includes('6 Months') ? 180 :
                 365;
    
    const avgDailyMinutes = Math.floor(totalMinutes / days);

    return {
      totalPlayCount,
      totalMinutes,
      totalHours,
      uniqueArtists,
      avgDailyMinutes,
      topTrack: tracks[0],
      timeRangeLabel,
      dataQuality: this.assessDataQuality(tracks)
    };
  }

  /**
   * Start tracking a new listening session
   */
  startListeningSession(): void {
    this.currentSession = {
      startTime: new Date(),
      tracks: [],
      totalTime: 0,
      isActive: true
    };
    
    spotifyPlaybackSDK.startSession();
  }

  /**
   * End current listening session
   */
  endListeningSession(): ListeningSession | null {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      this.currentSession.isActive = false;
      this.currentSession.totalTime = this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime();
      
      const session = this.currentSession;
      this.currentSession = null;
      
      return session;
    }
    return null;
  }

  /**
   * Get current listening session
   */
  getCurrentSession(): ListeningSession | null {
    return this.currentSession;
  }

  private combineTrackData(tracks: IntegratedTrackData[]): IntegratedTrackData[] {
    const trackMap = new Map<string, IntegratedTrackData>();

    tracks.forEach(track => {
      const existing = trackMap.get(track.id);
      if (existing) {
        // Combine data from multiple sources
        existing.playCount += track.playCount;
        existing.totalListeningTime += track.totalListeningTime;
        existing.source = 'combined';
        if (track.playedAt && (!existing.playedAt || track.playedAt > existing.playedAt)) {
          existing.playedAt = track.playedAt;
        }
      } else {
        trackMap.set(track.id, { ...track });
      }
    });

    return Array.from(trackMap.values()).sort((a, b) => {
      if (a.playedAt && b.playedAt) {
        return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
      }
      return b.playCount - a.playCount;
    });
  }

  private enhanceTracksWithSDKData(apiTracks: IntegratedTrackData[], sdkTracks: any[]): IntegratedTrackData[] {
    const sdkTrackMap = new Map(sdkTracks.map(track => [track.id, track]));

    return apiTracks.map(track => {
      const sdkData = sdkTrackMap.get(track.id);
      if (sdkData) {
        return {
          ...track,
          playCount: track.playCount + sdkData.playCount,
          totalListeningTime: track.totalListeningTime + sdkData.totalListeningTime,
          source: 'combined' as const
        };
      }
      return track;
    });
  }

  private assessDataQuality(tracks: IntegratedTrackData[]): 'high' | 'medium' | 'low' {
    const combinedSources = tracks.filter(t => t.source === 'combined').length;
    const apiSources = tracks.filter(t => t.source === 'api').length;
    
    if (combinedSources > tracks.length * 0.3) return 'high';
    if (apiSources > tracks.length * 0.5) return 'medium';
    return 'low';
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cachedRecentlyPlayed = [];
    this.cachedTopTracks.clear();
    this.cachedTopArtists.clear();
    this.currentSession = null;
  }
}

export const spotifyDataIntegration = new SpotifyDataIntegration();
export type { IntegratedTrackData, IntegratedArtistData, ListeningSession };
