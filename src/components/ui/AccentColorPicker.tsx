
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { Palette } from 'lucide-react';

const accentColors = [
  { id: 'spotify', name: 'Spotify Green', color: '#1DB954' },
  { id: 'blue', name: 'Ocean Blue', color: '#3B82F6' },
  { id: 'purple', name: 'Royal Purple', color: '#8B5CF6' },
  { id: 'pink', name: 'Vibrant Pink', color: '#EC4899' },
  { id: 'orange', name: 'Sunset Orange', color: '#F59E0B' },
] as const;

export const AccentColorPicker = () => {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Choose accent color</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {accentColors.map((color) => (
          <DropdownMenuItem
            key={color.id}
            onClick={() => setAccentColor(color.id)}
            className="flex items-center gap-3"
          >
            <div 
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: color.color }}
            />
            <span className="flex-1">{color.name}</span>
            {accentColor === color.id && (
              <div className="w-2 h-2 bg-current rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
