
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, TrendingUp, Users, Clock, Star, Headphones } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { calculateStats, calculateGenreAnalysis } from '@/lib/spotify-data-utils';

export const MusicInsightsSummary = () => {
  const { useEnhancedTopTracks, useEnhancedTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const { data: recentlyPlayed = [], isLoading: recentLoading } = useEnhancedRecentlyPlayed(200);
  const isLoading = tracksLoading || artistsLoading || recentLoading;

  const calculateEnhancedInsights = () => {
    const stats = calculateStats(tracks, artists, recentlyPlayed, 'medium_term');
    const genreAnalysis = calculateGenreAnalysis(artists);

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

    // Enhanced genre analysis from the limited dataset
    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const genreCount = allGenres.reduce((acc: Record<string, number>, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([genre]) => genre);

    // Enhanced popularity analysis from limited dataset
    const avgPopularity = tracks.length > 0 ? 
      tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length : 0;

    // Enhanced listening time from recent data
    const totalDuration = recentlyPlayed.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60); // minutes

    // Diversity metrics from limited dataset (capped at 2000 for performance)
    const uniqueGenres = new Set(allGenres).size;
    const diversityScore = Math.min((uniqueGenres / 15) * 100, 100); // Max 100%, scaled for limited dataset

    return {
      topGenres,
      avgPopularity: Math.round(avgPopularity),
      totalListeningTime: Math.round(totalDuration),
      diversityScore: Math.round(diversityScore),
      uniqueGenres,
      totalTracks: tracks.length,
      totalArtists: artists.length,
      recentActivity: recentlyPlayed.length,
      libraryDepth: Math.round((tracks.length / 2000) * 100), // Library completeness based on 2000 limit
      artistCoverage: Math.round((artists.length / 2000) * 100), // Artist coverage based on 2000 limit
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
              <p className="text-sm text-muted-foreground">Connect your Spotify account to see your detailed music insights from up to 2000 tracks (limited for performance)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* Enhanced Music Profile - Mobile Responsive */}
      <Card className="lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Star className="h-4 w-4 sm:h-5 sm:w-5" />
            Enhanced Music Profile (Limited Dataset)
            <InfoButton
              title="Enhanced Music Profile Overview"
              description="Comprehensive overview of your music library from the limited dataset (capped at 2000 tracks/artists for optimal performance)."
              calculation="Analyzes your top tracks, artists, listening time, and genre diversity from a performance-optimized dataset of up to 2000 items."
              funFacts={[
                "Your profile is built from actual Spotify listening data",
                "We limit analysis to 2000 tracks/artists for smooth app performance",
                "Data includes listening time from recent activity",
                "Genre count reflects diversity from all analyzed artists"
              ]}
              metrics={[
                { label: "Dataset Limit", value: "2000", description: "Max tracks/artists for performance" },
                { label: "Your Tracks", value: `${insights.totalTracks}`, description: "Tracks in your library" },
                { label: "Your Artists", value: `${insights.totalArtists}`, description: "Artists you follow" },
                { label: "Listening Data", value: `${insights.totalListeningTime}m`, description: "Recent activity time" }
              ]}
            />
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
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground">
              Analysis based on limited dataset (max 2000 tracks/artists for performance)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Genre Diversity - Mobile Responsive */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Music className="h-4 w-4 sm:h-5 sm:w-5" />
            Genre Exploration
            <InfoButton
              title="Genre Exploration Analysis"
              description="Measures your musical diversity and genre exploration from the limited dataset."
              calculation="Calculated from genres of artists in your limited library (up to 2000 for performance). Diversity score considers both genre count and variety. Library depth shows your coverage of the maximum dataset size."
              funFacts={[
                "Most users explore 3-8 genres regularly",
                "High diversity scores indicate adventurous listening habits",
                "Genre analysis helps improve music recommendations",
                "Data is optimized to 2000 artists for smooth performance"
              ]}
              metrics={[
                { label: "Genre Count", value: `${insights.uniqueGenres}`, description: "Different genres explored" },
                { label: "Diversity Score", value: `${insights.diversityScore}%`, description: "Musical exploration level" },
                { label: "Library Depth", value: `${insights.libraryDepth}%`, description: "Dataset coverage" }
              ]}
            />
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
                You explore {insights.uniqueGenres} different genres from {insights.totalArtists} artists (limited dataset)
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-sm sm:text-base">Top Genres</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {insights.topGenres.length > 0 ? (
                  insights.topGenres.slice(0, 6).map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs hover:bg-secondary/80 transition-colors">
                      {genre}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs text-muted-foreground">
                    No genres available
                  </Badge>
                )}
                {insights.topGenres.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{insights.topGenres.length - 6} more
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
                {insights.totalTracks} tracks in limited dataset (max 2000 for performance)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Taste Analysis - Mobile Responsive */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Advanced Taste Analysis
            <InfoButton
              title="Advanced Taste Analysis"
              description="Analyzes your music taste sophistication and listening patterns from the limited dataset."
              calculation="Based on track popularity scores (0-100) and listening activity. Popularity averages determine if you prefer mainstream (80-100), popular (60-79), alternative (40-59), or underground (0-39) music. Analysis uses up to 2000 tracks for performance optimization."
              funFacts={[
                "Underground taste often predicts early artist discovery",
                "Mainstream preference indicates alignment with popular culture",
                "Your taste profile can reveal personality traits",
                "Recent activity shows current listening engagement"
              ]}
              metrics={[
                { label: "Avg Popularity", value: `${insights.avgPopularity}/100`, description: "Mainstream level" },
                { label: "Taste Profile", value: popularityLevel.label, description: "Musical archetype" },
                { label: "Recent Activity", value: `${insights.recentActivity}`, description: "Recent tracks played" }
              ]}
            />
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
                Average track popularity: {insights.avgPopularity > 0 ? `${insights.avgPopularity}%` : 'No data'} (from {insights.totalTracks} tracks in limited dataset)
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-2 sm:gap-3 text-center">
              <div className="p-2 sm:p-3 bg-accent/5 rounded-lg border border-accent/20">
                <div className="text-base sm:text-lg font-bold text-accent">{insights.recentActivity}</div>
                <div className="text-xs text-muted-foreground">Recent Activity</div>
              </div>
              <div className="p-2 sm:p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-base sm:text-lg font-bold text-primary">{Math.round(insights.totalListeningTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">Total Hours</div>
              </div>
              <div className="p-2 sm:p-3 bg-secondary/5 rounded-lg border border-secondary/20 lg:block xl:hidden hidden">
                <div className="text-base sm:text-lg font-bold text-secondary">{insights.uniqueGenres}</div>
                <div className="text-xs text-muted-foreground">Genres</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Artist Coverage</span>
                <span className="font-medium">{insights.artistCoverage}%</span>
              </div>
              <Progress value={insights.artistCoverage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {insights.totalArtists} artists in your limited library (max 2000 for performance)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
