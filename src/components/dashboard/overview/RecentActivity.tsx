
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Headphones, TrendingUp, Database } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { InfoButton } from '@/components/ui/InfoButton';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const RecentActivity = () => {
  const { tracks, artists, isLoading, getTopTracks, getTopArtists, getStats } = useExtendedSpotifyDataStore();

  if (isLoading) {
    return (
      <CalmingLoader 
        title="Loading your recent activity..."
        description="Analyzing your music listening patterns and preferences"
        variant="card"
      />
    );
  }

  const topTracks = getTopTracks(10);
  const topArtists = getTopArtists(10);
  const stats = getStats();

  return (
    <div className="space-y-4">
      {/* Data source indicator */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          Full Dataset ({tracks.length} tracks, {artists.length} artists)
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
                Showing 10 of {tracks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTracks.map((track: any, index: number) => (
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
              {tracks.length > 10 && (
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    + {tracks.length - 10} more tracks available
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
                Showing 10 of {artists.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topArtists.map((artist: any, index: number) => (
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
              {artists.length > 10 && (
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-xs">
                    + {artists.length - 10} more artists available
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced insights section */}
      {tracks.length > 100 && artists.length > 100 && stats && (
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
                  {stats.totalTracks}
                </div>
                <div className="text-xs text-muted-foreground">Total Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {stats.totalArtists}
                </div>
                <div className="text-xs text-muted-foreground">Total Artists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {stats.avgPopularity}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Popularity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {stats.uniqueGenres}
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
