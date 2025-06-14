
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Security Guide</h1>
            <p className="text-muted-foreground">
              Everything you need to know about using our music analytics platform safely
            </p>
          </div>
        </div>

        {/* What This App Does */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              What This App Does
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our music analytics platform connects to your Spotify account to provide detailed insights about your listening habits. 
              Think of it as a personal music journal that shows you patterns, trends, and discoveries in your music taste.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">What You'll See:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your top songs and artists</li>
                  <li>• Listening time and patterns</li>
                  <li>• Music genre breakdown</li>
                  <li>• Daily and weekly trends</li>
                  <li>• Musical mood analysis</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Fun Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Achievement badges</li>
                  <li>• Listening streaks</li>
                  <li>• Music discovery tracking</li>
                  <li>• Personalized insights</li>
                  <li>• Beautiful charts and graphs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Privacy & Security
            </CardTitle>
            <CardDescription>
              We take your privacy seriously. Here's how we protect your data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* What We Access */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                What We Can See
              </h4>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Your top songs and artists (that you've already listened to)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Recently played tracks (public listening history)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Your public profile information (username, profile picture)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Currently playing song (if you're listening)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What We Don't Access */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                What We Can't See
              </h4>
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❌ Your Spotify password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❌ Your private playlists (unless you make them public)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❌ Your payment information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❌ Your personal messages or emails</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">❌ Any other apps connected to your Spotify</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* How We Protect Data */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                How We Protect Your Data
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">🔒 Encrypted Connection</h5>
                    <p className="text-sm text-muted-foreground">
                      All data travels through secure, encrypted connections (HTTPS) that protect your information in transit.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">🛡️ Spotify Security</h5>
                    <p className="text-sm text-muted-foreground">
                      We use Spotify's official security system. You're always in control and can revoke access anytime.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">🚫 No Data Selling</h5>
                    <p className="text-sm text-muted-foreground">
                      We never sell your data. Your music taste is yours, and we respect that privacy.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <h5 className="font-medium mb-2">⏰ Temporary Access</h5>
                    <p className="text-sm text-muted-foreground">
                      We only access your data when you're actively using the app, not continuously in the background.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Use Safely */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Use This App Safely</CardTitle>
            <CardDescription>
              Simple steps to ensure your experience remains secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-medium mb-1">Only Connect Your Own Spotify Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Never enter someone else's Spotify credentials. Only use your personal account.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-medium mb-1">Use on Trusted Devices</h4>
                  <p className="text-sm text-muted-foreground">
                    Avoid using public computers. Stick to your personal devices for the best security.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-medium mb-1">Log Out When Done</h4>
                  <p className="text-sm text-muted-foreground">
                    Always log out when you're finished, especially on shared devices.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-medium mb-1">Review App Permissions</h4>
                  <p className="text-sm text-muted-foreground">
                    You can check and manage connected apps in your Spotify account settings anytime.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Your Connection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Managing Your Spotify Connection</CardTitle>
            <CardDescription>
              You're always in control of your data and connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium mb-2">✅ To Disconnect This App:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Go to your Spotify account settings</li>
                  <li>Find "Apps" or "Connected Apps" section</li>
                  <li>Look for this music analytics app</li>
                  <li>Click "Remove Access" or "Revoke"</li>
                </ol>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium mb-2">⚠️ What Happens When You Disconnect:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• This app will no longer access your Spotify data</li>
                  <li>• Your analytics history in this app will be cleared</li>
                  <li>• You can reconnect anytime to start fresh</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card>
          <CardHeader>
            <CardTitle>Questions or Concerns?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about privacy, security, or how this app works, we're here to help.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => window.open('https://www.spotify.com/account/privacy/', '_blank')}>
                Spotify Privacy Policy
              </Button>
              <Button variant="outline" onClick={() => window.open('https://www.spotify.com/account/apps/', '_blank')}>
                Manage Spotify Apps
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
