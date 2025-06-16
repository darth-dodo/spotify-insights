import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  TooltipProps
} from 'recharts';
import { TrendingUp, Calendar, Clock, Music, Trophy, Loader2, Headphones, Users, Star, Activity, Heart, Sparkles } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

interface ListeningPatterns {
  hourly: Array<{
    hour: string;
    count: number;
    percentage: number;
  }>;
  daily: Array<{
    day: string;
    count: number;
    percentage: number;
  }>;
  weekly: Array<{
    week: string;
    count: number;
    percentage: number;
  }>;
  monthly: Array<{
    month: string;
    count: number;
    percentage: number;
  }>;
}

interface MoodAnalysis {
  mood: string;
  count: number;
  avgEnergy: number;
  avgTempo: number;
}

interface DiscoveryTrends {
  month: string;
  mainstream: number;
  niche: number;
  newArtists: number;
  repeatArtists: number;
}

interface ConsistencyMetrics {
  dailyVariance: number;
  weeklyVariance: number;
  monthlyVariance: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
}

export const EnhancedListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [metric, setMetric] = useState('listening_time');
  const [activeTab, setActiveTab] = useState('overview');

  const { useEnhancedTopTracks, useEnhancedTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  // Fetch data based on time range
  const getSpotifyTimeRange = (range: string) => {
    switch (range) {
      case 'week':
      case 'fortnight':
        return 'short_term'; // ~4 weeks
      case 'month':
      case 'three_months':
      case 'six_months':
        return 'medium_term'; // ~6 months
      default:
        return 'long_term'; // several years
    }
  };

  // Use centralized store for comprehensive data (2000 items)
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Generate current year and previous 4 years
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 0; i < 4; i++) {
    const year = currentYear - i;
    yearOptions.push({ value: year.toString(), label: year.toString() });
  }

  // Extended time range options with previous years
  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'fortnight', label: 'Last 2 Weeks' },
    { value: 'month', label: 'This Month' },
    { value: 'three_months', label: 'Last 3 Months' },
    { value: 'six_months', label: 'Last 6 Months' },
    { value: 'year', label: 'This Year' },
    ...yearOptions,
    { value: 'all_time', label: 'All Time' }
  ];

  // Calculate listening patterns
  const listeningPatterns = useMemo((): ListeningPatterns => {
    if (!recentlyPlayedData?.items) return {
      hourly: [],
      daily: [],
      weekly: [],
      monthly: []
    };

    const patterns = {
      hourly: Array(24).fill(0),
      daily: Array(7).fill(0),
      weekly: Array(4).fill(0),
      monthly: Array(12).fill(0)
    };

    recentlyPlayedData.items.forEach((item: any) => {
      const playedAt = new Date(item.played_at);
      const hour = playedAt.getHours();
      const day = playedAt.getDay();
      const week = Math.floor(playedAt.getDate() / 7);
      const month = playedAt.getMonth();

      patterns.hourly[hour]++;
      patterns.daily[day]++;
      patterns.weekly[week]++;
      patterns.monthly[month]++;
    });

    return {
      hourly: patterns.hourly.map((count, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        count,
        percentage: Math.round((count / Math.max(...patterns.hourly)) * 100)
      })),
      daily: patterns.daily.map((count, day) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
        count,
        percentage: Math.round((count / Math.max(...patterns.daily)) * 100)
      })),
      weekly: patterns.weekly.map((count, week) => ({
        week: `Week ${week + 1}`,
        count,
        percentage: Math.round((count / Math.max(...patterns.weekly)) * 100)
      })),
      monthly: patterns.monthly.map((count, month) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month],
        count,
        percentage: Math.round((count / Math.max(...patterns.monthly)) * 100)
      }))
    };
  }, [recentlyPlayedData]);

  // Calculate mood analysis
  const moodAnalysis = useMemo((): MoodAnalysis[] => {
    if (!tracks.length) return [];

    const moods = {
      Energetic: { count: 0, energy: 0, tempo: 0 },
      Relaxed: { count: 0, energy: 0, tempo: 0 },
      Happy: { count: 0, energy: 0, tempo: 0 },
      Melancholic: { count: 0, energy: 0, tempo: 0 }
    };

    tracks.forEach((track: any) => {
      const energy = track.energy || 0.5;
      const tempo = track.tempo || 120;
      const valence = track.valence || 0.5;

      if (energy > 0.7 && tempo > 120) {
        moods.Energetic.count++;
        moods.Energetic.energy += energy;
        moods.Energetic.tempo += tempo;
      } else if (energy < 0.4 && tempo < 100) {
        moods.Relaxed.count++;
        moods.Relaxed.energy += energy;
        moods.Relaxed.tempo += tempo;
      } else if (valence > 0.6) {
        moods.Happy.count++;
        moods.Happy.energy += energy;
        moods.Happy.tempo += tempo;
      } else {
        moods.Melancholic.count++;
        moods.Melancholic.energy += energy;
        moods.Melancholic.tempo += tempo;
      }
    });

    return Object.entries(moods).map(([mood, data]) => ({
      mood,
      count: data.count,
      avgEnergy: Math.round((data.energy / data.count) * 100),
      avgTempo: Math.round(data.tempo / data.count)
    }));
  }, [tracks]);

  // Calculate genre distribution
  const genreDistribution = useMemo(() => {
    if (!artists.length) return [];

    const genres: { [key: string]: number } = {};
    artists.forEach((artist: any) => {
      artist.genres?.forEach((genre: string) => {
        genres[genre] = (genres[genre] || 0) + 1;
      });
    });

    const total = Object.values(genres).reduce((sum, count) => sum + count, 0);
    return Object.entries(genres)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [artists]);

  // Calculate discovery trends
  const discoveryTrends = useMemo((): DiscoveryTrends[] => {
    if (!recentlyPlayedData?.items) return [];

    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    }).reverse();

    const trends = months.map(month => ({
      month,
      mainstream: 0,
      niche: 0,
      total: 0,
      newArtists: 0,
      repeatArtists: 0
    }));

    const artistFirstSeen = new Map();

    recentlyPlayedData.items.forEach((item: any) => {
      const playedAt = new Date(item.played_at);
      const month = playedAt.toLocaleString('default', { month: 'short', year: '2-digit' });
      const trend = trends.find(t => t.month === month);

      if (trend) {
        trend.total++;
        if (item.track?.popularity > 50) {
          trend.mainstream++;
        } else {
          trend.niche++;
        }

        item.track?.artists?.forEach((artist: any) => {
          if (!artistFirstSeen.has(artist.id)) {
            artistFirstSeen.set(artist.id, month);
            trend.newArtists++;
          } else if (artistFirstSeen.get(artist.id) === month) {
            trend.repeatArtists++;
          }
        });
      }
    });

    return trends.map(trend => ({
      month: trend.month,
      mainstream: trend.total > 0 ? Math.round((trend.mainstream / trend.total) * 100) : 0,
      niche: trend.total > 0 ? Math.round((trend.niche / trend.total) * 100) : 0,
      newArtists: trend.newArtists,
      repeatArtists: trend.repeatArtists
    }));
  }, [recentlyPlayedData]);

  // Calculate consistency metrics
  const consistencyMetrics = useMemo((): ConsistencyMetrics | null => {
    if (!recentlyPlayedData?.items) return null;

    const dailyPlays = new Map();
    const weeklyPlays = new Map();
    const monthlyPlays = new Map();

    recentlyPlayedData.items.forEach((item: any) => {
      const playedAt = new Date(item.played_at);
      const dayKey = playedAt.toISOString().split('T')[0];
      const weekKey = `${playedAt.getFullYear()}-W${Math.ceil((playedAt.getDate() + playedAt.getDay()) / 7)}`;
      const monthKey = `${playedAt.getFullYear()}-${playedAt.getMonth() + 1}`;

      dailyPlays.set(dayKey, (dailyPlays.get(dayKey) || 0) + 1);
      weeklyPlays.set(weekKey, (weeklyPlays.get(weekKey) || 0) + 1);
      monthlyPlays.set(monthKey, (monthlyPlays.get(monthKey) || 0) + 1);
    });

    const calculateVariance = (values: number[]) => {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    };

    return {
      dailyVariance: calculateVariance([...dailyPlays.values()]),
      weeklyVariance: calculateVariance([...weeklyPlays.values()]),
      monthlyVariance: calculateVariance([...monthlyPlays.values()]),
      totalDays: dailyPlays.size,
      totalWeeks: weeklyPlays.size,
      totalMonths: monthlyPlays.size
    };
  }, [recentlyPlayedData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Enhanced Listening Trends</h1>
          <p className="text-muted-foreground">Loading your listening data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enhanced Listening Trends</h1>
          <p className="text-muted-foreground">
            Deep dive into your music consumption patterns across different time periods
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="listening_time">Listening Time</SelectItem>
              <SelectItem value="tracks">Tracks Played</SelectItem>
              <SelectItem value="artists">Unique Artists</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Listening Patterns</TabsTrigger>
          <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
          <TabsTrigger value="discovery">Discovery Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hourly Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hourly Listening Pattern
                  <InfoButton
                    title="Hourly Listening Pattern"
                    description="Shows your listening activity distribution across different hours of the day."
                    calculation="Based on your recently played tracks, normalized to show relative activity levels."
                    funFacts={[
                      "Most people listen to more music during commute hours",
                      "Late night listening often indicates night owl tendencies",
                      "Morning listening can reveal workout or commute routines"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={listeningPatterns.hourly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Listening Pattern
                  <InfoButton
                    title="Daily Listening Pattern"
                    description="Shows your listening activity distribution across different days of the week."
                    calculation="Based on your recently played tracks, normalized to show relative activity levels."
                    funFacts={[
                      "Weekend listening patterns often differ from weekdays",
                      "Friday is typically the most active listening day",
                      "Sunday often shows different genre preferences"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={listeningPatterns.daily}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="percentage"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Genre Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Top Genres
                  <InfoButton
                    title="Genre Distribution"
                    description="Shows the distribution of genres in your listening history."
                    calculation="Based on your top artists' genres, normalized to show percentage distribution."
                    funFacts={[
                      "Most people have 3-5 dominant genres",
                      "Genre preferences often change with seasons",
                      "Your top genres can reveal your cultural background"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {genreDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${(index * 360) / genreDistribution.length}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Consistency Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Listening Consistency
                  <InfoButton
                    title="Listening Consistency"
                    description="Shows how consistent your listening habits are across different time periods."
                    calculation="Based on variance in daily, weekly, and monthly listening activity."
                    funFacts={[
                      "Consistent listeners often have daily routines",
                      "High variance can indicate mood-based listening",
                      "Weekend spikes often indicate social listening"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Daily Variance</h4>
                      <div className="text-2xl font-bold">
                        {consistencyMetrics ? Math.round(consistencyMetrics.dailyVariance) : 0}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Weekly Variance</h4>
                      <div className="text-2xl font-bold">
                        {consistencyMetrics ? Math.round(consistencyMetrics.weeklyVariance) : 0}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Monthly Variance</h4>
                      <div className="text-2xl font-bold">
                        {consistencyMetrics ? Math.round(consistencyMetrics.monthlyVariance) : 0}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Active Days</h4>
                      <div className="text-2xl font-bold">
                        {consistencyMetrics?.totalDays || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Active Weeks</h4>
                      <div className="text-2xl font-bold">
                        {consistencyMetrics?.totalWeeks || 0}
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="text-sm font-medium mb-1">Active Months</h4>
                      <div className="text-2xl font-bold">
                        {consistencyMetrics?.totalMonths || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patterns Tab */}
        <TabsContent value="patterns">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weekly Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Pattern
                  <InfoButton
                    title="Weekly Pattern"
                    description="Shows your listening activity distribution across weeks."
                    calculation="Based on your recently played tracks, normalized to show relative activity levels."
                    funFacts={[
                      "Weekly patterns often reflect work/school schedules",
                      "Holiday weeks often show different patterns",
                      "Seasonal changes can affect weekly patterns"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={listeningPatterns.weekly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="percentage"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Pattern
                  <InfoButton
                    title="Monthly Pattern"
                    description="Shows your listening activity distribution across months."
                    calculation="Based on your recently played tracks, normalized to show relative activity levels."
                    funFacts={[
                      "Monthly patterns often reflect seasonal changes",
                      "Holiday months show different listening habits",
                      "New Year often brings new music discoveries"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={listeningPatterns.monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="percentage"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mood Tab */}
        <TabsContent value="mood">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mood Analysis
                  <InfoButton
                    title="Mood Analysis"
                    description="Shows the distribution of moods in your listening history."
                    calculation="Based on track energy, tempo, and valence values."
                    funFacts={[
                      "Mood preferences often change with time of day",
                      "Weather can influence mood-based listening",
                      "Social situations affect mood choices"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moodAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="mood" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="avgEnergy"
                      name="Energy Level"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="avgTempo"
                      name="Tempo (BPM)"
                      fill="hsl(var(--accent))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mood Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Mood Distribution
                  <InfoButton
                    title="Mood Distribution"
                    description="Shows the percentage distribution of different moods in your listening history."
                    calculation="Based on track energy, tempo, and valence values."
                    funFacts={[
                      "Most people have 2-3 dominant moods",
                      "Mood preferences often reflect personality",
                      "Life events can shift mood preferences"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moodAnalysis}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {moodAnalysis.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${(index * 360) / moodAnalysis.length}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Discovery Tab */}
        <TabsContent value="discovery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discovery Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Discovery Trends
                  <InfoButton
                    title="Discovery Trends"
                    description="Shows your music discovery patterns over time."
                    calculation="Based on track popularity and artist discovery dates."
                    funFacts={[
                      "Discovery patterns often reflect life changes",
                      "Social events can boost discovery rates",
                      "Seasonal changes affect discovery habits"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={discoveryTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mainstream"
                      name="Mainstream %"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="niche"
                      name="Niche %"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Artist Discovery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Artist Discovery
                  <InfoButton
                    title="Artist Discovery"
                    description="Shows your new artist discovery patterns over time."
                    calculation="Based on first-time artist appearances in your listening history."
                    funFacts={[
                      "Artist discovery often peaks during festivals",
                      "Social recommendations boost discovery",
                      "Genre exploration increases discovery rates"
                    ]}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={discoveryTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="newArtists"
                      name="New Artists"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="repeatArtists"
                      name="Repeat Artists"
                      fill="hsl(var(--accent))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
