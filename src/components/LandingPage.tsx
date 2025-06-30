import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DevelopmentLimitationsModal } from '@/components/ui/DevelopmentLimitationsModal';
import { 
  Music, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Play,
  Eye, 
  LogIn, 
  Zap, 
  Shield, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Smartphone,
  Heart,
  Star,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [limitationsModalOpen, setLimitationsModalOpen] = useState(false);

  const handleSandboxClick = () => {
    navigate('/sandbox');
  };

  const handleLoginClick = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const features = [
    {
      icon: <Music className="h-6 w-6" />,
      title: "Deep Track Analytics",
      description: "Analyze your most played songs with detailed audio features, mood patterns, and listening frequency across different time periods"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Visual Listening Trends",
      description: "Interactive charts showing your music evolution, peak listening times, and seasonal preferences with beautiful data visualizations"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comprehensive Genre Mapping",
      description: "Explore your musical DNA with detailed genre breakdowns, diversity scores, and recommendations for expanding your taste"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Library Health Score",
      description: "Get insights into your music library's diversity, freshness, and balance with actionable recommendations for improvement"
    }
  ];

  const privacyFeatures = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Local Processing Only",
      description: "All data analysis happens directly in your browser - nothing leaves your device"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Zero Data Storage", 
      description: "We never store, cache, or retain any of your personal music data or listening history"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Analysis",
      description: "Instant insights generated on-demand without any external data processing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 dark:from-background dark:via-slate-900/50 dark:to-accent/5">
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl scale-110"></div>
              <div className="relative p-4 sm:p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full backdrop-blur-sm border border-accent/20 dark:border-accent/30">
                <Music className="h-12 w-12 sm:h-16 sm:w-16 text-accent dark:text-accent" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text px-2">
            Spotify Insights
            <span className="block text-transparent bg-gradient-to-r from-accent to-primary bg-clip-text mt-1 sm:mt-2">
              Dashboard
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Unlock deep insights into your music listening habits with complete privacy. 
            Beautiful visualizations and analytics that respect your data.
          </p>
          
          {/* Development Mode Limitations - Clean Alert */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-amber-900 dark:text-amber-100 text-sm sm:text-base">
                      🚧 Real Data Access Limited to 25 Users
                    </p>
                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Due to Spotify Development Mode restrictions. <span className="font-medium">Sandbox Mode available for everyone!</span>
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLimitationsModalOpen(true)}
                  className="self-start sm:self-auto whitespace-nowrap border-amber-300 dark:border-amber-600 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-xs sm:text-sm px-3 py-2 h-auto"
                >
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="text-accent border-accent/50 dark:border-accent/70 px-6 py-3 text-base font-medium bg-accent/5 dark:bg-accent/10">
              <Shield className="h-4 w-4 mr-2" />
              Privacy-First Analytics Platform
            </Badge>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <Button 
              size="lg" 
              onClick={handleLoginClick}
              disabled={isLoading}
              className="group relative overflow-hidden flex items-center gap-2 sm:gap-3 text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-primary via-accent to-primary bg-size-200 hover:bg-pos-100 transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-accent/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <LogIn className={`h-4 w-4 sm:h-5 sm:w-5 relative z-10 flex-shrink-0 ${isLoading ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform duration-300'}`} />
              <span className="relative z-10 text-center">{isLoading ? 'Connecting...' : 'Connect Spotify Account'}</span>
              {!isLoading && <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSandboxClick}
              className="group flex items-center gap-2 sm:gap-3 text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 w-full sm:w-auto min-h-[48px] border-2 hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
              <span className="text-center">Try Sandbox Mode</span>
              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
            </Button>
          </div>

          {/* Privacy Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-16 px-4">
            {privacyFeatures.map((feature, index) => (
              <div key={index} className="group p-4 sm:p-5 rounded-lg bg-accent/5 dark:bg-accent/10 border border-accent/10 dark:border-accent/20 hover:border-accent/30 transition-all duration-300 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="text-accent group-hover:scale-110 transition-transform duration-300 mt-0.5 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-semibold text-foreground mb-1 text-sm sm:text-base">{feature.title}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                      {feature.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Powerful Analytics Features
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover patterns in your music consumption with enterprise-grade analytics
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-0">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 dark:from-card/70 dark:to-card/40 backdrop-blur-sm hover:shadow-xl hover:shadow-accent/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl text-accent group-hover:from-accent/20 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110 transform border border-accent/20">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with either real data or sandbox mode
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
            {[
              {
                step: "1",
                title: "Choose Your Path",
                description: "Select real data access (if allowlisted) or try our feature-complete Sandbox Mode with demo data",
                icon: <Users className="h-6 w-6" />
              },
              {
                step: "2", 
                title: "Secure Connection",
                description: "Authorize through Spotify's official OAuth2 - your data never leaves your browser",
                icon: <Shield className="h-6 w-6" />
              },
              {
                step: "3",
                title: "Explore Insights", 
                description: "Discover beautiful visualizations and patterns in your musical journey with advanced analytics",
                icon: <BarChart3 className="h-6 w-6" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-accent/10 to-primary/10 dark:from-accent/20 dark:to-primary/20 rounded-2xl flex items-center justify-center mx-auto group-hover:from-accent/20 group-hover:to-primary/20 dark:group-hover:from-accent/30 dark:group-hover:to-primary/30 transition-all duration-300 transform group-hover:scale-110 shadow-lg group-hover:shadow-xl border border-accent/20 dark:border-accent/30">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="text-2xl font-bold text-accent group-hover:text-accent/90 transition-colors duration-300 relative z-10">
                      {item.step}
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 text-accent/50 group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Access Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 px-2 sm:px-0">
          {/* Sandbox Mode Card */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-xl text-emerald-700 dark:text-emerald-300">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <Play className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                Sandbox Mode
                <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700">
                  Recommended
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-emerald-600 dark:text-emerald-400">
                Full-featured demo with realistic sample data - no limitations or account requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300">No registration needed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300">500+ sample tracks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300">All features unlocked</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-700 dark:text-emerald-300">Instant access</span>
                </div>
              </div>
              <Button 
                onClick={handleSandboxClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="h-4 w-4 mr-2" />
                Try Sandbox Mode
              </Button>
            </CardContent>
          </Card>

          {/* Real Data Access Card */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-xl text-blue-700 dark:text-blue-300">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                Real Data Access
                <Badge variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50">
                  Limited
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-blue-600 dark:text-blue-400">
                Connect your actual Spotify account for personalized insights (requires allowlist approval)
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300">Must be added to 25-user allowlist</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300">Contact app owner with Spotify email</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300">Your personal music data & history</span>
                </div>
              </div>
              <Button 
                onClick={handleLoginClick}
                disabled={isLoading}
                variant="outline"
                className="w-full border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-300"
              >
                <LogIn className={`h-4 w-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
                {isLoading ? 'Connecting...' : 'Connect Spotify Account'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Technical Explanation */}
        <Card className="border-0 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <Globe className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              Understanding Spotify's Development Mode
            </CardTitle>
            <CardDescription className="text-base">
              Why this app has user limitations and what it means for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Development Mode Basics
                </h4>
                <div className="space-y-3 text-slate-600 dark:text-slate-400">
                  <p>
                    All new Spotify apps start in <strong>Development Mode</strong>, which limits access to 25 users maximum. 
                    This is Spotify's standard practice for personal projects and beta applications.
                  </p>
                  <p>
                    Users must be manually added to an allowlist through the Spotify Developer Dashboard. 
                    There's no automated approval process - it requires manual intervention from the app owner.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Extended Access Requirements
                </h4>
                <div className="space-y-3 text-slate-600 dark:text-slate-400">
                  <p>
                    As of 2025, Spotify only grants unlimited access to organizations with <strong>250,000+ monthly active users</strong> 
                    and established business entities with proven commercial viability.
                  </p>
                  <p>
                    Individual developers and personal projects typically remain in Development Mode permanently, 
                    making the 25-user limit a long-term constraint rather than a temporary restriction.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                    Why We Built Sandbox Mode
                  </h5>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    We created a comprehensive Sandbox Mode so everyone can experience the full power of our analytics platform. 
                    The demo data is carefully crafted to showcase all features and capabilities, giving you a complete preview 
                    of what the platform offers before deciding if you want to request real data access.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Development Limitations Modal */}
      <DevelopmentLimitationsModal 
        open={limitationsModalOpen}
        onOpenChange={setLimitationsModalOpen}
      />
    </div>
  );
};
