
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sparkles } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';
import { FunFactCard } from './funfacts/FunFactCard';
import { useFunFactsCalculator } from './funfacts/useFunFactsCalculator';

export const FunFactsCarousel = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  
  const { useTopTracks, useTopArtists } = useSpotifyData();
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks(timeRange, 2000);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists(timeRange, 2000);

  const isLoading = tracksLoading || artistsLoading;
  const funFacts = useFunFactsCalculator(topTracksData, topArtistsData, timeRange);

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
              {funFacts.map((fact, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <FunFactCard fact={fact} />
                  </div>
                </CarouselItem>
              ))}
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
