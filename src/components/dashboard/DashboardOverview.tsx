
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Play, Heart, Loader2 } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export const DashboardOverview = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 10);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(10);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Calculate stats from real data
  const stats = {
    totalTracks: topTracksData?.items?.length || 0,
    totalArtists: topArtistsData?.items?.length || 0,
    listeningTime: recentlyPlayedData?.items?.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60) || 0, // Convert to minutes
    topGenre: topArtistsData?.items?.[0]?.genres?.[0] || 'Unknown',
    recentlyPlayed: recentlyPlayedData?.items?.length || 0,
    savedTracks: topTracksData?.items?.length || 0
  };

  const topTracks = topTracksData?.items?.slice(0, 3)?.map((track: any) => ({
    name: track.name,
    artist: track.artists?.[0]?.name || 'Unknown Artist',
    plays: Math.floor(Math.random() * 50) + 10, // Mock play count
    duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`
  })) || [];

  const topArtists = topArtistsData?.items?.slice(0, 3)?.map((artist: any) => ({
    name: artist.name,
    plays: Math.floor(Math.random() * 200) + 50, // Mock play count
    followers: artist.followers?.total ? 
      (artist.followers.total > 1000000 ? 
        `${(artist.followers.total / 1000000).toFixed(1)}M` : 
        `${(artist.followers.total / 1000).toFixed(0)}K`) : 'Unknown'
  })) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Loading your music data... 🎵</h1>
          <p className="text-muted-foreground">Please wait while we fetch your listening insights</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

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
            <CardTitle className="text-sm font-medium">Top Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalTracks}</div>
            <p className="text-xs text-muted-foreground">
              In your top list
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{Math.round(stats.listeningTime)}m</div>
            <p className="text-xs text-muted-foreground">
              From recent tracks
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Artists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalArtists}</div>
            <p className="text-xs text-muted-foreground">
              In your favorites
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
              Your Top Tracks
            </CardTitle>
            <CardDescription>
              Your most played songs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTracks.length > 0 ? (
              <>
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
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">No tracks data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Artists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Top Artists
            </CardTitle>
            <CardDescription>
              Artists you listen to most
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topArtists.length > 0 ? (
              <>
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
              </>
            ) : (
              <p className="text-center text-muted-foreground py-4">No artists data available</p>
            )}
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
      </div>
    </div>
  );
};
