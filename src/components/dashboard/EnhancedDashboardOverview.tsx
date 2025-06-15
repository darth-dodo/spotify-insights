
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Clock, Users, TrendingUp, Heart, Database, Star, Volume2, Zap, Lightbulb } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { useAuth } from '@/hooks/useAuth';
import { InfoButton } from '@/components/ui/InfoButton';
import { BlurLoader } from '@/components/ui/BlurLoader';
import { CalmingLoader } from '@/components/ui/CalmingLoader';
import { ErrorDialog } from '@/components/auth/ErrorDialog';
import { OverviewHeader } from './overview/OverviewHeader';

interface EnhancedDashboardOverviewProps {
  onNavigate?: (view: string) => void;
}

export const EnhancedDashboardOverview = ({ onNavigate }: EnhancedDashboardOverviewProps) => {
  const { tracks, artists, isLoading, getTopTracks, getTopArtists, getStats, getGenreAnalysis, error } = useExtendedSpotifyDataStore();
  const { user } = useAuth();
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
  const [currentError, setCurrentError] = React.useState<string>('');
  const [currentFunFact, setCurrentFunFact] = React.useState<string>('');

  // Handle errors
  React.useEffect(() => {
    if (error) {
      setCurrentError(typeof error === 'string' ? error : error.message || 'An unknown error occurred');
      setErrorDialogOpen(true);
    }
  }, [error]);

  const stats = getStats();
  const genreAnalysis = getGenreAnalysis();

  // Enhanced insights from the full 2000-item dataset
  const getEnhancedInsights = () => {
    if (!tracks.length || !artists.length) return null;

    const topGenres = genreAnalysis.slice(0, 3);
    const libraryCompleteness = Math.round((tracks.length / 2000) * 100);
    const artistCoverage = Math.round((artists.length / 2000) * 100);
    
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
      dataQuality: Math.round(((tracks.length + artists.length) / 4000) * 100),
      level
    };
  };

  const insights = getEnhancedInsights();

  // Check if we have any Spotify data
  const hasSpotifyData = stats?.hasSpotifyData && (tracks.length > 0 || artists.length > 0);

  // Generate random fun facts that change every session
  const generateRandomFunFacts = () => {
    if (!insights || !stats) return [];

    const allFacts = [
      `You have enough tracks to listen for ${Math.round(stats.totalTracks * 3.5 / 60)} hours straight without repeating a song!`,
      `Your musical taste spans ${stats.uniqueGenres} genres - that's more diverse than most radio stations!`,
      `You support ${stats.totalArtists} different artists - imagine if they all played at the same festival!`,
      `If you played all your top tracks back-to-back, it would take ${insights.totalHours} hours - that's ${Math.round(insights.totalHours / 24)} days of continuous music!`,
      `Your music library could soundtrack ${Math.round(stats.totalTracks / 12)} movies (assuming 12 songs per movie)!`,
      `You've discovered artists from ${Math.min(stats.uniqueGenres * 3, 50)} different musical movements and cultures!`,
      `Your playlist is ${stats.totalTracks} songs deep - that's equivalent to ${Math.round(stats.totalTracks / 200)} full album collections!`,
      `With ${stats.totalArtists} artists in your library, you could host a music festival lasting ${Math.round(stats.totalArtists / 50)} days!`,
      `Your musical DNA contains ${insights.diversityScore}% variety - making you more adventurous than most listeners!`,
      `If each artist performed for 3 minutes, your personal concert would last ${Math.round(stats.totalArtists * 3 / 60)} hours!`,
      `Your ${stats.totalTracks} tracks represent roughly ${Math.round(stats.totalTracks * 3.5 / 60 / 24)} days of pure musical content!`,
      `You listen to ${insights.tasteLevel.toLowerCase()} music - ${insights.tasteLevel === 'Underground' ? 'you\'re a true music explorer!' : 'you know what\'s trending!'}`,
      `Your library spans ${stats.uniqueGenres} genres - from mainstream hits to hidden gems across the musical spectrum!`,
      `With ${insights.libraryCompleteness}% of our limited dataset captured, you're a dedicated music enthusiast!`,
      `Your artist network includes ${stats.totalArtists} creators - that's enough to fill multiple music festivals!`
    ];

    // Select 3-4 random facts for this session
    const sessionFacts = [];
    const factIndices = new Set();
    
    while (sessionFacts.length < 4 && factIndices.size < allFacts.length) {
      const randomIndex = Math.floor(Math.random() * allFacts.length);
      if (!factIndices.has(randomIndex)) {
        factIndices.add(randomIndex);
        sessionFacts.push(allFacts[randomIndex]);
      }
    }

    return sessionFacts;
  };

  // Update fun fact on component mount and every few seconds
  React.useEffect(() => {
    if (hasSpotifyData) {
      const facts = generateRandomFunFacts();
      if (facts.length > 0) {
        setCurrentFunFact(facts[Math.floor(Math.random() * facts.length)]);
        
        // Change fact every 8 seconds
        const interval = setInterval(() => {
          setCurrentFunFact(facts[Math.floor(Math.random() * facts.length)]);
        }, 8000);

        return () => clearInterval(interval);
      }
    }
  }, [hasSpotifyData, stats?.totalTracks, stats?.totalArtists]);

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
          description="Processing up to 2000 tracks and artists from your limited dataset to deliver comprehensive insights"
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
                  description="Your musical footprint represents the total number of unique tracks in your limited dataset (capped at 2000 for optimal performance)."
                  calculation="This metric shows how many different songs you've listened to enough to appear in your top tracks. A larger number indicates more diverse listening habits and active music discovery. The calculation uses Spotify's personalization algorithms to rank your most played tracks from a limited dataset of up to 2000 tracks."
                  funFacts={[
                    "The average Spotify user has around 200-300 tracks in their regular rotation",
                    "Music collectors typically have 500+ unique tracks in their top listening data",
                    "Your library depth directly influences Spotify's recommendation accuracy",
                    "We limit the dataset to 2000 tracks to ensure optimal app performance"
                  ]}
                  metrics={[
                    { label: "Your Tracks", value: `${stats?.totalTracks || 0}`, description: "Unique songs in your limited dataset" },
                    { label: "Completion", value: `${insights?.libraryCompleteness || 0}%`, description: "Of maximum 2000 track limit" }
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
                  description="The breadth of your musical connections - how many different artists shape your sound from our limited dataset."
                  calculation="Count of unique artists from your limited dataset (up to 2000 artists for performance optimization). This includes primary artists, featured artists, and collaborators. Higher numbers suggest you explore music widely rather than focusing on just a few artists."
                  funFacts={[
                    "The typical music fan follows 50-100 artists regularly",
                    "Diverse artist networks often predict openness to new music genres",
                    "Supporting many artists helps fund the entire music ecosystem",
                    "Our dataset is limited to 2000 artists to maintain app responsiveness"
                  ]}
                  metrics={[
                    { label: "Your Artists", value: `${stats?.totalArtists || 0}`, description: "Unique artists you listen to" },
                    { label: "Coverage", value: `${insights?.artistCoverage || 0}%`, description: "Of maximum 2000 artist limit" }
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
                  description="Measures the diversity of your musical taste across different genres and styles from your limited dataset."
                  calculation="Calculated from unique genres of all artists in your limited library (capped at 2000 for performance). The score considers both the number of genres and their diversity. 10+ genres = Eclectic Explorer, 6-9 = Genre Adventurer, 3-5 = Selective Listener, <3 = Genre Loyalist."
                  funFacts={[
                    "Most people stick to 3-5 genres throughout their lives",
                    "Genre exploration peaks in teenage years and early twenties",
                    "Listening to diverse genres can enhance cognitive flexibility",
                    "Some genres are 'gateway drugs' to discovering others (like indie to folk to country)",
                    "We analyze up to 2000 tracks/artists to ensure smooth performance"
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
                  description="Indicates whether you gravitate toward mainstream hits or underground gems based on your limited dataset."
                  calculation="Based on average popularity scores (0-100) of your tracks from the limited dataset (up to 2000 tracks). Spotify calculates popularity using recent play counts and user engagement. 80-100 = Mainstream, 60-79 = Popular, 40-59 = Alternative, 0-39 = Underground."
                  funFacts={[
                    "Underground music lovers often discover artists 2-3 years before they go mainstream",
                    "Mainstream taste isn't bad - it means you like what resonates with millions of people!",
                    "Your taste profile can predict your personality traits (openness, extraversion)",
                    "The 'popularity paradox': some of the best music has low popularity scores",
                    "Analysis is based on your limited dataset for optimal performance"
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

        {/* Random Fun Facts Section (replacing heatmap) */}
        {hasSpotifyData && currentFunFact && (
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Musical Fun Fact
                <InfoButton
                  title="Musical Fun Facts"
                  description="Discover interesting insights about your music library that change with each session."
                  calculation="Generated from your listening data including track counts, artist diversity, genre exploration, and listening time. Facts are randomly selected and rotate every few seconds to keep things interesting."
                  funFacts={[
                    "Fun facts are generated from your actual listening data",
                    "Each session shows different facts to keep things fresh",
                    "Facts consider your total tracks, artists, genres, and listening time",
                    "Based on your limited dataset of up to 2000 tracks for performance"
                  ]}
                  metrics={[
                    { label: "Data Source", value: "Limited Dataset", description: "Up to 2000 tracks/artists" },
                    { label: "Fact Rotation", value: "Every 8 seconds", description: "Keeps content fresh" }
                  ]}
                />
              </CardTitle>
              <CardDescription>
                Interesting insights from your limited music dataset that refresh each session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm font-medium text-foreground transition-all duration-500">
                  {currentFunFact}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Fun facts refresh automatically • Based on your {stats.totalTracks} tracks and {stats.totalArtists} artists
              </p>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Genre Distribution from Limited Dataset */}
        {hasSpotifyData && genreAnalysis.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Your Musical DNA Analysis
                <InfoButton
                  title="Musical DNA Deep Dive"
                  description="Deep dive into your musical identity through comprehensive genre analysis from your limited dataset."
                  calculation="Each percentage represents how much that genre influences your overall taste, calculated from all artists in your limited dataset (up to 2000 items for performance). This creates your unique musical fingerprint by analyzing artist genres, track characteristics, and listening patterns."
                  funFacts={generateRandomFunFacts()}
                  metrics={[
                    { label: "Total Artists", value: `${stats.totalArtists}`, description: "Artists analyzed for genre data" },
                    { label: "Genre Diversity", value: `${genreAnalysis.length}`, description: "Unique genres identified" },
                    { label: "Top Genre", value: genreAnalysis[0]?.name || 'N/A', description: "Your most dominant genre" },
                    { label: "Dataset Limit", value: "2000", description: "Tracks/artists cap for performance" }
                  ]}
                  variant="modal"
                />
              </CardTitle>
              <CardDescription>
                Comprehensive genre breakdown from {stats.totalArtists} artists in your limited dataset (capped at 2000 for performance)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {genreAnalysis.slice(0, 8).map((genre, index) => (
                  <div key={index} className="p-4 rounded-lg border transition-all hover:shadow-md" 
                       style={{ 
                         backgroundColor: `hsl(var(--accent) / 0.1)`, 
                         borderColor: `hsl(var(--accent) / 0.3)` 
                       }}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm capitalize">{genre.name}</h4>
                      <Badge variant="secondary" className="text-accent">
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
                        className="h-2 rounded-full transition-all duration-500 bg-accent"
                        style={{ width: `${genre.value}%` }}
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
                Connect your Spotify account to access comprehensive insights from up to 2000 tracks and artists (limited dataset for optimal performance)
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
                        <span>Complete top 2000 tracks analysis</span>
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
                    <p className="text-xs text-muted-foreground mt-3">
                      * Dataset limited to 2000 tracks/artists for optimal app performance
                    </p>
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
                  description="Comprehensive metrics about your music library's depth, diversity, and listening patterns from the limited dataset."
                  calculation="Coverage shows how much of your total listening history we've captured (up to 2000 items for performance). Quality combines completeness metrics. Your musical level is calculated from total tracks + artists divided by 40, representing your exploration intensity within our performance-optimized limits."
                  funFacts={[
                    `If you discovered one new artist per week, it would take ${Math.round(stats.totalArtists / 52)} years to find all the artists in your limited library!`,
                    "Your musical level increases as you discover more artists and tracks - you're currently a music explorer!",
                    `Your library diversity score of ${Math.round(insights.diversityScore)}% means you're more adventurous than ${insights.diversityScore}% of music listeners`,
                    "High coverage percentages indicate you're a dedicated music fan with deep listening habits",
                    "We cap the dataset at 2000 tracks/artists to ensure the app runs smoothly on all devices"
                  ]}
                  metrics={[
                    { label: "Tracks Analyzed", value: `${stats.totalTracks}/2000`, description: "Complete track coverage" },
                    { label: "Artists Covered", value: `${stats.totalArtists}/2000`, description: "Artist network size" },
                    { label: "Musical Level", value: `${insights.level}`, description: "Based on exploration depth" },
                    { label: "Performance Cap", value: "2000", description: "Items limit for optimization" }
                  ]}
                  variant="modal"
                />
              </CardTitle>
              <CardDescription>
                Advanced insights into your musical preferences and library composition (limited to 2000 items for performance)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="text-2xl font-bold text-accent">{insights.libraryCompleteness}%</div>
                  <div className="text-sm font-medium">Track Coverage</div>
                  <div className="text-xs text-muted-foreground mt-1">{stats.totalTracks}/2000 tracks analyzed</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{insights.artistCoverage}%</div>
                  <div className="text-sm font-medium">Artist Coverage</div>
                  <div className="text-xs text-muted-foreground mt-1">{stats.totalArtists}/2000 artists analyzed</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="text-2xl font-bold">{Math.round(insights.diversityScore)}%</div>
                  <div className="text-sm font-medium">Musical Diversity</div>
                  <div className="text-xs text-muted-foreground mt-1">{stats.uniqueGenres} unique genres</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="text-2xl font-bold text-accent">Level {insights.level}</div>
                  <div className="text-sm font-medium">Musical Explorer</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on limited library size</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Performance Note:</strong> Your library is capped at 2000 tracks and artists to ensure optimal app performance across all devices.
                </p>
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
