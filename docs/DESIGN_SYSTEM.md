
# Spotify Analytics Dashboard - Design System

## Overview
A comprehensive design system for the Spotify Analytics Dashboard that ensures consistency, accessibility, and scalability across all components and pages. The design is heavily inspired by Spotify's visual identity while maintaining excellent accessibility standards.

## Color System

### Primary Spotify-Inspired Theme
The application uses a Spotify-inspired color palette with the signature green as the primary accent color:

```css
/* Light Theme - Spotify Inspired */
--background: 0 0% 100%;           /* Pure white background */
--foreground: 222.2 84% 4.9%;      /* Near black text */
--accent: 142 71% 45%;             /* Spotify Green #1DB954 */
--accent-foreground: 210 40% 98%;  /* White text on green */

/* Dark Theme - Spotify Inspired */
--background: 222.2 84% 4.9%;      /* Deep dark background */
--foreground: 210 40% 98%;         /* Off-white text */
--accent: 142 84% 47%;             /* Brighter Spotify Green #1ED760 */
--accent-foreground: 222.2 84% 4.9%; /* Dark text on green */
```

### Multi-Accent Color System
The application supports 5 carefully chosen accent colors, all WCAG AA compliant:

#### Spotify Green (Default)
```css
[data-accent="spotify"] {
  --accent: 142 71% 45%;     /* #1DB954 */
  --accent-foreground: 210 40% 98%;
}

[data-accent="spotify"].dark {
  --accent: 142 84% 47%;     /* #1ED760 */
  --accent-foreground: 222.2 84% 4.9%;
}
```

#### Ocean Blue
```css
[data-accent="blue"] {
  --accent: 221 83% 53%;     /* #3B82F6 */
  --accent-foreground: 210 40% 98%;
}

[data-accent="blue"].dark {
  --accent: 217 91% 60%;     /* #60A5FA */
  --accent-foreground: 222.2 84% 4.9%;
}
```

#### Royal Purple
```css
[data-accent="purple"] {
  --accent: 262 83% 58%;     /* #8B5CF6 */
  --accent-foreground: 210 40% 98%;
}

[data-accent="purple"].dark {
  --accent: 263 70% 50%;     /* #7C3AED */
  --accent-foreground: 210 40% 98%;
}
```

#### Vibrant Pink
```css
[data-accent="pink"] {
  --accent: 330 81% 60%;     /* #EC4899 */
  --accent-foreground: 210 40% 98%;
}

[data-accent="pink"].dark {
  --accent: 330 81% 60%;     /* #EC4899 */
  --accent-foreground: 210 40% 98%;
}
```

#### Sunset Orange
```css
[data-accent="orange"] {
  --accent: 25 95% 53%;      /* #F59E0B */
  --accent-foreground: 26 83% 14%;
}

[data-accent="orange"].dark {
  --accent: 31 81% 56%;      /* #FB923C */
  --accent-foreground: 26 83% 14%;
}
```

## How to Reproduce the Spotify Design

### 1. Theme Implementation
The Spotify-inspired theme is implemented through:

- **CSS Custom Properties**: All colors defined as HSL values in `src/index.css`
- **Theme Context**: React context in `src/hooks/useTheme.ts` manages theme state
- **Data Attributes**: Theme applied via `data-accent` attribute on document root
- **Class Toggle**: Dark mode applied via `.dark` class on document element

### 2. Color Application Process
```typescript
// Theme state management
const [theme, setTheme] = useState<'light' | 'dark'>('light');
const [accentColor, setAccentColor] = useState<'spotify' | 'blue' | 'purple' | 'pink' | 'orange'>('spotify');

// Apply to DOM
useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.setAttribute('data-accent', accentColor);
}, [theme, accentColor]);
```

### 3. Component Integration
All UI components use the CSS custom properties:
```css
/* Example component styling */
.button-primary {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.card {
  background-color: hsl(var(--card));
  border: 1px solid hsl(var(--border));
}
```

## Typography

### Font System
- **Primary Font**: Inter (Google Fonts)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Character**: Modern, clean, highly readable

### Type Scale (Spotify-Inspired)
```css
/* Display Text */
.text-6xl { font-size: 3.75rem; font-weight: 700; } /* Hero titles */
.text-5xl { font-size: 3rem; font-weight: 700; }    /* Page titles */
.text-4xl { font-size: 2.25rem; font-weight: 600; } /* Section headers */

/* Headings */
.text-3xl { font-size: 1.875rem; font-weight: 600; } /* Card titles */
.text-2xl { font-size: 1.5rem; font-weight: 500; }   /* Subsections */
.text-xl { font-size: 1.25rem; font-weight: 500; }   /* Item titles */

/* Body Text */
.text-lg { font-size: 1.125rem; line-height: 1.75; } /* Large body */
.text-base { font-size: 1rem; line-height: 1.5; }    /* Standard body */
.text-sm { font-size: 0.875rem; line-height: 1.25; } /* Small text */
.text-xs { font-size: 0.75rem; line-height: 1; }     /* Captions */
```

## Spacing System

### Spotify-Inspired Spacing
Based on 8px grid system for visual harmony:

