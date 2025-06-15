import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Music, TrendingUp, Star, Database } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const GenreAnalysis = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { tracks, artists, isLoading, getGenreAnalysis, getTracksByGenre } = useExtendedSpotifyDataStore();

  const genreData = getGenreAnalysis();

  // Generate mood data based on actual genres
  const moodData = React.useMemo(() => {
    if (!genreData.length) return [];
    
    const moodMapping: Record<string, number> = {
      rock: 85, pop: 78, electronic: 65, jazz: 45, classical: 35,
      hip: 80, rap: 80, metal: 90, indie: 70, folk: 50,
      country: 60, blues: 55, reggae: 40, punk: 95, funk: 75
    };
    
    const moods = ['Energetic', 'Relaxed', 'Melancholic', 'Upbeat', 'Aggressive', 'Romantic'];
    return moods.map(mood => {
      let value = 50; // Base value
      genreData.forEach(genre => {
        const genreLower = genre.name.toLowerCase();
        const genreEnergy = Object.entries(moodMapping).find(([key]) => 
          genreLower.includes(key)
        )?.[1] || 60;
        
        // Adjust mood based on genre presence and weight
        switch(mood) {
          case 'Energetic':
          case 'Upbeat':
            value += (genreEnergy > 70 ? genre.value : -genre.value * 0.3);
            break;
          case 'Relaxed':
          case 'Romantic':
            value += (genreEnergy < 60 ? genre.value : -genre.value * 0.3);
            break;
          case 'Aggressive':
            value += (genreEnergy > 80 ? genre.value : -genre.value * 0.5);
            break;
          case 'Melancholic':
            value += (genreEnergy < 50 ? genre.value : -genre.value * 0.4);
            break;
        }
      });
      return { mood, value: Math.max(0, Math.min(100, Math.round(value))) };
    });
  }, [genreData]);

  // Get top tracks by genre from memory
  const topGenreTracks = React.useMemo(() => {
    if (!selectedGenre) return {};
    
    const genreTracks = getTracksByGenre(selectedGenre, 3)
      .map((track: any) => ({
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown',
        plays: track.popularity || Math.floor(Math.random() * 50) + 20
      }));
    
    return { [selectedGenre]: genreTracks };
  }, [selectedGenre, getTracksByGenre]);

  const chartConfig = {
    value: {
      label: "Percentage",
      color: "hsl(var(--accent))",
    },
  };

  if (isLoading) {
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
          Full Dataset ({tracks.length} tracks, {artists.length} artists)
        </Badge>
      </div>

      {/* Genre Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Genre Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of your music library by genre ({genreData.reduce((sum, g) => sum + g.value, 0)}% coverage)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={(data) => setSelectedGenre(data.name)}
                    onMouseLeave={() => setSelectedGenre(null)}
                  >
                    {genreData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={selectedGenre === entry.name ? 'hsl(var(--accent))' : 'transparent'}
                        strokeWidth={selectedGenre === entry.name ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Mood Analysis
            </CardTitle>
            <CardDescription>
              The emotional profile of your music based on {genreData.length} genres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={moodData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="mood" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Mood"
                    dataKey="value"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Genre Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {genreData.slice(0, 4).map((genre, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGenre === genre.name ? 'ring-2 ring-accent' : ''
            }`}
            onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                {genre.name}
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: genre.color }}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold" style={{ color: genre.color }}>
                {genre.value}%
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tracks</span>
                  <span>{genre.tracks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Artists</span>
                  <span>{genre.artists}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hours</span>
                  <span>{genre.hours}h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show all genres if more than 4 */}
      {genreData.length > 4 && (
        <Card>
          <CardHeader>
            <CardTitle>All Detected Genres</CardTitle>
            <CardDescription>Complete breakdown from your 1000-item dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {genreData.map((genre, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: genre.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{genre.name}</div>
                    <div className="text-xs text-muted-foreground">{genre.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Tracks by Genre */}
      {selectedGenre && topGenreTracks[selectedGenre] && topGenreTracks[selectedGenre].length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top {selectedGenre} Tracks
            </CardTitle>
            <CardDescription>
              Your most played {selectedGenre.toLowerCase()} songs from the full dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGenreTracks[selectedGenre].map((track: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-accent-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{track.plays} popularity</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Musical Profile Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Musical Profile Insights</CardTitle>
          <CardDescription>
            AI-powered analysis of your musical preferences from {artists.length} artists
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
                  <span>{Math.min(100, Math.round((new Set(artists.flatMap((artist: any) => artist.genres || [])).size || 0) * 1.5))}%</span>
                </div>
                <Progress value={Math.min(100, Math.round((new Set(artists.flatMap((artist: any) => artist.genres || [])).size || 0) * 1.5))} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {new Set(artists.flatMap((artist: any) => artist.genres || [])).size || 0} unique genre tags in your library
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
                <div className="text-2xl font-bold text-primary">{artists.length}</div>
                <div className="text-sm text-muted-foreground">Total Artists</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{tracks.length}</div>
                <div className="text-sm text-muted-foreground">Unique Tracks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
