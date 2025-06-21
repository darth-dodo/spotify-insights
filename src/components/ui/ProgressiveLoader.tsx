import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Music, Users, Clock, Database, Sparkles, Zap, TrendingUp, Heart, Star, Headphones, Disc } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedTime: number; // in seconds
  funFact?: string;
  color?: string;
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
  const [showFunFact, setShowFunFact] = useState(true);
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);

  // Engaging fun facts to keep users interested
  const funFacts = [
    "🎵 Analyzing up to 2000 tracks from your library.",
    "🔍 Identifying listening trends in your music history.",
    "⚡ Processing data – this usually takes about 20 seconds.",
    "🎨 Compiling your musical profile with key statistics.",
    "🌟 Listeners discover around five new songs each month on average.",
    "🎧 Checking audio features such as energy and tempo.",
    "📊 Preparing summary charts for your dashboard.",
    "📅 Comparing data across recent and long-term listening.",
    "🚀 Almost finished – setting up final dashboard elements.",
    "✅ Loading complete – thanks for your patience."
  ];

  // Update elapsed time and rotate fun facts
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
      
      // Rotate fun facts every 4 seconds
      if (Math.floor((Date.now() - startTime) / 1000) % 4 === 0) {
        setCurrentFunFactIndex(prev => (prev + 1) % funFacts.length);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, funFacts.length]);

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
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const getEstimatedTimeRemaining = () => {
    const remainingSteps = steps.slice(currentStep);
    const estimatedSeconds = remainingSteps.reduce((acc, step) => acc + step.estimatedTime, 0);
    const progressFactor = currentStep < steps.length ? (1 - progress / 100) : 0;
    const currentStepTime = currentStep < steps.length ? steps[currentStep].estimatedTime * progressFactor : 0;
    
    return Math.max(0, estimatedSeconds - steps[currentStep]?.estimatedTime + currentStepTime);
  };

  const getMotivationalMessage = () => {
    const progressPercent = getOverallProgress();
    if (progressPercent < 25) {
      return "Starting analysis…";
    } else if (progressPercent < 50) {
      return "Processing data…";
    } else if (progressPercent < 75) {
      return "More than halfway there…";
    } else if (progressPercent < 95) {
      return "Wrapping up…";
    } else {
      return "Complete. Loading dashboard…";
    }
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
    <Card className={cn("w-full max-w-lg mx-auto shadow-lg", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                <Database className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Loading Your Music Universe
              </h3>
              <p className="text-sm text-muted-foreground">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-base">Overall Progress</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                {Math.round(getOverallProgress())}%
              </Badge>
              <Zap className="h-4 w-4 text-accent animate-pulse" />
            </div>
          </div>
          <div className="relative">
            <Progress value={getOverallProgress()} className="h-3 bg-muted/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-50" />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Elapsed: {formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>~{Math.round(getEstimatedTimeRemaining())}s remaining</span>
            </div>
          </div>
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
            </Badge>
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

        {/* Engaging Fun Facts */}
        <div className="pt-4 border-t border-border/50">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1 bg-accent/20 rounded-full">
                <Sparkles className="h-4 w-4 text-accent animate-spin" />
              </div>
              <span className="text-sm font-semibold text-accent">Keep You Entertained</span>
            </div>
            <div className="min-h-[3rem] flex items-center">
              <p className="text-sm text-foreground/80 leading-relaxed animate-fade-in-up">
                {funFacts[currentFunFactIndex]}
              </p>
            </div>
            <div className="flex justify-center mt-3">
              <div className="flex gap-1">
                {funFacts.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      index === currentFunFactIndex 
                        ? "bg-accent scale-125" 
                        : "bg-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Predefined loading steps for Spotify data
export const spotifyLoadingSteps: LoadingStep[] = [
  {
    id: 'profile',
    title: 'Connecting Profile',
    description: 'Authenticating and loading your Spotify profile',
    icon: Users,
    estimatedTime: 3,
    funFact: "Setting up your personalized music universe!",
    color: "text-blue-500"
  },
  {
    id: 'tracks',
    title: 'Analyzing Music Library',
    description: 'Fetching up to 2000 of your top tracks for comprehensive analysis',
    icon: Music,
    estimatedTime: 8,
    funFact: "Discovering patterns in your musical preferences!",
    color: "text-green-500"
  },
  {
    id: 'artists',
    title: 'Mapping Artist Universe',
    description: 'Loading artists, genres, and musical relationships',
    icon: Star,
    estimatedTime: 5,
    funFact: "Building your artist constellation map!",
    color: "text-purple-500"
  },
  {
    id: 'recent',
    title: 'Processing Activity',
    description: 'Calculating listening patterns, genre diversity, and personalized insights',
    icon: TrendingUp,
    estimatedTime: 4,
    funFact: "Finalizing your musical insights dashboard!",
    color: "text-orange-500"
  }
]; 