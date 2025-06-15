
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FunFact } from './types';

interface FunFactCardProps {
  fact: FunFact;
}

export const FunFactCard = ({ fact }: FunFactCardProps) => {
  const IconComponent = fact.icon;
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-full bg-muted ${fact.color}`}>
            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base">{fact.title}</h3>
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {fact.fact}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {fact.detail}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
