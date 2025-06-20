import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Target, Zap, Calculator, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { DataQualityMetrics } from '@/lib/enhanced-data-collection';

interface DataQualityBadgeProps {
  quality: DataQualityMetrics;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({ 
  quality, 
  showProgress = false, 
  size = 'md' 
}) => {
  const getSourceIcon = () => {
    switch (quality.source) {
      case 'api':
        return <Target className="w-3 h-3" />;
      case 'real-time':
        return <Zap className="w-3 h-3" />;
      case 'calculated':
        return null;
      case 'estimated':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return <TrendingUp className="w-3 h-3" />;
    }
  };

  const getConfidenceIcon = () => {
    switch (quality.confidence) {
      case 'high':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'medium':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      default:
        return <AlertTriangle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getSourceLabel = () => {
    switch (quality.source) {
      case 'api':
        return '🎯 API Data';
      case 'real-time':
        return '⚡ Live Data';
      case 'calculated':
        return '📊 Calculated';
      case 'estimated':
        return '📈 Estimated';
      default:
        return '📈 Estimated';
    }
  };

  const getConfidenceScore = () => {
    switch (quality.confidence) {
      case 'high':
        return 90;
      case 'medium':
        return 65;
      case 'low':
        return 35;
      default:
        return 20;
    }
  };

  const getVariant = () => {
    if (quality.source === 'api' || quality.source === 'real-time') {
      return 'default';
    }
    if (quality.confidence === 'high') {
      return 'secondary';
    }
    return 'outline';
  };

  const getTooltipContent = () => {
    const timeSince = quality.lastUpdated 
      ? Math.floor((Date.now() - quality.lastUpdated.getTime()) / 1000 / 60)
      : 0;
    
    return (
      <div className="space-y-2">
        <div className="font-medium">Data Quality Details</div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span>Source:</span>
            <span className="flex items-center gap-1">
              {getSourceIcon() && getSourceIcon()}
              {quality.source}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Confidence:</span>
            <span className="flex items-center gap-1">
              {getConfidenceIcon()}
              {quality.confidence}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Sample Size:</span>
            <span>{quality.sampleSize}</span>
          </div>
          {quality.lastUpdated && (
            <div className="flex items-center justify-between">
              <span>Updated:</span>
              <span>{timeSince < 1 ? 'Just now' : `${timeSince}m ago`}</span>
            </div>
          )}
        </div>
        {showProgress && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Confidence Score</span>
              <span>{getConfidenceScore()}%</span>
            </div>
            <Progress value={getConfidenceScore()} className="h-1" />
          </div>
        )}
      </div>
    );
  };

  const badgeSize = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 
                   size === 'lg' ? 'text-sm px-3 py-1' : 
                   'text-xs px-2 py-1';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getVariant()} 
            className={`${badgeSize} flex items-center gap-1 cursor-help`}
          >
            {getSourceIcon() && getSourceIcon()}
            <span>{getSourceLabel()}</span>
            {quality.confidence === 'high' && quality.source !== 'estimated' && (
              <CheckCircle className="w-2.5 h-2.5 text-green-500" />
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};