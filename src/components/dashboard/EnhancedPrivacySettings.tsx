
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Settings, Trophy, Palette, Info, GamepadIcon, Target } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AccentColorPicker } from '@/components/ui/AccentColorPicker';

export const EnhancedPrivacySettings = () => {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [dataRetention, setDataRetention] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [gamificationEnabled, setGamificationEnabled] = useState(true);
  const [achievementsEnabled, setAchievementsEnabled] = useState(true);
  const [streaksEnabled, setStreaksEnabled] = useState(true);
  const [challengesEnabled, setChallengesEnabled] = useState(false);

  const handleExportData = async () => {
    try {
      const userData = {
        preferences: {
          theme,
          accentColor,
          dataRetention,
          analytics,
          gamificationEnabled,
          achievementsEnabled,
          streaksEnabled,
          challengesEnabled
        },
        exportDate: new Date().toISOString(),
        note: "This export contains only your app preferences. No personal music data is stored."
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `spotify-insights-preferences-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your preferences have been downloaded as a JSON file.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = async () => {
    try {
      // Clear all local storage
      localStorage.clear();
      
      toast({
        title: "Data cleared successfully",
        description: "All local data has been removed. You will be redirected to the homepage.",
      });

      // Logout and redirect
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Clear data failed:', error);
      toast({
        title: "Clear data failed",
        description: "There was an error clearing your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Data Privacy</h2>
        <p className="text-muted-foreground">
          Manage your privacy preferences, appearance, and features
        </p>
      </div>

      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Data
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-6">
          {/* Privacy & Data Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Data Privacy
              </CardTitle>
              <CardDescription>
                Control how your music data is processed and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Privacy First:</strong> All your music data is processed locally in your browser. 
                  We never store your personal music information on our servers.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Local Data Retention</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep processed data in your browser for faster loading
                    </p>
                  </div>
                  <Switch 
                    checked={dataRetention} 
                    onCheckedChange={setDataRetention}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Usage Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app with anonymous usage statistics
                    </p>
                  </div>
                  <Switch 
                    checked={analytics} 
                    onCheckedChange={setAnalytics}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Data Management</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    Export Data
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleClearData}>
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spotify Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle>Spotify Connection</CardTitle>
              <CardDescription>
                Information about your Spotify data access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium">What we access:</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Your top tracks and artists</li>
                    <li>• Recently played songs</li>
                    <li>• Basic profile information</li>
                    <li>• Playlist information (read-only)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium">What we don't access:</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Your private playlists content</li>
                    <li>• Payment information</li>
                    <li>• Personal messages</li>
                    <li>• Modification abilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Colors
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Dark Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Accent Color</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose your preferred accent color for highlights and interactive elements
                </p>
                <AccentColorPicker />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Current Theme Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-center">
                    <div className="w-4 h-4 bg-accent rounded mx-auto mb-1"></div>
                    <span className="text-xs">Accent</span>
                  </div>
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
                    <div className="w-4 h-4 bg-primary rounded mx-auto mb-1"></div>
                    <span className="text-xs">Primary</span>
                  </div>
                  <div className="p-3 bg-secondary/50 border rounded-lg text-center">
                    <div className="w-4 h-4 bg-secondary rounded mx-auto mb-1"></div>
                    <span className="text-xs">Secondary</span>
                  </div>
                  <div className="p-3 bg-muted border rounded-lg text-center">
                    <div className="w-4 h-4 bg-muted-foreground rounded mx-auto mb-1"></div>
                    <span className="text-xs">Muted</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          {/* Gamification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Features & Enhancements
                <Badge variant="secondary">Optional</Badge>
              </CardTitle>
              <CardDescription>
                Enhance your music experience with achievements, streaks, and challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <GamepadIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Level System:</strong> Your level is calculated based on your music library size. 
                  Level = (Total Tracks + Total Artists) ÷ 20 + 1. This accounts for Spotify's API limits while providing meaningful progression.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Enable Features</h4>
                    <p className="text-sm text-muted-foreground">
                      Turn on levels, achievements, and progress tracking
                    </p>
                  </div>
                  <Switch 
                    checked={gamificationEnabled} 
                    onCheckedChange={setGamificationEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Achievements</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlock badges for reaching listening milestones
                    </p>
                  </div>
                  <Switch 
                    checked={achievementsEnabled} 
                    onCheckedChange={setAchievementsEnabled}
                    disabled={!gamificationEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Listening Streaks</h4>
                    <p className="text-sm text-muted-foreground">
                      Track consecutive days of music discovery
                    </p>
                  </div>
                  <Switch 
                    checked={streaksEnabled} 
                    onCheckedChange={setStreaksEnabled}
                    disabled={!gamificationEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">Weekly Challenges</h4>
                    <p className="text-sm text-muted-foreground">
                      Participate in personalized music exploration goals
                    </p>
                  </div>
                  <Switch 
                    checked={challengesEnabled} 
                    onCheckedChange={setChallengesEnabled}
                    disabled={!gamificationEnabled}
                  />
                </div>
              </div>

              {gamificationEnabled && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Current Stats</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-center">
                      <div className="text-lg font-bold text-accent">Level 15</div>
                      <div className="text-muted-foreground">Current Level</div>
                    </div>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
                      <div className="text-lg font-bold text-primary">8</div>
                      <div className="text-muted-foreground">Achievements</div>
                    </div>
                    <div className="p-3 bg-secondary/50 border rounded-lg text-center">
                      <div className="text-lg font-bold">12</div>
                      <div className="text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
