
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { InteractiveOverview } from '@/components/dashboard/InteractiveOverview';
import { ListeningActivity } from '@/components/dashboard/ListeningActivity';
import { EnhancedGenreAnalysis } from '@/components/dashboard/EnhancedGenreAnalysis';
import { ArtistExploration } from '@/components/dashboard/ArtistExploration';
import { PrivacySettings } from '@/components/dashboard/PrivacySettings';
import { EnhancedListeningTrends } from '@/components/dashboard/EnhancedListeningTrends';
import { SimpleGamification } from '@/components/dashboard/gamification/SimpleGamification';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Info, Settings, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, isLoading, error, clearError, refreshToken } = useAuth();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

              {/* Action Buttons - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSettingsClick}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Settings className="h-4 w-4" />
                  Privacy & Settings
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/help')}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Info className="h-4 w-4" />
                  Help & Security
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/legal')}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4" />
                  Legal Info
                </Button>
              </div>
              
              {/* Content Area */}
              <div className="container-responsive">
                {activeView === 'overview' && <InteractiveOverview onNavigate={handleViewChange} />}
                {activeView === 'trends' && <ListeningActivity />}
                {activeView === 'enhanced-trends' && <EnhancedListeningTrends />}
                {activeView === 'genres' && <EnhancedGenreAnalysis />}
                {activeView === 'artists' && <ArtistExploration />}
                {activeView === 'privacy' && <PrivacySettings />}
                {activeView === 'gamification' && <SimpleGamification />}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
