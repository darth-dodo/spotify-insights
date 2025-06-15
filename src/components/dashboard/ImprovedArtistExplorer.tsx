
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Music, Clock, Star, Info, Play, Album, Calendar } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { cn } from '@/lib/utils';

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

interface LongPressableCardProps {
  children: React.ReactNode;
  onLongPress: () => void;
  className?: string;
}

const LongPressableCard = ({ children, onLongPress, className }: LongPressableCardProps) => {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      onLongPress();
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {children}
      <div className="absolute top-2 right-2 opacity-30">
        <Info className="h-4 w-4" />
      </div>
    </div>
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

      return {
        ...artist,
        rank: index + 1,
        tracksCount: artistTracks.length,
        averagePopularity: Math.round(artistTracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / artistTracks.length) || 0,
        uniqueStyle,
        genres: uniqueGenres,
        topTracks: artistTracks.slice(0, 5),
        // Mock discography data - in real app this would come from additional API calls
        albums: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, (_, i) => ({
          id: `album-${i}`,
          name: `Album ${i + 1}`,
          release_date: `${2020 - i}-01-01`,
          total_tracks: Math.floor(Math.random() * 15) + 8
        }))
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

  const showExplanation = (title: string, content: string) => {
    setExplanationModal({ open: true, title, content });
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <LongPressableCard
          onLongPress={() => showExplanation(
            "Total Artists",
            "The number of unique artists in your top listening data for the selected time period."
          )}
        >
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                <span className="text-xs md:text-sm font-medium">Artists</span>
              </div>
              <div className="text-lg md:text-2xl font-bold">{artistAnalysis.length}</div>
              <div className="text-xs text-muted-foreground">discovered</div>
            </CardContent>
          </Card>
        </LongPressableCard>

        <LongPressableCard
          onLongPress={() => showExplanation(
            "Average Popularity",
            "The average popularity score (0-100) of your top artists. Higher scores indicate more mainstream artists."
          )}
        >
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium">Avg Popularity</span>
              </div>
              <div className="text-lg md:text-2xl font-bold">
                {Math.round(artistAnalysis.reduce((acc, artist) => acc + (artist.popularity || 0), 0) / artistAnalysis.length) || 0}
              </div>
              <div className="text-xs text-muted-foreground">out of 100</div>
            </CardContent>
          </Card>
        </LongPressableCard>

        <LongPressableCard
          onLongPress={() => showExplanation(
            "Unique Style Score",
            "A calculated score (0-100) based on genre diversity and artist obscurity. Higher scores indicate more unique musical taste."
          )}
        >
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium">Unique Style</span>
              </div>
              <div className="text-lg md:text-2xl font-bold">
                {Math.round(artistAnalysis.reduce((acc, artist) => acc + artist.uniqueStyle, 0) / artistAnalysis.length) || 0}
              </div>
              <div className="text-xs text-muted-foreground">style score</div>
            </CardContent>
          </Card>
        </LongPressableCard>

        <LongPressableCard
          onLongPress={() => showExplanation(
            "Time Period",
            "The selected time range for analysis: Last 4 Weeks shows recent trends, Last 6 Months shows medium-term preferences, All Time shows long-term favorites."
          )}
        >
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
        </LongPressableCard>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
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
                Long press any artist card to learn more about the metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {artistAnalysis.slice(0, 12).map((artist) => (
                  <LongPressableCard
                    key={artist.id}
                    onLongPress={() => showExplanation(
                      `${artist.name} - Metrics Explained`,
                      `Popularity: ${artist.popularity}/100 (Spotify's popularity metric)\nUnique Style: ${artist.uniqueStyle}/100 (Based on genre diversity and obscurity)\nTracks in Top 50: ${artist.tracksCount}\nGenres: ${artist.genres.slice(0, 3).join(', ')}${artist.genres.length > 3 ? '...' : ''}`
                    )}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
                              <span>{artist.popularity}/100</span>
                            </div>
                            <Progress value={artist.popularity} className="h-1" />
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              <span>{artist.tracksCount} tracks</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Album className="h-3 w-3" />
                              <span>{artist.albums.length} albums</span>
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
                  </LongPressableCard>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4 md:space-y-6">
          {/* Mobile-friendly charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Popularity vs Unique Style</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Artist positioning by mainstream appeal vs uniqueness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[300px]">
                    <ChartContainer config={{}} className="h-[250px] md:h-[300px]">
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
                                      Unique Style: {data.uniqueStyle}/100
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

            <Card>
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Track Count Distribution</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Number of tracks per artist in your top 50
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[300px]">
                    <ChartContainer config={{}} className="h-[250px] md:h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
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
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="tracks" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Artist Analysis</CardTitle>
              <CardDescription>
                Complete breakdown of all artists with discography information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] md:h-[500px]">
                <div className="space-y-3">
                  {artistAnalysis.map((artist) => (
                    <Card key={artist.id} className="border-l-4 border-l-accent/30">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">#{artist.rank}</Badge>
                              <h3 className="font-semibold">{artist.name}</h3>
                              <Badge variant="secondary">{artist.uniqueStyle}/100</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                              <div>
                                <span className="text-muted-foreground">Popularity</span>
                                <div className="font-medium">{artist.popularity}/100</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Top Tracks</span>
                                <div className="font-medium">{artist.tracksCount}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Albums</span>
                                <div className="font-medium">{artist.albums.length}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Genres</span>
                                <div className="font-medium">{artist.genres.length}</div>
                              </div>
                            </div>
                            
                            {artist.genres.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {artist.genres.map((genre) => (
                                  <Badge key={genre} variant="outline" className="text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedArtist(artist)}
                            className="flex-shrink-0"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Artist Detail Modal */}
      {selectedArtist && (
        <Dialog open={!!selectedArtist} onOpenChange={() => setSelectedArtist(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedArtist.name}
              </DialogTitle>
              <DialogDescription>
                Complete artist analysis and discography
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{selectedArtist.popularity}</div>
                  <div className="text-xs text-muted-foreground">Popularity</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedArtist.uniqueStyle}</div>
                  <div className="text-xs text-muted-foreground">Unique Style</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{selectedArtist.tracksCount}</div>
                  <div className="text-xs text-muted-foreground">Top Tracks</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold">{selectedArtist.albums.length}</div>
                  <div className="text-xs text-muted-foreground">Albums</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Album className="h-4 w-4" />
                  Discography
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedArtist.albums.map((album: any) => (
                    <div key={album.id} className="p-2 bg-muted/20 rounded border">
                      <div className="font-medium text-sm">{album.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(album.release_date).getFullYear()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Music className="h-3 w-3" />
                          {album.total_tracks} tracks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedArtist.topTracks.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Your Top Tracks
                  </h4>
                  <div className="space-y-1">
                    {selectedArtist.topTracks.map((track: any, index: number) => (
                      <div key={track.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded text-sm">
                        <Badge variant="outline" className="text-xs w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="flex-1 truncate">{track.name}</span>
                        <span className="text-xs text-muted-foreground">{track.popularity}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ExplanationModal 
        isOpen={explanationModal.open}
        onClose={() => setExplanationModal({ ...explanationModal, open: false })}
        title={explanationModal.title}
        content={explanationModal.content}
      />
    </div>
  );
};
