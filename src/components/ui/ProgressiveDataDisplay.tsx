import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, Target, Zap, Calculator, Info, ArrowUp } from 'lucide-react';
import { DataQualityBadge } from '@/components/ui/DataQualityBadge';
import type { DataQualityMetrics } from '@/lib/enhanced-data-collection';

interface ProgressiveDataDisplayProps {
  metric: {
    label: string;
    value: string | number;
    previousValue?: string | number;
    improvement?: number; // Percentage improvement
  };
  historicalData: Array<{
    source: 'api' | 'estimated' | 'calculated' | 'real-time';
    timestamp: Date;
    value: number;
    confidence: 'high' | 'medium' | 'low';
  }>;
  showTrend?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressiveDataDisplay: React.FC<ProgressiveDataDisplayProps> = ({
  metric,
  historicalData,
  showTrend = true,
  size = 'md'
}) => {
  const [dataQuality, setDataQuality] = useState<'high' | 'medium' | 'estimated'>('estimated');
  const [confidence, setConfidence] = useState(0.3);
  const [showImprovement, setShowImprovement] = useState(false);

  useEffect(() => {
    // Calculate data quality based on historical data
    const realDataPoints = historicalData.filter(d => 
      d.source === 'real-time' || d.source === 'api'
    ).length;
    
    const calculatedPoints = historicalData.filter(d => 
      d.source === 'calculated'
    ).length;
    
    const totalPoints = historicalData.length;
    
    // Calculate confidence score
    const realDataWeight = realDataPoints * 0.5;
    const calculatedWeight = calculatedPoints * 0.3;
    const baseConfidence = 0.2;
    
    const newConfidence = Math.min(0.95, baseConfidence + 
      (realDataWeight / Math.max(1, totalPoints)) + 
      (calculatedWeight / Math.max(1, totalPoints))
    );
    
    setConfidence(newConfidence);
    
    // Determine quality level
    if (newConfidence > 0.8) {
      setDataQuality('high');
    } else if (newConfidence > 0.5) {
      setDataQuality('medium');
    } else {
      setDataQuality('estimated');
    }

    // Show improvement animation if there's a significant improvement
    if (metric.improvement && metric.improvement > 10) {
      setShowImprovement(true);
      const timer = setTimeout(() => setShowImprovement(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [historicalData, metric.improvement]);

  const getLatestDataQuality = (): DataQualityMetrics => {
    const latest = historicalData[historicalData.length - 1];
    return {
      source: latest?.source || 'estimated',
      confidence: latest?.confidence || 'low',
      lastUpdated: latest?.timestamp || new Date(),
      sampleSize: historicalData.length
    };
  };

  const getConfidenceColor = () => {
    if (confidence > 0.8) return 'text-green-600';
    if (confidence > 0.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressColor = () => {
    if (confidence > 0.8) return 'bg-green-500';
    if (confidence > 0.5) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const getTrendIcon = () => {
    if (!metric.improvement) return null;
    
    if (metric.improvement > 0) {
      return <ArrowUp className="w-3 h-3 text-green-500" />;
    }
    return null;
  };

  const cardSize = size === 'sm' ? 'p-3' : size === 'lg' ? 'p-6' : 'p-4';
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
  const valueSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <Card className={`transition-all duration-500 ${showImprovement ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}>
      <CardContent className={cardSize}>
        <div className="space-y-3">
          {/* Header with label and data quality badge */}
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${textSize}`}>{metric.label}</h3>
            <DataQualityBadge 
              quality={getLatestDataQuality()} 
              size={size === 'lg' ? 'md' : 'sm'}
            />
          </div>

          {/* Main value with trend indicator */}
          <div className="flex items-center gap-2">
            <span className={`font-bold ${valueSize}`}>
              {formatValue(metric.value)}
            </span>
            {showTrend && getTrendIcon()}
            {showTrend && metric.improvement && (
              <Badge 
                variant="secondary" 
                className="text-xs animate-pulse"
              >
                +{metric.improvement}%
              </Badge>
            )}
          </div>

          {/* Data confidence progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                Data Confidence
              </span>
              <span className={getConfidenceColor()}>
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <Progress 
              value={confidence * 100} 
              className="h-2"
              style={{
                background: 'var(--muted)',
              }}
            />
          </div>

          {/* Additional context */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center justify-between">
              <span>Data points collected:</span>
              <span className="font-medium">{historicalData.length}</span>
            </div>
            {metric.previousValue && (
              <div className="flex items-center justify-between">
                <span>Previous value:</span>
                <span>{formatValue(metric.previousValue)}</span>
              </div>
            )}
            {confidence < 0.5 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-orange-600 cursor-help">
                      ⚠️ Estimates will improve as you use the app
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-medium mb-1">Improving Data Quality</p>
                      <p className="text-sm">
                        As you listen to music and interact with the app, we'll collect 
                        more real data to replace estimates with accurate measurements.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 