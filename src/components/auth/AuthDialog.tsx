
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  showLoginButton?: boolean;
}

export const AuthDialog = ({ 
  open, 
  onOpenChange, 
  title = "Authentication Required",
  message = "Please connect your Spotify account to continue.",
  showLoginButton = true 
}: AuthDialogProps) => {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
      onOpenChange(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {message}
          </DialogDescription>
        </DialogHeader>
        {showLoginButton && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogin} disabled={isLoading}>
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? 'Connecting...' : 'Connect Spotify'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
