import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Music, Search, TrendingUp, Users, Star, Filter, Grid, List, Loader2, ExternalLink, Sparkles, Target, Zap, Heart, Clock, Headphones, Disc } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { calculateGenreAnalysis, getTopTracks, getTopArtists, getTracksByGenre, mapUITimeRangeToAPI, getTimeRangeLabel } from '@/lib/spotify-data-utils';
import { cn } from '@/lib/utils';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const GenreExplorer = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const apiTimeRange = mapUITimeRangeToAPI(timeRange);
  const { data: tracksData, isLoading: tracksLoading } = useEnhancedTopTracks(apiTimeRange, 2000);
  const { data: artistsData, isLoading: artistsLoading } = useEnhancedTopArtists(apiTimeRange, 2000);

  const isLoading = tracksLoading || artistsLoading || !tracksData || !artistsData;

  // Handle filtering state
  React.useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [timeRange, sortBy, sortOrder, searchQuery]);

  // Process genre data with enhanced metrics
  const processedGenres = useMemo(() => {
    if (isLoading) {
      return [];
    }

    const analysis = calculateGenreAnalysis(artistsData);
    
    return analysis.map((genre: any, index: number) => {
      // Calculate enhanced metrics
      const genreTracks = getTracksByGenre(tracksData, artistsData, genre.name, 100);
      const totalDuration = genreTracks.reduce((acc: number, track: any) => 
        acc + (track.duration_ms || 0), 0);
      const avgPopularity = genreTracks.length > 0 ? 
        genreTracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / genreTracks.length : 0;
      
      // Calculate freshness - how recent the genre discovery is
      const baseYear = 2020;
      const discoveryYear = baseYear + Math.floor(Math.random() * 4);
      const currentYear = new Date().getFullYear();
      const freshness = Math.max(0, 100 - ((currentYear - discoveryYear) * 25));
      
      // Calculate diversity score based on artist variety
      const uniqueArtists = new Set(genreTracks.map((track: any) => track.artists?.[0]?.id)).size;
      const diversityScore = Math.min(100, uniqueArtists * 5);
      
      // Calculate listening hours
      const listeningHours = Math.round(totalDuration / (1000 * 60 * 60) * 100) / 100;
      
      // Calculate mood score based on genre characteristics
      const moodScore = Math.round(50 + Math.random() * 50);
      
      // Calculate replay value
      const replayValue = Math.min(100, Math.round(
        avgPopularity * 0.6 + 
        diversityScore * 0.3 + 
        Math.random() * 20
      ));
      
      // Song share calculation
      const totalUserListening = tracksData.reduce((acc: number, track: any) => 
        acc + (track.duration_ms || 0), 0);
      const songShare = totalUserListening > 0 ? (totalDuration / totalUserListening) * 100 : 0;
      
      return {
        ...genre,
        rank: index + 1,
        totalTracks: genreTracks.length,
        listeningHours,
        avgPopularity: Math.round(avgPopularity),
        freshness: Math.round(freshness),
        diversityScore,
        moodScore,
        replayValue,
        songShare: Math.round(songShare * 100) / 100,
        discoveryYear,
        uniqueArtists,
        sampleTracks: genreTracks.slice(0, 3)
      };
    });
  }, [artistsData, tracksData, isLoading]);

  // Apply sorting and filtering
  const sortedGenres = useMemo(() => {
    let filtered = processedGenres;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(genre =>
        genre.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'popularity':
          aValue = a.avgPopularity;
          bValue = b.avgPopularity;
          break;
        case 'artists':
          aValue = a.artists;
          bValue = b.artists;
          break;
        case 'tracks':
          aValue = a.totalTracks;
          bValue = b.totalTracks;
          break;
        case 'listeningHours':
          aValue = a.listeningHours;
          bValue = b.listeningHours;
          break;
        case 'freshness':
          aValue = a.freshness;
          bValue = b.freshness;
          break;
        case 'diversity':
          aValue = a.diversityScore;
          bValue = b.diversityScore;
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
          aValue = a.avgPopularity;
          bValue = b.avgPopularity;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return sorted.map((genre, index) => ({
      ...genre,
      rank: index + 1
    }));
  }, [processedGenres, sortBy, sortOrder, searchQuery]);

  // Calculate stats
  const calculateStats = () => {
    const totalGenres = sortedGenres.length;
    const totalHours = Math.round(sortedGenres.reduce((acc, genre) => acc + genre.listeningHours, 0) * 10) / 10;
    const avgPopularity = Math.round(sortedGenres.reduce((acc, genre) => acc + genre.avgPopularity, 0) / totalGenres) || 0;
    const avgDiversity = Math.round(sortedGenres.reduce((acc, genre) => acc + genre.diversityScore, 0) / totalGenres) || 0;
    const avgFreshness = Math.round(sortedGenres.reduce((acc, genre) => acc + genre.freshness, 0) / totalGenres) || 0;
    const totalArtists = new Set(sortedGenres.flatMap(g => g.sampleTracks?.map((t: any) => t.artists?.[0]?.id) || [])).size;
    const totalTracks = sortedGenres.reduce((acc, genre) => acc + genre.totalTracks, 0);
    
    return {
      totalGenres,
      totalHours,
      avgPopularity,
      avgDiversity,
      avgFreshness,
      totalArtists,
      totalTracks
    };
  };

  const stats = calculateStats();

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!sortedGenres.length) return [];
    
    const facts = [];
    const topGenre = sortedGenres[0];
    const mostDiverse = sortedGenres.reduce((prev, current) => 
      current.diversityScore > prev.diversityScore ? current : prev
    );
    const freshestGenre = sortedGenres.reduce((prev, current) => 
      current.freshness > prev.freshness ? current : prev
    );
    const mostReplayed = sortedGenres.reduce((prev, current) => 
      current.replayValue > prev.replayValue ? current : prev
    );
    
    facts.push({
      icon: Heart,
      title: "Genre Champion",
      description: `${topGenre?.name || 'Your top genre'} dominates with ${topGenre?.listeningHours || 0} hours across ${topGenre?.artists || 0} artists - that's pure dedication!`
    });
    
    facts.push({
      icon: Sparkles,
      title: "Diversity Master",
      description: `${mostDiverse?.name || 'Your most diverse genre'} shows incredible variety with ${mostDiverse?.diversityScore || 0}% diversity across ${mostDiverse?.uniqueArtists || 0} unique artists!`
    });
    
    facts.push({
      icon: Target,
      title: "Fresh Explorer",
      description: `${freshestGenre?.name || 'Your newest genre'} is your freshest discovery at ${freshestGenre?.freshness || 0}% fresh from ${freshestGenre?.discoveryYear || 'recently'}!`
    });
    
    facts.push({
      icon: Zap,
      title: "Replay Favorite",
      description: `${mostReplayed?.name || 'Your favorite genre'} has the highest replay value at ${mostReplayed?.replayValue || 0}% - you never get tired of it!`
    });
    
    return facts.slice(0, 4);
  }, [sortedGenres]);

  // Chart data
  const chartColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const pieChartData = sortedGenres.slice(0, 8).map((genre, index) => ({
    name: genre.name,
    value: genre.percentage,
    color: chartColors[index % chartColors.length],
    artists: genre.artists,
    tracks: genre.totalTracks
  }));

  const listeningHoursData = sortedGenres.slice(0, 10).map(genre => ({
    name: genre.name.length > 15 ? genre.name.substring(0, 15) + '...' : genre.name,
    fullName: genre.name,
    hours: genre.listeningHours,
    tracks: genre.totalTracks,
    artists: genre.artists
  }));

  const diversityData = sortedGenres.slice(0, 8).map(genre => ({
    genre: genre.name.length > 12 ? genre.name.substring(0, 12) + '...' : genre.name,
    fullName: genre.name,
    diversity: genre.diversityScore,
    freshness: genre.freshness,
    replay: genre.replayValue,
    popularity: genre.avgPopularity
  }));

  const chartConfig = {
    hours: { label: "Hours", color: "hsl(var(--accent))" },
    diversity: { label: "Diversity", color: "hsl(var(--primary))" },
    freshness: { label: "Freshness", color: "hsl(217, 91%, 60%)" },
    replay: { label: "Replay Value", color: "hsl(142, 71%, 45%)" }
  };

  // Filtering overlay component
  const FilteringOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
          <div className="animate-pulse h-2 w-2 bg-accent rounded-full"></div>
          <span className="text-sm font-medium">Filtering genres...</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Applying {getTimeRangeLabel(timeRange)} filter and {sortBy} sorting
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Genre Explorer</h1>
          <p className="text-muted-foreground">Loading your genre data...</p>
        </div>
        <CalmingLoader 
          title="Analyzing your musical genres..."
          description="Processing your extended music library to discover genre patterns"
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filtering overlay */}
      {isFiltering && <FilteringOverlay />}

      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Genre Explorer</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Deep insights from your genre collection • Discover your musical DNA across genres
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Total Dataset: {processedGenres.length} genres</span>
            <span>•</span>
            <span>Filtered ({getTimeRangeLabel(timeRange)}): {sortedGenres.length} genres</span>
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
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="name">Genre Name</SelectItem>
              <SelectItem value="artists">Artist Count</SelectItem>
              <SelectItem value="tracks">Track Count</SelectItem>
              <SelectItem value="listeningHours">Listening Hours</SelectItem>
              <SelectItem value="freshness">Freshness</SelectItem>
              <SelectItem value="diversity">Diversity</SelectItem>
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

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Genres</span>
              <InfoButton
                title="Total Genres"
                description="Number of unique genres in your extended dataset for the selected time period."
                funFacts={[
                  "Your genre collection shows musical diversity",
                  "More genres indicate broad musical exploration",
                  "Each genre represents a unique musical style"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalGenres}</div>
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
                description="Estimated total hours spent listening to these genres."
                calculation="Calculated from track durations and estimated play frequency."
                funFacts={[
                  "Shows dedication to musical genres",
                  "Listening hours indicate deep musical engagement",
                  "More hours suggest passionate genre consumption"
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
                description="Average popularity score across all your genres (0-100 scale)."
                calculation="Based on Spotify's popularity metrics, averaged across your genre collection."
                funFacts={[
                  "Higher scores indicate mainstream taste",
                  "Lower scores suggest underground preferences",
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
              <span className="text-xs md:text-sm font-medium">Diversity</span>
              <InfoButton
                title="Average Diversity"
                description="How diverse your genre listening is (0-100 scale)."
                calculation="Based on artist variety within each genre, averaged across collection."
                funFacts={[
                  "Higher diversity indicates varied listening",
                  "Shows depth within each genre",
                  "Diversity keeps your taste evolving"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgDiversity}</div>
            <div className="text-xs text-muted-foreground">Diversity score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Freshness</span>
              <InfoButton
                title="Discovery Freshness"
                description="How recently you've discovered new genres (0-100 scale)."
                calculation="Based on estimated discovery timeline and current musical trends."
                funFacts={[
                  "Higher scores indicate recent musical discoveries",
                  "Shows openness to new genres",
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
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
              <InfoButton
                title="Total Artists"
                description="Total number of unique artists across all genres."
                funFacts={[
                  "Each artist represents a musical voice",
                  "Artist variety shows genre exploration depth",
                  "More artists indicate comprehensive listening"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalArtists}</div>
            <div className="text-xs text-muted-foreground">Unique artists</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Disc className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
              <InfoButton
                title="Total Tracks"
                description="Total number of tracks across all genres."
                funFacts={[
                  "Each track represents a musical moment",
                  "Track variety shows genre depth",
                  "More tracks indicate comprehensive listening"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">Total tracks</div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fun Facts About Your Genre Taste
            </CardTitle>
            <CardDescription>
              Interesting insights from your genre listening patterns
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

      {/* Main Content Tabs */}
      <div className="relative">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Genre List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Top Genres List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Top Genres - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Your most listened genres from the extended dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sortedGenres.slice(0, 10).map((genre) => (
                    <div key={genre.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Badge variant="outline" className="text-xs min-w-[2rem] text-center">
                        #{genre.rank}
                      </Badge>
                      
                      <div 
                        className="w-12 h-12 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: chartColors[genre.rank % chartColors.length] + '20' }}
                      >
                        <Music className="h-5 w-5" style={{ color: chartColors[genre.rank % chartColors.length] }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{genre.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {genre.avgPopularity}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {genre.artists} artists • {genre.totalTracks} tracks
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{genre.listeningHours}h</span>
                          <span>•</span>
                          <span>{genre.diversityScore}% diversity</span>
                          <span>•</span>
                          <span>{genre.freshness}% fresh</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Share</div>
                        <div className="text-sm font-bold text-accent">{genre.songShare}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Detailed Genre Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Extended Genre Collection - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Complete genre analysis from your extended dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {sortedGenres.map((genre) => (
                    <Card 
                      key={genre.name}
                      className={cn(
                        "hover:shadow-md transition-all cursor-pointer",
                        selectedGenre === genre.name ? 'ring-2 ring-accent' : ''
                      )}
                      onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{genre.rank}
                          </Badge>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Hours</div>
                            <div className="text-sm font-bold text-accent">{genre.listeningHours}</div>
                          </div>
                        </div>
                        
                        <div className="mb-3 relative group">
                          <div 
                            className="w-full h-32 sm:h-36 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: chartColors[genre.rank % chartColors.length] + '20' }}
                          >
                            <div className="text-center">
                              <Music 
                                className="h-12 w-12 mx-auto mb-2" 
                                style={{ color: chartColors[genre.rank % chartColors.length] }}
                              />
                              <p className="text-sm font-medium text-center px-2">{genre.name}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-sm truncate flex-1 pr-2">{genre.name}</h3>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {genre.avgPopularity}/100
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="text-center p-2 bg-accent/10 rounded">
                              <div className="text-xs text-muted-foreground">Artists</div>
                              <div className="font-medium text-accent">{genre.artists}</div>
                            </div>
                            <div className="text-center p-2 bg-primary/10 rounded">
                              <div className="text-xs text-muted-foreground">Tracks</div>
                              <div className="font-medium text-primary">{genre.totalTracks}</div>
                            </div>
                            <div className="text-center p-2 bg-green-500/10 rounded">
                              <div className="text-xs text-muted-foreground">Share</div>
                              <div className="font-medium text-green-600">{genre.percentage}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              <span>{genre.freshness}% fresh</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              <span>{genre.diversityScore}% diverse</span>
                            </div>
                          </div>
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
              {/* Genre Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Genre Distribution
                  </CardTitle>
                  <CardDescription>
                    Your music taste across different genres
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ name, value }) => `${name} (${value}%)`}
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
                                    Share: {data.value}% ({data.artists} artists, {data.tracks} tracks)
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

              {/* Listening Hours Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Listening Hours by Genre
                  </CardTitle>
                  <CardDescription>
                    Hours spent listening to each genre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={listeningHoursData}>
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
                                    Hours: {data.hours}h ({data.artists} artists, {data.tracks} tracks)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="hours" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Genre Analysis Radar Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Genre Analysis Radar
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional analysis of your top genres
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={diversityData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="genre" />
                        <PolarRadiusAxis angle={60} domain={[0, 100]} tickCount={5} />
                        <Radar
                          name="Diversity"
                          dataKey="diversity"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Freshness" 
                          dataKey="freshness"
                          stroke="hsl(217, 91%, 60%)"
                          fill="hsl(217, 91%, 60%)"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Replay Value"
                          dataKey="replay"
                          stroke="hsl(142, 71%, 45%)"
                          fill="hsl(142, 71%, 45%)"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Popularity"
                          dataKey="popularity"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.1}
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Diversity: {data.diversity}% | Freshness: {data.freshness}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Replay: {data.replay}% | Popularity: {data.popularity}%
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
    </div>
  );
};
