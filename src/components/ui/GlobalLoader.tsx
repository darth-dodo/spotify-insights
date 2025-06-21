import React from 'react';
import { EnhancedLoadingScreen } from './EnhancedLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useAuth } from '@/hooks/useAuth';

export const GlobalLoader = () => {
  const { pct, stage, error: loadingError, setError } = useLoading();
  const { error: authError, user, isLoading } = useAuth();
  const [visible, setVisible] = React.useState(false);
  const [hasTimedOut, setHasTimedOut] = React.useState(false);

  // Only show loader when there's actual loading happening
  React.useEffect(() => {
    const shouldShow = (pct > 0 && pct < 100) || 
                      (isLoading && window.location.pathname.startsWith('/dashboard')) ||
                      (stage !== 'idle' && stage !== undefined);
    
    if (shouldShow && !visible) {
      setVisible(true);
    } else if (!shouldShow && visible && pct >= 100) {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [pct, visible, isLoading, stage]);

  // Hide loader if there are critical errors (but not during initial auth)
  React.useEffect(() => {
    if (authError && !window.location.pathname.startsWith('/dashboard')) {
      setVisible(false);
    }
  }, [authError]);

  // Add timeout to prevent infinite loading (30 seconds)
  React.useEffect(() => {
    if (visible && pct > 0 && pct < 100) {
      const timeout = setTimeout(() => {
        console.warn('Loading timeout reached, hiding loader');
        setHasTimedOut(true);
        setError('Loading took longer than expected. Please refresh the page.');
        setVisible(false);
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, [visible, pct, setError]);

  // Don't show on homepage unless there's actual authentication loading
  if (!visible || 
      (window.location.pathname === '/' && !isLoading && pct === 0) ||
      (window.location.pathname === '/' && !user && stage === 'idle')) {
    return null;
  }

  // Map loading stages to step indices
  const getStepFromStage = (stage: string, pct: number): number => {
    switch (stage) {
      case 'oauth':
        return 0;
      case 'profile':
        return pct < 50 ? 0 : 1;
      case 'library':
        if (pct < 40) return 1;
        if (pct < 70) return 2;
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepFromStage(stage, pct);
  const stepProgress = Math.max(0, Math.min(100, (pct - (currentStep * 25)) * 4));

  return (
    <div className="fixed inset-0 z-[2000] transition-opacity duration-500" style={{ opacity: pct >= 100 ? 0 : 1 }}>
      <EnhancedLoadingScreen
        currentStep={currentStep}
        progress={stepProgress}
        onComplete={() => setVisible(false)}
        showTips={true}
      />
    </div>
  );
}; 