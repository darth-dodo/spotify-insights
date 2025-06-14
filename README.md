
# Spotify Insights Dashboard

A production-ready, privacy-focused Spotify insights dashboard built with modern web technologies and engineering best practices.

## 🖼️ Product Screenshots

### Interactive Dashboard Overview
![Dashboard Overview](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop&crop=center)
*Main dashboard showing personalized stats, top tracks, and recent activity with gamification elements*

### Advanced Analytics & Trends
![Listening Trends](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&crop=center)
*Interactive charts displaying listening patterns over time with detailed breakdowns*

### GitHub-Style Activity Heatmap
![Activity Heatmap](https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&h=800&fit=crop&crop=center)
*365-day listening activity visualization with streak tracking and consistency metrics*

### Gamification System
![Achievement System](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop&crop=center)
*Complete achievement system with badges, levels, and XP progression tracking*

### Genre Analysis & Discovery
![Genre Analysis](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop&crop=center)
*Detailed genre breakdown with recommendations and listening patterns*

### Artist Exploration
![Artist Network](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop&crop=center)
*Interactive artist discovery with relationship mapping and similarity analysis*

### Mobile-Responsive Design
![Mobile Interface](https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop&crop=center)
*Fully responsive design optimized for mobile and tablet viewing*

## 🚀 Features

- **Rich Analytics**: Deep insights into listening habits and musical preferences
- **Trend Analysis**: Track how musical taste evolves over time with interactive charts
- **GitHub-Style Heatmap**: Visualize daily listening activity with contribution-style heatmaps
- **Genre Discovery**: Explore and understand favorite genres and artists
- **Gamification System**: Unlock achievements, earn badges, and level up through musical exploration
- **Player Profile**: Complete progression system with XP, levels, and milestone tracking
- **Privacy First**: End-to-end encryption, no third-party tracking, GDPR/CCPA compliant
- **Spotify-Inspired UI**: Clean, modern interface with customizable accent colors
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

### Player Profile
- **Level System**: Progress through unlimited levels based on musical activity
- **XP Tracking**: Detailed experience point system with multiple earning methods
- **Statistics Dashboard**: Track total plays, listening time, streaks, and discoveries
- **Progress Visualization**: Beautiful progress bars and achievement galleries

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

### Dashboard Components
- **InteractiveOverview**: Main dashboard with stats and recent activity
- **EnhancedListeningTrends**: Advanced trend analysis with heatmap integration
- **ListeningHeatmap**: GitHub-style activity visualization
- **GamificationSystem**: Complete achievement and badge system
- **EnhancedGenreAnalysis**: Deep genre insights and recommendations
- **ArtistExploration**: Artist discovery and relationship mapping

### Gamification Components
- **Achievement System**: Progressive unlocking with rarity tiers
- **Badge Collection**: Behavioral pattern recognition and rewards
- **Player Profile**: Level progression and XP tracking
- **Statistics Dashboard**: Comprehensive activity metrics

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

### Manual Deployment

1. Build the application: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Configure environment variables on your hosting platform

## 🔧 Configuration

### Environment Variables

- `VITE_SPOTIFY_CLIENT_ID`: Your Spotify app's Client ID
- `VITE_SPOTIFY_REDIRECT_URI`: OAuth redirect URI (must match Spotify app settings)
- `VITE_USE_DUMMY_DATA`: Set to 'true' for sandbox mode with sample data

### Spotify API Scopes

The application requests minimal scopes:
- `user-read-private`: Basic profile information
- `user-read-email`: Email address
- `user-top-read`: Top tracks and artists
- `user-read-recently-played`: Recently played tracks
- `user-read-playback-state`: Current playback state

## 📊 Data Management

### What Data We Collect

- Basic Spotify profile information
- Listening history and preferences
- Top tracks, artists, and genres
- Playback statistics and patterns
- Achievement progress and gamification data

### Data Privacy

- All data is encrypted at rest and in transit
- No data is shared with third parties
- Users can export or delete their data at any time
- Compliant with GDPR and CCPA regulations
- Local storage for user preferences and game state

## 🎨 Customization

### Accent Colors

The dashboard supports multiple accent colors:
- Spotify Green (default)
- Ocean Blue
- Royal Purple
- Vibrant Pink
- Sunset Orange

### Themes

- Light mode
- Dark mode
- System preference sync

### Gamification Settings

- Achievement notification preferences
- Badge display options
- Progress tracking customization
- XP earning rate adjustments

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   │   ├── ListeningHeatmap.tsx    # GitHub-style activity heatmap
│   │   ├── GamificationSystem.tsx  # Complete achievement system
│   │   └── EnhancedListeningTrends.tsx # Advanced analytics
│   ├── layout/         # Layout components
│   ├── providers/      # Context providers
│   └── ui/             # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Route components
└── types/              # TypeScript type definitions
```

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Husky for pre-commit hooks

### Git Workflow

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push branch: `git push origin feature/new-feature`
4. Create pull request

## 🎮 Gamification API

### Achievement System

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'listening' | 'discovery' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}
```

### Badge System

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  unlocked: boolean;
}
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📞 Support

For support, email support@spotifyinsights.com or create an issue on GitHub.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful components
- [Recharts](https://recharts.org/) for data visualization
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons
- GitHub for heatmap inspiration
