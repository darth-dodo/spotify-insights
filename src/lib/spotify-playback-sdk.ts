
import { PlaybackSessionManager } from './spotify-playback-session';
import type { PlaybackState, HeatmapDay } from './spotify-playback-types';

export class SpotifyPlaybackSDK {
  private player: any = null;
  private deviceId: string = '';
  private isInitialized: boolean = false;
  private sessionManager: PlaybackSessionManager;
  private initializationAttempted: boolean = false;
  private sdkLoadPromise: Promise<void> | null = null;
  
  constructor() {
    this.sessionManager = new PlaybackSessionManager();
    // Set up the global callback immediately
    this.setupGlobalCallback();
    
    // Only initialize if we have a token and we're not in demo mode
    const token = localStorage.getItem('spotify_access_token');
    const isRootPathWithoutAuth = window.location.pathname === '/' && !token;
    
    if (token && !isRootPathWithoutAuth) {
      this.initializeSDK();
    } else {
      console.log('Spotify SDK initialization skipped - no access token or demo mode');
    }
  }

  private setupGlobalCallback() {
    // Define the global callback that Spotify SDK expects
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify Web Playback SDK Ready');
      // The SDK is now available, we can proceed with player initialization
      this.initializePlayerAfterSDKReady();
    };
  }

  private async initializeSDK() {
    if (this.isInitialized || this.initializationAttempted) return;
    
    this.initializationAttempted = true;

    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.warn('Cannot initialize Spotify SDK - no access token available');
      return;
    }

    // Prevent loading in demo mode (root path without auth)
    const isRootPathWithoutAuth = window.location.pathname === '/' && !token;
    if (isRootPathWithoutAuth) {
      console.log('Skipping SDK initialization - demo mode detected');
      return;
    }

    try {
      await this.loadSDKScript();
      // Note: Player initialization now happens in the global callback
    } catch (error) {
      console.error('Failed to initialize Spotify SDK:', error);
      // Don't throw the error to prevent app crashes
    }
  }

  private loadSDKScript(): Promise<void> {
    // Return existing promise if already loading
    if (this.sdkLoadPromise) {
      return this.sdkLoadPromise;
    }

    this.sdkLoadPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="sdk.scdn.co"]');
      if (existingScript) {
        // If SDK is already loaded, resolve immediately
        if (window.Spotify?.Player) {
          resolve();
        } else {
          // Wait for the existing script to load
          existingScript.addEventListener('load', () => resolve());
          existingScript.addEventListener('error', () => reject(new Error('Failed to load existing Spotify SDK script')));
        }
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
        console.log('Spotify SDK script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load Spotify Web Playback SDK'));
      };
      
      document.head.appendChild(script);
    });

    return this.sdkLoadPromise;
  }

  private async initializePlayerAfterSDKReady() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.warn('Cannot initialize player - no access token available');
      return;
    }

    if (!window.Spotify?.Player) {
      console.error('Spotify Player not available after SDK ready');
      return;
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
        console.warn('Failed to connect to Spotify Web Playback SDK');
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
    
    // Clean up global callback
    if ((window as any).onSpotifyWebPlaybackSDKReady) {
      delete (window as any).onSpotifyWebPlaybackSDKReady;
    }
    
    // Remove SDK script
    const existingScript = document.querySelector('script[src*="sdk.scdn.co"]');
    if (existingScript) {
      existingScript.remove();
      console.log('Removed Spotify SDK script');
    }
    
    this.sessionManager.clearSessionData();
    this.isInitialized = false;
    this.initializationAttempted = false;
    this.sdkLoadPromise = null;
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
