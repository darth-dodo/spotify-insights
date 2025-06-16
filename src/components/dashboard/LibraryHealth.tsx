import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Info, Music, TrendingUp, Clock, Users, BarChart3, Activity } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { calculateStats, TimeDimension } from '@/lib/spotify-data-utils';
import { InfoButton } from '@/components/ui/InfoButton';

export const LibraryHealth = () => {
  const { useEnhancedTopTracks, useEnhancedTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const { data: tracksData = [], isLoading: tracksLoading } = useEnhancedTopTracks('medium_term');
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const { data: recentlyPlayed = [], isLoading: recentLoading } = useEnhancedRecentlyPlayed(200);
  const isLoading = tracksLoading || artistsLoading || recentLoading;

  const stats = useMemo(() => {
    if (!tracksData || !artists) return null;
    return calculateStats(tracksData, artists, recentlyPlayed, 'all_time');
  }, [tracksData, artists, recentlyPlayed]);

  // Calculate additional insights
  const insights = useMemo(() => {
    if (!stats) return null;

    // Calculate genre distribution
    const genreCounts = artists.reduce((acc: Record<string, number>, artist) => {
      artist.genres?.forEach(genre => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre, count]) => ({ genre, count }));

    // Calculate popularity distribution
    const popularityRanges = {
      underground: 0, // 0-39
      alternative: 0, // 40-59
      popular: 0, // 60-79
      mainstream: 0 // 80-100
    };

    tracksData.forEach(track => {
      const popularity = track.popularity || 0;
      if (popularity >= 80) popularityRanges.mainstream++;
      else if (popularity >= 60) popularityRanges.popular++;
      else if (popularity >= 40) popularityRanges.alternative++;
      else popularityRanges.underground++;
    });

    // Calculate activity score
    const activityScore = Math.min(100, Math.round(
      (stats.recentTracksCount / stats.totalTracks) * 100
    ));

    // Calculate diversity score
    const diversityScore = Math.min(100, Math.round(
      (stats.uniqueGenres / 20) * 100 // Assuming 20 genres is considered high diversity
    ));

    return {
      topGenres,
      popularityRanges,
      activityScore,
      diversityScore
    };
  }, [stats, artists, tracksData]);

  if (isLoading || !stats || !insights) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Library Health</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis of your music library's health and diversity
          </p>
        </div>
        <InfoButton
          title="Library Health Analysis"
          description="Comprehensive analysis of your music library's health, diversity, and listening patterns."
          calculation="Analyzes your library's size, genre diversity, artist variety, and listening patterns to provide insights into your musical habits and preferences."
          funFacts={[
            "A healthy library typically has diverse genres and artists",
            "Regular listening activity indicates good library engagement",
            "Genre diversity often correlates with musical exploration",
            "Library size affects recommendation quality and discovery"
          ]}
          metrics={[
            { label: "Library Size", value: `${stats.totalTracks}`, description: "Total tracks in library" },
            { label: "Genre Diversity", value: `${stats.uniqueGenres}`, description: "Unique genres explored" },
            { label: "Artist Variety", value: `${stats.totalArtists}`, description: "Unique artists followed" }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Music className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Library Size</span>
              <InfoButton
                title="Library Size Analysis"
                description="Total number of tracks in your music library."
                calculation="Counts all unique tracks in your library. A larger library typically indicates more diverse musical exploration."
                funFacts={[
                  "The average music fan has 200-500 songs in regular rotation",
                  "Library size affects recommendation quality",
                  "Larger libraries suggest adventurous music discovery",
                  "Regular updates keep your library fresh and relevant"
                ]}
                metrics={[
                  { label: "Total Tracks", value: `${stats.totalTracks}`, description: "In your library" },
                  { label: "Recent Activity", value: `${stats.recentTracksCount}`, description: "Recently played" }
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{stats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">total tracks</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Genre Diversity</span>
              <InfoButton
                title="Genre Diversity Analysis"
                description="Number of unique genres in your music library."
                calculation="Counts all unique genres from your artists. Higher diversity indicates broader musical exploration."
                funFacts={[
                  "Most people explore 3-7 genres regularly",
                  "Genre diversity often correlates with personality openness",
                  "Exploring diverse genres can enhance cognitive flexibility",
                  "Genre variety improves music recommendations"
                ]}
                metrics={[
                  { label: "Unique Genres", value: `${stats.uniqueGenres}`, description: "Different styles" },
                  { label: "Diversity Score", value: `${insights.diversityScore}%`, description: "Exploration level" }
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{stats.uniqueGenres}</div>
            <div className="text-xs text-muted-foreground">unique genres</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Artist Variety</span>
              <InfoButton
                title="Artist Variety Analysis"
                description="Number of unique artists in your music library."
                calculation="Counts all unique artists you follow. Higher variety indicates broader musical exploration."
                funFacts={[
                  "Diverse artist libraries often predict musical openness",
                  "The typical listener follows 50-150 artists regularly",
                  "Supporting many artists helps fund the music ecosystem",
                  "Artist variety improves discovery recommendations"
                ]}
                metrics={[
                  { label: "Total Artists", value: `${stats.totalArtists}`, description: "In your library" },
                  { label: "Variety Level", value: stats.totalArtists >= 100 ? 'High' : stats.totalArtists >= 50 ? 'Medium' : 'Focused', description: "Exploration range" }
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{stats.totalArtists}</div>
            <div className="text-xs text-muted-foreground">unique artists</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Listening Time</span>
              <InfoButton
                title="Listening Time Analysis"
                description="Total listening time from your recent activity."
                calculation="Calculated from your recent listening sessions and track durations. Shows current engagement with music."
                funFacts={[
                  "The average person listens to 2-4 hours of music daily",
                  "Music listening often peaks during commutes and work",
                  "Recent activity indicates current music engagement",
                  "Time metrics help understand listening patterns"
                ]}
                metrics={[
                  { label: "Total Hours", value: `${Math.round(stats.listeningTime)}`, description: "Recent activity" },
                  { label: "Recent Tracks", value: `${stats.recentTracksCount}`, description: "Songs played recently" }
                ]}
              />
            </div>
            <div className="text-2xl font-bold">{Math.round(stats.listeningTime)}</div>
            <div className="text-xs text-muted-foreground">hours listened</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Top Genres
              <InfoButton
                title="Top Genres Analysis"
                description="Your most frequently occurring genres and their distribution."
                calculation="Calculated from artist genre tags. Shows your primary musical interests and genre preferences."
                funFacts={[
                  "Top genres often reflect your core musical identity",
                  "Genre distribution shows musical taste balance",
                  "Genre preferences can change over time",
                  "Diverse genre distribution indicates eclectic taste"
                ]}
                metrics={insights.topGenres.map(({ genre, count }) => ({
                  label: genre,
                  value: `${count} artists`,
                  description: `${Math.round((count / artists.length) * 100)}% of library`
                }))}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.topGenres.map(({ genre, count }) => (
                <div key={genre} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{genre}</span>
                  <Badge variant="secondary">{count} artists</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" />
              Popularity Distribution
              <InfoButton
                title="Popularity Distribution Analysis"
                description="Breakdown of your library's music by popularity level."
                calculation="Based on Spotify's popularity scores (0-100). Shows your preference for mainstream vs. underground music."
                funFacts={[
                  "Mainstream tracks (80-100) are widely popular",
                  "Popular tracks (60-79) have good recognition",
                  "Alternative tracks (40-59) are more niche",
                  "Underground tracks (0-39) are less known"
                ]}
                metrics={[
                  { label: "Mainstream", value: `${insights.popularityRanges.mainstream}`, description: "80-100 popularity" },
                  { label: "Popular", value: `${insights.popularityRanges.popular}`, description: "60-79 popularity" },
                  { label: "Alternative", value: `${insights.popularityRanges.alternative}`, description: "40-59 popularity" },
                  { label: "Underground", value: `${insights.popularityRanges.underground}`, description: "0-39 popularity" }
                ]}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(insights.popularityRanges).map(([range, count]) => (
                <div key={range} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{range}</span>
                    <Badge variant="secondary">{count} tracks</Badge>
                  </div>
                  <Progress 
                    value={(count / tracksData.length) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" />
            Library Health Score
            <InfoButton
              title="Library Health Score Analysis"
              description="Overall health score based on multiple factors including diversity, activity, and balance."
              calculation="Combines genre diversity, artist variety, recent activity, and popularity distribution to calculate an overall health score."
              funFacts={[
                "A healthy library has good genre diversity",
                "Regular activity keeps your library fresh",
                "Balanced popularity distribution shows varied taste",
                "High health scores often correlate with better recommendations"
              ]}
              metrics={[
                { label: "Diversity Score", value: `${insights.diversityScore}%`, description: "Genre exploration" },
                { label: "Activity Score", value: `${insights.activityScore}%`, description: "Recent engagement" },
                { label: "Overall Health", value: `${Math.round((insights.diversityScore + insights.activityScore) / 2)}%`, description: "Combined score" }
              ]}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Health</span>
              <Badge variant={insights.diversityScore >= 70 ? 'default' : insights.diversityScore >= 50 ? 'secondary' : 'destructive'}>
                {Math.round((insights.diversityScore + insights.activityScore) / 2)}%
              </Badge>
            </div>
            <Progress 
              value={(insights.diversityScore + insights.activityScore) / 2} 
              className="h-2"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Diversity</span>
                  <Badge variant="secondary">{insights.diversityScore}%</Badge>
                </div>
                <Progress value={insights.diversityScore} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Activity</span>
                  <Badge variant="secondary">{insights.activityScore}%</Badge>
                </div>
                <Progress value={insights.activityScore} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
