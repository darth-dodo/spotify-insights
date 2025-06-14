
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Flame, AlertCircle, Info } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

interface HeatmapDay {
  date: string;
  plays: number;
  level: number;
  dayOfWeek: number;
  weekOfYear: number;
}

export const ActivityHeatmap = () => {
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { useEnhancedRecentlyPlayed } = useSpotifyData();
  const { data: recentlyPlayedData, isLoading, error } = useEnhancedRecentlyPlayed(500);

  // Generate heatmap data from real Spotify data or demo data (last 90 days only)
  const generateHeatmapData = (): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    const playsByDate = new Map<string, number>();

    // Process real API data if available
    if (recentlyPlayedData && recentlyPlayedData.length > 0) {
      recentlyPlayedData.forEach((track: any) => {
        if (track.playedAt) {
          const date = track.playedAt.split('T')[0];
          const playCount = Math.max(0, track.playCount || 1);
          playsByDate.set(date, (playsByDate.get(date) || 0) + playCount);
        }
      });
    } else if (!isLoading && !error) {
      // Generate demo data for the last 90 days when no real data is available
      for (let i = 89; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Create some demo activity with random patterns
        const demoPlays = Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 1 : 0;
        if (demoPlays > 0) {
          playsByDate.set(dateStr, demoPlays);
        }
      }
    }

    // Generate last 90 days only
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const plays = playsByDate.get(dateStr) || 0;
      
      // Determine intensity level based on plays
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
    
    return data;
  };

  const displayData = generateHeatmapData();
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
  const hasRealData = recentlyPlayedData && recentlyPlayedData.length > 0;
  const hasAnyData = totalPlays > 0;

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

  // Generate month labels for 90 days
  const generateMonthLabels = () => {
    const labels = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89);
    
    const currentMonth = startDate.getMonth();
    let month = currentMonth;
    
    for (let i = 0; i < 3; i++) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels.push(monthNames[month % 12]);
      month++;
    }
    
    return labels;
  };

  const monthLabels = generateMonthLabels();

  const handleDayClick = (day: HeatmapDay) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  // Show loading state with progress
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Heatmap (90 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground mb-2">Loading your listening activity...</p>
              <Progress value={65} className="w-full max-w-xs mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message when no data is available and there's an error
  if (error && !hasAnyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Heatmap (90 Days)
            <InfoButton
              title="Activity Heatmap"
              description="Visual representation of your daily listening activity over the last 90 days based on your Spotify listening history."
              calculation="Shows actual play counts for each day based on your recent Spotify activity. Days without data appear empty."
              variant="modal"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Unable to Load Activity Data</h3>
              <p className="text-sm text-muted-foreground">
                There was an error loading your listening data. Please try again later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base sm:text-lg">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Activity Heatmap (90 Days)</span>
              <InfoButton
                title="Activity Heatmap"
                description="Visual representation of your daily listening activity over the last 90 days based on your Spotify listening history."
                calculation="Shows actual play counts for each day based on your recent Spotify activity. Darker squares indicate more listening activity."
                variant="modal"
              />
              {hasRealData && (
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
                  {recentlyPlayedData.length} tracks
                </Badge>
              )}
              {!hasRealData && hasAnyData && (
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                  Demo Data
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                <span className="text-orange-500">{currentStreak} day streak</span>
              </div>
              <Badge variant="outline" className="text-xs">{Math.round((activeDays/90)*100)}% active</Badge>
            </div>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your listening activity over the past 90 days {hasRealData ? 'based on Spotify data' : 'with demo activity'}.
            {hasRealData && ` Showing data from ${recentlyPlayedData.length} recent tracks.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {/* Stats Summary - Mobile Responsive */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-primary">{totalPlays.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Plays</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-orange-500">{currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center p-2 sm:p-3 bg-muted/30 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-green-500">{activeDays}</div>
                <div className="text-xs text-muted-foreground">Active Days</div>
              </div>
            </div>

            {/* Month labels - responsive */}
            <div className="flex justify-between text-xs text-muted-foreground px-1 sm:px-2">
              {monthLabels.map((month, index) => (
                <span key={index} className="text-xs sm:text-sm">{month}</span>
              ))}
            </div>
            
            {/* Heatmap grid - Mobile optimized */}
            <div className="flex gap-0.5 sm:gap-1 overflow-x-auto pb-2">
              {Object.values(weeklyData).map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1 min-w-[8px] sm:min-w-[12px]">
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                    const day = week.find(d => d.dayOfWeek === dayOfWeek);
                    
                    return (
                      <button
                        key={`${weekIndex}-${dayOfWeek}`}
                        className={`
                          w-2 h-2 sm:w-3 sm:h-3 rounded-sm border cursor-pointer transition-all hover:scale-125 hover:z-10 relative focus:ring-2 focus:ring-primary focus:outline-none
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
            
            {/* Legend - Mobile responsive */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-sm border ${getIntensityClass(level).split(' hover:')[0]}`}
                  />
                ))}
                <span className="ml-1 sm:ml-2">More</span>
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
    </>
  );
};
