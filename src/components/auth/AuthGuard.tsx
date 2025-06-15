
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CalmingLoader } from '@/components/ui/CalmingLoader';
import { spotifyPlaybackSDK } from '@/lib/spotify-playback-sdk';
import { LandingPage } from '@/components/LandingPage';

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

  // Clean up Spotify SDK in demo mode
  useEffect(() => {
    if (window.location.pathname === '/' && !user && !isLoading && !sdkCleanupDone.current) {
      try {
        spotifyPlaybackSDK.disconnect();
        
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

  // Show dashboard if user is authenticated
  if (user) {
    console.log('User authenticated, showing dashboard');
    return dashboardComponent || children;
  }

  // For root path without authentication, show landing page (not dashboard)
  if (window.location.pathname === '/' && !user) {
    console.log('No authentication on root path, showing landing page');
    return <LandingPage />;
  }

  // For other paths or explicit login, show landing page
  console.log('User not authenticated, showing landing page');
  return <LandingPage />;
};
