
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, Clock, Music, Headphones, Activity, Zap } from 'lucide-react';

export const ListeningActivity = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [metric, setMetric] = useState('listening_time');
  const [chartType, setChartType] = useState('line');

  // Enhanced mock data
  const weeklyData = [
    { day: 'Mon', listening_time: 45, tracks: 12, artists: 8, energy: 65, focus_time: 25 },
    { day: 'Tue', listening_time: 67, tracks: 18, artists: 12, energy: 72, focus_time: 35 },
    { day: 'Wed', listening_time: 89, tracks: 24, artists: 15, energy: 78, focus_time: 45 },
    { day: 'Thu', listening_time: 76, tracks: 21, artists: 13, energy: 68, focus_time: 38 },
    { day: 'Fri', listening_time: 123, tracks: 35, artists: 22, energy: 85, focus_time: 60 },
    { day: 'Sat', listening_time: 156, tracks: 42, artists: 28, energy: 90, focus_time: 80 },
    { day: 'Sun', listening_time: 134, tracks: 38, artists: 25, energy: 82, focus_time: 70 },
  ];

  const hourlyData = [
    { hour: '6AM', value: 5, mood: 'calm' },
    { hour: '9AM', value: 15, mood: 'energetic' },
    { hour: '12PM', value: 25, mood: 'focused' },
    { hour: '3PM', value: 35, mood: 'productive' },
    { hour: '6PM', value: 45, mood: 'relaxed' },
    { hour: '9PM', value: 65, mood: 'social' },
    { hour: '12AM', value: 25, mood: 'wind-down' },
  ];

  const streakData = {
    current: 12,
    longest: 28,
    thisWeek: 7,
    avgSession: 45
  };

  const chartConfig = {
    listening_time: { label: "Minutes", color: "hsl(var(--accent))" },
    tracks: { label: "Tracks", color: "hsl(var(--primary))" },
    artists: { label: "Artists", color: "hsl(var(--secondary))" },
    energy: { label: "Energy Level", color: "hsl(var(--accent))" },
    focus_time: { label: "Focus Time", color: "hsl(var(--chart-2))" },
  };

  const renderChart = () => {
    const props = {
      data: weeklyData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...props}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey={metric}
              stroke="hsl(var(--accent))" 
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...props}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-muted-foreground" />
            <YAxis className="text-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey={metric}
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      default:
        return (
          <LineChart {...props}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" className="text-muted-foreground" />
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
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Listening Activity</h1>
          <p className="text-muted-foreground">
            Deep dive into your music consumption patterns and habits
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
              <SelectItem value="energy">Energy Level</SelectItem>
              <SelectItem value="focus_time">Focus Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-accent">{streakData.current} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Longest Streak</span>
            </div>
            <div className="text-2xl font-bold">{streakData.longest} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">This Week</span>
            </div>
            <div className="text-2xl font-bold">{streakData.thisWeek}/7 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Session</span>
            </div>
            <div className="text-2xl font-bold">{streakData.avgSession}m</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Overview
          </CardTitle>
          <CardDescription>
            Your music consumption patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hourly">Hourly Patterns</TabsTrigger>
          <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hourly Distribution
              </CardTitle>
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
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hourlyData.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">{item.hour}</div>
                  <div className="text-lg font-bold">{item.value}min</div>
                  <Badge variant="secondary" className="text-xs">
                    {item.mood}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Peak Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Your most productive listening happens on weekends, with Saturday being your peak day.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Weekend Warrior</Badge>
                  <Badge variant="outline">Night Owl</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Listening Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  You maintain consistent daily listening with strong weekend spikes.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Consistency Score</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discovery Rate</span>
                    <span className="font-medium">23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
