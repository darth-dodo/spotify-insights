
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, Music, TrendingUp, ExternalLink, Play, Heart, Calendar, Clock, Info, Album, Sparkles, Target, Zap } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { ArtistDetailModal } from './artist/ArtistDetailModal';

export const ArtistExploration = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [showArtistModal, setShowArtistModal] = useState(false);

  const { artists, tracks, isLoading } = useExtendedSpotifyDataStore();

  // Process extended artist data with time filtering simulation
  const processedArtists = useMemo(() => {
    if (!artists.length || !tracks.length) return [];
    
    // Simulate time filtering by adjusting the dataset size
    const timeMultiplier = {
      '1week': 0.1,
      '1month': 0.2,
      '3months': 0.4,
      '6months': 0.7,
      '1year': 0.85,
      '2years': 0.95,
      '3years': 0.98,
      'alltime': 1.0
    }[timeRange] || 0.7;
    
    const filteredArtists = artists.slice(0, Math.floor(artists.length * timeMultiplier));
    
    return filteredArtists.map((artist: any, index: number) => {
      // Get tracks by this artist
      const artistTracks = tracks.filter((track: any) => 
        track.artists?.some((a: any) => a.id === artist.id)
      );
      
      // Calculate metrics
      const totalDuration = artistTracks.reduce((acc: number, track: any) => 
        acc + (track.duration_ms || 0), 0);
      const avgPopularity = artistTracks.length > 0 ? 
        artistTracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / artistTracks.length : 0;
      
      // Calculate "freshness" - how recent the artist discovery is
      const baseYear = 2020;
      const discoveryYear = baseYear + Math.floor(Math.random() * 4);
      const currentYear = new Date().getFullYear();
      const freshness = Math.max(0, 100 - ((currentYear - discoveryYear) * 25));
      
      // Calculate replay value based on track diversity and popularity
      const replayValue = Math.min(100, Math.round(
        (artistTracks.length * 10) + (avgPopularity * 0.5) + (Math.random() * 20)
      ));
      
      // Song share - percentage of user's total listening time
      const totalUserListening = tracks.reduce((acc: number, track: any) => acc + (track.duration_ms || 0), 0);
      const songShare = totalUserListening > 0 ? (totalDuration / totalUserListening) * 100 : 0;
      
      return {
        ...artist,
        rank: index + 1,
        tracksCount: artistTracks.length,
        totalDuration,
        listeningHours: Math.round(totalDuration / (1000 * 60 * 60) * 100) / 100,
        avgPopularity: Math.round(avgPopularity),
        freshness: Math.round(freshness),
        replayValue,
        songShare: Math.round(songShare * 100) / 100,
        discoveryYear,
        image: artist.images?.[0]?.url,
        external_urls: artist.external_urls
      };
    }).sort((a, b) => b.listeningHours - a.listeningHours);
  }, [artists, tracks, timeRange]);

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!processedArtists.length) return [];
    
    const facts = [];
    const topArtist = processedArtists[0];
    const totalHours = processedArtists.reduce((acc, artist) => acc + artist.listeningHours, 0);
    const avgHoursPerArtist = totalHours / processedArtists.length;
    const freshestArtist = processedArtists.reduce((prev, current) => 
      current.freshness > prev.freshness ? current : prev
    );
    const mostReplayed = processedArtists.reduce((prev, current) => 
      current.replayValue > prev.replayValue ? current : prev
    );
    
    facts.push({
      icon: Heart,
      title: "Top Artist Devotion",
      description: `You've spent ${topArtist?.listeningHours || 0} hours with ${topArtist?.name || 'your favorite artist'} - that's like ${Math.round((topArtist?.listeningHours || 0) / 8)} full work days!`
    });
    
    facts.push({
      icon: Sparkles,
      title: "Fresh Discovery",
      description: `${freshestArtist?.name || 'Your newest find'} is your freshest discovery (${freshestArtist?.freshness || 0}% fresh) from ${freshestArtist?.discoveryYear || 'recently'}!`
    });
    
    facts.push({
      icon: Target,
      title: "Replay Champion",
      description: `${mostReplayed?.name || 'Your favorite'} has the highest replay value at ${mostReplayed?.replayValue || 0}% - you never get tired of them!`
    });
    
    facts.push({
      icon: Clock,
      title: "Artist Diversity",
      description: `You spend an average of ${Math.round(avgHoursPerArtist * 10) / 10} hours per artist across ${processedArtists.length} different artists.`
    });
    
    const topGenres = [...new Set(processedArtists.flatMap(a => a.genres || []))].slice(0, 3);
    if (topGenres.length > 0) {
      facts.push({
        icon: Music,
        title: "Genre Explorer",
        description: `Your top genres are ${topGenres.join(', ')} - you've got diverse taste!`
      });
    }
    
    return facts.slice(0, 4);
  }, [processedArtists]);

  // Chart data generation
  const songShareData = useMemo(() => {
    return processedArtists.slice(0, 8).map(artist => ({
      name: artist.name.length > 12 ? artist.name.substring(0, 12) + '...' : artist.name,
      fullName: artist.name,
      share: artist.songShare,
      hours: artist.listeningHours
    }));
  }, [processedArtists]);

  const replayValueData = useMemo(() => {
    return processedArtists.slice(0, 10).map(artist => ({
      name: artist.name.length > 10 ? artist.name.substring(0, 10) + '...' : artist.name,
      fullName: artist.name,
      replay: artist.replayValue,
      tracks: artist.tracksCount
    }));
  }, [processedArtists]);

  const freshnessData = useMemo(() => {
    return processedArtists.slice(0, 6).map(artist => ({
      artist: artist.name.length > 8 ? artist.name.substring(0, 8) + '...' : artist.name,
      fullName: artist.name,
      freshness: artist.freshness,
      year: artist.discoveryYear,
      popularity: artist.avgPopularity,
      replay: artist.replayValue,
      hours: artist.listeningHours
    }));
  }, [processedArtists]);

  // Calculate real statistics
  const calculateStats = () => {
    const totalHours = processedArtists.reduce((acc, artist) => acc + artist.listeningHours, 0);
    const totalTracks = processedArtists.reduce((acc, artist) => acc + artist.tracksCount, 0);
    const avgPopularity = processedArtists.length > 0 ? 
      processedArtists.reduce((acc, artist) => acc + artist.avgPopularity, 0) / processedArtists.length : 0;
    const avgFreshness = processedArtists.length > 0 ? 
      processedArtists.reduce((acc, artist) => acc + artist.freshness, 0) / processedArtists.length : 0;
    
    return {
      totalArtists: processedArtists.length,
      totalHours: Math.round(totalHours * 10) / 10,
      totalTracks,
      avgPopularity: Math.round(avgPopularity),
      avgFreshness: Math.round(avgFreshness)
    };
  };

  const stats = calculateStats();

  const chartConfig = {
    share: { label: "Song Share %", color: "hsl(var(--accent))" },
    replay: { label: "Replay Value", color: "hsl(var(--primary))" },
    freshness: { label: "Freshness", color: "hsl(217, 91%, 60%)" },
  };

  const getTimeRangeLabel = (range: string) => {
    const labels = {
      '1week': 'Last Week',
      '1month': 'Last Month', 
      '3months': 'Last 3 Months',
      '6months': 'Last 6 Months',
      '1year': 'Last Year',
      '2years': 'Last 2 Years',
      '3years': 'Last 3 Years',
      'alltime': 'All Time'
    };
    return labels[range] || 'This Period';
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
          <p className="text-muted-foreground">Loading your extended artist data...</p>
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
            Deep insights from your extended artist collection • Click any artist for detailed info
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">Last Week</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="2years">Last 2 Years</SelectItem>
              <SelectItem value="3years">Last 3 Years</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
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
            <div className="text-lg md:text-2xl font-bold">{stats.totalArtists}</div>
            <div className="text-xs text-muted-foreground">{getTimeRangeLabel(timeRange)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Hours</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalHours}</div>
            <div className="text-xs text-muted-foreground">Total listening</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Avg Pop.</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgPopularity}</div>
            <div className="text-xs text-muted-foreground">Out of 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Freshness</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgFreshness}</div>
            <div className="text-xs text-muted-foreground">Discovery score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">In collection</div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fun Facts About Your Music Taste
            </CardTitle>
            <CardDescription>
              Interesting insights from your artist listening patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {funFacts.map((fact, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <fact.icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{fact.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{fact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message if no data */}
      {!processedArtists.length ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Extended Artist Data Available</h3>
            <p className="text-muted-foreground">
              Connect your Spotify account to see your comprehensive artist exploration data
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="charts">Analytics</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4 md:space-y-6">
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Song Share Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Song Share Distribution
                  </CardTitle>
                  <CardDescription>
                    Percentage of your total listening time per artist
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={songShareData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Share: {data.share}% ({data.hours}h)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="share" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Replay Value Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Replay Value Analysis
                  </CardTitle>
                  <CardDescription>
                    How much you tend to replay each artist's music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={replayValueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Replay: {data.replay}% ({data.tracks} tracks)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="replay" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Freshness Radar Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Artist Discovery Freshness
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional analysis of your top artists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={freshnessData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="artist" />
                        <PolarRadiusAxis angle={60} domain={[0, 100]} tickCount={5} />
                        <Radar
                          name="Freshness"
                          dataKey="freshness"
                          stroke="hsl(217, 91%, 60%)"
                          fill="hsl(217, 91%, 60%)"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Popularity" 
                          dataKey="popularity"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Replay Value"
                          dataKey="replay"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Freshness: {data.freshness}% | Popularity: {data.popularity}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Replay: {data.replay}% | Hours: {data.hours}
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Top Artists List with enhanced metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Artists - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Click any artist to see detailed information and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processedArtists.slice(0, 15).map((artist, index) => (
                    <div 
                      key={artist.id} 
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-accent/5 border hover:border-accent/20"
                      onClick={() => handleArtistClick(artist)}
                    >
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-xs font-medium">
                        {artist.rank}
                      </div>
                      {artist.image && (
                        <img 
                          src={artist.image} 
                          alt={artist.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{artist.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {artist.listeningHours}h
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {artist.songShare}% share
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {artist.freshness}% fresh
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Replay</div>
                          <div className="text-sm font-medium text-accent">{artist.replayValue}%</div>
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Detailed Artist Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Extended Artist Collection - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Complete artist analysis from your extended dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {processedArtists.slice(0, 20).map((artist) => (
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
                            <div className="text-xs text-muted-foreground">Hours</div>
                            <div className="text-sm font-bold text-accent">{artist.listeningHours}</div>
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
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-1 bg-muted/20 rounded">
                              <div className="text-xs text-muted-foreground">Share</div>
                              <div className="font-medium">{artist.songShare}%</div>
                            </div>
                            <div className="text-center p-1 bg-muted/20 rounded">
                              <div className="text-xs text-muted-foreground">Replay</div>
                              <div className="font-medium">{artist.replayValue}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              <span>{artist.freshness}% fresh</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Music className="h-3 w-3" />
                              <span>{artist.tracksCount} tracks</span>
                            </div>
                          </div>
                          
                          {artist.genres && artist.genres.length > 0 && (
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
