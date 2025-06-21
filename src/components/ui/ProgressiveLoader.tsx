import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Music, Users, Clock, Database, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedTime: number; // in seconds
}

interface ProgressiveLoaderProps {
  steps: LoadingStep[];
  currentStep: number;
  progress: number;
  onComplete?: () => void;
  className?: string;
}

export const ProgressiveLoader = ({
  steps,
  currentStep,
  progress,
  onComplete,
  className
}: ProgressiveLoaderProps) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Mark steps as completed based on progress
  useEffect(() => {
    const newCompleted = new Set<number>();
    steps.forEach((_, index) => {
      if (index < currentStep || (index === currentStep && progress >= 100)) {
        newCompleted.add(index);
      }
    });
    setCompletedSteps(newCompleted);

    // Call onComplete when all steps are done
    if (newCompleted.size === steps.length && onComplete) {
      onComplete();
    }
  }, [currentStep, progress, steps.length, onComplete]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  const getStepStatus = (index: number) => {
    if (completedSteps.has(index)) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getCurrentStepProgress = () => {
    if (currentStep >= steps.length) return 100;
    return progress;
  };

  const getOverallProgress = () => {
    const baseProgress = (currentStep / steps.length) * 100;
    const currentStepContribution = (progress / steps.length);
    return Math.min(100, baseProgress + currentStepContribution);
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Database className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold">Loading Your Music Data</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Analyzing your Spotify library for insights
          </p>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">
              {Math.round(getOverallProgress())}%
            </span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Elapsed: {formatTime(elapsedTime)}</span>
            <span>
              Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
            </span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const status = getStepStatus(index);
            const isActive = index === currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300",
                  status === 'completed' && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
                  status === 'active' && "bg-primary/5 border-primary/20 shadow-sm",
                  status === 'pending' && "bg-muted/30 border-muted"
                )}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : status === 'active' ? (
                    <div className="relative">
                      <Circle className="h-5 w-5 text-primary" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                {/* Step Icon */}
                <div className={cn(
                  "flex-shrink-0 p-1.5 rounded-md",
                  status === 'completed' && "bg-green-100 dark:bg-green-900",
                  status === 'active' && "bg-primary/10",
                  status === 'pending' && "bg-muted"
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    status === 'completed' && "text-green-600",
                    status === 'active' && "text-primary",
                    status === 'pending' && "text-muted-foreground"
                  )} />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "text-sm font-medium truncate",
                      status === 'completed' && "text-green-700 dark:text-green-300",
                      status === 'active' && "text-primary",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {step.title}
                    </h4>
                    {status === 'active' && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {Math.round(getCurrentStepProgress())}%
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs truncate",
                    status === 'completed' && "text-green-600 dark:text-green-400",
                    status === 'active' && "text-primary/70",
                    status === 'pending' && "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>

                {/* Step Progress Bar (only for active step) */}
                {isActive && (
                  <div className="flex-shrink-0 w-16">
                    <Progress 
                      value={getCurrentStepProgress()} 
                      className="h-1.5" 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fun Facts or Tips */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">Did you know?</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {currentStep < steps.length 
              ? `We're fetching up to 2000 tracks for comprehensive analysis. This gives you the most detailed insights into your music taste!`
              : `Your music data has been successfully loaded and is ready for analysis!`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Predefined loading steps for Spotify data
export const spotifyLoadingSteps: LoadingStep[] = [
  {
    id: 'profile',
    title: 'Loading Profile',
    description: 'Fetching your Spotify profile information',
    icon: Users,
    estimatedTime: 2
  },
  {
    id: 'tracks',
    title: 'Analyzing Tracks',
    description: 'Getting your top tracks and favorites',
    icon: Music,
    estimatedTime: 5
  },
  {
    id: 'artists',
    title: 'Discovering Artists',
    description: 'Loading your favorite artists and genres',
    icon: Users,
    estimatedTime: 4
  },
  {
    id: 'recent',
    title: 'Recent Activity',
    description: 'Analyzing your recent listening history',
    icon: Clock,
    estimatedTime: 3
  }
]; 