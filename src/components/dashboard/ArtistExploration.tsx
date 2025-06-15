
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Music, TrendingUp, ExternalLink, Play, Heart, Calendar, Clock, Info, Album } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { ArtistDetailModal } from './artist/ArtistDetailModal';

export const ArtistExploration = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [showArtistModal, setShowArtistModal] = useState(false);

  const { useTopArtists, useTopTracks } = useSpotifyData();
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);

  const isLoading = artistsLoading || tracksLoading;

  // Generate artist analytics from real data
  const generateArtistAnalytics = () => {
    if (!topArtistsData?.items?.length) return [];
    
    return topArtistsData.items.slice(0, 20).map((artist: any, index: number) => ({
      id: artist.id,
      name: artist.name,
      popularity: artist.popularity || 0,
      followers: artist.followers?.total || 0,
      genres: artist.genres || [],
      rank: index + 1,
      image: artist.images?.[0]?.url,
      external_urls: artist.external_urls
    }));
  };

  // Generate genre distribution from real data
  const generateGenreDistribution = () => {
    if (!topArtistsData?.items?.length) return [];
    
    const genreCounts: { [key: string]: number } = {};
    
    topArtistsData.items.forEach((artist: any) => {
      artist.genres?.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    return Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const artistAnalytics = generateArtistAnalytics();
  const genreDistribution = generateGenreDistribution();

  // Calculate real statistics from API data
  const calculateRealStats = () => {
    const artists = topArtistsData?.items || [];
    const tracks = topTracksData?.items || [];
    
    const avgPopularity = artists.length > 0 ? 
      Math.round(artists.reduce((acc: number, artist: any) => acc + (artist.popularity || 0), 0) / artists.length) : 0;
    
    const totalFollowers = artists.reduce((acc: number, artist: any) => acc + (artist.followers?.total || 0), 0);
    const avgFollowers = artists.length > 0 ? Math.round(totalFollowers / artists.length) : 0;
    
    return {
      totalArtists: artists.length,
      totalGenres: genreDistribution.length,
      avgPopularity,
      totalTracks: tracks.length,
      avgFollowers
    };
  };

  const realStats = calculateRealStats();

  const chartConfig = {
    popularity: { label: "Popularity", color: "hsl(var(--accent))" },
    count: { label: "Artists", color: "hsl(var(--accent))" },
  };

  const pieColors = [
    'hsl(var(--accent))',
    'hsl(var(--primary))',
    'hsl(217, 91%, 60%)',
    'hsl(262, 83%, 58%)',
    'hsl(330, 81%, 60%)',
    'hsl(25, 95%, 53%)',
    'hsl(142, 76%, 36%)',
    'hsl(221, 83%, 53%)'
  ];

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return 'This Period';
    }
  };

  const handleArtistClick = (artist: any) => {
    setSelectedArtist(artist);
    setShowArtistModal(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Exploration</h1>
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
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Exploration</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover insights about your favorite artists • Click any artist for detailed info
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{realStats.totalArtists}</div>
            <div className="text-xs text-muted-foreground">{getTimeRangeLabel(timeRange)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Genres</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{realStats.totalGenres}</div>
            <div className="text-xs text-muted-foreground">Unique styles</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Avg Pop.</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{realStats.avgPopularity}</div>
            <div className="text-xs text-muted-foreground">Out of 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{realStats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">In rotation</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Followers</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">
              {realStats.avgFollowers > 1000000 ? 
                `${(realStats.avgFollowers / 1000000).toFixed(1)}M` : 
                `${Math.round(realStats.avgFollowers / 1000)}K`}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </CardContent>
        </Card>
      </div>

      {/* Show message if no data */}
      {!topArtistsData?.items?.length ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Artist Data Available</h3>
            <p className="text-muted-foreground">
              Connect your Spotify account to see your artist exploration data
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Main Content Grid - Visual List Format */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Top Artists List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Artists - {getTimeRangeLabel(timeRange)}
                  </CardTitle>
                  <CardDescription>
                    Click any artist to see detailed information and top songs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {artistAnalytics.slice(0, 10).map((artist, index) => (
                      <div 
                        key={artist.id} 
                        className="flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-accent/5 border hover:border-accent/20"
                        onClick={() => handleArtistClick(artist)}
                      >
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium">
                          {artist.rank}
                        </div>
                        {artist.image && (
                          <img 
                            src={artist.image} 
                            alt={artist.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{artist.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {artist.popularity}% popularity
                            </p>
                            {artist.genres.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {artist.genres[0]}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Info className="h-3 w-3 text-muted-foreground" />
                          {artist.external_urls?.spotify && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(artist.external_urls.spotify, '_blank');
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Genre Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Genre Distribution</CardTitle>
                  <CardDescription>
                    Your musical taste breakdown by genre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {genreDistribution.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genreDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {genreDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <p>No genre data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Tiled Artist Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Artist Gallery - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Tap any artist card to explore their complete profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {artistAnalytics.slice(0, 12).map((artist) => (
                    <Card 
                      key={artist.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleArtistClick(artist)}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{artist.rank}
                          </Badge>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Popularity</div>
                            <div className="text-sm font-bold text-accent">{artist.popularity}</div>
                          </div>
                        </div>
                        
                        {artist.image && (
                          <div className="mb-3">
                            <img 
                              src={artist.image} 
                              alt={artist.name}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm truncate">{artist.name}</h3>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              <span>{artist.followers > 1000000 ? 
                                `${(artist.followers / 1000000).toFixed(1)}M` : 
                                `${Math.round(artist.followers / 1000)}K`} followers</span>
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

          <TabsContent value="charts" className="space-y-4 md:space-y-6">
            {/* Charts View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Artist Popularity</CardTitle>
                  <CardDescription>
                    Popularity scores of your top artists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={artistAnalytics.slice(0, 10).map(artist => ({
                        name: artist.name.length > 12 ? artist.name.substring(0, 12) + '...' : artist.name,
                        popularity: artist.popularity
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="popularity" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Follower Distribution</CardTitle>
                  <CardDescription>
                    Artist follower counts comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={artistAnalytics.slice(0, 10).map(artist => ({
                        name: artist.name.length > 12 ? artist.name.substring(0, 12) + '...' : artist.name,
                        followers: Math.round(artist.followers / 1000000)
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="followers" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Artist Detail Modal */}
      <ArtistDetailModal 
        artist={selectedArtist}
        isOpen={showArtistModal}
        onClose={() => {
          setShowArtistModal(false);
          setSelectedArtist(null);
        }}
      />
    </div>
  );
};
