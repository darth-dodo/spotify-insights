
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { calculateStats } from '@/lib/spotify-data-utils';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const AchievementsPreview = () => {
  const { useEnhancedTopTracks, useEnhancedTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const { data: recentlyPlayed = [], isLoading: recentLoading } = useEnhancedRecentlyPlayed(200);
  const isLoading = tracksLoading || artistsLoading || recentLoading;

  if (isLoading) {
    return (
      <CalmingLoader 
        title="Loading achievements..."
        description="Calculating your music milestones from the extended dataset"
        variant="card"
      />
    );
  }

  const stats = calculateStats(tracks, artists, recentlyPlayed, 'medium_term');

  const badges = [
    { 
      id: 'music_lover', 
      name: 'Music Lover', 
      description: `Discovered ${stats?.totalTracks || 0} tracks`, 
      icon: '🎵', 
      unlocked: (stats?.totalTracks || 0) > 0 
    },
    { 
      id: 'artist_explorer', 
      name: 'Artist Explorer', 
      description: `Following ${stats?.totalArtists || 0} artists`, 
      icon: '🎤', 
      unlocked: (stats?.totalArtists || 0) >= 25 
    },
    { 
      id: 'active_listener', 
      name: 'Active Listener', 
      description: `${stats?.recentTracksCount || 0} recent plays`, 
      icon: '🎧', 
      unlocked: (stats?.recentTracksCount || 0) >= 10 
    },
    { 
      id: 'music_enthusiast', 
      name: 'Music Enthusiast', 
      description: `${stats?.listeningTime || 0} minutes listened`, 
      icon: '⭐', 
      unlocked: (stats?.listeningTime || 0) > 60 
    },
    { 
      id: 'genre_explorer', 
      name: 'Genre Explorer', 
      description: `${stats?.uniqueGenres || 0} genres discovered`, 
      icon: '🌟', 
      unlocked: (stats?.uniqueGenres || 0) >= 10 
    },
    { 
      id: 'taste_maker', 
      name: 'Taste Maker', 
      description: `${stats?.avgPopularity || 0}% avg popularity`, 
      icon: '🏆', 
      unlocked: (stats?.avgPopularity || 0) >= 70 
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