```css
/* Base spacing units */
.space-1 { margin/padding: 0.25rem; }  /* 4px */
.space-2 { margin/padding: 0.5rem; }   /* 8px - Base unit */
.space-3 { margin/padding: 0.75rem; }  /* 12px */
.space-4 { margin/padding: 1rem; }     /* 16px - Standard */
.space-6 { margin/padding: 1.5rem; }   /* 24px - Comfortable */
.space-8 { margin/padding: 2rem; }     /* 32px - Spacious */
.space-12 { margin/padding: 3rem; }    /* 48px - Section breaks */
.space-16 { margin/padding: 4rem; }    /* 64px - Page sections */
```

## Component Specifications

### Cards (Spotify-Style)
```css
/* Standard Music Card */
background: hsl(var(--card));
border: 1px solid hsl(var(--border));
border-radius: 0.5rem; /* 8px - Spotify standard */
padding: 1.5rem; /* 24px */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
transition: all 150ms ease;

/* Hover state */
hover:shadow-lg;
hover:scale-[1.02];
hover:border-color: hsl(var(--accent) / 0.3);
```

### Buttons (Music Player Style)
```css
/* Primary Play Button */
background: hsl(var(--accent));
color: hsl(var(--accent-foreground));
padding: 0.75rem 1.5rem; /* 12px 24px */
border-radius: 2rem; /* Full rounded - Spotify style */
font-weight: 600;
transition: all 150ms ease;

/* Hover states */
hover:scale-105;
hover:shadow-lg;

/* Icon buttons */
.icon-button {
  width: 2.5rem; /* 40px */
  height: 2.5rem;
  border-radius: 50%;
  background: hsl(var(--accent));
}
```

### Navigation (Spotify Sidebar Style)
```css
/* Sidebar */
background: hsl(var(--sidebar-background));
width: 20rem; /* 320px */
border-right: 1px solid hsl(var(--border));

/* Navigation items */
.nav-item {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin: 0.25rem 0.5rem;
  transition: all 150ms ease;
}

.nav-item:hover {
  background: hsl(var(--accent) / 0.1);
}

.nav-item.active {
  background: hsl(var(--accent) / 0.15);
  border-left: 3px solid hsl(var(--accent));
}
```

## Layout System

### Spotify-Inspired Grid
```css
/* Dashboard Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem; /* 24px */
}

/* Music Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem; /* 16px */
}

/* Player Layout */
.player-layout {
  display: grid;
  grid-template-areas: 
    "sidebar main"
    "player player";
  grid-template-columns: 320px 1fr;
  grid-template-rows: 1fr auto;
}
```

### Responsive Breakpoints
```css
/* Mobile-first breakpoints */
sm: 640px;   /* Large phones */
md: 768px;   /* Tablets */
lg: 1024px;  /* Small desktops */
xl: 1280px;  /* Desktops */
2xl: 1536px; /* Large screens */

/* Layout adaptations */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    z-index: 50;
  }
}
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text has minimum 4.5:1 ratio
- **Focus Indicators**: 2px solid accent color outline
- **Touch Targets**: Minimum 44px for interactive elements
- **Screen Readers**: Comprehensive ARIA labels and descriptions

### Focus Management
```css
.focus-visible {
  outline: 2px solid hsl(var(--accent));
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}
```

## Animation System

### Spotify-Inspired Transitions
```css
/* Smooth micro-interactions */
* {
  transition-property: color, background-color, border-color, transform, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Music player animations */
@keyframes pulse-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.playing-indicator {
  animation: pulse-beat 0.8s ease-in-out infinite;
}

/* Hover effects */
.card-hover {
  transition: all 200ms ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgb(0 0 0 / 0.15);
}
```

## Icon System

### Lucide React Integration
- **Library**: Lucide React
- **Style**: Outline icons for consistency
- **Sizes**: 16px (default), 20px, 24px
- **Stroke Width**: 1.5px for optimal clarity

```jsx
// Standard usage
<Music className="h-5 w-5 text-accent" />

// Interactive icons
<Play className="h-6 w-6 text-accent hover:scale-110 transition-transform" />
```

## Implementation Guide

### 1. Setting Up the Theme System
```bash
# Install required dependencies
npm install class-variance-authority clsx tailwind-merge

# Copy theme files
cp src/hooks/useTheme.ts your-project/src/hooks/
cp src/components/providers/ThemeProvider.tsx your-project/src/components/providers/
cp src/index.css your-project/src/
```

### 2. Wrap Your App
```jsx
import { ThemeProvider } from '@/components/providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 3. Use Theme Context
```jsx
import { useTheme } from '@/hooks/useTheme';

function Component() {
  const { theme, accentColor, setAccentColor, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="bg-accent text-accent-foreground"
    >
      Toggle Theme
    </button>
  );
}
```

### 4. Add Theme Controls
```jsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AccentColorPicker } from '@/components/ui/AccentColorPicker';

function Header() {
  return (
    <div className="flex gap-2">
      <ThemeToggle />
      <AccentColorPicker />
    </div>
  );
}
```

## Best Practices

### Color Usage
- Use `hsl(var(--accent))` for primary actions and highlights
- Use `hsl(var(--muted-foreground))` for secondary text
- Maintain consistent contrast ratios across all themes
- Test color combinations with accessibility tools

### Component Development
- Always use CSS custom properties instead of hardcoded colors
- Implement hover and focus states for all interactive elements
- Test components in both light and dark modes
- Ensure responsive behavior at all breakpoints

### Performance
- CSS custom properties update efficiently across themes
- Minimize layout shifts during theme transitions
- Use CSS transforms for animations instead of changing layout properties
- Optimize images for different color schemes

This design system ensures a cohesive, accessible, and maintainable Spotify-inspired interface that scales across the entire application.
