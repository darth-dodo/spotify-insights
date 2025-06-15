
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Database, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalmingLoaderProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'fullscreen';
}

export const CalmingLoader = ({ 
  title = "Loading your music data...",
  description = "Please wait while we analyze your listening patterns",
  className,
  variant = 'card'
}: CalmingLoaderProps) => {
  const LoaderContent = () => (
    <div className="space-y-6">
      {/* Animated music notes */}
      <div className="flex items-center justify-center space-x-2">
        <div className="flex space-x-1">
          <Music className="h-6 w-6 text-accent animate-bounce" style={{ animationDelay: '0ms' }} />
          <Database className="h-5 w-5 text-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <TrendingUp className="h-5 w-5 text-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Pulsing progress indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-accent/30 rounded-full animate-pulse"
              style={{ 
                animationDelay: `${i * 100}ms`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Text content */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Subtle breathing animation */}
      <div className="flex justify-center">
        <div className="w-16 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 rounded-full animate-pulse" />
      </div>
    </div>
  );

  if (variant === 'fullscreen') {
    return (
      <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
        <LoaderContent />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("py-12", className)}>
        <LoaderContent />
      </div>
    );
  }

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardContent className="p-8">
        <LoaderContent />
      </CardContent>
    </Card>
  );
};
