
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, BarChart3, Users, TrendingUp, Play, Eye, LogIn, Zap } from 'lucide-react';
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
            Unlock deep insights into your music listening habits. Discover patterns, trends, 
            and hidden gems in your Spotify data with beautiful visualizations and analytics.
          </p>
          
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

          {/* Demo Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              No signup required for sandbox mode
            </Badge>
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
              <h3 className="text-xl font-semibold mb-2">Connect Your Account</h3>
              <p className="text-muted-foreground">
                Securely connect your Spotify account to access your listening data
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Your Data</h3>
              <p className="text-muted-foreground">
                Our dashboard processes your listening history to generate insights
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Patterns</h3>
              <p className="text-muted-foreground">
                Explore interactive charts and discover new aspects of your musical taste
              </p>
            </div>
          </div>
        </div>

        {/* Sandbox Mode Info */}
        <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-6 w-6 text-accent" />
              Try Sandbox Mode
            </CardTitle>
            <CardDescription className="text-base">
              Not ready to connect your Spotify account? No problem! Explore our dashboard 
              with sample data to see what insights you could unlock.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <h4 className="font-medium mb-2 text-accent">What's included in sandbox mode:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sample music data from popular artists and tracks</li>
                  <li>• Full dashboard functionality and all visualizations</li>
                  <li>• Interactive charts and trend analysis</li>
                  <li>• All features except real-time Spotify integration</li>
                </ul>
              </div>
              <Button 
                onClick={handleSandboxClick}
                className="whitespace-nowrap flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Explore Sandbox
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
