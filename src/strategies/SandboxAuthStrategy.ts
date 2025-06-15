
import { sanitizeUserData } from '@/lib/data-utils';
import { dummySpotifyUser } from '@/lib/dummy-data';
import type { AuthStrategy } from './AuthStrategy';
import type { User } from '@/hooks/useAuthState';

export class SandboxAuthStrategy implements AuthStrategy {
  private user: User | null = null;
  private loading: boolean = false;
  private error: string | null = null;

  constructor() {
    // Initialize with sandbox user immediately
    this.user = sanitizeUserData(dummySpotifyUser);
  }

  async login(): Promise<void> {
    this.loading = true;
    this.error = null;
    
    // Simulate async login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.user = sanitizeUserData(dummySpotifyUser);
    this.loading = false;
    
    console.log('Sandbox login completed');
  }

  logout(): void {
    this.user = null;
    this.error = null;
    console.log('Sandbox logout completed');
  }

  async refreshToken(): Promise<void> {
    // No-op for sandbox mode
    return Promise.resolve();
  }

  getUser(): User | null {
    return this.user;
  }

  isLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }

  clearError(): void {
    this.error = null;
  }
}
