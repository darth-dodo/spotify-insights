
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Sparkles, Music, TrendingUp } from 'lucide-react';

interface OverviewHeaderProps {
  onNavigate?: (view: string) => void;
}

export const OverviewHeader = ({ onNavigate }: OverviewHeaderProps) => {
  const { user } = useAuth();
  const { tracks, artists, dataInfo } = useExtendedSpotifyDataStore();
  
  // Use the full dataset from the store (up to 2000 items)
  const topTracksData = { items: tracks };
  const topArtistsData = { items: artists };

  const calculateLevel = () => {
    const totalTracks = topTracksData?.items?.length || 0;
    const totalArtists = topArtistsData?.items?.length || 0;
    return Math.min(Math.floor((totalTracks + totalArtists) / 8) + 1, 50);
  };

  const level = calculateLevel();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedMessage = () => {
    const artists = topArtistsData?.items || [];
    const tracks = topTracksData?.items || [];
    const topGenres = artists.flatMap((artist: any) => artist.genres || []);
    const topGenre = topGenres[0];
    
    if (tracks.length > 30) {
      return `${tracks.length} tracks discovered • ${artists.length} artists explored`;
    } else if (topGenre) {
      return `Your ${topGenre} journey continues`;
    }
    return 'Your musical journey continues';
  };

  const getEngagementStats = () => {
    const tracks = topTracksData?.items || [];
    const artists = topArtistsData?.items || [];
    const totalMinutes = tracks.reduce((acc: number, track: any) => acc + (track.duration_ms || 0), 0) / (1000 * 60);
    
    return {
      tracks: tracks.length,
      artists: artists.length,
      minutes: Math.round(totalMinutes),
      level
    };
  };

  const getUserFirstName = () => {
    if (!user?.display_name) return 'there';
    return user.display_name.split(' ')[0];
  };

  const handleLevelClick = () => {
    if (onNavigate) {
      onNavigate('gamification-settings');
    }
  };

  const stats = getEngagementStats();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-lg" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex flex-wrap items-center gap-2">
              {getGreeting()}, {getUserFirstName()}! 
              <Sparkles className="h-6 w-6 text-accent animate-pulse" />
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {getPersonalizedMessage()}
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
              <Music className="h-3 w-3 mr-1" />
              {stats.tracks} tracks
            </Badge>
            <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.artists} artists
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLevelClick}
              className="text-secondary border-secondary/20 bg-secondary/10 hover:bg-secondary/20 flex items-center gap-1 h-6 px-2"
              title="Click to explore gamification features"
            >
              <Trophy className="h-3 w-3" />
              Level {level}
            </Button>
          </div>
        </div>

        {/* Engagement Hook */}
        {stats.tracks > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>
              {stats.minutes > 60 
                ? `${Math.round(stats.minutes / 60)}+ hours of music in your library`
                : `${stats.minutes} minutes of curated music`
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
