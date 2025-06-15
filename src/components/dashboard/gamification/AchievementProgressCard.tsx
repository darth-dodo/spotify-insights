
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface AchievementProgressCardProps {
  achievementStats: {
    total: number;
    unlocked: number;
    common: number;
    rare: number;
    epic: number;
    legendary: number;
    mythic: number;
  };
  completionRate: number;
}

export const AchievementProgressCard = ({ achievementStats, completionRate }: AchievementProgressCardProps) => {
  return (
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
  );
};
