
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Eye } from 'lucide-react';

export const UserRightsSection = () => {
  const rights = [
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
  ];

  return (
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
          {rights.map((item, index) => (
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
  );
};
