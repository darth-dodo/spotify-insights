
import { PlaybackSessionManager } from './spotify-playback-session';
import type { PlaybackState, HeatmapDay } from './spotify-playback-types';

export class SpotifyPlaybackSDK {
  private player: any = null;
  private deviceId: string = '';
  private isInitialized: boolean = false;
  private sessionManager: PlaybackSessionManager;
  private initializationAttempted: boolean = false;
  
  constructor() {
    this.sessionManager = new PlaybackSessionManager();
    // Only initialize if we have a token
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      this.initializeSDK();
    } else {
      console.log('Spotify SDK initialization skipped - no access token available');
    }
  }

  private async initializeSDK() {
    if (this.isInitialized || this.initializationAttempted) return;
    
    this.initializationAttempted = true;

    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.warn('Cannot initialize Spotify SDK - no access token available');
      return;
    }

    try {
      if (!window.Spotify) {
        await this.loadSDKScript();
      }

      await this.initializePlayer(token);
    } catch (error) {
      console.error('Failed to initialize Spotify SDK:', error);
      // Don't throw the error to prevent app crashes
    }
  }

  private loadSDKScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="sdk.scdn.co"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      
      const timeout = setTimeout(() => {
        reject(new Error('Spotify SDK script load timeout'));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load Spotify Web Playback SDK'));
      };
      
      document.head.appendChild(script);
    });
  }

  private async initializePlayer(token: string) {
    if (!window.Spotify?.Player) {
      throw new Error('Spotify Web Playback SDK not loaded');
    }

    try {
      this.player = new window.Spotify.Player({
        name: 'Spotify Analytics Dashboard',
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.5
      });

      this.setupEventListeners();

      const success = await this.player.connect();
      if (success) {
        console.log('Successfully connected to Spotify Web Playback SDK');
        this.isInitialized = true;
      } else {
        throw new Error('Failed to connect to Spotify Web Playback SDK');
      }
    } catch (error) {
      console.error('Player initialization failed:', error);
      // Don't throw to prevent app crashes
    }
  }

  private setupEventListeners() {
    if (!this.player) return;

    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
    });

    this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    this.player.addListener('player_state_changed', (state: PlaybackState | null) => {
      if (state) {
        this.sessionManager.processPlaybackStateLocally(state);
      }
    });

    this.player.addListener('initialization_error', ({ message }: { message: string }) => {
      console.error('Failed to initialize:', message);
    });

    this.player.addListener('authentication_error', ({ message }: { message: string }) => {
      console.error('Failed to authenticate:', message);
    });

    this.player.addListener('account_error', ({ message }: { message: string }) => {
      console.error('Failed to validate Spotify account:', message);
    });
  }

  // Public method to manually initialize when token becomes available
  public async initializeWithToken() {
    if (!this.isInitialized && !this.initializationAttempted) {
      await this.initializeSDK();
    }
  }

  // Public methods that delegate to session manager
  generateLocalHeatmapData(): HeatmapDay[] {
    return this.sessionManager.generateLocalHeatmapData();
  }

  getSessionStats() {
    return {
      ...this.sessionManager.getSessionStats(),
      isActive: this.isInitialized && this.sessionManager.getSessionStats().isActive
    };
  }

  getSessionTracks() {
    return this.sessionManager.getSessionTracks();
  }

  startSession(): void {
    console.log('Starting new listening session');
  }

  clearSessionData() {
    this.sessionManager.clearSessionData();
  }

  disconnect() {
    if (this.player) {
      try {
        this.player.disconnect();
      } catch (error) {
        console.error('Error disconnecting player:', error);
      }
      this.player = null;
    }
    this.sessionManager.clearSessionData();
    this.isInitialized = false;
    this.initializationAttempted = false;
    console.log('Disconnected from Web Playback SDK and cleared all data');
  }

  isConnected(): boolean {
    return this.isInitialized;
  }

  getDeviceId(): string {
    return this.deviceId;
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
