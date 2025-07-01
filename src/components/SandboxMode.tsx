import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Dashboard } from '@/components/Dashboard';
import { AuthContext } from '@/hooks/useAuth';
import { SandboxAuthStrategy } from '@/strategies/SandboxAuthStrategy';
import { SandboxBanner } from '@/components/ui/SandboxBanner';
import { DismissibleProjectDisclaimer } from '@/components/ui/DismissibleProjectDisclaimer';
import { Footer } from '@/components/layout/Footer';
import { TestMarker } from '@/components/ui/TestMarker';
import { clearLocalUserData } from '@/lib/clear-user-data';

// Create a sandbox auth context using the strategy pattern
const sandboxAuthStrategy = new SandboxAuthStrategy();

const sandboxAuthContext = {
  user: sandboxAuthStrategy.getUser(),
  isLoading: sandboxAuthStrategy.isLoading(),
  error: sandboxAuthStrategy.getError(),
  login: () => sandboxAuthStrategy.login(),
  logout: () => sandboxAuthStrategy.logout(),
  refreshToken: () => sandboxAuthStrategy.refreshToken(),
  clearError: () => sandboxAuthStrategy.clearError()
};

export const SandboxMode = () => {
  React.useEffect(() => {
    clearLocalUserData();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <TestMarker />
        <SandboxBanner />
        <AuthContext.Provider value={sandboxAuthContext}>
          <div className="container mx-auto px-4 py-6">
            <DismissibleProjectDisclaimer />
            <Dashboard />
          </div>
          
          <Footer />
        </AuthContext.Provider>
      </div>
    </ThemeProvider>
  );
};
