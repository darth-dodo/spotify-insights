import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { InteractiveOverview } from '@/components/dashboard/InteractiveOverview';
import { ArtistExploration } from '@/components/dashboard/ArtistExploration';
import { EnhancedPrivacySettings } from '@/components/dashboard/EnhancedPrivacySettings';
import { EnhancedListeningTrends } from '@/components/dashboard/EnhancedListeningTrends';
import { SimpleGamification } from '@/components/dashboard/gamification/SimpleGamification';
import { LibraryHealth } from '@/components/dashboard/LibraryHealth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ImprovedGenreAnalysis } from './dashboard/ImprovedGenreAnalysis';
import { RefactoredGenreAnalysis } from './dashboard/RefactoredGenreAnalysis';
import { TrackExplorer } from './dashboard/TrackExplorer';
import { ImprovedListeningTrends } from './dashboard/ImprovedListeningTrends';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { OnboardingTour, useOnboarding, dashboardTourSteps } from '@/components/ui/OnboardingTour';
import { EnhancedListeningActivity } from './dashboard/EnhancedListeningActivity';

export const Dashboard = () => {
  const { user, isLoading, error, clearError, refreshToken } = useAuth();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  
  // Check if comprehensive data is loading
  const { useEnhancedTopTracks, useEnhancedTopArtists, useEnhancedRecentlyPlayed } = useSpotifyData();
  const { isLoading: tracksLoading } = useEnhancedTopTracks('medium_term', 2000);
  const { isLoading: artistsLoading } = useEnhancedTopArtists('medium_term', 2000);
  const { isLoading: recentLoading } = useEnhancedRecentlyPlayed(200);
  const dataLoading = tracksLoading || artistsLoading || recentLoading;

  const { setStage, bump, pct } = useLoading();

  // Update global loader stage and progress based on query states
  React.useEffect(() => {
    if (!user) return;

    // Initiate library stage once data fetching begins
    if (dataLoading) {
      setStage('library');
    }

    // Calculate completion ratio (0-3) and map to target pct
    const completed = (tracksLoading ? 0 : 1) + (artistsLoading ? 0 : 1) + (recentLoading ? 0 : 1);
    const target = completed === 3 ? 100 : 30 + completed * 30; // 30,60,90,100

    if (target > pct) {
      bump(target - pct);
    }
  }, [user, dataLoading, tracksLoading, artistsLoading, recentLoading, pct, setStage, bump]);

  // Initialize tour after data has loaded
  React.useEffect(() => {
    if (!dataLoading && user && !hasSeenTour) {
      const tourCompleted = localStorage.getItem('onboarding-tour-completed');
      if (!tourCompleted) {
        // Start tour after data is loaded and components are rendered
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setHasSeenTour(true);
      }
    }
  }, [dataLoading, user, hasSeenTour]);

  const completeTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('onboarding-tour-completed', 'true');
  };

  const skipTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('onboarding-tour-completed', 'true');
  };

  const restartTour = () => {
    setShowTour(true);
    setHasSeenTour(false);
  };

  const handleSettingsClick = () => {
    setActiveView('privacy');
    setSidebarOpen(false);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const handleRetryAuth = async () => {
    clearError();
    try {
      await refreshToken();
    } catch (refreshError) {
      console.error('Retry failed:', refreshError);
    }
  };

  if (isLoading) {
    // Stage update handled elsewhere; just render nothing.
    return null;
  }

  if (!user) {
    return null;
  }

  // While library loading, underlying global loader is active; render null until finished
  if (dataLoading) {
    return null;
  }

  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground",
      theme
    )}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeView={activeView}
          onViewChange={handleViewChange}
          data-tour="sidebar"
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            user={user}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onSettingsClick={handleSettingsClick}
            onTourRestart={restartTour}
            data-tour="profile-menu"
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRetryAuth}
                      className="ml-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Content Area */}
              <div className="container-responsive">
                {activeView === 'overview' && <InteractiveOverview onNavigate={handleViewChange} />}
                {activeView === 'listening-activity' && <EnhancedListeningActivity />}
                {activeView === 'genres' && <RefactoredGenreAnalysis />}
                {activeView === 'artists' && <ArtistExploration />}
                {activeView === 'tracks' && <TrackExplorer />}
                {activeView === 'library-health' && <LibraryHealth />}
                {activeView === 'gamification' && <SimpleGamification />}
                {activeView === 'privacy' && <EnhancedPrivacySettings />}
                
                {/* Redirect removed views to appropriate alternatives */}
                {activeView === 'listening-patterns' && <LibraryHealth />}
                {activeView === 'gamification-settings' && <EnhancedPrivacySettings />}
                {activeView === 'enhanced-trends' && <EnhancedListeningTrends />}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
        steps={dashboardTourSteps}
      />
    </div>
  );
};
