import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Loader2 } from 'lucide-react';

export const ListeningPatterns = () => {
  const { useRecentlyPlayed } = useSpotifyData();
  const { data: recentlyPlayedData, isLoading } = useRecentlyPlayed(50);

  const patterns = useMemo(() => {
    if (!recentlyPlayedData?.items) return null;

    const items = recentlyPlayedData.items;
    
    // Calculate hourly distribution
    const hourlyData = Array(24).fill(0);
    items.forEach((item: any) => {
      const playedAt = new Date(item.played_at);
      const hour = playedAt.getHours();
      hourlyData[hour]++;
    });

    const hourlyDistribution = hourlyData.map((count, hour) => ({
      hour: `${hour}:00`,
      count,
    }));

    // Calculate day of week distribution
    const dayData = Array(7).fill(0);
    items.forEach((item: any) => {
      const playedAt = new Date(item.played_at);
      const day = playedAt.getDay();
      dayData[day]++;
    });

    const dayDistribution = dayData.map((count, day) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
      count,
    }));

    // Calculate average listening session length
    const sessions: number[] = [];
    let currentSession: number[] = [];
    
    items.forEach((item: any, index: number) => {
      if (index === 0) {
        currentSession.push(new Date(item.played_at).getTime());
        return;
      }

      const currentTime = new Date(item.played_at).getTime();
      const previousTime = new Date(items[index - 1].played_at).getTime();
      const timeDiff = currentTime - previousTime;

      // If gap is more than 30 minutes, consider it a new session
      if (timeDiff > 30 * 60 * 1000) {
        if (currentSession.length > 1) {
          sessions.push(currentSession.length);
        }
        currentSession = [currentTime];
      } else {
        currentSession.push(currentTime);
      }
    });

    // Add the last session
    if (currentSession.length > 1) {
      sessions.push(currentSession.length);
    }

    const avgSessionLength = sessions.length > 0 
      ? Math.round(sessions.reduce((a, b) => a + b, 0) / sessions.length)
      : 0;

    return {
      hourlyDistribution,
      dayDistribution,
      avgSessionLength,
      totalSessions: sessions.length,
    };
  }, [recentlyPlayedData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!patterns) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No listening data available
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Listening Patterns</CardTitle>
          <CardDescription>Your music listening habits and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hourly Distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Hourly Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patterns.hourlyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Day of Week Distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Day of Week Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={patterns.dayDistribution}
                      dataKey="count"
                      nameKey="day"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {patterns.dayDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Session Statistics */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Average Session Length</div>
              <div className="text-2xl font-bold">{patterns.avgSessionLength} tracks</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Total Sessions</div>
              <div className="text-2xl font-bold">{patterns.totalSessions}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 