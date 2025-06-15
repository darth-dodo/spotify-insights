
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ExternalLink, Play, Heart, Calendar, Users, Music, 
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

  // Mock albums data (in real implementation, this would come from Spotify API)
  const mockAlbums = [
    {
      id: '1',
      name: 'Greatest Hits',
      release_date: '2023-01-15',
      total_tracks: 12,
      images: [{ url: artist.image }],
      album_type: 'album'
    },
    {
      id: '2',
      name: 'Live Sessions',
      release_date: '2022-08-20',
      total_tracks: 8,
      images: [{ url: artist.image }],
      album_type: 'album'
    },
    {
      id: '3',
      name: 'Summer Vibes EP',
      release_date: '2022-06-10',
      total_tracks: 5,
      images: [{ url: artist.image }],
      album_type: 'single'
    },
  ];

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{artist.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          {/* Artist Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {artist.image && (
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Popularity</div>
                      <div className="text-2xl font-bold text-accent">{artist.popularity}/100</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Followers</div>
                      <div className="text-2xl font-bold">
                        {artist.followers > 1000000 ? 
                          `${(artist.followers / 1000000).toFixed(1)}M` : 
                          `${Math.round(artist.followers / 1000)}K`}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Your Rank</div>
                      <div className="text-2xl font-bold">#{artist.rank}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Genres</div>
                      <div className="text-sm">{artist.genres?.length || 0}</div>
                    </div>
                  </div>
                  
                  {artist.genres && artist.genres.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Genres</div>
                      <div className="flex flex-wrap gap-1">
                        {artist.genres.slice(0, 5).map((genre: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {artist.external_urls?.spotify && (
                      <Button
                        onClick={() => window.open(artist.external_urls.spotify, '_blank')}
                        className="flex items-center gap-2"
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

          {/* Tabs for detailed content */}
          <Tabs defaultValue="tracks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tracks">Your Top Tracks</TabsTrigger>
              <TabsTrigger value="albums">Discography</TabsTrigger>
            </TabsList>

            <TabsContent value="tracks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Your Top Tracks by {artist.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {artistTopTracks.length > 0 ? (
                      <div className="space-y-2">
                        {artistTopTracks.map((track: any, index: number) => (
                          <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            {track.album?.images?.[0] && (
                              <img 
                                src={track.album.images[0].url} 
                                alt={track.album.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{track.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {track.album?.name} • {formatDuration(track.duration_ms)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {track.popularity}%
                              </Badge>
                              {track.external_urls?.spotify && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
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
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="albums" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Discography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {mockAlbums.map((album) => (
                        <div key={album.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <img 
                            src={album.images[0]?.url || '/placeholder.svg'} 
                            alt={album.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{album.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(album.release_date)} • {album.total_tracks} tracks
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {album.album_type}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                      ))}
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">Discography data requires additional Spotify API endpoints</p>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
