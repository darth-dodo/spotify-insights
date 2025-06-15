import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { 
  Home, 
  TrendingUp, 
  Music, 
  Users, 
  Trophy,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
  Headphones,
  Calendar,
  ArrowLeft,
  X,
  Heart,
  Activity
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
      title: 'Overview',
      icon: Home,
      description: 'Dashboard home',
      category: 'main'
    },
    {
      id: 'artists',
      title: 'Artist Explorer',
      icon: Users,
      description: 'Discover artist insights',
      category: 'discovery',
      badge: 'Enhanced'
    },
    {
      id: 'genres',
      title: 'Genre Analysis',
      icon: Music,
      description: 'Musical taste breakdown',
      category: 'discovery'
    },
    {
      id: 'library-health',
      title: 'Library Health',
      icon: Heart,
      description: 'Library analytics & metrics',
      category: 'analytics',
      badge: 'New'
    },
    {
      id: 'listening-patterns',
      title: 'Listening Patterns',
      icon: Activity,
      description: 'Listening habits analysis',
      category: 'analytics',
      badge: 'New'
    },
    {
      id: 'enhanced-trends',
      title: 'Listening Trends',
      icon: TrendingUp,
      description: 'Timeline insights',
      category: 'analytics'
    },
    {
      id: 'trends',
      title: 'Activity Details',
      icon: BarChart3,
      description: 'Detailed statistics',
      category: 'analytics'
    },
    {
      id: 'gamification',
      title: 'Music Journey',
      icon: Trophy,
      description: 'Achievements & progress',
      category: 'experience',
      badge: 'New'
    },
    {
      id: 'privacy',
      title: 'Privacy & Settings',
      icon: Settings,
      description: 'Privacy by design controls',
      category: 'settings'
    }
  ];

  const categories = [
    { id: 'main', title: 'Dashboard', icon: Home },
    { id: 'discovery', title: 'Music Discovery', icon: Sparkles },
    { id: 'analytics', title: 'Analytics', icon: BarChart3 },
    { id: 'experience', title: 'Experience', icon: Headphones },
    { id: 'settings', title: 'Settings', icon: Settings }
  ];

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.id] = navigationItems.filter(item => item.category === category.id);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
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
        <div className="py-4 space-y-6">
          {categories.map((category) => {
            const items = groupedItems[category.id];
            if (!items?.length) return null;

            const CategoryIcon = category.icon;
            
            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-1">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {category.title}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-auto p-3 text-left",
                          isActive && "bg-accent/10 border-l-2 border-accent"
                        )}
                        onClick={() => {
                          onViewChange(item.id);
                          if (window.innerWidth < 768) {
                            onToggle();
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Icon className={cn(
                            "h-4 w-4 flex-shrink-0",
                            isActive ? "text-accent" : "text-muted-foreground"
                          )} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-medium text-sm",
                                isActive ? "text-accent" : "text-foreground"
                              )}>
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </p>
                          </div>
                          {isActive && (
                            <ChevronRight className="h-3 w-3 text-accent flex-shrink-0" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Privacy First</span>
          </div>
          <p className="text-xs text-muted-foreground">
            All processing happens locally - your data never leaves your device!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-80 bg-card border-r border-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetContent 
          side="left" 
          className="p-0 w-80 bg-background border-r border-border"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};
