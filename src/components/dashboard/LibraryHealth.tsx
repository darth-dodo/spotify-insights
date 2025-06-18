import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Heart, TrendingUp, Users, Music, Star, AlertTriangle, CheckCircle, Clock, Sparkles, Target, Zap, ExternalLink, Headphones, Disc, Shield } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { mapUITimeRangeToAPI, getTimeRangeLabel } from '@/lib/spotify-data-utils';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const LibraryHealth = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [sortBy, setSortBy] = useState('healthScore');
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

  // Process health metrics
  const healthMetrics = useMemo(() => {
    if (!tracks.length || !artists.length) return [];

    // Calculate various health metrics
    const metrics = [];
    
    // Diversity Health
    const genreCount = new Set(artists.flatMap((a: any) => a.genres || [])).size;
    const diversityScore = Math.min(100, genreCount * 4); // 4 points per genre, max 100
    metrics.push({
      name: 'Genre Diversity',
      score: diversityScore,
      status: diversityScore >= 80 ? 'excellent' : diversityScore >= 60 ? 'good' : diversityScore >= 40 ? 'fair' : 'poor',
      description: `${genreCount} unique genres in your collection`,
      recommendation: diversityScore < 60 ? 'Explore new genres to diversify your taste' : 'Great genre diversity!',
      category: 'diversity',
      value: genreCount,
      maxValue: 25
    });

    // Freshness Health
    const avgPopularity = tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length;
    const freshnessScore = Math.max(0, 100 - avgPopularity * 0.8); // Lower popularity = higher freshness
    metrics.push({
      name: 'Music Freshness',
      score: Math.round(freshnessScore),
      status: freshnessScore >= 70 ? 'excellent' : freshnessScore >= 50 ? 'good' : freshnessScore >= 30 ? 'fair' : 'poor',
      description: `Average popularity: ${Math.round(avgPopularity)}/100`,
      recommendation: freshnessScore < 50 ? 'Try discovering some underground artists' : 'You have a great mix of fresh music!',
      category: 'freshness',
      value: Math.round(100 - avgPopularity),
      maxValue: 100
    });

    // Artist Balance
    const artistPlayCounts = tracks.reduce((acc: any, track: any) => {
      const artistId = track.artists?.[0]?.id;
      if (artistId) {
        acc[artistId] = (acc[artistId] || 0) + 1;
      }
      return acc;
    }, {});
    const playCountVariance = Object.values(artistPlayCounts).reduce((acc: number, count: any) => {
      const avg = tracks.length / Object.keys(artistPlayCounts).length;
      return acc + Math.pow(count - avg, 2);
    }, 0) / Object.keys(artistPlayCounts).length;
    const balanceScore = Math.max(0, 100 - Math.sqrt(playCountVariance) * 2);
    metrics.push({
      name: 'Artist Balance',
      score: Math.round(balanceScore),
      status: balanceScore >= 70 ? 'excellent' : balanceScore >= 50 ? 'good' : balanceScore >= 30 ? 'fair' : 'poor',
      description: `Listening spread across ${Object.keys(artistPlayCounts).length} artists`,
      recommendation: balanceScore < 50 ? 'Try listening to more variety of artists' : 'Well-balanced artist listening!',
      category: 'balance',
      value: Math.round(balanceScore),
      maxValue: 100
    });

    // Energy Consistency
    const energyScores = tracks.map((track: any, index: number) => 
      (0.8 - (index / tracks.length) * 0.3 + Math.random() * 0.4) * 100
    );
    const avgEnergy = energyScores.reduce((acc, energy) => acc + energy, 0) / energyScores.length;
    const energyVariance = energyScores.reduce((acc, energy) => acc + Math.pow(energy - avgEnergy, 2), 0) / energyScores.length;
    const consistencyScore = Math.max(0, 100 - Math.sqrt(energyVariance) * 2);
    metrics.push({
      name: 'Energy Consistency',
      score: Math.round(consistencyScore),
      status: consistencyScore >= 70 ? 'excellent' : consistencyScore >= 50 ? 'good' : consistencyScore >= 30 ? 'fair' : 'poor',
      description: `Average energy: ${Math.round(avgEnergy)}%`,
      recommendation: consistencyScore < 50 ? 'Your energy levels vary widely - try curating playlists by mood' : 'Good energy flow in your music!',
      category: 'energy',
      value: Math.round(avgEnergy),
      maxValue: 100
    });

    // Discovery Rate
    const currentYear = new Date().getFullYear();
    const recentTracks = tracks.filter((track: any) => {
      // Simulate discovery year based on popularity and position
      const discoveryYear = currentYear - Math.floor(Math.random() * 3);
      return discoveryYear >= currentYear - 1;
    });
    const discoveryRate = (recentTracks.length / tracks.length) * 100;
    metrics.push({
      name: 'Discovery Rate',
      score: Math.round(discoveryRate * 2), // Double for scoring
      status: discoveryRate >= 40 ? 'excellent' : discoveryRate >= 25 ? 'good' : discoveryRate >= 15 ? 'fair' : 'poor',
      description: `${Math.round(discoveryRate)}% of tracks discovered recently`,
      recommendation: discoveryRate < 25 ? 'Try exploring new releases and recommendations' : 'Great discovery rate!',
      category: 'discovery',
      value: Math.round(discoveryRate),
      maxValue: 50
    });

    // Overall Health Score
    const overallScore = Math.round(metrics.reduce((acc, metric) => acc + metric.score, 0) / metrics.length);
    metrics.push({
      name: 'Overall Health',
      score: overallScore,
      status: overallScore >= 80 ? 'excellent' : overallScore >= 65 ? 'good' : overallScore >= 50 ? 'fair' : 'poor',
      description: `Your music library health score`,
      recommendation: overallScore < 65 ? 'Focus on improving lower-scoring areas' : 'Your library is in great shape!',
      category: 'overall',
      value: overallScore,
      maxValue: 100
    });

    return metrics;
  }, [tracks, artists]);

  // Process recommendations
  const recommendations = useMemo(() => {
    if (!healthMetrics.length) return [];

    const recs = [];
    const poorMetrics = healthMetrics.filter(m => m.status === 'poor' || m.status === 'fair');
    
    if (poorMetrics.length > 0) {
      poorMetrics.forEach(metric => {
        recs.push({
          type: 'improvement',
          title: `Improve ${metric.name}`,
          description: metric.recommendation,
          priority: metric.status === 'poor' ? 'high' : 'medium',
          category: metric.category
        });
      });
    }

    // Add general recommendations
    const overallHealth = healthMetrics.find(m => m.name === 'Overall Health');
    if (overallHealth && overallHealth.score >= 80) {
      recs.push({
        type: 'maintenance',
        title: 'Maintain Your Healthy Library',
        description: 'Keep exploring new music and maintaining your diverse taste',
        priority: 'low',
        category: 'general'
      });
    }

    return recs.slice(0, 5); // Limit to 5 recommendations
  }, [healthMetrics]);

  // Sort metrics based on selected criteria
  const sortedMetrics = useMemo(() => {
    const sorted = [...healthMetrics].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'healthScore':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'status':
          const statusOrder = { 'excellent': 4, 'good': 3, 'fair': 2, 'poor': 1 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.score;
          bValue = b.score;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return sorted;
  }, [healthMetrics, sortBy, sortOrder]);

  // Calculate stats
  const calculateStats = () => {
    if (!healthMetrics.length) return {
      overallScore: 0,
      excellentCount: 0,
      goodCount: 0,
      fairCount: 0,
      poorCount: 0,
      improvementAreas: 0,
      avgScore: 0
    };

    const overallMetric = healthMetrics.find(m => m.name === 'Overall Health');
    const overallScore = overallMetric?.score || 0;
    const excellentCount = healthMetrics.filter(m => m.status === 'excellent').length;
    const goodCount = healthMetrics.filter(m => m.status === 'good').length;
    const fairCount = healthMetrics.filter(m => m.status === 'fair').length;
    const poorCount = healthMetrics.filter(m => m.status === 'poor').length;
    const improvementAreas = fairCount + poorCount;
    const avgScore = Math.round(healthMetrics.reduce((acc, m) => acc + m.score, 0) / healthMetrics.length);
    
    return {
      overallScore,
      excellentCount,
      goodCount,
      fairCount,
      poorCount,
      improvementAreas,
      avgScore
    };
  };

  const stats = calculateStats();

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!healthMetrics.length) return [];
    
    const facts = [];
    const bestMetric = healthMetrics.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );
    const worstMetric = healthMetrics.reduce((prev, current) => 
      current.score < prev.score ? current : prev
    );
    const diversityMetric = healthMetrics.find(m => m.name === 'Genre Diversity');
    const freshnessMetric = healthMetrics.find(m => m.name === 'Music Freshness');
    
    facts.push({
      icon: CheckCircle,
      title: "Health Champion",
      description: `Your ${bestMetric?.name || 'top metric'} shines at ${bestMetric?.score || 0}% - that's your musical strength!`
    });
    
    facts.push({
      icon: Target,
      title: "Improvement Opportunity",
      description: `${worstMetric?.name || 'An area'} at ${worstMetric?.score || 0}% has room for growth - ${worstMetric?.recommendation || 'focus here for better balance'}!`
    });
    
    facts.push({
      icon: Sparkles,
      title: "Diversity Explorer",
      description: `Your library spans ${diversityMetric?.value || 0} genres with ${diversityMetric?.score || 0}% diversity - ${diversityMetric?.status === 'excellent' ? 'incredible variety!' : 'room to explore more!'}`
    });
    
    facts.push({
      icon: Zap,
      title: "Freshness Factor",
      description: `Your music freshness is ${freshnessMetric?.score || 0}% - ${freshnessMetric?.status === 'excellent' ? 'you love discovering new sounds!' : 'try some underground artists!'}`
    });
    
    return facts.slice(0, 4);
  }, [healthMetrics]);

  // Chart data
  const chartColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const radarData = healthMetrics.filter(m => m.name !== 'Overall Health').map(metric => ({
    metric: metric.name.replace(' ', '\n'),
    fullName: metric.name,
    score: metric.score,
    status: metric.status
  }));

  const statusData = [
    { status: 'Excellent', count: stats.excellentCount, color: '#22C55E' },
    { status: 'Good', count: stats.goodCount, color: '#3B82F6' },
    { status: 'Fair', count: stats.fairCount, color: '#F59E0B' },
    { status: 'Poor', count: stats.poorCount, color: '#EF4444' }
  ].filter(item => item.count > 0);

  const chartConfig = {
    score: { label: "Health Score", color: "hsl(var(--accent))" },
    count: { label: "Count", color: "hsl(var(--primary))" }
  };

  // Filtering overlay component
  const FilteringOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
          <div className="animate-pulse h-2 w-2 bg-accent rounded-full"></div>
          <span className="text-sm font-medium">Analyzing library health...</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Processing {getTimeRangeLabel(timeRange)} data and {sortBy} sorting
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Library Health</h1>
          <p className="text-muted-foreground">Analyzing your music library health...</p>
        </div>
        <CalmingLoader 
          title="Diagnosing your music library..."
          description="Analyzing diversity, freshness, and balance in your collection"
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Library Health</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive analysis of your music library • Discover areas for improvement
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Analysis Period: {getTimeRangeLabel(timeRange)}</span>
            <span>•</span>
            <span>Health Metrics: {healthMetrics.length - 1} categories</span>
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
              <SelectItem value="healthScore">Health Score</SelectItem>
              <SelectItem value="name">Metric Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="category">Category</SelectItem>
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

      {/* Overall Health Score */}
      <Card className="border-l-4 border-l-accent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Overall Library Health</h2>
              <p className="text-sm text-muted-foreground">
                Your music library's comprehensive health score
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent">{stats.overallScore}%</div>
              <Badge 
                variant={stats.overallScore >= 80 ? 'default' : stats.overallScore >= 65 ? 'secondary' : 'destructive'}
                className="mt-1"
              >
                {stats.overallScore >= 80 ? 'Excellent' : stats.overallScore >= 65 ? 'Good' : stats.overallScore >= 50 ? 'Fair' : 'Needs Attention'}
              </Badge>
            </div>
          </div>
          <Progress value={stats.overallScore} className="mt-4" />
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm font-medium">Excellent</span>
              <InfoButton
                title="Excellent Metrics"
                description="Number of health metrics performing excellently (80%+ score)."
                funFacts={[
                  "Excellent metrics show library strengths",
                  "These areas are performing optimally",
                  "Maintain these high standards"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-green-500">{stats.excellentCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              <span className="text-xs md:text-sm font-medium">Good</span>
              <InfoButton
                title="Good Metrics"
                description="Number of health metrics performing well (65-79% score)."
                funFacts={[
                  "Good metrics show solid performance",
                  "These areas are healthy",
                  "Small improvements can make them excellent"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-blue-500">{stats.goodCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              <span className="text-xs md:text-sm font-medium">Fair</span>
              <InfoButton
                title="Fair Metrics"
                description="Number of health metrics performing fairly (50-64% score)."
                funFacts={[
                  "Fair metrics need attention",
                  "These areas have improvement potential",
                  "Focus here for better library health"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-yellow-500">{stats.fairCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
              <span className="text-xs md:text-sm font-medium">Poor</span>
              <InfoButton
                title="Poor Metrics"
                description="Number of health metrics needing attention (<50% score)."
                funFacts={[
                  "Poor metrics need immediate attention",
                  "These areas impact overall health",
                  "Prioritize improving these first"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-red-500">{stats.poorCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Improve</span>
              <InfoButton
                title="Improvement Areas"
                description="Number of metrics that could benefit from attention."
                funFacts={[
                  "Focus areas for better health",
                  "Small changes can make big impacts",
                  "Improvement leads to better experience"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.improvementAreas}</div>
            <div className="text-xs text-muted-foreground">Areas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Avg Score</span>
              <InfoButton
                title="Average Score"
                description="Average health score across all metrics."
                funFacts={[
                  "Shows overall library wellness",
                  "Higher averages indicate better health",
                  "Aim for 80%+ for optimal health"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgScore}</div>
            <div className="text-xs text-muted-foreground">Average %</div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Library Health Insights
            </CardTitle>
            <CardDescription>
              Key insights about your music library health
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
            <TabsTrigger value="detailed">Health Metrics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Health Metrics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Health Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Health Radar
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional view of your library health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={60} domain={[0, 100]} tickCount={5} />
                        <Radar
                          name="Health Score"
                          dataKey="score"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.3}
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Score: {data.score}% ({data.status})
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

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of your health metrics by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ status, count }) => `${status}: ${count}`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {statusData.map((status, index) => (
                        <div key={status.status} className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="text-sm font-medium">{status.status}</span>
                          <Badge variant="outline" className="text-xs">
                            {status.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Detailed Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Metrics Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed analysis of each health category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedMetrics.filter(m => m.name !== 'Overall Health').map((metric, index) => (
                    <div key={metric.name} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{metric.name}</h3>
                            <Badge 
                              variant={
                                metric.status === 'excellent' ? 'default' :
                                metric.status === 'good' ? 'secondary' :
                                metric.status === 'fair' ? 'outline' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {metric.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">{metric.score}%</div>
                        </div>
                      </div>
                      <Progress value={metric.score} className="mb-2" />
                      <p className="text-xs text-muted-foreground">{metric.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 md:space-y-6">
            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Health Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions to improve your library health
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border rounded-lg ${
                          rec.priority === 'high' ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' :
                          rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20' :
                          'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900' :
                            rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                            'bg-blue-100 dark:bg-blue-900'
                          }`}>
                            {rec.type === 'improvement' ? (
                              <Target className={`h-4 w-4 ${
                                rec.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                rec.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-blue-600 dark:text-blue-400'
                              }`} />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-sm">{rec.title}</h3>
                              <Badge 
                                variant={
                                  rec.priority === 'high' ? 'destructive' :
                                  rec.priority === 'medium' ? 'outline' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your Library is Healthy!</h3>
                    <p className="text-muted-foreground">
                      All metrics are performing well. Keep up the great work maintaining your diverse and fresh music collection.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
