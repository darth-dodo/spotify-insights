
# Spotify Analytics Dashboard - Design System

## Overview
A comprehensive design system for the Spotify Analytics Dashboard that ensures consistency, accessibility, and scalability across all components and pages.

## Color System

### Primary Colors
```css
/* Light Theme */
--background: 0 0% 100%;           /* #FFFFFF */
--foreground: 222.2 84% 4.9%;      /* #0A0A0A */
--card: 0 0% 100%;                 /* #FFFFFF */
--card-foreground: 222.2 84% 4.9%; /* #0A0A0A */

/* Dark Theme */
--background: 222.2 84% 4.9%;      /* #0A0A0A */
--foreground: 210 40% 98%;         /* #FAFAFA */
--card: 222.2 84% 4.9%;            /* #0A0A0A */
--card-foreground: 210 40% 98%;    /* #FAFAFA */
```

### Accent Colors (WCAG AA Compliant)
```css
/* Spotify Green - High Contrast */
--accent-spotify-light: 142 71% 45%;     /* #1DB954 */
--accent-spotify-dark: 142 84% 47%;      /* #1ED760 */

/* Ocean Blue - High Contrast */
--accent-blue-light: 221 83% 53%;        /* #3B82F6 */
--accent-blue-dark: 217 91% 60%;         /* #60A5FA */

/* Royal Purple - High Contrast */
--accent-purple-light: 262 83% 58%;      /* #8B5CF6 */
--accent-purple-dark: 263 70% 50%;       /* #7C3AED */

/* Vibrant Pink - High Contrast */
--accent-pink-light: 330 81% 60%;        /* #EC4899 */
--accent-pink-dark: 330 81% 60%;         /* #EC4899 */

/* Sunset Orange - High Contrast */
--accent-orange-light: 25 95% 53%;       /* #F59E0B */
--accent-orange-dark: 31 81% 56%;        /* #FB923C */
```

### Semantic Colors
```css
/* Success */
--success: 142 76% 36%;            /* #22C55E */
--success-foreground: 355 7% 97%;  /* #FEFEFE */

/* Warning */
--warning: 48 96% 53%;             /* #EAB308 */
--warning-foreground: 26 83% 14%;  /* #451A03 */

/* Error */
--destructive: 0 84% 60%;          /* #EF4444 */
--destructive-foreground: 210 40% 98%; /* #FAFAFA */

/* Info */
--info: 221 83% 53%;               /* #3B82F6 */
--info-foreground: 210 40% 98%;    /* #FAFAFA */
```

## Typography

