
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

interface AuthGuardProps {
  children?: React.ReactNode;
  loginComponent?: React.ReactNode;
  dashboardComponent?: React.ReactNode;
}

export const AuthGuard = ({ children, loginComponent, dashboardComponent }: AuthGuardProps) => {
  const { user, isLoading, error } = useAuth();

  console.log('AuthGuard state:', { 
    user: !!user, 
    isLoading, 
    error, 
    path: window.location.pathname 
  });

  // Prevent Spotify SDK from loading when in demo mode
  useEffect(() => {
    if (window.location.pathname === '/' && !user && !isLoading) {
      // Clear any existing SDK initialization attempts
      const existingScript = document.querySelector('script[src*="sdk.scdn.co"]');
      if (existingScript) {
        existingScript.remove();
        console.log('Removed Spotify SDK script for demo mode');
      }
    }
  }, [user, isLoading]);

  // If we're on the root path and not authenticated, show the dashboard with sandbox-like behavior
  if (window.location.pathname === '/' && !user && !isLoading) {
    console.log('No authentication on root path, showing dashboard with demo data');
    return dashboardComponent || children;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <CalmingLoader 
          title="Initializing your music dashboard..."
          description="Setting up your personalized experience"
        />
      </div>
    );
  }

  if (error) {
    console.error('Auth error in AuthGuard:', error);
  }

  if (!user) {
    console.log('User not authenticated, showing login');
    return loginComponent || children;
  }

  console.log('User authenticated, showing dashboard');
  return dashboardComponent || children;
};
