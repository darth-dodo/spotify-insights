import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalLoadingScreenProps {
  message?: string;
  className?: string;
}

/**
 * A lightweight, distraction-free loading screen used exclusively during the
 * OAuth hand-shake (CallbackPage) and other ultra-short loading moments.
 */
const MinimalLoadingScreen: React.FC<MinimalLoadingScreenProps> = ({
  message = 'Connecting your account…',
  className,
}) => (
  <div
    className={cn(
      'min-h-screen bg-background flex flex-col items-center justify-center p-6',
      className,
    )}
  >
    <Loader2 className="h-8 w-8 animate-spin text-accent" />
    <p className="mt-4 text-sm text-muted-foreground">{message}</p>
  </div>
);

export default MinimalLoadingScreen; 