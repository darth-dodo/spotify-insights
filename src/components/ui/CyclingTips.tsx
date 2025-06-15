
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lightbulb, X, ChevronLeft, ChevronRight } from 'lucide-react';

const musicTips = [
  "🎵 Privacy by Design: Your data never leaves your browser - everything is processed locally!",
  "🔒 Zero Data Storage: We only store essential session data that's automatically cleared.",
  "📊 Real-time Analysis: All insights are generated instantly from your current Spotify data.",
  "🎨 Spotify-Inspired: Built with authentic Spotify design principles for familiarity.",
  "🌟 Open Source: This entire project is available on GitHub under MIT license.",
  "🎧 Demo Mode: Exploring 500+ classic tracks from the 70s & 80s in sandbox mode.",
  "🔐 SHA-256 Security: Any stored data is hashed for maximum privacy protection.",
  "⚡ Client-Side Only: No external servers process your personal music data.",
  "🎯 Educational Purpose: Created to demonstrate privacy-first analytics design.",
  "💡 Tip: Click on artists in the Explorer to see detailed information!"
];

interface CyclingTipsProps {
  className?: string;
}

export const CyclingTips = ({ className }: CyclingTipsProps) => {
  const [isVisible, setIsVisible] = useState(() => {
    const stored = localStorage.getItem('cyclingTips');
    return stored ? JSON.parse(stored) : true;
  });
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    localStorage.setItem('cyclingTips', JSON.stringify(isVisible));
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % musicTips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % musicTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + musicTips.length) % musicTips.length);
  };

  return (
    <Card className={`${className} bg-accent/5 border-accent/20 p-3`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Lightbulb className="h-4 w-4 text-accent flex-shrink-0" />
          <p className="text-sm text-foreground truncate">
            {musicTips[currentTip]}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevTip}
            className="h-6 w-6"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTip}
            className="h-6 w-6"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
