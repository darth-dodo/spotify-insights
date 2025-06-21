import React, { useEffect, useState } from 'react';
import { EnhancedLoadingScreen } from './EnhancedLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useAuth } from '@/hooks/useAuth';

export const GlobalLoader = () => {
  const { pct, stage, error: loadingError, setError } = useLoading();
  const { error: authError, isLoading: authLoading, user } = useAuth();

  const [visible, setVisible] = useState(false);

  // Determine when the loader should be shown or hidden
  useEffect(() => {
    const shouldShow = (pct > 0 && pct < 100) || authLoading;

    if (shouldShow && !visible) {
      setVisible(true);
    }

    if (!shouldShow && visible && pct >= 100) {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [pct, authLoading, visible]);

  // Hide loader if a critical auth error occurs on non-dashboard routes
  useEffect(() => {
    if (authError && !window.location.pathname.startsWith('/dashboard')) {
      setVisible(false);
    }
  }, [authError]);

  // Timeout guard – dismiss loader after 30 s and surface message
  useEffect(() => {
    if (!visible) return;

    const timeout = setTimeout(() => {
      if (pct < 100) {
        console.warn('GlobalLoader timeout – hiding overlay');
        setVisible(false);
        setError('Loading is taking longer than expected. Please try refreshing the page.');
      }
    }, 30_000);

    return () => clearTimeout(timeout);
  }, [visible, pct, setError]);

  if (!visible) return null;

  // Map loading stages to step indices for the progressive loader
  const getStepFromStage = (s: string): number => {
    switch (s) {
      case 'oauth':
        return 0;
      case 'profile':
        return 1;
      case 'library':
        return 2;
      default:
        return 0;
    }
  };

  const currentStep = getStepFromStage(stage);
  const stepProgress = Math.max(0, Math.min(100, pct - currentStep * 25));

  return (
    <div
      className="fixed inset-0 z-[2000] transition-opacity duration-500"
      style={{ opacity: pct >= 100 ? 0 : 1 }}
    >
      <EnhancedLoadingScreen
        currentStep={currentStep}
        progress={stepProgress}
        onComplete={() => setVisible(false)}
        showTips
      />
    </div>
  );
}; 