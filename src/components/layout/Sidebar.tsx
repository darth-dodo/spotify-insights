
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  Music, 
  Shield, 
  Home,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    description: 'Dashboard summary'
  },
  {
    id: 'trends',
    label: 'Listening Trends',
    icon: TrendingUp,
    description: 'Time-based analysis'
  },
  {
    id: 'genres',
    label: 'Genre Analysis',
    icon: Music,
    description: 'Music preferences'
  },
  {
    id: 'privacy',
    label: 'Privacy Controls',
    icon: Shield,
    description: 'Data management'
  }
];

export const Sidebar = ({ isOpen, onToggle, activeView, onViewChange }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold">Navigation</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-4 rounded-xl",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onViewChange(item.id);
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </nav>
            
            <div className="mt-8 p-4 bg-muted/50 rounded-xl">
              <h3 className="font-medium text-sm mb-2">Quick Stats</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Songs analyzed</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>Artists discovered</span>
                  <span className="font-medium">456</span>
                </div>
                <div className="flex justify-between">
                  <span>Hours listened</span>
                  <span className="font-medium">789</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
};
