
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  loginComponent: React.ReactNode;
  dashboardComponent: React.ReactNode;
}

export const AuthGuard = ({ loginComponent, dashboardComponent }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent rounded-full border-t-transparent" />
      </div>
    );
  }

  return user ? <>{dashboardComponent}</> : <>{loginComponent}</>;
};
