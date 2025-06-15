
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const BlurLoader = ({ isLoading, children, className }: BlurLoaderProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 backdrop-blur-sm bg-background/20 flex items-center justify-center z-10 animate-fade-in">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-accent rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
