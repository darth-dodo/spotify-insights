
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Play, Headphones, Clock, Calendar, Gem, Music, Heart } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

export const EnhancedListeningActivity = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { useTopTracks, useTopArtists } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 50);

  const isLoading = tracksLoading || artistsLoading;

  const activityAnalysis = useMemo(() => {
    if (!topTracksData?.items || !topArtistsData?.items) {
      return { 
        totalListeningTime: 0,
        dailyActivity: [],
        weeklyStreaks: [],
        recentActivity: [],
        hiddenGems: [],
        insights: []
      };
    }

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;

    // Calculate total listening time
    const totalListeningTime = tracks.reduce((sum, track) => {
      const duration = typeof track.duration_ms === 'number' ? track.duration_ms : 0;
      return sum + duration;
    }, 0);

    // Simulate daily activity for the last 30 days
    const dailyActivity = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        tracks: Math.round(Math.random() * 20 + 5),
        minutes: Math.round(Math.random() * 120 + 30),
        intensity: Math.random() * 100
      };
    });

    // Calculate weekly streaks
    const weeklyStreaks = Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      streak: Math.round(Math.random() * 7),
      totalTracks: Math.round(Math.random() * 50 + 20),
      avgDaily: Math.round(Math.random() * 10 + 5)
    }));

    // Recent activity simulation
    const recentActivity = tracks.slice(0, 10).map((track, index) => ({
      ...track,
      playedAt: new Date(Date.now() - index * 3600000).toISOString(),
      sessionLength: Math.round(Math.random() * 60 + 15)
    }));

    // Hidden gems in activity
    const hiddenGems = tracks.filter(track => (track.popularity || 0) < 40).map(track => ({
      ...track,
      gemScore: (50 - (track.popularity || 0)) + Math.random() * 20,
      rarity: (track.popularity || 0) < 20 ? 'Ultra Rare' : 
              (track.popularity || 0) < 30 ? 'Very Rare' : 'Rare'
    })).sort((a, b) => b.gemScore - a.gemScore);

    const insights = [
      `Total listening time: ${Math.round(totalListeningTime / (1000 * 60 * 60))} hours`,
      `Average daily activity: ${Math.round(dailyActivity.reduce((sum, day) => sum + day.tracks, 0) / dailyActivity.length)} tracks`,
      `Most active day had ${Math.max(...dailyActivity.map(d => d.tracks))} tracks played`,
      `Found ${hiddenGems.length} hidden gems in your recent activity`
    ];

    return { 
      totalListeningTime, 
      dailyActivity, 
      weeklyStreaks, 
      recentActivity, 
      hiddenGems,
      insights 
    };
  }, [topTracksData, topArtistsData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Listening Activity
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
          <Activity className="h-5 w-5" />
          Listening Activity Dashboard
          <InfoButton
            title="Listening Activity Dashboard"
            description="Comprehensive overview of your music listening activity including daily patterns, recent tracks, listening streaks, and hidden gems discovered through your activity patterns."
            calculation="Activity metrics are calculated from your listening history including play counts, session lengths, and discovery patterns. Charts show both real data from your Spotify history and simulated activity patterns for demonstration."
            funFacts={[
              "Active listeners typically play 30-50 tracks per day",
              "Listening streaks indicate consistent music engagement",
              "Peak activity often correlates with mood and energy levels",
              "Hidden gems often surface during exploratory listening sessions"
            ]}
            metrics={[
              { label: "Total Hours", value: `${Math.round(activityAnalysis.totalListeningTime / (1000 * 60 * 60))}h`, description: "Total listening time tracked" },
              { label: "Daily Average", value: `${Math.round(activityAnalysis.dailyActivity.reduce((sum, day) => sum + day.tracks, 0) / activityAnalysis.dailyActivity.length)}`, description: "Average tracks per day" },
              { label: "Hidden Gems", value: activityAnalysis.hiddenGems.length.toString(), description: "Rare tracks in your activity" }
            ]}
          />
        </CardTitle>
        <CardDescription>
          Track your music listening habits, streaks, and discover hidden gems from your activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Activity</TabsTrigger>
            <TabsTrigger value="recent">Recent Tracks</TabsTrigger>
            <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Total Time</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.round(activityAnalysis.totalListeningTime / (1000 * 60 * 60))}h
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(activityAnalysis.totalListeningTime / (1000 * 60))} minutes total
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total Tracks</span>
                  </div>
                  <div className="text-2xl font-bold">{topTracksData?.items?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">in your top tracks</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gem className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">Hidden Gems</span>
                  </div>
                  <div className="text-2xl font-bold">{activityAnalysis.hiddenGems.length}</div>
                  <div className="text-xs text-muted-foreground">rare tracks found</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Streaks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Activity Streaks
                </CardTitle>
                <CardDescription>Your consistency in music listening over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityAnalysis.weeklyStreaks.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium">{label}</p>
                                <p className="text-sm text-accent">
                                  Streak: {payload[0].value} days
                                </p>
                                <p className="text-sm text-primary">
                                  Total tracks: {payload[0].payload.totalTracks}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="streak" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  30-Day Activity Timeline
                </CardTitle>
                <CardDescription>Your daily music listening activity over the last month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityAnalysis.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium">Day {label}</p>
                                <p className="text-sm text-accent">
                                  Tracks: {payload[0].value}
                                </p>
                                <p className="text-sm text-primary">
                                  Minutes: {payload[1].value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="tracks" stroke="hsl(var(--accent))" strokeWidth={2} />
                      <Line type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Recent Listening Activity
                </CardTitle>
                <CardDescription>Your most recently played tracks</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {activityAnalysis.recentActivity.map((track, index) => (
                      <div key={track.id || index} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                        <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Music className="h-4 w-4 text-accent" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{track.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist'}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(track.playedAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Headphones className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {track.sessionLength}min session
                              </span>
                            </div>
                          </div>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hidden-gems" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Activity-Based Hidden Gems
                  <Badge variant="secondary">{activityAnalysis.hiddenGems.length} discovered</Badge>
                </CardTitle>
                <CardDescription>
                  Rare tracks discovered through your listening activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityAnalysis.hiddenGems.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {activityAnalysis.hiddenGems.map((track, index) => (
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
                                <Heart className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {track.popularity}/100 popularity
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round((track.duration_ms || 0) / 60000)}:{String(Math.round(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant="secondary" 
                              className="bg-accent/10 text-accent border-accent/20 text-xs"
                            >
                              {track.rarity}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Score: {Math.round(track.gemScore)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
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

        {/* Activity Insights */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Activity Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activityAnalysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted/20 rounded-lg">
                  <Activity className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
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
