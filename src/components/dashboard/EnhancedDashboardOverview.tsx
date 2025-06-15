
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Heart, Database, Star, Volume2, Zap } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { useAuth } from '@/hooks/useAuth';
import { InfoButton } from '@/components/ui/InfoButton';
import { BlurLoader } from '@/components/ui/BlurLoader';
import { CalmingLoader } from '@/components/ui/CalmingLoader';
import { ErrorDialog } from '@/components/auth/ErrorDialog';
import { OverviewHeader } from './overview/OverviewHeader';
import { ActivityHeatmap } from './overview/ActivityHeatmap';

interface EnhancedDashboardOverviewProps {
  onNavigate?: (view: string) => void;
}

export const EnhancedDashboardOverview = ({ onNavigate }: EnhancedDashboardOverviewProps) => {
  const { tracks, artists, isLoading, getTopTracks, getTopArtists, getStats, getGenreAnalysis, error } = useExtendedSpotifyDataStore();
  const { user } = useAuth();
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [currentError, setCurrentError] = React.useState<string>('');

  // Handle errors
  React.useEffect(() => {
    if (error) {
      setCurrentError(typeof error === 'string' ? error : error.message || 'An unknown error occurred');
      setErrorDialogOpen(true);
    }
  }, [error]);

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

  // Check if we have any Spotify data
  const hasSpotifyData = stats?.hasSpotifyData && (tracks.length > 0 || artists.length > 0);

  // Generate fun facts for the overview
  const generateOverviewFunFacts = () => {
    if (!insights || !stats) return [];

    const facts = [];
    
    if (stats.totalTracks > 500) {
      facts.push(`You have enough tracks to listen for ${Math.round(stats.totalTracks * 3.5 / 60)} hours straight without repeating a song!`);
    }
    
    if (stats.uniqueGenres > 10) {
      facts.push(`Your musical taste spans ${stats.uniqueGenres} genres - that's more diverse than most radio stations!`);
    }
    
    if (insights.tasteLevel === 'Underground') {
      facts.push('You\'re a true music explorer! Your taste leans heavily toward underground and indie artists.');
    } else if (insights.tasteLevel === 'Mainstream') {
      facts.push('You keep up with the hits! Your playlist could easily be a top 40 radio station.');
    }
    
    facts.push(`If you played all your top tracks back-to-back, it would take ${insights.totalHours} hours - that's ${Math.round(insights.totalHours / 24)} days of continuous music!`);
    
    if (stats.totalArtists > 300) {
      facts.push(`You support ${stats.totalArtists} different artists - imagine if they all played at the same festival!`);
    }

    return facts;
  };

  const handleRetryError = () => {
    setErrorDialogOpen(false);
    window.location.reload();
  };

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
    <BlurLoader isLoading={isLoading}>
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
                  title="Library Depth Analysis"
                  description="Your musical footprint represents the total number of unique tracks in your extended dataset."
                  calculation="This metric shows how many different songs you've listened to enough to appear in your top tracks. A larger number indicates more diverse listening habits and active music discovery. The calculation uses Spotify's personalization algorithms to rank your most played tracks."
                  funFacts={[
                    "The average Spotify user has around 200-300 tracks in their regular rotation",
                    "Music collectors typically have 500+ unique tracks in their top listening data",
                    "Your library depth directly influences Spotify's recommendation accuracy"
                  ]}
                  metrics={[
                    { label: "Your Tracks", value: `${stats?.totalTracks || 0}`, description: "Unique songs in your data" },
                    { label: "Completion", value: `${insights?.libraryCompleteness || 0}%`, description: "Of maximum dataset size" }
                  ]}
                />
              </CardTitle>
              <Music className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {hasSpotifyData ? (stats?.totalTracks || 0) : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpotifyData ? 'Unique tracks in your musical DNA' : 'Connect to see data'}
              </p>
              {insights && hasSpotifyData && (
                <Progress value={insights.libraryCompleteness} className="h-2 mt-2" />
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Artist Network
                <InfoButton
                  title="Artist Network Analysis"
                  description="The breadth of your musical connections - how many different artists shape your sound."
                  calculation="Count of unique artists from your extended dataset. This includes primary artists, featured artists, and collaborators. Higher numbers suggest you explore music widely rather than focusing on just a few artists."
                  funFacts={[
                    "The typical music fan follows 50-100 artists regularly",
                    "Diverse artist networks often predict openness to new music genres",
                    "Supporting many artists helps fund the entire music ecosystem"
                  ]}
                  metrics={[
                    { label: "Your Artists", value: `${stats?.totalArtists || 0}`, description: "Unique artists you listen to" },
                    { label: "Coverage", value: `${insights?.artistCoverage || 0}%`, description: "Of maximum dataset size" }
                  ]}
                />
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {hasSpotifyData ? (stats?.totalArtists || 0) : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpotifyData ? 'Artists in your musical universe' : 'Will show when connected'}
              </p>
              {insights && hasSpotifyData && (
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
                  calculation="Calculated from unique genres of all artists in your library. The score considers both the number of genres and their diversity. 10+ genres = Eclectic Explorer, 6-9 = Genre Adventurer, 3-5 = Selective Listener, <3 = Genre Loyalist."
                  funFacts={[
                    "Most people stick to 3-5 genres throughout their lives",
                    "Genre exploration peaks in teenage years and early twenties",
                    "Listening to diverse genres can enhance cognitive flexibility",
                    "Some genres are 'gateway drugs' to discovering others (like indie to folk to country)"
                  ]}
                  metrics={[
                    { label: "Your Genres", value: `${stats?.uniqueGenres || 0}`, description: "Different genres you explore" },
                    { label: "Diversity", value: `${insights?.diversityScore || 0}%`, description: "Musical exploration score" }
                  ]}
                />
              </CardTitle>
              <Volume2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {hasSpotifyData ? (stats?.uniqueGenres || 0) : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpotifyData ? 
                  `${stats?.uniqueGenres >= 10 ? 'Eclectic Explorer' : 
                    stats?.uniqueGenres >= 6 ? 'Genre Adventurer' : 
                    stats?.uniqueGenres >= 3 ? 'Selective Listener' : 'Genre Loyalist'}` : 
                  'Connect to discover'
                }
              </p>
              {insights && hasSpotifyData && (
                <Progress value={insights.diversityScore} className="h-2 mt-2" />
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                Taste Profile
                <InfoButton
                  title="Taste Sophistication Analysis"
                  description="Indicates whether you gravitate toward mainstream hits or underground gems."
                  calculation="Based on average popularity scores (0-100) of your tracks. Spotify calculates popularity using recent play counts and user engagement. 80-100 = Mainstream, 60-79 = Popular, 40-59 = Alternative, 0-39 = Underground."
                  funFacts={[
                    "Underground music lovers often discover artists 2-3 years before they go mainstream",
                    "Mainstream taste isn't bad - it means you like what resonates with millions of people!",
                    "Your taste profile can predict your personality traits (openness, extraversion)",
                    "The 'popularity paradox': some of the best music has low popularity scores"
                  ]}
                  metrics={[
                    { label: "Avg Popularity", value: `${stats?.avgPopularity || 0}/100`, description: "Your taste mainstream level" },
                    { label: "Profile", value: insights?.tasteLevel || 'Unknown', description: "Your musical archetype" }
                  ]}
                />
              </CardTitle>
              <Star className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {hasSpotifyData ? (stats?.avgPopularity || 0) : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasSpotifyData ? `${insights?.tasteLevel || 'Unknown'} taste profile` : 'Connect to analyze'}
              </p>
              {stats?.avgPopularity && hasSpotifyData && (
                <Progress value={stats.avgPopularity} className="h-2 mt-2" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Activity Heatmap */}
        <ActivityHeatmap />

        {/* Enhanced Genre Distribution from Extended Dataset */}
        {hasSpotifyData && genreAnalysis.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Your Musical DNA Analysis
                <InfoButton
                  title="Musical DNA Deep Dive"
                  description="Deep dive into your musical identity through comprehensive genre analysis."
                  calculation="Each percentage represents how much that genre influences your overall taste, calculated from all artists in your 1000-item dataset. This creates your unique musical fingerprint by analyzing artist genres, track characteristics, and listening patterns."
                  funFacts={generateOverviewFunFacts()}
                  metrics={[
                    { label: "Total Artists", value: `${stats.totalArtists}`, description: "Artists analyzed for genre data" },
                    { label: "Genre Diversity", value: `${genreAnalysis.length}`, description: "Unique genres identified" },
                    { label: "Top Genre", value: genreAnalysis[0]?.name || 'N/A', description: "Your most dominant genre" }
                  ]}
                  variant="modal"
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
        {!hasSpotifyData && (
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
        {hasSpotifyData && insights && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Your Music Library Analytics
                <InfoButton
                  title="Library Analytics Deep Dive"
                  description="Comprehensive metrics about your music library's depth, diversity, and listening patterns."
                  calculation="Coverage shows how much of your total listening history we've captured. Quality combines completeness metrics. Your musical level is calculated from total tracks + artists divided by 40, representing your exploration intensity."
                  funFacts={[
                    `If you discovered one new artist per week, it would take ${Math.round(stats.totalArtists / 52)} years to find all the artists in your library!`,
                    "Your musical level increases as you discover more artists and tracks - you're currently a music explorer!",
                    `Your library diversity score of ${Math.round(insights.diversityScore)}% means you're more adventurous than ${insights.diversityScore}% of music listeners`,
                    "High coverage percentages indicate you're a dedicated music fan with deep listening habits"
                  ]}
                  metrics={[
                    { label: "Tracks Analyzed", value: `${stats.totalTracks}/1000`, description: "Complete track coverage" },
                    { label: "Artists Covered", value: `${stats.totalArtists}/1000`, description: "Artist network size" },
                    { label: "Musical Level", value: `${insights.level}`, description: "Based on exploration depth" }
                  ]}
                  variant="modal"
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

        {/* Error Dialog */}
        <ErrorDialog
          open={errorDialogOpen}
          onOpenChange={setErrorDialogOpen}
          title="Data Loading Error"
          message={currentError}
          onRetry={handleRetryError}
        />
      </div>
    </BlurLoader>
  );
};
