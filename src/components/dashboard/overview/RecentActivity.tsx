
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, SkipForward, Heart, ExternalLink } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { formatDistanceToNow } from 'date-fns';
import { InfoButton } from '@/components/ui/InfoButton';

export const RecentActivity = () => {
  const { useEnhancedRecentlyPlayed } = useSpotifyData();
  const { data: recentTracks, isLoading } = useEnhancedRecentlyPlayed(20);

  // Helper function to format track artists
  const formatArtists = (artists: any[] | undefined) => {
    if (!artists || artists.length === 0) return 'Unknown Artist';
    return artists.map(artist => artist.name).join(', ');
  };

  // Helper function to determine time since played
  const timeSincePlayed = (playedAt: string | undefined) => {
    if (!playedAt) return 'Recently';
    return formatDistanceToNow(new Date(playedAt), { addSuffix: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
          <InfoButton
            title="Recent Activity"
            description="Your most recently played tracks from Spotify, showing when and what you've been listening to."
            calculation="Real-time data from Spotify showing your last 20 played tracks with timestamps and play counts."
            variant="modal"
          />
        </CardTitle>
        <CardDescription>
          Your latest listening activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-4 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        ) : recentTracks && recentTracks.length > 0 ? (
          <div className="space-y-3">
            {recentTracks.slice(0, 10).map((track, index) => (
              <div key={`${track.id}-${index}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  {track.playCount > 1 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 text-xs px-1 py-0 h-5 min-w-5 flex items-center justify-center"
                    >
                      {track.playCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {track.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
                  </p>
                  {track.source && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {track.source}
                    </Badge>
                  )}
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {track.playedAt ? formatDistanceToNow(new Date(track.playedAt), { addSuffix: true }) : 'Recently'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {track.popularity && (
                      <Badge variant="outline" className="text-xs">
                        {track.popularity}% popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No Recent Activity</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start listening to music on Spotify to see your activity here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
