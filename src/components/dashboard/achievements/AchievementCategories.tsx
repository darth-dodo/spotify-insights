
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Music, Users, Calendar, TrendingUp, Clock, Headphones,
  Star, Heart, Shuffle, Volume2, Disc, Radio, Zap, Crown,
  Target, Award, Trophy, Flame, Globe, Sparkles
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
  dateUnlocked?: string;
}

export const AchievementCategories = () => {
  const achievements: Achievement[] = [
    // Listening Achievements
    {
      id: 'first_play',
      name: 'First Note',
      description: 'Play your very first track',
      icon: <Music className="h-5 w-5" />,
      category: 'Listening',
      rarity: 'common',
      unlocked: true,
      xpReward: 50,
      dateUnlocked: '2024-01-15'
    },
    {
      id: 'hundred_tracks',
      name: 'Century Player',
      description: 'Listen to 100 different tracks',
      icon: <Disc className="h-5 w-5" />,
      category: 'Listening',
      rarity: 'rare',
      unlocked: true,
      progress: 100,
      maxProgress: 100,
      xpReward: 200,
      dateUnlocked: '2024-02-10'
    },
    {
      id: 'marathon_session',
      name: 'Marathon Listener',
      description: 'Listen for 8 hours straight',
      icon: <Clock className="h-5 w-5" />,
      category: 'Listening',
      rarity: 'epic',
      unlocked: false,
      progress: 6.5,
      maxProgress: 8,
      xpReward: 500
    },
    {
      id: 'night_owl_supreme',
      name: 'Midnight Master',
      description: 'Listen to music after 2 AM for 30 days',
      icon: <Star className="h-5 w-5" />,
      category: 'Listening',
      rarity: 'legendary',
      unlocked: false,
      progress: 18,
      maxProgress: 30,
      xpReward: 1000
    },

    // Discovery Achievements
    {
      id: 'genre_explorer',
      name: 'Genre Explorer',
      description: 'Discover 15 different genres',
      icon: <Globe className="h-5 w-5" />,
      category: 'Discovery',
      rarity: 'common',
      unlocked: true,
      progress: 15,
      maxProgress: 15,
      xpReward: 150,
      dateUnlocked: '2024-01-28'
    },
    {
      id: 'world_traveler',
      name: 'World Traveler',
      description: 'Listen to artists from 25 different countries',
      icon: <Globe className="h-5 w-5" />,
      category: 'Discovery',
      rarity: 'rare',
      unlocked: false,
      progress: 18,
      maxProgress: 25,
      xpReward: 300
    },
    {
      id: 'trend_setter',
      name: 'Trend Setter',
      description: 'Discover 10 songs before they hit 1M plays',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'Discovery',
      rarity: 'epic',
      unlocked: false,
      progress: 3,
      maxProgress: 10,
      xpReward: 750
    },
    {
      id: 'music_prophet',
      name: 'Music Prophet',
      description: 'Predict 5 future chart toppers',
      icon: <Sparkles className="h-5 w-5" />,
      category: 'Discovery',
      rarity: 'mythic',
      unlocked: false,
      progress: 1,
      maxProgress: 5,
      xpReward: 2000
    },

    // Social Achievements
    {
      id: 'taste_maker',
      name: 'Taste Maker',
      description: 'Have 10 people follow your playlists',
      icon: <Users className="h-5 w-5" />,
      category: 'Social',
      rarity: 'rare',
      unlocked: false,
      progress: 6,
      maxProgress: 10,
      xpReward: 400
    },
    {
      id: 'influencer',
      name: 'Music Influencer',
      description: 'Get 1000 playlist followers',
      icon: <Crown className="h-5 w-5" />,
      category: 'Social',
      rarity: 'legendary',
      unlocked: false,
      progress: 342,
      maxProgress: 1000,
      xpReward: 1500
    },

    // Streak Achievements
    {
      id: 'consistent_listener',
      name: 'Consistent Listener',
      description: 'Maintain a 7-day listening streak',
      icon: <Flame className="h-5 w-5" />,
      category: 'Streaks',
      rarity: 'common',
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      xpReward: 100,
      dateUnlocked: '2024-02-05'
    },
    {
      id: 'dedication_master',
      name: 'Dedication Master',
      description: 'Maintain a 100-day listening streak',
      icon: <Trophy className="h-5 w-5" />,
      category: 'Streaks',
      rarity: 'legendary',
      unlocked: false,
      progress: 45,
      maxProgress: 100,
      xpReward: 2000
    },

    // Special Achievements
    {
      id: 'holiday_spirit',
      name: 'Holiday Spirit',
      description: 'Listen to holiday music during December',
      icon: <Star className="h-5 w-5" />,
      category: 'Special',
      rarity: 'epic',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 600
    },
    {
      id: 'anniversary_celebration',
      name: 'Anniversary Celebration',
      description: 'Use the app for a full year',
      icon: <Award className="h-5 w-5" />,
      category: 'Special',
      rarity: 'mythic',
      unlocked: false,
      progress: 8,
      maxProgress: 12,
      xpReward: 5000
    }
  ];

  const categories = ['Listening', 'Discovery', 'Social', 'Streaks', 'Special'];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300 bg-gray-50';
      case 'rare': return 'text-blue-600 border-blue-300 bg-blue-50';
      case 'epic': return 'text-purple-600 border-purple-300 bg-purple-50';
      case 'legendary': return 'text-yellow-600 border-yellow-300 bg-yellow-50';
      case 'mythic': return 'text-red-600 border-red-300 bg-red-50';
      default: return 'text-gray-600 border-gray-300 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity: Achievement['rarity']) => {
    if (!rarity) return '';
    switch (rarity) {
      case 'epic': return 'shadow-purple-200';
      case 'legendary': return 'shadow-yellow-200';
      case 'mythic': return 'shadow-red-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryAchievements = achievements.filter(a => a.category === category);
        const unlockedCount = categoryAchievements.filter(a => a.unlocked).length;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category} Achievements</span>
                <Badge variant="outline">
                  {unlockedCount} / {categoryAchievements.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                {category === 'Listening' && 'Achievements for your listening habits and dedication'}
                {category === 'Discovery' && 'Rewards for exploring new music and artists'}
                {category === 'Social' && 'Achievements for sharing and connecting through music'}
                {category === 'Streaks' && 'Consistency rewards for daily listening'}
                {category === 'Special' && 'Limited-time and seasonal achievements'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      achievement.unlocked 
                        ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} shadow-md` 
                        : 'bg-muted/30 border-muted opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        achievement.unlocked ? 'bg-background/80' : 'bg-muted'
                      }`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{achievement.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRarityColor(achievement.rarity)}`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {achievement.description}
                        </p>
                        
                        {achievement.progress !== undefined && achievement.maxProgress && !achievement.unlocked && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{achievement.progress} / {achievement.maxProgress}</span>
                              <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.xpReward} XP
                          </Badge>
                          {achievement.unlocked && achievement.dateUnlocked && (
                            <span className="text-xs text-muted-foreground">
                              Unlocked {new Date(achievement.dateUnlocked).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
