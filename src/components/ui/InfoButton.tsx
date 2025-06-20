import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InfoModal } from './InfoModal';

interface InfoButtonProps {
  title: string;
  description: string;
  calculation?: string;
  funFacts?: string[];
  dataSource?: 'api' | 'real-time' | 'calculated' | 'estimated';
  confidence?: 'high' | 'medium' | 'low';
  metrics?: { label: string; value: string; description: string }[];
  className?: string;
  variant?: 'tooltip' | 'modal';
}

export const InfoButton = ({ 
  title, 
  description, 
  calculation, 
  funFacts = [],
  dataSource = 'calculated',
  confidence = 'medium',
  metrics = [],
  className,
  variant = 'modal' 
}: InfoButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'modal') {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent/20 transition-colors", className)}
          onClick={() => setIsModalOpen(true)}
        >
          <Info className="h-4 w-4" />
        </Button>
        
        <InfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          description={description}
          calculation={calculation}
          funFacts={funFacts}
          metrics={metrics}
          dataSource={dataSource}
          confidence={confidence}
        />
      </>
    );
  }

  // Fallback to tooltip for simple cases
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
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
