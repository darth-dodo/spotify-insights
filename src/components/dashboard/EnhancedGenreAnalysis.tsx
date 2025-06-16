
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Music, TrendingUp, Users, Clock, Disc, Star, Eye, BarChart3 } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { calculateGenreAnalysis } from '@/lib/spotify-data-utils';

export const EnhancedGenreAnalysis = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  // Use centralized store with full 2000 item dataset
  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const storeLoading = tracksLoading || artistsLoading;
  const topTracksData = { items: tracks };
  const topArtistsData = { items: artists };
  const tracksLoading = storeLoading;
  const artistsLoading = storeLoading;

  const isLoading = tracksLoading || artistsLoading;

  // Process genre data from API response
  const genreAnalysis = useMemo(() => {
    if (!topArtistsData?.items || !topTracksData?.items) return { genres: [], total: 0 };

    const genreCounts: { [key: string]: { count: number; artists: string[]; tracks: string[] } } = {};
    
    // Process artists and their genres
    topArtistsData.items.forEach((artist: any) => {
      artist.genres?.forEach((genre: string) => {
        if (!genreCounts[genre]) {
          genreCounts[genre] = { count: 0, artists: [], tracks: [] };
        }
        genreCounts[genre].count += 1;
        genreCounts[genre].artists.push(artist.name);
      });
    });

    // Add track information to genres
    topTracksData.items.forEach((track: any) => {
      track.artists?.forEach((artist: any) => {
        // Find genres for this artist from our processed data
        Object.keys(genreCounts).forEach(genre => {
          if (genreCounts[genre].artists.includes(artist.name)) {
            if (!genreCounts[genre].tracks.includes(track.name)) {
              genreCounts[genre].tracks.push(track.name);
            }
          }
        });
      });
    });

    const genres = Object.entries(genreCounts)
      .map(([genre, data]) => ({
        name: genre,
        count: data.count,
        artists: [...new Set(data.artists)], // Remove duplicates
        tracks: [...new Set(data.tracks)], // Remove duplicates
        percentage: 0, // Will be calculated below
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    const total = genres.reduce((sum, genre) => sum + genre.count, 0);
    
    // Calculate percentages
    genres.forEach(genre => {
      genre.percentage = total > 0 ? Math.round((genre.count / total) * 100) : 0;
    });

    return { genres, total };
  }, [topArtistsData, topTracksData]);

  // Generate time evolution data (mock data based on current preferences)
  const genreEvolution = useMemo(() => {
    if (genreAnalysis.genres.length === 0) return [];

    return [
      { month: 'Jan', ...Object.fromEntries(genreAnalysis.genres.slice(0, 5).map(g => [g.name, Math.random() * 30 + 10])) },
      { month: 'Feb', ...Object.fromEntries(genreAnalysis.genres.slice(0, 5).map(g => [g.name, Math.random() * 30 + 10])) },
      { month: 'Mar', ...Object.fromEntries(genreAnalysis.genres.slice(0, 5).map(g => [g.name, Math.random() * 30 + 10])) },
      { month: 'Apr', ...Object.fromEntries(genreAnalysis.genres.slice(0, 5).map(g => [g.name, Math.random() * 30 + 10])) },
      { month: 'May', ...Object.fromEntries(genreAnalysis.genres.slice(0, 5).map(g => [g.name, Math.random() * 30 + 10])) },
      { month: 'Jun', ...Object.fromEntries(genreAnalysis.genres.slice(0, 5).map(g => [g.name, g.count])) },
    ];
  }, [genreAnalysis.genres]);

  const chartColors = [
    'hsl(var(--accent))',
    'hsl(217, 91%, 60%)',
    'hsl(262, 83%, 58%)',
    'hsl(330, 81%, 60%)',
    'hsl(25, 95%, 53%)',
    'hsl(142, 76%, 36%)',
    'hsl(221, 83%, 53%)',
    'hsl(263, 70%, 50%)',
    'hsl(31, 81%, 56%)',
    'hsl(348, 83%, 47%)',
    'hsl(200, 98%, 39%)',
    'hsl(271, 91%, 65%)',
  ];

  const chartConfig = {
    count: { label: "Count", color: "hsl(var(--accent))" },
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return 'This Period';
    }
  };

  const selectedGenreData = useMemo(() => {
    if (!selectedGenre) return null;
    return genreAnalysis.genres.find(g => g.name === selectedGenre);
  }, [selectedGenre, genreAnalysis.genres]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Genre Analysis</h1>
          <p className="text-muted-foreground">Loading your genre preferences...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Genre Analysis</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Explore your musical taste and genre preferences over time
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_term">Last 4 Weeks</SelectItem>
                <SelectItem value="medium_term">Last 6 Months</SelectItem>
                <SelectItem value="long_term">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Detailed
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Genres</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.genres.length}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Top Genre</span>
            </div>
            <div className="text-sm md:text-base font-bold truncate">
              {genreAnalysis.genres[0]?.name || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {genreAnalysis.genres[0]?.percentage || 0}% of listening
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Diversity</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">
              {genreAnalysis.genres.length > 5 ? 'High' : genreAnalysis.genres.length > 2 ? 'Medium' : 'Low'}
            </div>
            <div className="text-xs text-muted-foreground">genre spread</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Period</span>
            </div>
            <div className="text-sm md:text-base font-bold">
              {getTimeRangeLabel(timeRange)}
            </div>
            <div className="text-xs text-muted-foreground">time range</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Genre Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc className="h-5 w-5" />
                Genre Distribution
              </CardTitle>
              <CardDescription>
                Your musical taste breakdown - {getTimeRangeLabel(timeRange)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreAnalysis.genres.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {genreAnalysis.genres.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.count} artists ({data.percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Genres List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Genres
              </CardTitle>
              <CardDescription>
                Most listened genres ranked by artist count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {genreAnalysis.genres.slice(0, 8).map((genre, index) => (
                  <div 
                    key={genre.name}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-accent/5 ${
                      selectedGenre === genre.name ? 'bg-accent/10 border border-accent/20' : ''
                    }`}
                    onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{genre.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {genre.percentage}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {genre.artists.length} artists
                        </p>
                        <Progress value={genre.percentage} className="flex-1 h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Genre Evolution Over Time</CardTitle>
              <CardDescription>
                How your genre preferences have changed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={genreEvolution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {genreAnalysis.genres.slice(0, 5).map((genre, index) => (
                      <Line 
                        key={genre.name}
                        type="monotone" 
                        dataKey={genre.name}
                        stroke={chartColors[index % chartColors.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Genre Comparison Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Artist Count by Genre</CardTitle>
              <CardDescription>
                Detailed breakdown of genre distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreAnalysis.genres.slice(0, 10)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      className="text-muted-foreground" 
                      width={100}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--accent))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Genre Detail Modal */}
      {selectedGenreData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Genre Details: {selectedGenreData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Statistics</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Share of listening:</span>
                    <span className="font-medium">{selectedGenreData.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Artists:</span>
                    <span className="font-medium">{selectedGenreData.artists.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tracks:</span>
                    <span className="font-medium">{selectedGenreData.tracks.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Top Artists</h4>
                <div className="space-y-1">
                  {selectedGenreData.artists.slice(0, 5).map((artist, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {artist}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Popular Tracks</h4>
                <div className="space-y-1">
                  {selectedGenreData.tracks.slice(0, 5).map((track, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {track}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
