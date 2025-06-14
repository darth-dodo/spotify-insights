
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Clock, Music, Trophy } from 'lucide-react';

export const EnhancedListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [metric, setMetric] = useState('listening_time');

  // Extended time range options
  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'fortnight', label: 'Last 2 Weeks' },
    { value: 'month', label: 'This Month' },
    { value: 'three_months', label: 'Last 3 Months' },
    { value: 'six_months', label: 'Last 6 Months' },
    { value: 'year', label: 'This Year' },
    { value: 'all_time', label: 'All Time' }
  ];

  // Mock data for different time ranges
  const getDataForTimeRange = (range: string) => {
    switch (range) {
      case 'week':
        return [
          { period: 'Mon', listening_time: 45, tracks: 12, artists: 8 },
          { period: 'Tue', listening_time: 67, tracks: 18, artists: 12 },
          { period: 'Wed', listening_time: 89, tracks: 24, artists: 15 },
          { period: 'Thu', listening_time: 76, tracks: 21, artists: 13 },
          { period: 'Fri', listening_time: 123, tracks: 35, artists: 22 },
          { period: 'Sat', listening_time: 156, tracks: 42, artists: 28 },
          { period: 'Sun', listening_time: 134, tracks: 38, artists: 25 },
        ];
      case 'month':
        return [
          { period: 'Week 1', listening_time: 420, tracks: 120, artists: 45 },
          { period: 'Week 2', listening_time: 380, tracks: 105, artists: 42 },
          { period: 'Week 3', listening_time: 450, tracks: 135, artists: 48 },
          { period: 'Week 4', listening_time: 520, tracks: 150, artists: 52 },
        ];
      case 'year':
        return [
          { period: 'Jan', listening_time: 1800, tracks: 500, artists: 120 },
          { period: 'Feb', listening_time: 1650, tracks: 450, artists: 115 },
          { period: 'Mar', listening_time: 1920, tracks: 580, artists: 130 },
          { period: 'Apr', listening_time: 1780, tracks: 520, artists: 125 },
          { period: 'May', listening_time: 2100, tracks: 620, artists: 140 },
          { period: 'Jun', listening_time: 2250, tracks: 680, artists: 145 },
        ];
      default:
        return [
          { period: 'Period 1', listening_time: 300, tracks: 80, artists: 30 },
          { period: 'Period 2', listening_time: 350, tracks: 95, artists: 35 },
          { period: 'Period 3', listening_time: 280, tracks: 75, artists: 28 },
          { period: 'Period 4', listening_time: 420, tracks: 110, artists: 40 },
        ];
    }
  };

  const listeningData = getDataForTimeRange(timeRange);

  // Most played tracks data
  const mostPlayedTracks = [
    { track: 'Bohemian Rhapsody', artist: 'Queen', plays: 156, minutes: 936 },
    { track: 'Hotel California', artist: 'Eagles', plays: 142, minutes: 923 },
    { track: 'Stairway to Heaven', artist: 'Led Zeppelin', plays: 138, minutes: 1104 },
    { track: 'Sweet Child O Mine', artist: 'Guns N Roses', plays: 125, minutes: 687 },
    { track: 'Comfortably Numb', artist: 'Pink Floyd', plays: 118, minutes: 708 },
  ];

  // GitHub-style heatmap data (simplified)
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5), // 0-4 intensity levels
        minutes: Math.floor(Math.random() * 240), // 0-240 minutes
      });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

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

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {timeRanges.find(r => r.value === timeRange)?.label} Activity
          </CardTitle>
          <CardDescription>
            Your music consumption over the selected time period
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Played Tracks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Most Played in {timeRanges.find(r => r.value === timeRange)?.label}
            </CardTitle>
            <CardDescription>
              Your top tracks by play count in this period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mostPlayedTracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <h4 className="font-medium">{track.track}</h4>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{track.plays} plays</div>
                  <div className="text-sm text-muted-foreground">{track.minutes}m total</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Listening Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Listening Heatmap
            </CardTitle>
            <CardDescription>
              GitHub-style visualization of your daily listening activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-52 gap-1 text-xs">
                {heatmapData.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      w-3 h-3 rounded-sm border border-border/20 cursor-pointer
                      ${day.count === 0 ? 'bg-muted' : ''}
                      ${day.count === 1 ? 'bg-accent/20' : ''}
                      ${day.count === 2 ? 'bg-accent/40' : ''}
                      ${day.count === 3 ? 'bg-accent/60' : ''}
                      ${day.count === 4 ? 'bg-accent' : ''}
                    `}
                    title={`${day.date}: ${day.minutes} minutes`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-muted border border-border/20 rounded-sm" />
                  <div className="w-3 h-3 bg-accent/20 border border-border/20 rounded-sm" />
                  <div className="w-3 h-3 bg-accent/40 border border-border/20 rounded-sm" />
                  <div className="w-3 h-3 bg-accent/60 border border-border/20 rounded-sm" />
                  <div className="w-3 h-3 bg-accent border border-border/20 rounded-sm" />
                </div>
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Period Insights</CardTitle>
          <CardDescription>
            Key findings from your {timeRanges.find(r => r.value === timeRange)?.label.toLowerCase()} listening data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="font-medium text-accent mb-2">Peak Activity</h4>
              <p className="text-sm text-muted-foreground">
                Your highest listening period was {listeningData.reduce((max, day) => 
                  day.listening_time > max.listening_time ? day : max
                ).period} with {listeningData.reduce((max, day) => 
                  day.listening_time > max.listening_time ? day : max
                ).listening_time} minutes
              </p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-medium text-primary mb-2">Total Listening</h4>
              <p className="text-sm text-muted-foreground">
                {listeningData.reduce((sum, day) => sum + day.listening_time, 0)} minutes across {listeningData.reduce((sum, day) => sum + day.tracks, 0)} tracks
              </p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <h4 className="font-medium text-secondary mb-2">Artist Diversity</h4>
              <p className="text-sm text-muted-foreground">
                Discovered {Math.max(...listeningData.map(d => d.artists))} unique artists in your best week
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
