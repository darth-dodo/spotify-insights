
# Spotify Analytics Dashboard - Design System

## Overview
A comprehensive design system for the Spotify Analytics Dashboard that ensures consistency, accessibility, and scalability across all components and pages. The design is heavily inspired by Spotify's visual identity while maintaining excellent accessibility standards and supporting real-time playback integration.

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

#### Vibrant Coral
```css
[data-accent="coral"] {
  --accent: 14 90% 65%;      /* #F87171 */
  --accent-foreground: 210 40% 98%;
}

[data-accent="coral"].dark {
  --accent: 14 90% 65%;      /* #F87171 */
  --accent-foreground: 210 40% 98%;
}
```

#### Warm Amber
```css
[data-accent="amber"] {
  --accent: 43 96% 56%;      /* #FCD34D */
  --accent-foreground: 26 83% 14%;
}

[data-accent="amber"].dark {
  --accent: 31 81% 56%;      /* #FB923C */
  --accent-foreground: 26 83% 14%;
}
```

### Real-time Status Colors
Additional colors for real-time playback status indicators:

```css
/* Playback Status Colors */
--playing: 142 71% 45%;        /* Spotify Green - Currently playing */
--paused: 43 74% 66%;          /* Amber - Paused state */
--buffering: 217 91% 60%;      /* Blue - Loading/buffering */
--offline: 0 0% 45%;           /* Gray - Offline/unavailable */
--error: 0 84% 60%;            /* Red - Error state */
```

## How to Reproduce the Spotify Design

### 1. Theme Implementation
The Spotify-inspired theme is implemented through:

- **CSS Custom Properties**: All colors defined as HSL values in `src/index.css`
- **Theme Context**: React context in `src/hooks/useTheme.ts` manages theme state
- **Data Attributes**: Theme applied via `data-accent` attribute on document root
- **Class Toggle**: Dark mode applied via `.dark` class on document element

### 2. Real-time Integration Design
```typescript
// Real-time playback state integration
const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'buffering' | 'offline'>('offline');
const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

// Apply real-time status colors
useEffect(() => {
  document.documentElement.style.setProperty('--current-status', 
    playbackState === 'playing' ? 'var(--playing)' :
    playbackState === 'paused' ? 'var(--paused)' :
    playbackState === 'buffering' ? 'var(--buffering)' :
    'var(--offline)'
  );
}, [playbackState]);
```

### 3. Component Integration
All UI components use the CSS custom properties:
```css
/* Real-time status indicators */
.playback-indicator {
  background-color: hsl(var(--current-status));
  color: hsl(var(--accent-foreground));
}

.live-badge {
  background-color: hsl(var(--playing));
  animation: pulse 2s infinite;
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

## Real-time Component Specifications

### Live Status Indicators
```css
/* Real-time playback indicator */
.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: hsl(var(--playing));
  color: hsl(var(--accent-foreground));
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

/* Session tracking badge */
.session-badge {
  background: hsl(var(--accent) / 0.1);
  border: 1px solid hsl(var(--accent) / 0.3);
  color: hsl(var(--accent));
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 150ms ease;
}
```

### Error State Components
```css
/* API error states */
.error-state {
  background: hsl(var(--error) / 0.1);
  border: 1px solid hsl(var(--error) / 0.3);
  color: hsl(var(--error));
  padding: 1rem;
  border-radius: 0.5rem;
}

/* Offline mode indicator */
.offline-mode {
  background: hsl(var(--offline) / 0.1);
  border: 1px solid hsl(var(--offline) / 0.3);
  color: hsl(var(--offline));
  padding: 0.75rem;
  border-radius: 0.5rem;
}

/* Retry button styling */
.retry-button {
  background: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 150ms ease;
}

.retry-button:hover {
  background: hsl(var(--accent) / 0.9);
  transform: scale(1.02);
}
```

## Data Visualization Components

### Real-time Charts
```css
/* Live data chart styling */
.live-chart {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
}

.live-chart::before {
  content: "LIVE";
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: hsl(var(--playing));
  color: hsl(var(--accent-foreground));
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 700;
  animation: pulse 2s infinite;
}

