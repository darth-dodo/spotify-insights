
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Area, AreaChart } from 'recharts';
import { Music, TrendingUp, Users, Clock, Disc, Star, Eye, BarChart3, Loader2 } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { cn } from '@/lib/utils';

export const ImprovedGenreAnalysis = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const { useTopTracks, useTopArtists } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);

  const isLoading = tracksLoading || artistsLoading;

  // Improved genre processing with better data representation
  const genreAnalysis = useMemo(() => {
    if (!topArtistsData?.items || !topTracksData?.items) return { genres: [], total: 0, insights: {} };

    const genreCounts: { [key: string]: { 
      count: number; 
      artists: Set<string>; 
      tracks: Set<string>;
      totalPopularity: number;
      avgPopularity: number;
    } } = {};
    
    // Process artists and their genres with popularity weighting
    topArtistsData.items.forEach((artist: any) => {
      const artistPopularity = artist.popularity || 0;
      artist.genres?.forEach((genre: string) => {
        if (!genreCounts[genre]) {
          genreCounts[genre] = { 
            count: 0, 
            artists: new Set(), 
            tracks: new Set(),
            totalPopularity: 0,
            avgPopularity: 0
          };
        }
        genreCounts[genre].count += 1;
        genreCounts[genre].artists.add(artist.name);
        genreCounts[genre].totalPopularity += artistPopularity;
      });
    });

    // Add track information and calculate averages
    topTracksData.items.forEach((track: any) => {
      track.artists?.forEach((artist: any) => {
        // Find matching artist in our data
        const matchingArtist = topArtistsData.items.find((a: any) => a.id === artist.id);
        if (matchingArtist?.genres) {
          matchingArtist.genres.forEach((genre: string) => {
            if (genreCounts[genre]) {
              genreCounts[genre].tracks.add(track.name);
            }
          });
        }
      });
    });

    // Calculate averages and create final genre list
    const genres = Object.entries(genreCounts)
      .map(([genre, data]) => ({
        name: genre,
        count: data.count,
        artists: Array.from(data.artists),
        tracks: Array.from(data.tracks),
        avgPopularity: data.count > 0 ? Math.round(data.totalPopularity / data.count) : 0,
        percentage: 0, // Will be calculated below
        score: 0, // Combined score for ranking
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Limit to top 20 genres

    const total = genres.reduce((sum, genre) => sum + genre.count, 0);
    
    // Calculate percentages and scores
    genres.forEach(genre => {
      genre.percentage = total > 0 ? Math.round((genre.count / total) * 100) : 0;
      genre.score = genre.count * 10 + genre.tracks.length * 2; // Weighted score
    });

    // Generate insights
    const insights = {
      dominantGenre: genres[0],
      diversityScore: Math.min(genres.length * 5, 100),
      totalGenres: genres.length,
      avgPopularity: Math.round(genres.reduce((sum, g) => sum + g.avgPopularity, 0) / genres.length) || 0,
      totalArtists: new Set(genres.flatMap(g => g.artists)).size,
      totalTracks: new Set(genres.flatMap(g => g.tracks)).size,
    };

    return { genres, total, insights };
  }, [topArtistsData, topTracksData]);

  // Generate improved evolution data with more realistic trends
  const genreEvolution = useMemo(() => {
    if (genreAnalysis.genres.length === 0) return [];

    const topGenres = genreAnalysis.genres.slice(0, 6);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map((month, monthIndex) => {
      const data: any = { month };
      
      topGenres.forEach((genre, genreIndex) => {
        // Create more realistic evolution patterns
        const baseValue = genre.count;
        const trendFactor = Math.sin((monthIndex + genreIndex) * 0.5) * 0.3 + 1;
        const randomFactor = 0.8 + Math.random() * 0.4;
        const value = Math.round(baseValue * trendFactor * randomFactor);
        data[genre.name] = Math.max(value, 1);
      });
      
      return data;
    });
  }, [genreAnalysis.genres]);

  // Improved chart colors with better contrast
  const chartColors = [
    'hsl(142, 71%, 45%)', // Spotify green
    'hsl(217, 91%, 60%)', // Blue
    'hsl(262, 83%, 58%)', // Purple
    'hsl(25, 95%, 53%)',  // Orange
    'hsl(330, 81%, 60%)', // Pink
    'hsl(200, 98%, 39%)', // Cyan
    'hsl(31, 81%, 56%)',  // Amber
    'hsl(348, 83%, 47%)', // Red
    'hsl(271, 91%, 65%)', // Violet
    'hsl(142, 76%, 36%)', // Green
    'hsl(221, 83%, 53%)', // Indigo
    'hsl(163, 70%, 50%)', // Teal
  ];

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
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
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
            Explore your musical taste and genre preferences with enhanced analytics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
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

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Genres</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.insights.totalGenres}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Diversity</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.insights.diversityScore}</div>
            <div className="text-xs text-muted-foreground">diversity score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Top Genre</span>
            </div>
            <div className="text-sm md:text-base font-bold truncate">
              {genreAnalysis.insights.dominantGenre?.name || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              {genreAnalysis.insights.dominantGenre?.percentage || 0}% share
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Coverage</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.insights.totalArtists}</div>
            <div className="text-xs text-muted-foreground">artists covered</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === 'overview' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Improved Genre Distribution */}
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
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px]">
                  <ChartContainer config={{}} className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genreAnalysis.genres.slice(0, 8)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => percentage > 5 ? `${name} ${percentage}%` : ''}
                          outerRadius={100}
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
                                  <p className="text-sm text-muted-foreground">
                                    {data.tracks.length} tracks
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Genre List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Genres Ranked
              </CardTitle>
              <CardDescription>
                Genres ranked by artist count and track coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[350px]">
                <div className="space-y-3">
                  {genreAnalysis.genres.slice(0, 12).map((genre, index) => (
                    <div 
                      key={genre.name}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer hover:bg-accent/5",
                        selectedGenre === genre.name ? 'bg-accent/10 border border-accent/20' : 'bg-muted/20'
                      )}
                      onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                    >
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{genre.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {genre.percentage}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{genre.artists.length} artists</span>
                          <span>{genre.tracks.length} tracks</span>
                          <span>Pop: {genre.avgPopularity}/100</span>
                        </div>
                        <Progress value={genre.percentage} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {/* Fixed Genre Evolution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Genre Evolution Over Time</CardTitle>
              <CardDescription>
                How your top genre preferences have evolved (simulated trends)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px]">
                  <ChartContainer config={{}} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={genreEvolution}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-muted-foreground" />
                        <YAxis className="text-muted-foreground" />
                        <ChartTooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium mb-2">{label}</p>
                                  {payload.map((entry, index) => (
                                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                                      {entry.dataKey}: {entry.value} artists
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {genreAnalysis.genres.slice(0, 6).map((genre, index) => (
                          <Area
                            key={genre.name}
                            type="monotone"
                            dataKey={genre.name}
                            stackId="1"
                            stroke={chartColors[index % chartColors.length]}
                            fill={chartColors[index % chartColors.length]}
                            fillOpacity={0.3}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fixed Artist Count by Genre */}
          <Card>
            <CardHeader>
              <CardTitle>Artist Distribution by Genre</CardTitle>
              <CardDescription>
                Number of artists per genre in your listening data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
                  <ChartContainer config={{}} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={genreAnalysis.genres.slice(0, 12)} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-muted-foreground" />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          className="text-muted-foreground" 
                          width={120}
                          interval={0}
                        />
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
                                  <p className="text-sm text-muted-foreground">
                                    {data.tracks.length} tracks covered
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Avg popularity: {data.avgPopularity}/100
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="hsl(var(--accent))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Genre Detail */}
      {selectedGenreData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Genre Spotlight: {selectedGenreData.name}
            </CardTitle>
            <CardDescription>
              Detailed analysis of your {selectedGenreData.name} listening
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Key Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Share of listening:</span>
                    <span className="font-medium text-accent">{selectedGenreData.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Artists discovered:</span>
                    <span className="font-medium">{selectedGenreData.artists.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tracks played:</span>
                    <span className="font-medium">{selectedGenreData.tracks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average popularity:</span>
                    <span className="font-medium">{selectedGenreData.avgPopularity}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Genre score:</span>
                    <span className="font-medium text-primary">{selectedGenreData.score}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Top Artists</h4>
                <div className="space-y-1">
                  {selectedGenreData.artists.slice(0, 8).map((artist, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="text-muted-foreground">{artist}</span>
                    </div>
                  ))}
                  {selectedGenreData.artists.length > 8 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      +{selectedGenreData.artists.length - 8} more artists
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Popular Tracks</h4>
                <div className="space-y-1">
                  {selectedGenreData.tracks.slice(0, 8).map((track, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="text-muted-foreground truncate">{track}</span>
                    </div>
                  ))}
                  {selectedGenreData.tracks.length > 8 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      +{selectedGenreData.tracks.length - 8} more tracks
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
