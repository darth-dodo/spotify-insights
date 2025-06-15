
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Headphones, TrendingUp, Database } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const RecentActivity = () => {
  const { useExtendedTopTracks, useExtendedTopArtists } = useSpotifyData();
  
  // Use extended data hooks to get up to 1000 items
  const { data: topTracksData, isLoading: tracksLoading } = useExtendedTopTracks('medium_term', 1000);
  const { data: topArtistsData, isLoading: artistsLoading } = useExtendedTopArtists('medium_term', 1000);

  const isLoading = tracksLoading || artistsLoading;

  if (isLoading) {
    return (
      <CalmingLoader 
        title="Loading your recent activity..."
        description="Analyzing your music listening patterns and preferences"
        variant="card"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Data source indicator */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          Full Dataset ({topTracksData?.items?.length || 0} tracks, {topArtistsData?.items?.length || 0} artists)
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Music className="h-5 w-5" />
              Top Tracks
              <InfoButton
                title="Top Tracks"
                description="Your most frequently played songs ranked by Spotify's algorithm based on your listening history."
                calculation="Tracks from your extended dataset (up to 1000) ranked by play frequency, recent activity, and listening patterns over the medium term (6 months)."
              />
              <Badge variant="outline" className="ml-auto text-xs">
                Showing 10 of {topTracksData?.items?.length || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTracksData?.items?.slice(0, 10).map((track: any, index: number) => (
                <div key={track.id || index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artists?.[0]?.name}
                      </p>
                      {track.popularity && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {track.popularity}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {topTracksData?.items?.length > 10 && (
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    + {topTracksData.items.length - 10} more tracks available
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Top Artists
              <InfoButton
                title="Top Artists"
                description="Artists you listen to most frequently, based on your overall listening patterns and preferences."
                calculation="Artists from your extended dataset ranked by listening frequency, track count in your library, and recent activity. Popularity scores are from Spotify's artist data."
              />
              <Badge variant="outline" className="ml-auto text-xs">
                Showing 10 of {topArtistsData?.items?.length || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topArtistsData?.items?.slice(0, 10).map((artist: any, index: number) => (
                <div key={artist.id || index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{artist.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {artist.genres?.[0] || 'Artist'}
                      </p>
                      {artist.popularity && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {artist.popularity}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {topArtistsData?.items?.length > 10 && (
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    + {topArtistsData.items.length - 10} more artists available
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced insights section - now shows stats for full 1000-item dataset */}
      {topTracksData?.items?.length > 100 && topArtistsData?.items?.length > 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Full Dataset Insights
              <InfoButton
                title="Dataset Insights"
                description="Comprehensive statistics derived from analyzing your complete extended music library dataset."
                calculation="Total counts from extended dataset. Average popularity calculated across all tracks. Unique genres counted from all artist genre tags in your library."
                variant="popover"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {topTracksData.items.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {topArtistsData.items.length}
                </div>
                <div className="text-xs text-muted-foreground">Total Artists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(topTracksData.items.reduce((sum: number, track: any) => sum + (track.popularity || 0), 0) / topTracksData.items.length)}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Popularity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {new Set(topArtistsData.items.flatMap((artist: any) => artist.genres || [])).size}
                </div>
                <div className="text-xs text-muted-foreground">Unique Genres</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
