import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataQualityBadge } from '@/components/ui/DataQualityBadge';
import { ArrowLeft, Target, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useAuth } from '@/hooks/useAuth';

export const DataQualityPage = () => {
  const navigate = useNavigate();
  const { setStage } = useLoading();
  const { user } = useAuth();

  const qualityExamples = [
    { source: 'api', confidence: 'high', label: '🎯 Direct from Spotify API' },
    { source: 'real-time', confidence: 'high', label: '⚡ Captured in real-time' },
    { source: 'calculated', confidence: 'medium', label: '📊 Smart calculation' },
    { source: 'estimated', confidence: 'low', label: '📈 Rough estimate' }
  ] as const;

  // Ensure global loader is hidden on static info page
  React.useEffect(() => {
    setStage('idle');
  }, [setStage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (history.length > 1) {
                navigate(-1);
              } else {
                navigate(user ? '/dashboard' : '/');
              }
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Data Quality Guide</h1>
            <p className="text-muted-foreground">How we grade & display the reliability of every metric</p>
          </div>
        </div>

        {/* Badge Key */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Badge Key
            </CardTitle>
            <CardDescription>
              Each badge combines a source emoji + a confidence colour so you instantly know how trustworthy a number is.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {qualityExamples.map((q, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
                <DataQualityBadge
                  quality={{
                    source: q.source as any,
                    confidence: q.confidence as any,
                    lastUpdated: new Date(),
                    sampleSize: q.source === 'api' ? 200 : 5
                  }}
                  size="md"
                />
                <div>
                  <div className="font-medium text-sm">{q.label}</div>
                  <p className="text-xs text-muted-foreground capitalize">confidence: {q.confidence}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* How Confidence Is Calculated */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Confidence Scores</CardTitle>
            <CardDescription>Behind the scenes calculation logic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong>High confidence</strong> (green) – direct API data or ≥ 100 real observations.</p>
            <p><strong>Medium confidence</strong> (yellow) – smart calculation backed by 20-99 real observations.</p>
            <p><strong>Low confidence</strong> (orange) – early-stage estimate with &lt; 20 observations or pure heuristic.</p>
            <p>The badge will automatically upgrade as you listen and the app collects more real-time data.</p>
          </CardContent>
        </Card>

        {/* Stats for Nerds CTA */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧮 Stats for Nerds
            </CardTitle>
            <CardDescription>
              Dive into the nitty-gritty formulas behind every metric.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/stats-nerds')}>
              View Full Formula Reference
            </Button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-1">Why can't everything be high confidence?</h4>
              <p>Spotify's public API doesn't expose certain metrics (eg. total play counts). We fill the gaps with real-time tracking and intelligent estimation.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">How long until estimates improve?</h4>
              <p>Usually a few listening sessions. The more you use the app, the quicker badges turn from 📈 to ⚡.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Can I hide estimated data?</h4>
              <p>Not yet, but filters are on our roadmap. Meanwhile, rely on the badge colour & tooltip to gauge reliability.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataQualityPage; 