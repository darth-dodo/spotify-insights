
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { InfoButton } from '@/components/ui/InfoButton';

interface HeatmapData {
  day: string;
  hour: number;
  activity: number;
}

export const ListeningHeatmap = () => {
  // Generate mock heatmap data
  const generateHeatmapData = (): HeatmapData[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: HeatmapData[] = [];
    
    days.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        // Simulate higher activity during typical listening hours
        let baseActivity = 0;
        if (hour >= 7 && hour <= 9) baseActivity = 40; // Morning commute
        else if (hour >= 12 && hour <= 14) baseActivity = 30; // Lunch break
        else if (hour >= 17 && hour <= 22) baseActivity = 60; // Evening
        else if (hour >= 23 || hour <= 2) baseActivity = 20; // Late night
        else baseActivity = 10; // Other hours
        
        // Add weekend variation
        if (day === 'Sat' || day === 'Sun') {
          if (hour >= 10 && hour <= 18) baseActivity += 20;
        }
        
        const activity = Math.max(0, baseActivity + Math.floor(Math.random() * 30) - 15);
        data.push({ day, hour, activity });
      }
    });
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getActivityColor = (activity: number) => {
    if (activity === 0) return 'bg-muted';
    if (activity < 20) return 'bg-primary/20';
    if (activity < 40) return 'bg-primary/40';
    if (activity < 60) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Listening Activity Heatmap
          <InfoButton
            title="Listening Activity Heatmap"
            description="Visual representation of your music listening patterns throughout the week, showing when you're most active."
            calculation="Based on your listening history data, showing activity levels for each hour of each day of the week."
            variant="modal"
          />
        </CardTitle>
        <CardDescription>
          Your music listening patterns throughout the week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hour labels */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-12">
            {hours.filter((_, i) => i % 4 === 0).map(hour => (
              <div key={hour} className="w-6 text-center">
                {hour.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-1">
            {days.map(day => (
              <div key={day} className="flex items-center gap-1">
                <div className="w-10 text-xs font-medium text-muted-foreground">
                  {day}
                </div>
                <div className="flex gap-1">
                  {hours.map(hour => {
                    const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                    const activity = dataPoint?.activity || 0;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`w-6 h-6 rounded-sm ${getActivityColor(activity)} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer`}
                        title={`${day} ${hour}:00 - Activity: ${activity}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4">
            <span>Less active</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <div className="w-3 h-3 rounded-sm bg-primary/60" />
              <div className="w-3 h-3 rounded-sm bg-primary/80" />
            </div>
            <span>More active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
