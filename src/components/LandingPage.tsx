
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, BarChart3, Users, TrendingUp, Play, Eye, LogIn, Zap, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

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
          
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="text-accent border-accent px-6 py-2 text-base">
              <Shield className="h-4 w-4 mr-2" />
              Privacy-First Analytics
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleLoginClick}
              disabled={isLoading}
              className="flex items-center gap-2 text-lg px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-fadeInUp"
              style={{ animationDelay: '0.3s' }}
            >
              <LogIn className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
              {isLoading ? 'Connecting...' : 'Connect Spotify Account'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSandboxClick}
              className="flex items-center gap-2 text-lg px-8 py-3 hover:bg-accent/10 hover:text-accent transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              <Eye className="h-5 w-5" />
              Try Sandbox Mode
            </Button>
          </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 border-accent/10 transform hover:scale-105 hover:-translate-y-1 group animate-fadeInUp"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent group-hover:bg-accent/20 transition-colors duration-300 group-hover:scale-110 transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 animate-fadeInUp" style={{ animationDelay: '0.9s' }}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Securely",
                description: "Authorize through Spotify's official OAuth - we never see your credentials"
              },
              {
                step: "2", 
                title: "Analyze Locally",
                description: "Your data stays in your browser - all processing happens on your device"
              },
              {
                step: "3",
                title: "Discover Insights", 
                description: "Explore beautiful charts and discover patterns in your musical journey"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group animate-fadeInUp" style={{ animationDelay: `${1.0 + index * 0.2}s` }}>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-all duration-300 transform group-hover:scale-110 shadow-md group-hover:shadow-lg">
                  <span className="text-2xl font-bold text-accent group-hover:text-accent/90 transition-colors duration-300">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

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
