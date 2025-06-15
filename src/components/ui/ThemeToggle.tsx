
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full transition-all duration-200 ease-in-out hover:scale-105"
    >
      <div className="relative">
        {theme === 'light' ? (
          <Moon className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-200" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
