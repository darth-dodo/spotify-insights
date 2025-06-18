import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, Settings, User, Home, Shield, HelpCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps {
  user: any;
  onMenuToggle: () => void;
  onSettingsClick?: () => void;
}

export const Header = ({ user, onMenuToggle, onSettingsClick }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleHomeNavigation = () => {
    if (user) {
      // Clear all React Query cache
      queryClient.clear();
      // Clear any stored tokens/data
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_user');
      localStorage.removeItem('spotify_token_expires_at');
      // Navigate to landing page and replace history
      navigate('/', { replace: true });
      // Force page reload to ensure clean state
      window.location.reload();
    } else {
      // If user is not logged in, go to landing page
      navigate('/', { replace: true });
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const getUserProfileImage = () => {
    if (!user) return null;
    
    const cachedImage = localStorage.getItem('user_profile_image');
    if (cachedImage) {
      return cachedImage;
    }
    
    return user.images?.[0]?.url || null;
  };

  // Get user's first name
  const getUserFirstName = () => {
    if (!user?.display_name) return 'User';
    return user.display_name.split(' ')[0];
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
          title={user ? "Go to Dashboard" : "Go to Homepage"}
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
                  {getUserFirstName().charAt(0).toUpperCase()}
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
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleSettingsClick}
            >
              <Shield className="h-4 w-4" />
              Data Privacy
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleSettingsClick}
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/help')}
            >
              <HelpCircle className="h-4 w-4" />
              Help & Security
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/legal')}
            >
              <FileText className="h-4 w-4" />
              TOS
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
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
