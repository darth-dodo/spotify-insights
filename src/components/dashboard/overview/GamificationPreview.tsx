import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Flame, Target, Zap, Crown, Award, Music } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { InfoButton } from '@/components/ui/InfoButton';

interface GamificationPreviewProps {
  onNavigate?: (view: string) => void;
  isEnabled?: boolean;
}

export const GamificationPreview = ({ onNavigate, isEnabled = true }: GamificationPreviewProps) => {
  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const { data: tracks = [] } = useEnhancedTopTracks('medium_term', 2000);
  const { data: artists = [] } = useEnhancedTopArtists('medium_term', 2000);
  const tracksData = { items: tracks };
  const artistsData = { items: artists };

  if (!isEnabled) {
    return null;
  }

  // Calculate user stats
  const userStats = {
    totalTracks: tracksData?.items?.length || 0,
    totalArtists: artistsData?.items?.length || 0,
    uniqueGenres: [...new Set(artistsData?.items?.flatMap((artist: any) => artist.genres || []) || [])].length,
    avgPopularity: tracksData?.items ? 
      Math.round(tracksData.items.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracksData.items.length) : 0,
    streak: Math.floor(Math.random() * 30) + 1, // Would be real data in production
  };

  // Calculate level and XP
  const totalXP = userStats.totalTracks * 10 + userStats.totalArtists * 25 + userStats.uniqueGenres * 50;
  const level = Math.floor(totalXP / 1000) + 1;
  const currentLevelXP = totalXP % 1000;
  const nextLevelXP = 1000;
  const progressPercentage = (currentLevelXP / nextLevelXP) * 100;

  // Recent achievements
  const recentAchievements = [
    {
      id: 'music_lover',
      name: 'Music Lover',
      description: `Discovered ${userStats.totalTracks} tracks`,
      icon: Music,
      rarity: 'common' as const,
      unlocked: userStats.totalTracks > 0,
      xpReward: 100,
    },
    {
      id: 'genre_explorer',
      name: 'Genre Explorer',
      description: `Explored ${userStats.uniqueGenres} different genres`,
      icon: Star,
      rarity: 'rare' as const,
      unlocked: userStats.uniqueGenres >= 10,
      xpReward: 300,
    },
    {
      id: 'consistent_listener',
      name: 'Streak Master',
      description: `Maintained ${userStats.streak}-day streak`,
      icon: Flame,
      rarity: 'epic' as const,
      unlocked: userStats.streak >= 7,
      xpReward: 500,
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-slate-500 bg-slate-50 border-slate-200';
      case 'rare': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'epic': return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'legendary': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'mythic': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getRarityColorDark = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'dark:text-slate-400 dark:bg-slate-800/50 dark:border-slate-700';
      case 'rare': return 'dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800';
      case 'epic': return 'dark:text-purple-400 dark:bg-purple-900/30 dark:border-purple-800';
      case 'legendary': return 'dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800';
      case 'mythic': return 'dark:text-red-400 dark:bg-red-900/30 dark:border-red-800';
      default: return 'dark:text-slate-400 dark:bg-slate-800/50 dark:border-slate-700';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" data-tour="gamification" id="gamification-section">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Your Music Journey
          <Badge variant="outline" className="text-accent border-accent">
            Level {level}
          </Badge>
          <InfoButton
            title="Music Journey System"
            description="Track your musical exploration through achievements, levels, and streaks."
            calculation="Level calculated from total XP. XP earned through: Tracks (10 XP), Artists (25 XP), Genres (50 XP). Level = Total XP ÷ 1000 + 1."
            funFacts={[
              "Achievements celebrate your music discovery milestones",
              "Listening streaks encourage daily music engagement",
              "Genre exploration rewards musical curiosity",
              "Levels provide long-term progression goals"
            ]}
            metrics={[
              { label: "Total XP", value: `${totalXP.toLocaleString()}`, description: "Experience points earned" },
              { label: "Progress", value: `${Math.round(progressPercentage)}%`, description: "Progress to next level" },
              { label: "Streak", value: `${userStats.streak} days`, description: "Current listening streak" },
            ]}
          />
        </CardTitle>
        <CardDescription>
          Level {level} • {totalXP.toLocaleString()} XP • {userStats.streak} day streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-accent" />
              Level {level} Progress
            </span>
            <span className="text-muted-foreground">
              {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {nextLevelXP - currentLevelXP} XP until Level {level + 1}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-lg font-bold text-primary">{userStats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">Tracks</div>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="text-lg font-bold text-accent">{userStats.totalArtists}</div>
            <div className="text-xs text-muted-foreground">Artists</div>
          </div>
          <div className="text-center p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="text-lg font-bold text-secondary">{userStats.uniqueGenres}</div>
            <div className="text-xs text-muted-foreground">Genres</div>
          </div>
          <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <div className="text-lg font-bold text-orange-600">{userStats.streak}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {recentAchievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${getRarityColor(achievement.rarity)} ${getRarityColorDark(achievement.rarity)}`}
                >
                  <div className="p-2 rounded-full bg-current/10">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm truncate">{achievement.name}</h5>
                      <Badge variant="outline" className="text-xs capitalize">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-75 truncate">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium">+{achievement.xpReward} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Challenges */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Today's Challenge
          </h4>
          <div className="p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="font-medium text-sm">Genre Explorer</span>
              <Badge variant="secondary" className="text-xs">Daily</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Listen to 3 songs from different genres today
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>2/3 genres</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="default" 
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          onClick={() => onNavigate?.('gamification')}
        >
          <Trophy className="h-4 w-4 mr-2" />
          View Full Achievement Center
        </Button>
      </CardContent>
    </Card>
  );
}; 