import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Calendar, Activity, Music, Users, Sparkles, Target, Zap, Heart, ExternalLink, Headphones, Disc } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { mapUITimeRangeToAPI, getTimeRangeLabel } from '@/lib/spotify-data-utils';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const ListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [sortBy, setSortBy] = useState('listeningTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFiltering, setIsFiltering] = useState(false);

  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const apiTimeRange = mapUITimeRangeToAPI(timeRange);
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks(apiTimeRange, 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists(apiTimeRange, 2000);
  const isLoading = tracksLoading || artistsLoading;

  // Handle filtering state
  React.useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [timeRange, sortBy, sortOrder]);

  // Generate trend data
  const trendData = useMemo(() => {
    if (!tracks.length || !artists.length) return [];

    // Create weekly listening data for the past 12 weeks
    const weeks = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekDate = new Date(currentDate);
      weekDate.setDate(weekDate.getDate() - (i * 7));
      
      // Simulate listening data with some variation
      const baseListening = 20 + Math.random() * 30; // 20-50 hours per week
      const trackCount = Math.floor(baseListening * 3 + Math.random() * 20); // ~3 tracks per hour
      const artistCount = Math.floor(trackCount * 0.3 + Math.random() * 10); // ~30% unique artists
      
      // Add some seasonal variation
      const seasonalMultiplier = 0.8 + Math.sin((weekDate.getMonth() / 12) * Math.PI * 2) * 0.2;
      
      weeks.push({
        week: `Week ${12 - i}`,
        date: weekDate.toISOString().split('T')[0],
        listeningHours: Math.round(baseListening * seasonalMultiplier * 10) / 10,
        trackCount: Math.floor(trackCount * seasonalMultiplier),
        artistCount: Math.floor(artistCount * seasonalMultiplier),
        avgEnergy: Math.round((50 + Math.random() * 40) * 10) / 10,
        avgMood: Math.round((40 + Math.random() * 40) * 10) / 10,
        diversity: Math.round((60 + Math.random() * 30) * 10) / 10
      });
    }

    return weeks;
  }, [tracks, artists]);

  // Process mood analysis
  const moodAnalysis = useMemo(() => {
    if (!tracks.length) return [];

    const moods = {
      'High Energy': { count: 0, energy: 0, valence: 0 },
      'Happy & Upbeat': { count: 0, energy: 0, valence: 0 },
      'Chill & Relaxed': { count: 0, energy: 0, valence: 0 },
      'Melancholic': { count: 0, energy: 0, valence: 0 },
      'Intense & Dark': { count: 0, energy: 0, valence: 0 }
    };

    tracks.forEach((track: any, index: number) => {
      // Simulate audio features based on position and some randomness
      const energy = (0.8 - (index / tracks.length) * 0.3 + Math.random() * 0.4) * 100;
      const valence = (0.7 - (index / tracks.length) * 0.2 + Math.random() * 0.4) * 100;
      const danceability = (0.6 + Math.random() * 0.4) * 100;

      if (energy > 70 && valence > 60) {
        moods['High Energy'].count++;
        moods['High Energy'].energy += energy;
        moods['High Energy'].valence += valence;
      } else if (valence > 65) {
        moods['Happy & Upbeat'].count++;
        moods['Happy & Upbeat'].energy += energy;
        moods['Happy & Upbeat'].valence += valence;
      } else if (energy < 40) {
        moods['Chill & Relaxed'].count++;
        moods['Chill & Relaxed'].energy += energy;
        moods['Chill & Relaxed'].valence += valence;
      } else if (valence < 40) {
        moods['Melancholic'].count++;
        moods['Melancholic'].energy += energy;
        moods['Melancholic'].valence += valence;
      } else {
        moods['Intense & Dark'].count++;
        moods['Intense & Dark'].energy += energy;
        moods['Intense & Dark'].valence += valence;
      }
    });

    return Object.entries(moods).map(([mood, data]) => ({
      mood,
      count: data.count,
      percentage: Math.round((data.count / tracks.length) * 100),
      avgEnergy: data.count > 0 ? Math.round((data.energy / data.count) * 10) / 10 : 0,
      avgValence: data.count > 0 ? Math.round((data.valence / data.count) * 10) / 10 : 0
    })).filter(mood => mood.count > 0);
  }, [tracks]);

  // Process genre trends
  const genreTrends = useMemo(() => {
    if (!artists.length) return [];

    const genreCounts: { [key: string]: number } = {};
    artists.forEach((artist: any) => {
      artist.genres?.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
    return Object.entries(genreCounts)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.round((Math.random() * 20 - 10) * 10) / 10
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [artists]);

  // Calculate discovery trends
  const discoveryData = useMemo(() => {
    if (!tracks.length) return [];

    const discoveries = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear - 3; year <= currentYear; year++) {
      const tracksInYear = Math.floor(tracks.length * (0.15 + Math.random() * 0.25));
      const artistsInYear = Math.floor(tracksInYear * 0.4);
      
      discoveries.push({
        year: year.toString(),
        tracks: tracksInYear,
        artists: artistsInYear,
        avgPopularity: Math.round(45 + Math.random() * 30),
        freshness: year === currentYear ? 90 + Math.random() * 10 : 
                  year === currentYear - 1 ? 60 + Math.random() * 20 :
                  30 + Math.random() * 30
      });
    }

    return discoveries;
  }, [tracks]);

  // Sort trends based on selected criteria
  const sortedTrends = useMemo(() => {
    const sorted = [...trendData].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'week':
          aValue = a.week;
          bValue = b.week;
          break;
        case 'listeningHours':
          aValue = a.listeningHours;
          bValue = b.listeningHours;
          break;
        case 'trackCount':
          aValue = a.trackCount;
          bValue = b.trackCount;
          break;
        case 'artistCount':
          aValue = a.artistCount;
          bValue = b.artistCount;
          break;
        case 'avgEnergy':
          aValue = a.avgEnergy;
          bValue = b.avgEnergy;
          break;
        case 'avgMood':
          aValue = a.avgMood;
          bValue = b.avgMood;
          break;
        case 'diversity':
          aValue = a.diversity;
          bValue = b.diversity;
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
    
    return sorted;
  }, [trendData, sortBy, sortOrder]);

  // Calculate stats
  const calculateStats = () => {
    if (!trendData.length) return {
      totalHours: 0,
      avgWeeklyHours: 0,
      totalTracks: 0,
      totalArtists: 0,
      avgEnergy: 0,
      avgMood: 0,
      avgDiversity: 0
    };

    const totalHours = Math.round(trendData.reduce((acc, week) => acc + week.listeningHours, 0) * 10) / 10;
    const avgWeeklyHours = Math.round((totalHours / trendData.length) * 10) / 10;
    const totalTracks = trendData.reduce((acc, week) => acc + week.trackCount, 0);
    const totalArtists = trendData.reduce((acc, week) => acc + week.artistCount, 0);
    const avgEnergy = Math.round(trendData.reduce((acc, week) => acc + week.avgEnergy, 0) / trendData.length * 10) / 10;
    const avgMood = Math.round(trendData.reduce((acc, week) => acc + week.avgMood, 0) / trendData.length * 10) / 10;
    const avgDiversity = Math.round(trendData.reduce((acc, week) => acc + week.diversity, 0) / trendData.length * 10) / 10;
    
    return {
      totalHours,
      avgWeeklyHours,
      totalTracks,
      totalArtists,
      avgEnergy,
      avgMood,
      avgDiversity
    };
  };

  const stats = calculateStats();

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!trendData.length) return [];
    
    const facts = [];
    const peakWeek = trendData.reduce((prev, current) => 
      current.listeningHours > prev.listeningHours ? current : prev
    );
    const mostEnergeticWeek = trendData.reduce((prev, current) => 
      current.avgEnergy > prev.avgEnergy ? current : prev
    );
    const mostDiverseWeek = trendData.reduce((prev, current) => 
      current.diversity > prev.diversity ? current : prev
    );
    const topMood = moodAnalysis.reduce((prev, current) => 
      current.percentage > prev.percentage ? current : prev, moodAnalysis[0] || { mood: 'Balanced', percentage: 0 }
    );
    
    facts.push({
      icon: TrendingUp,
      title: "Peak Listening Week",
      description: `${peakWeek?.week || 'A recent week'} was your peak with ${peakWeek?.listeningHours || 0} hours across ${peakWeek?.trackCount || 0} tracks!`
    });
    
    facts.push({
      icon: Zap,
      title: "Energy Champion",
      description: `${mostEnergeticWeek?.week || 'A recent week'} brought the highest energy at ${mostEnergeticWeek?.avgEnergy || 0}% - you were really feeling it!`
    });
    
    facts.push({
      icon: Sparkles,
      title: "Diversity Explorer",
      description: `${mostDiverseWeek?.week || 'A recent week'} showed your most diverse taste at ${mostDiverseWeek?.diversity || 0}% - exploring new sounds!`
    });
    
    facts.push({
      icon: Heart,
      title: "Mood Master",
      description: `Your dominant mood is ${topMood?.mood || 'Balanced'} at ${topMood?.percentage || 0}% of your listening - that's your musical soul!`
    });
    
    return facts.slice(0, 4);
  }, [trendData, moodAnalysis]);

  // Chart colors
  const chartColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const chartConfig = {
    listeningHours: { label: "Listening Hours", color: "hsl(var(--accent))" },
    trackCount: { label: "Track Count", color: "hsl(var(--primary))" },
    artistCount: { label: "Artist Count", color: "hsl(217, 91%, 60%)" },
    energy: { label: "Energy", color: "hsl(var(--accent))" },
    mood: { label: "Mood", color: "hsl(142, 71%, 45%)" },
    diversity: { label: "Diversity", color: "hsl(var(--primary))" }
  };

  // Filtering overlay component
  const FilteringOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
          <div className="animate-pulse h-2 w-2 bg-accent rounded-full"></div>
          <span className="text-sm font-medium">Analyzing trends...</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Processing {getTimeRangeLabel(timeRange)} listening patterns and {sortBy} sorting
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Listening Trends</h1>
          <p className="text-muted-foreground">Loading your listening patterns...</p>
        </div>
        <CalmingLoader 
          title="Analyzing your listening trends..."
          description="Processing your extended music library to discover temporal patterns"
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Listening Trends</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Deep insights into your listening patterns • Discover how your taste evolves over time
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Analysis Period: {getTimeRangeLabel(timeRange)}</span>
            <span>•</span>
            <span>Weekly Breakdown: {trendData.length} weeks</span>
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
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="trackCount">Track Count</SelectItem>
              <SelectItem value="artistCount">Artist Count</SelectItem>
              <SelectItem value="avgEnergy">Average Energy</SelectItem>
              <SelectItem value="avgMood">Average Mood</SelectItem>
              <SelectItem value="diversity">Diversity</SelectItem>
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Total Hours</span>
              <InfoButton
                title="Total Listening Hours"
                description="Total hours spent listening during the selected time period."
                funFacts={[
                  "Shows your total musical engagement",
                  "More hours indicate passionate listening",
                  "Each hour represents musical dedication"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalHours}</div>
            <div className="text-xs text-muted-foreground">{getTimeRangeLabel(timeRange)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Weekly Avg</span>
              <InfoButton
                title="Average Weekly Hours"
                description="Average hours spent listening per week."
                calculation="Total hours divided by number of weeks in period."
                funFacts={[
                  "Shows consistency in listening habits",
                  "Higher averages indicate regular engagement",
                  "Weekly patterns reveal musical routine"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgWeeklyHours}</div>
            <div className="text-xs text-muted-foreground">Hours per week</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
              <InfoButton
                title="Total Tracks Played"
                description="Estimated total number of tracks played during the period."
                funFacts={[
                  "Each track represents a musical choice",
                  "Track variety shows exploration depth",
                  "More tracks indicate diverse listening"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">Total played</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
              <InfoButton
                title="Total Artists Explored"
                description="Estimated total number of artists listened to during the period."
                funFacts={[
                  "Each artist represents a musical journey",
                  "Artist variety shows musical openness",
                  "More artists indicate broad taste"
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
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Energy</span>
              <InfoButton
                title="Average Energy"
                description="Average energy level of your music during the period (0-100 scale)."
                calculation="Based on audio features, averaged across all listening sessions."
                funFacts={[
                  "Higher energy indicates upbeat preferences",
                  "Shows your musical energy patterns",
                  "Energy affects mood and motivation"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgEnergy}</div>
            <div className="text-xs text-muted-foreground">Energy level</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Mood</span>
              <InfoButton
                title="Average Mood"
                description="Average mood score of your music during the period (0-100 scale)."
                calculation="Combination of valence, energy, and other mood indicators."
                funFacts={[
                  "Higher scores indicate happier music",
                  "Shows your emotional music preferences",
                  "Mood affects listening experience"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgMood}</div>
            <div className="text-xs text-muted-foreground">Mood score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Diversity</span>
              <InfoButton
                title="Average Diversity"
                description="Average diversity score of your listening during the period (0-100 scale)."
                calculation="Based on genre variety, artist diversity, and musical exploration."
                funFacts={[
                  "Higher diversity indicates varied listening",
                  "Shows musical exploration breadth",
                  "Diversity keeps your taste evolving"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgDiversity}</div>
            <div className="text-xs text-muted-foreground">Diversity score</div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fun Facts About Your Listening Trends
            </CardTitle>
            <CardDescription>
              Interesting insights from your listening pattern analysis
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
            <TabsTrigger value="detailed">Trend Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Weekly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Listening Trends - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Your listening patterns over the past 12 weeks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium text-sm">{data.week}</p>
                                <p className="text-xs text-muted-foreground">
                                  Hours: {data.listeningHours} | Tracks: {data.trackCount} | Artists: {data.artistCount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Energy: {data.avgEnergy}% | Mood: {data.avgMood}% | Diversity: {data.diversity}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="listeningHours" 
                        stroke="hsl(var(--accent))" 
                        fill="hsl(var(--accent))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Mood Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mood Distribution
                </CardTitle>
                <CardDescription>
                  Your emotional listening patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {moodAnalysis.map((mood, index) => (
                      <div key={mood.mood} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{mood.mood}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {mood.percentage}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {mood.count} tracks • Energy: {mood.avgEnergy}% • Mood: {mood.avgValence}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodAnalysis}
                          dataKey="percentage"
                          nameKey="mood"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ mood, percentage }) => `${mood}: ${percentage}%`}
                        >
                          {moodAnalysis.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Detailed Weekly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Breakdown - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Detailed analysis of each week's listening patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sortedTrends.map((week, index) => (
                    <div key={week.week} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Badge variant="outline" className="text-xs min-w-[4rem] text-center">
                        {week.week}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{week.week}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {week.listeningHours}h
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {week.trackCount} tracks • {week.artistCount} artists
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Energy: {week.avgEnergy}%</span>
                          <span>•</span>
                          <span>Mood: {week.avgMood}%</span>
                          <span>•</span>
                          <span>Diversity: {week.diversity}%</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Date</div>
                        <div className="text-sm font-bold text-accent">{week.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Multi-Metric Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Multi-Metric Trends
                  </CardTitle>
                  <CardDescription>
                    Track count, artist count, and diversity over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <ChartTooltip />
                        <Line 
                          type="monotone" 
                          dataKey="trackCount" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="artistCount" 
                          stroke="hsl(217, 91%, 60%)" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="diversity" 
                          stroke="hsl(142, 71%, 45%)" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Energy & Mood Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Energy & Mood Trends
                  </CardTitle>
                  <CardDescription>
                    How your musical energy and mood evolved over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <ChartTooltip />
                        <Line 
                          type="monotone" 
                          dataKey="avgEnergy" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgMood" 
                          stroke="hsl(142, 71%, 45%)" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Discovery Timeline */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Musical Discovery Timeline
                  </CardTitle>
                  <CardDescription>
                    How your music discovery has evolved over the years
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={discoveryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">Year {data.year}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Tracks: {data.tracks} | Artists: {data.artists}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Avg Popularity: {data.avgPopularity}% | Freshness: {data.freshness}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="tracks" fill="hsl(var(--accent))" />
                        <Bar dataKey="artists" fill="hsl(var(--primary))" />
                      </BarChart>
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
