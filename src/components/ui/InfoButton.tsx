
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoButtonProps {
  title: string;
  description: string;
  calculation?: string;
  className?: string;
  variant?: 'tooltip' | 'popover';
}

export const InfoButton = ({ 
  title, 
  description, 
  calculation, 
  className,
  variant = 'tooltip' 
}: InfoButtonProps) => {
  const content = (
    <div className="space-y-2 max-w-sm">
      <h4 className="font-medium text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      {calculation && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Calculation:</span> {calculation}
          </p>
        </div>
      )}
    </div>
  );

  if (variant === 'popover') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors", className)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" side="top">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors", className)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side="top">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
