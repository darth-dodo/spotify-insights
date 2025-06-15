
import type { IntegratedTrackData, IntegratedArtistData } from './spotify-data-types';

export class SpotifyDataCache {
  private cachedRecentlyPlayed: any[] = [];
  private cachedTopTracks: Map<string, any[]> = new Map();
  private cachedTopArtists: Map<string, any[]> = new Map();

  getCachedRecentlyPlayed() {
    return this.cachedRecentlyPlayed;
  }

  setCachedRecentlyPlayed(data: any[]) {
    this.cachedRecentlyPlayed = data;
  }

  getCachedTopTracks(cacheKey: string) {
    return this.cachedTopTracks.get(cacheKey);
  }

  setCachedTopTracks(cacheKey: string, data: any[]) {
    this.cachedTopTracks.set(cacheKey, data);
  }

  getCachedTopArtists(cacheKey: string) {
    return this.cachedTopArtists.get(cacheKey);
  }

  setCachedTopArtists(cacheKey: string, data: any[]) {
    this.cachedTopArtists.set(cacheKey, data);
  }

  clearCache(): void {
    this.cachedRecentlyPlayed = [];
    this.cachedTopTracks.clear();
    this.cachedTopArtists.clear();
  }
}
