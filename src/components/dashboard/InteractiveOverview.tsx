
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Clock, Users, TrendingUp, Heart, Loader2, Trophy, Star, Zap, Headphones } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export const InteractiveOverview = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 10);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(10);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Calculate real stats from API data
  const calculateStats = () => {
    const totalTracks = topTracksData?.items?.length || 0;
    const totalArtists = topArtistsData?.items?.length || 0;
    const recentTracks = recentlyPlayedData?.items?.length || 0;
    const listeningTime = recentlyPlayedData?.items?.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60) || 0; // Convert to minutes
    
    return { 
      totalTracks, 
      totalArtists, 
      recentTracks,
      listeningTime: Math.round(listeningTime)
    };
  };

  const stats = calculateStats();

  // Passive achievements based on actual data
  const achievements = {
    level: Math.min(Math.floor(stats.totalTracks / 5) + 1, 50), // Level based on tracks discovered
    streak: Math.min(stats.recentTracks, 30), // Streak based on recent activity
    totalListeningTime: Math.round(stats.listeningTime),
    artistsDiscovered: stats.totalArtists,
    songsLiked: stats.totalTracks
  };

  // Simple, passive badges based on real data
  const badges = [
    { 
      id: 'music_lover', 
      name: 'Music Lover', 
      description: `Discovered ${stats.totalTracks} tracks`, 
      icon: '🎵', 
      unlocked: stats.totalTracks > 0 
    },
    { 
      id: 'artist_explorer', 
      name: 'Artist Explorer', 
      description: `Following ${stats.totalArtists} artists`, 
      icon: '🎤', 
      unlocked: stats.totalArtists >= 5 
    },
    { 
      id: 'active_listener', 
      name: 'Active Listener', 
      description: `${stats.recentTracks} recent plays`, 
      icon: '🎧', 
      unlocked: stats.recentTracks >= 10 
    },
    { 
      id: 'music_enthusiast', 
      name: 'Music Enthusiast', 
      description: `${achievements.totalListeningTime} minutes listened`, 
      icon: '⭐', 
      unlocked: achievements.totalListeningTime > 60 
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading your music data... 🎵</h1>
          <p className="text-muted-foreground">Please wait while we fetch your listening insights</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex flex-wrap items-center gap-2">
              Welcome back! 🎵
              <Badge variant="outline" className="text-accent border-accent">
                Level {achievements.level}
              </Badge>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Your musical journey continues - check out your latest achievements!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'streak' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'streak' ? null : 'streak')}
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Streak</span>
            </div>
            <div className="text-lg md:text-2xl font-bold text-accent">{achievements.streak}</div>
            <p className="text-xs text-muted-foreground">recent plays</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'time' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'time' ? null : 'time')}
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Time</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{achievements.totalListeningTime}m</div>
            <p className="text-xs text-muted-foreground">listened</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'discover' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'discover' ? null : 'discover')}
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{achievements.artistsDiscovered}</div>
            <p className="text-xs text-muted-foreground">discovered</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'likes' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'likes' ? null : 'likes')}
        >
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{achievements.songsLiked}</div>
            <p className="text-xs text-muted-foreground">in library</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Top Tracks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topTracksData?.items?.slice(0, 5).map((track: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.artists?.[0]?.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Top Artists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topArtistsData?.items?.slice(0, 5).map((artist: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {artist.genres?.[0] || 'Artist'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`transition-all ${
                  badge.unlocked ? 'bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20' : 'opacity-60'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex items-center gap-1">
                      {badge.unlocked ? (
                        <Trophy className="h-4 w-4 text-accent" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-muted" />
                      )}
                    </div>
                  </div>
                  <h4 className="font-medium mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
