# 🎵 Spotify Insights Dashboard

A sophisticated analytics platform for Spotify users, offering comprehensive insights into listening habits, music library health, and personalized recommendations for musical growth.

## ✨ Core Features

### 📊 **Analytics Dashboard**
- **Artist Exploration**: Deep dive into your favorite artists with comprehensive metrics, sorting, and detailed insights
- **Track Explorer**: Advanced track analysis with 11 sorting options, mood analysis, and audio feature breakdown  
- **Genre Explorer**: Comprehensive genre analysis with diversity metrics and discovery insights
- **Listening Trends**: Weekly pattern analysis with mood categorization and seasonal variations

### 🏥 **Library Health Analysis**
- **7 Health Metrics**: Genre diversity, music freshness, artist balance, mood variety, listening depth, era diversity, and discovery momentum
- **Smart Recommendations**: Data-driven suggestions with specific action steps for library improvement
- **Health Scoring**: Weighted scoring system with detailed breakdowns and progress tracking
- **Personalized Insights**: Dynamic insights based on your actual listening patterns

### 📈 **Advanced Analytics**
- **Time Range Standardization**: Consistent 7-option time range selection across all components
- **Enhanced Sorting**: Professional-grade sorting with 8-11 options per component
- **Real-time Filtering**: Smart filtering with loading states and user feedback
- **Comprehensive Statistics**: Detailed metrics with tooltips and contextual information

### 🎯 **User Experience**
- **Mobile Responsive**: Fully responsive design optimized for all screen sizes
- **Professional UI**: Consistent tabbed interfaces, stats overviews, and visual hierarchy
- **Loading States**: Enhanced loading experiences with contextual feedback
- **Interactive Charts**: Rich data visualization with hover effects and detailed tooltips

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📚 Documentation

### 🚀 **Getting Started**
- [📋 Quick Start Guide](#quick-start) - Get up and running in minutes
- [🔧 System Architecture](docs/SYSTEM_ARCHITECTURE.md) - Technical overview and design decisions
- [🔐 Authentication Setup](docs/AUTHENTICATION_IMPROVEMENTS.md) - Spotify OAuth configuration

### 📊 **Metrics & Analytics**
- [📈 Metric Calculations](docs/METRIC_CALCULATIONS.md) - Comprehensive guide to all metric formulas
- [⚡ Quick Reference](docs/METRICS_QUICK_REFERENCE.md) - Developer cheat sheet for formulas
- [🎯 API Integration](docs/API_INTEGRATION.md) - Spotify API usage and data processing

### 🎨 **Design & Development**
- [🎨 Design System](docs/DESIGN_SYSTEM.md) - UI components and design patterns
- [🏗️ Engineering Guide](docs/ENGINEERING.md) - Development practices and code standards
- [📱 Product Design](docs/PRODUCT_DESIGN.md) - User experience and interface design

### 🔒 **Security & Privacy**
- [🛡️ Security Overview](docs/SECURITY.md) - Security measures and best practices
- [🔐 Privacy Architecture](docs/PRIVACY_ARCHITECTURE.md) - Data handling and privacy protection
- [📋 Privacy Verification](docs/PRIVACY_VERIFICATION.md) - Compliance and verification procedures

### ⚡ **Performance & Optimization**
- [🚀 Performance Guide](docs/PERFORMANCE_OPTIMIZATION.md) - Optimization strategies and benchmarks
- [📊 Data Architecture](docs/EXTENDED_DATA_ARCHITECTURE.md) - Data flow and processing optimization

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 18** with TypeScript for type-safe development
- **Next.js** for server-side rendering and routing
- **Tailwind CSS** for utility-first styling

### **Data & State Management**
- **React Query (TanStack Query)** for server state management
- **Custom hooks** for Spotify API integration
- **Zustand** for client-side state management

### **UI & Visualization**
- **Shadcn/UI** for consistent component library
- **Recharts** for interactive data visualization
- **Lucide React** for iconography
- **Framer Motion** for animations

### **Authentication & API**
- **Spotify Web API** for music data
- **OAuth 2.0** with PKCE for secure authentication
- **Custom API layer** for data processing and caching

### **Development Tools**
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For support, please open an issue in the GitHub repository.