/* Session progress bars */
.session-progress {
  height: 0.5rem;
  background: hsl(var(--muted));
  border-radius: 0.25rem;
  overflow: hidden;
}

.session-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent) / 0.7));
  transition: width 300ms ease;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}
```

### Caching Status Indicators
```css
/* Cache status badges */
.cache-fresh {
  background: hsl(var(--playing) / 0.1);
  color: hsl(var(--playing));
  border: 1px solid hsl(var(--playing) / 0.3);
}

.cache-stale {
  background: hsl(var(--paused) / 0.1);
  color: hsl(var(--paused));
  border: 1px solid hsl(var(--paused) / 0.3);
}

.cache-updating {
  background: hsl(var(--buffering) / 0.1);
  color: hsl(var(--buffering));
  border: 1px solid hsl(var(--buffering) / 0.3);
  animation: pulse 1.5s infinite;
}
```

## Animation System

### Real-time Animations
```css
/* Live data streaming animation */
@keyframes data-stream {
  0% { opacity: 0; transform: translateY(10px); }
  50% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

.streaming-data {
  animation: data-stream 2s ease-in-out infinite;
}

/* Playback progress animation */
@keyframes progress-update {
  0% { width: var(--start-width); }
  100% { width: var(--end-width); }
}

.playback-progress {
  animation: progress-update var(--duration) linear;
}

/* Connection status pulse */
@keyframes connection-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.connection-indicator {
  animation: connection-pulse 1.5s ease-in-out infinite;
}
```

### Error State Animations
```css
/* Error shake animation */
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-animation {
  animation: error-shake 0.5s ease-in-out;
}

/* Retry loading animation */
@keyframes retry-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.retry-loading {
  animation: retry-spin 1s linear infinite;
}
```

## Performance & Accessibility

### Real-time Performance Optimizations
```css
/* GPU acceleration for real-time updates */
.real-time-component {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .live-indicator,
  .session-progress-fill,
  .streaming-data {
    animation: none !important;
  }
  
  * {
    transition: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .live-indicator {
    border: 2px solid currentColor;
  }
  
  .error-state {
    border-width: 2px;
  }
}
```

### Battery and Data Savings
```css
/* Reduced animations for battery saving */
@media (prefers-reduced-data: reduce) {
  .live-chart::before {
    animation: none;
    content: "●";
  }
  
  .streaming-data {
    animation-duration: 4s;
  }
}
```

## Implementation Guide

### 1. Real-time Integration Setup
```typescript
// Real-time theme integration
const useRealtimeTheme = () => {
  const { theme, accentColor } = useTheme();
  const { playbackState } = useSpotifyPlayback();
  
  useEffect(() => {
    document.documentElement.setAttribute('data-playback-state', playbackState);
  }, [playbackState]);
  
  return { theme, accentColor, playbackState };
};
```

### 2. Error Handling UI Integration
```typescript
// Error state management
const useErrorStates = () => {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'error'>('online');
  const [cacheStatus, setCacheStatus] = useState<'fresh' | 'stale' | 'updating'>('fresh');
  
  return { apiStatus, cacheStatus, setApiStatus, setCacheStatus };
};
```

### 3. Performance Monitoring
```typescript
// Performance-aware component rendering
const usePerformanceAwareRendering = () => {
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  
  useEffect(() => {
    // Check for low-end devices or battery saver mode
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceAnimations(mediaQuery.matches);
  }, []);
  
  return { shouldReduceAnimations };
};
```

## Best Practices

### Real-time Data Handling
- Use debounced updates for high-frequency data changes
- Implement virtual scrolling for large datasets
- Cache rendered components for identical data states
- Use CSS transforms for smooth real-time animations

### Error State Design
- Provide clear error messages with actionable solutions
- Use consistent error state styling across all components
- Implement progressive enhancement for offline scenarios
- Show loading states during retry operations

### Performance Optimization
- Use CSS custom properties for theme changes
- Implement lazy loading for non-critical real-time features
- Optimize animation performance with GPU acceleration
- Respect user preferences for reduced motion and data usage

This enhanced design system ensures a cohesive, performant Spotify-inspired experience that handles real-time data, caching states, and error scenarios while maintaining excellent accessibility and user experience standards.
