import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Sigma, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/components/providers/LoadingProvider';

/**
 * MetricCalculationsPage
 * A human-friendly walkthrough of how we calculate each core insight.
 */
export const MetricCalculationsPage = () => {
  const navigate = useNavigate();
  const { setStage } = useLoading();
  React.useEffect(() => setStage('idle'), [setStage]);

  const sections = [
    {
      title: 'Play Count',
      icon: <Sigma className="h-5 w-5 text-accent" />,
      content: (
        <>
          <p>
            Whenever possible, we use Spotify&apos;s <strong>real playback events</strong> captured by our
            enhanced session tracker – every time you press play, pause, skip or finish a song we log it (fully
            offline, only in your browser).
          </p>
          <p className="mt-2">
            If a track hasn&apos;t been played recently, we build an <em>estimated count</em> that factors in its
            position in your top list, Spotify&apos;s popularity score, the song&apos;s duration and how often you
            typically replay similar songs. As soon as live data arrives the estimate is replaced by the real
            tally.
          </p>
        </>
      )
    },
    {
      title: 'Listening Time',
      icon: <Sigma className="h-5 w-5 text-accent" />,
      content: (
        <>
          <p>
            Listening time is simply <code>milliseconds ÷ 3,600,000</code> converted to hours and rounded to
            one decimal place. When missing, we approximate by multiplying the estimated play count with the
            track&apos;s duration.
          </p>
        </>
      )
    },
    {
      title: 'Follower Estimate',
      icon: <Sigma className="h-5 w-5 text-accent" />,
      content: (
        <>
          <p>
            Spotify only shares follower counts in limited endpoints. To approximate an artist&apos;s total
            followers we combine their global <em>popularity score</em> (0-100) with genre-level popularity and
            your personal affinity (how highly they rank in your library). The scale is logarithmic, so moving
            from 10&nbsp;k → 100&nbsp;k followers requires much more than 100 → 1&nbsp;k.
          </p>
        </>
      )
    },
    {
      title: 'Discovery Year',
      icon: <Sigma className="h-5 w-5 text-accent" />,
      content: (
        <>
          <p>
            When we have an exact timestamp (captured by the tracker) we display the year you first played the
            song. Otherwise, we assume you tend to discover music <code>1-3 years</code> after release and
            refine the guess with your historic listening patterns.
          </p>
        </>
      )
    },
    {
      title: 'Confidence Score',
      icon: <Info className="h-5 w-5 text-accent" />,
      content: (
        <>
          <p>
            Each metric earns points for <strong>real observations</strong> and draws from its
            <em>source quality</em>. Over 100 observations yields <span className="text-green-600">high
            confidence</span>, 20-99 is <span className="text-yellow-600">medium</span>, anything below 20 (or
            purely heuristic) shows <span className="text-orange-500">low</span> confidence. Badges upgrade
            automatically as more data is collected.
          </p>
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sigma className="h-6 w-6" /> Metric Calculations Explained
            </h1>
            <p className="text-muted-foreground">
              A friendly walkthrough of how we crunch the numbers behind your insights.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s, i) => (
            <Card key={i} className="border-primary/10">
              <CardHeader className="flex items-center gap-2">
                {s.icon}
                <CardTitle>{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {s.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricCalculationsPage; 