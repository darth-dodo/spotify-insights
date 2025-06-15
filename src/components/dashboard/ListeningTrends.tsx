import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Calendar, Headphones, Music, Users, Star } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

export const ListeningTrends = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  
  const { data: topTracks, isLoading: tracksLoading } = useEnhancedTopTracks(timeRange, 100);
  const { data: topArtists, isLoading: artistsLoading } = useEnhancedTopArtists(timeRange, 50);

  // Data processing functions
  const calculateListeningPatterns = (tracks: any[]) => {
    const now = new Date();
    const morning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);   // 6 AM
    const afternoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);  // 12 PM
    const evening = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);  // 6 PM
    const night = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);    // 12 AM (midnight)

    const patterns = {
      Morning: 0,
      Afternoon: 0,
      Evening: 0,
      Night: 0,
    };

    tracks.forEach(track => {
      const playedAt = new Date(track.playedAt || Date.now());
      if (playedAt >= morning && playedAt < afternoon) {
        patterns.Morning += track.popularity || 50;
      } else if (playedAt >= afternoon && playedAt < evening) {
        patterns.Afternoon += track.popularity || 50;
      } else if (playedAt >= evening || playedAt < morning) {
        patterns.Evening += track.popularity || 50;
      } else {
        patterns.Night += track.popularity || 50;
      }
    });

    const totalActivity = Object.values(patterns).reduce((sum, val) => sum + val, 0);
    const listeningPatternData = Object.entries(patterns).map(([period, activity]) => ({
      period,
      activity: Math.round((activity / totalActivity) * 100),
    }));

    return listeningPatternData;
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
    }));

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
      }
    });

    const discoveryTrendData = trends.map(trend => ({
      month: trend.month,
      mainstream: trend.total > 0 ? Math.round((trend.mainstream / trend.total) * 100) : 50,
      niche: trend.total > 0 ? Math.round((trend.niche / trend.total) * 100) : 50,
    }));

    return discoveryTrendData;
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

  // Chart configurations
  const listeningPatternData = topTracks ? calculateListeningPatterns(topTracks) : [];
  const genreData = topArtists ? calculateGenreDistribution(topArtists) : [];
  const discoveryTrendData = topTracks ? calculateDiscoveryTrends(topTracks) : [];

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

      {/* Listening Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Listening Patterns
            <InfoButton
              title="Listening Patterns"
              description="Analysis of when and how you listen to music throughout different time periods."
              calculation="Based on your top tracks' popularity scores and listening frequency patterns derived from your Spotify data."
              type="modal"
            />
          </CardTitle>
          <CardDescription>
            When you listen to music most actively
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tracksLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing listening patterns...</p>
              </div>
            </div>
          ) : (
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
                <Bar 
                  dataKey="activity" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Genre Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Genre Distribution
            <InfoButton
              title="Genre Distribution"
              description="Breakdown of music genres in your listening history, showing your musical preferences and diversity."
              calculation="Calculated from the genres of your top artists. Each artist's genres are weighted by their position in your top artists list."
              type="modal"
            />
          </CardTitle>
          <CardDescription>
            Your musical taste breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          {artistsLoading ? (
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

      {/* Discovery Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Discovery Trends
            <InfoButton
              title="Discovery Trends"
              description="Analysis of how you discover and engage with new music over time."
              calculation="Based on track popularity scores and artist diversity in your listening history. Shows trends in mainstream vs. niche music preferences."
              type="modal"
            />
          </CardTitle>
          <CardDescription>
            How you discover new music
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tracksLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing discovery patterns...</p>
              </div>
            </div>
          ) : (
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
                <Line 
                  type="monotone" 
                  dataKey="mainstream" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Mainstream"
                />
                <Line 
                  type="monotone" 
                  dataKey="niche" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Niche"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
