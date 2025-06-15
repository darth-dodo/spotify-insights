
export interface IntegratedTrackData {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  duration_ms: number;
  popularity: number;
  playedAt?: string;
  playCount: number;
  totalListeningTime: number;
  source: 'api' | 'sdk' | 'combined';
}

export interface IntegratedArtistData {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  playCount: number;
  totalListeningTime: number;
  source: 'api' | 'sdk' | 'combined';
}

export interface ListeningSession {
  startTime: Date;
  endTime?: Date;
  tracks: IntegratedTrackData[];
  totalTime: number;
  isActive: boolean;
}
