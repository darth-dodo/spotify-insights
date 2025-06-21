import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"
import React from "react"

interface EnhancedSkeletonProps {
  className?: string;
  variant?: 'card' | 'stat' | 'chart' | 'list' | 'avatar' | 'text';
  animated?: boolean;
  pulse?: boolean;
}

export function EnhancedSkeleton({
  className,
  variant = 'card',
  animated = true,
  pulse = true,
  ...props
}: EnhancedSkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'stat':
        return "h-24 w-full rounded-lg";
      case 'chart':
        return "h-64 w-full rounded-lg";
      case 'list':
        return "h-16 w-full rounded-md";
      case 'avatar':
        return "h-10 w-10 rounded-full";
      case 'text':
        return "h-4 w-3/4 rounded";
      default:
        return "h-32 w-full rounded-lg";
    }
  };

  const animationClasses = animated 
    ? "animate-pulse" 
    : "";

  const pulseClasses = pulse && animated 
    ? "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer" 
    : "bg-muted";

  return (
    <div
      className={cn(
        getVariantClasses(),
        pulseClasses,
        animationClasses,
        className
      )}
      {...props}
    />
  )
}

// Predefined skeleton layouts for common use cases
export function StatsSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-3 md:p-4 space-y-2">
          <div className="flex items-center gap-2">
            <EnhancedSkeleton variant="avatar" className="h-5 w-5" />
            <EnhancedSkeleton variant="text" className="h-3 w-16" />
          </div>
          <EnhancedSkeleton variant="text" className="h-6 w-12" />
          <EnhancedSkeleton variant="text" className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <EnhancedSkeleton variant="text" className="h-6 w-32" />
        <EnhancedSkeleton variant="text" className="h-4 w-24" />
      </div>
      <EnhancedSkeleton variant="chart" />
    </div>
  );
}

export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <EnhancedSkeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <EnhancedSkeleton variant="text" className="h-4 w-3/4" />
            <EnhancedSkeleton variant="text" className="h-3 w-1/2" />
          </div>
          <EnhancedSkeleton variant="text" className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
} 