
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Play, Heart, Database } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const DashboardOverview = () => {
  // Use extended data hooks to get up to 1000 items
  const { useExtendedTopTracks, useExtendedTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracksData, isLoading: tracksLoading } = useExtendedTopTracks('medium_term', 1000);
  const { data: topArtistsData, isLoading: artistsLoading } = useExtendedTopArtists('medium_term', 1000);
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
      topGenre,
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
          <h1 className="text-3xl font-bold text-foreground">Welcome back! 🎵</h1>
          <p className="text-muted-foreground">Preparing your personalized music insights...</p>
        </div>
        <CalmingLoader 
          title="Loading your music dashboard..."
          description="Analyzing your complete listening history and preferences"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          {stats.hasSpotifyData ? 'Welcome back! 🎵' : 'Welcome to your Music Dashboard! 🎵'}
        </h1>
        <p className="text-muted-foreground">
          {stats.hasSpotifyData ? 
            `Here's your music listening overview ${stats.topGenre !== 'Unknown' ? `- you love ${stats.topGenre}!` : ''}` :
            'Connect your Spotify account to see personalized insights'
          }
        </p>
        {stats.hasSpotifyData && (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Database className="h-3 w-3" />
            Extended Dataset ({stats.totalTracks} tracks, {stats.totalArtists} artists)
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stats.hasSpotifyData ? 'Top Tracks' : 'Your Tracks'}
              <InfoButton
                title="Top Tracks"
                description="Your most played songs based on Spotify's algorithm and your listening history."
                calculation="Tracks ranked by Spotify's proprietary algorithm considering play count, recent activity, and listening patterns over the selected time range."
              />
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalTracks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.hasSpotifyData ? 'In your extended dataset' : 'Will show when connected'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stats.hasSpotifyData ? 'Recent Listening' : 'Listening Time'}
              <InfoButton
                title="Recent Listening Time"
                description="Total listening time calculated from your recently played tracks."
                calculation="Sum of duration from your last 50 played tracks, converted from milliseconds to minutes."
              />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {stats.hasSpotifyData ? `${stats.listeningTime}m` : '0m'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.hasSpotifyData ? 'From recent tracks' : 'Connect to see data'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stats.hasSpotifyData ? 'Top Artists' : 'Your Artists'}
              <InfoButton
                title="Top Artists"
                description="Artists you listen to most frequently, ranked by Spotify's algorithm."
                calculation="Artists ranked by listening frequency, popularity, and recent activity over the selected time range using Spotify's top artists API."
              />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalArtists}</div>
            <p className="text-xs text-muted-foreground">
              {stats.hasSpotifyData ? 'In your extended dataset' : 'Will appear here'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spotify Connection Status */}
      {!stats.hasSpotifyData && (
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Connect Your Spotify Account
            </CardTitle>
            <CardDescription>
              Get personalized insights by connecting your Spotify account to see your real listening data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <h4 className="font-medium mb-2">What you'll get:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your actual top tracks and artists</li>
                  <li>• Real listening history and trends</li>
                  <li>• Personalized music recommendations</li>
                  <li>• Detailed genre analysis</li>
                </ul>
              </div>
              <Button className="whitespace-nowrap">
                Connect Spotify
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Content Grid - Only show if we have data */}
      {stats.hasSpotifyData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Tracks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Top Tracks
                <InfoButton
                  title="Top Tracks Preview"
                  description="Your 3 most played songs from the extended dataset, showing track details and popularity metrics."
                  calculation="Selected from your top 1000 tracks, ranked by Spotify's algorithm. Popularity is a 0-100 score based on recent play data."
                />
              </CardTitle>
              <CardDescription>
                Your most played songs (from {stats.totalTracks} total tracks)
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
                        <p className="text-sm font-medium">{track.popularity}% popularity</p>
                        <p className="text-xs text-muted-foreground">{track.duration}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Tracks
                  </Button>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">No track data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Artists */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Top Artists
                <InfoButton
                  title="Top Artists Preview"
                  description="Your 3 most listened-to artists from the extended dataset, showing follower counts and popularity."
                  calculation="Selected from your top 1000 artists, ranked by listening frequency. Follower counts are from Spotify's artist data."
                />
              </CardTitle>
              <CardDescription>
                Artists you listen to most (from {stats.totalArtists} total artists)
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
                        <p className="text-sm font-medium">{artist.popularity}% popularity</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Artists
                  </Button>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">No artist data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional Insights for Spotify Users */}
      {stats.hasSpotifyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Your Music Profile
              <InfoButton
                title="Music Profile Analysis"
                description="Comprehensive analysis of your musical preferences derived from your extended listening data."
                calculation="Top genre from most common artist genres. Diversity based on unique genre count. Taste level from average track popularity across your library."
                variant="popover"
              />
            </CardTitle>
            <CardDescription>
              Insights based on your extended Spotify dataset ({stats.totalTracks} tracks, {stats.totalArtists} artists)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-medium text-accent mb-2">Top Genre</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.topGenre !== 'Unknown' ? `Your favorite genre is ${stats.topGenre}` : 'No genre data available'}
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Music Diversity</h4>
                <p className="text-sm text-muted-foreground">
                  You explore {stats.uniqueGenres} different genres
                </p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h4 className="font-medium text-secondary mb-2">Taste Level</h4>
                <p className="text-sm text-muted-foreground">
                  Average track popularity: {stats.avgPopularity}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            {stats.hasSpotifyData ? 'Explore your music data' : 'Available after connecting Spotify'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              disabled={!stats.hasSpotifyData}
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Trends</span>
              <span className="text-xs text-muted-foreground">Time-based analysis</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              disabled={!stats.hasSpotifyData}
            >
              <Music className="h-6 w-6" />
              <span>Genre Analysis</span>
              <span className="text-xs text-muted-foreground">Musical preferences</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col gap-2"
              disabled={!stats.hasSpotifyData}
            >
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
