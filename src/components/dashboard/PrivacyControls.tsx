
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
      description: "Your data export will be ready shortly. You'll receive an email when it's complete.",
    });
    
    // In production, this would trigger an actual data export
    console.log('Exporting user data...');
  };

  const handleDeleteData = async () => {
    toast({
      title: "Data deletion requested",
      description: "Your data will be permanently deleted within 30 days as required by GDPR.",
      variant: "destructive",
    });
    
    setShowDeleteDialog(false);
    // In production, this would trigger the data deletion process
    console.log('Initiating data deletion...');
  };

  const dataCategories = [
    {
      name: 'Listening History',
      description: 'Your played tracks, timestamps, and listening duration',
      size: '2.4 MB',
      retention: '2 years',
      canDelete: true,
    },
    {
      name: 'User Profile',
      description: 'Basic profile information and preferences',
      size: '15 KB',
      retention: 'Account lifetime',
      canDelete: false,
    },
    {
      name: 'Analytics Data',
      description: 'Aggregated statistics and insights',
      size: '850 KB',
      retention: '1 year',
      canDelete: true,
    },
    {
      name: 'App Settings',
      description: 'Theme preferences and configuration',
      size: '5 KB',
      retention: 'Account lifetime',
      canDelete: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Privacy Controls</h1>
        <p className="text-muted-foreground">
          Manage your data, privacy settings, and understand how your information is used
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
              256-bit
            </div>
            <p className="text-xs text-green-600 dark:text-green-500">
              Encryption standard
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
              3.3 MB
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-500">
              Total data size
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Lock className="h-4 w-4" />
              Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              100%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-500">
              GDPR & CCPA compliant
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
            Control how your data is used and displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Make listening data visible</h4>
              <p className="text-sm text-muted-foreground">
                Allow your listening statistics to be displayed in the dashboard
              </p>
            </div>
            <Switch 
              checked={dataVisibility} 
              onCheckedChange={setDataVisibility}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Enable analytics processing</h4>
              <p className="text-sm text-muted-foreground">
                Process your data to generate insights and recommendations
              </p>
            </div>
            <Switch 
              checked={analyticsEnabled} 
              onCheckedChange={setAnalyticsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Data retention</h4>
              <p className="text-sm text-muted-foreground">
                Store historical data for trend analysis (can be disabled)
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
            Your Data
          </CardTitle>
          <CardDescription>
            Overview of the data we store and how long we keep it
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
                  {category.canDelete ? (
                    <Badge variant="secondary">Deletable</Badge>
                  ) : (
                    <Badge variant="outline">Required</Badge>
                  )}
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
            Export or delete your personal data
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
              Export My Data
            </Button>
            
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete My Data
            </Button>
          </div>

          {showDeleteDialog && (
            <Alert className="border-destructive/50 text-destructive dark:border-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-3">
                <p>
                  <strong>Warning:</strong> This action cannot be undone. All your data including listening history, 
                  preferences, and analytics will be permanently deleted within 30 days.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={handleDeleteData}
                  >
                    Confirm Deletion
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
              <strong>Your privacy is protected:</strong> We use industry-standard encryption, 
              never share your data with third parties, and comply with GDPR and CCPA regulations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Legal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Legal & Compliance</CardTitle>
          <CardDescription>
            Important information about data handling and your rights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Your Rights (GDPR)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Right to access your data</li>
                <li>• Right to rectification</li>
                <li>• Right to erasure</li>
                <li>• Right to data portability</li>
                <li>• Right to withdraw consent</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Data Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• End-to-end encryption</li>
                <li>• Regular security audits</li>
                <li>• Minimal data collection</li>
                <li>• Secure data transmission</li>
                <li>• No third-party tracking</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              For questions about your privacy or to exercise your rights, contact us at privacy@spotifyanalytics.com. 
              View our complete <Button variant="link" className="h-auto p-0 text-xs">Privacy Policy</Button> and 
              <Button variant="link" className="h-auto p-0 text-xs ml-1">Terms of Service</Button>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
