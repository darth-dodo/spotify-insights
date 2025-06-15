import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Sidebar } from './layout/Sidebar';
import { InteractiveOverview } from './dashboard/InteractiveOverview';
import { ListeningActivity } from './dashboard/ListeningActivity';
import { EnhancedListeningTrends } from './dashboard/EnhancedListeningTrends';
import { EnhancedGenreAnalysis } from './dashboard/EnhancedGenreAnalysis';
import { ArtistExploration } from './dashboard/ArtistExploration';
import { SimpleGamification } from './dashboard/gamification/SimpleGamification';
import { PrivacySettings } from './dashboard/PrivacySettings';
import { LibraryHealth } from './dashboard/LibraryHealth';
import { ListeningPatterns } from './dashboard/ListeningPatterns';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { Info, Settings, FileText, AlertCircle, RefreshCw, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const { user, isLoading, error, clearError, refreshToken } = useAuth();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const { isLoading: tracksLoading, error: tracksError } = useTopTracks();
  const { isLoading: artistsLoading, error: artistsError } = useTopArtists();
  const { isLoading: recentLoading, error: recentError } = useRecentlyPlayed();

  const handleSettingsClick = () => {
    setActiveView('privacy');
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  if (isLoading || tracksLoading || artistsLoading || recentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading your music data...</p>
        </div>
      </div>
    );
  }

  if (error || tracksError || artistsError || recentError) {
    const errorMessage = error || 
      (tracksError instanceof Error ? tracksError.message : String(tracksError)) ||
      (artistsError instanceof Error ? artistsError.message : String(artistsError)) ||
      (recentError instanceof Error ? recentError.message : String(recentError));

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-muted-foreground">{errorMessage}</p>
          <button
            onClick={refreshToken}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <InteractiveOverview onNavigate={handleViewChange} />;
      case 'library-health':
        return <LibraryHealth />;
      case 'listening-patterns':
        return <ListeningPatterns />;
      case 'trends':
        return <ListeningActivity />;
      case 'enhanced-trends':
        return <EnhancedListeningTrends />;
      case 'genres':
        return <EnhancedGenreAnalysis />;
      case 'artists':
        return <ArtistExploration />;
      case 'gamification':
        return <SimpleGamification />;
      case 'privacy':
        return <PrivacySettings />;
      default:
        return <InteractiveOverview onNavigate={handleViewChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeView={activeView}
        onViewChange={handleViewChange}
      />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container-responsive flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-accent/10 rounded-md"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold">Spotify Insights</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container-responsive py-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
