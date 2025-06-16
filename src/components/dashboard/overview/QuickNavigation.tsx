
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
      title: 'Discover Trends',
      description: 'See how your taste evolved',
      icon: TrendingUp,
      color: 'text-primary',
      badge: 'Popular',
      gradient: 'from-blue-500/10 to-primary/10'
    },
    {
      id: 'genres',
      title: 'Genre Explorer',
      description: 'Find your musical DNA',
      icon: Music,
      color: 'text-secondary',
      badge: 'Insights',
      gradient: 'from-purple-500/10 to-secondary/10'
    },
    {
      id: 'artists',
      title: 'Artist Journey',
      description: 'Deep dive into favorites',
      icon: Users,
      color: 'text-accent',
      badge: 'Detailed',
      gradient: 'from-green-500/10 to-accent/10'
    },
    {
      id: 'gamification',
      title: 'Unlock Achievements',
      description: 'Level up your music game',
      icon: Trophy,
      color: 'text-yellow-600',
      badge: 'Fun',
      gradient: 'from-yellow-500/10 to-orange-500/10'
    }
  ];

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <BarChart3 className="h-6 w-6 text-primary" />
          Ready to Explore?
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Dive deeper into your musical world with these powerful tools
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`h-auto p-4 justify-start border-2 transition-all hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br ${item.gradient} hover:border-current group`}
                onClick={() => onNavigate(item.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-lg bg-current/10 group-hover:bg-current/20 transition-colors`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold group-hover:text-current transition-colors">
                        {item.title}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${item.color} bg-current/10 border-current/20`}
                      >
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
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
