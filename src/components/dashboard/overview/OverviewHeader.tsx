
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export const OverviewHeader = () => {
  const { useTopTracks, useTopArtists } = useSpotifyData();
  
  const { data: topTracksData } = useTopTracks('medium_term', 10);
  const { data: topArtistsData } = useTopArtists('medium_term', 10);

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
    const topGenres = artists.flatMap((artist: any) => artist.genres || []);
    const topGenre = topGenres[0];
    
    if (topGenre) {
      return `Your ${topGenre} journey continues`;
    }
    return 'Your musical journey continues';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex flex-wrap items-center gap-2">
            {getGreeting()}! 🎵
            <Badge variant="outline" className="text-accent border-accent">
              Level {level}
            </Badge>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {getPersonalizedMessage()} - here's your music dashboard overview
          </p>
        </div>
      </div>
    </div>
  );
};
