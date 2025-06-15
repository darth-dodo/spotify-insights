import { spotifyAPI } from './spotify-api';
import { spotifyPlaybackSDK } from './spotify-playback-sdk';
import { SpotifyDataCache } from './spotify-data-cache';
import type { IntegratedTrackData, IntegratedArtistData, ListeningSession } from './spotify-data-types';

class SpotifyDataIntegration {
  private cache = new SpotifyDataCache();
  private currentSession: ListeningSession | null = null;

  // Helper to ensure non-negative numbers
  private ensurePositive(value: number): number {
    const result = Math.max(0, value || 0);
    if (value < 0) {
      console.warn('Negative value detected and corrected:', value, '→', result);
    }
    return result;
  }

  // Helper to validate track data
  private validateTrackData(track: any): boolean {
    if (!track || !track.id || !track.name) {
      console.warn('Invalid track data:', track);
      return false;
    }
    return true;
  }

  async getEnhancedRecentlyPlayed(limit: number = 200): Promise<IntegratedTrackData[]> {
    const token = localStorage.getItem('spotify_access_token');

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

      // Convert API data to integrated format with validation
      const apiIntegratedTracks = apiTracks
        .filter(item => this.validateTrackData(item?.track))
        .map(item => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists || [],
          duration_ms: this.ensurePositive(item.track.duration_ms),
          popularity: this.ensurePositive(item.track.popularity),
          playedAt: item.played_at,
          playCount: 1,
          totalListeningTime: this.ensurePositive(item.track.duration_ms),
          source: 'api' as const
        }));

      console.log('API tracks processed:', apiIntegratedTracks.length);

      // Get SDK session data
      const sdkData = spotifyPlaybackSDK.getSessionTracks();
      const sdkIntegratedTracks = sdkData
        .filter(track => this.validateTrackData(track))
        .map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists || [],
          duration_ms: this.ensurePositive(track.duration_ms),
          popularity: this.ensurePositive(track.popularity || 50),
          playedAt: track.playedAt,
          playCount: this.ensurePositive(track.playCount),
          totalListeningTime: this.ensurePositive(track.totalListeningTime),
          source: 'sdk' as const
        }));

      console.log('SDK tracks processed:', sdkIntegratedTracks.length);

      // Combine and deduplicate
      const combinedTracks = this.combineTrackData([...apiIntegratedTracks, ...sdkIntegratedTracks]);
      
      // Cache the result
      this.cache.setCachedRecentlyPlayed(combinedTracks);
      
      return combinedTracks.slice(0, limit);
    } catch (error) {
      console.error('Error fetching enhanced recently played:', error);
      return this.cache.getCachedRecentlyPlayed().length > 0 ? 
             this.cache.getCachedRecentlyPlayed() : 
             spotifyPlaybackSDK.getSessionTracks().slice(0, limit);
    }
  }

  async getEnhancedTopTracks(timeRange: string = 'medium_term', totalLimit: number = 1000): Promise<IntegratedTrackData[]> {
    const cacheKey = `${timeRange}_${totalLimit}`;
    
    const cached = this.cache.getCachedTopTracks(cacheKey);
    if (cached) {
      return cached;
    }

    const token = localStorage.getItem('spotify_access_token');
    
    try {
      const response = await spotifyAPI.getExtendedTopTracks(token, timeRange, totalLimit);
      
      if (response?.items) {
        const integratedTracks = response.items
          .filter(track => this.validateTrackData(track))
          .map((track: any, index: number) => ({
            id: track.id,
            name: track.name,
            artists: track.artists || [],
            duration_ms: this.ensurePositive(track.duration_ms),
            popularity: this.ensurePositive(track.popularity),
            playCount: this.ensurePositive(Math.max(100 - index, 1)),
            totalListeningTime: this.ensurePositive((Math.max(100 - index, 1)) * track.duration_ms),
            source: 'api' as const
          }));

        const sdkData = spotifyPlaybackSDK.getSessionTracks();
        const enhanced = this.enhanceTracksWithSDKData(integratedTracks, sdkData);
        
        this.cache.setCachedTopTracks(cacheKey, enhanced);
        return enhanced;
      }
    } catch (error) {
      console.error('Error fetching enhanced top tracks:', error);
    }

    return this.cache.getCachedTopTracks(cacheKey) || [];
  }

  async getEnhancedTopArtists(timeRange: string = 'medium_term', totalLimit: number = 1000): Promise<IntegratedArtistData[]> {
    const cacheKey = `${timeRange}_${totalLimit}`;
    
    const cached = this.cache.getCachedTopArtists(cacheKey);
    if (cached) {
      return cached;
    }

    const token = localStorage.getItem('spotify_access_token');
    
    try {
      const response = await spotifyAPI.getExtendedTopArtists(token, timeRange, totalLimit);
      
      if (response?.items) {
        const integratedArtists = response.items.map((artist: any, index: number) => ({
          id: artist.id,
          name: artist.name,
          genres: artist.genres || [],
          popularity: this.ensurePositive(artist.popularity),
          playCount: this.ensurePositive(Math.max(50 - Math.floor(index / 2), 1)),
          totalListeningTime: this.ensurePositive((Math.max(50 - Math.floor(index / 2), 1)) * 180000),
          source: 'api' as const
        }));

        this.cache.setCachedTopArtists(cacheKey, integratedArtists);
        return integratedArtists;
      }
    } catch (error) {
      console.error('Error fetching enhanced top artists:', error);
    }

    return this.cache.getCachedTopArtists(cacheKey) || [];
  }

  calculateListeningStats(tracks: IntegratedTrackData[], timeRangeLabel: string) {
    const totalPlayCount = this.ensurePositive(tracks.reduce((sum, track) => sum + this.ensurePositive(track.playCount), 0));
    const totalMinutes = this.ensurePositive(Math.floor(tracks.reduce((sum, track) => sum + this.ensurePositive(track.totalListeningTime), 0) / 60000));
    const totalHours = this.ensurePositive(Math.floor(totalMinutes / 60));
    const uniqueArtists = new Set(tracks.flatMap(track => track.artists?.map(a => a.id) || [])).size;
    
    const days = timeRangeLabel.includes('Week') ? 7 :
                 timeRangeLabel.includes('Month') ? 30 :
                 timeRangeLabel.includes('6 Months') ? 180 :
                 365;
    
    const avgDailyMinutes = this.ensurePositive(Math.floor(totalMinutes / days));

    console.log('Calculated stats:', { totalPlayCount, totalMinutes, totalHours, uniqueArtists, avgDailyMinutes });

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

  startListeningSession(): void {
    this.currentSession = {
      startTime: new Date(),
      tracks: [],
      totalTime: 0,
      isActive: true
    };
    
    spotifyPlaybackSDK.startSession();
  }

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

  getCurrentSession(): ListeningSession | null {
    return this.currentSession;
  }

  private combineTrackData(tracks: IntegratedTrackData[]): IntegratedTrackData[] {
    const trackMap = new Map<string, IntegratedTrackData>();

    tracks.forEach(track => {
      const existing = trackMap.get(track.id);
      if (existing) {
        existing.playCount = this.ensurePositive(existing.playCount + track.playCount);
        existing.totalListeningTime = this.ensurePositive(existing.totalListeningTime + track.totalListeningTime);
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
      return this.ensurePositive(b.playCount) - this.ensurePositive(a.playCount);
    });
  }

  private enhanceTracksWithSDKData(apiTracks: IntegratedTrackData[], sdkTracks: any[]): IntegratedTrackData[] {
    const sdkTrackMap = new Map(sdkTracks.map(track => [track.id, track]));

    return apiTracks.map(track => {
      const sdkData = sdkTrackMap.get(track.id);
      if (sdkData) {
        return {
          ...track,
          playCount: this.ensurePositive(track.playCount + this.ensurePositive(sdkData.playCount)),
          totalListeningTime: this.ensurePositive(track.totalListeningTime + this.ensurePositive(sdkData.totalListeningTime)),
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

  clearCache(): void {
    this.cache.clearCache();
    this.currentSession = null;
  }
}

export const spotifyDataIntegration = new SpotifyDataIntegration();
export type { IntegratedTrackData, IntegratedArtistData, ListeningSession };
