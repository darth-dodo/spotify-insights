import React, { useState } from 'react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { calculateStats, calculateGenreAnalysis } from '@/lib/spotify-data-utils';
import { OverviewHeader } from './overview/OverviewHeader';
import { StatsOverview } from './overview/StatsOverview';
import { MusicInsightsSummary } from './overview/MusicInsightsSummary';
import { TopTracksPreview } from './overview/TopTracksPreview';
import { GamificationPreview } from './overview/GamificationPreview';
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
  const { useEnhancedTopTracks, useEnhancedTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const { data: tracks = [], isLoading: tracksLoading, error: tracksError } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [], isLoading: artistsLoading, error: artistsError } = useEnhancedTopArtists('medium_term', 2000);
  const { data: recentlyPlayed = [], isLoading: recentLoading, error: recentError } = useEnhancedRecentlyPlayed(200);
  const isLoading = tracksLoading || artistsLoading || recentLoading;
  const error = tracksError || artistsError || recentError;
  
  // Create dataInfo object for compatibility
  const dataInfo = {
    tracksCount: tracks.length,
    artistsCount: artists.length,
    recentCount: recentlyPlayed.length,
    lastFetched: new Date().toISOString(),
    timeRange: 'medium_term',
    dataSource: window.location.pathname === '/sandbox' ? 'sandbox' : 'spotify'
  };

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

        {/* 4. DISCOVERY & INSIGHTS: Full-width Top Tracks followed by Insights */}
        <div className="space-y-6">
          <TopTracksPreview onNavigate={handleNavigation} />
          {/* 5. INSIGHTS: Music Profile */}
          <MusicInsightsSummary />
        </div>

        {/* 6. (Removed Recent Activity section as per design refresh) */}

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
