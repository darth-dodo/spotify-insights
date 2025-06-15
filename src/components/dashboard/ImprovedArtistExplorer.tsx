
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Music, Clock, Star, Info, Play, Album, Calendar, Sparkles, Target } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { cn } from '@/lib/utils';
import { InfoButton } from '@/components/ui/InfoButton';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const ExplanationModal = ({ isOpen, onClose, title, content }: ExplanationModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-accent" />
          {title}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="text-sm leading-relaxed">
        {content}
      </DialogDescription>
    </DialogContent>
  </Dialog>
);

interface ArtistDetailDialogProps {
  artist: any;
  isOpen: boolean;
  onClose: () => void;
}

const ArtistDetailDialog = ({ artist, isOpen, onClose }: ArtistDetailDialogProps) => {
  if (!artist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {artist.name}
          </DialogTitle>
          <DialogDescription>
            Complete artist analysis from your listening data
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-1">
            {/* Artist Overview */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {artist.images?.[0] && (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover mx-auto sm:mx-0"
                />
              )}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-accent">{artist.popularity || 0}</div>
                    <div className="text-xs text-muted-foreground">Popularity</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold text-primary">{artist.uniqueStyle}</div>
                    <div className="text-xs text-muted-foreground">Unique Style</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold">{artist.tracksCount}</div>
                    <div className="text-xs text-muted-foreground">Top Tracks</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg sm:text-2xl font-bold">{artist.genres?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Genres</div>
                  </div>
                </div>
                
                {artist.genres && artist.genres.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-1">
                      {artist.genres.map((genre: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Top Tracks */}
            {artist.topTracks && artist.topTracks.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Your Top Tracks
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {artist.topTracks.map((track: any, index: number) => (
                    <div key={track.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded border text-sm">
                      <Badge variant="outline" className="text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <span className="flex-1 truncate">{track.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{track.popularity || 0}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export const ImprovedArtistExplorer = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [explanationModal, setExplanationModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: '',
    content: ''
  });

  const { useTopArtists, useTopTracks } = useSpotifyData();
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);

  const isLoading = artistsLoading || tracksLoading;

  const artistAnalysis = useMemo(() => {
    if (!topArtistsData?.items || !topTracksData?.items) return [];

    return topArtistsData.items.slice(0, 20).map((artist: any, index: number) => {
      const artistTracks = topTracksData.items.filter((track: any) => 
        track.artists?.some((a: any) => a.id === artist.id)
      );

      const genres = artist.genres || [];
      const uniqueGenres = [...new Set(genres)];
      
      // Calculate unique style score based on genre diversity and obscurity
      const genreScore = Math.min(uniqueGenres.length * 10, 100);
      const popularityInverse = 100 - (artist.popularity || 0);
      const uniqueStyle = Math.round((genreScore + popularityInverse) / 2);

      // Calculate play share
      const totalTracks = topTracksData.items.length;
      const playShare = totalTracks > 0 ? Math.round((artistTracks.length / totalTracks) * 100) : 0;

      return {
        ...artist,
        rank: index + 1,
        tracksCount: artistTracks.length,
        averagePopularity: Math.round(artistTracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / artistTracks.length) || 0,
        uniqueStyle,
        genres: uniqueGenres,
        topTracks: artistTracks.slice(0, 5),
        playShare
      };
    });
  }, [topArtistsData, topTracksData]);

  const chartData = useMemo(() => {
    return artistAnalysis.slice(0, 10).map(artist => ({
      name: artist.name.length > 12 ? artist.name.substring(0, 12) + '...' : artist.name,
      fullName: artist.name,
      popularity: artist.popularity || 0,
      uniqueStyle: artist.uniqueStyle,
      tracks: artist.tracksCount
    }));
  }, [artistAnalysis]);

  const pieChartData = useMemo(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    return artistAnalysis.slice(0, 8).map((artist, index) => ({
      name: artist.name,
      value: artist.playShare,
      color: colors[index % colors.length]
    }));
  }, [artistAnalysis]);

  const radarData = useMemo(() => {
    return artistAnalysis.slice(0, 6).map(artist => ({
      artist: artist.name.length > 8 ? artist.name.substring(0, 8) + '...' : artist.name,
      fullName: artist.name,
      popularity: artist.popularity || 0,
      uniqueStyle: artist.uniqueStyle,
      tracks: artist.tracksCount * 10, // Scale for better visualization
      playShare: artist.playShare
    }));
  }, [artistAnalysis]);

  const showExplanation = (title: string, content: string) => {
    setExplanationModal({ open: true, title, content });
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Explorer</h1>
          <p className="text-muted-foreground">Loading your artist data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Explorer</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover insights about your favorite artists and their musical characteristics
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short_term">Last Month</SelectItem>
            <SelectItem value="medium_term">Last Six Months</SelectItem>
            <SelectItem value="long_term">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
              <InfoButton
                title="Total Artists"
                description="The number of unique artists in your top listening data for the selected time period."
                funFacts={[
                  "Most people have 20-50 artists in their regular rotation",
                  "Having more artists indicates diverse music taste",
                  "Your artist count affects recommendation quality"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{artistAnalysis.length}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Avg Popularity</span>
              <InfoButton
                title="Average Popularity"
                description="The average popularity score (0-100) of your top artists. Higher scores indicate more mainstream artists."
                calculation="Calculated from Spotify's popularity metric for each artist in your top list, then averaged."
                funFacts={[
                  "Scores above 70 indicate mainstream taste",
                  "Scores below 50 suggest you discover underground artists",
                  "Popularity changes over time as artists gain/lose momentum"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">
              {Math.round(artistAnalysis.reduce((acc, artist) => acc + (artist.popularity || 0), 0) / artistAnalysis.length) || 0}
            </div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Unique Style</span>
              <InfoButton
                title="Unique Style Score"
                description="A calculated score (0-100) based on genre diversity and artist obscurity. Higher scores indicate more unique musical taste."
                calculation="Combines genre diversity (more genres = higher score) with artist popularity inverse (less popular artists = higher score)."
                funFacts={[
                  "Scores above 60 indicate very unique taste",
                  "Genre diversity is a key factor in uniqueness",
                  "Supporting underground artists increases your score"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">
              {Math.round(artistAnalysis.reduce((acc, artist) => acc + artist.uniqueStyle, 0) / artistAnalysis.length) || 0}
            </div>
            <div className="text-xs text-muted-foreground">style score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Period</span>
              <InfoButton
                title="Time Period"
                description="The selected time range for analysis: Last Month shows recent trends, Last Six Months shows medium-term preferences, All Time shows long-term favorites."
                funFacts={[
                  "Short-term data shows your current musical phase",
                  "Long-term data reveals your core musical identity",
                  "Medium-term gives the best balance of both"
                ]}
              />
            </div>
            <div className="text-sm md:text-base font-bold">
              {getTimeRangeLabel(timeRange)}
            </div>
            <div className="text-xs text-muted-foreground">time range</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          {/* Artist Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Artists - {getTimeRangeLabel(timeRange)}
              </CardTitle>
              <CardDescription>
                Tap any artist card to see detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {artistAnalysis.slice(0, 12).map((artist) => (
                  <Card 
                    key={artist.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedArtist(artist)}
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          #{artist.rank}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Style Score</div>
                          <div className="text-sm font-bold text-accent">{artist.uniqueStyle}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm truncate">{artist.name}</h3>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Popularity</span>
                            <span>{artist.popularity || 0}/100</span>
                          </div>
                          <Progress value={artist.popularity || 0} className="h-1" />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Music className="h-3 w-3" />
                            <span>{artist.tracksCount} tracks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>{artist.playShare}% share</span>
                          </div>
                        </div>
                        
                        {artist.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {artist.genres.slice(0, 2).map((genre) => (
                              <Badge key={genre} variant="secondary" className="text-xs px-1.5 py-0">
                                {genre}
                              </Badge>
                            ))}
                            {artist.genres.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                +{artist.genres.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Artist Analysis</CardTitle>
              <CardDescription>
                Complete breakdown of all artists with key metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {artistAnalysis.map((artist) => (
                  <Card 
                    key={artist.id} 
                    className="border-l-4 border-l-accent/30 cursor-pointer hover:bg-muted/5"
                    onClick={() => setSelectedArtist(artist)}
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">#{artist.rank}</Badge>
                          <h3 className="font-semibold flex-1 truncate">{artist.name}</h3>
                          <Badge variant="secondary">{artist.uniqueStyle}/100</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="text-center p-2 bg-muted/20 rounded">
                            <span className="text-muted-foreground block">Popularity</span>
                            <div className="font-medium">{artist.popularity || 0}/100</div>
                          </div>
                          <div className="text-center p-2 bg-muted/20 rounded">
                            <span className="text-muted-foreground block">Top Tracks</span>
                            <div className="font-medium">{artist.tracksCount}</div>
                          </div>
                          <div className="text-center p-2 bg-muted/20 rounded">
                            <span className="text-muted-foreground block">Play Share</span>
                            <div className="font-medium">{artist.playShare}%</div>
                          </div>
                          <div className="text-center p-2 bg-muted/20 rounded">
                            <span className="text-muted-foreground block">Genres</span>
                            <div className="font-medium">{artist.genres.length}</div>
                          </div>
                        </div>
                        
                        {artist.genres.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {artist.genres.slice(0, 4).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                            {artist.genres.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{artist.genres.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 md:space-y-6">
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Artist Play Share Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Artist Play Share Distribution</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Percentage of your top tracks by each artist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[300px]">
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={40}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                    <p className="font-medium text-sm">{data.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Play Share: {data.value}%
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

            {/* Popularity vs Tracks Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Popularity Distribution</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Artist positioning by mainstream appeal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[300px]">
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
                                      Popularity: {data.popularity}/100
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Tracks: {data.tracks}
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refined Radar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Multi-Dimensional Artist Analysis</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Comprehensive view of your top artists across different metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[400px]">
                    <ChartContainer config={{}} className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                          <PolarGrid gridType="polygon" className="stroke-muted" />
                          <PolarAngleAxis 
                            dataKey="artist" 
                            className="text-xs text-muted-foreground"
                            tick={{ fontSize: 12 }}
                          />
                          <PolarRadiusAxis 
                            angle={60} 
                            domain={[0, 100]} 
                            tickCount={6}
                            className="text-xs text-muted-foreground"
                            tick={{ fontSize: 10 }}
                          />
                          <Radar
                            name="Popularity"
                            dataKey="popularity"
                            stroke="hsl(var(--accent))"
                            fill="hsl(var(--accent))"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <Radar
                            name="Unique Style" 
                            dataKey="uniqueStyle"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <Radar
                            name="Play Share"
                            dataKey="playShare"
                            stroke="hsl(217, 91%, 60%)"
                            fill="hsl(217, 91%, 60%)"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <ChartTooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                    <p className="font-medium text-sm">{data.fullName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Popularity: {data.popularity}% | Style: {data.uniqueStyle}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Play Share: {data.playShare}%
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Artist Detail Dialog */}
      <ArtistDetailDialog 
        artist={selectedArtist}
        isOpen={!!selectedArtist}
        onClose={() => setSelectedArtist(null)}
      />

      <ExplanationModal 
        isOpen={explanationModal.open}
        onClose={() => setExplanationModal({ ...explanationModal, open: false })}
        title={explanationModal.title}
        content={explanationModal.content}
      />
    </div>
  );
};
