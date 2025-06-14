
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Clock, Users, TrendingUp, Play, Heart, Loader2, Trophy, Star, Target, Zap, Award, Crown, Medal } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export const InteractiveOverview = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const { data: topTracksData, isLoading: tracksLoading } = useTopTracks('medium_term', 10);
  const { data: topArtistsData, isLoading: artistsLoading } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData, isLoading: recentLoading } = useRecentlyPlayed(10);

  const isLoading = tracksLoading || artistsLoading || recentLoading;

  // Gamification data
  const badges = [
    { id: 'early_bird', name: 'Early Bird', description: 'Listen to music before 8 AM', icon: '🌅', unlocked: true, rarity: 'common' },
    { id: 'night_owl', name: 'Night Owl', description: 'Listen past midnight for 7 days', icon: '🦉', unlocked: true, rarity: 'uncommon' },
    { id: 'genre_explorer', name: 'Genre Explorer', description: 'Listen to 10+ different genres', icon: '🗺️', unlocked: false, rarity: 'rare', progress: 7 },
    { id: 'marathon_listener', name: 'Marathon Listener', description: 'Listen for 8+ hours in one day', icon: '🏃', unlocked: true, rarity: 'legendary' },
    { id: 'discoverer', name: 'Music Discoverer', description: 'Find 50 new artists this month', icon: '🔍', unlocked: false, rarity: 'epic', progress: 23 },
    { id: 'social_butterfly', name: 'Social Butterfly', description: 'Share 25 songs', icon: '🦋', unlocked: false, rarity: 'rare', progress: 12 },
  ];

  const achievements = {
    level: 12,
    xp: 2847,
    nextLevelXp: 3000,
    weeklyGoal: { target: 20, current: 14, unit: 'hours' },
    streak: 15,
    totalListeningTime: 1247,
    artistsDiscovered: 23,
    songsLiked: 156
  };

  const quests = [
    { id: 1, title: 'Discover New Genre', description: 'Listen to a genre you haven\'t explored yet', reward: '100 XP', progress: 0, target: 1, type: 'daily' },
    { id: 2, title: 'Weekend Warrior', description: 'Listen for 3+ hours this weekend', reward: 'Night Owl Badge', progress: 2, target: 3, type: 'weekend' },
    { id: 3, title: 'Social Sharer', description: 'Share 5 songs with friends', reward: '50 XP', progress: 2, target: 5, type: 'weekly' },
  ];

  const rarityColors = {
    common: 'text-gray-600',
    uncommon: 'text-green-600',
    rare: 'text-blue-600',
    epic: 'text-purple-600',
    legendary: 'text-orange-600'
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Loading your music data... 🎵</h1>
          <p className="text-muted-foreground">Please wait while we fetch your listening insights</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gamified Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Welcome back! 🎵
              <Badge variant="outline" className="text-accent border-accent">
                Level {achievements.level}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Your musical journey continues - check out your latest achievements!
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">XP Progress</div>
            <div className="text-lg font-bold">{achievements.xp}/{achievements.nextLevelXp}</div>
            <Progress value={(achievements.xp / achievements.nextLevelXp) * 100} className="w-32" />
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'streak' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'streak' ? null : 'streak')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-accent">{achievements.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it going! 🔥</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'time' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'time' ? null : 'time')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total Time</span>
            </div>
            <div className="text-2xl font-bold">{achievements.totalListeningTime}h</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'discover' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'discover' ? null : 'discover')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Discovered</span>
            </div>
            <div className="text-2xl font-bold">{achievements.artistsDiscovered}</div>
            <p className="text-xs text-muted-foreground">New artists</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            selectedCard === 'likes' ? 'ring-2 ring-accent bg-accent/5' : ''
          }`}
          onClick={() => setSelectedCard(selectedCard === 'likes' ? null : 'likes')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Liked Songs</span>
            </div>
            <div className="text-2xl font-bold">{achievements.songsLiked}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Listening Time Goal</span>
              <span className="font-medium">{achievements.weeklyGoal.current}/{achievements.weeklyGoal.target} hours</span>
            </div>
            <Progress value={(achievements.weeklyGoal.current / achievements.weeklyGoal.target) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {achievements.weeklyGoal.target - achievements.weeklyGoal.current} hours to go!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          <TabsTrigger value="quests">Active Quests</TabsTrigger>
          <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`transition-all hover:shadow-lg ${
                  badge.unlocked ? 'bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20' : 'opacity-75'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex items-center gap-1">
                      {badge.unlocked ? (
                        <Trophy className="h-4 w-4 text-accent" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-muted" />
                      )}
                      <Badge variant="outline" className={rarityColors[badge.rarity]}>
                        {badge.rarity}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-medium mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                  
                  {!badge.unlocked && badge.progress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{badge.progress}/10</span>
                      </div>
                      <Progress value={(badge.progress / 10) * 100} className="h-1" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quests" className="space-y-4">
          <div className="space-y-4">
            {quests.map((quest) => (
              <Card key={quest.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{quest.title}</h4>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                    </div>
                    <Badge variant="outline">{quest.type}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.target}</span>
                    </div>
                    <Progress value={(quest.progress / quest.target) * 100} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-accent font-medium">Reward: {quest.reward}</span>
                      {quest.progress === quest.target && (
                        <Button size="sm" variant="outline">Claim Reward</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Badges Earned</span>
                    <span className="font-medium">{badges.filter(b => b.unlocked).length}/{badges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Level</span>
                    <span className="font-medium">{achievements.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total XP</span>
                    <span className="font-medium">{achievements.xp}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Listening Time</span>
                    <span className="font-medium">{achievements.weeklyGoal.current}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Discoveries</span>
                    <span className="font-medium">8 artists</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Songs Added</span>
                    <span className="font-medium">24 tracks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <Crown className="h-6 w-6 mx-auto mb-1 text-accent" />
                    <div className="text-sm font-medium">Music Enthusiast</div>
                    <div className="text-xs text-muted-foreground">1000+ hours listened</div>
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
