
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle, Shield, Code } from 'lucide-react';

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
            Privacy-First Music Analytics Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            By using this Spotify Analytics Dashboard, you agree to these Terms of Service. This is an open-source, 
            privacy-first application designed for personal music analytics with zero data collection.
          </p>
        </CardContent>
      </Card>

      {/* Service Description */}
      <Card>
        <CardHeader>
          <CardTitle>What This Service Provides</CardTitle>
          <CardDescription>
            A transparent, privacy-focused music analytics experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                What We Provide:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Local-only music analytics computed in your browser</li>
                <li>• Direct connection to your Spotify account via OAuth 2.0</li>
                <li>• Real-time visualization of your music preferences</li>
                <li>• Complete data transparency and user control</li>
                <li>• Open-source codebase for full auditability</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                What We Do NOT Do:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Store any personal or music data on external servers</li>
                <li>• Share information with third parties</li>
                <li>• Track your behavior or usage patterns</li>
                <li>• Modify your Spotify account or playlists</li>
                <li>• Collect analytics or telemetry data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Your Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Valid Spotify Account</h4>
              <p className="text-sm text-muted-foreground">
                You must have a valid Spotify account and authorize this application through Spotify's OAuth system
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Appropriate Use</h4>
              <p className="text-sm text-muted-foreground">
                Use this service only for personal music analytics. Do not attempt to circumvent rate limits or abuse the Spotify API
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Browser Security</h4>
              <p className="text-sm text-muted-foreground">
                Maintain the security of your browser and devices where you access this application
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Source & Transparency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-accent" />
            Open Source & Transparency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">MIT License</h4>
              <p className="text-sm text-muted-foreground">
                This application is released under the MIT License, allowing you to inspect, modify, and distribute the code
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Code Transparency</h4>
              <p className="text-sm text-muted-foreground">
                All source code is available for inspection, ensuring complete transparency in how your data is handled
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">No Hidden Functionality</h4>
              <p className="text-sm text-muted-foreground">
                The application contains no hidden analytics, tracking, or data collection beyond what is documented
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Limitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Service Limitations & Dependencies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">Spotify API Dependency</h4>
              <p className="text-sm text-muted-foreground">
                This service depends on Spotify's Web API. Service availability is subject to Spotify's terms and API limits
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Data Accuracy</h4>
              <p className="text-sm text-muted-foreground">
                Analytics are based on data provided by Spotify's API and are subject to Spotify's data accuracy and availability
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Browser Requirements</h4>
              <p className="text-sm text-muted-foreground">
                Requires a modern web browser with JavaScript enabled and local storage capabilities
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">No Offline Functionality</h4>
              <p className="text-sm text-muted-foreground">
                This application requires an internet connection to fetch data from Spotify's API
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data Protection */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data Protection Commitment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-green-200 bg-green-50/50 dark:bg-green-900/10 rounded-lg p-4">
            <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Zero Data Collection Policy</h4>
            <p className="text-sm text-green-600 dark:text-green-500">
              This application collects zero personal data. All processing occurs locally in your browser, 
              and only essential session tokens are stored temporarily to maintain functionality.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground">GDPR & Privacy Compliance</h4>
            <p className="text-sm text-muted-foreground">
              By design, this application complies with GDPR and other privacy regulations through its zero-collection approach
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimers */}
      <Card>
        <CardHeader>
          <CardTitle>Disclaimers & Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">No Warranty</h4>
              <p className="text-sm text-muted-foreground">
                This service is provided "as-is" without warranties of any kind, express or implied
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Limitation of Liability</h4>
              <p className="text-sm text-muted-foreground">
                We are not liable for any damages arising from the use of this service or interruptions in Spotify's API
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Spotify Independence</h4>
              <p className="text-sm text-muted-foreground">
                This application is independent and not affiliated with Spotify AB. Spotify's terms and policies apply to your Spotify account usage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes to Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Updates to These Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We may update these Terms of Service to reflect changes in functionality or legal requirements. 
            Any changes will be reflected in the "Last updated" date. Continued use constitutes acceptance of updated terms.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Questions or Concerns</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            For questions about these Terms of Service or to report issues, please use the Help section of the application 
            or review the open-source code for technical details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
