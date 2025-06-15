
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { BarChart3, Clock, Calendar, TrendingUp, Music, Headphones, Gem } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

export const EnhancedListeningPatterns = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [activeTab, setActiveTab] = useState('patterns');
  
  const { useTopTracks, useTopArtists } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);

  const isLoading = tracksLoading || artistsLoading;

  const patternsAnalysis = useMemo(() => {
    if (!topTracksData?.items || !topArtistsData?.items) {
      return { 
        hourlyPattern: [],
        weeklyPattern: [],
        monthlyTrends: [],
        insights: [],
        hiddenGems: []
      };
    }

    const tracks = topTracksData.items;

    // Simulate hourly listening pattern
    const hourlyPattern = Array.from({ length: 24 }, (_, hour) => {
      const baseListening = hour < 6 ? 10 : hour < 12 ? 70 : hour < 18 ? 80 : hour < 22 ? 90 : 30;
      const variation = Math.random() * 20 - 10;
      return {
        hour: hour.toString().padStart(2, '0') + ':00',
        listening: Math.max(0, Math.round(baseListening + variation))
      };
    });

    // Simulate weekly pattern
    const weeklyPattern = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      listening: Math.round(60 + Math.random() * 40),
      discovery: Math.round(10 + Math.random() * 20)
    }));

    // Simulate monthly trends
    const monthlyTrends = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
      month,
      tracks: Math.round(20 + Math.random() * 30),
      artists: Math.round(8 + Math.random() * 12),
      genres: Math.round(4 + Math.random() * 6)
    }));

    // Calculate hidden gems for this component
    const hiddenGems = tracks.filter(track => (track.popularity || 0) < 40).map(track => ({
      ...track,
      gemScore: (50 - (track.popularity || 0)) + Math.random() * 20,
      rarity: (track.popularity || 0) < 20 ? 'Ultra Rare' : 
              (track.popularity || 0) < 30 ? 'Very Rare' : 'Rare'
    })).sort((a, b) => b.gemScore - a.gemScore);

    const insights = [
      `Peak listening time is between ${hourlyPattern.reduce((max, curr) => curr.listening > max.listening ? curr : max).hour}`,
      `Most active day for music discovery: ${weeklyPattern.reduce((max, curr) => curr.discovery > max.discovery ? curr : max).day}`,
      `Your listening activity shows ${hourlyPattern.filter(h => h.listening > 70).length} hours of high activity`,
      `Found ${hiddenGems.length} hidden gems in your listening patterns`
    ];

    return { hourlyPattern, weeklyPattern, monthlyTrends, insights, hiddenGems };
  }, [topTracksData, topArtistsData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Listening Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Listening Patterns Analysis
          <InfoButton
            title="Listening Patterns Analysis"
            description="Analyze your music listening behavior across different time periods. Discover when you're most active, what patterns emerge in your listening habits, and identify your hidden musical gems."
            calculation="Patterns are analyzed from your listening data including hourly activity, weekly trends, and monthly discovery rates. Charts show simulated data based on typical listening behaviors for demonstration purposes."
            funFacts={[
              "Most people listen to more music in the evening",
              "Weekend listening patterns often differ from weekdays",
              "Discovery rates tend to be higher during leisure time",
              "Hidden gems often emerge during exploratory listening sessions"
            ]}
            metrics={[
              { label: "Peak Hours", value: "6-10 PM", description: "Most active listening time" },
              { label: "Discovery Days", value: "Weekends", description: "When you find new music" },
              { label: "Hidden Gems", value: patternsAnalysis.hiddenGems.length.toString(), description: "Rare tracks you love" }
            ]}
          />
        </CardTitle>
        <CardDescription>
          Discover when and how you listen to music across different time periods
        </CardDescription>
        <div className="flex items-center gap-4 mt-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short_term">Last 4 Weeks</SelectItem>
              <SelectItem value="medium_term">Last 6 Months</SelectItem>
              <SelectItem value="long_term">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patterns">Time Patterns</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-6">
            {/* Hourly Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Daily Listening Pattern
                </CardTitle>
                <CardDescription>Your music activity throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={patternsAnalysis.hourlyPattern}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hour" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-accent">
                                  Activity: {payload[0].value}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="listening"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Weekly Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Listening & Discovery
                </CardTitle>
                <CardDescription>How your listening varies throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={patternsAnalysis.weeklyPattern}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-accent">
                                  Listening: {payload[0].value}%
                                </p>
                                <p className="text-sm text-primary">
                                  Discovery: {payload[1].value}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="listening" fill="hsl(var(--accent))" />
                      <Bar dataKey="discovery" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Discovery Trends
                </CardTitle>
                <CardDescription>Track your music discovery over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patternsAnalysis.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium">{label}</p>
                                {payload.map((entry, index) => (
                                  <p key={index} className="text-sm" style={{ color: entry.color }}>
                                    {entry.dataKey}: {entry.value}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="tracks" stroke="hsl(var(--accent))" strokeWidth={2} />
                      <Line type="monotone" dataKey="artists" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="genres" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hidden-gems" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Pattern-Based Hidden Gems
                  <Badge variant="secondary">{patternsAnalysis.hiddenGems.length} found</Badge>
                </CardTitle>
                <CardDescription>
                  Hidden gems discovered through your listening patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patternsAnalysis.hiddenGems.length > 0 ? (
                  <div className="space-y-3">
                    {patternsAnalysis.hiddenGems.slice(0, 10).map((track, index) => (
                      <div key={track.id || index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/20">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
                            <Gem className="h-4 w-4 text-white" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{track.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist'}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {track.popularity}/100
                              </span>
                            </div>
                          </div>
                        </div>

                        <Badge 
                          variant="secondary" 
                          className="bg-accent/10 text-accent border-accent/20 text-xs"
                        >
                          {track.rarity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gem className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Hidden Gems Found</h3>
                    <p className="text-muted-foreground">
                      Explore more underground music to discover hidden gems!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Pattern Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patternsAnalysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                  <Music className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
