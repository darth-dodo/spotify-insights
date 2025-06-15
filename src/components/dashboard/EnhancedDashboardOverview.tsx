
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Music, Users, TrendingUp, Calendar, Clock, 
  Star, Target, Zap, Trophy, Headphones, 
  Heart, BarChart3, PieChart as PieChartIcon,
  Activity, Play, Shuffle, Volume2
} from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

export const EnhancedDashboardOverview = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('medium_term');

  const { useTopTracks, useTopArtists, useAudioFeatures } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(selectedTimeRange, 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(selectedTimeRange, 50);
  const { data: audioFeaturesData, isLoading: featuresLoading } = useAudioFeatures(
    topTracksData?.items?.slice(0, 50)?.map((track: any) => track.id) || []
  );

  const isLoading = tracksLoading || artistsLoading || featuresLoading;

  // Generate insights from Spotify data
  const generateInsights = () => {
    if (!topTracksData?.items || !topArtistsData?.items) {
      return {
        totalTracks: 0,
        totalArtists: 0,
        avgPopularity: 0,
        topGenres: [],
        listening_minutes: 0,
        discoveries: 0,
        diversity_score: 0,
        energy_level: 50
      };
    }

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;
    
    // Calculate metrics
    const totalTracks = tracks.length;
    const totalArtists = artists.length;
    const avgPopularity = Math.round(tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / totalTracks);
    
    // Extract and count genres
    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const genreCounts = allGenres.reduce((acc: any, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([genre]) => genre);

    // Estimate listening time (rough calculation)
    const avgTrackDuration = tracks.reduce((acc: number, track: any) => acc + (track.duration_ms || 0), 0) / tracks.length;
    const estimatedListeningMinutes = Math.round((avgTrackDuration / 1000 / 60) * totalTracks * 2); // Rough estimate

    // Calculate diversity score based on genre variety
    const diversityScore = Math.min(Math.round((Object.keys(genreCounts).length / totalArtists) * 100), 100);

    // Calculate discoveries (artists with lower popularity)
    const discoveries = artists.filter((artist: any) => (artist.popularity || 0) < 50).length;

    // Energy level from audio features
    const energyLevel = audioFeaturesData && audioFeaturesData.length > 0 
      ? Math.round(audioFeaturesData.reduce((acc: number, feature: any) => acc + (feature.energy || 0.5), 0) / audioFeaturesData.length * 100)
      : 65;

    return {
      totalTracks,
      totalArtists,
      avgPopularity,
      topGenres,
      listening_minutes: estimatedListeningMinutes,
      discoveries,
      diversity_score: diversityScore,
      energy_level: energyLevel
    };
  };

  const insights = generateInsights();

  // Generate chart data
  const generateChartData = () => {
    if (!topTracksData?.items) return [];
    
    const tracks = topTracksData.items.slice(0, 10);
    return tracks.map((track: any) => ({
      name: track.name.length > 15 ? track.name.substring(0, 15) + '...' : track.name,
      fullName: track.name,
      popularity: track.popularity || 0,
      artist: track.artists?.[0]?.name || 'Unknown'
    }));
  };

  const chartData = generateChartData();

  // Generate genre distribution data
  const generateGenreData = () => {
    if (!topArtistsData?.items) return [];
    
    const allGenres = topArtistsData.items.flatMap((artist: any) => artist.genres || []);
    const genreCounts = allGenres.reduce((acc: any, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 6)
      .map(([genre, count], index) => ({
        name: genre,
        value: count as number,
        color: colors[index % colors.length]
      }));
  };

  const genreData = generateGenreData();

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last Month';
      case 'medium_term': return 'Last Six Months';
      case 'long_term': return 'All Time';
      default: return 'This Period';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Loading your music insights...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Your comprehensive music listening insights and statistics
          </p>
        </div>
        
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short_term">Last Month</SelectItem>
            <SelectItem value="medium_term">Last Six Months</SelectItem>
            <SelectItem value="long_term">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Music className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Total Tracks</span>
              <InfoButton
                title="Total Tracks"
                description="The number of unique tracks in your top listening data for the selected time period."
                funFacts={[
                  "Your track count reflects your music exploration habits",
                  "Higher counts suggest diverse listening patterns",
                  "Track variety affects personalized recommendations"
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{insights.totalTracks}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Artists</span>
              <InfoButton
                title="Unique Artists"
                description="The number of different artists in your top listening data, indicating your musical diversity."
                calculation="Counted from your top tracks and artists lists for the selected time period."
                funFacts={[
                  "Most people follow 20-50 artists regularly",
                  "Higher artist counts indicate eclectic taste",
                  "Artist variety improves music discovery"
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{insights.totalArtists}</div>
            <div className="text-xs text-muted-foreground">unique</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">Avg Popularity</span>
              <InfoButton
                title="Average Popularity"
                description="The average popularity score (0-100) of your top tracks. Higher scores indicate more mainstream listening habits."
                calculation="Calculated from Spotify's popularity metric for each track in your top list, then averaged."
                funFacts={[
                  "Scores above 70 indicate mainstream taste",
                  "Scores below 50 suggest you discover underground music",
                  "Popularity changes as tracks gain/lose momentum"
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{insights.avgPopularity}</div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Est. Listening</span>
              <InfoButton
                title="Estimated Listening Time"
                description="Rough estimate of your total listening time based on track durations and frequency in your top lists."
                calculation="Based on average track duration multiplied by estimated play frequency for tracks in your top lists."
                funFacts={[
                  "Average person listens to 2-4 hours of music daily",
                  "This is a conservative estimate based on top tracks",
                  "Actual listening time is likely much higher"
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{insights.listening_minutes}</div>
            <div className="text-xs text-muted-foreground">minutes</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Top Tracks Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Tracks Popularity - {getTimeRangeLabel(selectedTimeRange)}
              </CardTitle>
              <CardDescription>
                Popularity scores of your most played tracks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      className="text-muted-foreground text-xs"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis className="text-muted-foreground text-xs" />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                              <p className="font-medium text-sm">{data.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                by {data.artist}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Popularity: {data.popularity}/100
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="popularity" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4" />
                  Music Diversity
                  <InfoButton
                    title="Music Diversity Score"
                    description="Measures how varied your music taste is based on genre spread and artist variety in your listening habits."
                    calculation="Based on the ratio of unique genres to total artists, scaled to 0-100. Higher scores indicate more eclectic taste."
                    funFacts={[
                      "Scores above 60 indicate very diverse taste",
                      "Genre variety is key to high diversity scores",
                      "Exploring new genres increases your score"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{insights.diversity_score}</div>
                  <Progress value={insights.diversity_score} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {insights.diversity_score > 70 ? 'Very Diverse' : 
                     insights.diversity_score > 50 ? 'Moderately Diverse' :
                     insights.diversity_score > 30 ? 'Somewhat Focused' : 'Focused Taste'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-4 w-4" />
                  Discoveries
                  <InfoButton
                    title="Music Discoveries"
                    description="Number of artists in your top list with lower popularity scores, indicating you discover less mainstream music."
                    calculation="Count of artists with popularity scores below 50 in your top artists list."
                    funFacts={[
                      "Underground artists often have scores below 50",
                      "Discovering new artists helps music diversity",
                      "Early supporters help artists grow their audience"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">{insights.discoveries}</div>
                  <p className="text-sm text-muted-foreground">underground artists</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insights.discoveries > 15 ? 'Great discoverer!' :
                     insights.discoveries > 8 ? 'Good explorer' :
                     insights.discoveries > 3 ? 'Some discoveries' : 'Try exploring more!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4" />
                  Energy Level
                  <InfoButton
                    title="Music Energy Level"
                    description="Average energy score of your top tracks based on Spotify's audio analysis. Higher scores indicate more energetic music preferences."
                    calculation="Calculated from Spotify's energy audio feature (0-1 scale) converted to percentage for your top tracks."
                    funFacts={[
                      "Energy measures intensity and power in music",
                      "Scores above 70 indicate high-energy preferences",
                      "Energy levels can reflect your activity patterns"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">{insights.energy_level}%</div>
                  <Progress value={insights.energy_level} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {insights.energy_level > 80 ? 'High Energy' :
                     insights.energy_level > 60 ? 'Moderate Energy' :
                     insights.energy_level > 40 ? 'Balanced' : 'Chill Vibes'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Top Genres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Your Top Genres - {getTimeRangeLabel(selectedTimeRange)}
              </CardTitle>
              <CardDescription>
                Most represented genres in your music library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.topGenres.slice(0, 8).map((genre, index) => (
                  <div key={genre} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <span className="font-medium capitalize">{genre.replace(/-/g, ' ')}</span>
                    </div>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                ))}
                {insights.topGenres.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No genre data available</p>
                    <p className="text-sm">Listen to more music to see your top genres</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Listening Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Listening Insights
                </CardTitle>
                <CardDescription>
                  Key findings about your music preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <h4 className="font-medium text-accent mb-2">Most Popular Track</h4>
                    <p className="text-sm text-muted-foreground">
                      {chartData[0]?.fullName || 'No data available'} 
                      {chartData[0] && ` (${chartData[0].popularity}/100)`}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">Genre Variety</h4>
                    <p className="text-sm text-muted-foreground">
                      You listen to {insights.topGenres.length} different genres regularly
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                    <h4 className="font-medium text-secondary mb-2">Discovery Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((insights.discoveries / insights.totalArtists) * 100)}% of your artists are underground discoveries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Music Profile
                </CardTitle>
                <CardDescription>
                  Your unique listening personality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {insights.diversity_score > 70 && insights.discoveries > 10 ? 'Music Explorer' :
                       insights.avgPopularity > 70 ? 'Mainstream Enthusiast' :
                       insights.energy_level > 75 ? 'High Energy Listener' :
                       insights.discoveries > 8 ? 'Underground Discoverer' : 'Focused Listener'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {insights.diversity_score > 70 && insights.discoveries > 10 ? 
                        'You love discovering new artists and genres' :
                       insights.avgPopularity > 70 ? 
                        'You enjoy popular hits and trending music' :
                       insights.energy_level > 75 ? 
                        'You prefer energetic and upbeat tracks' :
                       insights.discoveries > 8 ? 
                        'You have a talent for finding hidden gems' : 
                        'You have refined taste in specific genres'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {genreData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Genre Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of your music preferences by genre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium text-sm capitalize">{data.name.replace(/-/g, ' ')}</p>
                                <p className="text-xs text-muted-foreground">
                                  {data.value} artists
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
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {genreData.map((entry, index) => (
                    <Badge key={entry.name} variant="outline" className="text-xs">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.name.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Listening Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total unique tracks</span>
                    <span className="font-medium">{insights.totalTracks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total unique artists</span>
                    <span className="font-medium">{insights.totalArtists}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average popularity</span>
                    <span className="font-medium">{insights.avgPopularity}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated listening time</span>
                    <span className="font-medium">{insights.listening_minutes}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Music Characteristics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Energy Level</span>
                      <span className="text-sm font-medium">{insights.energy_level}%</span>
                    </div>
                    <Progress value={insights.energy_level} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Diversity Score</span>
                      <span className="text-sm font-medium">{insights.diversity_score}%</span>
                    </div>
                    <Progress value={insights.diversity_score} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Underground discoveries</span>
                    <span className="font-medium">{insights.discoveries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Genre variety</span>
                    <span className="font-medium">{insights.topGenres.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
