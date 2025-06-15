
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, Settings, User, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  user: any;
  onMenuToggle: () => void;
}

export const Header = ({ user, onMenuToggle }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      // Force navigation to home after logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleHomeNavigation = () => {
    // If we're in dashboard context (not on index page), stay in dashboard
    if (location.pathname === '/' && user) {
      // Already in dashboard, just scroll to top or refresh view
      window.scrollTo(0, 0);
    } else {
      // Navigate to appropriate home
      navigate(user ? '/' : '/index');
    }
  };

  // Get user profile image with fallback handling
  const getUserProfileImage = () => {
    if (!user) return null;
    
    // Check for cached profile image first
    const cachedImage = localStorage.getItem('user_profile_image');
    if (cachedImage) {
      return cachedImage;
    }
    
    // Fallback to user.images if available
    return user.images?.[0]?.url || null;
  };

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
        
        <Button
          variant="ghost"
          onClick={handleHomeNavigation}
          className="flex items-center gap-3 text-left p-2"
        >
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">♪</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-foreground">
              Spotify Insights
            </h1>
          </div>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeNavigation}
          className="hidden sm:flex"
          title="Home"
        >
          <Home className="h-4 w-4" />
        </Button>
        
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage 
                  src={getUserProfileImage()} 
                  alt={user?.display_name || 'User'}
                />
                <AvatarFallback>
                  {user?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem className="flex items-center gap-2 cursor-default">
              <User className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{user?.display_name || 'User'}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.country ? `Country: ${user.country}` : 'Spotify User'}
                </span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-2" disabled>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 text-destructive cursor-pointer"
              onClick={handleLogout}
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
