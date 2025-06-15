import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, 
  BarChart3, 
  Music, 
  Users, 
  Settings, 
  TrendingUp,
  Heart,
  Activity,
  Library,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ isOpen, onToggle, activeView, onViewChange }: SidebarProps) => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Your music dashboard'
    },
    {
      id: 'library-health',
      label: 'Library Health',
      icon: Library,
      description: 'Library analytics and insights'
    },
    {
      id: 'listening-patterns',
      label: 'Listening Patterns',
      icon: Activity,
      description: 'Your listening habits'
    },
    {
      id: 'trends',
      label: 'Listening Activity',
      icon: BarChart3,
      description: 'Recent listening history'
    },
    {
      id: 'enhanced-trends',
      label: 'Enhanced Trends',
      icon: TrendingUp,
      description: 'Advanced trend analysis'
    },
    {
      id: 'genres',
      label: 'Genre Analysis',
      icon: Music,
      description: 'Genre distribution and insights'
    },
    {
      id: 'artists',
      label: 'Artist Exploration',
      icon: Users,
      description: 'Artist discovery and stats'
    },
    {
      id: 'gamification',
      label: 'Achievements',
      icon: Heart,
      description: 'Your music milestones'
    }
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "md:relative md:translate-x-0"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full justify-start p-2 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Back to Home</div>
              <div className="text-xs text-muted-foreground">Exit dashboard</div>
            </div>
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-accent/10 text-accent"
                  )}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Privacy First</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All processing happens locally - your data never leaves your device!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
