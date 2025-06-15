
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Calendar, Play, Pause } from 'lucide-react';

export const ListeningPatterns = () => {
  const { useRecentlyPlayed } = useSpotifyData();
  const { data: recentlyPlayedData, isLoading } = useRecentlyPlayed(50);

  // Analyze listening patterns
  const patterns = React.useMemo(() => {
    if (!recentlyPlayedData?.items) return null;

    const tracks = recentlyPlayedData.items;

    // Hourly distribution
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
      label: i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i - 12} PM` : `${i} AM`
    }));

    // Day of week distribution
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyData = dayNames.map(day => ({ day, count: 0, percentage: 0 }));

    // Session analysis
    const sessions: { start: Date; end: Date; trackCount: number }[] = [];
    let currentSession = { start: new Date(), end: new Date(), trackCount: 0 };
    const sessionGapThreshold = 30 * 60 * 1000; // 30 minutes

    tracks.forEach((item, index) => {
      const playedAt = new Date(item.played_at);
      const hour = playedAt.getHours();
      const dayOfWeek = playedAt.getDay();

      hourlyData[hour].count++;
      weeklyData[dayOfWeek].count++;

      // Session analysis
      if (index === 0) {
        currentSession = { start: playedAt, end: playedAt, trackCount: 1 };
      } else {
        const prevPlayedAt = new Date(tracks[index - 1].played_at);
        const timeDiff = prevPlayedAt.getTime() - playedAt.getTime();

        if (timeDiff > sessionGapThreshold) {
          // New session
          sessions.push({ ...currentSession });
          currentSession = { start: playedAt, end: playedAt, trackCount: 1 };
        } else {
          // Continue current session
          currentSession.end = playedAt;
          currentSession.trackCount++;
        }
      }
    });

    // Add the last session
    if (currentSession.trackCount > 0) {
      sessions.push(currentSession);
    }

    // Calculate percentages for weekly data
    const totalWeeklyPlays = weeklyData.reduce((sum, day) => sum + day.count, 0);
    weeklyData.forEach(day => {
      day.percentage = totalWeeklyPlays > 0 ? Math.round((day.count / totalWeeklyPlays) * 100) : 0;
    });

    // Session statistics
    const sessionLengths = sessions.map(session => 
      (session.end.getTime() - session.start.getTime()) / (1000 * 60) // minutes
    );
    
    const avgSessionLength = sessionLengths.length > 0 ? 
      sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length : 0;

    const avgTracksPerSession = sessions.length > 0 ? 
      sessions.reduce((sum, session) => sum + session.trackCount, 0) / sessions.length : 0;

    // Peak listening hours
    const peakHour = hourlyData.reduce((max, current) => 
      current.count > max.count ? current : max
    );

    // Most active day
    const mostActiveDay = weeklyData.reduce((max, current) => 
      current.count > max.count ? current : max
    );

    return {
      hourlyData,
      weeklyData,
      sessions: sessions.length,
      avgSessionLength: Math.round(avgSessionLength),
      avgTracksPerSession: Math.round(avgTracksPerSession * 10) / 10,
      peakHour,
      mostActiveDay,
      totalTracks: tracks.length
    };
  }, [recentlyPlayedData]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Listening Patterns</h1>
          <p className="text-muted-foreground">Analyzing your listening habits...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!patterns) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Listening Patterns</h1>
          <p className="text-muted-foreground">Unable to load listening data. Please try again.</p>
        </div>
      </div>
    );
  }

  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff', '#00ffff'];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Listening Patterns</h1>
        <p className="text-muted-foreground">
          Analyze and visualize your listening habits based on recent activity
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Sessions</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.sessions}</div>
            <p className="text-xs text-muted-foreground">
              Recent sessions detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Length</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.avgSessionLength}m</div>
            <p className="text-xs text-muted-foreground">
              Average minutes per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.peakHour.label}</div>
            <p className="text-xs text-muted-foreground">
              {patterns.peakHour.count} tracks played
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracks per Session</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.avgTracksPerSession}</div>
            <p className="text-xs text-muted-foreground">
              Average tracks played
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Listening Distribution</CardTitle>
            <CardDescription>When you listen to music throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patterns.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value) => [value, 'Tracks']}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Listening Distribution</CardTitle>
            <CardDescription>Which days you listen to music most</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patterns.weeklyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ day, percentage }) => `${day}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {patterns.weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Tracks']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Listening Insights</CardTitle>
          <CardDescription>Key patterns from your recent listening activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Most Active Day</h4>
              <p className="text-sm text-muted-foreground">
                You listen to music most on <strong>{patterns.mostActiveDay.day}</strong> with{' '}
                {patterns.mostActiveDay.count} tracks ({patterns.mostActiveDay.percentage}% of total plays)
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Session Behavior</h4>
              <p className="text-sm text-muted-foreground">
                You typically listen to <strong>{patterns.avgTracksPerSession} tracks</strong> per session,
                with sessions lasting an average of <strong>{patterns.avgSessionLength} minutes</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
