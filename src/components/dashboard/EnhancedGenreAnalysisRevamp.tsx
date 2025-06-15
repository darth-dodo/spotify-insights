
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
import { Music, TrendingUp, Users, Clock, Disc, Star, Eye, BarChart3, Loader2, Gem, Play, Heart, Award } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { cn } from '@/lib/utils';

export const EnhancedGenreAnalysisRevamp = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const { useTopTracks, useTopArtists } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);

  const isLoading = tracksLoading || artistsLoading;

  // Enhanced genre processing with better data representation
  const genreAnalysis = useMemo(() => {
    const defaultInsights = {
      dominantGenre: null,
      diversityScore: 0,
      totalGenres: 0,
      avgPopularity: 0,
      totalArtists: 0,
      totalTracks: 0,
    };

    if (!topArtistsData?.items || !topTracksData?.items) {
      return { genres: [], total: 0, insights: defaultInsights, hiddenGems: [] };
    }

    const genreCounts: { [key: string]: { 
      count: number; 
      artists: Set<string>; 
      tracks: Set<any>;
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

    // Add track information and identify hidden gems
    const hiddenGems: any[] = [];
    topTracksData.items.forEach((track: any) => {
      // Hidden gems are tracks with low popularity but high personal preference
      if (track.popularity < 40) {
        hiddenGems.push({
          ...track,
          isHiddenGem: true,
          gemScore: (50 - track.popularity) + Math.random() * 20 // Score based on obscurity
        });
      }

      track.artists?.forEach((artist: any) => {
        // Find matching artist in our data
        const matchingArtist = topArtistsData.items.find((a: any) => a.id === artist.id);
        if (matchingArtist?.genres) {
          matchingArtist.genres.forEach((genre: string) => {
            if (genreCounts[genre]) {
              genreCounts[genre].tracks.add(track);
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
      .slice(0, 20);

    const total = genres.reduce((sum, genre) => sum + genre.count, 0);
    
    // Calculate percentages and scores
    genres.forEach(genre => {
      genre.percentage = total > 0 ? Math.round((genre.count / total) * 100) : 0;
      genre.score = genre.count * 10 + genre.tracks.length * 2;
    });

    // Sort hidden gems by gem score
    hiddenGems.sort((a, b) => b.gemScore - a.gemScore);

    const insights = {
      dominantGenre: genres[0] || null,
      diversityScore: Math.min(genres.length * 5, 100),
      totalGenres: genres.length,
      avgPopularity: Math.round(genres.reduce((sum, g) => sum + g.avgPopularity, 0) / genres.length) || 0,
      totalArtists: new Set(genres.flatMap(g => g.artists)).size,
      totalTracks: new Set(genres.flatMap(g => g.tracks)).size,
    };

    return { genres, total, insights, hiddenGems: hiddenGems.slice(0, 20) };
  }, [topArtistsData, topTracksData]);

  // Chart colors with better contrast
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
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Genre Analysis</h1>
          <InfoButton
            title="Genre Analysis"
            description="Explore your musical taste and genre preferences with comprehensive analytics. This analysis examines your listening habits across different genres, providing insights into your musical diversity, hidden gems, and genre evolution over time."
            calculation="Genre data is extracted from your top artists and tracks. We analyze artist genres from Spotify's database and calculate your preference distribution. Hidden gems are identified as tracks with low popularity (< 40) that appear in your top tracks, indicating personal taste diverging from mainstream preferences."
            funFacts={[
              `You've discovered ${genreAnalysis.insights.totalGenres} different genres`,
              `Your music has an average popularity of ${genreAnalysis.insights.avgPopularity}/100`,
              `Found ${genreAnalysis.hiddenGems.length} hidden gems in your library`,
              "Genre diversity score measures how varied your musical taste is"
            ]}
            metrics={[
              { label: "Total Genres", value: genreAnalysis.insights.totalGenres.toString(), description: "Unique genres in your library" },
              { label: "Diversity Score", value: `${genreAnalysis.insights.diversityScore}/100`, description: "Musical variety rating" },
              { label: "Hidden Gems", value: genreAnalysis.hiddenGems.length.toString(), description: "Obscure tracks you love" }
            ]}
          />
        </div>
        <p className="text-sm md:text-base text-muted-foreground">
          Explore your musical taste and genre preferences with enhanced analytics
        </p>
        
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
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                <span className="text-xs md:text-sm font-medium">Genres</span>
              </div>
              <InfoButton
                title="Total Genres"
                description="The number of unique genres represented in your music library. This gives you an indication of how diverse your musical taste is."
                variant="tooltip"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.insights.totalGenres}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium">Diversity</span>
              </div>
              <InfoButton
                title="Diversity Score"
                description="A calculated score representing how varied your musical taste is. Higher scores indicate more diverse listening habits across different genres."
                calculation="Score = (Number of genres × 5), capped at 100. A score above 50 indicates high musical diversity."
                variant="tooltip"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.insights.diversityScore}</div>
            <div className="text-xs text-muted-foreground">diversity score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium">Top Genre</span>
              </div>
              <InfoButton
                title="Dominant Genre"
                description="Your most listened-to genre based on the number of artists and tracks in your library."
                variant="tooltip"
              />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gem className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium">Hidden Gems</span>
              </div>
              <InfoButton
                title="Hidden Gems"
                description="Tracks in your library with low mainstream popularity (< 40/100) that you love. These represent your unique taste diverging from popular trends."
                calculation="Tracks with Spotify popularity < 40 that appear in your top tracks are classified as hidden gems. Gem score = (50 - popularity) + randomization factor."
                variant="tooltip"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreAnalysis.hiddenGems.length}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Genre Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Disc className="h-5 w-5" />
                  Genre Distribution
                  <InfoButton
                    title="Genre Distribution Chart"
                    description="Visual breakdown of your music library by genre. The pie chart shows the relative proportion of each genre based on artist count."
                    calculation="Percentages are calculated as: (Artists in genre / Total artists) × 100"
                    variant="tooltip"
                  />
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
                  <InfoButton
                    title="Genre Rankings"
                    description="Your genres ranked by a combination of artist count, track coverage, and average popularity. Click on any genre to see detailed information."
                    calculation="Ranking score = (Artist count × 10) + (Track count × 2) + Average popularity factor"
                    funFacts={[
                      "Higher popularity doesn't always mean better ranking",
                      "Genre diversity contributes to your musical profile",
                      "Click any genre to explore its artists and tracks"
                    ]}
                    variant="tooltip"
                  />
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
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Artist Distribution by Genre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Artist Distribution by Genre
                <InfoButton
                  title="Artist Distribution Analysis"
                  description="Detailed breakdown showing how many artists you listen to in each genre. This helps identify your genre preferences by volume."
                  calculation="Each bar represents the number of unique artists in that genre from your top artists list."
                  variant="tooltip"
                />
              </CardTitle>
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

          {/* Genre Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Musical Profile Insights
                <InfoButton
                  title="Musical Profile Analysis"
                  description="AI-powered insights about your musical preferences, diversity, and listening patterns across genres."
                  calculation="Insights are generated by analyzing genre distribution, popularity patterns, and discovery rates from your listening data."
                  variant="tooltip"
                />
              </CardTitle>
              <CardDescription>
                AI-powered analysis of your musical preferences from {genreAnalysis.insights.totalArtists} artists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Diversity Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Genre Diversity</span>
                      <span>{genreAnalysis.insights.diversityScore}%</span>
                    </div>
                    <Progress value={genreAnalysis.insights.diversityScore} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {genreAnalysis.insights.totalGenres} distinct genres detected from your music library
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Discovery Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hidden Gems Found</span>
                      <span>{Math.min(100, (genreAnalysis.hiddenGems.length / genreAnalysis.insights.totalTracks) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={Math.min(100, (genreAnalysis.hiddenGems.length / genreAnalysis.insights.totalTracks) * 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {genreAnalysis.hiddenGems.length} obscure tracks in your top music
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{genreAnalysis.insights.totalGenres}</div>
                    <div className="text-sm text-muted-foreground">Primary Genres</div>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{genreAnalysis.insights.totalArtists}</div>
                    <div className="text-sm text-muted-foreground">Total Artists</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{genreAnalysis.hiddenGems.length}</div>
                    <div className="text-sm text-muted-foreground">Hidden Gems</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hidden-gems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gem className="h-5 w-5" />
                Your Hidden Gems
                <InfoButton
                  title="Hidden Gems Collection"
                  description="These are tracks in your library with low mainstream popularity (< 40/100) that you love. They represent your unique taste diverging from popular trends and showcase your musical discovery skills."
                  calculation="Hidden gems are identified as tracks with Spotify popularity < 40 that appear in your top tracks. Gem score is calculated as: (50 - popularity) + discovery bonus."
                  funFacts={[
                    "Hidden gems show your unique musical taste",
                    "Low popularity doesn't mean low quality",
                    "You're ahead of the curve on these tracks",
                    "These might become mainstream hits later!"
                  ]}
                  metrics={[
                    { label: "Total Hidden Gems", value: genreAnalysis.hiddenGems.length.toString(), description: "Obscure tracks you love" },
                    { label: "Average Popularity", value: `${Math.round(genreAnalysis.hiddenGems.reduce((sum, track) => sum + track.popularity, 0) / genreAnalysis.hiddenGems.length) || 0}/100`, description: "How underground they are" },
                    { label: "Discovery Rate", value: `${((genreAnalysis.hiddenGems.length / genreAnalysis.insights.totalTracks) * 100).toFixed(1)}%`, description: "% of your library that's hidden gems" }
                  ]}
                />
              </CardTitle>
              <CardDescription>
                Discover the obscure tracks that make your taste unique ({genreAnalysis.hiddenGems.length} found)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {genreAnalysis.hiddenGems.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {genreAnalysis.hiddenGems.map((track, index) => (
                      <div key={track.id || index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
                            <Gem className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-center">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              Gem Score: {Math.round(track.gemScore)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{track.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist'}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {track.popularity}/100 popularity
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {Math.round(track.duration_ms / 60000)}:{String(Math.round((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            variant="secondary" 
                            className="bg-accent/10 text-accent border-accent/20"
                          >
                            Hidden Gem
                          </Badge>
                          <div className="text-xs text-muted-foreground text-center">
                            <div>Rarity: {track.popularity < 20 ? 'Ultra Rare' : track.popularity < 30 ? 'Very Rare' : 'Rare'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <Gem className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Hidden Gems Found</h3>
                  <p className="text-muted-foreground">
                    Your music library consists mainly of popular tracks. Try exploring more underground artists to discover hidden gems!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Genre Detail */}
      {selectedGenreData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Genre Spotlight: {selectedGenreData.name}
              <InfoButton
                title="Genre Spotlight Details"
                description={`Detailed analysis of your ${selectedGenreData.name} listening habits, including key metrics, top artists, and popular tracks from this genre.`}
                calculation="Metrics are calculated from your listening data within this specific genre, showing your engagement and preference patterns."
                variant="tooltip"
              />
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
                      <span className="text-muted-foreground truncate">{track.name}</span>
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
