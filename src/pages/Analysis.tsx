import React, { useEffect } from 'react';
import { GlobalLoader } from '@/components/ui/GlobalLoader';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useNavigate } from 'react-router-dom';

export const AnalysisPage = () => {
  const { pct } = useLoading();
  const navigate = useNavigate();

  // Once loading reaches 100 %, redirect to dashboard
  useEffect(() => {
    if (pct >= 100) {
      navigate('/dashboard', { replace: true });
    }
  }, [pct, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <GlobalLoader />
    </div>
  );
}; 