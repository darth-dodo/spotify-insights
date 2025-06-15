
import React from 'react';
import { Info, Music } from 'lucide-react';

export const SandboxBanner = () => {
  return (
    <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-b border-accent/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-accent" />
            <span className="font-medium text-foreground">Demo Mode</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Exploring with 500+ classic tracks from the 70s & 80s</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border"></div>
          <span className="hidden md:inline text-xs text-muted-foreground">
            Independent project • Not affiliated with Spotify
          </span>
        </div>
      </div>
    </div>
  );
};
