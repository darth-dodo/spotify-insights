
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, Database, Lock, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacySummary = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-foreground">Privacy First</h2>
        </div>
        <p className="text-muted-foreground">
          Your data never leaves your browser. Complete transparency guaranteed.
        </p>
      </div>

      {/* Key Privacy Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
          <CardContent className="pt-4 text-center">
            <Database className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-700 dark:text-green-400 text-sm">Zero Collection</h3>
            <p className="text-xs text-green-600 dark:text-green-500">No personal data stored</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="pt-4 text-center">
            <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 text-sm">Local Processing</h3>
            <p className="text-xs text-blue-600 dark:text-blue-500">Everything runs in your browser</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10">
          <CardContent className="pt-4 text-center">
            <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 text-sm">Full Transparency</h3>
            <p className="text-xs text-purple-600 dark:text-purple-500">Open source & auditable</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10">
          <CardContent className="pt-4 text-center">
            <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-orange-700 dark:text-orange-400 text-sm">GDPR Compliant</h3>
            <p className="text-xs text-orange-600 dark:text-orange-500">Privacy by design</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Footprint */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Minimal Data Footprint
          </CardTitle>
          <CardDescription>
            Total storage: Less than 4KB (smaller than this text!)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm">Session Tokens</h4>
                <p className="text-xs text-muted-foreground">Encrypted OAuth tokens</p>
              </div>
              <div className="text-right">
                <Badge variant="outline">&lt; 2KB</Badge>
                <p className="text-xs text-muted-foreground">Until logout</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm">Display Data</h4>
                <p className="text-xs text-muted-foreground">Hashed user ID only</p>
              </div>
              <div className="text-right">
                <Badge variant="outline">&lt; 1KB</Badge>
                <p className="text-xs text-muted-foreground">Session only</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-sm">App Preferences</h4>
                <p className="text-xs text-muted-foreground">Theme & settings</p>
              </div>
              <div className="text-right">
                <Badge variant="outline">&lt; 0.5KB</Badge>
                <p className="text-xs text-muted-foreground">Local storage</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Guarantee */}
      <Alert className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Guarantee:</strong> Your music data is processed locally in your browser and never transmitted to our servers. 
          We literally cannot access your personal information because we never receive it.
        </AlertDescription>
      </Alert>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          onClick={() => navigate('/legal')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View Complete Privacy Documentation
        </Button>
      </div>
    </div>
  );
};
