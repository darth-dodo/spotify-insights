
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Clock, 
  CheckCircle,
  Code,
  Server,
  UserCheck,
  FileText,
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';

export const ComprehensivePrivacyDoc = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
          <h1 className="text-4xl font-bold text-foreground">Privacy by Design</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The world's first truly privacy-first Spotify analytics platform with zero data collection, 
          complete local processing, and full transparency
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Database className="h-4 w-4" />
            Zero Server Storage
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Zap className="h-4 w-4" />
            Local Processing Only
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <Code className="h-4 w-4" />
            Open Source
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
            <UserCheck className="h-4 w-4" />
            GDPR Compliant
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                Revolutionary Privacy Approach
              </CardTitle>
              <CardDescription>
                Unlike traditional analytics platforms, we fundamentally reimagined data privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* What We DON'T Do */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    What We DON'T Do
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Store any personal information',
                      'Track your listening behavior',
                      'Send data to external servers',
                      'Use cookies or persistent tracking',
                      'Share data with third parties',
                      'Collect email addresses or contacts',
                      'Store playlist contents or history',
                      'Use analytics or telemetry services'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What We DO */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    What We DO
                  </h3>
                  <div className="space-y-3">
                    {[
                      'Process data locally in your browser',
                      'Use temporary session tokens only',
                      'Hash sensitive identifiers (SHA-256)',
                      'Clear data automatically on logout',
                      'Provide full source code transparency',
                      'Enable direct Spotify API connection',
                      'Offer complete user control',
                      'Ensure GDPR compliance by design'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  <strong>Data Flow Transparency:</strong> Your Browser ↔ Spotify API → Local Processing → 
                  Analytics Display. No intermediary servers, no data collection, no external transmission.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Minimal Data Footprint */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Minimal Data Footprint
              </CardTitle>
              <CardDescription>
                Complete breakdown of our microscopic data usage (less than 4KB total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  {
                    category: 'Session Tokens',
                    description: 'Encrypted OAuth tokens for Spotify API access',
                    size: '< 2 KB',
                    duration: 'Until logout',
                    type: 'Temporary',
                    color: 'blue'
                  },
                  {
                    category: 'User Display Data',
                    description: 'SHA-256 hashed user ID and truncated display name',
                    size: '< 1 KB',
                    duration: 'Session only',
                    type: 'Hashed',
                    color: 'green'
                  },
                  {
                    category: 'App Preferences',
                    description: 'Theme settings and UI customizations',
                    size: '< 0.5 KB',
                    duration: 'Local storage',
                    type: 'Settings',
                    color: 'purple'
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{item.category}</h4>
                      <Badge variant="outline" className={`border-${item.color}-200`}>
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Size: {item.size}</span>
                      <span>Duration: {item.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Implementation Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-500" />
                Technical Architecture
              </CardTitle>
              <CardDescription>
                How we achieve zero data collection through innovative architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client-Side Only Processing</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-600 dark:text-green-400">// All analytics computed in your browser</div>
                  <div>const analyzeGenres = (tracks: SpotifyTrack[]) => &#123;</div>
                  <div className="ml-4 text-blue-600 dark:text-blue-400">// This happens locally only</div>
                  <div className="ml-4">return tracks.reduce((genres, track) => &#123;</div>
                  <div className="ml-8 text-blue-600 dark:text-blue-400">// No external data transmission</div>
                  <div className="ml-8">track.artists.forEach(artist => &#123;</div>
                  <div className="ml-12 text-blue-600 dark:text-blue-400">// Direct Spotify API processing</div>
                  <div className="ml-8">&#125;);</div>
                  <div className="ml-4">&#125;, &#123;&#125;);</div>
                  <div>&#125;;</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Secure Authentication</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">OAuth 2.0 + PKCE</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Industry-standard authentication</li>
                      <li>• No password storage</li>
                      <li>• Spotify-handled authorization</li>
                      <li>• Automatic token refresh</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Token Security</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• AES encryption for local storage</li>
                      <li>• Session-based token lifecycle</li>
                      <li>• Automatic cleanup on logout</li>
                      <li>• No server-side token storage</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Memory Management</h3>
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    All processing occurs in volatile browser memory. Data is automatically cleared 
                    when you close the tab, logout, or the session expires. No persistent storage of personal data.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                Privacy Regulations Compliance
              </CardTitle>
              <CardDescription>
                Built-in compliance with global privacy regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">GDPR Compliance</h3>
                  <div className="space-y-3">
                    {[
                      { right: 'Right to Access', status: 'No personal data stored to access' },
                      { right: 'Right to Rectification', status: 'No data to rectify' },
                      { right: 'Right to Erasure', status: 'Automatic data clearing' },
                      { right: 'Right to Portability', status: 'Preferences export only' },
                      { right: 'Right to Object', status: 'No processing to object to' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{item.right}</span>
                        <Badge variant="outline" className="text-xs">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Other Regulations</h3>
                  <div className="space-y-3">
                    {[
                      { regulation: 'CCPA', status: 'No personal data sale/sharing' },
                      { regulation: 'PIPEDA', status: 'No personal data collection' },
                      { regulation: 'LGPD', status: 'Compliance by design' },
                      { regulation: 'POPIA', status: 'Zero processing footprint' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{item.regulation}</span>
                        <Badge variant="outline" className="text-xs">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Compliance by Design:</strong> Our zero-collection architecture ensures automatic 
                  compliance with all major privacy regulations without requiring ongoing compliance efforts.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Verify Our Privacy Claims
              </CardTitle>
              <CardDescription>
                Step-by-step guide to independently verify our privacy practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Verification Checklist</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { check: 'Network Traffic Analysis', description: 'Only Spotify API calls visible in browser dev tools' },
                    { check: 'Local Storage Inspection', description: 'Only OAuth tokens and preferences stored' },
                    { check: 'Source Code Audit', description: 'No external analytics or tracking libraries' },
                    { check: 'Data Export Test', description: 'Contains only app preferences, no personal data' },
                    { check: 'Logout Cleanup', description: 'All data cleared when logging out' },
                    { check: 'Memory Analysis', description: 'No persistent data in browser memory' }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">{item.check}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Browser Console Verification</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-600 dark:text-green-400">// Run in browser console to verify</div>
                  <div>console.log("Local Storage:", Object.keys(localStorage));</div>
                  <div>console.log("Session Storage:", Object.keys(sessionStorage));</div>
                  <div className="text-blue-600 dark:text-blue-400">// Should only show: spotify tokens + preferences</div>
                </div>
              </div>

              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  <strong>Full Transparency:</strong> Our complete source code is available for audit. 
                  Every line of code that handles your data is open for inspection and verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legal Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This application is independent and not affiliated with Spotify AB. 
              Spotify® is a trademark of Spotify AB.
            </p>
            <p className="text-xs text-muted-foreground">
              Open source under MIT License • Built with privacy-first principles • 
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
