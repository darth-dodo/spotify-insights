import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Trophy, Flame, Star, Shield, Play, Pause, Wifi, WifiOff } from 'lucide-react';
import { useSpotifyPlayback } from '@/hooks/useSpotifyPlayback';
import { InfoButton } from '@/components/ui/InfoButton';
import type { HeatmapDay } from '@/lib/spotify-playback-sdk';

export const EnhancedActivityHeatmap = () => {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [privacyInfoOpen, setPrivacyInfoOpen] = useState(false);

  const { isConnected, sessionStats, heatmapData, clearSession, disconnect } = useSpotifyPlayback();

  // Fallback to simulated data if no real-time data available
  const generateFallbackData = (): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseActivity = isWeekend ? 0.7 : 1.0;
      
      const seasonalFactor = 0.8 + 0.4 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      const randomFactor = 0.5 + Math.random() * 0.5;
      
      const plays = Math.floor(baseActivity * seasonalFactor * randomFactor * 50);
      
      let level = 0;
      if (plays > 40) level = 4;
      else if (plays > 30) level = 3;
      else if (plays > 20) level = 2;
      else if (plays > 10) level = 1;
      
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekOfYear = Math.ceil((((date.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);
      
      data.push({
        date: date.toISOString().split('T')[0],
        plays,
        level,
        dayOfWeek,
        weekOfYear,
      });
    }
    
    return data;
  };

  // Use real-time data if available, otherwise fallback to simulated
  const displayData = heatmapData.length > 0 ? 
    [...generateFallbackData().slice(0, -7), ...heatmapData] : 
    generateFallbackData();

  const totalPlays = displayData.reduce((sum, day) => sum + day.plays, 0);
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
    return streak;
  };

  const currentStreak = calculateCurrentStreak(displayData);

  const getIntensityClass = (level: number) => {
    const classes = [
      'bg-muted/30 border-border/20 hover:bg-muted/50',
      'bg-accent/20 border-accent/30 hover:bg-accent/30',
      'bg-accent/40 border-accent/50 hover:bg-accent/50',
      'bg-accent/70 border-accent/80 hover:bg-accent/80',
      'bg-accent border-accent hover:bg-accent/90',
    ];
    return classes[level] || classes[0];
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Enhanced Activity Heatmap
              <InfoButton
                title="Enhanced Activity Heatmap"
                description="Real-time activity tracking using Spotify Web Playback SDK with local-only processing. All playback data is processed locally and never stored permanently."
                calculation="Combines real-time playback data (when available) with simulated historical patterns. Recent days show actual listening activity from your current session."
              />
              {isConnected && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {!isConnected && (
                <Badge variant="outline" className="text-muted-foreground">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Simulated
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
            {isConnected ? ' Recent data shows real-time activity from your current session.' : ' Showing simulated activity patterns.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Real-time session info */}
            {isConnected && sessionStats && (
              <Alert>
                <Play className="h-4 w-4" />
                <AlertDescription>
                  Active session: {sessionStats.sessionLength} tracks played, {sessionStats.uniqueTracks} unique tracks, 
                  {sessionStats.totalMinutes} minutes total. 
                  <Button variant="link" className="p-0 h-auto ml-2" onClick={clearSession}>
                    Clear session data
                  </Button>
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
                    return (
                      <button
                        key={`${weekIndex}-${dayOfWeek}`}
                        className={`
                          w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm border cursor-pointer transition-all hover:scale-125 hover:z-10 relative focus:ring-2 focus:ring-accent focus:outline-none
                          ${day ? getIntensityClass(day.level) : 'bg-muted/20 border-border/10 hover:bg-muted/30'}
                        `}
                        onClick={() => day && handleDayClick(day)}
                        title={day ? `${day.date}: ${day.plays} plays` : ''}
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
          </div>
        </CardContent>
      </Card>

      {/* Day Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Listening Activity Details
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown for the selected day
            </DialogDescription>
          </DialogHeader>
          {selectedDay && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">{selectedDay.plays}</div>
                <div className="text-sm text-muted-foreground">plays on this day</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                {heatmapData.some(d => d.date === selectedDay.date) && (
                  <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                    Real-time data
                  </Badge>
                )}
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
              Privacy-First Real-Time Processing
            </DialogTitle>
            <DialogDescription>
              How we protect your data while providing real-time insights
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Local-Only Processing
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                The Web Playback SDK processes your listening data in real-time within your browser. 
                No playback data is ever transmitted to external servers or stored permanently.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">How it works:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  Real-time playback data processed locally in your browser
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  Session data stored temporarily in memory only
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  All data automatically cleared when you close the browser
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  No permanent storage or external transmission
                </li>
              </ul>
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
                  Disconnect and Clear All Data
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
