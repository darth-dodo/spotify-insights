
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Database, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Server,
  FileText,
  Globe
} from 'lucide-react';

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Core Privacy Principles
          </CardTitle>
          <CardDescription>
            Fundamental principles that guide every aspect of our application design
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">✅ Privacy by Design</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Zero data collection architecture from ground up</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Client-side processing for all analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automatic data cleanup on logout</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No persistent storage of personal data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Open-source transparency</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">❌ What We Never Do</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Store personal information on servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Track users across sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Share data with third parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Use cookies for tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Implement analytics or monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Architecture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Technical Privacy Architecture
          </CardTitle>
          <CardDescription>
            Detailed technical implementation of privacy-preserving features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
              <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Client-Side Processing</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• All Spotify data processing happens in your browser</li>
                <li>• JavaScript analytics calculations run locally</li>
                <li>• No server-side data processing or storage</li>
                <li>• Complete data isolation per user session</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50/50 dark:bg-green-900/10">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">Authentication Flow</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• OAuth 2.0 flow directly with Spotify</li>
                <li>• Temporary access tokens stored in browser memory only</li>
                <li>• No token storage on our servers</li>
                <li>• Automatic token cleanup on logout</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-purple-50/50 dark:bg-purple-900/10">
              <h4 className="font-semibold mb-3 text-purple-700 dark:text-purple-400">Data Encryption</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• SHA-256 hashing for any stored identifiers</li>
                <li>• HTTPS encryption for all API communications</li>
                <li>• No plaintext storage of sensitive data</li>
                <li>• Cryptographic data anonymization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-green-600" />
            Your Privacy Rights & Controls
          </CardTitle>
          <CardDescription>
            Complete overview of your privacy rights and how to exercise them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {[
              {
                right: 'Right to Access',
                description: 'See what data we process about you',
                action: 'Export function provides complete data overview',
                timeframe: 'Instant'
              },
              {
                right: 'Right to Deletion',
                description: 'Remove all your data immediately',
                action: 'Clear data button removes everything',
                timeframe: 'Immediate'
              },
              {
                right: 'Right to Portability',
                description: 'Export your data in standard format',
                action: 'JSON export of all session data',
                timeframe: 'Instant download'
              },
              {
                right: 'Right to Rectification',
                description: 'Correct inaccurate data',
                action: 'Re-authenticate with Spotify for fresh data',
                timeframe: 'Real-time'
              },
              {
                right: 'Right to Object',
                description: 'Stop data processing',
                action: 'Logout immediately stops all processing',
                timeframe: 'Immediate'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.right}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                    <Badge variant="outline">{item.action}</Badge>
                    <span className="text-muted-foreground">• {item.timeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
