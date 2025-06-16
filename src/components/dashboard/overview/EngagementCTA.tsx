import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Trophy, Music, ArrowRight, Zap } from 'lucide-react';

interface EngagementCTAProps {
  onNavigate?: (view: string) => void;
}

export const EngagementCTA = ({ onNavigate }: EngagementCTAProps) => {
  const ctaItems = [
    {
      id: 'enhanced-trends',
      title: 'Discover Your Music Evolution',
      description: 'See how your taste has changed over time with detailed trend analysis',
      icon: TrendingUp,
      color: 'from-blue-500 to-primary',
      textColor: 'text-blue-600',
      badge: 'Most Popular',
      action: 'Explore Trends'
    },
    {
      id: 'gamification',
      title: 'Unlock Music Achievements',
      description: 'Level up your listening with 100+ achievements and challenges',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-600',
      badge: 'Fun & Engaging',
      action: 'Start Journey'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main CTA Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-dashed border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
        <CardContent className="relative p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
            <h3 className="text-xl font-bold">Ready for More?</h3>
            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            You've just scratched the surface! Dive deeper into your musical world with our advanced analytics and interactive features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {ctaItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`relative p-4 rounded-lg bg-gradient-to-br ${item.color}/10 border border-current/20 group cursor-pointer transition-all hover:scale-105 hover:shadow-lg`}
                  onClick={() => onNavigate?.(item.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color}/20`}>
                      <Icon className={`h-5 w-5 ${item.textColor}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <Button 
                        size="sm" 
                        className={`bg-gradient-to-r ${item.color} text-white hover:opacity-90 group-hover:translate-x-1 transition-transform`}
                      >
                        {item.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span>Quick Actions:</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate?.('genres')}
          className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
        >
          <Music className="h-3 w-3 mr-1" />
          Genre Analysis
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate?.('artists')}
          className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Artist Explorer
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate?.('library-health')}
          className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Library Health
        </Button>
      </div>
    </div>
  );
}; 