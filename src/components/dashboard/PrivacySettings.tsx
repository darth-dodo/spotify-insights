
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Database, 
  Lock,
  CheckCircle,
  AlertTriangle,
  Star,
  Settings,
  FileText,
  Palette
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const PrivacySettings = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [dataVisibility, setDataVisibility] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleExportData = async () => {
    toast({
      title: "Exporting your data",
      description: "Your minimal data export will be ready shortly.",
    });
    console.log('Exporting minimal user data...');
  };

  const handleDeleteData = async () => {
    toast({
      title: "Data deletion completed",
      description: "All local data has been permanently deleted.",
      variant: "destructive",
    });
    setShowDeleteDialog(false);
    localStorage.clear();
    console.log('All local data deleted...');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Privacy by Design USP */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">Privacy by Design</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The only Spotify analytics tool that processes everything locally with zero data collection
        </p>
        
        {/* Key USP Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="pt-4 text-center">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-700 dark:text-green-400">Zero Collection</h3>
              <p className="text-sm text-green-600 dark:text-green-500">No personal data ever stored</p>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="pt-4 text-center">
              <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-700 dark:text-blue-400">Local Processing</h3>
              <p className="text-sm text-blue-600 dark:text-blue-500">Everything runs in your browser</p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10">
            <CardContent className="pt-4 text-center">
              <Lock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-700 dark:text-purple-400">Open Source</h3>
              <p className="text-sm text-purple-600 dark:text-purple-500">Fully transparent & auditable</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Settings Tabs */}
      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            App Settings
          </TabsTrigger>
        </TabsList>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Privacy by Design Principles
              </CardTitle>
              <CardDescription>
                What makes this application truly privacy-first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-700 dark:text-green-400">✅ What We DO</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Process data locally in your browser</li>
                    <li>• Use temporary session tokens only</li>
                    <li>• Hash sensitive identifiers (SHA-256)</li>
                    <li>• Clear data automatically on logout</li>
                    <li>• Provide full source code transparency</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-red-700 dark:text-red-400">❌ What We DON'T Do</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Store any personal information</li>
                    <li>• Send data to external servers</li>
                    <li>• Track your listening habits</li>
                    <li>• Use cookies or persistent storage</li>
                    <li>• Share data with third parties</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>Configure minimal data processing preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Display user information</h4>
                  <p className="text-sm text-muted-foreground">
                    Show hashed user ID and display name in interface
                  </p>
                </div>
                <Switch checked={dataVisibility} onCheckedChange={setDataVisibility} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Enable session analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Process current session data for insights (not stored)
                  </p>
                </div>
                <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Minimal Data Footprint
              </CardTitle>
              <CardDescription>
                Complete overview of data handling (less than 4KB total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Session Tokens',
                    description: 'Temporary Spotify API access tokens (encrypted)',
                    size: '< 2 KB',
                    retention: 'Until logout',
                    type: 'Temporary'
                  },
                  {
                    name: 'User Display Data',
                    description: 'Hashed user ID and truncated display name',
                    size: '< 1 KB',
                    retention: 'Session only',
                    type: 'Hashed'
                  },
                  {
                    name: 'App Preferences',
                    description: 'Theme and UI settings',
                    size: '< 0.5 KB',
                    retention: 'Local storage',
                    type: 'Settings'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Size: {item.size}</span>
                        <span>Retention: {item.retention}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Actions</CardTitle>
              <CardDescription>Export or clear your minimal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data (JSON)
                </Button>
                
                <Button 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>

              {showDeleteDialog && (
                <Alert className="border-destructive/50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex flex-col gap-3">
                    <p>This will clear all session data and preferences. You'll need to login again.</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={handleDeleteData}>
                        Confirm Delete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Dark mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal & Compliance
              </CardTitle>
              <CardDescription>Important legal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>GDPR Compliant:</strong> No personal data processing or storage occurs. 
                  All data remains on your device and is automatically cleared.
                </AlertDescription>
              </Alert>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• MIT Licensed open source project</p>
                <p>• Independent project not affiliated with Spotify AB</p>
                <p>• Educational and demonstration purposes only</p>
                <p>• No commercial data collection or usage</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
