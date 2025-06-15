
import { SpotifyPlaybackManager } from './spotify-playback-manager';
import type { PlaybackState, HeatmapDay } from './spotify-playback-types';

export class SpotifyPlaybackSDK {
  private manager: SpotifyPlaybackManager;
  
  constructor() {
    this.manager = new SpotifyPlaybackManager();
  }

  // Public method to manually initialize when token becomes available
  async initializeWithToken(): Promise<void> {
    return this.manager.initializeWithToken();
  }

  // Public methods that delegate to manager
  generateLocalHeatmapData(): HeatmapDay[] {
    return this.manager.generateLocalHeatmapData();
  }

  getSessionStats() {
    return this.manager.getSessionStats();
  }

  getSessionTracks() {
    return this.manager.getSessionTracks();
  }

  startSession(): void {
    this.manager.startSession();
  }

  clearSessionData(): void {
    this.manager.clearSessionData();
  }

  disconnect(): void {
    this.manager.disconnect();
  }

  isConnected(): boolean {
    return this.manager.isConnected();
  }

  getDeviceId(): string {
    return this.manager.getDeviceId();
  }
}

export const spotifyPlaybackSDK = new SpotifyPlaybackSDK();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  try {
    spotifyPlaybackSDK.disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});

// Re-export types
export type { PlaybackState, LocalPlaybackSession, SessionTrack, HeatmapDay } from './spotify-playback-types';
