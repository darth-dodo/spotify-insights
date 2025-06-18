import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Music, Users, Clock, Database } from 'lucide-react';

interface DataLoadingScreenProps {
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  forcedPct?: number;
}

export const DataLoadingScreen = ({ 
  message = "Loading your comprehensive music data...", 
  error = null,
  onRetry,
  forcedPct,
}: DataLoadingScreenProps) => {
  const [progress, setProgress] = React.useState(forcedPct ?? 0);
  const [currentFactIndex, setCurrentFactIndex] = React.useState(0);
  const [shuffledFacts, setShuffledFacts] = React.useState<string[]>([]);

  const musicFacts = [
    "🎵 The average person listens to 18 hours of music per week",
    "🎸 Spotify has over 100 million songs in its catalog",
    "🧠 Music can improve memory and cognitive function",
    "💫 Your music taste is as unique as your fingerprint",
    "🎼 Classical music can boost productivity by up to 13%",
    "🌍 Music is a universal language understood across all cultures",
    "❤️ Listening to music releases dopamine, the 'feel-good' hormone",
    "🎤 The most-streamed song on Spotify has over 3 billion plays",
    "🎹 Learning music can increase IQ by up to 7 points",
    "🎧 Binaural beats can help synchronize brainwaves",
    "🎺 Music therapy is used to treat depression and anxiety",
    "🥁 Drumming can boost your immune system",
    "🎻 String instruments date back over 4,000 years",
    "🎪 Live music can create stronger emotional connections",
    "🌟 Your favorite songs trigger the same brain regions as food and drugs",
    "🎨 Synesthesia affects 1 in 2,000 people, making them 'see' music",
    "⚡ Fast music can make you exercise harder and longer",
    "🌙 Slow music before bed can improve sleep quality",
    "🧬 Musical preferences are partly determined by genetics",
    "🎭 Music can evoke memories from decades ago instantly"
  ];

  // Shuffle facts on component mount
  React.useEffect(() => {
    const shuffled = [...musicFacts].sort(() => Math.random() - 0.5);
    setShuffledFacts(shuffled);
  }, []);

  React.useEffect(() => {
    // Update progress if controlled externally
    if (forcedPct !== undefined) {
      setProgress(forcedPct);
      return;
    }

    // Internal auto-increment for standalone usage
    const progressTimer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 95);
      });
    }, 500);

    return () => clearInterval(progressTimer);
  }, [forcedPct]);

  // Facts rotation remains regardless of external control
  React.useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % shuffledFacts.length);
    }, 3000);
    return () => clearInterval(factTimer);
  }, [shuffledFacts.length]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Database className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
              <Music className="h-3 w-3 text-accent animate-bounce" />
            </div>
          </div>

          {/* Loading Message */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Fetching Your Music Universe
            </h2>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
            
            {/* Rotating Music Facts */}
            <div className="min-h-[2.5rem] flex items-center justify-center">
              {shuffledFacts.length > 0 && (
                <p 
                  key={currentFactIndex}
                  className="text-sm text-primary font-medium text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
                >
                  {shuffledFacts[currentFactIndex]}
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="w-full transition-all duration-500 ease-in-out" 
            />
            <p className="text-xs text-muted-foreground">
              Loading up to 2000 tracks and artists for comprehensive analysis
            </p>
          </div>

          {/* OAuth Error Handling */}
          {error && (
            <div className="text-center space-y-3">
              <p className="text-sm text-destructive font-medium">
                {error}
              </p>
              {onRetry && (
                <button
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 text-sm font-medium shadow-sm hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  onClick={onRetry}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Top Tracks</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">Artists</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                <Clock className="h-4 w-4 text-secondary" />
              </div>
              <p className="text-xs text-muted-foreground">Recent Plays</p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              🔒 All data processing happens locally on your device
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 