
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Headphones, Search, Users, Flame, Star } from 'lucide-react';

interface CategoryPreviewCardsProps {
  onCategoryClick: () => void;
}

export const CategoryPreviewCards = ({ onCategoryClick }: CategoryPreviewCardsProps) => {
  const categories = [
    { name: 'Listening', count: 25, icon: <Headphones className="h-5 w-5" />, color: 'bg-blue-500' },
    { name: 'Discovery', count: 30, icon: <Search className="h-5 w-5" />, color: 'bg-green-500' },
    { name: 'Social', count: 20, icon: <Users className="h-5 w-5" />, color: 'bg-purple-500' },
    { name: 'Streaks', count: 15, icon: <Flame className="h-5 w-5" />, color: 'bg-orange-500' },
    { name: 'Special', count: 15, icon: <Star className="h-5 w-5" />, color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.name} 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={onCategoryClick}
        >
          <CardContent className="p-4 text-center">
            <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center text-white mx-auto mb-2`}>
              {category.icon}
            </div>
            <h4 className="font-medium">{category.name}</h4>
            <p className="text-xs text-muted-foreground">{category.count} achievements</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
