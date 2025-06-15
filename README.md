
# Spotify Analytics Dashboard

A privacy-first, real-time music analytics dashboard that provides deep insights into your Spotify listening habits with enhanced local-only processing capabilities.

## 🎵 Features

### Core Analytics
- **Real-Time Activity Heatmap** - Live playback tracking with local-only processing
- **Top Tracks & Artists** - Comprehensive listening statistics
- **Genre Explorer** - Deep dive into your musical preferences
- **Listening Trends** - Enhanced temporal analysis with real-time data
- **Audio Features Analysis** - Technical breakdown of your music taste

### Privacy-First Enhancements
- **Web Playback SDK Integration** - Real-time insights without compromising privacy
- **Local-Only Processing** - All playback data processed in browser memory only
- **Zero Permanent Storage** - Session data automatically cleared on browser close
- **User-Controlled Data** - Instant disconnect and data clearing capabilities
- **Transparent Processing** - Clear indicators of real-time vs. simulated data

### Privacy & Security
- **Zero-Data Policy** - No personal data stored permanently
- **GDPR & CCPA Compliant** - Full privacy rights implementation
- **End-to-End Encryption** - All communications secured
- **OAuth 2.0 with PKCE** - Industry-standard authentication
- **Content Security Policy** - XSS and injection attack prevention

## 🚀 Quick Start

### Option 1: Live Demo with Simulated Data
Visit our [live demo](https://spotify-insights-dashboard.lovable.app) to explore the interface with realistic simulated data.

### Option 2: Connect Your Spotify Account
1. Visit the dashboard and click "Connect Spotify"
2. Authorize the application (read-only access)
3. Enjoy real-time insights with privacy protection

### Option 3: Enhanced Real-Time Mode
1. Connect your Spotify account
2. Start playing music on any Spotify client
3. The dashboard will automatically begin local processing
4. View real-time activity in the Enhanced Activity Heatmap

## 🔒 Privacy Commitment

### Local-Only Processing
- **Web Playback SDK** processes your listening data in real-time within your browser
- **No Data Transmission** - Playback information never leaves your device
- **Memory-Only Storage** - Session data exists only temporarily in browser memory
- **Automatic Cleanup** - All data cleared when you close the browser

### Data Transparency
```
Real-Time Data Flow:
Spotify → Your Browser → Local Processing → Visual Display
                           ↓
                    Automatic Cleanup
                  (No Permanent Storage)
```

### User Control
- **Instant Disconnect** - One-click removal of all real-time processing
- **Session Clearing** - Manual clearing of current session data
- **Privacy Dashboard** - Full transparency into data processing
- **Graceful Degradation** - Falls back to simulated data if preferred

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for beautiful visualizations
- **Authentication**: OAuth 2.0 with PKCE for security
- **Real-Time**: Spotify Web Playback SDK (local processing only)
- **Privacy**: Local-only data processing, zero permanent storage
- **API**: Spotify Web API + extensive dummy data fallbacks

## 📊 Enhanced Features

### Real-Time Activity Heatmap
- Live tracking of your current listening session
- Local-only processing ensures privacy
- Combines real-time data with historical patterns
- Clear indicators for live vs. simulated data
- One-click privacy controls and data clearing

### Intelligent Fallbacks
- Graceful degradation when Spotify API is unavailable
- Extensive dummy data for demonstration purposes
- Seamless switching between real and simulated data
- No functionality loss in any mode

### Privacy-First Design
- All privacy settings clearly displayed
- User education about data processing
- Transparent opt-in/opt-out mechanisms
- Regular privacy compliance audits

## 🎯 Use Cases

### For Music Lovers
- Discover patterns in your listening habits
- Explore your musical evolution over time
- Find your most-played tracks and artists
- Analyze the audio characteristics of your favorite music

### For Privacy-Conscious Users
- Enjoy insights without compromising data privacy
- Full control over real-time processing
- Local-only data analysis capabilities
- Transparent privacy practices

### For Developers
- Reference implementation for privacy-first analytics
- OAuth 2.0 + PKCE authentication example
- Web Playback SDK integration with privacy safeguards
- Comprehensive security documentation

## 🔐 Security Features

### Authentication
- **OAuth 2.0 with PKCE** - Protection against authorization code interception
- **State Parameter** - CSRF attack prevention
- **Secure Token Storage** - Encrypted localStorage with automatic cleanup
- **Token Validation** - Real-time token expiry checking

### Data Protection
- **Local-Only Processing** - Real-time data never transmitted externally
- **Memory-Only Storage** - Session data exists only in browser memory
- **Automatic Cleanup** - Data cleared on browser close or manual disconnect
- **No Persistent Storage** - Zero permanent data retention for playback information

### Privacy Controls
- **Instant Data Clearing** - One-click removal of all session data
- **Disconnect Capability** - Complete disconnection from real-time processing
- **Privacy Dashboard** - Full transparency into data handling
- **User Education** - Clear explanation of privacy protections

## 📖 Documentation

- [Privacy Policy](docs/PRIVACY.md) - Comprehensive privacy practices
- [Security Documentation](docs/SECURITY.md) - Detailed security implementation
- [Web Playback SDK Privacy](docs/PRIVACY_PLAYBACK_SDK.md) - Local processing details
- [API Documentation](docs/API.md) - Spotify Web API integration guide

## 🤝 Contributing

We welcome contributions that maintain our privacy-first approach:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Ensure all privacy standards are maintained
4. Commit your changes (`git commit -m 'Add amazing privacy-preserving feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Privacy Guidelines for Contributors
- No permanent storage of user playback data
- All new features must support local-only processing
- Maintain transparency in data handling
- Document privacy implications of new features

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal

This project is **not affiliated with Spotify AB**. Spotify® is a trademark of Spotify AB. This is an independent, open-source project created for educational and analytical purposes.

### Privacy Compliance
- **GDPR Compliant** - Full data subject rights implementation
- **CCPA Compliant** - California privacy rights supported
- **Privacy by Design** - Built with privacy as a core principle
- **Regular Audits** - Ongoing privacy compliance verification

## 🎵 Acknowledgments

- **Spotify** for providing the comprehensive Web API and Web Playback SDK
- **Privacy Community** for guidance on privacy-preserving analytics
- **Open Source Community** for the amazing tools and libraries
- **Users** for trusting us with their musical journey insights

---

**Made with ❤️ for music lovers who value their privacy**
