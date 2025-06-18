import React from 'react';
import { DataLoadingScreen } from './DataLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';

export const GlobalLoader = () => {
  const { pct, stage } = useLoading();
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (pct >= 100 && visible) {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
    if (pct < 100 && !visible) {
      setVisible(true);
    }
  }, [pct, visible]);

  if (!visible || pct === 0) return null;

  const messages: Record<string, string> = {
    oauth: 'Connecting your account…',
    profile: 'Fetching your profile…',
    library: 'Building your music universe…',
    idle: 'Loading…',
  };

  return (
    <div className="fixed inset-0 z-[2000] transition-opacity duration-300" style={{ opacity: pct >= 100 ? 0 : 1 }}>
      <DataLoadingScreen message={messages[stage]} forcedPct={pct} />
    </div>
  );
}; 