
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Dashboard } from '@/components/Dashboard';
import { AuthContext } from '@/hooks/useAuth';
import { dummySpotifyUser } from '@/lib/dummy-data';
import { sanitizeUserData } from '@/lib/data-utils';

// Create a sandbox auth context that always returns the demo user
const sandboxAuthContext = {
  user: sanitizeUserData(dummySpotifyUser),
  isLoading: false,
  login: async () => {},
  logout: () => {},
  refreshToken: async () => {}
};

export const SandboxMode = () => {
  return (
    <ThemeProvider>
      <AuthContext.Provider value={sandboxAuthContext}>
        <Dashboard />
      </AuthContext.Provider>
    </ThemeProvider>
  );
};
