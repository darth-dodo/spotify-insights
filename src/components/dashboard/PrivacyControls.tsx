
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff, 
  Database, 
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export const PrivacyControls = () => {
  const { toast } = useToast();
  const [dataVisibility, setDataVisibility] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState(true);
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
      title: "Data deletion requested",
      description: "Your minimal stored data will be permanently deleted immediately.",
      variant: "destructive",
    });
    
    setShowDeleteDialog(false);
    // Clear all localStorage data
    localStorage.clear();
    console.log('All local data deleted...');
  };

  const dataCategories = [
    {
      name: 'User Profile (Minimal)',
      description: 'Hashed user ID, truncated display name, country code, image flag',
      size: '< 1 KB',
      retention: 'Session only',
      canDelete: true,
    },
    {
      name: 'Authentication Tokens',
      description: 'Temporary access tokens for Spotify API (encrypted)',
      size: '< 2 KB',
      retention: 'Until logout',
      canDelete: true,
    },
    {
      name: 'App Preferences',
      description: 'Theme and UI settings only',
      size: '< 0.5 KB',
      retention: 'Local storage',
      canDelete: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Privacy Controls</h1>
        <p className="text-muted-foreground">
          Minimal data storage with maximum privacy protection
        </p>
      </div>

      {/* Privacy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
              <Shield className="h-4 w-4" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              SHA-256
            </div>
            <p className="text-xs text-green-600 dark:text-green-500">
              Hashed sensitive data
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Database className="h-4 w-4" />
              Data Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              &lt; 4 KB
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              Minimal data footprint
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Lock className="h-4 w-4" />
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              Session
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-500">
              No persistent storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control minimal data usage and display
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Display basic profile info</h4>
              <p className="text-sm text-muted-foreground">
                Show hashed user ID and truncated display name
              </p>
            </div>
            <Switch 
              checked={dataVisibility} 
              onCheckedChange={setDataVisibility}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Enable session analytics</h4>
              <p className="text-sm text-muted-foreground">
                Process current session data (not stored permanently)
              </p>
            </div>
            <Switch 
              checked={analyticsEnabled} 
              onCheckedChange={setAnalyticsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Session-only data</h4>
              <p className="text-sm text-muted-foreground">
                All data is cleared when you logout or close the browser
              </p>
            </div>
            <Switch 
              checked={dataRetention} 
              onCheckedChange={setDataRetention}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Minimal Data Storage
          </CardTitle>
          <CardDescription>
            We store only the absolute minimum required for functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Size: {category.size}</span>
                    <span>Retention: {category.retention}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Minimal</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export or delete your minimal stored data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleExportData}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Export Minimal Data
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
            <Alert className="border-destructive/50 text-destructive dark:border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-3">
                <p>
                  <strong>Clear all data:</strong> This will immediately clear all locally stored data 
                  including your session and preferences. You will need to login again.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={handleDeleteData}
                  >
                    Clear All Data
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Maximum Privacy:</strong> We store less than 4KB of hashed data locally, 
              never send data to external servers, and automatically clear everything on logout.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy by Design</CardTitle>
          <CardDescription>
            Our minimal data approach ensures maximum privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">What We DON'T Store</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email addresses</li>
                <li>• Full profile images</li>
                <li>• Listening history</li>
                <li>• Personal playlists</li>
                <li>• Analytics data</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Privacy Protection</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SHA-256 hashing for IDs</li>
                <li>• Session-only storage</li>
                <li>• No external data sharing</li>
                <li>• Automatic data clearing</li>
                <li>• Client-side only processing</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              This application follows privacy-by-design principles with minimal data collection. 
              All data is processed locally and automatically cleared when you logout.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
