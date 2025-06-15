
import type { User } from '@/hooks/useAuthState';

export interface AuthStrategy {
  login(): Promise<void>;
  logout(): void;
  refreshToken(): Promise<void>;
  getUser(): User | null;
  isLoading(): boolean;
  getError(): string | null;
  clearError(): void;
}

export interface DataStrategy {
  getTopTracks(limit?: number, timeRange?: string): Promise<any[]>;
  getTopArtists(limit?: number, timeRange?: string): Promise<any[]>;
  getRecentlyPlayed(limit?: number): Promise<any[]>;
  getStats(): any;
  getGenreAnalysis(): any[];
  clearCache(): void;
}
