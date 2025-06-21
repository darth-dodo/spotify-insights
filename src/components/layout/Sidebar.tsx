import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { 
  Home, 
  TrendingUp, 
  Music, 
  Users, 
  Trophy,
  Settings,
  ArrowLeft,
  X,
  Heart,
  Sparkles,
  BarChart3,
  Gamepad2,
  Info,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { clearLocalUserData } from '@/lib/clear-user-data';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ isOpen, onToggle, activeView, onViewChange }: SidebarProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleBackNavigation = () => {
    // Clear caches and local data
    queryClient.clear();
    clearLocalUserData();
    // Navigate back to landing page and replace history
    navigate('/', { replace: true });
    // Force page reload to ensure clean state
    window.location.reload();
  };

  const handleNavigation = (item: any) => {
    if (item.link) {
      navigate(item.link);
    } else {
      onViewChange(item.id);
    }

    // Close mobile sidebar on mobile
    if (window.innerWidth < 1024) onToggle();
  };

  // Organized navigation sections
  const navigationSections = [
    {
      id: 'discovery',
      title: 'Discovery',
      icon: Sparkles,
      items: [
        {
          id: 'overview',
          title: 'Overview',
          icon: Home,
          primary: true
        },
        {
          id: 'tracks',
          title: 'Track Explorer',
          icon: Music
        },
        {
          id: 'artists',
          title: 'Artist Explorer',
          icon: Users
        },
        {
          id: 'genres',
          title: 'Genre Analysis',
          icon: Music
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      items: [
        {
          id: 'listening-activity',
          title: 'Listening Activity',
          icon: TrendingUp
        },
        {
          id: 'library-health',
          title: 'Library Health',
          icon: Heart
        }
      ]
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: Gamepad2,
      items: [
        {
          id: 'gamification',
          title: 'Achievements',
          icon: Trophy
        },
        {
          id: 'privacy',
          title: 'Settings',
          icon: Settings
        }
      ]
    },
    {
      id: 'info',
      title: 'Info',
      icon: Info,
      items: [
        {
          id: 'data-quality',
          title: 'Data Quality',
          icon: Shield,
          link: '/data-quality'
        },
        {
          id: 'data-privacy',
          title: 'Data Privacy',
          icon: Shield,
          link: '/help'
        },
        {
          id: 'calculations',
          title: 'Calculations Explained',
          icon: BarChart3,
          link: '/calculations'
        }
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <Button
          variant="ghost"
          onClick={handleBackNavigation}
          className="w-full justify-start p-3 h-auto hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-3 text-muted-foreground" />
          <div className="text-left">
            <div className="font-medium text-sm">Back to Home</div>
            <div className="text-xs text-muted-foreground">Exit dashboard</div>
          </div>
        </Button>
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {navigationSections.map((section) => {
            const SectionIcon = section.icon;
            
            return (
              <div key={section.id} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center gap-2 px-2">
                  <SectionIcon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {section.title}
                  </span>
                </div>
                
                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    
                    return (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start p-3 h-auto transition-all duration-200",
                          "hover:bg-muted/50 hover:translate-x-1 group",
                          isActive && [
                            "bg-primary/10 text-primary border-r-2 border-primary",
                            "hover:bg-primary/15 shadow-sm animate-scaleIn"
                          ],
                          item.primary && !isActive && "font-medium"
                        )}
                        onClick={() => handleNavigation(item)}
                      >
                        <Icon className={cn(
                          "h-4 w-4 mr-3 transition-all duration-200 group-hover:scale-110",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "text-sm transition-colors",
                          isActive ? "text-primary font-medium" : "text-foreground"
                        )}>
                          {item.title}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-3 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacy First</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All data processing happens locally on your device. Your music data never leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 border-r border-border/50 bg-card/50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onToggle}>
        <SheetContent 
          side="left" 
          className="p-0 w-72 border-r border-border/50"
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100vh-73px)]">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
