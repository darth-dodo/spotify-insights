
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Medal, Crown, Star, TrendingUp, Users, 
  Music, Clock, Zap, Target, Award 
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  value: number;
  label: string;
  trend: 'up' | 'down' | 'same';
  previousRank?: number;
}

export const Leaderboards = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'alltime'>('week');

  // Mock leaderboard data
  const xpLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: '1', username: 'MusicMaven', value: 15420, label: 'XP', trend: 'up', previousRank: 3 },
    { rank: 2, userId: '2', username: 'BeatExplorer', value: 14890, label: 'XP', trend: 'down', previousRank: 1 },
    { rank: 3, userId: '3', username: 'SoundSeeker', value: 13750, label: 'XP', trend: 'up', previousRank: 5 },
    { rank: 4, userId: '4', username: 'RhythmRider', value: 12340, label: 'XP', trend: 'same', previousRank: 4 },
    { rank: 5, userId: '5', username: 'MelodyMaster', value: 11890, label: 'XP', trend: 'up', previousRank: 7 },
    { rank: 6, userId: '6', username: 'You', value: 9850, label: 'XP', trend: 'up', previousRank: 8 },
    { rank: 7, userId: '7', username: 'TuneTracker', value: 9420, label: 'XP', trend: 'down', previousRank: 6 },
    { rank: 8, userId: '8', username: 'VibeVoyager', value: 8890, label: 'XP', trend: 'same', previousRank: 8 },
  ];

  const streakLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: '1', username: 'StreakKing', value: 156, label: 'days', trend: 'up', previousRank: 2 },
    { rank: 2, userId: '2', username: 'ConsistentCathy', value: 134, label: 'days', trend: 'same', previousRank: 2 },
    { rank: 3, userId: '3', username: 'DailyListener', value: 98, label: 'days', trend: 'up', previousRank: 4 },
    { rank: 4, userId: '4', username: 'MusicAddict', value: 87, label: 'days', trend: 'down', previousRank: 1 },
    { rank: 5, userId: '5', username: 'You', value: 45, label: 'days', trend: 'up', previousRank: 7 },
  ];

  const discoveryLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: '1', username: 'GenreGuru', value: 847, label: 'new tracks', trend: 'up', previousRank: 2 },
    { rank: 2, userId: '2', username: 'NewMusicNinja', value: 823, label: 'new tracks', trend: 'down', previousRank: 1 },
    { rank: 3, userId: '3', username: 'FreshFinder', value: 756, label: 'new tracks', trend: 'same', previousRank: 3 },
    { rank: 4, userId: '4', username: 'You', value: 432, label: 'new tracks', trend: 'up', previousRank: 6 },
    { rank: 5, userId: '5', username: 'SongScout', value: 398, label: 'new tracks', trend: 'down', previousRank: 4 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: LeaderboardEntry['trend'], previousRank?: number, currentRank?: number) => {
    if (!previousRank || !currentRank) return null;
    
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    }
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 2: return 'bg-gray-100 text-gray-800 border-gray-300';
      case 3: return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const LeaderboardCard = ({ 
    title, 
    description, 
    icon, 
    data 
  }: { 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    data: LeaderboardEntry[] 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((entry) => (
            <div 
              key={entry.userId} 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                entry.username === 'You' 
                  ? 'bg-accent/50 border border-accent/20' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(entry.rank)}
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback className="text-xs">
                  {entry.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium truncate ${
                    entry.username === 'You' ? 'text-accent' : ''
                  }`}>
                    {entry.username}
                  </span>
                  {entry.username === 'You' && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {entry.value.toLocaleString()} {entry.label}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getTrendIcon(entry.trend, entry.previousRank, entry.rank)}
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRankBadgeColor(entry.rank)}`}
                >
                  #{entry.rank}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Leaderboards
          </h2>
          <p className="text-muted-foreground">
            See how you rank against other music enthusiasts
          </p>
        </div>
        
        <div className="flex gap-2">
          {(['week', 'month', 'alltime'] as const).map(period => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period === 'alltime' ? 'All Time' : period}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="xp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="xp" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Streaks
          </TabsTrigger>
          <TabsTrigger value="discovery" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Discovery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xp">
          <LeaderboardCard
            title="Experience Points"
            description="Top players by total XP earned"
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            data={xpLeaderboard}
          />
        </TabsContent>

        <TabsContent value="streaks">
          <LeaderboardCard
            title="Listening Streaks"
            description="Longest current listening streaks"
            icon={<Zap className="h-5 w-5 text-orange-500" />}
            data={streakLeaderboard}
          />
        </TabsContent>

        <TabsContent value="discovery">
          <LeaderboardCard
            title="Music Discovery"
            description="Most new tracks discovered this period"
            icon={<Music className="h-5 w-5 text-green-500" />}
            data={discoveryLeaderboard}
          />
        </TabsContent>
      </Tabs>

      {/* User's Overall Stats */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Rankings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent mb-1">#6</div>
              <div className="text-sm text-muted-foreground">XP Ranking</div>
              <div className="text-xs text-green-600 mt-1">↑ +2 this week</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent mb-1">#5</div>
              <div className="text-sm text-muted-foreground">Streak Ranking</div>
              <div className="text-xs text-green-600 mt-1">↑ +2 this week</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent mb-1">#4</div>
              <div className="text-sm text-muted-foreground">Discovery Ranking</div>
              <div className="text-xs text-green-600 mt-1">↑ +2 this week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
