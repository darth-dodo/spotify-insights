
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, BarChart3, Users, TrendingUp, Play, Eye, LogIn, Zap, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

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

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/');
    return null;
  }

  const features = [
    {
      icon: <Music className="h-6 w-6" />,
      title: "Top Tracks & Artists",
      description: "Discover your most played songs and favorite artists with detailed analytics"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Listening Trends",
      description: "Visualize your music consumption patterns over time with interactive charts"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Genre Analysis",
      description: "Explore your musical taste with comprehensive genre breakdowns and insights"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Music Discovery",
      description: "Find new music based on your listening habits and preferences"
    }
  ];

  const privacyFeatures = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Local Processing",
      description: "All data analysis happens in your browser"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Zero Storage",
      description: "We don't store your personal music data"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Insights",
      description: "Instant analysis without external servers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-accent/10 rounded-full">
              <Music className="h-12 w-12 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Spotify Insights
            <span className="text-accent"> Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Unlock deep insights into your music listening habits with complete privacy. 
            Beautiful visualizations and analytics that respect your data.
          </p>
          
          {/* Privacy First Badge */}
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="text-accent border-accent px-6 py-2 text-base">
              <Shield className="h-4 w-4 mr-2" />
              Privacy-First Analytics
            </Badge>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleLoginClick}
              className="flex items-center gap-2 text-lg px-8 py-3"
            >
              <LogIn className="h-5 w-5" />
              Connect Spotify Account
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSandboxClick}
              className="flex items-center gap-2 text-lg px-8 py-3"
            >
              <Eye className="h-5 w-5" />
              Try Sandbox Mode
            </Button>
          </div>

          {/* Privacy Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            {privacyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="text-accent">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">{feature.title}</div>
                  <div className="text-xs">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-accent/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How it Works Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Securely</h3>
              <p className="text-muted-foreground">
                Authorize through Spotify's official OAuth - we never see your credentials
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Locally</h3>
              <p className="text-muted-foreground">
                Your data stays in your browser - all processing happens on your device
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Insights</h3>
              <p className="text-muted-foreground">
                Explore beautiful charts and discover patterns in your musical journey
              </p>
            </div>
          </div>
        </div>

        {/* Sandbox Mode Info */}
        <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-6 w-6 text-accent" />
              Experience the Dashboard
            </CardTitle>
            <CardDescription className="text-base">
              Try our complete dashboard with sample data to see the full potential of your music insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <h4 className="font-medium mb-2 text-accent">Sandbox includes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete dashboard with 500+ sample tracks from classic artists</li>
                  <li>• All visualizations and interactive features</li>
                  <li>• Full privacy controls and settings</li>
                  <li>• Real-time analytics and trend analysis</li>
                </ul>
              </div>
              <Button 
                onClick={handleSandboxClick}
                className="whitespace-nowrap flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Explore Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
