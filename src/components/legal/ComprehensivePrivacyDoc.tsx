
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  FileText,
  Globe,
  Lock,
  CheckCircle
} from 'lucide-react';
import { PrivacyPrinciplesSection } from './privacy/PrivacyPrinciplesSection';
import { TechnicalArchitectureSection } from './privacy/TechnicalArchitectureSection';
import { UserRightsSection } from './privacy/UserRightsSection';

export const ComprehensivePrivacyDoc = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-accent" />
          <h1 className="text-4xl font-bold text-foreground">Complete Data Privacy Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive technical and legal overview of our privacy-by-design architecture, 
          data handling practices, and user rights protection mechanisms.
        </p>
      </div>

      {/* Privacy Principles */}
      <PrivacyPrinciplesSection />

      {/* Technical Architecture */}
      <TechnicalArchitectureSection />

      {/* Data Handling Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600" />
            Detailed Data Handling Practices
          </CardTitle>
          <CardDescription>
            Complete breakdown of how different types of data are processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                category: 'Spotify API Data',
                description: 'Music listening data from Spotify',
                processing: 'Fetched via API, processed locally, never stored',
                retention: 'Memory only during session',
                encryption: 'HTTPS in transit, not stored',
                purpose: 'Generate analytics and visualizations'
              },
              {
                category: 'Authentication Tokens',
                description: 'OAuth access and refresh tokens',
                processing: 'Stored in browser memory temporarily',
                retention: 'Until logout or token expiry',
                encryption: 'Encrypted by browser, HTTPS in transit',
                purpose: 'Authenticate with Spotify API'
              },
              {
                category: 'User Preferences',
                description: 'Theme, language, and UI settings',
                processing: 'Stored in browser localStorage',
                retention: 'Until manually cleared',
                encryption: 'Browser-level encryption',
                purpose: 'Personalize user experience'
              },
              {
                category: 'Session State',
                description: 'Current page, filters, and selections',
                processing: 'Stored in browser memory',
                retention: 'Current session only',
                encryption: 'Memory-based, not persistent',
                purpose: 'Maintain UI state during use'
              }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{item.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Description:</span>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Processing:</span>
                    <p>{item.processing}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Retention:</span>
                    <p>{item.retention}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Encryption:</span>
                    <p>{item.encryption}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-muted-foreground">Purpose:</span>
                    <p>{item.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-yellow-600" />
            Legal Compliance & Regulations
          </CardTitle>
          <CardDescription>
            How our architecture complies with international privacy laws
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700 dark:text-blue-400">GDPR Compliance</h4>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>Data Minimization:</strong> Only process necessary data</li>
                <li>✅ <strong>Purpose Limitation:</strong> Data used only for stated purpose</li>
                <li>✅ <strong>Storage Limitation:</strong> No long-term data storage</li>
                <li>✅ <strong>Transparency:</strong> Clear data processing information</li>
                <li>✅ <strong>User Control:</strong> Complete data access and deletion</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700 dark:text-green-400">CCPA Compliance</h4>
              <ul className="text-sm space-y-2">
                <li>✅ <strong>No Sale of Data:</strong> We never sell user data</li>
                <li>✅ <strong>Data Access Rights:</strong> Full transparency provided</li>
                <li>✅ <strong>Deletion Rights:</strong> Immediate data removal</li>
                <li>✅ <strong>Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                <li>✅ <strong>Notice at Collection:</strong> Clear privacy information</li>
              </ul>
            </div>
          </div>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Compliance Advantage:</strong> Our zero-collection architecture automatically ensures 
              compliance with GDPR, CCPA, and most international privacy regulations, as we simply don't 
              collect or store the types of data that these laws regulate.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* User Rights */}
      <UserRightsSection />

      {/* Security Measures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-red-600" />
            Security & Protection Measures
          </CardTitle>
          <CardDescription>
            Technical security measures protecting your data and privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Transport Security</h4>
              <ul className="text-sm space-y-1">
                <li>• TLS 1.3 encryption for all communications</li>
                <li>• HTTPS-only policy enforced</li>
                <li>• Certificate pinning for API calls</li>
                <li>• Secure WebSocket connections</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Application Security</h4>
              <ul className="text-sm space-y-1">
                <li>• Content Security Policy (CSP) headers</li>
                <li>• XSS protection mechanisms</li>
                <li>• CSRF token validation</li>
                <li>• Secure authentication flows</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Data Protection</h4>
              <ul className="text-sm space-y-1">
                <li>• Zero-knowledge architecture</li>
                <li>• Client-side encryption when needed</li>
                <li>• Automatic session cleanup</li>
                <li>• Memory-safe data handling</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Infrastructure Security</h4>
              <ul className="text-sm space-y-1">
                <li>• Minimal server-side components</li>
                <li>• Static site hosting security</li>
                <li>• CDN protection and caching</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Policy Updates</CardTitle>
          <CardDescription>
            How to reach us and stay informed about privacy policy changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Privacy Inquiries</h4>
              <p className="text-sm text-muted-foreground mb-3">
                For questions about our privacy practices or to exercise your rights:
              </p>
              <ul className="text-sm space-y-1">
                <li>• GitHub Issues: Technical questions</li>
                <li>• Documentation: This comprehensive guide</li>
                <li>• Open Source: Full code transparency</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Policy Updates</h4>
              <p className="text-sm text-muted-foreground mb-3">
                We will notify users of any privacy policy changes through:
              </p>
              <ul className="text-sm space-y-1">
                <li>• In-app notifications</li>
                <li>• GitHub repository updates</li>
                <li>• Version control documentation</li>
                <li>• Prominent website notices</li>
              </ul>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Last Updated:</strong> June 15, 2025
            </p>
            <p className="text-xs text-muted-foreground">
              This privacy documentation reflects our current practices and is updated regularly to ensure accuracy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
