
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Music, TrendingUp, Star, Shuffle } from 'lucide-react';

export const GenreAnalysis = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Mock data
  const genreData = [
    { name: 'Rock', value: 35, color: '#FF6B6B', tracks: 245, artists: 45, hours: 87 },
    { name: 'Pop', value: 28, color: '#4ECDC4', tracks: 196, artists: 38, hours: 72 },
    { name: 'Electronic', value: 18, color: '#45B7D1', tracks: 126, artists: 28, hours: 45 },
    { name: 'Hip Hop', value: 12, color: '#96CEB4', tracks: 84, artists: 22, hours: 31 },
    { name: 'Jazz', value: 7, color: '#FFEAA7', tracks: 49, artists: 15, hours: 18 },
  ];

  const moodData = [
    { mood: 'Energetic', value: 85 },
    { mood: 'Relaxed', value: 65 },
    { mood: 'Melancholic', value: 45 },
    { mood: 'Upbeat', value: 78 },
    { mood: 'Aggressive', value: 32 },
    { mood: 'Romantic', value: 58 },
  ];

  const topGenreTracks = {
    Rock: [
      { name: 'Bohemian Rhapsody', artist: 'Queen', plays: 42 },
      { name: 'Stairway to Heaven', artist: 'Led Zeppelin', plays: 38 },
      { name: 'Hotel California', artist: 'Eagles', plays: 35 },
    ],
    Pop: [
      { name: 'Blinding Lights', artist: 'The Weeknd', plays: 55 },
      { name: 'Watermelon Sugar', artist: 'Harry Styles', plays: 48 },
      { name: 'Levitating', artist: 'Dua Lipa', plays: 43 },
    ],
  };

  const chartConfig = {
    value: {
      label: "Percentage",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Genre Analysis</h1>
        <p className="text-muted-foreground">
          Explore your musical taste and discover patterns in your listening preferences
        </p>
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
              Breakdown of your music library by genre
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
              The emotional profile of your music
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {genreData.map((genre, index) => (
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

      {/* Top Tracks by Genre */}
      {selectedGenre && topGenreTracks[selectedGenre as keyof typeof topGenreTracks] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top {selectedGenre} Tracks
            </CardTitle>
            <CardDescription>
              Your most played {selectedGenre.toLowerCase()} songs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topGenreTracks[selectedGenre as keyof typeof topGenreTracks].map((track, index) => (
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
                  <Badge variant="secondary">{track.plays} plays</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Genre Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Musical Profile Insights</CardTitle>
          <CardDescription>
            AI-powered analysis of your musical preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Diversity Score</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Genre Diversity</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  You have a well-balanced musical taste across multiple genres
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Discovery Rate</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>New Genre Exploration</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  You regularly explore new genres and artists
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">5</div>
                <div className="text-sm text-muted-foreground">Primary Genres</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">148</div>
                <div className="text-sm text-muted-foreground">Total Artists</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-secondary">700</div>
                <div className="text-sm text-muted-foreground">Unique Tracks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
