
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  loginComponent: React.ReactNode;
  dashboardComponent: React.ReactNode;
}

export const AuthGuard = ({ loginComponent, dashboardComponent }: AuthGuardProps) => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading your music insights...</p>
        </div>
      </div>
    );
  }

  // Handle errors gracefully - don't break the site
  if (error && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive font-bold text-xl">!</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">Connection Issue</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.location.href = '/index'} 
              className="w-full px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return user ? <>{dashboardComponent}</> : <>{loginComponent}</>;
};
