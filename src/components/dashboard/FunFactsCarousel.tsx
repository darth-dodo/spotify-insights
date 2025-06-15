import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sparkles, TrendingUp, Clock, Music, Users, Star, Disc, Heart, BarChart3, Zap } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

export const FunFactsCarousel = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  
  const { useTopTracks, useTopArtists } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 2000);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 2000);

  const isLoading = tracksLoading || artistsLoading;

  // Calculate fun facts from the full 2000-record dataset
  const calculateFunFacts = () => {
    if (!topTracksData?.items || !topArtistsData?.items) return [];

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;

    // Total listening time with proper type checking
    const totalDurationMs: number = tracks.reduce((sum: number, track) => {
      const duration = track.duration_ms;
      if (typeof duration === 'number' && duration > 0) {
        return sum + duration;
      }
      return sum;
    }, 0);
    const totalHours = Math.round(totalDurationMs / (1000 * 60 * 60));
    const totalDays = Math.round(totalHours / 24);

    // Genre analysis
    const allGenres = artists.flatMap(artist => artist.genres || []);
    const uniqueGenres = [...new Set(allGenres)];
    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topGenre = Object.entries(genreCounts).sort(([,a], [,b]) => b - a)[0]?.[0];

    // Artist diversity
    const uniqueArtists = [...new Set(tracks.flatMap(track => track.artists?.map(a => a.id) || []))];
    const artistCounts = tracks.reduce((acc, track) => {
      track.artists?.forEach(artist => {
        acc[artist.id] = (acc[artist.id] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    const artistCountValues = Object.values(artistCounts).filter((count): count is number => typeof count === 'number');
    const topArtistPlays = artistCountValues.length > 0 ? Math.max(...artistCountValues) : 0;

    // Popularity analysis with proper type checking
    const validPopularityTracks = tracks.filter(track => typeof track.popularity === 'number');
    const avgPopularity = validPopularityTracks.length > 0 
      ? Math.round(validPopularityTracks.reduce((sum, track) => sum + (track.popularity as number), 0) / validPopularityTracks.length)
      : 0;
    const popularTracks = tracks.filter(track => (track.popularity || 0) > 80).length;
    const hiddenGems = tracks.filter(track => (track.popularity || 0) < 30).length;

    // Duration analysis with proper type checking
    const avgDuration = tracks.length > 0 ? totalDurationMs / tracks.length / 1000 / 60 : 0; // minutes
    const shortTracks = tracks.filter(track => (track.duration_ms || 0) < 180000).length; // under 3 min
    const longTracks = tracks.filter(track => (track.duration_ms || 0) > 300000).length; // over 5 min

    // Time period specific facts
    const timeRangeLabel = timeRange === 'short_term' ? '4 weeks' : 
                          timeRange === 'medium_term' ? '6 months' : 'all time';
    
    const funFacts = [
      {
        icon: Clock,
        title: "Total Listening Time",
        fact: `You've listened to ${totalHours.toLocaleString()} hours of music`,
        detail: `That's ${totalDays} full days of continuous music in your ${timeRangeLabel} data!`,
        color: "text-blue-500"
      },
      {
        icon: Music,
        title: "Genre Explorer",
        fact: `You've discovered ${uniqueGenres.length} different genres`,
        detail: `Your top genre is ${topGenre || 'Unknown'}, showing your diverse musical taste!`,
        color: "text-purple-500"
      },
      {
        icon: Users,
        title: "Artist Diversity",
        fact: `${uniqueArtists.length} unique artists in your collection`,
        detail: `From mainstream hits to hidden gems, you support a wide range of artists!`,
        color: "text-green-500"
      },
      {
        icon: Star,
        title: "Music Taste Score",
        fact: `Your average track popularity is ${avgPopularity}/100`,
        detail: `You have ${popularTracks} mainstream hits and ${hiddenGems} hidden gems!`,
        color: "text-yellow-500"
      },
      {
        icon: BarChart3,
        title: "Track Length Preference",
        fact: `Your average song is ${Math.round(avgDuration * 10) / 10} minutes long`,
        detail: `${shortTracks} quick tracks, ${longTracks} epic songs - perfectly balanced!`,
        color: "text-red-500"
      },
      {
        icon: Heart,
        title: "Music Dedication",
        fact: `You could listen to your top ${tracks.length} tracks for ${Math.round(totalHours/24)} days straight`,
        detail: `Your music library represents serious dedication to discovering great songs!`,
        color: "text-pink-500"
      },
      {
        icon: Zap,
        title: "Discovery Power",
        fact: `${Math.round((hiddenGems / tracks.length) * 100)}% of your music are hidden gems`,
        detail: `You're a true music discoverer, finding tracks before they go mainstream!`,
        color: "text-orange-500"
      },
      {
        icon: Disc,
        title: "Collection Size",
        fact: `Your top ${tracks.length} tracks span ${uniqueGenres.length} genres`,
        detail: `That's an average of ${Math.round(tracks.length / uniqueGenres.length)} tracks per genre!`,
        color: "text-cyan-500"
      }
    ];

    return funFacts;
  };

  const funFacts = calculateFunFacts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Music Fun Facts
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

  if (funFacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Music Fun Facts
            <InfoButton
              title="Music Fun Facts"
              description="Interesting insights and statistics calculated from your full Spotify listening dataset of up to 2,000 tracks and artists."
              calculation="All statistics are computed from your complete dataset, providing comprehensive insights into your music preferences and listening habits."
              variant="modal"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data available for fun facts</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          Music Fun Facts
          <InfoButton
            title="Music Fun Facts"
            description="Interesting insights and statistics calculated from your full Spotify listening dataset of up to 2,000 tracks and artists."
            calculation="All statistics are computed from your complete dataset, providing comprehensive insights into your music preferences and listening habits."
            variant="modal"
          />
          <Badge variant="outline" className="text-xs text-blue-600 border-blue-600 ml-auto">
            {funFacts.length} facts
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Fascinating insights from your {topTracksData?.items?.length || 0} tracks and {topArtistsData?.items?.length || 0} artists
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Carousel className="w-full max-w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {funFacts.map((fact, index) => {
                const IconComponent = fact.icon;
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-full bg-muted ${fact.color}`}>
                              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base">{fact.title}</h3>
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="text-lg sm:text-xl font-bold text-foreground">
                              {fact.fact}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {fact.detail}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
          
          {/* Mobile navigation hint */}
          <div className="text-center mt-4 sm:hidden">
            <p className="text-xs text-muted-foreground">Swipe to see more fun facts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
