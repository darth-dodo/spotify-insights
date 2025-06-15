
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

interface UserStatsCardProps {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
}

export const UserStatsCard = ({ level, totalXP, currentLevelXP, nextLevelXP }: UserStatsCardProps) => {
  return (
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
  );
};
