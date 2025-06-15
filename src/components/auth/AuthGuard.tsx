
import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BlurLoader } from '@/components/ui/BlurLoader';
import { ErrorDialog } from '@/components/auth/ErrorDialog';
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
  const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);

  console.log('AuthGuard state:', { 
    user: !!user, 
    isLoading, 
    error, 
    path: window.location.pathname 
  });

  // Show error dialog if there's an auth error
  useEffect(() => {
    if (error) {
      setErrorDialogOpen(true);
    }
  }, [error]);

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

  const handleRetryAuth = () => {
    setErrorDialogOpen(false);
    window.location.reload();
  };

  // Show dashboard if user is authenticated
  if (user) {
    console.log('User authenticated, showing dashboard');
    return dashboardComponent || children;
  }

  // For root path without authentication, show landing page with blur loader
  if (window.location.pathname === '/' && !user) {
    console.log('No authentication on root path, showing landing page');
    return (
      <BlurLoader isLoading={isLoading}>
        <LandingPage />
        <ErrorDialog
          open={errorDialogOpen}
          onOpenChange={setErrorDialogOpen}
          title="Authentication Error"
          message={error || 'An error occurred during authentication'}
          onRetry={handleRetryAuth}
        />
      </BlurLoader>
    );
  }

  // For other paths or explicit login, show landing page with blur loader
  console.log('User not authenticated, showing landing page');
  return (
    <BlurLoader isLoading={isLoading}>
      <LandingPage />
      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Authentication Error"
        message={error || 'An error occurred during authentication'}
        onRetry={handleRetryAuth}
      />
    </BlurLoader>
  );
};
