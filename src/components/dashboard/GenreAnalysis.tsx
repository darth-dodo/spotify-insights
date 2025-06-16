import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Music, TrendingUp, Star, Database } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { calculateGenreAnalysis, getTopTracks, getTopArtists, getTracksByGenre } from '@/lib/spotify-data-utils';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const GenreAnalysis = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const { data: tracksData, isLoading: tracksLoading } = useEnhancedTopTracks('medium_term');
  const { data: artistsData, isLoading: artistsLoading } = useEnhancedTopArtists('medium_term');

  const isLoading = tracksLoading || artistsLoading || !tracksData || !artistsData;

  const genreData = useMemo(() => {
    if (!artistsData) return null;
    return calculateGenreAnalysis(artistsData);
  }, [artistsData]);

  const moodData = useMemo(() => {
    if (!genreData) return null;

    const moodMapping: Record<string, string[]> = {
      energetic: ['rock', 'metal', 'electronic', 'dance', 'house', 'techno', 'trance', 'edm'],
      chill: ['ambient', 'chillout', 'lofi', 'jazz', 'classical', 'indie', 'folk'],
      emotional: ['pop', 'r&b', 'soul', 'blues', 'ballad', 'indie pop'],
      experimental: ['experimental', 'avant-garde', 'progressive', 'psychedelic', 'alternative'],
      cultural: ['world', 'traditional', 'ethnic', 'folk', 'regional']
    };

    const moodCounts = Object.entries(moodMapping).map(([mood, genres]) => {
      const matchingGenres = genreData.filter(g => 
        genres.some(genre => g.name.toLowerCase().includes(genre))
      );
      const value = matchingGenres.reduce((acc, g) => acc + g.value, 0);
      return { mood, value };
    });

    return moodCounts;
  }, [genreData]);

  const topTracks = useMemo(() => {
    if (!tracksData) return [];
    return getTopTracks(tracksData, 5);
  }, [tracksData]);

  const topArtists = useMemo(() => {
    if (!artistsData) return [];
    return getTopArtists(artistsData, 5);
  }, [artistsData]);

  // Get top tracks by genre from memory
  const selectedGenreTracks = useMemo(() => {
    if (!selectedGenre) return {};
    
    const genreTracks = getTracksByGenre(tracksData, artistsData, selectedGenre, 3)
      .map((track: any) => ({
        name: track.name,
        artist: track.artists[0].name,
        popularity: track.popularity
      }));
    
    return { [selectedGenre]: genreTracks };
  }, [selectedGenre, tracksData, artistsData]);

  const chartConfig = {
    value: {
      label: "Percentage",
      color: "hsl(var(--accent))",
    },
  };

  if (isLoading || !genreData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Genre Analysis</h1>
          <p className="text-muted-foreground">Loading your music data...</p>
        </div>
        <CalmingLoader 
          title="Analyzing your musical genres..."
          description="Processing your extended music library to discover patterns"
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Genre Analysis</h1>
        <p className="text-muted-foreground">
          Explore your musical taste and discover patterns in your listening preferences
        </p>
        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
          <Database className="h-3 w-3" />
          Full Dataset ({tracksData.length} tracks, {artistsData.length} artists)
        </Badge>
      </div>

      {/* Genre Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
            <CardDescription>Your music taste across different genres</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData.slice(0, 8)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {genreData.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mood Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Analysis</CardTitle>
            <CardDescription>Emotional profile of your music</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={moodData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="mood" />
                <PolarRadiusAxis />
                <Radar
                  name="Mood"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Genre Details */}
      <Card>
        <CardHeader>
          <CardTitle>Genre Details</CardTitle>
          <CardDescription>Detailed breakdown of your genre preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {genreData.map((genre, index) => (
              <div key={genre.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }} />
                  <span>{genre.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {genre.artists} artists
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {genre.tracks} tracks
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Pop: {genre.avgPopularity}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Musical Profile Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Musical Profile Insights</CardTitle>
          <CardDescription>
            AI-powered analysis of your musical preferences from {artistsData.length} artists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Diversity Score</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Genre Diversity</span>
                  <span>{Math.min(100, genreData.length * 12)}%</span>
                </div>
                <Progress value={Math.min(100, genreData.length * 12)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {genreData.length} distinct genres detected from your full music library
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Discovery Rate</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Genre Exploration</span>
                  <span>{Math.min(100, Math.round((new Set(artistsData.flatMap((artist: any) => artist.genres || [])).size || 0) * 1.5))}%</span>
                </div>
                <Progress value={Math.min(100, Math.round((new Set(artistsData.flatMap((artist: any) => artist.genres || [])).size || 0) * 1.5))} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {new Set(artistsData.flatMap((artist: any) => artist.genres || [])).size || 0} unique genre tags in your library
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">{genreData.length}</div>
                <div className="text-sm text-muted-foreground">Primary Genres</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{artistsData.length}</div>
                <div className="text-sm text-muted-foreground">Total Artists</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{tracksData.length}</div>
                <div className="text-sm text-muted-foreground">Unique Tracks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Tracks by Genre */}
      {selectedGenre && selectedGenreTracks[selectedGenre] && selectedGenreTracks[selectedGenre].length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Tracks in {selectedGenre}</CardTitle>
            <CardDescription>Your most popular tracks in this genre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedGenreTracks[selectedGenre].map((track: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                      <Music className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{track.popularity} popularity</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
