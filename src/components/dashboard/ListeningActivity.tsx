
import React, { useState } from 'react';
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
  User
} from 'lucide-react';

export const ListeningActivity = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed, useCurrentPlayback } = useSpotifyData();
  const [timeRange, setTimeRange] = useState('medium_term');
  const [limit, setLimit] = useState(50);

  const topTracks = useTopTracks(timeRange, limit);
  const topArtists = useTopArtists(timeRange, limit);
  const recentlyPlayed = useRecentlyPlayed(limit);
  const currentPlayback = useCurrentPlayback();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#a45de2'];

  // Mock data for charts
  const mockChartData = [
    { name: 'Genre A', value: 400 },
    { name: 'Genre B', value: 300 },
    { name: 'Genre C', value: 300 },
    { name: 'Genre D', value: 200 },
  ];

  const mockLineData = [
    { time: '00:00', plays: 10 },
    { time: '01:00', plays: 15 },
    { time: '02:00', plays: 12 },
    { time: '03:00', plays: 18 },
    { time: '04:00', plays: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Listening Activity</h1>
        <p className="text-muted-foreground">
          Track your listening habits and discover trends in your music taste
        </p>
      </div>

      {/* Time Range and Limit Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Settings</CardTitle>
          <CardDescription>Adjust the time range and limit for your listening data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Time Range</h4>
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
            </div>
            <div>
              <h4 className="font-medium mb-2">Limit</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={limit === 10 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLimit(10)}
                >
                  Top 10
                </Button>
                <Button 
                  variant={limit === 25 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLimit(25)}
                >
                  Top 25
                </Button>
                <Button 
                  variant={limit === 50 ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setLimit(50)}
                >
                  Top 50
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Playback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Currently Playing
          </CardTitle>
          <CardDescription>See what you're currently listening to</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPlayback.isLoading ? (
            <p>Loading current playback...</p>
          ) : currentPlayback.data ? (
            <div className="flex items-center gap-4">
              <img 
                src={currentPlayback.data.item.album.images[0].url} 
                alt={currentPlayback.data.item.name} 
                className="w-20 h-20 rounded-md" 
              />
              <div>
                <h4 className="font-medium">{currentPlayback.data.item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentPlayback.data.item.artists.map((artist: any) => artist.name).join(', ')}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="secondary" size="icon"><SkipForward className="h-4 w-4" /></Button>
                  <Button variant="secondary" size="icon"><Repeat className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ) : (
            <p>No current playback detected.</p>
          )}
        </CardContent>
      </Card>

      {/* Top Tracks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Top Tracks
          </CardTitle>
          <CardDescription>Your most listened tracks in the selected time range</CardDescription>
        </CardHeader>
        <CardContent>
          {topTracks.isLoading ? (
            <p>Loading top tracks...</p>
          ) : topTracks.data ? (
            <ul className="space-y-2">
              {topTracks.data.items.map((track: any, index: number) => (
                <li key={track.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{index + 1}.</span>
                    <img 
                      src={track.album.images[0].url} 
                      alt={track.name} 
                      className="w-10 h-10 rounded-md" 
                    />
                    <div>
                      <h4 className="font-medium">{track.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {track.artists.map((artist: any) => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Play className="h-3 w-3 mr-1" />
                    {track.popularity}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p>No top tracks data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Top Artists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Top Artists
          </CardTitle>
          <CardDescription>Your most listened artists in the selected time range</CardDescription>
        </CardHeader>
        <CardContent>
          {topArtists.isLoading ? (
            <p>Loading top artists...</p>
          ) : topArtists.data ? (
            <ul className="space-y-2">
              {topArtists.data.items.map((artist: any, index: number) => (
                <li key={artist.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{index + 1}.</span>
                    <img 
                      src={artist.images[0].url} 
                      alt={artist.name} 
                      className="w-10 h-10 rounded-full" 
                    />
                    <h4 className="font-medium">{artist.name}</h4>
                  </div>
                  <Badge variant="secondary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {artist.popularity}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p>No top artists data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Recently Played */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recently Played
          </CardTitle>
          <CardDescription>Your most recent listening history</CardDescription>
        </CardHeader>
        <CardContent>
          {recentlyPlayed.isLoading ? (
            <p>Loading recently played tracks...</p>
          ) : recentlyPlayed.data ? (
            <ul className="space-y-2">
              {recentlyPlayed.data.items.map((item: any, index: number) => (
                <li key={item.played_at} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{index + 1}.</span>
                    <img 
                      src={item.track.album.images[0].url} 
                      alt={item.track.name} 
                      className="w-10 h-10 rounded-md" 
                    />
                    <div>
                      <h4 className="font-medium">{item.track.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.track.artists.map((artist: any) => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.played_at).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recently played data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Charts and Visualizations */}
      <Card>
        <CardHeader>
          <CardTitle>Listening Trends</CardTitle>
          <CardDescription>Visualize your listening habits over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="genres" className="space-y-4">
            <TabsList>
              <TabsTrigger value="genres">Top Genres</TabsTrigger>
              <TabsTrigger value="activity">Activity Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="genres">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={mockChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {mockChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="activity">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="plays" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
