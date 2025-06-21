
import { PlaybackSessionManager } from './spotify-playback-session';
import type { PlaybackState } from './spotify-playback-types';

export class SpotifyEventHandler {
  private deviceId: string = '';
  private sessionManager: PlaybackSessionManager;

  constructor(sessionManager: PlaybackSessionManager) {
    this.sessionManager = sessionManager;
  }

  setupEventListeners(player: any): void {
    if (!player) return;

    player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      this.deviceId = device_id;
    });

    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.addListener('player_state_changed', (state: PlaybackState | null) => {
      if (state) {
        this.sessionManager.processPlaybackStateLocally(state);
      }
    });

    player.addListener('initialization_error', ({ message }: { message: string }) => {
      console.error('Failed to initialize:', message);
    });

    player.addListener('authentication_error', ({ message }: { message: string }) => {
      console.warn('Playback authentication error (this is normal without Premium):', message);
      // Don't throw errors for playback auth issues - they're expected without Premium
    });

    player.addListener('account_error', ({ message }: { message: string }) => {
      console.error('Failed to validate Spotify account:', message);
    });
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}
