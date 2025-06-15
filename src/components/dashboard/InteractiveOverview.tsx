
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
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
  const { tracks, artists, recentlyPlayed, isLoading } = useExtendedSpotifyDataStore();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading your music universe... 🎵</h1>
          <p className="text-muted-foreground">Analyzing your extended dataset (up to 1000 tracks & artists) for comprehensive insights</p>
        </div>
        <CalmingLoader 
          title="Processing your extended music library..."
          description="Loading up to 1000 tracks and artists to provide the most comprehensive insights possible"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <OverviewHeader />

      {/* Enhanced Stats using Extended Dataset */}
      <StatsOverview 
        selectedCard={selectedCard} 
        onCardSelect={setSelectedCard} 
      />

      {/* Enhanced Music Insights using Extended Dataset */}
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
