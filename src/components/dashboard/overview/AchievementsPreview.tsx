
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export const AchievementsPreview = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracksData } = useTopTracks('medium_term', 10);
  const { data: topArtistsData } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData } = useRecentlyPlayed(10);

  const calculateStats = () => {
    const totalTracks = topTracksData?.items?.length || 0;
    const totalArtists = topArtistsData?.items?.length || 0;
    const recentTracks = recentlyPlayedData?.items?.length || 0;
    const listeningTime = recentlyPlayedData?.items?.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60) || 0;
    
    return { totalTracks, totalArtists, recentTracks, listeningTime: Math.round(listeningTime) };
  };

  const stats = calculateStats();

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
      description: `${stats.listeningTime} minutes listened`, 
      icon: '⭐', 
      unlocked: stats.listeningTime > 60 
    }
  ];

  return (
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
  );
};
