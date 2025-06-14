
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Music, Users, Trophy, Calendar, BarChart3 } from 'lucide-react';

interface QuickNavigationProps {
  onNavigate: (view: string) => void;
}

export const QuickNavigation = ({ onNavigate }: QuickNavigationProps) => {
  const navigationItems = [
    {
      id: 'enhanced-trends',
      title: 'Listening Trends',
      description: 'Track your music evolution over time',
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      badge: 'Insights'
    },
    {
      id: 'genres',
      title: 'Genre Analysis',
      description: 'Explore your musical preferences',
      icon: Music,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      badge: 'Discovery'
    },
    {
      id: 'artists',
      title: 'Artist Deep Dive',
      description: 'Discover artist connections',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50 hover:bg-green-100',
      badge: 'Explore'
    },
    {
      id: 'gamification',
      title: 'Achievements',
      description: 'Your music listening progress',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      badge: 'Gaming'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Explore Your Music Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`h-auto p-4 justify-start ${item.bgColor} border transition-all hover:scale-[1.02]`}
                onClick={() => onNavigate(item.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Icon className={`h-5 w-5 mt-1 ${item.color}`} />
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
