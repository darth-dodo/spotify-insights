
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'spotify' | 'blue' | 'purple' | 'pink' | 'orange';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeState = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('accentColor') as AccentColor;
      if (stored) return stored;
    }
    return 'spotify';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Add transition class temporarily for smooth theme changes
    document.documentElement.classList.add('theme-transition');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Remove transition class after transition completes
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
  };
};

export { ThemeContext };
