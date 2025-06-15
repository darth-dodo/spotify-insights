
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { Palette, Check } from 'lucide-react';

const accentColors = [
  { id: 'spotify', name: 'Spotify Green', color: 'hsl(142, 69%, 58%)' },
  { id: 'blue', name: 'Ocean Blue', color: 'hsl(221, 83%, 53%)' },
  { id: 'purple', name: 'Royal Purple', color: 'hsl(262, 83%, 58%)' },
  { id: 'pink', name: 'Vibrant Pink', color: 'hsl(330, 81%, 60%)' },
  { id: 'orange', name: 'Sunset Orange', color: 'hsl(25, 95%, 53%)' },
] as const;

export const AccentColorPicker = () => {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="capitalize">{accentColors.find(c => c.id === accentColor)?.name || 'Choose Color'}</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {accentColors.map((color) => (
          <DropdownMenuItem
            key={color.id}
            onClick={() => setAccentColor(color.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div 
              className="w-4 h-4 rounded-full border-2 border-border"
              style={{ backgroundColor: color.color }}
            />
            <span className="flex-1">{color.name}</span>
            {accentColor === color.id && (
              <Check className="w-4 h-4 text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
