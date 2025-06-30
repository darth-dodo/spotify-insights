
import { improvedTopTracks, improvedTopArtists, improvedRecentlyPlayed } from '@/lib/improved-sandbox-data';
import type { DataStrategy } from './AuthStrategy';

export class SandboxDataStrategy implements DataStrategy {
  async getTopTracks(limit: number = 50): Promise<any[]> {
    console.log('Using sandbox data for top tracks');
    return improvedTopTracks.items.slice(0, limit);
  }

  async getTopArtists(limit: number = 50): Promise<any[]> {
    console.log('Using sandbox data for top artists');
    return improvedTopArtists.items.slice(0, limit);
  }

  async getRecentlyPlayed(limit: number = 50): Promise<any[]> {
    console.log('Using sandbox data for recently played');
    return improvedRecentlyPlayed.items.slice(0, limit);
  }

  getStats() {
    const tracks = improvedTopTracks.items;
    const artists = improvedTopArtists.items;
    const recent = improvedRecentlyPlayed.items;

    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const uniqueGenres = [...new Set(allGenres)];
    const avgPopularity = tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length;

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      listeningTime: 450, // Mock listening time in minutes
      topGenre: uniqueGenres[0] || 'Rock',
      uniqueGenres: uniqueGenres.length,
      avgPopularity: Math.round(avgPopularity),
      recentTracksCount: recent.length,
      hasSpotifyData: true
    };
  }

  getGenreAnalysis() {
    const artists = improvedTopArtists.items;
    const genreCounts: Record<string, { count: number; tracks: number; artists: Set<string>; hours: number; color: string }> = {};
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    let colorIndex = 0;

    artists.forEach((artist: any, index: number) => {
      artist.genres?.forEach((genre: string) => {
        const genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
        if (!genreCounts[genreName]) {
          genreCounts[genreName] = { 
            count: 0, 
            tracks: 0, 
            artists: new Set(), 
            hours: 0,
            color: colors[colorIndex % colors.length]
          };
          colorIndex++;
        }
        genreCounts[genreName].count++;
        genreCounts[genreName].artists.add(artist.id);
        const trackCount = Math.floor((50 - (index / 20)) * Math.random()) + 5;
        genreCounts[genreName].tracks += trackCount;
        genreCounts[genreName].hours += Math.floor(trackCount * 3.5);
      });
    });
    
    const totalArtists = artists.length;
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 8)
      .map(([name, genreData]) => ({
        name,
        value: Math.round((genreData.count / totalArtists) * 100),
        color: genreData.color,
        tracks: genreData.tracks,
        artists: genreData.artists.size,
        hours: Math.round(genreData.hours / 60)
      }));
  }

  clearCache(): void {
    // No-op for sandbox mode
    console.log('Sandbox data strategy cache cleared');
  }
}
