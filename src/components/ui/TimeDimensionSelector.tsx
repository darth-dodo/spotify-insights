import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeDimension } from '@/lib/spotify-data-utils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeDimensionSelectorProps {
  value: TimeDimension;
  onChange: (value: TimeDimension) => void;
  className?: string;
}

const timeDimensionLabels: Record<TimeDimension, string> = {
  '1week': 'Last Week',
  '1month': 'Last Month',
  '3months': 'Last Three Months',
  '6months': 'Last Six Months',
  '1year': 'Last Year',
  '2years': 'Last Two Years',
  'alltime': 'All Time'
};

const timeDimensionDescriptions: Record<TimeDimension, string> = {
  '1week': 'View data from the past 7 days',
  '1month': 'View data from the past 30 days',
  '3months': 'View data from the past 90 days',
  '6months': 'View data from the past 180 days',
  '1year': 'View data from the past 365 days',
  '2years': 'View data from the past 2 years',
  'alltime': 'View all available data since account creation'
};

export function TimeDimensionSelector({ value, onChange, className }: TimeDimensionSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(timeDimensionLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{timeDimensionDescriptions[value]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 