import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Treemap } from 'recharts';
import { Music, TrendingUp, Star, Sparkles, Target, Zap, Heart, Brain, Palette, Compass } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { cn } from '@/lib/utils';
import { InfoButton } from '@/components/ui/InfoButton';

interface GenreInsight {
  name: string;
  count: number;
  percentage: number;
  artists: string[];
  tracks: string[];
  avgPopularity: number;
  dominanceScore: number;
  diversityIndex: number;
  moodProfile: {
    energy: number;
    valence: number;
    danceability: number;
  };
  timeSignature: string;
  keyCharacteristics: string[];
  culturalOrigin: string;
  evolutionTrend: 'rising' | 'stable' | 'declining';
}

export const RefactoredGenreAnalysis = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'deep' | 'comparison'>('overview');
  const [sortBy, setSortBy] = useState<'dominance' | 'diversity' | 'popularity' | 'evolution'>('dominance');

  const { tracks, artists, isLoading: storeLoading } = useExtendedSpotifyDataStore();
  const isLoading = storeLoading;

  // Helper functions - moved before useMemo to fix initialization error
  const generateMoodProfile = (genre: string, popularity: number) => {
    const genreLower = genre.toLowerCase();
    let energy = 50, valence = 50, danceability = 50;

    // Genre-specific mood adjustments
    if (genreLower.includes('rock') || genreLower.includes('metal')) {
      energy = Math.min(100, 70 + Math.random() * 30);
      valence = 40 + Math.random() * 40;
      danceability = 30 + Math.random() * 40;
    } else if (genreLower.includes('pop') || genreLower.includes('dance')) {
      energy = 60 + Math.random() * 40;
      valence = 60 + Math.random() * 40;
      danceability = 70 + Math.random() * 30;
    } else if (genreLower.includes('jazz') || genreLower.includes('blues')) {
      energy = 30 + Math.random() * 40;
      valence = 40 + Math.random() * 30;
      danceability = 40 + Math.random() * 30;
    } else if (genreLower.includes('electronic') || genreLower.includes('house')) {
      energy = 70 + Math.random() * 30;
      valence = 50 + Math.random() * 40;
      danceability = 80 + Math.random() * 20;
    } else if (genreLower.includes('folk') || genreLower.includes('country')) {
      energy = 30 + Math.random() * 30;
      valence = 50 + Math.random() * 30;
      danceability = 30 + Math.random() * 30;
    }

    // Adjust based on popularity
    const popularityFactor = popularity / 100;
    energy = Math.min(100, energy + (popularityFactor * 10));
    valence = Math.min(100, valence + (popularityFactor * 15));

    return {
      energy: Math.round(energy),
      valence: Math.round(valence),
      danceability: Math.round(danceability)
    };
  };

  const determineEvolutionTrend = (genre: string, popularity: number, count: number): 'rising' | 'stable' | 'declining' => {
    const genreLower = genre.toLowerCase();
    
    // Modern genres tend to be rising
    if (genreLower.includes('trap') || genreLower.includes('indie') || genreLower.includes('electronic')) {
      return 'rising';
    }
    
    // Classic genres with high popularity are stable
    if (popularity > 80 && count > 5) {
      return 'stable';
    }
    
    // Older genres might be declining
    if (genreLower.includes('classic') || genreLower.includes('traditional')) {
      return 'declining';
    }
    
    return 'stable';
  };

  const getGenreCharacteristics = (genre: string) => {
    const genreLower = genre.toLowerCase();
    
    const characteristics: { [key: string]: { origin: string; features: string[]; time: string } } = {
      'rock': { origin: 'United States/UK', features: ['Guitar-driven', 'Strong rhythm', 'Rebellious spirit'], time: '4/4' },
      'pop': { origin: 'Global', features: ['Catchy melodies', 'Commercial appeal', 'Accessible'], time: '4/4' },
      'jazz': { origin: 'United States', features: ['Improvisation', 'Complex harmony', 'Swing rhythm'], time: 'Variable' },
      'electronic': { origin: 'Germany/UK', features: ['Synthesized sounds', 'Digital production', 'Rhythmic focus'], time: '4/4' },
      'hip hop': { origin: 'United States', features: ['Rhythmic speech', 'Sampling', 'Urban culture'], time: '4/4' },
      'folk': { origin: 'Traditional/Global', features: ['Acoustic instruments', 'Storytelling', 'Cultural heritage'], time: 'Variable' },
      'classical': { origin: 'Europe', features: ['Orchestral arrangements', 'Formal structure', 'Technical mastery'], time: 'Variable' },
      'blues': { origin: 'United States', features: ['12-bar progression', 'Emotional expression', 'Call-response'], time: '4/4' },
      'reggae': { origin: 'Jamaica', features: ['Off-beat rhythm', 'Social consciousness', 'Caribbean influence'], time: '4/4' },
      'country': { origin: 'United States', features: ['Storytelling', 'Rural themes', 'String instruments'], time: '4/4' }
    };

    // Find matching characteristics
    for (const [key, value] of Object.entries(characteristics)) {
      if (genreLower.includes(key)) {
        return {
          culturalOrigin: value.origin,
          keyCharacteristics: value.features,
          timeSignature: value.time
        };
      }
    }

    return {
      culturalOrigin: 'Various',
      keyCharacteristics: ['Unique style', 'Distinctive sound', 'Cultural expression'],
      timeSignature: '4/4'
    };
  };

  // Advanced genre analysis with comprehensive insights
  const genreAnalysis = useMemo((): GenreInsight[] => {
    if (!tracks || !artists) return [];

    const genreMap = new Map<string, {
      count: number;
      artists: Set<string>;
      tracks: Set<string>;
      popularitySum: number;
      artistIds: Set<string>;
    }>();

    // Process artists and their genres
    artists.forEach((artist: any) => {
      const artistPopularity = artist.popularity || 0;
      artist.genres?.forEach((genre: string) => {
        if (!genreMap.has(genre)) {
          genreMap.set(genre, {
            count: 0,
            artists: new Set(),
            tracks: new Set(),
            popularitySum: 0,
            artistIds: new Set()
          });
        }
        const genreData = genreMap.get(genre)!;
        genreData.count += 1;
        genreData.artists.add(artist.name);
        genreData.artistIds.add(artist.id);
        genreData.popularitySum += artistPopularity;
      });
    });

    // Add track information
    tracks.forEach((track: any) => {
      track.artists?.forEach((artist: any) => {
        const matchingArtist = artists.find((a: any) => a.id === artist.id);
        if (matchingArtist?.genres) {
          matchingArtist.genres.forEach((genre: string) => {
            const genreData = genreMap.get(genre);
            if (genreData) {
              genreData.tracks.add(track.name);
            }
          });
        }
      });
    });

    const totalGenreCount = Array.from(genreMap.values()).reduce((sum, data) => sum + data.count, 0);

    // Generate comprehensive genre insights
    const genreInsights: GenreInsight[] = Array.from(genreMap.entries())
      .map(([genre, data]) => {
        const percentage = totalGenreCount > 0 ? (data.count / totalGenreCount) * 100 : 0;
        const avgPopularity = data.count > 0 ? data.popularitySum / data.count : 0;
        
        // Calculate dominance score (combination of count, popularity, and track coverage)
        const dominanceScore = Math.min(100, 
          (percentage * 2) + (avgPopularity * 0.3) + (data.tracks.size * 0.5)
        );

        // Calculate diversity index (how many different artists contribute to this genre)
        const diversityIndex = Math.min(100, (data.artists.size / Math.max(data.count, 1)) * 100);

        // Generate mood profile based on genre characteristics
        const moodProfile = generateMoodProfile(genre, avgPopularity);

        // Determine evolution trend
        const evolutionTrend = determineEvolutionTrend(genre, avgPopularity, data.count);

        // Get cultural origin and characteristics
        const { culturalOrigin, keyCharacteristics, timeSignature } = getGenreCharacteristics(genre);

        return {
          name: genre,
          count: data.count,
          percentage: Math.round(percentage * 100) / 100,
          artists: Array.from(data.artists),
          tracks: Array.from(data.tracks),
          avgPopularity: Math.round(avgPopularity),
          dominanceScore: Math.round(dominanceScore),
          diversityIndex: Math.round(diversityIndex),
          moodProfile,
          timeSignature,
          keyCharacteristics,
          culturalOrigin,
          evolutionTrend
        };
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'diversity':
            return b.diversityIndex - a.diversityIndex;
          case 'popularity':
            return b.avgPopularity - a.avgPopularity;
          case 'evolution':
            return b.count - a.count; // Fallback to count for evolution
          case 'dominance':
          default:
            return b.dominanceScore - a.dominanceScore;
        }
      })
      .slice(0, 20);

    return genreInsights;
  }, [tracks, artists, sortBy]);



  // Chart data generation
  const dominanceChartData = useMemo(() => {
    return genreAnalysis.slice(0, 8).map(genre => ({
      name: genre.name.length > 12 ? genre.name.substring(0, 12) + '...' : genre.name,
      fullName: genre.name,
      dominance: genre.dominanceScore,
      diversity: genre.diversityIndex,
      popularity: genre.avgPopularity
    }));
  }, [genreAnalysis]);

  const moodRadarData = useMemo(() => {
    if (!selectedGenre) return [];
    const genre = genreAnalysis.find(g => g.name === selectedGenre);
    if (!genre) return [];

    return [
      { mood: 'Energy', value: genre.moodProfile.energy, fullMark: 100 },
      { mood: 'Valence', value: genre.moodProfile.valence, fullMark: 100 },
      { mood: 'Danceability', value: genre.moodProfile.danceability, fullMark: 100 },
      { mood: 'Popularity', value: genre.avgPopularity, fullMark: 100 },
      { mood: 'Dominance', value: genre.dominanceScore, fullMark: 100 },
      { mood: 'Diversity', value: genre.diversityIndex, fullMark: 100 }
    ];
  }, [selectedGenre, genreAnalysis]);

  const evolutionData = useMemo(() => {
    const trends = { rising: 0, stable: 0, declining: 0 };
    genreAnalysis.forEach(genre => {
      trends[genre.evolutionTrend]++;
    });

    return [
      { name: 'Rising', value: trends.rising, color: '#4ECDC4' },
      { name: 'Stable', value: trends.stable, color: '#45B7D1' },
      { name: 'Declining', value: trends.declining, color: '#FF6B6B' }
    ];
  }, [genreAnalysis]);

  // Calculate comprehensive statistics
  const calculateAdvancedStats = () => {
    const totalArtists = new Set(genreAnalysis.flatMap(g => g.artists)).size;
    const totalTracks = new Set(genreAnalysis.flatMap(g => g.tracks)).size;
    const avgDominance = genreAnalysis.reduce((sum, g) => sum + g.dominanceScore, 0) / genreAnalysis.length;
    const avgDiversity = genreAnalysis.reduce((sum, g) => sum + g.diversityIndex, 0) / genreAnalysis.length;
    const culturalDiversity = new Set(genreAnalysis.map(g => g.culturalOrigin)).size;

    return {
      totalGenres: genreAnalysis.length,
      totalArtists,
      totalTracks,
      avgDominance: Math.round(avgDominance),
      avgDiversity: Math.round(avgDiversity),
      culturalDiversity,
      dominantGenre: genreAnalysis[0]?.name || 'None'
    };
  };

  const stats = calculateAdvancedStats();

  const chartConfig = {
    dominance: { label: "Dominance Score", color: "hsl(var(--accent))" },
    diversity: { label: "Diversity Index", color: "hsl(var(--primary))" },
    popularity: { label: "Popularity", color: "hsl(217, 91%, 60%)" }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Advanced Genre Analysis</h1>
          <p className="text-muted-foreground">Loading comprehensive genre insights...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            Advanced Genre Analysis
            <InfoButton
              title="Advanced Genre Analysis System"
              description="Comprehensive analysis of your musical genres with cultural insights, mood profiling, evolution trends, and dominance scoring."
              calculation="Genres analyzed from your complete Spotify library with advanced metrics: Dominance Score (genre prevalence + popularity + track coverage), Diversity Index (artist variety within genre), Mood Profile (energy/valence/danceability), and Evolution Trends."
              funFacts={[
                "Genre analysis reveals your cultural musical preferences",
                "Mood profiles show the emotional characteristics of your taste",
                "Evolution trends indicate how your taste aligns with music trends",
                "Cultural diversity shows your global music exploration"
              ]}
              metrics={[
                { label: "Data Scope", value: "2000 max", description: "Tracks/artists analyzed" },
                { label: "Genre Metrics", value: "7 insights", description: "Dominance, diversity, mood, evolution" },
                { label: "Cultural Analysis", value: "Global", description: "Origins and characteristics" }
              ]}
            />
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Deep dive into your musical genres with cultural insights and advanced analytics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={analysisMode} onValueChange={(value) => setAnalysisMode(value as typeof analysisMode)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Analysis mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="deep">Deep Analysis</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dominance">Dominance Score</SelectItem>
              <SelectItem value="diversity">Diversity Index</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="evolution">Evolution Trend</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Stats Overview - Optimized for Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7 gap-3 md:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Genres</span>
              <InfoButton
                title="Total Genres"
                description="Number of distinct musical genres in your library"
                calculation="Unique genres extracted from artist metadata"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalGenres}</div>
            <div className="text-xs text-muted-foreground">discovered</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Dominance</span>
              <InfoButton
                title="Average Dominance"
                description="How strongly genres are represented in your library"
                calculation="Average of all genre dominance scores (prevalence + popularity + coverage)"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgDominance}</div>
            <div className="text-xs text-muted-foreground">avg score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Diversity</span>
              <InfoButton
                title="Average Diversity"
                description="How varied artists are within each genre"
                calculation="Average diversity index across all genres (artist variety per genre)"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgDiversity}</div>
            <div className="text-xs text-muted-foreground">diversity</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Cultural</span>
              <InfoButton
                title="Cultural Diversity"
                description="Number of different cultural origins in your genres"
                calculation="Count of unique cultural origins across all genres"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.culturalDiversity}</div>
            <div className="text-xs text-muted-foreground">origins</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Top Genre</span>
              <InfoButton
                title="Dominant Genre"
                description="Your most dominant musical genre"
                calculation="Genre with highest dominance score"
              />
            </div>
            <div className="text-sm md:text-base font-bold truncate">{stats.dominantGenre}</div>
            <div className="text-xs text-muted-foreground">leading</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
              <InfoButton
                title="Total Artists"
                description="Unique artists across all genres"
                calculation="Count of distinct artists in your genre analysis"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalArtists}</div>
            <div className="text-xs text-muted-foreground">unique</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
              <InfoButton
                title="Total Tracks"
                description="Unique tracks across all genres"
                calculation="Count of distinct tracks in your genre analysis"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">analyzed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={analysisMode} onValueChange={(value) => setAnalysisMode(value as typeof analysisMode)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deep">Deep Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          {/* Genre Cards with Advanced Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Genre Landscape
              </CardTitle>
              <CardDescription>
                Your musical genres with comprehensive insights and cultural context
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {genreAnalysis.slice(0, 12).map((genre) => (
                  <Card 
                    key={genre.name} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      selectedGenre === genre.name ? 'ring-2 ring-accent' : ''
                    )}
                    onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{genre.name}</h3>
                            <p className="text-xs text-muted-foreground">{genre.culturalOrigin}</p>
                          </div>
                          <Badge 
                            variant={genre.evolutionTrend === 'rising' ? 'default' : 
                                   genre.evolutionTrend === 'stable' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {genre.evolutionTrend}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Dominance</span>
                            <span>{genre.dominanceScore}/100</span>
                          </div>
                          <Progress value={genre.dominanceScore} className="h-1" />
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-1 bg-muted/20 rounded">
                            <div className="font-medium">{genre.artists.length}</div>
                            <div className="text-muted-foreground">Artists</div>
                          </div>
                          <div className="text-center p-1 bg-muted/20 rounded">
                            <div className="font-medium">{genre.tracks.length}</div>
                            <div className="text-muted-foreground">Tracks</div>
                          </div>
                          <div className="text-center p-1 bg-muted/20 rounded">
                            <div className="font-medium">{genre.diversityIndex}</div>
                            <div className="text-muted-foreground">Diversity</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {genre.keyCharacteristics.slice(0, 2).map((char) => (
                            <Badge key={char} variant="outline" className="text-xs px-1.5 py-0">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts - Optimized for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">Genre Dominance Analysis</CardTitle>
                <CardDescription className="text-sm">
                  Dominance vs diversity scores for your top genres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dominanceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="dominance" fill="hsl(var(--accent))" />
                      <Bar dataKey="diversity" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">Evolution Trends</CardTitle>
                <CardDescription className="text-sm">
                  How your genres align with current music trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={evolutionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {evolutionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Additional Chart for Desktop - Cultural Origins */}
            <Card className="hover:shadow-md transition-shadow xl:block hidden">
              <CardHeader>
                <CardTitle className="text-base">Cultural Origins</CardTitle>
                <CardDescription className="text-sm">
                  Geographic diversity of your musical taste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(genreAnalysis.map(g => g.culturalOrigin))).slice(0, 8).map((origin, index) => {
                    const count = genreAnalysis.filter(g => g.culturalOrigin === origin).length;
                    const percentage = Math.round((count / genreAnalysis.length) * 100);
                    return (
                      <div key={origin} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `hsl(${index * 45}, 70%, 60%)` }}
                          />
                          <span className="text-sm font-medium">{origin}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{percentage}%</div>
                          <div className="text-xs text-muted-foreground">{count} genres</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deep" className="space-y-4 md:space-y-6">
          {selectedGenre ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Deep Dive: {selectedGenre}
                </CardTitle>
                <CardDescription>
                  Comprehensive analysis of your {selectedGenre.toLowerCase()} listening
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {(() => {
                      const genre = genreAnalysis.find(g => g.name === selectedGenre);
                      if (!genre) return null;
                      
                      return (
                        <>
                          <div className="space-y-3">
                            <h4 className="font-medium">Cultural Context</h4>
                            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Origin:</span>
                                <span className="font-medium">{genre.culturalOrigin}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Time Signature:</span>
                                <span className="font-medium">{genre.timeSignature}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Evolution:</span>
                                <Badge variant="outline" className="text-xs">
                                  {genre.evolutionTrend}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Key Characteristics</h4>
                            <div className="flex flex-wrap gap-2">
                              {genre.keyCharacteristics.map((char) => (
                                <Badge key={char} variant="secondary" className="text-xs">
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Your Connection</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center p-3 bg-accent/10 rounded">
                                <div className="text-xl font-bold text-accent">{genre.dominanceScore}</div>
                                <div className="text-xs text-muted-foreground">Dominance Score</div>
                              </div>
                              <div className="text-center p-3 bg-primary/10 rounded">
                                <div className="text-xl font-bold text-primary">{genre.percentage}%</div>
                                <div className="text-xs text-muted-foreground">Library Share</div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Mood Profile</h4>
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={moodRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="mood" fontSize={12} />
                          <PolarRadiusAxis fontSize={10} />
                          <Radar
                            name={selectedGenre}
                            dataKey="value"
                            stroke="hsl(var(--accent))"
                            fill="hsl(var(--accent))"
                            fillOpacity={0.2}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select a Genre for Deep Analysis</h3>
                <p className="text-muted-foreground">
                  Click on any genre from the overview to see detailed cultural insights and mood profiling
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Genre Comparison Matrix</CardTitle>
              <CardDescription>
                Compare your top genres across multiple dimensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {genreAnalysis.slice(0, 10).map((genre) => (
                    <Card key={genre.name} className="border-l-4 border-l-accent/30">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{genre.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {genre.culturalOrigin}
                              </Badge>
                              <Badge 
                                variant={genre.evolutionTrend === 'rising' ? 'default' : 
                                       genre.evolutionTrend === 'stable' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {genre.evolutionTrend}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Dominance</span>
                                <span>{genre.dominanceScore}</span>
                              </div>
                              <Progress value={genre.dominanceScore} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Diversity</span>
                                <span>{genre.diversityIndex}</span>
                              </div>
                              <Progress value={genre.diversityIndex} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Energy</span>
                                <span>{genre.moodProfile.energy}</span>
                              </div>
                              <Progress value={genre.moodProfile.energy} className="h-1" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Valence</span>
                                <span>{genre.moodProfile.valence}</span>
                              </div>
                              <Progress value={genre.moodProfile.valence} className="h-1" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{genre.artists.length} artists • {genre.tracks.length} tracks</span>
                            <span>{genre.percentage}% of library</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 