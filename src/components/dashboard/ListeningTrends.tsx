
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, Clock, Music } from 'lucide-react';

export const ListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [metric, setMetric] = useState('listening_time');

  // Mock data for charts
  const listeningData = [
    { day: 'Mon', listening_time: 45, tracks: 12, artists: 8 },
    { day: 'Tue', listening_time: 67, tracks: 18, artists: 12 },
    { day: 'Wed', listening_time: 89, tracks: 24, artists: 15 },
    { day: 'Thu', listening_time: 76, tracks: 21, artists: 13 },
    { day: 'Fri', listening_time: 123, tracks: 35, artists: 22 },
    { day: 'Sat', listening_time: 156, tracks: 42, artists: 28 },
    { day: 'Sun', listening_time: 134, tracks: 38, artists: 25 },
  ];

  const hourlyData = [
    { hour: '6AM', value: 5 },
    { hour: '9AM', value: 15 },
    { hour: '12PM', value: 25 },
    { hour: '3PM', value: 35 },
    { hour: '6PM', value: 45 },
    { hour: '9PM', value: 65 },
    { hour: '12AM', value: 25 },
  ];

  const genreData = [
    { genre: 'Rock', percentage: 35, minutes: 245 },
    { genre: 'Pop', percentage: 28, minutes: 196 },
    { genre: 'Electronic', percentage: 18, minutes: 126 },
    { genre: 'Hip Hop', percentage: 12, minutes: 84 },
    { genre: 'Jazz', percentage: 7, minutes: 49 },
  ];

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
          <h1 className="text-3xl font-bold text-foreground">Listening Trends</h1>
          <p className="text-muted-foreground">
            Analyze your music consumption patterns over time
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
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
            Daily Listening Activity
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
                  dataKey="day" 
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
        {/* Hourly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hourly Distribution
            </CardTitle>
            <CardDescription>
              When you listen to music most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Genre Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Genre Breakdown
            </CardTitle>
            <CardDescription>
              Your musical taste distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {genreData.map((genre, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{genre.genre}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{genre.percentage}%</Badge>
                    <span className="text-sm text-muted-foreground">
                      {genre.minutes}m
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${genre.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Patterns</CardTitle>
          <CardDescription>
            AI-powered insights about your listening habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="font-medium text-accent mb-2">Peak Listening</h4>
              <p className="text-sm text-muted-foreground">
                You listen to music most on Friday evenings, averaging 2.5 hours
              </p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-medium text-primary mb-2">Music Discovery</h4>
              <p className="text-sm text-muted-foreground">
                You discovered 23 new artists this month, up 15% from last month
              </p>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <h4 className="font-medium text-secondary mb-2">Consistency</h4>
              <p className="text-sm text-muted-foreground">
                Your listening habits are 78% consistent week over week
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
