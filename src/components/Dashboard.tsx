
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { InteractiveOverview } from '@/components/dashboard/InteractiveOverview';
import { ListeningActivity } from '@/components/dashboard/ListeningActivity';
import { EnhancedGenreAnalysis } from '@/components/dashboard/EnhancedGenreAnalysis';
import { PrivacyControls } from '@/components/dashboard/PrivacyControls';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { theme, accentColor } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the auth flow
  }

  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground transition-colors duration-300",
      theme
    )}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            user={user}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {activeView === 'overview' && <InteractiveOverview />}
              {activeView === 'trends' && <ListeningActivity />}
              {activeView === 'genres' && <EnhancedGenreAnalysis />}
              {activeView === 'privacy' && <PrivacyControls />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
