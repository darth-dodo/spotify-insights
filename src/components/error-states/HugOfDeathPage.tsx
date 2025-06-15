
import { AlertTriangle, RefreshCw, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HugOfDeathPageProps {
  onRetry?: () => void;
  estimatedWaitTime?: number;
}

export const HugOfDeathPage = ({ onRetry, estimatedWaitTime = 60 }: HugOfDeathPageProps) => {
  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">
            We're Popular Right Now! 🎵
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Rate Limited</span>
            </div>
            <p className="text-muted-foreground">
              Too many music lovers are using our app right now! Spotify's API has temporarily 
              rate-limited our requests to keep their servers happy.
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Estimated wait time: {formatWaitTime(estimatedWaitTime)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This happens when we exceed Spotify's request limits. It's temporary!
            </p>
          </div>

          <div className="space-y-3">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>💡 <strong>Pro tip:</strong> Try again in a few minutes when traffic calms down.</p>
            <p>This usually resolves itself quickly as request limits reset.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
