import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Clock, 
  TrendingUp, 
  Calendar, 
  Music, 
  Play,
  SkipForward,
  Repeat,
  User,
  Database,
  Activity
} from 'lucide-react';
import { InfoButton } from '@/components/ui/InfoButton';

interface HeatmapData {
  day: string;
  hour: number;
  activity: number;
}

export const ListeningActivity = () => {
  const { useEnhancedTopTracks, useEnhancedTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [timeRange, setTimeRange] = useState('medium_term');
  const [limit, setLimit] = useState(1000);

  const { data: topTracks = [], isLoading: tracksLoading } = useEnhancedTopTracks(timeRange, limit);
  const { data: topArtists = [], isLoading: artistsLoading } = useEnhancedTopArtists(timeRange, limit);
  const { data: recentlyPlayed, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Calculate heatmap data from recently played tracks
  const heatmapData = useMemo(() => {
    if (!recentlyPlayed?.items) return [];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data: HeatmapData[] = [];

    // Initialize data structure
    days.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        data.push({ day, hour, activity: 0 });
      }
    });

    // Process recently played tracks
    recentlyPlayed.items.forEach((item: any) => {
      const playedAt = new Date(item.played_at);
      const day = days[playedAt.getDay()];
      const hour = playedAt.getHours();
      
      const dataPoint = data.find(d => d.day === day && d.hour === hour);
      if (dataPoint) {
        dataPoint.activity += 1;
      }
    });

    // Normalize activity values to percentages
    const maxActivity = Math.max(...data.map(d => d.activity));
    if (maxActivity > 0) {
      data.forEach(d => {
        d.activity = Math.round((d.activity / maxActivity) * 100);
      });
    }

    return data;
  }, [recentlyPlayed]);

  const getActivityColor = (activity: number) => {
    if (activity === 0) return 'bg-muted';
    if (activity < 20) return 'bg-primary/20';
    if (activity < 40) return 'bg-primary/40';
    if (activity < 60) return 'bg-primary/60';
    if (activity < 80) return 'bg-primary/80';
    return 'bg-primary';
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate time of day distribution
  const timeOfDayDistribution = useMemo(() => {
    if (!recentlyPlayed?.items) return [];

    const distribution = {
      Morning: { count: 0, label: 'Morning (6AM-12PM)' },
      Afternoon: { count: 0, label: 'Afternoon (12PM-6PM)' },
      Evening: { count: 0, label: 'Evening (6PM-12AM)' },
      Night: { count: 0, label: 'Night (12AM-6AM)' }
    };

    recentlyPlayed.items.forEach((item: any) => {
      const hour = new Date(item.played_at).getHours();
      if (hour >= 6 && hour < 12) distribution.Morning.count++;
      else if (hour >= 12 && hour < 18) distribution.Afternoon.count++;
      else if (hour >= 18 && hour < 24) distribution.Evening.count++;
      else distribution.Night.count++;
    });

    return Object.values(distribution);
  }, [recentlyPlayed]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Listening Activity</h1>
        <p className="text-muted-foreground">
          Track your listening habits and discover patterns in your music consumption
        </p>
        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
          <Database className="h-3 w-3" />
          Full Dataset ({topTracks.length || 0} tracks, {topArtists.length || 0} artists)
        </Badge>
      </div>

      {/* Time Range Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Settings</CardTitle>
          <CardDescription>Adjust the time range for your listening data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={timeRange === 'short_term' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('short_term')}
            >
              Last Month
            </Button>
            <Button 
              variant={timeRange === 'medium_term' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('medium_term')}
            >
              Last 6 Months
            </Button>
            <Button 
              variant={timeRange === 'long_term' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('long_term')}
            >
              All Time
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Listening Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Listening Patterns
            <InfoButton
              title="Listening Patterns Analysis"
              description="Visual representation of your music listening activity across different days and times."
              calculation="Data is derived from your recently played tracks. Activity levels are normalized to show relative listening intensity."
              funFacts={[
                "Most people listen to more music during evenings and weekends",
                "Morning listening often indicates commute or workout routines",
                "Late night listening can reveal your night owl tendencies",
                "Weekend patterns often differ from weekday patterns"
              ]}
              metrics={[
                { label: "Peak Time", value: "Evening", description: "Most active listening period" },
                { label: "Peak Day", value: "Weekend", description: "Most active listening day" },
                { label: "Data Points", value: recentlyPlayed?.items?.length.toString() || "0", description: "Recent tracks analyzed" }
              ]}
            />
          </CardTitle>
          <CardDescription>Your listening activity across different days and times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Time of Day Distribution */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeOfDayDistribution.map((period) => (
                <div key={period.label} className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-1">{period.label}</h4>
                  <div className="text-2xl font-bold">{period.count}</div>
                  <div className="text-sm text-muted-foreground">tracks played</div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="space-y-3">
              {/* Hour labels */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-12">
                {hours.filter((_, i) => i % 4 === 0).map(hour => (
                  <div key={hour} className="w-6 text-center">
                    {hour.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
              
              {/* Heatmap grid */}
              <div className="space-y-1">
                {days.map(day => (
                  <div key={day} className="flex items-center gap-1">
                    <div className="w-10 text-xs font-medium text-muted-foreground">
                      {day}
                    </div>
                    <div className="flex gap-1">
                      {hours.map(hour => {
                        const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                        const activity = dataPoint?.activity || 0;
                        return (
                          <div
                            key={`${day}-${hour}`}
                            className={`w-6 h-6 rounded-sm ${getActivityColor(activity)} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer`}
                            title={`${day} ${hour}:00 - Activity: ${activity}%`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Activity Level:</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-muted rounded-sm" />
                  <div className="w-4 h-4 bg-primary/20 rounded-sm" />
                  <div className="w-4 h-4 bg-primary/40 rounded-sm" />
                  <div className="w-4 h-4 bg-primary/60 rounded-sm" />
                  <div className="w-4 h-4 bg-primary/80 rounded-sm" />
                  <div className="w-4 h-4 bg-primary rounded-sm" />
                </div>
                <span>Low → High</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Dataset Overview</CardTitle>
          <CardDescription>Statistics from your complete music library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">{topTracks.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Tracks</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{topArtists.length || 0}</div>
              <div className="text-sm text-muted-foreground">Unique Artists</div>
            </div>
            <div className="text-center p-4 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {new Set(topArtists.flatMap(artist => artist.genres || [])).size || 0}
              </div>
              <div className="text-sm text-muted-foreground">Genres</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {topTracks.length ? Math.round(topTracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / topTracks.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Popularity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
