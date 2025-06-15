
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ExternalLink, Play, Heart, Users, Music, 
  TrendingUp, Clock, Star 
} from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

interface ArtistDetailModalProps {
  artist: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ArtistDetailModal = ({ artist, isOpen, onClose }: ArtistDetailModalProps) => {
  const { useTopTracks } = useSpotifyData();
  const { data: topTracksData } = useTopTracks('medium_term', 50);

  if (!artist) return null;

  // Get artist's top tracks from user's data
  const artistTopTracks = topTracksData?.items?.filter((track: any) => 
    track.artists.some((trackArtist: any) => trackArtist.id === artist.id)
  ).slice(0, 10) || [];

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">{artist.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh] overflow-y-auto">
          <div className="grid gap-4 md:gap-6 p-1">
            {/* Artist Overview */}
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                  {artist.image && (
                    <img 
                      src={artist.image} 
                      alt={artist.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover mx-auto sm:mx-0"
                    />
                  )}
                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-sm text-muted-foreground">Popularity</div>
                        <div className="text-xl md:text-2xl font-bold text-accent">
                          {artist.popularity || 0}/100
                        </div>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-sm text-muted-foreground">Followers</div>
                        <div className="text-xl md:text-2xl font-bold">
                          {artist.followers_total > 1000000 ? 
                            `${(artist.followers_total / 1000000).toFixed(1)}M` : 
                            artist.followers_total > 1000 ?
                            `${Math.round(artist.followers_total / 1000)}K` :
                            artist.followers_total || 'N/A'}
                        </div>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-sm text-muted-foreground">Your Rank</div>
                        <div className="text-xl md:text-2xl font-bold">#{artist.rank || 'N/A'}</div>
                      </div>
                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-sm text-muted-foreground">Genres</div>
                        <div className="text-xl md:text-2xl font-bold">{artist.genres?.length || 0}</div>
                      </div>
                    </div>
                    
                    {artist.genres && artist.genres.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Genres</div>
                        <div className="flex flex-wrap gap-1">
                          {artist.genres.slice(0, 8).map((genre: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                          {artist.genres.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{artist.genres.length - 8} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {artist.external_urls?.spotify && (
                        <Button
                          onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                          className="flex items-center gap-2"
                          size="sm"
                        >
                          <Play className="h-4 w-4" />
                          Open in Spotify
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Tracks Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Your Top Tracks by {artist.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {artistTopTracks.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {artistTopTracks.map((track: any, index: number) => (
                      <div key={track.id} className="flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-accent/10 rounded flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        {track.album?.images?.[0] && (
                          <img 
                            src={track.album.images[0].url} 
                            alt={track.album.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{track.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {track.album?.name} • {formatDuration(track.duration_ms)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {track.popularity}%
                          </Badge>
                          {track.external_urls?.spotify && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 md:h-8 md:w-8 p-0"
                              onClick={() => window.open(track.external_urls.spotify, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tracks found in your current listening data</p>
                    <p className="text-sm">This artist might not be in your recent top tracks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