### Font Families
- **Primary**: Inter (System fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- **Monospace**: "JetBrains Mono", Monaco, "Cascadia Code", "Roboto Mono"

### Type Scale
```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body Text */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */

/* Font Weights */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

## Spacing System

### Base Unit: 4px
```css
/* Spacing Scale */
.space-1 { margin/padding: 0.25rem; }  /* 4px */
.space-2 { margin/padding: 0.5rem; }   /* 8px */
.space-3 { margin/padding: 0.75rem; }  /* 12px */
.space-4 { margin/padding: 1rem; }     /* 16px */
.space-5 { margin/padding: 1.25rem; }  /* 20px */
.space-6 { margin/padding: 1.5rem; }   /* 24px */
.space-8 { margin/padding: 2rem; }     /* 32px */
.space-10 { margin/padding: 2.5rem; }  /* 40px */
.space-12 { margin/padding: 3rem; }    /* 48px */
.space-16 { margin/padding: 4rem; }    /* 64px */
```

## Border Radius

```css
.rounded-none { border-radius: 0px; }
.rounded-sm { border-radius: 0.125rem; }   /* 2px */
.rounded { border-radius: 0.25rem; }       /* 4px */
.rounded-md { border-radius: 0.375rem; }   /* 6px */
.rounded-lg { border-radius: 0.5rem; }     /* 8px */
.rounded-xl { border-radius: 0.75rem; }    /* 12px */
.rounded-2xl { border-radius: 1rem; }      /* 16px */
.rounded-full { border-radius: 9999px; }
```

## Component Specifications

### Cards
```css
/* Standard Card */
background: hsl(var(--card));
border: 1px solid hsl(var(--border));
border-radius: 0.5rem; /* 8px */
padding: 1.5rem; /* 24px */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Interactive Card */
transition: all 150ms ease;
hover:shadow-md;
hover:scale-[1.02];
```

### Buttons
```css
/* Primary Button */
background: hsl(var(--accent));
color: hsl(var(--accent-foreground));
padding: 0.5rem 1rem; /* 8px 16px */
border-radius: 0.375rem; /* 6px */
font-weight: 500;
transition: all 150ms ease;

/* Secondary Button */
background: hsl(var(--secondary));
color: hsl(var(--secondary-foreground));
border: 1px solid hsl(var(--border));

/* Ghost Button */
background: transparent;
color: hsl(var(--foreground));
hover:background: hsl(var(--accent) / 0.1);
```

### Form Elements
```css
/* Input */
background: hsl(var(--background));
border: 1px solid hsl(var(--border));
border-radius: 0.375rem; /* 6px */
padding: 0.5rem 0.75rem; /* 8px 12px */
font-size: 0.875rem; /* 14px */
focus:border-color: hsl(var(--accent));
focus:ring: 2px solid hsl(var(--accent) / 0.2);
```

## Breakpoints

```css
/* Mobile First */
sm: 640px;   /* Tablet */
md: 768px;   /* Small Desktop */
lg: 1024px;  /* Desktop */
xl: 1280px;  /* Large Desktop */
2xl: 1536px; /* Extra Large */
```

## Grid System

### Container Widths
```css
.container {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### Grid Layout
```css
/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem; /* 24px */
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem; /* 16px */
}
```

## Accessibility

### Focus States
```css
.focus-visible {
  outline: 2px solid hsl(var(--accent));
  outline-offset: 2px;
}
```

### Color Contrast Ratios
- **Normal Text**: 4.5:1 minimum (WCAG AA)
- **Large Text**: 3:1 minimum (WCAG AA)
- **Interactive Elements**: 3:1 minimum (WCAG AA)

### Screen Reader Support
- All interactive elements have proper ARIA labels
- Form inputs have associated labels
- Icons include screen reader text
- Focus management for modals and dropdowns

## Animation & Transitions

### Duration Scale
```css
.duration-75 { transition-duration: 75ms; }
.duration-100 { transition-duration: 100ms; }
.duration-150 { transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }
```

### Easing Functions
```css
.ease-linear { transition-timing-function: linear; }
.ease-in { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
```

## Icons

### Icon System
- **Library**: Lucide React
- **Default Size**: 16px (1rem)
- **Sizes**: 12px, 16px, 20px, 24px, 32px
- **Stroke Width**: 1.5px (consistent across all icons)

### Usage Guidelines
```jsx
// Standard icon
<Icon className="h-4 w-4" />

// Large icon
<Icon className="h-6 w-6" />

// Interactive icon
<Icon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
```

## Component Library

### Card Components
- **StatCard**: Displays key metrics
- **ChartCard**: Contains visualizations
- **ActionCard**: Interactive cards with buttons
- **InfoCard**: Informational content

### Navigation Components
- **Sidebar**: Collapsible navigation
- **Header**: Top navigation bar
- **TabNavigation**: Horizontal tabs
- **Breadcrumbs**: Navigation hierarchy

### Data Visualization
- **LineChart**: Trend analysis
- **BarChart**: Comparative data
- **PieChart**: Proportional data
- **AreaChart**: Volume over time

## Implementation Guidelines

### CSS Custom Properties
All colors should be defined as HSL values in CSS custom properties for maximum flexibility and theming support.

### Component Structure
```jsx
// Standard component structure
const Component = ({ className, ...props }) => {
  return (
    <div 
      className={cn("base-styles", className)} 
      {...props}
    >
      {/* Component content */}
    </div>
  );
};
```

### Responsive Design
- Mobile-first approach
- Progressive enhancement
- Touch-friendly targets (44px minimum)
- Readable text at all sizes

This design system ensures consistency, accessibility, and maintainability across the entire Spotify Analytics Dashboard application.
