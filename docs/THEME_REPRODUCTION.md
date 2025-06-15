
# How to Reproduce the Spotify-Inspired Design

## Overview
This guide provides step-by-step instructions for reproducing the Spotify-inspired design system in any React/Tailwind CSS project.

## Prerequisites
- React 18+
- Tailwind CSS 3+
- TypeScript (recommended)

## Step 1: Install Required Dependencies

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## Step 2: Create the Theme Hook

Create `src/hooks/useTheme.ts`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'spotify' | 'blue' | 'purple' | 'pink' | 'orange';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
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
      const stored = localStorage.getItem('accent-color') as AccentColor;
      return stored || 'spotify';
    }
    return 'spotify';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accent-color', accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    accentColor,
    setTheme,
    setAccentColor,
    toggleTheme,
  };
};

export { ThemeContext };
```

## Step 3: Create the Theme Provider

Create `src/components/providers/ThemeProvider.tsx`:

```typescript
import React from 'react';
import { ThemeContext, useThemeState } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeState = useThemeState();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Step 4: Set Up CSS Custom Properties

Add to your main CSS file (usually `src/index.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light theme base colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 142 71% 45%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    /* Dark theme colors */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 142 84% 47%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

/* Accent color variations */
[data-accent="spotify"] {
  --accent: 142 71% 45%;
  --accent-foreground: 210 40% 98%;
}

[data-accent="spotify"].dark {
  --accent: 142 84% 47%;
  --accent-foreground: 222.2 84% 4.9%;
}

[data-accent="blue"] {
  --accent: 221 83% 53%;
  --accent-foreground: 210 40% 98%;
}

[data-accent="blue"].dark {
  --accent: 217 91% 60%;
  --accent-foreground: 222.2 84% 4.9%;
}

[data-accent="purple"] {
  --accent: 262 83% 58%;
  --accent-foreground: 210 40% 98%;
}

[data-accent="purple"].dark {
  --accent: 263 70% 50%;
  --accent-foreground: 210 40% 98%;
}

[data-accent="pink"] {
  --accent: 330 81% 60%;
  --accent-foreground: 210 40% 98%;
}

[data-accent="pink"].dark {
  --accent: 330 81% 60%;
  --accent-foreground: 210 40% 98%;
}

[data-accent="orange"] {
  --accent: 25 95% 53%;
  --accent-foreground: 26 83% 14%;
}

[data-accent="orange"].dark {
  --accent: 31 81% 56%;
  --accent-foreground: 26 83% 14%;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* Smooth transitions for theme changes */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

## Step 5: Update Tailwind Configuration

Add to your `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

## Step 6: Create Theme Controls

### Theme Toggle Component

Create `src/components/ui/ThemeToggle.tsx`:

```typescript
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
      className="rounded-full"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
```

### Accent Color Picker Component

Create `src/components/ui/AccentColorPicker.tsx`:

```typescript
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
```

## Step 7: Wrap Your Application

Update your main App component:

```typescript
import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AccentColorPicker } from '@/components/ui/AccentColorPicker';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header with theme controls */}
        <header className="border-b border-border p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Your App</h1>
            <div className="flex gap-2">
              <ThemeToggle />
              <AccentColorPicker />
            </div>
          </div>
        </header>
        
        {/* Your app content */}
        <main className="p-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4 text-accent">
              Spotify-Inspired Theme Active
            </h2>
            <p className="text-muted-foreground">
              Your content here will automatically adapt to the selected theme and accent color.
            </p>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

## Step 8: Testing the Implementation

1. **Theme Toggle**: Click the sun/moon icon to switch between light and dark modes
2. **Accent Colors**: Click the palette icon to change accent colors
3. **Persistence**: Refresh the page to verify settings are saved
4. **System Preference**: Change your system theme to test automatic detection

## Common Issues and Solutions

### Issue: Colors not applying
- Ensure CSS custom properties are properly defined
- Check that Tailwind is processing the CSS correctly
- Verify the data-accent attribute is being set on document root

### Issue: Theme not persisting
- Check localStorage is available and working
- Ensure useEffect is running after component mount
- Verify the theme state is being saved correctly

### Issue: Tailwind classes not working
- Make sure Tailwind config includes your content paths
- Check that the CSS custom properties are referenced correctly
- Ensure tailwindcss-animate plugin is installed

## Customization

### Adding New Accent Colors
1. Add the color definition to CSS custom properties
2. Update the AccentColor type in useTheme.ts
3. Add the new color to the accentColors array in AccentColorPicker.tsx

### Modifying Color Values
- Update the HSL values in the CSS custom properties
- Ensure sufficient contrast ratios for accessibility
- Test in both light and dark modes

### Custom Components
Always use the CSS custom properties for theming:

```typescript
// Good ✅
className="bg-accent text-accent-foreground"

// Bad ❌ 
className="bg-green-500 text-white"
```

This ensures your components automatically adapt to theme changes.

## Performance Considerations

- CSS custom properties update efficiently across the entire DOM
- Theme state changes trigger minimal re-renders
- Local storage prevents theme flicker on page load
- Transitions provide smooth visual feedback

Following this guide will give you a complete Spotify-inspired theming system that's accessible, performant, and easily customizable.
