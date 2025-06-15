
import { SpotifyScriptLoader } from './spotify-playback-script';
import { SpotifyEventHandler } from './spotify-playback-events';
import { PlaybackSessionManager } from './spotify-playback-session';

export class SpotifyPlaybackCore {
  private player: any = null;
  private isInitialized: boolean = false;
  private initializationAttempted: boolean = false;
  private pendingInitialization: boolean = false;
  private eventHandler: SpotifyEventHandler;
  private sessionManager: PlaybackSessionManager;
  
  constructor(sessionManager: PlaybackSessionManager) {
    this.sessionManager = sessionManager;
    this.eventHandler = new SpotifyEventHandler(sessionManager);
    this.setupGlobalCallback();
  }

  private setupGlobalCallback(): void {
    // Ensure we don't override an existing callback
    if ((window as any).onSpotifyWebPlaybackSDKReady) {
      console.log('Spotify callback already exists, preserving it');
      return;
    }

    // Define the global callback that Spotify SDK expects
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify Web Playback SDK Ready - global callback triggered');
      
      // Only proceed if we have pending initialization
      if (this.pendingInitialization) {
        this.initializePlayerAfterSDKReady();
      } else {
        console.log('SDK ready but no pending initialization');
      }
    };
    
    console.log('Global Spotify callback set up successfully');
  }

  async initialize(): Promise<void> {
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
      console.log('Starting SDK initialization...');
      this.pendingInitialization = true;
      
      await SpotifyScriptLoader.loadSDKScript();
      
      // Check if SDK is already available (callback might have been called already)
      if (window.Spotify?.Player) {
        console.log('SDK already available, initializing player directly');
        this.initializePlayerAfterSDKReady();
      } else {
        console.log('SDK loading, waiting for callback...');
      }
    } catch (error) {
      console.error('Failed to initialize Spotify SDK:', error);
      this.pendingInitialization = false;
      // Don't throw the error to prevent app crashes
    }
  }

  private async initializePlayerAfterSDKReady(): Promise<void> {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) {
      console.warn('Cannot initialize player - no access token available');
      this.pendingInitialization = false;
      return;
    }

    if (!window.Spotify?.Player) {
      console.error('Spotify Player not available after SDK ready');
      this.pendingInitialization = false;
      return;
    }

    try {
      console.log('Initializing Spotify Player...');
      
      this.player = new window.Spotify.Player({
        name: 'Spotify Analytics Dashboard',
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.5
      });

      this.eventHandler.setupEventListeners(this.player);

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
    } finally {
      this.pendingInitialization = false;
    }
  }

  disconnect(): void {
    console.log('Disconnecting Spotify SDK...');
    
    if (this.player) {
      try {
        this.player.disconnect();
      } catch (error) {
        console.error('Error disconnecting player:', error);
      }
      this.player = null;
    }
    
    // Clean up global callback only if we own it
    if ((window as any).onSpotifyWebPlaybackSDKReady) {
      try {
        delete (window as any).onSpotifyWebPlaybackSDKReady;
        console.log('Cleaned up global callback');
      } catch (error) {
        console.warn('Could not clean up global callback:', error);
      }
    }
    
    SpotifyScriptLoader.removeSDKScript();
    
    this.isInitialized = false;
    this.initializationAttempted = false;
    this.pendingInitialization = false;
    console.log('Disconnected from Web Playback SDK and cleared all data');
  }

  isConnected(): boolean {
    return this.isInitialized;
  }

  getDeviceId(): string {
    return this.eventHandler.getDeviceId();
  }

  resetInitialization(): void {
    this.initializationAttempted = false;
    this.pendingInitialization = false;
  }
}
