
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  Music, 
  Users,
  Shield, 
  X,
  Menu
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ isOpen, onToggle, activeView, onViewChange }: SidebarProps) => {
  const isMobile = useIsMobile();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Dashboard home'
    },
    {
      id: 'trends',
      label: 'Listening Activity',
      icon: TrendingUp,
      description: 'Activity patterns'
    },
    {
      id: 'genres',
      label: 'Genre Analysis',
      icon: Music,
      description: 'Musical preferences'
    },
    {
      id: 'artists',
      label: 'Artist Exploration',
      icon: Users,
      description: 'Discover artists'
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      icon: Shield,
      description: 'Data controls'
    }
  ];

  const handleItemClick = (viewId: string) => {
    onViewChange(viewId);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "w-64 lg:w-72"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Spotify Analytics
            </h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      onClick={() => handleItemClick(item.id)}
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 text-left",
                        isActive
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "transition-all duration-200"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.label}</div>
                        <div className="text-xs opacity-70 truncate">
                          {item.description}
                        </div>
                      </div>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60 text-center">
              Privacy-first analytics
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
