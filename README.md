
# Spotify Insights Dashboard

A production-ready, privacy-focused Spotify insights dashboard built with modern web technologies and engineering best practices.

## 🚀 Features

- **Rich Analytics**: Deep insights into listening habits and musical preferences
- **Trend Analysis**: Track how musical taste evolves over time  
- **Genre Discovery**: Explore and understand favorite genres and artists
- **Privacy First**: End-to-end encryption, no third-party tracking, GDPR/CCPA compliant
- **Spotify-Inspired UI**: Clean, modern interface with customizable accent colors
- **Responsive Design**: Full compatibility across desktop, tablet, and mobile

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
- Playback statistics

### Data Privacy

- All data is encrypted at rest and in transit
- No data is shared with third parties
- Users can export or delete their data at any time
- Compliant with GDPR and CCPA regulations

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

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
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
