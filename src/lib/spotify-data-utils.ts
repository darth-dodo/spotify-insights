// Utility functions for Spotify data processing
// These replace the methods that were previously in useExtendedSpotifyDataStore

export type TimeDimension = 'week' | 'month' | 'three_months' | 'six_months' | 'year' | 'all_time';

export function getTimeRangeForDimension(dimension: TimeDimension): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (dimension) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'three_months':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'six_months':
      start.setMonth(end.getMonth() - 6);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case 'all_time':
      start.setFullYear(2000); // Spotify's launch year
      break;
  }

  return { start, end };
}

export function filterDataByTimeDimension(data: any[], dimension: TimeDimension): any[] {
  if (!data?.length) return [];
  
  const { start, end } = getTimeRangeForDimension(dimension);
  
  return data.filter(item => {
    const itemDate = new Date(item.played_at || item.added_at);
    return itemDate >= start && itemDate <= end;
  });
}

export function calculateStats(tracks: any[], artists: any[], recentlyPlayed: any[], dimension: TimeDimension = 'all_time') {
  if (!tracks?.length && !artists?.length) {
    return {
      totalTracks: 0,
      totalArtists: 0,
      listeningTime: 0,
      topGenre: 'N/A',
      uniqueGenres: 0,
      averagePopularity: 0,
      recentTracksCount: 0,
      hasSpotifyData: false,
      timeDimension: dimension
    };
  }

  // Get unique artists and genres
  const uniqueArtists = new Set(artists.map(artist => artist.id));
  const uniqueGenres = new Set(artists.flatMap(artist => artist.genres || []));

  // Calculate total duration and popularity
  const totalDuration = tracks.reduce((acc: number, track: any) => acc + (track.duration_ms || 0), 0);
  const totalPopularity = tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0);

  // Calculate recent tracks (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTracks = recentlyPlayed.filter(track => {
    const playedAt = new Date(track.played_at || track.added_at);
    return playedAt >= thirtyDaysAgo;
  });

  // Calculate top genre
  const genreCounts = artists.reduce((acc: Record<string, number>, artist: any) => {
    artist.genres?.forEach((genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  const topGenre = Object.entries(genreCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';

  return {
    totalTracks: tracks.length,
    totalArtists: uniqueArtists.size,
    listeningTime: totalDuration / (1000 * 60 * 60), // Convert to hours
    topGenre,
    uniqueGenres: uniqueGenres.size,
    averagePopularity: tracks.length > 0 ? totalPopularity / tracks.length : 0,
    recentTracksCount: recentTracks.length,
    hasSpotifyData: true,
    timeDimension: dimension
  };
}

export function calculateGenreAnalysis(artists: any[], dimension: TimeDimension = 'all_time') {
  if (!artists?.length) return [];

  // First pass: count unique genres and collect artist data
  const genreMap = new Map<string, {
    count: number;
    artists: Set<string>;
    tracks: Set<string>;
    totalPopularity: number;
    artistCount: number;
  }>();

  artists.forEach(artist => {
    const genres = artist.genres || [];
    genres.forEach(genre => {
      if (!genreMap.has(genre)) {
        genreMap.set(genre, {
          count: 0,
          artists: new Set(),
          tracks: new Set(),
          totalPopularity: 0,
          artistCount: 0
        });
      }
      const data = genreMap.get(genre)!;
      data.artists.add(artist.id);
      data.artistCount++;
      data.totalPopularity += artist.popularity || 0;
      data.count++;
    });
  });

  // Convert to array and calculate percentages
  const totalCount = Array.from(genreMap.values()).reduce((sum, data) => sum + data.count, 0);
  
  return Array.from(genreMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      percentage: totalCount > 0 ? (data.count / totalCount) * 100 : 0,
      artists: data.artists.size,
      tracks: data.tracks.size,
      avgPopularity: data.artistCount > 0 ? data.totalPopularity / data.artistCount : 0,
      totalGenres: genreMap.size,
      timeDimension: dimension
    }))
    .sort((a, b) => b.count - a.count);
}

export function getTracksByGenre(tracks: any[], artists: any[], genre: string, limit: number = 5, dimension: TimeDimension = 'all_time') {
  if (!tracks?.length || !artists?.length) return [];

  const { start, end } = getTimeRangeForDimension(dimension);
  const filteredTracks = tracks.filter(track => {
    const trackDate = new Date(track.added_at || track.played_at);
    return trackDate >= start && trackDate <= end;
  });

  const genreArtists = artists.filter(artist => 
    (artist.genres || []).some((g: string) => g.toLowerCase().includes(genre.toLowerCase()))
  );
  
  const artistIds = new Set(genreArtists.map(artist => artist.id));
  
  return filteredTracks
    .filter(track => track.artists.some((artist: any) => artistIds.has(artist.id)))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

export function getTopTracks(tracks: any[], limit: number = 10, dimension: TimeDimension = 'all_time') {
  if (!tracks?.length) return [];
  
  const filteredTracks = filterDataByTimeDimension(tracks, dimension);
  
  return filteredTracks
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit)
    .map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown',
      popularity: track.popularity || 0,
      duration: track.duration_ms || 0,
      image: track.album?.images[0]?.url,
      addedAt: track.added_at || track.played_at
    }));
}

export function getTopArtists(artists: any[], limit: number = 10, dimension: TimeDimension = 'all_time') {
  if (!artists?.length) return [];
  
  const filteredArtists = filterDataByTimeDimension(artists, dimension);
  
  return filteredArtists
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit)
    .map(artist => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity || 0,
      genres: artist.genres || [],
      image: artist.images[0]?.url,
      addedAt: artist.added_at || artist.played_at
    }));
}

export function getRecentlyPlayed(tracks: any[], limit: number = 10, dimension: TimeDimension = 'all_time') {
  if (!tracks?.length) return [];
  
  const filteredTracks = filterDataByTimeDimension(tracks, dimension);
  
  return filteredTracks
    .sort((a, b) => {
      const dateA = new Date(a.played_at || a.added_at);
      const dateB = new Date(b.played_at || b.added_at);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit)
    .map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown',
      playedAt: track.played_at || track.added_at,
      image: track.album?.images[0]?.url
    }));
}

// Helper function to calculate top genre
function calculateTopGenre(tracks: any[]): string {
  const genreCounts = new Map<string, number>();
  
  tracks.forEach(track => {
    track.artists.forEach((artist: any) => {
      (artist.genres || []).forEach((genre: string) => {
        genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
      });
    });
  });
  
  let topGenre = 'N/A';
  let maxCount = 0;
  
  genreCounts.forEach((count, genre) => {
    if (count > maxCount) {
      maxCount = count;
      topGenre = genre;
    }
  });
  
  return topGenre;
} 