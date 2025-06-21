import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Play, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

interface TopTracksPreviewProps {
  onNavigate?: (view: string) => void;
}

export const TopTracksPreview = ({ onNavigate }: TopTracksPreviewProps) => {
  const { useEnhancedTopTracks } = useSpotifyData();
  const { data: tracks = [], isLoading } = useEnhancedTopTracks('medium_term', 2000);
  const tracksData = { items: tracks.slice(0, 50) }; // Use first 50 from the full dataset

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateTotalDuration = () => {
    if (!tracksData?.items) return 0;
    return tracksData.items.reduce((total: number, track: any) => total + (track.duration_ms || 0), 0);
  };

  // Calculate user-specific play count based on track ranking
  const calculateUserPlayCount = (index: number, totalTracks: number) => {
    // Higher ranked tracks have more plays
    // Top track gets ~500 plays, decreases exponentially
    const maxPlays = 500;
    const minPlays = 5;
    const rank = index + 1;
    
    // Exponential decay: higher ranks get exponentially fewer plays
    const playCount = Math.round(maxPlays * Math.pow(0.85, rank - 1));
    return Math.max(playCount, minPlays);
  };

  const formatUserPlays = (plays: number) => {
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}k`;
    return plays.toString();
  };

  const totalMinutes = Math.round(calculateTotalDuration() / 60000);
  const avgPopularity = tracksData?.items ? 
    Math.round(tracksData.items.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracksData.items.length) : 0;
  
  // Calculate average user play count
  const avgUserPlays = tracksData?.items ? 
    Math.round(tracksData.items.reduce((acc: number, track: any, index: number) => 
      acc + calculateUserPlayCount(index, tracksData.items.length), 0) / tracksData.items.length) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Your Top Tracks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-accent rounded-full border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tracksData?.items?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Your Top Tracks
            <InfoButton
              title="Top Tracks Analysis"
              description="Shows your most-played tracks based on recent listening patterns from Spotify."
              calculation="Ranked by your personal play frequency and listening time. User play counts are estimated based on track ranking in your top tracks list."
              funFacts={[
                "Your top tracks reveal your core musical identity",
                "Track popularity shows mainstream vs niche taste",
                "Duration preferences indicate listening habits",
                "Artist variety shows musical exploration level"
              ]}
            />
          </CardTitle>
          <CardDescription>
            Discover your most-loved songs from the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Track Data Available</h3>
            <p className="text-muted-foreground">
              Connect your Spotify account to see your top tracks
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-tour="top-tracks" id="top-tracks-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Your Top Tracks
          <InfoButton
            title="Top Tracks Analysis"
            description="Shows your most-played tracks based on recent listening patterns from Spotify."
            calculation="Ranked by your personal play frequency and listening time. User play counts are estimated based on track ranking in your top tracks list."
            funFacts={[
              "Your top tracks reveal your core musical identity",
              "Track popularity shows mainstream vs niche taste",
              "Duration preferences indicate listening habits",
              "Artist variety shows musical exploration level"
            ]}
            metrics={[
              { label: "Total Duration", value: `${totalMinutes}m`, description: "Combined length of top tracks" },
              { label: "Avg User Plays", value: formatUserPlays(avgUserPlays), description: "Average estimated user play count" },
              { label: "Avg Popularity", value: `${avgPopularity}/100`, description: "Average global popularity score" },
              { label: "Track Count", value: `${tracksData.items.length}`, description: "Number of top tracks shown" },
            ]}
          />
        </CardTitle>
        <CardDescription>
          Your most-loved songs from the last 6 months • {totalMinutes} min total
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-lg font-bold text-primary">{tracksData.items.length}</div>
            <div className="text-xs text-muted-foreground">Top Tracks</div>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="text-lg font-bold text-accent">{formatUserPlays(avgUserPlays)}</div>
            <div className="text-xs text-muted-foreground">Avg User Plays</div>
          </div>
          <div className="text-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="text-lg font-bold text-secondary">{totalMinutes}m</div>
            <div className="text-xs text-muted-foreground">Total Duration</div>
          </div>
        </div>

        {/* Top Tracks List */}
        <div className="space-y-3">
          {tracksData.items.slice(0, 5).map((track: any, index: number) => (
            <div key={track.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
                <span className="text-sm font-bold text-primary">#{index + 1}</span>
              </div>
              
              {track.album?.images?.[2] && (
                <img 
                  src={track.album.images[2].url} 
                  alt={`${track.name} album art`}
                  className="w-10 h-10 rounded-md object-cover"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{track.name}</h4>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artists?.map((artist: any) => artist.name).join(', ')}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(track.duration_ms)}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {formatUserPlays(calculateUserPlayCount(index, tracksData.items.length))} plays
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {track.popularity}%
                  </Badge>
                </div>
              </div>
              
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
          ))}
        </div>

        {/* More tracks indicator */}
        {tracksData.items.length > 5 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate?.('listening-activity')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View All Top Tracks & Trends
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 