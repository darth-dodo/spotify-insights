
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, TrendingUp, Users, Clock, Star, Headphones } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';

export const MusicInsightsSummary = () => {
  const { tracks, artists, recentlyPlayed, getGenreAnalysis, getStats, isLoading } = useExtendedSpotifyDataStore();

  const calculateEnhancedInsights = () => {
    const stats = getStats();
    const genreAnalysis = getGenreAnalysis();

    // Check if we have any data
    const hasData = stats?.hasSpotifyData && (tracks.length > 0 || artists.length > 0);

    if (!hasData) {
      return {
        topGenres: [],
        avgPopularity: 0,
        totalListeningTime: 0,
        diversityScore: 0,
        uniqueGenres: 0,
        totalTracks: 0,
        totalArtists: 0,
        recentActivity: 0,
        libraryDepth: 0,
        artistCoverage: 0,
        hasData: false
      };
    }

    // Enhanced genre analysis from the full dataset
    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const genreCount = allGenres.reduce((acc: Record<string, number>, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([genre]) => genre);

    // Enhanced popularity analysis from full dataset
    const avgPopularity = tracks.length > 0 ? 
      tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length : 0;

    // Enhanced listening time from recent data
    const totalDuration = recentlyPlayed.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60); // minutes

    // Diversity metrics from extended dataset
    const uniqueGenres = new Set(allGenres).size;
    const diversityScore = Math.min((uniqueGenres / 15) * 100, 100); // Max 100%, scaled for larger dataset

    return {
      topGenres,
      avgPopularity: Math.round(avgPopularity),
      totalListeningTime: Math.round(totalDuration),
      diversityScore: Math.round(diversityScore),
      uniqueGenres,
      totalTracks: tracks.length,
      totalArtists: artists.length,
      recentActivity: recentlyPlayed.length,
      libraryDepth: Math.round((tracks.length / 1000) * 100), // Library completeness
      artistCoverage: Math.round((artists.length / 1000) * 100), // Artist coverage
      hasData: true
    };
  };

  const insights = calculateEnhancedInsights();

  const getPopularityLevel = (score: number) => {
    if (score >= 80) return { label: 'Mainstream', color: 'text-green-500' };
    if (score >= 60) return { label: 'Popular', color: 'text-blue-500' };
    if (score >= 40) return { label: 'Alternative', color: 'text-purple-500' };
    return { label: 'Underground', color: 'text-orange-500' };
  };

  const popularityLevel = getPopularityLevel(insights.avgPopularity);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 animate-pulse">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              Loading Music Profile...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg border">
                  <div className="text-xl sm:text-2xl font-bold text-muted-foreground mb-1">...</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Loading</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insights.hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              Music Profile (Connect to View Data)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg border">
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground mb-1">No data</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Tracks</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg border">
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground mb-1">No data</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Artists</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg border">
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground mb-1">No data</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Recent Listening</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg border">
                <div className="text-xl sm:text-2xl font-bold text-muted-foreground mb-1">No data</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Unique Genres</div>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-sm text-muted-foreground">Connect your Spotify account to see your detailed music insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Enhanced Music Profile - Mobile Responsive */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
            Enhanced Music Profile (Extended Dataset)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="text-xl sm:text-2xl font-bold text-accent mb-1">{insights.totalTracks}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Tracks</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{insights.totalArtists}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Artists</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-secondary/5 rounded-lg border border-secondary/20">
              <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">{insights.totalListeningTime}m</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Recent Listening</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg border border-muted">
              <div className="text-xl sm:text-2xl font-bold mb-1">{insights.uniqueGenres}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Unique Genres</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Genre Diversity - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Music className="h-4 w-4 sm:h-5 sm:w-5" />
            Genre Exploration (Full Dataset)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Diversity Score</span>
                <span className="font-medium">{insights.diversityScore}%</span>
              </div>
              <Progress value={insights.diversityScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                You explore {insights.uniqueGenres} different genres from {insights.totalArtists} artists
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Top Genres (from {insights.totalArtists} artists)</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {insights.topGenres.length > 0 ? (
                  insights.topGenres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs text-muted-foreground">
                    No genres available
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Library Depth</span>
                <span className="font-medium">{insights.libraryDepth}%</span>
              </div>
              <Progress value={insights.libraryDepth} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {insights.totalTracks} tracks in extended dataset
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Taste Analysis - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Advanced Taste Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm">Music Taste Profile</span>
                <Badge variant="outline" className={`text-xs ${insights.avgPopularity > 0 ? popularityLevel.color : 'text-muted-foreground'}`}>
                  {insights.avgPopularity > 0 ? popularityLevel.label : 'No data'}
                </Badge>
              </div>
              <Progress value={insights.avgPopularity} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Average track popularity: {insights.avgPopularity > 0 ? `${insights.avgPopularity}%` : 'No data'} (from {insights.totalTracks} tracks)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
              <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                <div className="text-base sm:text-lg font-bold">{insights.recentActivity}</div>
                <div className="text-xs text-muted-foreground">Recent Activity</div>
              </div>
              <div className="p-2 sm:p-3 bg-muted/50 rounded-lg">
                <div className="text-base sm:text-lg font-bold">{Math.round(insights.totalListeningTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">Total Hours</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Artist Coverage</span>
                <span className="font-medium">{insights.artistCoverage}%</span>
              </div>
              <Progress value={insights.artistCoverage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {insights.totalArtists} artists in your extended library
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
