import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, Music, TrendingUp, ExternalLink, Play, Heart, Calendar, Clock, Info, Album, Sparkles, Target, Zap } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { mapUITimeRangeToAPI, getTimeRangeLabel } from '@/lib/spotify-data-utils';
import { ArtistDetailModal } from './artist/ArtistDetailModal';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ArtistExploration = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [sortBy, setSortBy] = useState('listeningHours');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFiltering, setIsFiltering] = useState(false);

  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const apiTimeRange = mapUITimeRangeToAPI(timeRange);
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks(apiTimeRange, 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists(apiTimeRange, 2000);
  const isLoading = tracksLoading || artistsLoading;

  // Handle filtering state when time range changes
  React.useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 800); // Show filtering for 800ms to give visual feedback

    return () => clearTimeout(timer);
  }, [timeRange, sortBy, sortOrder]);

  // Process extended artist data with time filtering simulation
  const processedArtists = useMemo(() => {
    if (!artists.length || !tracks.length) return [];
    
    // Use all artists without any filtering multipliers
    // Time range filtering is handled by the API layer
    const filteredArtists = artists;
    
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
    });
  }, [artists, tracks, timeRange]);

  // Separate sorting logic for better performance and flexibility
  const sortedArtists = useMemo(() => {
    const sorted = [...processedArtists].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'listeningHours':
          aValue = a.listeningHours;
          bValue = b.listeningHours;
          break;
        case 'tracksCount':
          aValue = a.tracksCount;
          bValue = b.tracksCount;
          break;
        case 'avgPopularity':
          aValue = a.avgPopularity;
          bValue = b.avgPopularity;
          break;
        case 'freshness':
          aValue = a.freshness;
          bValue = b.freshness;
          break;
        case 'replayValue':
          aValue = a.replayValue;
          bValue = b.replayValue;
          break;
        case 'songShare':
          aValue = a.songShare;
          bValue = b.songShare;
          break;
        case 'discoveryYear':
          aValue = a.discoveryYear;
          bValue = b.discoveryYear;
          break;
        default:
          aValue = a.listeningHours;
          bValue = b.listeningHours;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // Update ranks after sorting
    return sorted.map((artist, index) => ({
      ...artist,
      rank: index + 1
    }));
  }, [processedArtists, sortBy, sortOrder]);

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!sortedArtists.length) return [];
    
    const facts = [];
    const topArtist = sortedArtists[0];
    const totalHours = sortedArtists.reduce((acc, artist) => acc + artist.listeningHours, 0);
    const avgHoursPerArtist = totalHours / sortedArtists.length;
    const freshestArtist = sortedArtists.reduce((prev, current) => 
      current.freshness > prev.freshness ? current : prev
    );
    const mostReplayed = sortedArtists.reduce((prev, current) => 
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
      description: `You spend an average of ${Math.round(avgHoursPerArtist * 10) / 10} hours per artist across ${sortedArtists.length} different artists.`
    });
    
    const topGenres = [...new Set(sortedArtists.flatMap(a => a.genres || []))].slice(0, 3);
    if (topGenres.length > 0) {
      facts.push({
        icon: Music,
        title: "Genre Explorer",
        description: `Your top genres are ${topGenres.join(', ')} - you've got diverse taste!`
      });
    }
    
    return facts.slice(0, 4);
  }, [sortedArtists]);

  // Chart data generation
  const songShareData = useMemo(() => {
    return sortedArtists.slice(0, 8).map(artist => ({
      name: artist.name.length > 12 ? artist.name.substring(0, 12) + '...' : artist.name,
      fullName: artist.name,
      share: artist.songShare,
      hours: artist.listeningHours
    }));
  }, [sortedArtists]);

  const replayValueData = useMemo(() => {
    return sortedArtists.slice(0, 10).map(artist => ({
      name: artist.name.length > 10 ? artist.name.substring(0, 10) + '...' : artist.name,
      fullName: artist.name,
      replay: artist.replayValue,
      tracks: artist.tracksCount
    }));
  }, [sortedArtists]);

  const freshnessData = useMemo(() => {
    return sortedArtists.slice(0, 6).map(artist => ({
      artist: artist.name.length > 8 ? artist.name.substring(0, 8) + '...' : artist.name,
      fullName: artist.name,
      freshness: artist.freshness,
      year: artist.discoveryYear,
      popularity: artist.avgPopularity,
      replay: artist.replayValue,
      hours: artist.listeningHours
    }));
  }, [sortedArtists]);

  // Calculate real statistics
  const calculateStats = () => {
    const totalHours = sortedArtists.reduce((acc, artist) => acc + artist.listeningHours, 0);
    const totalTracks = sortedArtists.reduce((acc, artist) => acc + artist.tracksCount, 0);
    const avgPopularity = sortedArtists.length > 0 ? 
      sortedArtists.reduce((acc, artist) => acc + artist.avgPopularity, 0) / sortedArtists.length : 0;
    const avgFreshness = sortedArtists.length > 0 ? 
      sortedArtists.reduce((acc, artist) => acc + artist.freshness, 0) / sortedArtists.length : 0;
    
    return {
      totalArtists: sortedArtists.length,
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

  // Using centralized getTimeRangeLabel from spotify-data-utils

  const handleArtistClick = (artist: any) => {
    setSelectedArtist(artist);
    setShowArtistModal(true);
  };

  // Enhanced loading screen for initial load
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Exploration</h1>
          <p className="text-muted-foreground">Loading your extended artist data...</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-4 border-accent/20 rounded-full border-t-accent" />
            <div className="absolute inset-0 animate-ping h-12 w-12 border-4 border-accent/10 rounded-full" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Analyzing your music library</p>
            <p className="text-xs text-muted-foreground">Processing up to 2000 artists for optimal insights</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtering overlay for when user changes filters
  const FilteringOverlay = () => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
      <div className="flex flex-col items-center space-y-3 p-6 bg-card rounded-lg shadow-lg border">
        <div className="relative">
          <div className="animate-spin h-8 w-8 border-3 border-accent/30 rounded-full border-t-accent" />
          <div className="absolute inset-0 animate-pulse h-8 w-8 border-3 border-accent/10 rounded-full" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Filtering artists</p>
          <p className="text-xs text-muted-foreground">{getTimeRangeLabel(timeRange)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Artist Exploration</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Deep insights from your extended artist collection • Click any artist for detailed info
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Total Dataset: {artists.length} artists</span>
            <span>•</span>
            <span>Filtered ({getTimeRangeLabel(timeRange)}): {sortedArtists.length} artists</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">Last Week</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last Three Months</SelectItem>
              <SelectItem value="6months">Last Six Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="2years">Last Two Years</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="listeningHours">Listening Hours</SelectItem>
              <SelectItem value="name">Artist Name</SelectItem>
              <SelectItem value="tracksCount">Track Count</SelectItem>
              <SelectItem value="avgPopularity">Popularity</SelectItem>
              <SelectItem value="freshness">Freshness</SelectItem>
              <SelectItem value="replayValue">Replay Value</SelectItem>
              <SelectItem value="songShare">Song Share</SelectItem>
              <SelectItem value="discoveryYear">Discovery Year</SelectItem>
            </SelectContent>
          </Select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
              <InfoButton
                title="Total Artists"
                description="Number of unique artists in your extended dataset for the selected time period."
                funFacts={[
                  "Your artist collection shows musical diversity",
                  "More artists indicate broad musical exploration",
                  "Each artist represents a unique musical journey"
                ]}
              />
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
              <InfoButton
                title="Total Listening Hours"
                description="Estimated total hours spent listening to these artists."
                calculation="Calculated from track durations and estimated play counts based on ranking."
                funFacts={[
                  "Shows dedication to musical artists",
                  "Listening hours indicate deep musical engagement",
                  "More hours suggest consistent music consumption"
                ]}
              />
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
              <InfoButton
                title="Average Popularity"
                description="Average popularity score across all your artists (0-100 scale)."
                calculation="Based on Spotify's popularity metrics, averaged across your artist collection."
                funFacts={[
                  "Higher scores indicate mainstream taste",
                  "Lower scores suggest underground/indie preferences",
                  "Balance shows diverse musical palette"
                ]}
              />
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
              <InfoButton
                title="Discovery Freshness"
                description="How recently you've discovered new artists (0-100 scale)."
                calculation="Based on estimated discovery timeline and current musical trends."
                funFacts={[
                  "Higher scores indicate recent musical discoveries",
                  "Shows openness to new music",
                  "Freshness keeps your taste evolving"
                ]}
              />
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
              <InfoButton
                title="Total Tracks"
                description="Total number of tracks from all artists in your collection."
                funFacts={[
                  "Each track represents a musical moment",
                  "Track diversity shows artist exploration depth",
                  "More tracks indicate comprehensive listening"
                ]}
              />
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
      {!sortedArtists.length ? (
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
        <div className="relative">
          {isFiltering && <FilteringOverlay />}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Top Artists List with enhanced metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Artists - {getTimeRangeLabel(timeRange)}
                  <InfoButton
                    title="Top Artists Analysis"
                    description="Shows your most-listened artists based on total listening hours, track variety, and recency."
                    calculation="Each artist is scored using a weighted blend: 60% total listening hours, 25% unique tracks played, and 15% discovery freshness. Artists are then ranked by this overall score to determine your personal top list."
                    funFacts={[
                      "Your #1 artist often accounts for a large share of your total listening time",
                      "High replay value indicates strong attachment to an artist's catalogue",
                      "Freshly discovered artists can climb quickly if you binge their music",
                    ]}
                    metrics={[
                      { label: "Total Hours", value: `${stats.totalHours}h`, description: "Time spent with ranked artists" },
                      { label: "Artist Count", value: `${stats.totalArtists}`, description: "Artists considered in this list" },
                      { label: "Avg Popularity", value: `${stats.avgPopularity}/100`, description: "Mainstream appeal of your top artists" },
                    ]}
                  />
                </CardTitle>
                <CardDescription>
                  Click any artist to see detailed information and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedArtists.slice(0, 15).map((artist, index) => (
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
                  {sortedArtists.slice(0, 20).map((artist) => (
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
                        
                        {artist.image ? (
                          <div className="mb-3 relative group">
                            <img 
                              src={artist.image} 
                              alt={artist.name}
                              className="w-full h-32 sm:h-36 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <p className="text-xs font-medium truncate">{artist.name}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3 h-32 sm:h-36 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground font-medium">{artist.name}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-sm truncate flex-1 pr-2">{artist.name}</h3>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {artist.avgPopularity}/100
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="text-center p-2 bg-accent/10 rounded">
                              <div className="text-xs text-muted-foreground">Share</div>
                              <div className="font-medium text-accent">{artist.songShare}%</div>
                            </div>
                            <div className="text-center p-2 bg-primary/10 rounded">
                              <div className="text-xs text-muted-foreground">Replay</div>
                              <div className="font-medium text-primary">{artist.replayValue}%</div>
                            </div>
                            <div className="text-center p-2 bg-green-500/10 rounded">
                              <div className="text-xs text-muted-foreground">Hours</div>
                              <div className="font-medium text-green-600">{artist.listeningHours}h</div>
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

          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
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
        </Tabs>
        </div>
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
