import { SpotifyDataCache } from './spotify-data-cache';
import { spotifyPlaybackSDK } from './spotify-playback-sdk';
import { 
  fetchRecentlyPlayedData, 
  fetchTopTracksData, 
  fetchTopArtistsData 
} from './data/spotify-data-fetcher';
import { 
  processRecentlyPlayedData,
  processTopTracksData,
  processTopArtistsData,
  combineTrackData,
  enhanceTracksWithSDKData,
  calculateListeningStats
} from './data/spotify-data-processor';
import type { IntegratedTrackData, IntegratedArtistData, ListeningSession } from './spotify-data-types';

class SpotifyDataIntegration {
  private cache = new SpotifyDataCache();
  private currentSession: ListeningSession | null = null;

  async getEnhancedRecentlyPlayed(limit: number = 200): Promise<IntegratedTrackData[]> {
    try {
      const apiTracks = await fetchRecentlyPlayedData(limit);
      const apiIntegratedTracks = processRecentlyPlayedData(apiTracks);

      console.log('API tracks processed:', apiIntegratedTracks.length);

      const sdkData = spotifyPlaybackSDK.getSessionTracks();
      const sdkIntegratedTracks = sdkData
        .map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists || [],
          duration_ms: Math.max(0, track.duration_ms),
          popularity: Math.max(0, track.popularity || 50),
          playedAt: track.playedAt,
          playCount: Math.max(0, track.playCount),
          totalListeningTime: Math.max(0, track.totalListeningTime),
          source: 'sdk' as const
        }));

      console.log('SDK tracks processed:', sdkIntegratedTracks.length);

      const combinedTracks = combineTrackData([...apiIntegratedTracks, ...sdkIntegratedTracks]);
      this.cache.setCachedRecentlyPlayed(combinedTracks);
      
      return combinedTracks.slice(0, limit);
    } catch (error) {
      console.error('Error fetching enhanced recently played:', error);
      
      const cached = this.cache.getCachedRecentlyPlayed();
      if (cached.length > 0) {
        console.log('Returning cached recently played data');
        return cached;
      }
      
      throw new Error('Unable to load your listening data. Please check your internet connection and try again.');
    }
  }

  async getEnhancedTopTracks(timeRange: string = 'medium_term', totalLimit: number = 2000): Promise<IntegratedTrackData[]> {
    const cacheKey = `${timeRange}_${totalLimit}`;
    const cached = this.cache.getCachedTopTracks(cacheKey);
    if (cached) {
      console.log('Returning cached top tracks data');
      return cached;
    }

    try {
      const response = await fetchTopTracksData(timeRange, totalLimit);
      
      if (!response?.items) {
        console.warn('No top tracks found in response. Returning empty array.');
        return [];
      }

      const integratedTracks = processTopTracksData(response.items);
      if (!integratedTracks.length) {
        console.warn('No tracks after processing. Returning empty array.');
        return [];
      }

      const sdkData = spotifyPlaybackSDK.getSessionTracks();
      const enhanced = enhanceTracksWithSDKData(integratedTracks, sdkData);
      
      this.cache.setCachedTopTracks(cacheKey, enhanced);
      return enhanced;
    } catch (error) {
      console.error('Error fetching enhanced top tracks:', error);
      
      const cached = this.cache.getCachedTopTracks(cacheKey);
      if (cached && cached.length > 0) {
        console.log('Returning cached top tracks data');
        return cached;
      }
      
      console.warn('No cached data available. Returning empty array.');
      return [];
    }
  }

  async getEnhancedTopArtists(timeRange: string = 'medium_term', totalLimit: number = 2000): Promise<IntegratedArtistData[]> {
    const cacheKey = `${timeRange}_${totalLimit}`;
    const cached = this.cache.getCachedTopArtists(cacheKey);
    if (cached) {
      console.log('Returning cached top artists data');
      return cached;
    }

    try {
      const response = await fetchTopArtistsData(timeRange, totalLimit);
      
      if (!response?.items) {
        console.warn('No top artists found in response. Returning empty array.');
        return [];
      }

      const integratedArtists = processTopArtistsData(response.items);
      if (!integratedArtists.length) {
        console.warn('No artists after processing. Returning empty array.');
        return [];
      }

      this.cache.setCachedTopArtists(cacheKey, integratedArtists);
      return integratedArtists;
    } catch (error) {
      console.error('Error fetching enhanced top artists:', error);
      
      const cached = this.cache.getCachedTopArtists(cacheKey);
      if (cached && cached.length > 0) {
        console.log('Returning cached top artists data');
        return cached;
      }
      
      console.warn('No cached data available. Returning empty array.');
      return [];
    }
  }

  calculateListeningStats(tracks: IntegratedTrackData[], timeRangeLabel: string) {
    return calculateListeningStats(tracks, timeRangeLabel);
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

  clearCache(): void {
    this.cache.clearCache();
    this.currentSession = null;
  }
}

export const spotifyDataIntegration = new SpotifyDataIntegration();
export type { IntegratedTrackData, IntegratedArtistData, ListeningSession };
