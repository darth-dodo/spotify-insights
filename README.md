
# Spotify Insights Dashboard

A production-ready, privacy-focused Spotify insights dashboard built with modern web technologies and a beautiful Spotify-inspired design system.

## 🎨 Design Philosophy

This dashboard draws heavy inspiration from Spotify's visual identity while maintaining its own unique character. The design system features:

- **Spotify Green Theme**: Signature #1DB954 green with high-contrast accessibility
- **Multi-Accent Support**: 5 carefully chosen color themes (Spotify Green, Ocean Blue, Royal Purple, Vibrant Pink, Sunset Orange)
- **Dark-First Design**: Optimized for dark mode with excellent light mode support
- **Music-Centric UI**: Icons, layouts, and interactions designed for music enthusiasts

## 🚀 Features

- **Rich Analytics**: Deep insights into listening habits and musical preferences
- **Trend Analysis**: Track how musical taste evolves over time with interactive charts
- **GitHub-Style Heatmap**: Visualize daily listening activity with contribution-style heatmaps
- **Genre Discovery**: Explore and understand favorite genres and artists
- **Gamification System**: Unlock achievements, earn badges, and level up through musical exploration
- **Player Profile**: Complete progression system with XP, levels, and milestone tracking
- **Privacy First**: End-to-end encryption, no third-party tracking, GDPR/CCPA compliant
- **Responsive Design**: Full compatibility across desktop, tablet, and mobile

## 🎮 Gamification Features

### Achievement System
- **25+ Unique Achievements**: From first listen to music legend status
- **Rarity Tiers**: Common, Rare, Epic, and Legendary achievements
- **Progressive Unlocking**: Achievements unlock as you explore more music
- **XP Rewards**: Earn experience points for every musical milestone

### Badge Collection
- **Specialized Badges**: Early Bird, Night Owl, Weekend Warrior, and more
- **Behavioral Tracking**: Badges unlock based on listening patterns and habits
- **Visual Collection**: Beautiful gradient designs for each badge category
- **Requirement Tracking**: Clear goals for unlocking each badge

## 📊 Advanced Analytics

### Listening Heatmap
- **365-Day View**: GitHub-style contribution heatmap showing daily listening activity
- **Play Count Tracking**: Visual representation of music consumption patterns
- **Streak Monitoring**: Current and longest listening streaks
- **Activity Insights**: Peak listening periods and consistency metrics

### Enhanced Trends
- **Time Range Selection**: Week, month, year, and historical data analysis
- **Multiple Metrics**: Listening time, track count, and artist diversity
- **Interactive Charts**: Hover for detailed daily breakdowns
- **Spotify Integration**: Real data from your Spotify listening history

## 🎨 Spotify-Inspired Theme System

### How to Reproduce the Design

The Spotify-inspired design is built on a comprehensive theme system:

#### 1. Color System
```css
/* Spotify Green (Default) */
--accent: 142 71% 45%;     /* #1DB954 */
--accent-foreground: 210 40% 98%;

/* Dark Theme */
--accent: 142 84% 47%;     /* #1ED760 */
--accent-foreground: 222.2 84% 4.9%;
```

#### 2. Theme Implementation
- **CSS Custom Properties**: All colors defined as HSL values for maximum flexibility
- **React Context**: Theme state managed through `useTheme` hook
- **Data Attributes**: `data-accent` attribute controls color scheme
- **Class Toggle**: `.dark` class for dark mode activation

#### 3. Quick Setup
```bash
# Install dependencies
npm install class-variance-authority clsx tailwind-merge

# Copy theme files
cp src/hooks/useTheme.ts your-project/
cp src/components/providers/ThemeProvider.tsx your-project/
cp src/index.css your-project/
```

#### 4. Theme Controls
The dashboard includes built-in theme controls:
- **Theme Toggle**: Sun/Moon button for light/dark mode
- **Accent Picker**: Palette button for color selection
- **System Sync**: Automatic system preference detection

For complete reproduction instructions, see [docs/THEME_REPRODUCTION.md](docs/THEME_REPRODUCTION.md).

## 🛡️ Security & Privacy

- ✅ OAuth 2.0 authentication with minimal scopes
- ✅ End-to-end encryption for all sensitive data
- ✅ No third-party analytics or tracking scripts
- ✅ GDPR and CCPA compliant
- ✅ Full user data control (view, export, delete)
- ✅ Content Security Policy implementation

## 🏗️ Architecture

