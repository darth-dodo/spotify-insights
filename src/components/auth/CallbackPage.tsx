
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyAuth } from '@/lib/spotify-auth';
import { useToast } from '@/hooks/use-toast';

export const CallbackPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

        await spotifyAuth.handleCallback(code, state);
        
        toast({
          title: "Successfully connected!",
          description: "Your Spotify account has been linked.",
        });

        // Redirect to dashboard
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Callback error:', error);
        
        toast({
          title: "Authentication failed",
          description: "There was an error connecting your Spotify account. Please try again.",
          variant: "destructive",
        });

        // Redirect back to login
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-xl font-semibold">Connecting your account...</h2>
        <p className="text-muted-foreground">Please wait while we authenticate with Spotify</p>
      </div>
    </div>
  );
};
