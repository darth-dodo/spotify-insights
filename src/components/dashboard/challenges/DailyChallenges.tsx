
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Clock, Music, Users, Heart, Shuffle, 
  Volume2, TrendingUp, Globe, Calendar, Zap, Star
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  progress: number;
  maxProgress: number;
  xpReward: number;
  deadline: string;
  completed: boolean;
  category: string;
}

export const DailyChallenges = () => {
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const challenges: Challenge[] = [
    // Daily Challenges
    {
      id: 'daily_discover',
      title: 'Daily Discovery',
      description: 'Listen to 3 songs you\'ve never heard before',
      icon: <Music className="h-5 w-5" />,
      type: 'daily',
      difficulty: 'easy',
      progress: 2,
      maxProgress: 3,
      xpReward: 100,
      deadline: '2024-06-14T23:59:59',
      completed: false,
      category: 'Discovery'
    },
    {
      id: 'daily_streak',
      title: 'Streak Keeper',
      description: 'Listen to music for at least 30 minutes',
      icon: <Clock className="h-5 w-5" />,
      type: 'daily',
      difficulty: 'easy',
      progress: 30,
      maxProgress: 30,
      xpReward: 75,
      deadline: '2024-06-14T23:59:59',
      completed: true,
      category: 'Listening'
    },
    {
      id: 'daily_genre',
      title: 'Genre Explorer',
      description: 'Listen to songs from 4 different genres',
      icon: <Globe className="h-5 w-5" />,
      type: 'daily',
      difficulty: 'medium',
      progress: 2,
      maxProgress: 4,
      xpReward: 150,
      deadline: '2024-06-14T23:59:59',
      completed: false,
      category: 'Discovery'
    },
    {
      id: 'daily_mood',
      title: 'Mood Matcher',
      description: 'Create a playlist that matches your current mood',
      icon: <Heart className="h-5 w-5" />,
      type: 'daily',
      difficulty: 'medium',
      progress: 0,
      maxProgress: 1,
      xpReward: 200,
      deadline: '2024-06-14T23:59:59',
      completed: false,
      category: 'Creative'
    },

    // Weekly Challenges
    {
      id: 'weekly_artist',
      title: 'Artist Deep Dive',
      description: 'Listen to 50 songs from the same artist',
      icon: <Users className="h-5 w-5" />,
      type: 'weekly',
      difficulty: 'medium',
      progress: 32,
      maxProgress: 50,
      xpReward: 500,
      deadline: '2024-06-21T23:59:59',
      completed: false,
      category: 'Discovery'
    },
    {
      id: 'weekly_vintage',
      title: 'Vintage Vibes',
      description: 'Listen to 25 songs released before 1990',
      icon: <Star className="h-5 w-5" />,
      type: 'weekly',
      difficulty: 'hard',
      progress: 8,
      maxProgress: 25,
      xpReward: 750,
      deadline: '2024-06-21T23:59:59',
      completed: false,
      category: 'Discovery'
    },
    {
      id: 'weekly_shuffle',
      title: 'Shuffle Master',
      description: 'Use shuffle mode for 10 hours total',
      icon: <Shuffle className="h-5 w-5" />,
      type: 'weekly',
      difficulty: 'easy',
      progress: 6.5,
      maxProgress: 10,
      xpReward: 300,
      deadline: '2024-06-21T23:59:59',
      completed: false,
      category: 'Listening'
    },

    // Monthly Challenges
    {
      id: 'monthly_countries',
      title: 'World Music Tour',
      description: 'Listen to artists from 20 different countries',
      icon: <Globe className="h-5 w-5" />,
      type: 'monthly',
      difficulty: 'hard',
      progress: 12,
      maxProgress: 20,
      xpReward: 1500,
      deadline: '2024-06-30T23:59:59',
      completed: false,
      category: 'Discovery'
    },
    {
      id: 'monthly_hours',
      title: 'Music Marathon',
      description: 'Listen to music for 100 hours this month',
      icon: <Volume2 className="h-5 w-5" />,
      type: 'monthly',
      difficulty: 'hard',
      progress: 67,
      maxProgress: 100,
      xpReward: 2000,
      deadline: '2024-06-30T23:59:59',
      completed: false,
      category: 'Listening'
    },
    {
      id: 'monthly_trending',
      title: 'Trend Chaser',
      description: 'Listen to 15 songs currently trending',
      icon: <TrendingUp className="h-5 w-5" />,
      type: 'monthly',
      difficulty: 'medium',
      progress: 9,
      maxProgress: 15,
      xpReward: 800,
      deadline: '2024-06-30T23:59:59',
      completed: false,
      category: 'Discovery'
    }
  ];

  const filteredChallenges = challenges.filter(c => c.type === selectedType);

  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      return `${hours}h remaining`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Challenges</h2>
          <p className="text-muted-foreground">Complete challenges to earn bonus XP and achievements</p>
        </div>
        
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map(type => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map(challenge => (
          <Card key={challenge.id} className={`transition-all duration-200 ${
            challenge.completed 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20' 
              : 'hover:shadow-md'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    challenge.completed ? 'bg-green-500 text-white' : 'bg-accent text-accent-foreground'
                  }`}>
                    {challenge.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={getDifficultyColor(challenge.difficulty)}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {challenge.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-accent">+{challenge.xpReward} XP</div>
                  <div className="text-xs text-muted-foreground">
                    {getTimeRemaining(challenge.deadline)}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4">
                {challenge.description}
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">
                    {challenge.progress} / {challenge.maxProgress}
                    {challenge.type === 'daily' && challenge.maxProgress === 30 ? ' min' : ''}
                    {challenge.type === 'weekly' && challenge.id === 'weekly_shuffle' ? ' hrs' : ''}
                    {challenge.type === 'monthly' && challenge.id === 'monthly_hours' ? ' hrs' : ''}
                  </span>
                </div>
                
                <Progress 
                  value={(challenge.progress / challenge.maxProgress) * 100} 
                  className="h-2"
                />
                
                {challenge.completed && (
                  <div className="flex items-center gap-2 pt-2">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      ✓ Completed
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Great job! XP has been added to your profile.
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
