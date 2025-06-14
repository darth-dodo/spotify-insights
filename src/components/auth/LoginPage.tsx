
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Shield, 
  BarChart3, 
  Sparkles, 
  Lock,
  Eye,
  TrendingUp,
  Users
} from 'lucide-react';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const { theme, accentColor } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: 'Rich Analytics',
      description: 'Deep insights into your listening habits and musical preferences'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Track how your musical taste evolves over time'
    },
    {
      icon: Music,
      title: 'Genre Discovery',
      description: 'Explore and understand your favorite genres and artists'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared with third parties'
    }
  ];

  const securityFeatures = [
    'OAuth 2.0 authentication',
    'End-to-end encryption',
    'No third-party tracking',
    'GDPR & CCPA compliant',
    'Full data control'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and Features */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Music className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Spotify Analytics
                </h1>
                <p className="text-muted-foreground">
                  Discover your musical journey
                </p>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground">
              Get deep insights into your Spotify listening habits with beautiful, 
              privacy-focused analytics that help you understand your musical preferences.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>Secured with industry-standard encryption</span>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="w-full max-w-md mx-auto">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Connect your Spotify account to get started
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Button 
                onClick={login}
                disabled={isLoading}
                className="w-full h-12 text-base bg-[#1DB954] hover:bg-[#1ed760] text-white"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Continue with Spotify
                  </div>
                )}
              </Button>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Secure OAuth 2.0 authentication
                  </span>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    What we access:
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Your basic profile information</li>
                    <li>• Your top tracks and artists</li>
                    <li>• Your recently played music</li>
                    <li>• Your current playback state</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">
                    Privacy Guaranteed
                  </h4>
                  <div className="space-y-1">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-green-700 dark:text-green-500">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By continuing, you agree to our{' '}
            <Button variant="link" className="h-auto p-0 text-xs">
              Terms of Service
            </Button>
            {' '}and{' '}
            <Button variant="link" className="h-auto p-0 text-xs">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};
