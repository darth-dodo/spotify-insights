import React, { createContext, useContext, useState } from 'react';

export type LoadingStage = 'idle' | 'oauth' | 'profile' | 'library';

interface LoadingState {
  stage: LoadingStage;
  pct: number;
  setStage: (s: LoadingStage) => void;
  bump: (inc: number) => void;
}

const LoadingContext = createContext<LoadingState | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStageState] = useState<LoadingStage>('idle');
  const [pct, setPct] = useState(0);

  const setStage = (s: LoadingStage) => {
    setStageState(s);
    switch (s) {
      case 'oauth':
        setPct(10);
        break;
      case 'profile':
        setPct((p) => (p < 30 ? 30 : p));
        break;
      case 'library':
        if (pct < 30) setPct(30);
        break;
      case 'idle':
      default:
        setPct(0);
    }
  };

  const bump = (inc: number) => {
    setPct((p) => Math.min(100, p + inc));
  };

  return (
    <LoadingContext.Provider value={{ stage, pct, setStage, bump }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}; 