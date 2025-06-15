
import { spotifyDataIntegration } from '@/lib/spotify-data-integration';
import type { DataStrategy } from './AuthStrategy';

export class SpotifyDataStrategy implements DataStrategy {
  async getTopTracks(limit: number = 50, timeRange: string = 'medium_term'): Promise<any[]> {
    const tracks = await spotifyDataIntegration.getEnhancedTopTracks(timeRange, limit);
    return tracks;
  }

  async getTopArtists(limit: number = 50, timeRange: string = 'medium_term'): Promise<any[]> {
    const artists = await spotifyDataIntegration.getEnhancedTopArtists(timeRange, limit);
    return artists;
  }

  async getRecentlyPlayed(limit: number = 50): Promise<any[]> {
    const tracks = await spotifyDataIntegration.getEnhancedRecentlyPlayed(limit);
    return tracks;
  }

  getStats() {
    // This would typically be calculated from real API data
    return {
      totalTracks: 0,
      totalArtists: 0,
      listeningTime: 0,
      topGenre: 'Unknown',
      uniqueGenres: 0,
      avgPopularity: 0,
      recentTracksCount: 0,
      hasSpotifyData: false
    };
  }

  getGenreAnalysis() {
    // Return empty array - would be populated from real data
    return [];
  }

  clearCache(): void {
    spotifyDataIntegration.clearCache();
  }
}
