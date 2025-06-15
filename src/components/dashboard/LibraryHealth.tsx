import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { Music, Users, TrendingUp, Calendar, Star, Headphones, Database } from 'lucide-react';

export const LibraryHealth = () => {
  const { tracks, artists, recentlyPlayed, isLoading } = useExtendedSpotifyDataStore();

  // Calculate library metrics
  const libraryMetrics = React.useMemo(() => {
    if (!tracks.length || !artists.length) {
      return null;
    }

    // Genre analysis
    const genreMap = new Map<string, number>();
    artists.forEach(artist => {
      artist.genres?.forEach(genre => {
        genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
      });
    });

    const topGenres = Array.from(genreMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10) // Show more genres with larger dataset
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

    // Decade distribution
    const decadeMap = new Map<string, number>();
    tracks.forEach(track => {
      if (track.album?.release_date) {
        const year = new Date(track.album.release_date).getFullYear();
        const decade = Math.floor(year / 10) * 10;
        const decadeLabel = `${decade}s`;
        decadeMap.set(decadeLabel, (decadeMap.get(decadeLabel) || 0) + 1);
      }
    });

    const topDecades = Array.from(decadeMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Diversity score
    const uniqueArtists = new Set(tracks.map(track => track.artists[0]?.id)).size;
    const diversityScore = Math.round((uniqueArtists / tracks.length) * 100);

    // Artist popularity distribution
    const artistPopularityBuckets = { emerging: 0, established: 0, mainstream: 0 };
    artists.forEach(artist => {
      if (artist.popularity < 40) artistPopularityBuckets.emerging++;
      else if (artist.popularity < 70) artistPopularityBuckets.established++;
      else artistPopularityBuckets.mainstream++;
    });

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      topGenres,
      topDecades,
      popularityBuckets,
      artistPopularityBuckets,
      avgTrackAge: Math.round(avgTrackAge),
      diversityScore,
      avgPopularity: Math.round(tracks.reduce((sum, track) => sum + track.popularity, 0) / tracks.length),
      genreCount: genreMap.size,
      uniqueArtists
    };
  }, [tracks, artists]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Enhanced Library Health</h1>
          <p className="text-muted-foreground">Analyzing your extended music library (up to 1000 tracks & artists)...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, i) => (
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
          <h1 className="text-3xl font-bold">Enhanced Library Health</h1>
          <p className="text-muted-foreground">Unable to load library data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Enhanced Library Health</h1>
        <p className="text-muted-foreground">
          Deep analysis of your extended Spotify music library ({libraryMetrics.totalTracks} tracks, {libraryMetrics.totalArtists} artists)
        </p>
        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
          <Database className="h-3 w-3" />
          Extended Dataset (up to 1000 items)
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tracks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.totalTracks}</div>
            <p className="text-xs text-muted-foreground">
              Extended dataset
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
              Unique: {libraryMetrics.uniqueArtists}
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
              Music era preference
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
            <CardTitle className="text-sm font-medium">Avg Popularity</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{libraryMetrics.avgPopularity}/100</div>
            <p className="text-xs text-muted-foreground">
              Mainstream level
            </p>
          </CardContent>
        </Card>

        {/* Mainstream vs Niche */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Music Profile</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {libraryMetrics.popularityBuckets.high > libraryMetrics.popularityBuckets.low ? 'Mainstream' : 'Niche'}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((libraryMetrics.popularityBuckets.high / libraryMetrics.totalTracks) * 100)}% popular tracks
            </p>
          </CardContent>
        </Card>

        {/* Discovery Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discovery Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((libraryMetrics.popularityBuckets.low / libraryMetrics.totalTracks) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Hidden gems found
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Genres */}
        <Card>
          <CardHeader>
            <CardTitle>Top Genres</CardTitle>
            <CardDescription>Most represented genres in your extended library</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {libraryMetrics.topGenres.map((genre, index) => (
              <div key={genre.genre} className="flex items-center justify-between">
                <Badge variant={index < 3 ? "default" : "secondary"} className="capitalize">
                  {genre.genre}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {genre.count} artists
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Decade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Era Distribution</CardTitle>
            <CardDescription>Your music across different decades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {libraryMetrics.topDecades.map(([decade, count], index) => (
              <div key={decade} className="flex items-center justify-between">
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  {decade}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {count} tracks ({Math.round((count / libraryMetrics.totalTracks) * 100)}%)
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Popularity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Track Popularity Distribution</CardTitle>
            <CardDescription>How mainstream vs niche your track selection is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hidden Gems (0-39)</span>
                <span>{libraryMetrics.popularityBuckets.low} tracks</span>
              </div>
              <Progress 
                value={(libraryMetrics.popularityBuckets.low / libraryMetrics.totalTracks) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rising Stars (40-69)</span>
                <span>{libraryMetrics.popularityBuckets.medium} tracks</span>
              </div>
              <Progress 
                value={(libraryMetrics.popularityBuckets.medium / libraryMetrics.totalTracks) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Chart Toppers (70-100)</span>
                <span>{libraryMetrics.popularityBuckets.high} tracks</span>
              </div>
              <Progress 
                value={(libraryMetrics.popularityBuckets.high / libraryMetrics.totalTracks) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Artist Discovery Level */}
        <Card>
          <CardHeader>
            <CardTitle>Artist Discovery Level</CardTitle>
            <CardDescription>Your taste for emerging vs established artists</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Emerging (0-39)</span>
                <span>{libraryMetrics.artistPopularityBuckets.emerging} artists</span>
              </div>
              <Progress 
                value={(libraryMetrics.artistPopularityBuckets.emerging / libraryMetrics.totalArtists) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Established (40-69)</span>
                <span>{libraryMetrics.artistPopularityBuckets.established} artists</span>
              </div>
              <Progress 
                value={(libraryMetrics.artistPopularityBuckets.established / libraryMetrics.totalArtists) * 100} 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mainstream (70-100)</span>
                <span>{libraryMetrics.artistPopularityBuckets.mainstream} artists</span>
              </div>
              <Progress 
                value={(libraryMetrics.artistPopularityBuckets.mainstream / libraryMetrics.totalArtists) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
