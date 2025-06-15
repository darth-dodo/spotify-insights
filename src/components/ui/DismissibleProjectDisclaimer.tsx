
import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export const DismissibleProjectDisclaimer = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('sandbox-disclaimer-dismissed') === 'true';
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('sandbox-disclaimer-dismissed', 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Alert className="border-accent/20 bg-accent/5 mb-6 relative">
      <AlertTriangle className="h-4 w-4 text-accent" />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      <AlertDescription className="text-sm pr-8">
        <strong>Important Disclaimer:</strong> This is an independent, non-commercial MIT licensed project created for educational purposes. 
        This application is not affiliated with, endorsed by, or connected to Spotify AB or any of its subsidiaries. 
        The Spotify name, logo, and related marks are trademarks of Spotify AB. 
        All music data displayed is for demonstration purposes only.
        <a 
          href="https://github.com" 
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
