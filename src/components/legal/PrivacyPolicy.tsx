
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Database, Clock, CheckCircle } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Your Privacy Matters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            This Privacy Policy describes how we collect, use, and protect your information when you use our Spotify Analytics Dashboard. 
            We are committed to minimal data collection and maximum privacy protection.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              No Email Collection
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Minimal Data Storage
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Session-Only Data
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" />
            Information We Collect
          </CardTitle>
          <CardDescription>
            We collect only the minimum data necessary for functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">From Spotify (with your permission):</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Basic profile information (name, country - hashed and truncated)</li>
                <li>• Your top tracks and artists for analytics</li>
                <li>• Recent listening history for trend analysis</li>
                <li>• Profile picture availability (boolean flag only)</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Local Application Data:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Theme and UI preferences</li>
                <li>• Temporary authentication tokens</li>
                <li>• Dashboard customization settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Usage */}
      <Card>
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Analytics Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Create personalized music analytics and insights from your Spotify data
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Dashboard Customization</h4>
                <p className="text-sm text-muted-foreground">
                  Remember your preferences for themes, colors, and layout settings
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain secure access to your Spotify data during your session
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            How We Protect Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Data Minimization</h4>
              <p className="text-sm text-muted-foreground">
                We collect only what's necessary and hash sensitive identifiers using SHA-256
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Local Storage</h4>
              <p className="text-sm text-muted-foreground">
                All data is stored locally in your browser with automatic cleanup on logout
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">No External Sharing</h4>
              <p className="text-sm text-muted-foreground">
                We never share your data with third parties or external analytics services
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Secure Communication</h4>
              <p className="text-sm text-muted-foreground">
                All communication with Spotify uses HTTPS encryption and OAuth 2.0 PKCE
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Rights */}
      <Card>
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Access & Export</h4>
              <p className="text-sm text-muted-foreground">
                You can view and export all data we store about you through the Privacy Controls section
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Delete</h4>
              <p className="text-sm text-muted-foreground">
                You can delete all your data instantly at any time through the Privacy Controls
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Revoke Access</h4>
              <p className="text-sm text-muted-foreground">
                You can revoke Spotify access permissions at any time through your Spotify account settings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you have any questions about this Privacy Policy or our data practices, 
            please contact us through the Help & Security section of the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
