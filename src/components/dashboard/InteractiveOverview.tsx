
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { StatsOverview } from './overview/StatsOverview';
import { RecentActivity } from './overview/RecentActivity';
import { AchievementsPreview } from './overview/AchievementsPreview';
import { ActivityHeatmap } from './overview/ActivityHeatmap';

export const InteractiveOverview = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 10);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(10);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Calculate level from total tracks
  const totalTracks = topTracksData?.items?.length || 0;
  const level = Math.min(Math.floor(totalTracks / 5) + 1, 50);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading your music data... 🎵</h1>
          <p className="text-muted-foreground">Please wait while we fetch your listening insights</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex flex-wrap items-center gap-2">
              Welcome back! 🎵
              <Badge variant="outline" className="text-accent border-accent">
                Level {level}
              </Badge>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Your musical journey continues - check out your latest achievements!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsOverview 
        selectedCard={selectedCard} 
        onCardSelect={setSelectedCard} 
      />

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      {/* Tabs for different sections */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <RecentActivity />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <AchievementsPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
};
