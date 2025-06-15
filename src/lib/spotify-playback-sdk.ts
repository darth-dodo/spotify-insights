
import { PlaybackSessionManager } from './spotify-playback-session';
import type { PlaybackState, HeatmapDay } from './spotify-playback-types';

export class SpotifyPlaybackSDK {
  private player: any = null;
  private deviceId: string = '';
  private isInitialized: boolean = false;
  private sessionManager: PlaybackSessionManager;
  
  constructor() {
    this.sessionManager = new PlaybackSessionManager();
    this.initializeSDK();
  }

  private async initializeSDK() {
    if (this.isInitialized) return;

    if (!window.Spotify) {
      await this.loadSDKScript();
    }

    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.warn('No access token available for Web Playback SDK');
      return;
    }

    await this.initializePlayer(token);
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
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Spotify Web Playback SDK'));
      
      document.head.appendChild(script);
    });
  }

  private async initializePlayer(token: string) {
    if (!window.Spotify?.Player) {
      throw new Error('Spotify Web Playback SDK not loaded');
    }

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
  }

  private setupEventListeners() {
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
      this.player.disconnect();
      this.player = null;
    }
    this.sessionManager.clearSessionData();
    this.isInitialized = false;
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

window.addEventListener('beforeunload', () => {
  spotifyPlaybackSDK.disconnect();
});

// Re-export types
export type { PlaybackState, LocalPlaybackSession, SessionTrack, HeatmapDay } from './spotify-playback-types';
