
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Trophy, Flame, Star, Clock } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

interface HeatmapDay {
  date: string;
  plays: number;
  level: number; // 0-4 intensity levels
  dayOfWeek: number;
  weekOfYear: number;
}

export const ListeningHeatmap = () => {
  const { useRecentlyPlayed } = useSpotifyData();
  const { data: recentlyPlayedData } = useRecentlyPlayed(50);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Generate last 365 days of data
  const generateHeatmapData = (): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate play data with some realistic patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseActivity = isWeekend ? 0.7 : 1.0; // Lower activity on weekends
      
      // Add some randomness and seasonal variation
      const seasonalFactor = 0.8 + 0.4 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      const randomFactor = 0.5 + Math.random() * 0.5;
      
      const plays = Math.floor(baseActivity * seasonalFactor * randomFactor * 50);
      
      // Determine intensity level (0-4) based on plays
      let level = 0;
      if (plays > 40) level = 4;
      else if (plays > 30) level = 3;
      else if (plays > 20) level = 2;
      else if (plays > 10) level = 1;
      
      // Get week number
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

  const heatmapData = generateHeatmapData();
  const totalPlays = heatmapData.reduce((sum, day) => sum + day.plays, 0);
  const maxPlays = Math.max(...heatmapData.map(day => day.plays));
  const activeDays = heatmapData.filter(day => day.plays > 0).length;
  const currentStreak = calculateCurrentStreak(heatmapData);
  const longestStreak = calculateLongestStreak(heatmapData);

  function calculateCurrentStreak(data: HeatmapDay[]): number {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].plays > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function calculateLongestStreak(data: HeatmapDay[]): number {
    let maxStreak = 0;
    let currentStreak = 0;
    
    data.forEach(day => {
      if (day.plays > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }

  // Group data by weeks for rendering
  const weeklyData = heatmapData.reduce((weeks, day) => {
    const weekKey = day.weekOfYear;
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(day);
    return weeks;
  }, {} as Record<number, HeatmapDay[]>);

  const getIntensityClass = (level: number) => {
    const classes = [
      'bg-muted border-border/20', // 0 plays
      'bg-accent/20 border-accent/30', // Low activity
      'bg-accent/40 border-accent/50', // Medium-low activity
      'bg-accent/70 border-accent/80', // Medium-high activity
      'bg-accent border-accent', // High activity
    ];
    return classes[level] || classes[0];
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Listening Activity
        </h2>
        <p className="text-muted-foreground">
          Your music listening patterns over the past year
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Total Plays</span>
            </div>
            <div className="text-2xl font-bold">{totalPlays.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">{currentStreak} days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Longest Streak</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">{longestStreak} days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Days</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{activeDays}/365</div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>365 Day Activity Graph</span>
            <Badge variant="outline">{Math.round((activeDays/365)*100)}% active</Badge>
          </CardTitle>
          <CardDescription>
            Each square represents a day. Darker squares indicate more listening activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-muted-foreground px-4">
              {months.map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 pr-2">
                <div className="h-3"></div> {/* Spacer for alignment */}
                {daysOfWeek.map((day, index) => (
                  index % 2 === 1 ? (
                    <div key={index} className="h-3 flex items-center">
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  ) : (
                    <div key={index} className="h-3"></div>
                  )
                ))}
              </div>
              
              {/* Grid of days */}
              <div className="flex gap-1 overflow-x-auto">
                {Object.values(weeklyData).map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                      const day = week.find(d => d.dayOfWeek === dayOfWeek);
                      return (
                        <div
                          key={`${weekIndex}-${dayOfWeek}`}
                          className={`
                            w-3 h-3 rounded-sm border cursor-pointer transition-all hover:scale-110
                            ${day ? getIntensityClass(day.level) : 'bg-muted border-border/20'}
                          `}
                          onMouseEnter={() => day && setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          title={day ? `${day.date}: ${day.plays} plays` : ''}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                {[0, 1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm border ${getIntensityClass(level)}`}
                  />
                ))}
                <span className="ml-2">More</span>
              </div>
            </div>
            
            {/* Hovered day info */}
            {hoveredDay && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
                <div className="text-sm font-medium">
                  {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {hoveredDay.plays} plays on this day
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
