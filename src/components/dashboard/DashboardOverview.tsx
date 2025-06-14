
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Play, Heart } from 'lucide-react';

export const DashboardOverview = () => {
  // Mock data - in production this would come from Spotify API
  const stats = {
    totalTracks: 1234,
    totalArtists: 456,
    listeningTime: 789,
    topGenre: 'Alternative Rock',
    recentlyPlayed: 25,
    savedTracks: 567
  };

  const topTracks = [
    { name: 'Song Title 1', artist: 'Artist Name', plays: 42, duration: '3:45' },
    { name: 'Song Title 2', artist: 'Artist Name', plays: 38, duration: '4:12' },
    { name: 'Song Title 3', artist: 'Artist Name', plays: 35, duration: '3:28' },
  ];

  const topArtists = [
    { name: 'Artist 1', plays: 156, followers: '2.1M' },
    { name: 'Artist 2', plays: 143, followers: '1.8M' },
    { name: 'Artist 3', plays: 128, followers: '3.2M' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back! 🎵
        </h1>
        <p className="text-muted-foreground">
          Here's your music listening overview for this month
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalTracks}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.listeningTime}h</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalArtists}</div>
            <p className="text-xs text-muted-foreground">
              +23 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tracks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Tracks This Month
            </CardTitle>
            <CardDescription>
              Your most played songs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-accent-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{track.plays} plays</p>
                  <p className="text-xs text-muted-foreground">{track.duration}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Tracks
            </Button>
          </CardContent>
        </Card>

        {/* Top Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Artists This Month
            </CardTitle>
            <CardDescription>
              Artists you listen to most
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topArtists.map((artist, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center text-accent-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{artist.name}</p>
                    <p className="text-sm text-muted-foreground">{artist.followers} followers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{artist.plays} plays</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Artists
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Explore your music data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Trends</span>
              <span className="text-xs text-muted-foreground">Time-based analysis</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Music className="h-6 w-6" />
              <span>Genre Analysis</span>
              <span className="text-xs text-muted-foreground">Musical preferences</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Heart className="h-6 w-6" />
              <span>Saved Music</span>
              <span className="text-xs text-muted-foreground">Your library</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
