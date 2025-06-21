import React, { useEffect, useState } from 'react';
import { EnhancedLoadingScreen } from './EnhancedLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useAuth } from '@/hooks/useAuth';

export const GlobalLoader = () => {
  const { pct, stage } = useLoading();
  const { error: authError, isLoading: authLoading } = useAuth();

  const [visible, setVisible] = useState(false);

  // Determine visibility
  useEffect(() => {
    const onIndex = window.location.pathname === '/';
    const shouldShow = ((pct > 0 && pct < 100) || authLoading) && !onIndex;
    if (shouldShow && !visible) setVisible(true);
    if (!shouldShow && visible && pct >= 100) {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [pct, authLoading, visible]);

  // Hide on auth error (outside dashboard)
  useEffect(() => {
    if (authError && !window.location.pathname.startsWith('/dashboard')) {
      setVisible(false);
    }
  }, [authError]);

  if (!visible) return null;

  const stepFromStage = (s: string): number => {
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

  const currentStep = stepFromStage(stage);
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