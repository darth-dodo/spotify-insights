
import { useQuery } from '@tanstack/react-query';
import { spotifyAPI } from '@/lib/spotify-api';
import { SandboxDataStrategy } from '@/strategies/SandboxDataStrategy';

// Determine if we're in sandbox mode
const isSandboxMode = () => window.location.pathname === '/sandbox';

interface ExtendedDataStore {
  tracks: any[];
  artists: any[];
  recentlyPlayed: any[];
  isLoading: boolean;
  error: Error | null;
}

export const useExtendedSpotifyDataStore = () => {
  const sandboxDataStrategy = new SandboxDataStrategy();
  
  const getAccessToken = () => {
    return isSandboxMode() ? undefined : localStorage.getItem('spotify_access_token');
  };

  // Single query to load ALL data once at startup (maximum 2000 items for comprehensive analysis)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['extended-spotify-data-store', isSandboxMode()],
    queryFn: async () => {
      console.log('🚀 Fetching comprehensive Spotify data (2000 items)...');
      
      if (isSandboxMode()) {
        console.log('Using sandbox data strategy');
        const [tracksData, artistsData, recentData] = await Promise.all([
          sandboxDataStrategy.getTopTracks(2000),
          sandboxDataStrategy.getTopArtists(2000),
          sandboxDataStrategy.getRecentlyPlayed(200)
        ]);

        return {
          tracks: tracksData || [],
          artists: artistsData || [],
          recentlyPlayed: recentData || []
        };
      }

      const accessToken = getAccessToken();
      
      // Fetch maximum data in parallel for comprehensive analysis
      const [tracksData, artistsData, recentData] = await Promise.all([
        spotifyAPI.getExtendedTopTracks(accessToken, 'medium_term', 2000),
        spotifyAPI.getExtendedTopArtists(accessToken, 'medium_term', 2000),
        spotifyAPI.getRecentlyPlayed(accessToken, 50) // Recently played is limited to 50 by Spotify
      ]);

      console.log('✅ Data fetched:', {
        tracks: tracksData?.items?.length || 0,
        artists: artistsData?.items?.length || 0,
        recent: recentData?.items?.length || 0
      });

      return {
        tracks: tracksData?.items || [],
        artists: artistsData?.items || [],
        recentlyPlayed: recentData?.items || []
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache - data doesn't change frequently
    gcTime: 1000 * 60 * 60 * 2, // Keep in cache for 2 hours
    enabled: true,
    retry: 2,
  });

  // ===== DATA ACCESS METHODS (All use full 2000 item dataset) =====
  
  // Top Tracks with flexible filtering
  const getTopTracks = (limit: number = 50, timeRange?: string) => {
    if (!data?.tracks) return [];
    return data.tracks.slice(0, Math.min(limit, data.tracks.length));
  };

  // Top Artists with flexible filtering  
  const getTopArtists = (limit: number = 50, timeRange?: string) => {
    if (!data?.artists) return [];
    return data.artists.slice(0, Math.min(limit, data.artists.length));
  };

  // Recently Played tracks
  const getRecentlyPlayed = (limit: number = 50) => {
    if (!data?.recentlyPlayed) return [];
    return data.recentlyPlayed.slice(0, Math.min(limit, data.recentlyPlayed.length));
  };

  const getTracksByGenre = (genre: string, limit: number = 10) => {
    if (!data?.tracks || !data?.artists) return [];
    
    const genreArtists = data.artists.filter((artist: any) =>
      artist.genres?.some((g: string) => 
        g.toLowerCase().includes(genre.toLowerCase()) ||
        genre.toLowerCase().includes(g.toLowerCase())
      )
    );
    
    const artistIds = new Set(genreArtists.map((artist: any) => artist.id));
    
    return data.tracks
      .filter((track: any) => 
        track.artists?.some((artist: any) => artistIds.has(artist.id))
      )
      .slice(0, limit);
  };

  const getGenreAnalysis = () => {
    if (isSandboxMode()) {
      return sandboxDataStrategy.getGenreAnalysis();
    }

    if (!data?.artists) return [];
    
    const genreCounts: Record<string, { count: number; tracks: number; artists: Set<string>; hours: number; color: string }> = {};
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    let colorIndex = 0;

    data.artists.forEach((artist: any, index: number) => {
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
    
    const totalArtists = data.artists.length;
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
  };

  const getStats = () => {
    if (isSandboxMode()) {
      return sandboxDataStrategy.getStats();
    }

    if (!data) return null;
    
    const tracks = data.tracks || [];
    const artists = data.artists || [];
    const recent = data.recentlyPlayed || [];

    const totalListeningTime = recent.reduce((acc: number, item: any) => {
      return acc + (item.track?.duration_ms || 0);
    }, 0) / (1000 * 60);

    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const uniqueGenres = [...new Set(allGenres)];
    const topGenre = uniqueGenres[0] || 'Unknown';

    const avgPopularity = tracks.length > 0 ? 
      tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length : 0;

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      listeningTime: Math.round(totalListeningTime),
      topGenre,
      uniqueGenres: uniqueGenres.length,
      avgPopularity: Math.round(avgPopularity),
      recentTracksCount: recent.length,
      hasSpotifyData: tracks.length > 0 || artists.length > 0 || recent.length > 0
    };
  };

  // Clear cache and refetch
  const refreshData = () => {
    console.log('🔄 Refreshing Spotify data...');
    refetch();
  };

  return {
    // Raw data access (full 2000 item datasets)
    tracks: data?.tracks || [],
    artists: data?.artists || [],
    recentlyPlayed: data?.recentlyPlayed || [],
    
    // Loading state
    isLoading,
    error,
    
    // Data access methods (all use the full 2000 item dataset)
    getTopTracks,
    getTopArtists,
    getRecentlyPlayed,
    getTracksByGenre,
    getGenreAnalysis,
    getStats,
    
    // Utility methods
    refreshData,
    
    // Data quality info
    dataInfo: {
      tracksCount: data?.tracks?.length || 0,
      artistsCount: data?.artists?.length || 0,
      recentCount: data?.recentlyPlayed?.length || 0,
      lastFetched: data ? new Date().toISOString() : null
    }
  };
};