Built with modern, production-ready technologies:

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI components  
- **Theme System**: CSS Custom Properties with React Context
- **State Management**: React Query, React Context
- **Authentication**: Spotify OAuth 2.0 with PKCE
- **Charts**: Recharts for data visualization
- **Testing**: Vitest, Playwright, React Testing Library

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- Spotify Developer Account

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotify-insights-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Spotify API**
   - Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add `http://localhost:5173/callback` to redirect URIs
   - Copy your Client ID

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Spotify Client ID
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Explore without signing in**
   - Visit `/sandbox` for a demo with rich sample data
   - Experience all features without Spotify authentication

## 🎯 Component Architecture

### Theme System Components
- **ThemeProvider**: React context provider for theme state
- **ThemeToggle**: Sun/Moon toggle for light/dark mode
- **AccentColorPicker**: Palette picker for accent color selection
- **useTheme**: Hook for accessing and modifying theme state

### Dashboard Components
- **InteractiveOverview**: Main dashboard with stats and recent activity
- **EnhancedListeningTrends**: Advanced trend analysis with heatmap integration
- **ListeningHeatmap**: GitHub-style activity visualization
- **GamificationSystem**: Complete achievement and badge system
- **EnhancedGenreAnalysis**: Deep genre insights and recommendations
- **ArtistExploration**: Artist discovery and relationship mapping

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

## 🔧 Configuration

### Environment Variables

- `VITE_SPOTIFY_CLIENT_ID`: Your Spotify app's Client ID
- `VITE_SPOTIFY_REDIRECT_URI`: OAuth redirect URI (must match Spotify app settings)
- `VITE_USE_DUMMY_DATA`: Set to 'true' for sandbox mode with sample data

### Theme Customization

The Spotify-inspired theme can be customized through:

#### Accent Colors
- Spotify Green (default) - `#1DB954`
- Ocean Blue - `#3B82F6`
- Royal Purple - `#8B5CF6`
- Vibrant Pink - `#EC4899`
- Sunset Orange - `#F59E0B`

#### Theme Controls
```typescript
import { useTheme } from '@/hooks/useTheme';

const { theme, accentColor, setAccentColor, toggleTheme } = useTheme();

// Toggle between light and dark
toggleTheme();

// Change accent color
setAccentColor('blue');
```

### Custom Components

Always use CSS custom properties for theming:

```typescript
// Good ✅ - Automatically adapts to theme
className="bg-accent text-accent-foreground"

// Bad ❌ - Hard-coded colors
className="bg-green-500 text-white"
```

## 📊 Data Management

### What Data We Collect

- Basic Spotify profile information (hashed and minimized)
- Listening history and preferences (< 4KB total)
- Top tracks, artists, and genres
- Playback statistics and patterns
- Achievement progress and gamification data

### Data Privacy

- All data is encrypted at rest and in transit
- No data is shared with third parties
- Users can export or delete their data at any time
- Compliant with GDPR and CCPA regulations
- Local storage for user preferences and theme settings

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── providers/      # React context providers
│   │   └── ThemeProvider.tsx    # Theme system provider
│   ├── ui/             # Base UI components
│   │   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   │   └── AccentColorPicker.tsx # Color theme picker
│   ├── dashboard/      # Dashboard-specific components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
│   └── useTheme.ts     # Theme management hook
├── lib/                # Utility libraries
├── styles/             # CSS and styling
│   └── accents.css     # Accent color definitions
└── docs/               # Documentation
    ├── DESIGN_SYSTEM.md      # Complete design system
    ├── THEME_REPRODUCTION.md # How to reproduce themes
    └── PRODUCT_DESIGN.md     # Product design document
```

### Design System Documentation

Comprehensive documentation is available:

- **[Design System](docs/DESIGN_SYSTEM.md)**: Complete design system with Spotify-inspired guidelines
- **[Theme Reproduction](docs/THEME_REPRODUCTION.md)**: Step-by-step guide to reproduce the design
- **[Product Design](docs/PRODUCT_DESIGN.md)**: Product design document with UI/UX specifications

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Follow the design system guidelines
4. Ensure theme compatibility across all changes
5. Test in both light and dark modes
6. Commit your changes
7. Push to the branch
8. Open a pull request

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data access
- [Spotify Design System](https://spotify.design/) for design inspiration
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful, accessible components
- [Recharts](https://recharts.org/) for music data visualization
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide React](https://lucide.dev/) for music-focused iconography

---

**Built with ❤️ and inspired by the love of music and beautiful design.**
