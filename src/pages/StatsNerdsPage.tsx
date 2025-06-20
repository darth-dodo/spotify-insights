import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sigma } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/components/providers/LoadingProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export const StatsNerdsPage = () => {
  const navigate = useNavigate();
  const { setStage } = useLoading();
  React.useEffect(() => setStage('idle'), [setStage]);

  const formulaBlocks = [
    {
      title: 'Play Count',
      code: `if (realPlayDataAvailable) {
  playCount = realPlayCount;
} else {
  const rankFactor = Math.max(1, 100 - index);
  const popularity = (track.popularity ?? 50) / 100;
  const durationFactor = Math.min(1.5, 240000 / (track.duration_ms || 240000));
  const genreMulti = getGenrePlayabilityFactor(track.genres);
  const recent = recentPlays.get(track.id) || 0;
  const userPref = calculateUserPreferenceFactor(track, userPatterns);
  const base = rankFactor*0.3 + popularity*30*0.25 + durationFactor*20*0.15 + recent*5*0.15 + userPref*20*0.15;
  playCount = Math.max(1, Math.round(base * genreMulti));
}`
    },
    {
      title: 'Listening Time (hours)',
      code: `if (realListeningMs) {
  hours = Math.round(realListeningMs / 1000 / 60 / 60 * 10) / 10;
} else {
  const base = Math.max(0.1, (100 - index) * 1.5);
  const popularityBonus = (track.popularity ?? 50) / 100 * 0.5;
  const durationFactor = Math.min(1.2, (track.duration_ms || 180000) / 180000);
  hours = Math.round(base * (1 + popularityBonus) * durationFactor * 10) / 10;
}`
    },
    {
      title: 'Follower Estimate',
      code: `const base10 = 10 ** (3 + (artist.popularity ?? 50) / 100 * 3); // 1K–1M
const followers = Math.floor(base10 * genreMultiplier * Math.max(0.5, 2 - relativeRank));`
    },
    {
      title: 'Discovery Year',
      code: `if (actualDiscoveryDate) {
  year = actualDiscoveryDate.getFullYear();
} else {
  const avgDelay = userPatterns?.avgYearsAfterRelease ?? 2;
  year = Math.min(currentYear, releaseYear + avgDelay);
}`
    },
    {
      title: 'Confidence Score',
      code: `if (observations >= 100) confidence = 'high';
else if (observations >= 20) confidence = 'medium';
else confidence = 'low';`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sigma className="h-6 w-6" /> Stats for Nerds
          </h1>
        </div>

        <ScrollArea className="h-[80vh] pr-2">
          <div className="space-y-6">
            {formulaBlocks.map((b, idx) => (
              <Card key={idx} className="border-primary/10">
                <CardHeader>
                  <CardTitle>{b.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/25 p-4 rounded text-xs overflow-x-auto">
                    <code>{b.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default StatsNerdsPage; 