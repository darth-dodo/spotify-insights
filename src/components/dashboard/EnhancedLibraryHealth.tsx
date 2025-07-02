import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, TrendingUp, Users, Gem, Award, Star, Music, Clock } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { LibraryHealthGauge } from '@/components/charts';

export const EnhancedLibraryHealth = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  
  // Use centralized store with full 2000 item dataset
  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const topTracksData = { items: tracks };
  const topArtistsData = { items: artists };

  const isLoading = tracksLoading || artistsLoading;

  const libraryAnalysis = useMemo(() => {
    if (!topTracksData?.items || !topArtistsData?.items) {
      return { 
        health: { diversity: 0, discovery: 0, balance: 0, overall: 0 },
        hiddenGems: [],
        insights: []
      };
    }

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;

    // Calculate diversity score
    const uniqueGenres = [...new Set(artists.flatMap(a => a.genres || []))];
    const diversity = Math.min((uniqueGenres.length / 10) * 100, 100);

    // Calculate discovery score (based on hidden gems)
    const hiddenGems = tracks.filter(track => (track.popularity || 0) < 40);
    const discovery = Math.min((hiddenGems.length / tracks.length) * 100, 100);

    // Calculate balance score (popularity distribution)
    const avgPopularity = tracks.reduce((sum, track) => sum + (track.popularity || 0), 0) / tracks.length;
    const balance = 100 - Math.abs(50 - avgPopularity);

    // Overall health score
    const overall = Math.round((diversity + discovery + balance) / 3);

    // Enhanced hidden gems with scores
    const enhancedHiddenGems = hiddenGems.map(track => ({
      ...track,
      gemScore: (50 - (track.popularity || 0)) + Math.random() * 20,
      rarity: (track.popularity || 0) < 20 ? 'Ultra Rare' : 
              (track.popularity || 0) < 30 ? 'Very Rare' : 'Rare'
    })).sort((a, b) => b.gemScore - a.gemScore);

    const insights = [
      `Your library shows ${diversity > 70 ? 'excellent' : diversity > 50 ? 'good' : 'moderate'} genre diversity`,
      `You've discovered ${hiddenGems.length} hidden gems (${Math.round(discovery)}% discovery rate)`,
      `Your music taste balance is ${balance > 70 ? 'well-rounded' : balance > 50 ? 'balanced' : 'specialized'}`,
      `Overall library health: ${overall > 80 ? 'Excellent' : overall > 60 ? 'Good' : 'Needs improvement'}`
    ];

    return {
      health: { diversity, discovery, balance, overall },
      hiddenGems: enhancedHiddenGems,
      insights
    };
  }, [topTracksData, topArtistsData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Library Health Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Library Health Analysis
          <InfoButton
            title="Library Health Analysis"
            description="Comprehensive analysis of your music library's diversity, discovery rate, and overall balance. This helps you understand how varied and well-rounded your musical taste is."
            calculation="Health scores are calculated based on: Diversity (genre variety), Discovery (hidden gems ratio), and Balance (popularity distribution). Overall score is the average of these three metrics."
            funFacts={[
              "Higher diversity scores indicate broader musical tastes",
              "Discovery rate shows how much you explore unknown music",
              "Balance measures if you listen to both popular and niche tracks",
              "Hidden gems are tracks with popularity < 40 that you love"
            ]}
            metrics={[
              { label: "Diversity Score", value: `${Math.round(libraryAnalysis.health.diversity)}/100`, description: "Genre variety in your library" },
              { label: "Discovery Rate", value: `${Math.round(libraryAnalysis.health.discovery)}/100`, description: "How much you explore new music" },
              { label: "Balance Score", value: `${Math.round(libraryAnalysis.health.balance)}/100`, description: "Mix of popular and niche tracks" }
            ]}
          />
        </CardTitle>
        <CardDescription>
          Analyze your music library's diversity, discovery patterns, and hidden gems
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
            <TabsTrigger value="hidden-gems">Hidden Gems</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-6">
            {/* Health Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <LibraryHealthGauge score={libraryAnalysis.health.overall} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Genre Diversity</span>
                    <Badge variant="outline">
                      {Math.round(libraryAnalysis.health.diversity)}/100
                    </Badge>
                  </div>
                  <Progress value={libraryAnalysis.health.diversity} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Discovery Rate</span>
                    <Badge variant="outline">
                      {Math.round(libraryAnalysis.health.discovery)}/100
                    </Badge>
                  </div>
                  <Progress value={libraryAnalysis.health.discovery} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taste Balance</span>
                    <Badge variant="outline">
                      {Math.round(libraryAnalysis.health.balance)}/100
                    </Badge>
                  </div>
                  <Progress value={libraryAnalysis.health.balance} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Library Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {libraryAnalysis.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hidden-gems" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Your Hidden Gems Collection
                  <Badge variant="secondary">{libraryAnalysis.hiddenGems.length} tracks</Badge>
                </CardTitle>
                <CardDescription>
                  Discover the rare tracks that showcase your unique musical taste
                </CardDescription>
              </CardHeader>
              <CardContent>
                {libraryAnalysis.hiddenGems.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {libraryAnalysis.hiddenGems.map((track, index) => (
                        <div key={track.id || index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/20">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
                              <Gem className="h-4 w-4 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{track.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist'}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {track.popularity}/100
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round((track.duration_ms || 0) / 60000)}:{String(Math.round(((track.duration_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant="secondary" 
                              className="bg-accent/10 text-accent border-accent/20 text-xs"
                            >
                              {track.rarity}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Score: {Math.round(track.gemScore)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12">
                    <Gem className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Hidden Gems Found</h3>
                    <p className="text-muted-foreground">
                      Your music consists mainly of popular tracks. Try exploring more underground artists!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
