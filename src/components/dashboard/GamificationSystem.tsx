
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Zap, Music, Headphones, Heart, Calendar, 
  TrendingUp, Users, Clock, Target, Award, Crown, Gem,
  Flame, Volume2, Disc, Radio, Shuffle, Repeat
} from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'listening' | 'discovery' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  unlocked: boolean;
}

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
  };

  // Calculate level and XP
  const totalXP = userStats.totalTracks * 10 + userStats.totalArtists * 25 + userStats.listeningTime * 2;
  const level = Math.floor(totalXP / 1000) + 1;
  const currentLevelXP = totalXP % 1000;
  const nextLevelXP = 1000;

  // Define achievements
  const achievements: Achievement[] = [
    {
      id: 'first_listen',
      name: 'First Steps',
      description: 'Play your first track',
      icon: <Music className="h-5 w-5" />,
      category: 'listening',
      rarity: 'common',
      unlocked: userStats.recentPlays > 0,
      xpReward: 50,
    },
    {
      id: 'music_explorer',
      name: 'Music Explorer',
      description: 'Discover 25 different artists',
      icon: <Users className="h-5 w-5" />,
      category: 'discovery',
      rarity: 'common',
      unlocked: userStats.totalArtists >= 25,
      progress: userStats.totalArtists,
      maxProgress: 25,
      xpReward: 100,
    },
    {
      id: 'dedicated_listener',
      name: 'Dedicated Listener',
      description: 'Listen for 100 hours total',
      icon: <Headphones className="h-5 w-5" />,
      category: 'listening',
      rarity: 'rare',
      unlocked: userStats.listeningTime >= 6000,
      progress: userStats.listeningTime,
      maxProgress: 6000,
      xpReward: 250,
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Maintain a 30-day listening streak',
      icon: <Flame className="h-5 w-5" />,
      category: 'streak',
      rarity: 'epic',
      unlocked: userStats.streak >= 30,
      progress: userStats.streak,
      maxProgress: 30,
      xpReward: 500,
    },
    {
      id: 'genre_connoisseur',
      name: 'Genre Connoisseur',
      description: 'Explore 20 different genres',
      icon: <Disc className="h-5 w-5" />,
      category: 'discovery',
      rarity: 'rare',
      unlocked: userStats.genresExplored >= 20,
      progress: userStats.genresExplored,
      maxProgress: 20,
      xpReward: 300,
    },
    {
      id: 'music_legend',
      name: 'Music Legend',
      description: 'Reach level 50',
      icon: <Crown className="h-5 w-5" />,
      category: 'special',
      rarity: 'legendary',
      unlocked: level >= 50,
      progress: level,
      maxProgress: 50,
      xpReward: 1000,
    },
  ];

  // Define badges
  const badges: Badge[] = [
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Listen to music before 8 AM',
      icon: '🌅',
      color: 'from-orange-400 to-yellow-500',
      requirement: 'Morning listening activity',
      unlocked: Math.random() > 0.5,
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Listen to music after midnight',
      icon: '🦉',
      color: 'from-purple-500 to-blue-600',
      requirement: 'Late night listening',
      unlocked: Math.random() > 0.5,
    },
    {
      id: 'weekend_warrior',
      name: 'Weekend Warrior',
      description: 'High activity on weekends',
      icon: '🎉',
      color: 'from-green-400 to-blue-500',
      requirement: '10+ hours weekend listening',
      unlocked: Math.random() > 0.5,
    },
    {
      id: 'diversity_champion',
      name: 'Diversity Champion',
      description: 'Listen to artists from 10+ countries',
      icon: '🌍',
      color: 'from-teal-400 to-green-500',
      requirement: 'Global music exploration',
      unlocked: Math.random() > 0.5,
    },
    {
      id: 'trend_setter',
      name: 'Trend Setter',
      description: 'Discover tracks before they go viral',
      icon: '🚀',
      color: 'from-pink-500 to-purple-600',
      requirement: 'Early adoption of trending music',
      unlocked: Math.random() > 0.5,
    },
    {
      id: 'vault_hunter',
      name: 'Vault Hunter',
      description: 'Listen to rare or unreleased tracks',
      icon: '💎',
      color: 'from-yellow-400 to-orange-500',
      requirement: 'Rare music discovery',
      unlocked: Math.random() > 0.5,
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getRarityBg = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50 dark:bg-gray-900';
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const unlockedBadges = badges.filter(b => b.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="h-8 w-8 text-accent" />
          Player Profile
          <Badge variant="outline" className="text-accent border-accent">
            Level {level}
          </Badge>
        </h1>
        <p className="text-muted-foreground">
          Track your progress, unlock achievements, and earn badges through your musical journey
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
                <h3 className="text-xl font-bold">Level {level}</h3>
                <p className="text-sm text-muted-foreground">{totalXP.toLocaleString()} total XP</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Tracks</span>
                </div>
                <div className="text-2xl font-bold">{userStats.totalTracks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Artists</span>
                </div>
                <div className="text-2xl font-bold">{userStats.totalArtists}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Hours</span>
                </div>
                <div className="text-2xl font-bold">{Math.floor(userStats.listeningTime / 60)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Streak</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">{userStats.streak}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest unlocked achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unlockedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`p-2 rounded-full ${getRarityBg(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unlocked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Unlocked ({unlockedAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border ${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-background/50">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm opacity-80">{achievement.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Locked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  In Progress ({lockedAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 rounded-lg border bg-muted/20 opacity-60">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{achievement.progress} / {achievement.maxProgress}</span>
                              <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card key={badge.id} className={`${badge.unlocked ? '' : 'opacity-60'}`}>
                <CardContent className="p-4">
                  <div className={`w-full h-24 bg-gradient-to-br ${badge.color} rounded-lg mb-3 flex items-center justify-center text-4xl`}>
                    {badge.icon}
                  </div>
                  <h4 className="font-medium mb-1">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                  <Badge variant={badge.unlocked ? 'default' : 'outline'} className="text-xs">
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">{badge.requirement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
