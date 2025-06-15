
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
import { BlurLoader } from '@/components/ui/BlurLoader';
import { ErrorDialog } from '@/components/auth/ErrorDialog';

interface InteractiveOverviewProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveOverview = ({ onNavigate }: InteractiveOverviewProps) => {
  const { useTopTracks, useTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentError, setCurrentError] = useState<string>('');

  // Use smaller datasets for faster loading in demo mode
  const { data: tracks, isLoading: tracksLoading, error: tracksError } = useTopTracks('medium_term', 50);
  const { data: artists, isLoading: artistsLoading, error: artistsError } = useTopArtists('medium_term', 50);
  const { data: recentlyPlayed, isLoading: recentLoading, error: recentError } = useEnhancedRecentlyPlayed(100);

  // Check for errors and show them in modal
  React.useEffect(() => {
    const error = tracksError || artistsError || recentError;
    if (error) {
      setCurrentError(error.message || 'An error occurred while loading your music data');
      setErrorDialogOpen(true);
    }
  }, [tracksError, artistsError, recentError]);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleRetryError = () => {
    setErrorDialogOpen(false);
    // Trigger refetch by clearing error state
    window.location.reload();
  };

  return (
    <BlurLoader isLoading={isLoading}>
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

        {/* Error Dialog */}
        <ErrorDialog
          open={errorDialogOpen}
          onOpenChange={setErrorDialogOpen}
          title="Loading Error"
          message={currentError}
          onRetry={handleRetryError}
        />
      </div>
    </BlurLoader>
  );
};
