
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { Palette, Check } from 'lucide-react';

const accentColors = [
  { id: 'spotify', name: 'Spotify Green', lightColor: '#77C98E', darkColor: '#1DB954' },
  { id: 'blue', name: 'Ocean Blue', lightColor: '#93C5FD', darkColor: '#3B82F6' },
  { id: 'purple', name: 'Royal Purple', lightColor: '#C4B5FD', darkColor: '#8B5CF6' },
  { id: 'pink', name: 'Vibrant Pink', lightColor: '#FBB6CE', darkColor: '#EC4899' },
  { id: 'orange', name: 'Sunset Orange', lightColor: '#FED7AA', darkColor: '#F59E0B' },
] as const;

export const AccentColorPicker = () => {
  const { accentColor, setAccentColor, theme } = useTheme();

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
              style={{ 
                backgroundColor: theme === 'dark' ? color.darkColor : color.lightColor 
              }}
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
