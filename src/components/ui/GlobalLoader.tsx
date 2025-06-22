import React, { useEffect, useState } from 'react';
import { EnhancedLoadingScreen } from './EnhancedLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useAuth } from '@/hooks/useAuth';

export const GlobalLoader = () => {
  const { pct, stage } = useLoading();
  const { error: authError, isLoading: authLoading } = useAuth();

  const [visible, setVisible] = useState(false);

  // Never render loader on public landing page
  if (typeof window !== 'undefined' && window.location.pathname === '/') {
    return null;
  }

  // Determine visibility
  useEffect(() => {
    const onIndex = window.location.pathname === '/';
    const shouldShow = ((pct > 0 && pct < 100) || authLoading) && !onIndex;
    if (shouldShow && !visible) setVisible(true);
    if (!shouldShow && visible && pct >= 100) {
      const timeout = setTimeout(() => {
        if (pct < 100) {
          console.warn('GlobalLoader timeout – aborting session');
          // Clear relevant localStorage keys
          Object.keys(localStorage)
            .filter((k) => k.startsWith('spotify_') || k === 'user_profile')
            .forEach((k) => localStorage.removeItem(k));

          localStorage.setItem('load_error', 'timeout');

          // Hide overlay and reset app state
          setVisible(false);

          // Navigate to landing page for a fresh start
          window.location.replace('/');
        }
      }, 30_000);
      return () => clearTimeout(timeout);
    }
  }, [pct, authLoading, visible]);

  // Hide on auth error (outside dashboard)
  useEffect(() => {
    if (authError && !window.location.pathname.startsWith('/dashboard')) {
      setVisible(false);
    }
  }, [authError]);

  // Timeout guard (30 s) – if loading not complete redirect to landing
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      if (pct < 100) {
        console.warn('Loader timeout; clearing auth and reloading');
        Object.keys(localStorage)
          .filter((k) => k.startsWith('spotify_') || k === 'user_profile')
          .forEach((k) => localStorage.removeItem(k));
        localStorage.setItem('load_error', 'timeout');
        window.location.replace('/');
      }
    }, 30_000);

    return () => clearTimeout(timer);
  }, [visible, pct]);

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
      style={{ 
        opacity: pct >= 100 ? 0 : 1,
        pointerEvents: pct >= 100 ? 'none' : 'auto'
      }}
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