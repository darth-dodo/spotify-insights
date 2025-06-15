
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Heart, Database, Star, Volume2, Zap } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { useAuth } from '@/hooks/useAuth';
import { InfoButton } from '@/components/ui/InfoButton';
import { CalmingLoader } from '@/components/ui/CalmingLoader';
import { OverviewHeader } from './overview/OverviewHeader';
import { ImprovedActivityHeatmap } from './overview/ImprovedActivityHeatmap';

interface EnhancedDashboardOverviewProps {
  onNavigate?: (view: string) => void;
}

export const EnhancedDashboardOverview = ({ onNavigate }: EnhancedDashboardOverviewProps) => {
  const { tracks, artists, isLoading, getTopTracks, getTopArtists, getStats, getGenreAnalysis } = useExtendedSpotifyDataStore();
  const { user } = useAuth();

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

    // Consistent level calculation
    const level = Math.min(Math.floor((tracks.length + artists.length) / 40) + 1, 50);

    return {
      topGenres,
      libraryCompleteness,
      artistCoverage,
      genreSpread,
      diversityScore,
      tasteLevel,
      totalHours: Math.round((stats?.listeningTime || 0) / 60),
      dataQuality: Math.round(((tracks.length + artists.length) / 2000) * 100),
      level
    };
  };

  const insights = getEnhancedInsights();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <OverviewHeader onNavigate={onNavigate} />
        <CalmingLoader 
          title="Analyzing your complete music library..."
          description="Processing up to 1000 tracks and artists to deliver the most comprehensive insights possible"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Navigation */}
      <OverviewHeader onNavigate={onNavigate} />

      {/* Enhanced Stats Grid with Meaningful Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Library Depth
              <InfoButton
                title="Library Depth"
                description="Your musical footprint represents the total number of unique tracks in your extended dataset."
                calculation="This shows how many different songs you've listened to enough to appear in your top tracks. A larger number indicates more diverse listening habits and music discovery."
              />
            </CardTitle>
            <Music className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.totalTracks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? 'Unique tracks in your musical DNA' : 'Connect to see data'}
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
                description="The breadth of your musical connections - how many different artists shape your sound."
                calculation="Count of unique artists from your extended dataset. Higher numbers suggest you explore music widely rather than focusing on just a few artists."
              />
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.totalArtists || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? 'Artists in your musical universe' : 'Will show when connected'}
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
                title="Genre Exploration Score"
                description="Measures the diversity of your musical taste across different genres and styles."
                calculation="Calculated from unique genres of all artists in your library. 10+ genres = Eclectic Explorer, 6-9 = Genre Adventurer, 3-5 = Selective Listener, <3 = Genre Loyalist"
              />
            </CardTitle>
            <Volume2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.uniqueGenres || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? 
                `${stats?.uniqueGenres >= 10 ? 'Eclectic Explorer' : 
                  stats?.uniqueGenres >= 6 ? 'Genre Adventurer' : 
                  stats?.uniqueGenres >= 3 ? 'Selective Listener' : 'Genre Loyalist'}` : 
                'Connect to discover'
              }
            </p>
            {insights && (
              <Progress value={insights.diversityScore} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Taste Profile
              <InfoButton
                title="Taste Sophistication"
                description="Indicates whether you gravitate toward mainstream hits or underground gems."
                calculation="Based on average popularity scores (0-100) of your tracks. 80-100 = Mainstream, 60-79 = Popular, 40-59 = Alternative, 0-39 = Underground. Higher scores mean you like what's trending."
              />
            </CardTitle>
            <Star className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats?.avgPopularity || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.hasSpotifyData ? `${insights?.tasteLevel || 'Unknown'} taste profile` : 'Connect to analyze'}
            </p>
            {stats?.avgPopularity && (
              <Progress value={stats.avgPopularity} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Activity Heatmap */}
      <ImprovedActivityHeatmap />

      {/* Enhanced Genre Distribution from Extended Dataset */}
      {stats?.hasSpotifyData && genreAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Your Musical DNA Analysis
              <InfoButton
                title="Musical DNA Analysis"
                description="Deep dive into your musical identity through comprehensive genre analysis."
                calculation="Each percentage represents how much that genre influences your overall taste, calculated from all artists in your 1000-item dataset. This creates your unique musical fingerprint."
                variant="popover"
              />
            </CardTitle>
            <CardDescription>
              Comprehensive genre breakdown revealing your musical identity from {stats.totalArtists} artists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {genreAnalysis.slice(0, 8).map((genre, index) => (
                <div key={index} className="p-4 rounded-lg border transition-all hover:shadow-md" style={{ backgroundColor: `${genre.color}15`, borderColor: `${genre.color}40` }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm capitalize">{genre.name}</h4>
                    <Badge variant="secondary" style={{ color: genre.color }}>
                      {genre.value}%
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Artists:</span>
                      <span className="font-medium">{genre.artists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Influence:</span>
                      <span className="font-medium">
                        {genre.value >= 15 ? 'Major' : genre.value >= 8 ? 'Moderate' : 'Minor'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-3">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${genre.value}%`,
                        backgroundColor: genre.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {genreAnalysis.length > 8 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  +{genreAnalysis.length - 8} more genres in your musical universe
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate?.('genres')}
                >
                  Explore All Genres
                </Button>
              </div>
            )}
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
              Your Music Library Analytics
              <InfoButton
                title="Library Analytics Explained"
                description="Comprehensive metrics about your music library's depth, diversity, and listening patterns."
                calculation="Coverage shows how much of your total listening history we've captured. Quality combines completeness metrics. Your musical level is calculated from total tracks + artists divided by 40."
                variant="popover"
              />
            </CardTitle>
            <CardDescription>
              Advanced insights into your musical preferences and library composition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">{insights.libraryCompleteness}%</div>
                <div className="text-sm font-medium">Track Coverage</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.totalTracks}/1000 tracks analyzed</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{insights.artistCoverage}%</div>
                <div className="text-sm font-medium">Artist Coverage</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.totalArtists}/1000 artists analyzed</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="text-2xl font-bold">{Math.round(insights.diversityScore)}%</div>
                <div className="text-sm font-medium">Musical Diversity</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.uniqueGenres} unique genres</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-muted">
                <div className="text-2xl font-bold text-accent">Level {insights.level}</div>
                <div className="text-sm font-medium">Musical Explorer</div>
                <div className="text-xs text-muted-foreground mt-1">Based on library size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
