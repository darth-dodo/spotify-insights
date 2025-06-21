import React, { createContext, useContext, useState } from 'react';

export type LoadingStage = 'idle' | 'oauth' | 'profile' | 'library';

interface LoadingState {
  stage: LoadingStage;
  pct: number;
  error: string | null;
  isLoadingData: boolean;
  setStage: (s: LoadingStage) => void;
  bump: (inc: number) => void;
  setError: (error: string | null) => void;
  setIsLoadingData: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingState | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStageState] = useState<LoadingStage>('idle');
  const [pct, setPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const setStage = (s: LoadingStage) => {
    setStageState(s);
    // Clear errors when progressing to new stages
    if (s !== 'idle') {
      setError(null);
    }
    
    switch (s) {
      case 'oauth':
        setPct(10);
        setIsLoadingData(true);
        break;
      case 'profile':
        setPct((p) => (p < 30 ? 30 : p));
        setIsLoadingData(true);
        break;
      case 'library':
        if (pct < 30) setPct(30);
        setIsLoadingData(true);
        break;
      case 'idle':
      default:
        setPct(0);
        setIsLoadingData(false);
    }
  };

  const bump = (inc: number) => {
    setPct((p) => Math.min(100, p + inc));
    // Complete loading when reaching 100%
    if (pct + inc >= 100) {
      setIsLoadingData(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ 
      stage, 
      pct, 
      error, 
      isLoadingData,
      setStage, 
      bump, 
      setError,
      setIsLoadingData
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}; 