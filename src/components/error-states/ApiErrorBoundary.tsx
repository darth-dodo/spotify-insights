
import React, { Component, ReactNode } from 'react';
import { HugOfDeathPage } from './HugOfDeathPage';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRateLimited: boolean;
  retryCount: number;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isRateLimited: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const isRateLimited = error.message.includes('429') || 
                         error.message.includes('rate limit') ||
                         error.message.includes('Too Many Requests');
    
    return {
      hasError: true,
      error,
      isRateLimited,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('API Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      isRateLimited: false,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      // Show rate limit page for 429 errors
      if (this.state.isRateLimited) {
        return (
          <HugOfDeathPage 
            onRetry={this.handleRetry}
            estimatedWaitTime={60}
          />
        );
      }

      // Show generic error for other API errors
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Something Went Wrong
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                We encountered an error while fetching your Spotify data. This could be due to:
              </p>
              
              <ul className="text-sm text-muted-foreground text-left space-y-1">
                <li>• Network connectivity issues</li>
                <li>• Spotify API temporary unavailability</li>
                <li>• Authentication token expiration</li>
              </ul>

              <div className="space-y-3">
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    localStorage.removeItem('spotify_access_token');
                    window.location.href = '/';
                  }}
                >
                  Re-authenticate with Spotify
                </Button>
              </div>

              {this.state.error && (
                <details className="text-xs text-muted-foreground text-left">
                  <summary className="cursor-pointer">Technical Details</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
