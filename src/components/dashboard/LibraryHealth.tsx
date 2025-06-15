import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { 
  Music, 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Heart,
  Loader2
} from 'lucide-react';

export const LibraryHealth = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('long_term', 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('long_term', 50);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  const libraryStats = useMemo(() => {
    if (!topTracksData?.items || !topArtistsData?.items) return null;

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;

    // Calculate genre distribution
    const genreCounts: { [key: string]: number } = {};
    artists.forEach((artist: any) => {
      artist.genres?.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    // Get top genres
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre);

    // Calculate average track age
    const currentYear = new Date().getFullYear();
    const trackAges = tracks.map((track: any) => {
      const releaseDate = track.album?.release_date;
      if (!releaseDate) return 0;
      return currentYear - parseInt(releaseDate.split('-')[0]);
    });
    const avgTrackAge = trackAges.reduce((a, b) => a + b, 0) / trackAges.length;

    // Calculate popularity distribution
    const popularityRanges = {
      high: tracks.filter((t: any) => t.popularity >= 80).length,
      medium: tracks.filter((t: any) => t.popularity >= 50 && t.popularity < 80).length,
      low: tracks.filter((t: any) => t.popularity < 50).length,
    };

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      topGenres,
      avgTrackAge: Math.round(avgTrackAge),
      popularityRanges,
      genreDiversity: Object.keys(genreCounts).length,
    };
  }, [topTracksData, topArtistsData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!libraryStats) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No library data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Library Health</CardTitle>
          <CardDescription>Overview of your music collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Tracks */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Music className="h-4 w-4" />
                <span className="text-sm">Total Tracks</span>
              </div>
              <div className="text-2xl font-bold">{libraryStats.totalTracks}</div>
            </div>

            {/* Total Artists */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Artists</span>
              </div>
              <div className="text-2xl font-bold">{libraryStats.totalArtists}</div>
            </div>

            {/* Genre Diversity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Genre Diversity</span>
              </div>
              <div className="text-2xl font-bold">{libraryStats.genreDiversity}</div>
            </div>
          </div>

          {/* Top Genres */}
          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium">Top Genres</div>
            <div className="flex flex-wrap gap-2">
              {libraryStats.topGenres.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Popularity Distribution */}
          <div className="mt-6 space-y-4">
            <div className="text-sm font-medium">Track Popularity</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>High ({libraryStats.popularityRanges.high})</span>
                <span className="text-muted-foreground">≥ 80%</span>
              </div>
              <Progress 
                value={(libraryStats.popularityRanges.high / libraryStats.totalTracks) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medium ({libraryStats.popularityRanges.medium})</span>
                <span className="text-muted-foreground">50-79%</span>
              </div>
              <Progress 
                value={(libraryStats.popularityRanges.medium / libraryStats.totalTracks) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Low ({libraryStats.popularityRanges.low})</span>
                <span className="text-muted-foreground">&lt; 50%</span>
              </div>
              <Progress 
                value={(libraryStats.popularityRanges.low / libraryStats.totalTracks) * 100} 
                className="h-2"
              />
            </div>
          </div>

          {/* Average Track Age */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Average Track Age</span>
            </div>
            <div className="text-2xl font-bold">{libraryStats.avgTrackAge} years</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 