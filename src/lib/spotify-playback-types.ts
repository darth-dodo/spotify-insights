
// Spotify Web Playback SDK types
declare global {
  interface Window {
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => any;
    };
  }
}

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

export interface SessionTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  duration_ms: number;
  popularity?: number;
  playedAt: string;
  playCount: number;
  totalListeningTime: number;
}

export interface HeatmapDay {
  date: string;
  plays: number;
  level: number;
  dayOfWeek: number;
  weekOfYear: number;
}
