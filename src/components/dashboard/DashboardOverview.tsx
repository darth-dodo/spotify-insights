import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Play, Heart, Loader2, Calendar, ExternalLink } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { LibraryHealth } from './LibraryHealth';
import { ListeningPatterns } from './ListeningPatterns';

export const DashboardOverview = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 50);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 50);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(50);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Calculate dynamic stats from real Spotify data
  const calculateStats = () => {
    const tracks = topTracksData?.items || [];
    const artists = topArtistsData?.items || [];
    const recent = recentlyPlayedData?.items || [];

    // Calculate total listening time from recent tracks
    const totalListeningTime = recent.reduce((acc: number, item: any) => {
      return acc + (item.track?.duration_ms || 0);
    }, 0) / (1000 * 60); // Convert to minutes

    // Get unique genres from top artists
    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const uniqueGenres = [...new Set(allGenres)];
    const topGenre = uniqueGenres[0] || 'Unknown';

    // Calculate average track popularity
    const avgPopularity = tracks.length > 0 ? 
      tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length : 0;

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      listeningTime: Math.round(totalListeningTime),
      topGenre: topGenre as string,
      uniqueGenres: uniqueGenres.length,
      avgPopularity: Math.round(avgPopularity),
      recentTracksCount: recent.length,
      hasSpotifyData: tracks.length > 0 || artists.length > 0 || recent.length > 0
    };
  };

  const stats = calculateStats();

  // Generate top tracks with real data only
  const getTopTracks = () => {
    if (!topTracksData?.items?.length) {
      return [];
    }

    return topTracksData.items.slice(0, 3).map((track: any) => ({
      name: track.name,
      artist: track.artists?.[0]?.name || 'Unknown Artist',
      popularity: track.popularity || 0,
      duration: `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}`
    }));
  };

  // Generate top artists with real data only
  const getTopArtists = () => {
    if (!topArtistsData?.items?.length) {
      return [];
    }

    return topArtistsData.items.slice(0, 3).map((artist: any) => ({
      name: artist.name,
      popularity: artist.popularity || 0,
      followers: artist.followers?.total ? 
        (artist.followers.total > 1000000 ? 
          `${(artist.followers.total / 1000000).toFixed(1)}M` : 
          `${Math.round(artist.followers.total / 1000)}K`) : '0'
    }));
  };

  const topTracks = getTopTracks();
  const topArtists = getTopArtists();

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
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTracks}</div>
            <p className="text-xs text-muted-foreground">
              in your top tracks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArtists}</div>
            <p className="text-xs text-muted-foreground">
              in your top artists
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.listeningTime}m</div>
            <p className="text-xs text-muted-foreground">
              in recent tracks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Genre</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topGenre || 'Unknown'}</div>
            <p className="text-xs text-muted-foreground">
              from {stats.uniqueGenres} genres
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Library Health */}
      <LibraryHealth />

      {/* Listening Patterns */}
      <ListeningPatterns />

      {/* Top Tracks */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tracks</CardTitle>
          <CardDescription>Your most played tracks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTracks.map((track, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{track.name}</p>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{track.popularity}%</Badge>
                  <span className="text-sm text-muted-foreground">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Artists */}
      <Card>
        <CardHeader>
          <CardTitle>Top Artists</CardTitle>
          <CardDescription>Your most listened artists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topArtists.map((artist, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{artist.name}</p>
                  <p className="text-sm text-muted-foreground">{artist.followers} followers</p>
                </div>
                <Badge variant="secondary">{artist.popularity}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
