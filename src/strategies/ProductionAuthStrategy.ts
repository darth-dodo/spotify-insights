
import type { AuthStrategy } from './AuthStrategy';
import type { User } from '@/hooks/useAuthState';

export class ProductionAuthStrategy implements AuthStrategy {
  private userState: User | null = null;
  private loadingState: boolean = false;
  private errorState: string | null = null;
  private setUser: (user: User | null) => void;
  private setLoading: (loading: boolean) => void;
  private setError: (error: string | null) => void;
  private authActions: any;

  constructor(
    user: User | null,
    setUser: (user: User | null) => void,
    loading: boolean,
    setLoading: (loading: boolean) => void,
    error: string | null,
    setError: (error: string | null) => void,
    authActions: any
  ) {
    this.userState = user;
    this.setUser = setUser;
    this.loadingState = loading;
    this.setLoading = setLoading;
    this.errorState = error;
    this.setError = setError;
    this.authActions = authActions;
  }

  async login(): Promise<void> {
    return this.authActions.login();
  }

  logout(): void {
    this.authActions.logout();
  }

  async refreshToken(): Promise<void> {
    return this.authActions.refreshToken();
  }

  getUser(): User | null {
    return this.userState;
  }

  isLoading(): boolean {
    return this.loadingState;
  }

  getError(): string | null {
    return this.errorState;
  }

  clearError(): void {
    this.setError(null);
  }
}
