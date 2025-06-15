
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Heart, Database, Star, Volume2, Zap } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { InfoButton } from '@/components/ui/InfoButton';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const EnhancedDashboardOverview = () => {
  const { tracks, artists, isLoading, getTopTracks, getTopArtists, getStats, getGenreAnalysis } = useExtendedSpotifyDataStore();

  const stats = getStats();
  const genreAnalysis = getGenreAnalysis();

  // Enhanced insights from the full 1000-item dataset
  const getEnhancedInsights = () => {
    if (!tracks.length || !artists.length) return null;

    const topGenres = genreAnalysis.slice(0, 3);
    const libraryCompleteness = Math.round((tracks.length / 1000) * 100);
    const artistCoverage = Math.round((artists.length / 1000) * 100);
    
    // Calculate music discovery patterns
    const genreSpread = genreAnalysis.length;
    const diversityScore = Math.min((genreSpread / 15) * 100, 100);
    
    // Calculate taste sophistication
    const avgPopularity = stats?.avgPopularity || 0;
    const tasteLevel = avgPopularity >= 80 ? 'Mainstream' : 
                      avgPopularity >= 60 ? 'Popular' : 
                      avgPopularity >= 40 ? 'Alternative' : 'Underground';

    return {
      topGenres,
      libraryCompleteness,
      artistCoverage,
      genreSpread,
      diversityScore,
      tasteLevel,
      totalHours: Math.round((stats?.listeningTime || 0) / 60),
      dataQuality: Math.round(((tracks.length + artists.length) / 2000) * 100)
    };
  };

  const insights = getEnhancedInsights();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome to your Music Universe! 🎵</h1>
          <p className="text-muted-foreground">Loading comprehensive insights from your extended music library...</p>
        </div>
        <CalmingLoader 
          title="Analyzing your complete music library..."
          description="Processing up to 1000 tracks and artists to deliver the most comprehensive insights possible"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Dataset Info */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            {stats?.hasSpotifyData ? 'Your Musical Universe Awaits! 🎵' : 'Welcome to your Music Dashboard! 🎵'}
          </h1>
          <p className="text-muted-foreground">
            {stats?.hasSpotifyData ? 
              `Comprehensive insights from your ${stats.totalTracks} tracks and ${stats.totalArtists} artists` :
              'Connect your Spotify account to unlock personalized insights'
            }
          </p>
        </div>
        
        {stats?.hasSpotifyData && insights && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Extended Dataset ({stats.totalTracks} tracks, {stats.totalArtists} artists)
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {insights.diversityScore}% Genre Diversity
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {insights.tasteLevel} Taste Profile
            </Badge>
          </div>
        )}
      </div>

      {/* Enhanced Stats Grid with Meaningful Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Library Depth
              <InfoButton
                title="Library Depth"
                description="Total number of tracks in your extended dataset, showing the completeness of your musical library."
                calculation="Direct count from your top 1000 tracks dataset, indicating how comprehensive your music discovery has been."
              />
            </CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.totalTracks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? 'Tracks in extended library' : 'Connect to see data'}
            </p>
            {insights && (
              <Progress value={insights.libraryCompleteness} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Artist Network
              <InfoButton
                title="Artist Network"
                description="Total number of unique artists in your extended dataset, representing the breadth of your musical taste."
                calculation="Count of unique artists from your top 1000 artists dataset, showing how diverse your listening habits are."
              />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.totalArtists || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? 'Unique artists discovered' : 'Will show when connected'}
            </p>
            {insights && (
              <Progress value={insights.artistCoverage} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Genre Exploration
              <InfoButton
                title="Genre Exploration"
                description="Number of unique genres discovered through your artist collection, measuring musical diversity."
                calculation="Counted from genre tags of all artists in your extended dataset. Higher numbers indicate more eclectic taste."
              />
            </CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.uniqueGenres || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? 'Unique genres explored' : 'Connect to discover'}
            </p>
            {insights && (
              <Progress value={insights.diversityScore} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Taste Sophistication
              <InfoButton
                title="Taste Sophistication"
                description="Average popularity score of your tracks, indicating whether you prefer mainstream or underground music."
                calculation="Average of popularity scores (0-100) across all tracks in your extended dataset. Higher scores indicate mainstream taste."
              />
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.avgPopularity || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? `${insights?.tasteLevel || 'Unknown'} taste profile` : 'Connect to analyze'}
            </p>
            {stats?.avgPopularity && (
              <Progress value={stats.avgPopularity} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Genre Distribution from Extended Dataset */}
      {stats?.hasSpotifyData && genreAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Your Musical DNA (From Extended Dataset)
              <InfoButton
                title="Musical DNA"
                description="Genre distribution calculated from your complete artist collection, showing your musical identity."
                calculation="Percentage breakdown of genres from all artists in your 1000-artist dataset. Each artist contributes their genres to create this profile."
                variant="popover"
              />
            </CardTitle>
            <CardDescription>
              Genre breakdown from {stats.totalArtists} artists in your extended library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {genreAnalysis.slice(0, 8).map((genre, index) => (
                <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: `${genre.color}15`, borderColor: `${genre.color}40` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{genre.name}</h4>
                    <Badge variant="secondary" style={{ color: genre.color }}>
                      {genre.value}%
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Artists:</span>
                      <span>{genre.artists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Est. Tracks:</span>
                      <span>{genre.tracks}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${genre.value}%`,
                        backgroundColor: genre.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spotify Connection Status */}
      {!stats?.hasSpotifyData && (
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Unlock Your Musical Universe
            </CardTitle>
            <CardDescription>
              Connect your Spotify account to access comprehensive insights from up to 1000 tracks and artists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What you'll discover:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span>Complete top 1000 tracks analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span>Comprehensive artist network mapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-accent" />
                      <span>Deep genre diversity analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent" />
                      <span>Advanced taste profiling</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button size="lg" className="whitespace-nowrap">
                <Music className="h-4 w-4 mr-2" />
                Connect Spotify
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dataset Quality & Performance Insights */}
      {stats?.hasSpotifyData && insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dataset Performance & Quality
              <InfoButton
                title="Dataset Quality Metrics"
                description="Performance indicators showing the completeness and quality of your extended music dataset."
                calculation="Data coverage calculated as percentage of maximum possible tracks (1000) and artists (1000). Quality score combines both metrics."
                variant="popover"
              />
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of your extended music library dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">{insights.libraryCompleteness}%</div>
                <div className="text-sm text-muted-foreground">Track Coverage</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.totalTracks}/1000 tracks</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{insights.artistCoverage}%</div>
                <div className="text-sm text-muted-foreground">Artist Coverage</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.totalArtists}/1000 artists</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="text-2xl font-bold text-secondary">{Math.round(insights.diversityScore)}%</div>
                <div className="text-sm text-muted-foreground">Genre Diversity</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.uniqueGenres} genres</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-muted">
                <div className="text-2xl font-bold">{insights.dataQuality}%</div>
                <div className="text-sm text-muted-foreground">Data Quality</div>
                <div className="text-xs text-muted-foreground mt-1">Overall score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
