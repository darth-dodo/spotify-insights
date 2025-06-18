import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth } from '@/lib/spotify-auth';
import { useToast } from '@/hooks/use-toast';
import { DataLoadingScreen } from '@/components/ui/DataLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';

export const CallbackPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setStage } = useLoading();
  const [oauthError, setOauthError] = React.useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Spotify authentication error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authentication parameters');
        }

        setStage('oauth');
        console.log('Processing callback with code and state...');
        await spotifyAuth.handleCallback(code, state);
        
        // Simple retry loop (up to 5×100 ms) to allow Safari / private-mode to finish writing localStorage
        let retries = 5;
        let token = localStorage.getItem('spotify_access_token');
        while (!token && retries > 0) {
          await new Promise(res => setTimeout(res, 100));
          token = localStorage.getItem('spotify_access_token');
          retries--;
        }

        if (!token) {
          console.warn('Token still missing after callback retry; continuing anyway');
        }

        console.log('Callback processed successfully, token stored');
        
        toast({
          title: "Successfully connected!",
          description: "Your Spotify account has been linked.",
        });

        // Profile retrieved; update stage before navigation
        setStage('profile');

        // Smoothly navigate to dashboard without full reload; AuthProvider will
        // detect the new token and fetch the user profile.
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          navigate('/dashboard', { replace: true });
        }, 200);
      } catch (error: any) {
        console.error('Callback error:', error);
        setOauthError(error?.message || 'Authentication failed');
        
        toast({
          title: "Authentication failed",
          description: "There was an error connecting your Spotify account. Please try again.",
          variant: "destructive",
        });

        // Stay on page; user can retry or go back.
      }
    };

    handleCallback();
  }, [navigate, toast, setStage]);

  const handleRetry = () => {
    window.location.href = '/';
  };

  return (
    <DataLoadingScreen 
      message="Connecting your account..." 
      error={oauthError}
      onRetry={oauthError ? handleRetry : undefined}
    />
  );
};
