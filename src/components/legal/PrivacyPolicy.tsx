
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
            Privacy-First Music Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            This Spotify Analytics Dashboard is designed with privacy as the core principle. We collect and store 
            absolutely no personal data, process everything locally in your browser, and maintain complete transparency 
            about our minimal data practices.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Zero Data Collection
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Local Processing Only
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Session-Only Storage
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* What We Don't Collect */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            What We DON'T Collect or Store
          </CardTitle>
          <CardDescription>
            Complete transparency about our zero-collection approach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-green-200 bg-green-50/50 dark:bg-green-900/10 rounded-lg p-4">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Personal Information:</h4>
              <ul className="text-sm text-green-600 dark:text-green-500 space-y-1">
                <li>• No email addresses</li>
                <li>• No real names or usernames</li>
                <li>• No profile pictures</li>
                <li>• No location data</li>
                <li>• No contact information</li>
              </ul>
            </div>
            
            <div className="border border-green-200 bg-green-50/50 dark:bg-green-900/10 rounded-lg p-4">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Music Data:</h4>
              <ul className="text-sm text-green-600 dark:text-green-500 space-y-1">
                <li>• No listening history stored</li>
                <li>• No playlist contents saved</li>
                <li>• No music preferences tracked</li>
                <li>• No usage analytics collected</li>
                <li>• No behavioral data recorded</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Actually Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Our Privacy-First System Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Direct Spotify Connection</h4>
                <p className="text-sm text-muted-foreground">
                  Your browser connects directly to Spotify's API using OAuth 2.0. We never see or intercept this data.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Local-Only Processing</h4>
                <p className="text-sm text-muted-foreground">
                  All analytics are computed in your browser using JavaScript. No data leaves your device.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Temporary Session Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Only essential session data (OAuth tokens) stored temporarily to maintain your connection.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Minimal Technical Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-accent" />
            Minimal Technical Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            The only data we store locally in your browser for functionality:
          </p>
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <h4 className="font-medium text-foreground">OAuth Access Tokens (Temporary)</h4>
              <p className="text-sm text-muted-foreground">Encrypted tokens to maintain your Spotify connection</p>
              <div className="text-xs text-muted-foreground mt-1">
                Storage: Browser localStorage • Duration: Until logout • Size: ~2KB
              </div>
            </div>
            
            <div className="border rounded-lg p-3">
              <h4 className="font-medium text-foreground">App Preferences</h4>
              <p className="text-sm text-muted-foreground">Theme settings and UI preferences only</p>
              <div className="text-xs text-muted-foreground mt-1">
                Storage: Browser localStorage • Duration: Until cleared • Size: ~0.5KB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Rights & Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Complete User Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Instant Data Clearing</h4>
              <p className="text-sm text-muted-foreground">
                Clear all stored data instantly through Privacy Settings or by logging out
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Revoke Access Anytime</h4>
              <p className="text-sm text-muted-foreground">
                Disconnect from Spotify through your Spotify account settings or our app
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Export Preferences</h4>
              <p className="text-sm text-muted-foreground">
                Download your app preferences as a JSON file (contains no personal data)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Third-Party Services */}
      <Card>
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Spotify Integration</h4>
            <p className="text-sm text-muted-foreground">
              This app connects to Spotify's Web API to fetch your music data. This connection is governed by 
              Spotify's own privacy policy. We only request read-only access to your top tracks, artists, and 
              recent listening history.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">No Other Services</h4>
            <p className="text-sm text-muted-foreground">
              We do not integrate with any analytics services, advertising networks, or data collection platforms. 
              This application is completely self-contained.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Questions About Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This application is open source and available for review. If you have questions about our 
            privacy practices, you can examine the code directly or contact us through the Help section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
