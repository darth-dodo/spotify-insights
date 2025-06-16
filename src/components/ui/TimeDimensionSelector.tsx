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
  week: 'Last Week',
  month: 'Last Month',
  three_months: 'Last 3 Months',
  six_months: 'Last 6 Months',
  year: 'Last Year',
  all_time: 'All Time'
};

const timeDimensionDescriptions: Record<TimeDimension, string> = {
  week: 'View data from the past 7 days',
  month: 'View data from the past 30 days',
  three_months: 'View data from the past 90 days',
  six_months: 'View data from the past 180 days',
  year: 'View data from the past 365 days',
  all_time: 'View all available data since 2000'
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