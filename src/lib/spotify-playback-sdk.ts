// Spotify Web Playback SDK integration for local-only processing
// All data is processed in real-time and never stored permanently

export interface PlaybackState {
  track_window: {
    current_track: {
      id: string;
      name: string;
      artists: Array<{ name: string }>;
      duration_ms: number;
    };
  };
  position: number;
  duration: number;
  paused: boolean;
  timestamp: number;
}

export interface LocalPlaybackSession {
  timestamp: number;
  trackId: string;
  duration: number;
  progress: number;
  deviceType: 'web' | 'mobile' | 'desktop';
}

export class SpotifyPlaybackSDK {
  private player: any = null;
  private deviceId: string = '';
  private isInitialized: boolean = false;
  private sessionData: LocalPlaybackSession[] = [];
  private maxSessionSize = 100; // Limit memory usage
  
  constructor() {
    this.initializeSDK();
  }

  private async initializeSDK() {
    if (this.isInitialized) return;

    // Load Spotify Web Playback SDK
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

    // Setup event listeners for local data processing
    this.setupEventListeners();

    // Connect to the player
    const success = await this.player.connect();
    if (success) {
      console.log('Successfully connected to Spotify Web Playback SDK');
      this.isInitialized = true;
    } else {
      throw new Error('Failed to connect to Spotify Web Playback SDK');
    }
  }

  private setupEventListeners() {
    // Ready event
    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
    });

    // Not ready event
    this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Playback state changed - process locally only
    this.player.addListener('player_state_changed', (state: PlaybackState | null) => {
      if (state) {
        this.processPlaybackStateLocally(state);
      }
    });

    // Error handling
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

  private processPlaybackStateLocally(state: PlaybackState) {
    // Process playback data locally without permanent storage
    const session: LocalPlaybackSession = {
      timestamp: Date.now(),
      trackId: state.track_window.current_track.id,
      duration: state.duration,
      progress: state.position,
      deviceType: this.detectDeviceType()
    };

    // Add to temporary session data (memory only)
    this.sessionData.push(session);

    // Limit memory usage by keeping only recent sessions
    if (this.sessionData.length > this.maxSessionSize) {
      this.sessionData = this.sessionData.slice(-this.maxSessionSize);
    }

    console.log('Processing playback state locally (not stored):', {
      track: state.track_window.current_track.name,
      artist: state.track_window.current_track.artists[0]?.name,
      progress: `${Math.floor(state.position / 1000)}s`,
      timestamp: new Date().toISOString()
    });
  }

  private detectDeviceType(): 'web' | 'mobile' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad/.test(userAgent)) {
      return 'mobile';
    }
    return 'web';
  }

  // Generate heatmap data from current session (temporary data only)
  public generateLocalHeatmapData(): Array<{
    date: string;
    plays: number;
    level: number;
    dayOfWeek: number;
    weekOfYear: number;
  }> {
    // Process only current session data (no permanent storage)
    const now = new Date();
    const data: Array<{
      date: string;
      plays: number;
      level: number;
      dayOfWeek: number;
      weekOfYear: number;
    }> = [];

    // Generate data for last 7 days using session data + simulation
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Count plays from current session for this day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const sessionPlaysForDay = this.sessionData.filter(session => 
        session.timestamp >= dayStart.getTime() && 
        session.timestamp <= dayEnd.getTime()
      ).length;

      // Combine with simulated data for demonstration
      const simulatedPlays = Math.floor(Math.random() * 30) + 10;
      const totalPlays = sessionPlaysForDay + simulatedPlays;
      
      let level = 0;
      if (totalPlays > 40) level = 4;
      else if (totalPlays > 30) level = 3;
      else if (totalPlays > 20) level = 2;
      else if (totalPlays > 10) level = 1;

      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekOfYear = Math.ceil((((date.getTime() - startOfYear.getTime()) / 86400000) + startOfYear.getDay() + 1) / 7);

      data.push({
        date: date.toISOString().split('T')[0],
        plays: totalPlays,
        level,
        dayOfWeek: date.getDay(),
        weekOfYear
      });
    }

    return data;
  }

  // Get current session statistics (temporary data only)
  public getSessionStats() {
    const uniqueTracks = new Set(this.sessionData.map(s => s.trackId)).size;
    const totalDuration = this.sessionData.reduce((sum, s) => sum + (s.duration / 1000), 0);
    
    return {
      sessionLength: this.sessionData.length,
      uniqueTracks,
      totalMinutes: Math.floor(totalDuration / 60),
      deviceType: this.detectDeviceType(),
      isActive: this.isInitialized && this.sessionData.length > 0
    };
  }

  // Clear all temporary session data
  public clearSessionData() {
    this.sessionData = [];
    console.log('All temporary session data cleared');
  }

  // Disconnect from player and clear all data
  public disconnect() {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
    this.sessionData = [];
    this.isInitialized = false;
    console.log('Disconnected from Web Playback SDK and cleared all data');
  }

  public isConnected(): boolean {
    return this.isInitialized;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }
}

// Global instance for the application
export const spotifyPlaybackSDK = new SpotifyPlaybackSDK();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  spotifyPlaybackSDK.disconnect();
});
