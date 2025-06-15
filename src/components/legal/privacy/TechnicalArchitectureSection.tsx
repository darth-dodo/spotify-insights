
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

export const TechnicalArchitectureSection = () => {
  return (
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
  );
};
