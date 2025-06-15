
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';
import { TermsOfService } from '@/components/legal/TermsOfService';
import { ComprehensivePrivacyDoc } from '@/components/legal/ComprehensivePrivacyDoc';

export const LegalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Legal Information</h1>
              <p className="text-sm text-muted-foreground">
                Privacy Policy, Terms of Service, and Data Privacy Details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="privacy-comprehensive" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="privacy-comprehensive">Data Privacy</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            </TabsList>
            
            <TabsContent value="privacy-comprehensive" className="space-y-6">
              <ComprehensivePrivacyDoc />
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-6">
              <PrivacyPolicy />
            </TabsContent>
            
            <TabsContent value="terms" className="space-y-6">
              <TermsOfService />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
