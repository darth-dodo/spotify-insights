
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            Agreement to Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            By using the Spotify Analytics Dashboard, you agree to these Terms of Service. 
            This application is provided as-is for personal music analytics and insights.
          </p>
        </CardContent>
      </Card>

      {/* Service Description */}
      <Card>
        <CardHeader>
          <CardTitle>Service Description</CardTitle>
          <CardDescription>
            What this application does and doesn't do
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground mb-2">Our Service Provides:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personal analytics based on your Spotify listening data</li>
                <li>• Visualization of your music preferences and trends</li>
                <li>• Privacy-focused data processing with minimal storage</li>
                <li>• Local-only data storage with no external sharing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">Our Service Does NOT:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Store your data on external servers</li>
                <li>• Share your information with third parties</li>
                <li>• Modify your Spotify account or playlists</li>
                <li>• Collect personal information beyond what's necessary</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-accent" />
            Your Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Spotify Account</h4>
              <p className="text-sm text-muted-foreground">
                You must have a valid Spotify account and authorize our application to access your data
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Appropriate Use</h4>
              <p className="text-sm text-muted-foreground">
                Use this service only for personal analytics and insights. Do not attempt to reverse engineer or misuse the application
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Data Management</h4>
              <p className="text-sm text-muted-foreground">
                You are responsible for managing your data permissions through Spotify and can revoke access at any time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Privacy & Data Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h4 className="font-medium text-foreground">Minimal Data Collection</h4>
              <p className="text-sm text-muted-foreground">
                We collect only the minimum data necessary: basic profile info (hashed), top tracks/artists, and recent listening history
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Local Storage Only</h4>
              <p className="text-sm text-muted-foreground">
                All data is stored locally in your browser and automatically deleted when you logout
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">No External Sharing</h4>
              <p className="text-sm text-muted-foreground">
                We never share, sell, or transmit your data to external parties or analytics services
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Service Limitations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Data Accuracy</h4>
              <p className="text-sm text-muted-foreground">
                Analytics are based on data provided by Spotify's API. We cannot guarantee complete accuracy of all metrics
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Service Availability</h4>
              <p className="text-sm text-muted-foreground">
                Service availability depends on Spotify's API. We are not responsible for Spotify service outages
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Browser Compatibility</h4>
              <p className="text-sm text-muted-foreground">
                This application requires a modern web browser with local storage capabilities
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimers */}
      <Card>
        <CardHeader>
          <CardTitle>Disclaimers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">No Warranty</h4>
              <p className="text-sm text-muted-foreground">
                This service is provided "as-is" without any warranties, express or implied
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Limitation of Liability</h4>
              <p className="text-sm text-muted-foreground">
                We are not liable for any damages arising from the use of this service
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Third-Party Services</h4>
              <p className="text-sm text-muted-foreground">
                We are not responsible for Spotify's terms of service or data handling practices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes to Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Changes to Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We may update these Terms of Service from time to time. Any changes will be reflected 
            in the "Last updated" date above. Continued use of the service constitutes acceptance of updated terms.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For questions about these Terms of Service, please use the Help & Security section of the application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
