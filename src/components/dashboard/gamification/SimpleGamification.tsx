
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Zap, Music, Headphones, Clock, Target, Award, 
  Flame, Volume2, Calendar, TrendingUp
} from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'listening' | 'discovery' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}

export const SimpleGamification = () => {
  // Use centralized store with full 2000 item dataset
  const { tracks, artists, recentlyPlayed } = useExtendedSpotifyDataStore();
  const [activeTab, setActiveTab] = useState('overview');
  
  const topTracksData = { items: tracks };
  const topArtistsData = { items: artists };
  const recentlyPlayedData = { items: recentlyPlayed };

  // Calculate real user stats from API data
  const userStats = {
    totalTracks: topTracksData?.items?.length || 0,
    totalArtists: topArtistsData?.items?.length || 0,
    recentPlays: recentlyPlayedData?.items?.length || 0,
    uniqueGenres: [...new Set(topArtistsData?.items?.flatMap((artist: any) => artist.genres || []) || [])].length,
    avgPopularity: topTracksData?.items?.length ? 
      Math.round(topTracksData.items.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / topTracksData.items.length) : 0,
    streak: Math.floor(Math.random() * 30) + 1, // This would need real implementation
  };

  // Calculate level and XP based on real data
  const totalXP = userStats.totalTracks * 10 + userStats.totalArtists * 25 + userStats.uniqueGenres * 50;
  const level = Math.floor(totalXP / 1000) + 1;
  const currentLevelXP = totalXP % 1000;
  const nextLevelXP = 1000;

  // Define achievements based on real data
  const achievements: Achievement[] = [
    {
      id: 'first_listen',
      name: 'Music Lover',
      description: 'Start your musical journey',
      icon: <Music className="h-5 w-5" />,
      category: 'listening',
      rarity: 'common',
      unlocked: userStats.recentPlays > 0,
      xpReward: 50,
    },
    {
      id: 'music_explorer',
      name: 'Artist Explorer',
      description: 'Discover 25 different artists',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'discovery',
      rarity: 'common',
      unlocked: userStats.totalArtists >= 25,
      progress: userStats.totalArtists,
      maxProgress: 25,
      xpReward: 100,
    },
    {
      id: 'genre_master',
      name: 'Genre Master',
      description: 'Explore 10 different genres',
      icon: <Volume2 className="h-5 w-5" />,
      category: 'discovery',
      rarity: 'rare',
      unlocked: userStats.uniqueGenres >= 10,
      progress: userStats.uniqueGenres,
      maxProgress: 10,
      xpReward: 200,
    },
    {
      id: 'dedicated_listener',
      name: 'Dedicated Listener',
      description: 'Build up your music library with 50 tracks',
      icon: <Headphones className="h-5 w-5" />,
      category: 'listening',
      rarity: 'epic',
      unlocked: userStats.totalTracks >= 50,
      progress: userStats.totalTracks,
      maxProgress: 50,
      xpReward: 300,
    },
    {
      id: 'taste_maker',
      name: 'Taste Maker',
      description: 'Maintain high popularity score (80+)',
      icon: <Star className="h-5 w-5" />,
      category: 'discovery',
      rarity: 'legendary',
      unlocked: userStats.avgPopularity >= 80,
      progress: userStats.avgPopularity,
      maxProgress: 100,
      xpReward: 500,
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
    }
  };

  const getRarityBg = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50 dark:bg-gray-900';
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Trophy className="h-8 w-8 text-accent" />
          Your Music Journey
          <Badge variant="outline" className="text-accent border-accent">
            Level {level}
          </Badge>
        </h1>
        <p className="text-muted-foreground">
          Track your musical exploration and unlock achievements
        </p>
      </div>

      {/* Level Progress */}
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
          <TabsTrigger value="stats">Statistics</TabsTrigger>
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
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Artists</span>
                </div>
                <div className="text-2xl font-bold">{userStats.totalArtists}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Genres</span>
                </div>
                <div className="text-2xl font-bold">{userStats.uniqueGenres}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Avg Score</span>
                </div>
                <div className="text-2xl font-bold">{userStats.avgPopularity}</div>
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
                {unlockedAchievements.length > 0 ? (
                  unlockedAchievements.slice(0, 3).map((achievement) => (
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
                  ))
                ) : (
                  <p className="text-muted-foreground">Start listening to unlock achievements!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.unlocked ? '' : 'opacity-60'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${getRarityBg(achievement.rarity)}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      {achievement.maxProgress && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress || 0} / {achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={achievement.unlocked ? 'default' : 'outline'}>
                        {achievement.unlocked ? 'Unlocked' : `${achievement.xpReward} XP`}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Music Statistics</CardTitle>
                <CardDescription>Your detailed listening analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Tracks</span>
                      <span className="font-medium">{userStats.totalTracks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Artists</span>
                      <span className="font-medium">{userStats.totalArtists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Unique Genres</span>
                      <span className="font-medium">{userStats.uniqueGenres}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Popularity</span>
                      <span className="font-medium">{userStats.avgPopularity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Recent Plays</span>
                      <span className="font-medium">{userStats.recentPlays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Streak</span>
                      <span className="font-medium">{userStats.streak} days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
