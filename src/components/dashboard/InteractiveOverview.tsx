
import React, { useState } from 'react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { OverviewHeader } from './overview/OverviewHeader';
import { StatsOverview } from './overview/StatsOverview';
import { MusicInsightsSummary } from './overview/MusicInsightsSummary';
import { TopTracksPreview } from './overview/TopTracksPreview';
import { GamificationPreview } from './overview/GamificationPreview';
import { RecentActivity } from './overview/RecentActivity';
import { EngagementCTA } from './overview/EngagementCTA';
import { BlurLoader } from '@/components/ui/BlurLoader';
import { ErrorDialog } from '@/components/auth/ErrorDialog';

interface InteractiveOverviewProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveOverview = ({ onNavigate }: InteractiveOverviewProps) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentError, setCurrentError] = useState<string>('');

  // Use centralized data store (fetches all data once with 2000 items)
  const { 
    tracks, 
    artists, 
    recentlyPlayed, 
    isLoading, 
    error,
    dataInfo 
  } = useExtendedSpotifyDataStore();

  // Check for errors and show them in modal
  React.useEffect(() => {
    if (error) {
      setCurrentError(error.message || 'An error occurred while loading your music data');
      setErrorDialogOpen(true);
    }
  }, [error]);

  // Log data info for debugging
  React.useEffect(() => {
    if (dataInfo.tracksCount > 0) {
      console.log('📊 Overview using comprehensive dataset:', dataInfo);
    }
  }, [dataInfo]);

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
      <div className="space-y-6 lg:space-y-8">
        {/* 1. HOOK: Immediate Impact Header */}
        <OverviewHeader />

        {/* 2. INSTANT GRATIFICATION: Key Stats Grid */}
        <StatsOverview 
          selectedCard={selectedCard} 
          onCardSelect={setSelectedCard} 
        />

        {/* 3. PERSONAL CONNECTION: Gamification First (if enabled) */}
        <GamificationPreview onNavigate={handleNavigation} />

        {/* 4. DISCOVERY & INSIGHTS: Optimized Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="lg:col-span-1 xl:col-span-2">
            <TopTracksPreview onNavigate={handleNavigation} />
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            {/* 5. INSIGHTS: Music Profile */}
            <MusicInsightsSummary />
          </div>
        </div>



        {/* 6. ENGAGEMENT: Recent Activity */}
        <div className="space-y-6">
          <RecentActivity />
        </div>

        {/* 7. CONVERSION: Final Call-to-Action */}
        <EngagementCTA onNavigate={handleNavigation} />

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
