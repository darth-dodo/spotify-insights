import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AccentColorPicker } from '@/components/ui/AccentColorPicker';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, Settings, User } from 'lucide-react';

interface HeaderProps {
  user: any;
  onMenuToggle: () => void;
}

export const Header = ({ user, onMenuToggle }: HeaderProps) => {
  const { logout } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">♪</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Spotify Insights
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AccentColorPicker />
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage 
                  src={user.images?.[0]?.url} 
                  alt={user.display_name}
                />
                <AvatarFallback>
                  {user.display_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{user.display_name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
