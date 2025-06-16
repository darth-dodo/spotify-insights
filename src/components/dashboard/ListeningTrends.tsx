import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';
import { TrendingUp, Clock, Calendar, Headphones, Music, Users, Star, Activity, Heart, Sparkles } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const { useEnhancedTopTracks, useEnhancedTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracks, isLoading: tracksLoading } = useEnhancedTopTracks(timeRange, 100);
  const { data: topArtists, isLoading: artistsLoading } = useEnhancedTopArtists(timeRange, 50);
  const { data: recentlyPlayed, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Enhanced data processing functions
  const calculateListeningPatterns = (tracks: any[]) => {
    const now = new Date();
    const morning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);   // 6 AM
    const afternoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);  // 12 PM
    const evening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);  // 6 PM
    const night = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);    // 12 AM (midnight)

    const patterns = {
      Morning: { count: 0, duration: 0 },
      Afternoon: { count: 0, duration: 0 },
      Evening: { count: 0, duration: 0 },
      Night: { count: 0, duration: 0 },
    };

    tracks.forEach(track => {
      const playedAt = new Date(track.playedAt || Date.now());
      const duration = track.duration_ms / 1000 / 60; // Convert to minutes

      if (playedAt >= morning && playedAt < afternoon) {
        patterns.Morning.count++;
        patterns.Morning.duration += duration;
      } else if (playedAt >= afternoon && playedAt < evening) {
        patterns.Afternoon.count++;
        patterns.Afternoon.duration += duration;
      } else if (playedAt >= evening || playedAt < morning) {
        patterns.Evening.count++;
        patterns.Evening.duration += duration;
      } else {
        patterns.Night.count++;
        patterns.Night.duration += duration;
      }
    });

    return Object.entries(patterns).map(([period, data]) => ({
      period,
      count: data.count,
      duration: Math.round(data.duration),
      activity: Math.round((data.duration / Object.values(patterns).reduce((sum, p) => sum + p.duration, 0)) * 100),
    }));
  };

  const calculateMoodAnalysis = (tracks: any[]) => {
    const moods = {
      Energetic: { count: 0, energy: 0, tempo: 0 },
      Relaxed: { count: 0, energy: 0, tempo: 0 },
      Happy: { count: 0, energy: 0, tempo: 0 },
      Melancholic: { count: 0, energy: 0, tempo: 0 },
    };

    tracks.forEach(track => {
      const energy = track.audio_features?.energy || 0.5;
      const tempo = track.audio_features?.tempo || 120;
      const valence = track.audio_features?.valence || 0.5;

      if (energy > 0.7 && tempo > 120) {
        moods.Energetic.count++;
        moods.Energetic.energy += energy;
        moods.Energetic.tempo += tempo;
      } else if (energy < 0.3 && tempo < 100) {
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
      avgEnergy: Math.round((data.energy / data.count) * 100) || 0,
      avgTempo: Math.round(data.tempo / data.count) || 0,
    }));
  };

  const calculateConsistencyMetrics = (tracks: any[]) => {
    const dailyPlays = new Map();
    const weeklyPlays = new Map();
    const monthlyPlays = new Map();

    tracks.forEach(track => {
      const playedAt = new Date(track.playedAt || Date.now());
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
      totalMonths: monthlyPlays.size,
    };
  };

  const calculateGenreDistribution = (artists: any[]) => {
    const genreCounts: { [genre: string]: number } = {};
    artists.forEach(artist => {
      artist.genres?.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const totalGenres = Object.values(genreCounts).reduce((sum, val) => sum + val, 0);
    const genreData = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalGenres) * 100),
        color: getRandomColor(),
      }));

    return genreData;
  };

  const calculateDiscoveryTrends = (tracks: any[]) => {
    const now = new Date();
    const months = [...Array(6)].map((_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return date.toLocaleString('default', { month: 'short', year: '2-digit' });
    }).reverse();

    const trends = months.map(month => ({
      month,
      mainstream: 0,
      niche: 0,
      total: 0,
      newArtists: 0,
      repeatArtists: 0,
    }));

    const artistFirstSeen = new Map();

    tracks.forEach(track => {
      const playedAt = new Date(track.playedAt || Date.now());
      const month = playedAt.toLocaleString('default', { month: 'short', year: '2-digit' });
      const trend = trends.find(t => t.month === month);

      if (trend) {
        trend.total++;
        if (track.popularity > 50) {
          trend.mainstream++;
        } else {
          trend.niche++;
        }

        // Track artist discovery
        track.artists?.forEach((artist: any) => {
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
      mainstream: trend.total > 0 ? Math.round((trend.mainstream / trend.total) * 100) : 50,
      niche: trend.total > 0 ? Math.round((trend.niche / trend.total) * 100) : 50,
      newArtists: trend.newArtists,
      repeatArtists: trend.repeatArtists,
    }));
  };

  // Helper function to generate random colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Calculate all metrics
  const listeningPatternData = useMemo(() => topTracks ? calculateListeningPatterns(topTracks) : [], [topTracks]);
  const moodData = useMemo(() => topTracks ? calculateMoodAnalysis(topTracks) : [], [topTracks]);
  const consistencyMetrics = useMemo(() => topTracks ? calculateConsistencyMetrics(topTracks) : null, [topTracks]);
  const genreData = useMemo(() => topArtists ? calculateGenreDistribution(topArtists) : [], [topArtists]);
  const discoveryTrendData = useMemo(() => topTracks ? calculateDiscoveryTrends(topTracks) : [], [topTracks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Listening Trends
          </h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short_term">Last 4 Weeks</SelectItem>
              <SelectItem value="medium_term">Last 6 Months</SelectItem>
              <SelectItem value="long_term">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground">
          Discover patterns in your music listening habits
        </p>
      </div>

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patterns">Listening Patterns</TabsTrigger>
          <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
          <TabsTrigger value="discovery">Discovery Trends</TabsTrigger>
          <TabsTrigger value="genres">Genre Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Listening Patterns
                <InfoButton
                  title="Listening Patterns"
                  description="Analysis of when and how you listen to music throughout different time periods."
                  calculation="Based on your top tracks' play counts and durations, showing your most active listening periods."
                  variant="modal"
                />
              </CardTitle>
              <CardDescription>
                When you listen to music most actively
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing listening patterns...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={listeningPatternData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="period" 
                        fontSize={12}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="activity" 
                        name="Activity %"
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="count" 
                        name="Track Count"
                        fill="hsl(var(--accent))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  {consistencyMetrics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Daily Consistency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{Math.round(consistencyMetrics.dailyVariance)}</p>
                          <p className="text-sm text-muted-foreground">Variance in daily plays</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Weekly Consistency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{Math.round(consistencyMetrics.weeklyVariance)}</p>
                          <p className="text-sm text-muted-foreground">Variance in weekly plays</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Monthly Consistency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{Math.round(consistencyMetrics.monthlyVariance)}</p>
                          <p className="text-sm text-muted-foreground">Variance in monthly plays</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Mood Analysis
                <InfoButton
                  title="Mood Analysis"
                  description="Analysis of the emotional characteristics of your music based on audio features."
                  calculation="Based on track energy, tempo, and valence (musical positivity) to determine the mood of your music."
                  variant="modal"
                />
              </CardTitle>
              <CardDescription>
                The emotional characteristics of your music
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing mood patterns...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="mood" 
                        fontSize={12}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <Tooltip />
                      <Legend />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moodData.map((mood) => (
                      <Card key={mood.mood}>
                        <CardHeader>
                          <CardTitle className="text-sm">{mood.mood}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{mood.count}</p>
                          <p className="text-sm text-muted-foreground">tracks</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Discovery Trends
                <InfoButton
                  title="Discovery Trends"
                  description="Analysis of your music discovery patterns and preferences over time."
                  calculation="Based on track popularity and artist discovery patterns, showing your exploration of new music."
                  variant="modal"
                />
              </CardTitle>
              <CardDescription>
                Your music exploration patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing discovery patterns...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={discoveryTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        fontSize={12}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'var(--foreground)' }}
                      />
                      <Tooltip />
                      <Legend />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">New Artists</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {discoveryTrendData.reduce((sum, month) => sum + month.newArtists, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">discovered this period</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Repeat Artists</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {discoveryTrendData.reduce((sum, month) => sum + month.repeatArtists, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">revisited this period</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genres">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Genre Distribution
                <InfoButton
                  title="Genre Distribution"
                  description="Breakdown of music genres in your listening history, showing your musical preferences and diversity."
                  calculation="Calculated from the genres of your top artists. Each artist's genres are weighted by their position in your top artists list."
                  variant="modal"
                />
              </CardTitle>
              <CardDescription>
                Your musical taste breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing genres...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-3">
                    {genreData.slice(0, 6).map((genre, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: genre.color }}
                          />
                          <span className="text-sm font-medium">{genre.name}</span>
                        </div>
                        <Badge variant="outline">{genre.value}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
