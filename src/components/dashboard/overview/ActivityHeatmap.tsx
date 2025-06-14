
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Flame, Star } from 'lucide-react';

interface HeatmapDay {
  date: string;
  plays: number;
  level: number;
  dayOfWeek: number;
  weekOfYear: number;
}

export const ActivityHeatmap = () => {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Generate last 365 days of data
  const generateHeatmapData = (): HeatmapDay[] => {
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

  const heatmapData = generateHeatmapData();
  const totalPlays = heatmapData.reduce((sum, day) => sum + day.plays, 0);
  const activeDays = heatmapData.filter(day => day.plays > 0).length;
  
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

  const currentStreak = calculateCurrentStreak(heatmapData);

  const getIntensityClass = (level: number) => {
    const classes = [
      'bg-muted/30 border-border/20',
      'bg-accent/20 border-accent/30',
      'bg-accent/40 border-accent/50',
      'bg-accent/70 border-accent/80',
      'bg-accent border-accent',
    ];
    return classes[level] || classes[0];
  };

  // Group data by weeks for rendering
  const weeklyData = heatmapData.reduce((weeks, day) => {
    const weekKey = day.weekOfYear;
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(day);
    return weeks;
  }, {} as Record<number, HeatmapDay[]>);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Heatmap
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-orange-500">{currentStreak} day streak</span>
            </div>
            <Badge variant="outline">{Math.round((activeDays/365)*100)}% active</Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Your listening activity over the past year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground px-2">
            {months.map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {Object.values(weeklyData).map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 min-w-[12px]">
                {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                  const day = week.find(d => d.dayOfWeek === dayOfWeek);
                  return (
                    <div
                      key={`${weekIndex}-${dayOfWeek}`}
                      className={`
                        w-3 h-3 rounded-sm border cursor-pointer transition-all hover:scale-125 hover:z-10 relative
                        ${day ? getIntensityClass(day.level) : 'bg-muted/20 border-border/10'}
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
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less active</span>
            <div className="flex gap-1 items-center">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border ${getIntensityClass(level)}`}
                />
              ))}
              <span className="ml-2">More active</span>
            </div>
          </div>
          
          {/* Hovered day info */}
          {hoveredDay && (
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="text-sm font-medium">
                {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
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
  );
};
