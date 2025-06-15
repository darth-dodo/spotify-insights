import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { InteractiveOverview } from '@/components/dashboard/InteractiveOverview';
import { ListeningActivity } from '@/components/dashboard/ListeningActivity';
import { EnhancedGenreAnalysis } from '@/components/dashboard/EnhancedGenreAnalysis';
import { ArtistExploration } from '@/components/dashboard/ArtistExploration';
import { EnhancedPrivacySettings } from '@/components/dashboard/EnhancedPrivacySettings';
import { EnhancedListeningTrends } from '@/components/dashboard/EnhancedListeningTrends';
import { SimpleGamification } from '@/components/dashboard/gamification/SimpleGamification';
import { LibraryHealth } from '@/components/dashboard/LibraryHealth';
import { ListeningPatterns } from '@/components/dashboard/ListeningPatterns';
import { GamificationSettings } from '@/components/dashboard/GamificationSettings';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ImprovedGenreAnalysis } from './dashboard/ImprovedGenreAnalysis';
import { ImprovedListeningTrends } from './dashboard/ImprovedListeningTrends';

export const Dashboard = () => {
  const { user, isLoading, error, clearError, refreshToken } = useAuth();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading your music data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
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
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            user={user}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onSettingsClick={handleSettingsClick}
          />
          
          <main className="flex-1 overflow-y-auto p-3 md:p-6">
            <div className="max-w-7xl mx-auto">
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
                {activeView === 'trends' && <ListeningActivity />}
                {activeView === 'enhanced-trends' && <EnhancedListeningTrends />}
                {activeView === 'genres' && <ImprovedGenreAnalysis />}
                {activeView === 'artists' && <ArtistExploration />}
                {activeView === 'library-health' && <LibraryHealth />}
                {activeView === 'listening-patterns' && <ListeningPatterns />}
                {activeView === 'privacy' && <EnhancedPrivacySettings />}
                {activeView === 'gamification' && <SimpleGamification />}
                {activeView === 'gamification-settings' && <GamificationSettings />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
