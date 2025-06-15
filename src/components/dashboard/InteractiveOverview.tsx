
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { OverviewHeader } from './overview/OverviewHeader';
import { StatsOverview } from './overview/StatsOverview';
import { MusicInsightsSummary } from './overview/MusicInsightsSummary';
import { ActivityHeatmap } from './overview/ActivityHeatmap';
import { RecentActivity } from './overview/RecentActivity';
import { AchievementsPreview } from './overview/AchievementsPreview';
import { QuickNavigation } from './overview/QuickNavigation';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

interface InteractiveOverviewProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveOverview = ({ onNavigate }: InteractiveOverviewProps) => {
  const { useTopTracks, useTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Use smaller datasets for faster loading in demo mode
  const { data: tracks, isLoading: tracksLoading } = useTopTracks('medium_term', 50);
  const { data: artists, isLoading: artistsLoading } = useTopArtists('medium_term', 50);
  const { data: recentlyPlayed, isLoading: recentLoading } = useEnhancedRecentlyPlayed(100);

  // Consider loading complete if any data is available or after timeout
  const isLoading = tracksLoading && artistsLoading && recentLoading;
  const hasData = tracks?.items?.length > 0 || artists?.items?.length > 0 || recentlyPlayed?.length > 0;

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  // Only show loader if we're actually loading and have no data yet
  if (isLoading && !hasData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading your music universe... 🎵</h1>
          <p className="text-muted-foreground">Analyzing your music data for comprehensive insights</p>
        </div>
        <CalmingLoader 
          title="Processing your music library..."
          description="Loading your tracks and artists to provide personalized insights"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <OverviewHeader />

      {/* Enhanced Stats */}
      <StatsOverview 
        selectedCard={selectedCard} 
        onCardSelect={setSelectedCard} 
      />

      {/* Enhanced Music Insights */}
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
