import React from 'react';
import { EnhancedLoadingScreen } from './EnhancedLoadingScreen';
import { useLoading } from '@/components/providers/LoadingProvider';

export const GlobalLoader = () => {
  const { pct, stage } = useLoading();
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (pct >= 100 && visible) {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
    if (pct < 100 && !visible) {
      setVisible(true);
    }
  }, [pct, visible]);

  if (!visible || pct === 0) return null;

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