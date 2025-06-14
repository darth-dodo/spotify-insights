
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Star, Award, Music } from 'lucide-react';

export const GamificationSettings = () => {
  const [gamificationEnabled, setGamificationEnabled] = useState(false);
  const [achievementsEnabled, setAchievementsEnabled] = useState(false);
  const [streaksEnabled, setStreaksEnabled] = useState(false);
  const [challengesEnabled, setChallengesEnabled] = useState(false);

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      name: 'Music Explorer',
      description: 'Listen to 50 different artists',
      icon: Music,
      progress: 42,
      total: 50,
      unlocked: false
    },
    {
      id: 2,
      name: 'Night Owl',
      description: 'Listen to music after midnight 10 times',
      icon: Star,
      progress: 10,
      total: 10,
      unlocked: true
    },
    {
      id: 3,
      name: 'Genre Master',
      description: 'Explore 10 different genres',
      icon: Award,
      progress: 7,
      total: 10,
      unlocked: false
    },
    {
      id: 4,
      name: 'Marathon Listener',
      description: 'Listen for 5 hours in a single day',
      icon: Target,
      progress: 4.2,
      total: 5,
      unlocked: false
    }
  ];

  const currentStreak = 12;
  const bestStreak = 28;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gamification & Achievements</h2>
        <p className="text-muted-foreground">
          Add fun challenges and track your music listening milestones
        </p>
      </div>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Gamification Features</CardTitle>
          <CardDescription>
            Toggle different gamification elements to enhance your music experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Enable Gamification</h4>
              <p className="text-sm text-muted-foreground">
                Turn on all gamification features including achievements, streaks, and challenges
              </p>
            </div>
            <Switch 
              checked={gamificationEnabled} 
              onCheckedChange={setGamificationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Achievements</h4>
              <p className="text-sm text-muted-foreground">
                Unlock badges for reaching listening milestones
              </p>
            </div>
            <Switch 
              checked={achievementsEnabled} 
              onCheckedChange={setAchievementsEnabled}
              disabled={!gamificationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Listening Streaks</h4>
              <p className="text-sm text-muted-foreground">
                Track consecutive days of music listening
              </p>
            </div>
            <Switch 
              checked={streaksEnabled} 
              onCheckedChange={setStreaksEnabled}
              disabled={!gamificationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Weekly Challenges</h4>
              <p className="text-sm text-muted-foreground">
                Participate in personalized listening challenges
              </p>
            </div>
            <Switch 
              checked={challengesEnabled} 
              onCheckedChange={setChallengesEnabled}
              disabled={!gamificationEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Achievements Preview */}
      {gamificationEnabled && achievementsEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Achievements
            </CardTitle>
            <CardDescription>
              Track your progress towards music listening milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.total) * 100;
              
              return (
                <div key={achievement.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{achievement.name}</h4>
                      {achievement.unlocked && (
                        <Badge variant="default" className="bg-accent">Unlocked!</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{achievement.progress} / {achievement.total}</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Streaks Preview */}
      {gamificationEnabled && streaksEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Listening Streaks
            </CardTitle>
            <CardDescription>
              Keep your music listening momentum going
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-3xl font-bold text-accent mb-2">{currentStreak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
                <div className="text-xs text-muted-foreground mt-1">days in a row</div>
              </div>
              <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-3xl font-bold text-primary mb-2">{bestStreak}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
                <div className="text-xs text-muted-foreground mt-1">personal record</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenges Preview */}
      {gamificationEnabled && challengesEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              This Week's Challenge
            </CardTitle>
            <CardDescription>
              Complete personalized listening goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border">
                <h4 className="font-medium mb-2">Genre Explorer Challenge</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Listen to at least 3 songs from 5 different genres this week
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>3/5 genres</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary">Rock ✓</Badge>
                  <Badge variant="secondary">Jazz ✓</Badge>
                  <Badge variant="secondary">Electronic ✓</Badge>
                  <Badge variant="outline">Classical</Badge>
                  <Badge variant="outline">Hip Hop</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
