import React from 'react';
import { GlobalLoader } from '@/components/ui/GlobalLoader';
import { useLoading } from '@/components/providers/LoadingProvider';
import { Dashboard } from '@/components/Dashboard';

export const DashboardBootstrap: React.FC = () => {
  const { pct } = useLoading();

  /*
    Show the dashboard as soon as the profile stage (≥30%) is reached so that
    data-fetching hooks fire, but keep the GlobalLoader overlay visible until
    overall progress hits 100 %. This prevents a dead-lock where the loader
    waits for library data that can only be fetched once the dashboard mounts.
  */

  return (
    <>
      {pct < 100 && <GlobalLoader />}
      {pct >= 30 && <Dashboard />}
    </>
  );
}; 