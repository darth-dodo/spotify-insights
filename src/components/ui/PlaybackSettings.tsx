import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Music } from 'lucide-react';

export const PlaybackSettings = () => {
  const [playbackEnabled, setPlaybackEnabled] = React.useState(
    localStorage.getItem('enable_playback_features') === 'true'
  );

  const handleToggle = (enabled: boolean) => {
    setPlaybackEnabled(enabled);
    localStorage.setItem('enable_playback_features', enabled.toString());
    
    if (enabled) {
      // Show info about requiring premium/special permissions
      console.log('Playback features enabled - requires Spotify Premium or special app permissions');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Playback Features
        </CardTitle>
        <CardDescription>
          Enable advanced playback controls and real-time music monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Enable Playback SDK</div>
            <div className="text-xs text-muted-foreground">
              Requires Spotify Premium or special app permissions
            </div>
          </div>
          <Switch
            checked={playbackEnabled}
            onCheckedChange={handleToggle}
          />
        </div>
        
        {playbackEnabled && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Playback features require Spotify Premium or special app permissions. 
              If you encounter 403 errors, these features may not be available for your account.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 