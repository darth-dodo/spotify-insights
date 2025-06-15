
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Dashboard } from '@/components/Dashboard';
import { AuthContext } from '@/hooks/useAuth';
import { dummySpotifyUser } from '@/lib/dummy-data';
import { sanitizeUserData } from '@/lib/data-utils';
import { SandboxBanner } from '@/components/ui/SandboxBanner';
import { ProjectDisclaimer } from '@/components/ui/ProjectDisclaimer';
import { Footer } from '@/components/layout/Footer';
import { CyclingTips } from '@/components/ui/CyclingTips';
import { TestMarker } from '@/components/ui/TestMarker';

// Create a sandbox auth context that always returns the demo user
const sandboxAuthContext = {
  user: sanitizeUserData(dummySpotifyUser),
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  refreshToken: async () => {},
  clearError: () => {}
};

export const SandboxMode = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <TestMarker />
        <SandboxBanner />
        <AuthContext.Provider value={sandboxAuthContext}>
          <div className="container mx-auto px-4 py-6">
            <ProjectDisclaimer />
            <Dashboard />
          </div>
          
          {/* Fixed cycling tips at bottom */}
          <div className="fixed bottom-4 left-4 right-4 z-50">
            <CyclingTips className="max-w-4xl mx-auto" />
          </div>
          
          <Footer />
        </AuthContext.Provider>
      </div>
    </ThemeProvider>
  );
};
