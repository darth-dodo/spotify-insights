
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Trophy, Flame, Star, Shield, Wifi, WifiOff } from 'lucide-react';
import { useSpotifyPlayback } from '@/hooks/useSpotifyPlayback';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

interface HeatmapDay {
  date: string;
  plays: number;
  level: number;
  dayOfWeek: number;
  weekOfYear: number;
}

export const ConsolidatedActivityHeatmap = () => {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [privacyInfoOpen, setPrivacyInfoOpen] = useState(false);

  const { isConnected, sessionStats, heatmapData, clearSession, disconnect } = useSpotifyPlayback();
  const { useEnhancedRecentlyPlayed } = useSpotifyData();
  
  const { data: recentlyPlayedData, isLoading } = useEnhancedRecentlyPlayed(500);

  const generateConsolidatedHeatmapData = (): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    const playsByDate = new Map<string, number>();

    console.log('Generating heatmap data with recently played:', recentlyPlayedData?.length || 0);

    // Process real API data and ensure positive numbers
    if (recentlyPlayedData) {
      recentlyPlayedData.forEach((track: any) => {
        if (track.playedAt) {
          const date = track.playedAt.split('T')[0];
          const playCount = Math.max(0, track.playCount || 1); // Ensure non-negative
          playsByDate.set(date, (playsByDate.get(date) || 0) + playCount);
          console.log(`Track ${track.name}: ${playCount} plays on ${date}`);
        }
      });
    }

    // Generate 365 days of data
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let plays = playsByDate.get(dateStr) || 0;
      
      // If no real data, generate realistic simulation for older dates
      if (plays === 0 && i > 7) {
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseActivity = isWeekend ? 0.7 : 1.0;
        const seasonalFactor = 0.8 + 0.4 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
        const randomFactor = 0.5 + Math.random() * 0.5;
        plays = Math.max(0, Math.floor(baseActivity * seasonalFactor * randomFactor * 50));
      }
      
      // Ensure plays is non-negative
      plays = Math.max(0, plays);
      
      // Determine intensity level
      let level = 0;
      if (plays > 40) level = 4;
      else if (plays > 30) level = 3;
      else if (plays > 20) level = 2;
      else if (plays > 10) level = 1;
      
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekOfYear = Math.ceil((((date.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
      
      data.push({
        date: dateStr,
        plays,
        level,
        dayOfWeek: date.getDay(),
        weekOfYear,
      });
    }
    
    console.log('Generated heatmap data:', data.slice(-7)); // Log last 7 days
    return data;
  };

  const displayData = generateConsolidatedHeatmapData();
  const totalPlays = Math.max(0, displayData.reduce((sum, day) => sum + day.plays, 0));
  const activeDays = displayData.filter(day => day.plays > 0).length;
  
  const calculateCurrentStreak = (data: HeatmapDay[]): number => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].plays > 0) {
        streak++;
      } else {
        break;
      }
    }
    return Math.max(0, streak);
  };

  const currentStreak = calculateCurrentStreak(displayData);

  const getIntensityClass = (level: number) => {
    const classes = [
      'bg-muted/30 border-border/20 hover:bg-muted/50',
      'bg-primary/20 border-primary/30 hover:bg-primary/30',
      'bg-primary/40 border-primary/50 hover:bg-primary/50',
      'bg-primary/70 border-primary/80 hover:bg-primary/80',
      'bg-primary border-primary hover:bg-primary/90',
    ];
    return classes[Math.max(0, Math.min(4, level))] || classes[0];
  };

  // Group data by weeks for rendering
  const weeklyData = displayData.reduce((weeks, day) => {
    const weekKey = day.weekOfYear;
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(day);
    return weeks;
  }, {} as Record<number, HeatmapDay[]>);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleDayClick = (day: HeatmapDay) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const hasRealData = recentlyPlayedData && recentlyPlayedData.length > 0;

  console.log('Heatmap stats:', { totalPlays, activeDays, currentStreak, hasRealData });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Heatmap
              <InfoButton
                title="Activity Heatmap"
                description="Visual representation of your daily listening activity over the past year. Combines real Spotify data with simulated patterns."
                calculation="Uses your recent listening history from Spotify API combined with realistic simulation for older dates. All values are validated to ensure non-negative numbers."
              />
              {isConnected && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {hasRealData && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  API Data
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrivacyInfoOpen(true)}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Privacy
              </Button>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-500">{currentStreak} day streak</span>
                </div>
                <Badge variant="outline">{Math.round((activeDays/365)*100)}% active</Badge>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Your listening activity over the past year.
            {hasRealData ? ` Enhanced with ${recentlyPlayedData?.length || 0} recent tracks.` : ' Showing simulated patterns.'}
            {isConnected && ' Real-time tracking active.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Real-time session info */}
            {isConnected && sessionStats && (
              <Alert className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                <Wifi className="h-4 w-4" />
                <AlertDescription>
                  Active session: {Math.max(0, sessionStats.sessionLength)} tracks, {Math.max(0, sessionStats.totalMinutes)} minutes total.
                  <Button variant="link" className="p-0 h-auto ml-2" onClick={clearSession}>
                    Clear session
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Data quality indicator */}
            {hasRealData && (
              <Alert className="border-secondary/30 bg-gradient-to-r from-secondary/5 to-secondary/10">
                <Star className="h-4 w-4" />
                <AlertDescription>
                  Enhanced with real data: {recentlyPlayedData?.length || 0} recent tracks analyzed
                </AlertDescription>
              </Alert>
            )}

            {/* Month labels - responsive */}
            <div className="hidden md:flex justify-between text-xs text-muted-foreground px-2">
              {months.map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
            
            {/* Mobile month labels */}
            <div className="md:hidden flex justify-between text-xs text-muted-foreground px-1">
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
            
            {/* Heatmap grid - responsive */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {Object.values(weeklyData).map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 min-w-[10px] md:min-w-[12px]">
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                    const day = week.find(d => d.dayOfWeek === dayOfWeek);
                    const isRecentRealData = day && hasRealData && 
                      new Date(day.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <button
                        key={`${weekIndex}-${dayOfWeek}`}
                        className={`
                          w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm border cursor-pointer transition-all hover:scale-125 hover:z-10 relative focus:ring-2 focus:ring-primary focus:outline-none
                          ${day ? getIntensityClass(day.level) : 'bg-muted/20 border-border/10 hover:bg-muted/30'}
                          ${isRecentRealData ? 'ring-1 ring-accent' : ''}
                        `}
                        onClick={() => day && handleDayClick(day)}
                        title={day ? `${day.date}: ${day.plays} plays${isRecentRealData ? ' (real data)' : ''}` : ''}
                        disabled={!day}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm border ${getIntensityClass(level).split(' hover:')[0]}`}
                  />
                ))}
                <span className="ml-2">More</span>
              </div>
            </div>

            {/* Debug info */}
            <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted/20 rounded">
              Debug: Total plays: {totalPlays}, Active days: {activeDays}, Current streak: {currentStreak}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activity Details
            </DialogTitle>
            <DialogDescription>
              Listening activity for the selected day
            </DialogDescription>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">{Math.max(0, selectedDay.plays)}</div>
                <div className="text-sm text-muted-foreground">plays on this day</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium">Activity Level</div>
                  <div className="text-muted-foreground">
                    {selectedDay.level === 0 ? 'No activity' :
                     selectedDay.level === 1 ? 'Light' :
                     selectedDay.level === 2 ? 'Moderate' :
                     selectedDay.level === 3 ? 'High' : 'Very High'}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium">Day Type</div>
                  <div className="text-muted-foreground">
                    {selectedDay.dayOfWeek === 0 || selectedDay.dayOfWeek === 6 ? 'Weekend' : 'Weekday'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Privacy Information Dialog */}
      <Dialog open={privacyInfoOpen} onOpenChange={setPrivacyInfoOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Information
            </DialogTitle>
            <DialogDescription>
              How your data is processed and protected
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Local Processing
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                All listening data is processed locally in your browser. No sensitive data is stored permanently or transmitted to external servers.
              </p>
            </div>
            
            {isConnected && (
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    disconnect();
                    setPrivacyInfoOpen(false);
                  }}
                  className="w-full"
                >
                  Disconnect and Clear Data
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
