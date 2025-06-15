
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CalmingLoader } from '@/components/ui/CalmingLoader';
import { spotifyPlaybackSDK } from '@/lib/spotify-playback-sdk';

interface AuthGuardProps {
  children?: React.ReactNode;
  loginComponent?: React.ReactNode;
  dashboardComponent?: React.ReactNode;
}

export const AuthGuard = ({ children, loginComponent, dashboardComponent }: AuthGuardProps) => {
  const { user, isLoading, error } = useAuth();
  const sdkCleanupDone = useRef(false);

  console.log('AuthGuard state:', { 
    user: !!user, 
    isLoading, 
    error, 
    path: window.location.pathname 
  });

  // Prevent Spotify SDK from loading when in demo mode - run only once
  useEffect(() => {
    if (window.location.pathname === '/' && !user && !isLoading && !sdkCleanupDone.current) {
      // Clear any existing SDK initialization attempts and scripts
      try {
        spotifyPlaybackSDK.disconnect();
        
        // Also remove the global callback if it exists
        if ((window as any).onSpotifyWebPlaybackSDKReady) {
          delete (window as any).onSpotifyWebPlaybackSDKReady;
        }
        
        console.log('Cleaned up Spotify SDK for demo mode');
      } catch (error) {
        console.warn('Error during SDK cleanup:', error);
      }
      
      sdkCleanupDone.current = true;
    }
  }, [user, isLoading]);

  // If we're on the root path and not authenticated, show the dashboard with sandbox-like behavior
  // This is the ONLY place where we allow demo data outside of sandbox mode
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
