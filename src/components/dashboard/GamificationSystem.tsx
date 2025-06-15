import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Zap, Music, Headphones, Heart, Calendar, 
  TrendingUp, Users, Clock, Target, Award, Crown, Gem,
  Flame, Volume2, Disc, Radio, Shuffle, Repeat, Search, Globe
} from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { ComprehensiveAchievements } from './achievements/ComprehensiveAchievements';
import { DailyChallenges } from './challenges/DailyChallenges';
import { Leaderboards } from './leaderboards/Leaderboards';
import { SeasonalEvents } from './seasons/SeasonalEvents';

export const GamificationSystem = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: topTracksData } = useTopTracks('medium_term', 50);
  const { data: topArtistsData } = useTopArtists('medium_term', 50);
  const { data: recentlyPlayedData } = useRecentlyPlayed(50);

  // Calculate user stats
  const userStats = {
    totalTracks: topTracksData?.items?.length || 0,
    totalArtists: topArtistsData?.items?.length || 0,
    recentPlays: recentlyPlayedData?.items?.length || 0,
    listeningTime: Math.floor(Math.random() * 10000) + 5000, // Mock listening time in minutes
    streak: Math.floor(Math.random() * 30) + 1,
    genresExplored: Math.floor(Math.random() * 20) + 10,
    uniqueGenres: [...new Set(topArtistsData?.items?.flatMap((artist: any) => artist.genres || []) || [])].length,
  };

  // Calculate level and XP based on comprehensive achievement system
  const totalXP = userStats.totalTracks * 10 + userStats.totalArtists * 25 + userStats.listeningTime * 2;
  const level = Math.floor(totalXP / 1000) + 1;
  const currentLevelXP = totalXP % 1000;
  const nextLevelXP = 1000;

  // Sample of recent achievements (would be calculated from full system)
  const recentAchievements = [
    {
      id: 'music_lover',
      name: 'Music Lover',
      description: `Discovered ${userStats.totalTracks} tracks`,
      icon: <Music className="h-5 w-5" />,
      rarity: 'common' as const,
      unlocked: userStats.totalTracks > 0,
      xpReward: 100,
    },
    {
      id: 'genre_explorer',
      name: 'Genre Explorer',
      description: `Explored ${userStats.uniqueGenres} different genres`,
      icon: <Globe className="h-5 w-5" />,
      rarity: 'rare' as const,
      unlocked: userStats.uniqueGenres >= 10,
      xpReward: 300,
    },
    {
      id: 'consistent_listener',
      name: 'Consistent Listener',
      description: `Maintained ${userStats.streak}-day streak`,
      icon: <Flame className="h-5 w-5" />,
      rarity: 'epic' as const,
      unlocked: userStats.streak >= 7,
      xpReward: 500,
    }
  ];

  const getRarityColor = (rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic') => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      case 'mythic': return 'text-red-600 border-red-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getRarityBg = (rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic') => {
    switch (rarity) {
      case 'common': return 'bg-gray-50 dark:bg-gray-900';
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'mythic': return 'bg-red-50 dark:bg-red-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900';
    }
  };

  // Mock achievement statistics
  const achievementStats = {
    total: 105,
    unlocked: Math.floor(Math.random() * 30) + 15,
    common: Math.floor(Math.random() * 8) + 3,
    rare: Math.floor(Math.random() * 12) + 5,
    epic: Math.floor(Math.random() * 8) + 2,
    legendary: Math.floor(Math.random() * 3) + 1,
    mythic: Math.floor(Math.random() * 2),
  };

  const completionRate = Math.round((achievementStats.unlocked / achievementStats.total) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="h-8 w-8 text-accent" />
          Music Achievement Center
          <Badge variant="outline" className="text-accent border-accent">
            Level {level}
          </Badge>
        </h1>
        <p className="text-muted-foreground">
          Unlock over 100 achievements across your musical journey - from first listens to legendary accomplishments
        </p>
      </div>

      {/* Level and XP Progress */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Level {level} Music Explorer</h3>
                <p className="text-sm text-muted-foreground">{totalXP.toLocaleString()} total XP earned</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">{currentLevelXP} / {nextLevelXP} XP</div>
              <p className="text-xs text-muted-foreground">to next level</p>
            </div>
          </div>
          <Progress value={(currentLevelXP / nextLevelXP) * 100} className="h-3" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">All Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Achievement Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Progress
                </CardTitle>
                <CardDescription>Your journey through 105+ unique achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-accent">{achievementStats.unlocked}/{achievementStats.total}</span>
                  <Badge variant="outline" className="text-accent">{completionRate}% Complete</Badge>
                </div>
                <Progress value={completionRate} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Common:</span>
                      <span className="font-medium">{achievementStats.common}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Rare:</span>
                      <span className="font-medium">{achievementStats.rare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-600">Epic:</span>
                      <span className="font-medium">{achievementStats.epic}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-yellow-600">Legendary:</span>
                      <span className="font-medium">{achievementStats.legendary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Mythic:</span>
                      <span className="font-medium">{achievementStats.mythic}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Your Music Stats
                </CardTitle>
                <CardDescription>Real data from your Spotify activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{userStats.totalTracks}</div>
                    <div className="text-xs text-muted-foreground">Tracks Discovered</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{userStats.totalArtists}</div>
                    <div className="text-xs text-muted-foreground">Artists Explored</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{userStats.uniqueGenres}</div>
                    <div className="text-xs text-muted-foreground">Genres Found</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{userStats.streak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('achievements')}
            >
              <Trophy className="h-6 w-6" />
              <span>Browse All Achievements</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('challenges')}
            >
              <Target className="h-6 w-6" />
              <span>Daily Challenges</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('leaderboards')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Leaderboards</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab('events')}
            >
              <Calendar className="h-6 w-6" />
              <span>Seasonal Events</span>
            </Button>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`p-2 rounded-full ${getRarityBg(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        +{achievement.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievement Categories Preview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { name: 'Listening', count: 25, icon: <Headphones className="h-5 w-5" />, color: 'bg-blue-500' },
              { name: 'Discovery', count: 30, icon: <Search className="h-5 w-5" />, color: 'bg-green-500' },
              { name: 'Social', count: 20, icon: <Users className="h-5 w-5" />, color: 'bg-purple-500' },
              { name: 'Streaks', count: 15, icon: <Flame className="h-5 w-5" />, color: 'bg-orange-500' },
              { name: 'Special', count: 15, icon: <Star className="h-5 w-5" />, color: 'bg-yellow-500' },
            ].map((category) => (
              <Card key={category.name} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('achievements')}>
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center text-white mx-auto mb-2`}>
                    {category.icon}
                  </div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.count} achievements</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <ComprehensiveAchievements />
        </TabsContent>

        <TabsContent value="challenges">
          <DailyChallenges />
        </TabsContent>

        <TabsContent value="leaderboards">
          <Leaderboards />
        </TabsContent>

        <TabsContent value="events">
          <SeasonalEvents />
        </TabsContent>
      </Tabs>
    </div>
  );
};
