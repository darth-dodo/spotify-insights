
import { SpotifyPlaybackCore } from './spotify-playback-core';
import { PlaybackSessionManager } from './spotify-playback-session';
import { shouldEnablePlaybackFeatures } from './auth/spotify-auth-core';
import type { HeatmapDay } from './spotify-playback-types';

export class SpotifyPlaybackManager {
  private core: SpotifyPlaybackCore;
  private sessionManager: PlaybackSessionManager;
  
  constructor() {
    this.sessionManager = new PlaybackSessionManager();
    this.core = new SpotifyPlaybackCore(this.sessionManager);
    
    // Only initialize if we have a token, playback features are enabled, and we're not in demo mode
    const token = localStorage.getItem('spotify_access_token');
    const isRootPathWithoutAuth = window.location.pathname === '/' && !token;
    const playbackEnabled = shouldEnablePlaybackFeatures();
    
    if (token && !isRootPathWithoutAuth && playbackEnabled) {
      // Delay initialization slightly to ensure callback is ready
      setTimeout(() => {
        this.core.initialize();
      }, 100);
    } else {
      console.log('Spotify SDK initialization skipped - playback features disabled or no permissions');
    }
  }

  // Public method to manually initialize when token becomes available
  async initializeWithToken(): Promise<void> {
    if (!this.core.isConnected() && !this.initializationAttempted()) {
      await this.core.initialize();
    }
  }

  // Public methods that delegate to session manager
  generateLocalHeatmapData(): HeatmapDay[] {
    return this.sessionManager.generateLocalHeatmapData();
  }

  getSessionStats() {
    return {
      ...this.sessionManager.getSessionStats(),
      isActive: this.core.isConnected() && this.sessionManager.getSessionStats().isActive
    };
  }

  getSessionTracks() {
    return this.sessionManager.getSessionTracks();
  }

  startSession(): void {
    console.log('Starting new listening session');
  }

  clearSessionData(): void {
    this.sessionManager.clearSessionData();
  }

  disconnect(): void {
    this.core.disconnect();
    this.sessionManager.clearSessionData();
  }

  isConnected(): boolean {
    return this.core.isConnected();
  }

  getDeviceId(): string {
    return this.core.getDeviceId();
  }

  private initializationAttempted(): boolean {
    // We need to add a way to check this from the core
    return false; // Simplified for now
  }
}
