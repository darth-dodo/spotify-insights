
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { Music, Users, TrendingUp, Calendar, Star, Headphones } from 'lucide-react';

export const LibraryHealth = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 50);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Calculate library metrics
  const libraryMetrics = React.useMemo(() => {
    if (!topTracksData?.items || !topArtistsData?.items || !recentlyPlayedData?.items) {
      return null;
    }

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;
    const recentTracks = recentlyPlayedData.items;

    // Genre analysis
    const genreMap = new Map<string, number>();
    artists.forEach(artist => {
      artist.genres?.forEach(genre => {
        genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
      });
    });

    const topGenres = Array.from(genreMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));

    // Popularity distribution
    const popularityBuckets = { low: 0, medium: 0, high: 0 };
    tracks.forEach(track => {
      if (track.popularity < 40) popularityBuckets.low++;
      else if (track.popularity < 70) popularityBuckets.medium++;
      else popularityBuckets.high++;
    });

    // Track age analysis (based on album release date)
    const currentYear = new Date().getFullYear();
    const trackAges = tracks
      .map(track => {
        const releaseYear = track.album?.release_date ? 
          new Date(track.album.release_date).getFullYear() : currentYear;
        return currentYear - releaseYear;
      })
      .filter(age => !isNaN(age));

    const avgTrackAge = trackAges.length > 0 ? 
      trackAges.reduce((sum, age) => sum + age, 0) / trackAges.length : 0;

    // Diversity score
    const uniqueArtists = new Set(tracks.map(track => track.artists[0]?.id)).size;
    const diversityScore = Math.round((uniqueArtists / tracks.length) * 100);

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      topGenres,
      popularityBuckets,
      avgTrackAge: Math.round(avgTrackAge),
      diversityScore,
      avgPopularity: Math.round(tracks.reduce((sum, track) => sum + track.popularity, 0) / tracks.length),
      genreCount: genreMap.size
    };
  }, [topTracksData, topArtistsData, recentlyPlayedData]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Library Health</h1>
          <p className="text-muted-foreground">Analyzing your music library...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!libraryMetrics) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Library Health</h1>
          <p className="text-muted-foreground">Unable to load library data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Library Health</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics about your Spotify music library
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Tracks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.totalTracks}</div>
            <p className="text-xs text-muted-foreground">
              In your top 50 tracks
            </p>
          </CardContent>
        </Card>

        {/* Total Artists */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.totalArtists}</div>
            <p className="text-xs text-muted-foreground">
              In your top 50 artists
            </p>
          </CardContent>
        </Card>

        {/* Genre Diversity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genre Diversity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.genreCount}</div>
            <p className="text-xs text-muted-foreground">
              Different genres represented
            </p>
          </CardContent>
        </Card>

        {/* Average Track Age */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Track Age</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.avgTrackAge} years</div>
            <p className="text-xs text-muted-foreground">
              How old your music is on average
            </p>
          </CardContent>
        </Card>

        {/* Diversity Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artist Diversity</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.diversityScore}%</div>
            <p className="text-xs text-muted-foreground">
              Unique artist ratio
            </p>
          </CardContent>
        </Card>

        {/* Average Popularity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Popularity</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.avgPopularity}/100</div>
            <p className="text-xs text-muted-foreground">
              Overall track popularity
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres */}
        <Card>
          <CardHeader>
            <CardTitle>Top Genres</CardTitle>
            <CardDescription>Most represented genres in your library</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {libraryMetrics.topGenres.map((genre, index) => (
              <div key={genre.genre} className="flex items-center justify-between">
                <Badge variant={index === 0 ? "default" : "secondary"} className="capitalize">
                  {genre.genre}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {genre.count} artists
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popularity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Track Popularity Distribution</CardTitle>
            <CardDescription>How mainstream vs niche your music is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Niche (0-39)</span>
                <span>{libraryMetrics.popularityBuckets.low} tracks</span>
              </div>
              <Progress 
                value={(libraryMetrics.popularityBuckets.low / libraryMetrics.totalTracks) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Moderate (40-69)</span>
                <span>{libraryMetrics.popularityBuckets.medium} tracks</span>
              </div>
              <Progress 
                value={(libraryMetrics.popularityBuckets.medium / libraryMetrics.totalTracks) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mainstream (70-100)</span>
                <span>{libraryMetrics.popularityBuckets.high} tracks</span>
              </div>
              <Progress 
                value={(libraryMetrics.popularityBuckets.high / libraryMetrics.totalTracks) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
