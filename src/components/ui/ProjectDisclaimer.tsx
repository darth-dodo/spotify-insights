
import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ProjectDisclaimer = () => {
  return (
    <Alert className="border-accent/20 bg-accent/5 mb-6">
      <AlertTriangle className="h-4 w-4 text-accent" />
      <AlertDescription className="text-sm">
        <strong>Important Disclaimer:</strong> This is an independent, non-commercial MIT licensed project created for educational purposes. 
        This application is not affiliated with, endorsed by, or connected to Spotify AB or any of its subsidiaries. 
        The Spotify name, logo, and related marks are trademarks of Spotify AB. 
        All music data displayed is for demonstration purposes only.
        <a 
          href="https://github.com/darth-dodo/spotify-analytics" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 ml-2 text-accent hover:underline"
        >
          View Source Code <ExternalLink className="h-3 w-3" />
        </a>
      </AlertDescription>
    </Alert>
  );
};
