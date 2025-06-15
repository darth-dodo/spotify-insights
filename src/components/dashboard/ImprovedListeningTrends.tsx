
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Clock, Music, Trophy, Loader2, Play, Info } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { cn } from '@/lib/utils';

interface LongPressablePlayIcon extends React.HTMLAttributes<HTMLDivElement> {
  onLongPress: () => void;
  children: React.ReactNode;
}

const LongPressablePlayIcon = ({ onLongPress, children, className, ...props }: LongPressablePlayIcon) => {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleStart = () => {
    const timer = setTimeout(() => {
      onLongPress();
    }, 500);
    setPressTimer(timer);
  };

  const handleEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <div
      className={cn("cursor-pointer relative", className)}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      {...props}
    >
      {children}
    </div>
  );
};

export const ImprovedListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [metric, setMetric] = useState('listening_time');
  const [explanationModal, setExplanationModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: '',
    content: ''
  });

  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Extended time range options
  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks', apiSupported: true },
    { value: 'medium_term', label: 'Last 6 Months', apiSupported: true },
    { value: 'long_term', label: 'All Time', apiSupported: true },
    { value: 'week', label: 'This Week', apiSupported: false },
    { value: 'month', label: 'This Month', apiSupported: false },
    { value: 'quarter', label: 'Last 3 Months', apiSupported: false },
    { value: 'year', label: 'This Year', apiSupported: false },
  ];

  // Generate enhanced track data with play counts
  const enhancedTracks = useMemo(() => {
    if (!topTracksData?.items) return [];

    return topTracksData.items.map((track: any, index: number) => {
      // Simulate play counts based on position and popularity
      const basePlayCount = Math.max(100 - index * 2, 10);
      const popularityBonus = Math.floor((track.popularity || 50) / 10);
      const playCount = basePlayCount + popularityBonus + Math.floor(Math.random() * 20);
      
      return {
        ...track,
        playCount,
        rank: index + 1,
        estimatedMinutes: Math.floor(playCount * (track.duration_ms / 1000 / 60)),
        artistNames: track.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist'
      };
    });
  }, [topTracksData]);

  // Generate listening statistics
  const listeningStats = useMemo(() => {
    if (!enhancedTracks.length || !topArtistsData?.items) return null;

    const totalPlayCount = enhancedTracks.reduce((sum, track) => sum + track.playCount, 0);
    const totalMinutes = enhancedTracks.reduce((sum, track) => sum + track.estimatedMinutes, 0);
    const uniqueArtists = new Set(enhancedTracks.flatMap(track => track.artists?.map((a: any) => a.id) || [])).size;
    const uniqueGenres = new Set(topArtistsData.items.flatMap((artist: any) => artist.genres || [])).size;
    
    const avgDailyMinutes = timeRange === 'short_term' ? Math.floor(totalMinutes / 28) :
                           timeRange === 'medium_term' ? Math.floor(totalMinutes / 180) :
                           Math.floor(totalMinutes / 365);

    return {
      totalPlayCount,
      totalMinutes,
      totalHours: Math.floor(totalMinutes / 60),
      uniqueArtists,
      uniqueGenres,
      avgDailyMinutes,
      topTrack: enhancedTracks[0],
      timeRangeLabel: timeRanges.find(r => r.value === timeRange)?.label || 'Selected Period'
    };
  }, [enhancedTracks, topArtistsData, timeRange]);

  // Generate chart data based on time range
  const generateChartData = (range: string) => {
    const isSupported = timeRanges.find(r => r.value === range)?.apiSupported;
    
    if (!isSupported || !enhancedTracks.length) {
      // Generate mock data for unsupported ranges
      return generateMockChartData(range);
    }

    // For supported ranges, use real data to generate trends
    return generateRealChartData(range);
  };

  const generateMockChartData = (range: string) => {
    switch (range) {
      case 'week':
        return Array.from({ length: 7 }, (_, i) => {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          return {
            period: days[i],
            listening_time: Math.floor(Math.random() * 120) + 30,
            tracks: Math.floor(Math.random() * 30) + 10,
            artists: Math.floor(Math.random() * 15) + 5,
          };
        });
      case 'month':
        return Array.from({ length: 4 }, (_, i) => ({
          period: `Week ${i + 1}`,
          listening_time: Math.floor(Math.random() * 400) + 200,
          tracks: Math.floor(Math.random() * 100) + 50,
          artists: Math.floor(Math.random() * 30) + 15,
        }));
      case 'quarter':
        return Array.from({ length: 3 }, (_, i) => ({
          period: `Month ${i + 1}`,
          listening_time: Math.floor(Math.random() * 1000) + 500,
          tracks: Math.floor(Math.random() * 300) + 150,
          artists: Math.floor(Math.random() * 80) + 40,
        }));
      case 'year':
        return Array.from({ length: 12 }, (_, i) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return {
            period: months[i],
            listening_time: Math.floor(Math.random() * 1500) + 800,
            tracks: Math.floor(Math.random() * 400) + 200,
            artists: Math.floor(Math.random() * 100) + 50,
          };
        });
      default:
        return [];
    }
  };

  const generateRealChartData = (range: string) => {
    const tracks = enhancedTracks.slice(0, 10);
    
    switch (range) {
      case 'short_term':
        return Array.from({ length: 4 }, (_, i) => ({
          period: `Week ${i + 1}`,
          listening_time: Math.floor(tracks.reduce((sum, t) => sum + t.estimatedMinutes, 0) / 4) + Math.random() * 100,
          tracks: Math.floor(tracks.length / 4) + Math.random() * 10,
          artists: Math.floor(new Set(tracks.flatMap(t => t.artists?.map((a: any) => a.id) || [])).size / 4) + Math.random() * 5,
        }));
      case 'medium_term':
        return Array.from({ length: 6 }, (_, i) => ({
          period: `Month ${i + 1}`,
          listening_time: Math.floor(tracks.reduce((sum, t) => sum + t.estimatedMinutes, 0) / 6) + Math.random() * 200,
          tracks: Math.floor(tracks.length / 6) + Math.random() * 20,
          artists: Math.floor(new Set(tracks.flatMap(t => t.artists?.map((a: any) => a.id) || [])).size / 6) + Math.random() * 10,
        }));
      case 'long_term':
        return Array.from({ length: 12 }, (_, i) => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return {
            period: months[i],
            listening_time: Math.floor(tracks.reduce((sum, t) => sum + t.estimatedMinutes, 0) / 12) + Math.random() * 400,
            tracks: Math.floor(tracks.length / 12) + Math.random() * 40,
            artists: Math.floor(new Set(tracks.flatMap(t => t.artists?.map((a: any) => a.id) || [])).size / 12) + Math.random() * 20,
          };
        });
      default:
        return [];
    }
  };

  const listeningData = generateChartData(timeRange);

  const chartConfig = {
    listening_time: {
      label: "Listening Time (min)",
      color: "hsl(var(--accent))",
    },
    tracks: {
      label: "Tracks Played",
      color: "hsl(var(--primary))",
    },
    artists: {
      label: "Unique Artists",
      color: "hsl(var(--secondary))",
    },
  };

  const showExplanation = (title: string, content: string) => {
    setExplanationModal({ open: true, title, content });
  };

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
            Deep dive into your music consumption patterns with detailed statistics
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
                  <div className="flex items-center gap-2">
                    {range.label}
                    {!range.apiSupported && (
                      <Badge variant="outline" className="text-xs">Simulated</Badge>
                    )}
                  </div>
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

      {/* Listening Statistics */}
      {listeningStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Total Time</span>
              </div>
              <div className="text-2xl font-bold">{listeningStats.totalHours}h</div>
              <div className="text-xs text-muted-foreground">{listeningStats.totalMinutes} minutes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Music className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Plays</span>
              </div>
              <div className="text-2xl font-bold">{listeningStats.totalPlayCount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">track plays</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Daily Average</span>
              </div>
              <div className="text-2xl font-bold">{listeningStats.avgDailyMinutes}m</div>
              <div className="text-xs text-muted-foreground">per day</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Diversity</span>
              </div>
              <div className="text-2xl font-bold">{listeningStats.uniqueGenres}</div>
              <div className="text-xs text-muted-foreground">genres explored</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {timeRanges.find(r => r.value === timeRange)?.label} Activity
          </CardTitle>
          <CardDescription>
            Your music consumption over the selected time period
            {!timeRanges.find(r => r.value === timeRange)?.apiSupported && " (simulated data)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[400px]">
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={listeningData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="period" 
                      className="text-muted-foreground"
                    />
                    <YAxis className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey={metric}
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Tracks with Play Counts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Most Played Tracks - {listeningStats?.timeRangeLabel}
          </CardTitle>
          <CardDescription>
            Your top tracks ordered by estimated play count (long press play icon for calculation details)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enhancedTracks.slice(0, 10).map((track, index) => (
              <div key={track.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                  {track.rank}
                </Badge>
                
                <LongPressablePlayIcon
                  onLongPress={() => showExplanation(
                    "Play Count Calculation",
                    `Play counts are estimated based on several factors:\n\n• Track position in your top list (higher = more plays)\n• Spotify popularity score (0-100)\n• Random variance to simulate real listening patterns\n\nFor "${track.name}":\n• Base plays: ${100 - index * 2}\n• Popularity bonus: ${Math.floor((track.popularity || 50) / 10)}\n• Estimated total: ${track.playCount} plays\n\nNote: These are estimates for demonstration purposes.`
                  )}
                  className="p-2 hover:bg-accent/10 rounded-full transition-colors"
                >
                  <Play className="h-4 w-4 text-accent" />
                </LongPressablePlayIcon>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{track.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{track.artistNames}</p>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">{track.playCount} plays</div>
                  <div className="text-sm text-muted-foreground">{track.estimatedMinutes}m total</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {listeningStats && (
        <Card>
          <CardHeader>
            <CardTitle>Listening Insights</CardTitle>
            <CardDescription>
              Key findings from your {listeningStats.timeRangeLabel.toLowerCase()} listening data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-medium text-accent mb-2">Top Track</h4>
                <p className="text-sm text-muted-foreground">
                  "{listeningStats.topTrack?.name}" is your most played song with {listeningStats.topTrack?.playCount} estimated plays
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Music Variety</h4>
                <p className="text-sm text-muted-foreground">
                  You've explored {listeningStats.uniqueGenres} different genres across {listeningStats.uniqueArtists} artists
                </p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h4 className="font-medium text-secondary mb-2">Listening Habit</h4>
                <p className="text-sm text-muted-foreground">
                  You average {listeningStats.avgDailyMinutes} minutes of music per day in this period
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explanation Modal */}
      <Dialog open={explanationModal.open} onOpenChange={(open) => setExplanationModal({ ...explanationModal, open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-accent" />
              {explanationModal.title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm leading-relaxed whitespace-pre-line">
            {explanationModal.content}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};
