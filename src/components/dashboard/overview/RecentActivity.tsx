
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Headphones } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export const RecentActivity = () => {
  const { useTopTracks, useTopArtists } = useSpotifyData();
  
  const { data: topTracksData } = useTopTracks('medium_term', 10);
  const { data: topArtistsData } = useTopArtists('medium_term', 10);

  return (
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
  );
};
