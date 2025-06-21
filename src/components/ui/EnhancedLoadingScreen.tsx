import React, { useState, useEffect } from 'react';
import { ProgressiveLoader, spotifyLoadingSteps } from './ProgressiveLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Headphones, Coffee, Clock, Users, Sparkles, Heart, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedLoadingScreenProps {
  currentStep: number;
  progress: number;
  onComplete?: () => void;
  className?: string;
  showTips?: boolean;
}

export const EnhancedLoadingScreen = ({
  currentStep,
  progress,
  onComplete,
  className,
  showTips = true
}: EnhancedLoadingScreenProps) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Engaging tips to keep users interested
  const engagementTips = [
    {
      icon: Headphones,
      title: "Processing",
      message: "Analyzing your listening habits",
      color: "text-blue-500"
    },
    {
      icon: Sparkles,
      title: "Features",
      message: "Analyzing audio features and mood preferences",
      color: "text-purple-500"
    },
    {
      icon: Heart,
      title: "Privacy",
      message: "All processing happens locally on your device",
      color: "text-red-500"
    },
    {
      icon: Music,
      title: "Stats",
      message: "Building your personalized music statistics",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Insights",
      message: "Preparing your music insights dashboard",
      color: "text-orange-500"
    }
  ];

  // Rotate tips every 6 seconds
  useEffect(() => {
    if (!showTips) return;
    
    const timer = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % engagementTips.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [showTips, engagementTips.length]);

  const getLoadingPhaseMessage = () => {
    if (currentStep === 0) return "Connecting...";
    if (currentStep === 1) return "Loading tracks...";
    if (currentStep === 2) return "Loading artists...";
    if (currentStep === 3) return "Finalizing...";
    return "Loading...";
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4",
      className
    )}>
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Loading Component */}
        <ProgressiveLoader
          steps={spotifyLoadingSteps}
          currentStep={currentStep}
          progress={progress}
          onComplete={onComplete}
          className="mb-6"
        />

        {/* Engagement Tips */}
        {showTips && (
          <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/20 rounded-full flex-shrink-0">
                  {React.createElement(engagementTips[currentTipIndex].icon, {
                    className: `h-5 w-5 ${engagementTips[currentTipIndex].color}`
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {engagementTips[currentTipIndex].title}
                    </Badge>
                    <div className="flex gap-1">
                      {engagementTips.map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "w-1 h-1 rounded-full transition-all duration-300",
                            index === currentTipIndex ? "bg-accent" : "bg-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed animate-fade-in-up">
                    {engagementTips[currentTipIndex].message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Phase Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {getLoadingPhaseMessage()}
            </span>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">2000+</div>
            <div className="text-xs text-muted-foreground">Tracks Analyzed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent">20s</div>
            <div className="text-xs text-muted-foreground">Avg Load Time</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-500">100%</div>
            <div className="text-xs text-muted-foreground">Privacy Safe</div>
          </div>
        </div>

        {/* Optional: Emergency Exit */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground mb-2">
            Taking longer than expected?
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}; 