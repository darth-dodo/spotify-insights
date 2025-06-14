
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { OverviewHeader } from './overview/OverviewHeader';
import { StatsOverview } from './overview/StatsOverview';
import { MusicInsightsSummary } from './overview/MusicInsightsSummary';
import { ActivityHeatmap } from './overview/ActivityHeatmap';
import { RecentActivity } from './overview/RecentActivity';
import { AchievementsPreview } from './overview/AchievementsPreview';
import { QuickNavigation } from './overview/QuickNavigation';

interface InteractiveOverviewProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveOverview = ({ onNavigate }: InteractiveOverviewProps) => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 10);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(10);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

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
      <OverviewHeader />

      {/* Quick Stats */}
      <StatsOverview 
        selectedCard={selectedCard} 
        onCardSelect={setSelectedCard} 
      />

      {/* Music Insights Summary */}
      <MusicInsightsSummary />

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      {/* Quick Navigation to Other Tabs */}
      <QuickNavigation onNavigate={handleNavigation} />

      {/* Tabs for detailed sections */}
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
