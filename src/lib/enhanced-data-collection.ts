import { spotifyAPI } from './spotify-api';

// Phase 1: Enhanced Real-Time Data Collection
export interface SessionTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  duration_ms: number;
  popularity?: number;
  totalListeningTime: number;
  playCount: number;
  firstPlayed: Date;
  lastPlayed: Date;
  skipCount: number;
  completionRate: number;
}

export interface PlaybackEvent {
  trackId: string;
  timestamp: Date;
  eventType: 'play' | 'pause' | 'skip' | 'complete';
  progress: number;
  duration: number;
}

export interface DataQualityMetrics {
  source: 'api' | 'estimated' | 'calculated' | 'real-time';
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: Date;
  sampleSize: number;
}

// Enhanced Spotify Playback SDK with real session tracking
export class EnhancedSpotifyPlaybackSDK {
  private sessionTracks: Map<string, SessionTrack> = new Map();
  private listeningEvents: PlaybackEvent[] = [];
  private currentTrack: any = null;
  private sessionStart: number = 0;
  private trackStartTime: number = 0;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadStoredData();
  }

  // Phase 1.1: Track actual listening time per track
  trackListeningTime(trackId: string, duration: number, isComplete: boolean = false) {
    const existing = this.sessionTracks.get(trackId);
    const now = new Date();
    
    if (existing) {
      existing.totalListeningTime += duration;
      existing.lastPlayed = now;
      
      if (isComplete) {
        existing.playCount += 1;
        existing.completionRate = (existing.completionRate * (existing.playCount - 1) + 1) / existing.playCount;
      } else {
        existing.skipCount += 1;
        const completionRatio = duration / (existing.duration_ms || 1);
        existing.completionRate = (existing.completionRate * existing.playCount + completionRatio) / (existing.playCount + 1);
      }
    } else {
      this.sessionTracks.set(trackId, {
        id: trackId,
        name: '',
        artists: [],
        duration_ms: 0,
        totalListeningTime: duration,
        playCount: isComplete ? 1 : 0,
        firstPlayed: now,
        lastPlayed: now,
        skipCount: isComplete ? 0 : 1,
        completionRate: isComplete ? 1 : duration / 180000 // Default 3min track
      });
    }
    
    this.saveStoredData();
  }

  // Phase 1.2: Enhanced Recently Played Analysis
  analyzeRecentlyPlayedPatterns(recentTracks: any[]) {
    const playFrequency = new Map<string, number>();
    const timePatterns = new Map<string, Date[]>();
    const genrePatterns = new Map<string, number>();
    
    recentTracks.forEach(item => {
      const trackId = item.track?.id || item.id;
      const playedAt = new Date(item.played_at || item.playedAt || Date.now());
      
      // Count actual plays
      playFrequency.set(trackId, (playFrequency.get(trackId) || 0) + 1);
      
      // Track timing patterns
      if (!timePatterns.has(trackId)) {
        timePatterns.set(trackId, []);
      }
      timePatterns.get(trackId)!.push(playedAt);
      
      // Analyze genre patterns
      const genres = item.track?.artists?.[0]?.genres || item.artists?.[0]?.genres || [];
      genres.forEach((genre: string) => {
        genrePatterns.set(genre, (genrePatterns.get(genre) || 0) + 1);
      });
    });
    
    return { 
      playFrequency, 
      timePatterns, 
      genrePatterns,
      totalPlays: recentTracks.length,
      uniqueTracks: playFrequency.size,
      avgPlaysPerTrack: recentTracks.length / Math.max(1, playFrequency.size)
    };
  }

  // Get enhanced session data
  getEnhancedSessionData() {
    const tracks = Array.from(this.sessionTracks.values());
    const totalListeningTime = tracks.reduce((sum, track) => sum + track.totalListeningTime, 0);
    const totalPlays = tracks.reduce((sum, track) => sum + track.playCount, 0);
    const avgCompletionRate = tracks.reduce((sum, track) => sum + track.completionRate, 0) / Math.max(1, tracks.length);
    
    return {
      tracks,
      totalTracks: tracks.length,
      totalListeningTime: Math.floor(totalListeningTime / 1000 / 60), // Convert to minutes
      totalPlays,
      avgCompletionRate: Math.round(avgCompletionRate * 100),
      topTracks: tracks
        .sort((a, b) => b.totalListeningTime - a.totalListeningTime)
        .slice(0, 10),
      dataQuality: this.assessDataQuality()
    };
  }

  // Phase 1.2: Start real-time monitoring
  async startRealTimeMonitoring() {
    if (this.monitoringInterval) return;
    
    console.log('Starting enhanced real-time playback monitoring');
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('spotify_access_token');
        if (!token) return;
        
        const playback = await spotifyAPI.getCurrentPlayback(token);
        
        if (playback?.item && playback.is_playing) {
          this.handlePlaybackUpdate(playback);
        }
      } catch (error) {
        console.warn('Enhanced playback monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds (respects rate limits)
  }

  stopRealTimeMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Stopped enhanced real-time monitoring');
    }
  }

  private handlePlaybackUpdate(playback: any) {
    const track = playback.item;
    const progress = playback.progress_ms;
    const isPlaying = playback.is_playing;
    
    // New track started
    if (!this.currentTrack || this.currentTrack.id !== track.id) {
      if (this.currentTrack && this.trackStartTime > 0) {
        const listeningDuration = Date.now() - this.trackStartTime;
        const isComplete = progress > (this.currentTrack.duration_ms * 0.8); // 80% completion
        this.trackListeningTime(this.currentTrack.id, listeningDuration, isComplete);
      }
      
      this.currentTrack = track;
      this.trackStartTime = Date.now();
      
      // Store track metadata
      this.updateTrackMetadata(track);
    }
    
    // Log playback event
    this.logPlaybackEvent(track.id, isPlaying ? 'play' : 'pause', progress, track.duration_ms);
  }

  private updateTrackMetadata(track: any) {
    const existing = this.sessionTracks.get(track.id);
    if (existing) {
      existing.name = track.name;
      existing.artists = track.artists || [];
      existing.duration_ms = track.duration_ms;
      existing.popularity = track.popularity;
    } else {
      this.sessionTracks.set(track.id, {
        id: track.id,
        name: track.name,
        artists: track.artists || [],
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        totalListeningTime: 0,
        playCount: 0,
        firstPlayed: new Date(),
        lastPlayed: new Date(),
        skipCount: 0,
        completionRate: 0
      });
    }
    this.saveStoredData();
  }

  private logPlaybackEvent(trackId: string, eventType: 'play' | 'pause' | 'skip' | 'complete', progress: number, duration: number) {
    const event: PlaybackEvent = {
      trackId,
      timestamp: new Date(),
      eventType,
      progress,
      duration
    };
    
    this.listeningEvents.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.listeningEvents.length > 1000) {
      this.listeningEvents = this.listeningEvents.slice(-1000);
    }
    
    this.saveStoredData();
  }

  private assessDataQuality(): DataQualityMetrics {
    const tracks = Array.from(this.sessionTracks.values());
    const totalSessions = tracks.reduce((sum, track) => sum + track.playCount, 0);
    
    let confidence: 'high' | 'medium' | 'low' = 'low';
    let source: 'api' | 'estimated' | 'calculated' | 'real-time' = 'real-time';
    
    if (totalSessions > 100) {
      confidence = 'high';
    } else if (totalSessions > 20) {
      confidence = 'medium';
    }
    
    return {
      source,
      confidence,
      lastUpdated: new Date(),
      sampleSize: totalSessions
    };
  }

  private loadStoredData() {
    try {
      const stored = localStorage.getItem('enhanced_spotify_sessions');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore session tracks
        if (data.sessionTracks) {
          this.sessionTracks = new Map(
            data.sessionTracks.map((item: any) => [
              item[0], 
              {
                ...item[1],
                firstPlayed: new Date(item[1].firstPlayed),
                lastPlayed: new Date(item[1].lastPlayed)
              }
            ])
          );
        }
        
        // Restore events
        if (data.listeningEvents) {
          this.listeningEvents = data.listeningEvents.map((event: any) => ({
            ...event,
            timestamp: new Date(event.timestamp)
          }));
        }
      }
    } catch (error) {
      console.warn('Error loading stored session data:', error);
    }
  }

  private saveStoredData() {
    try {
      const data = {
        sessionTracks: Array.from(this.sessionTracks.entries()),
        listeningEvents: this.listeningEvents.slice(-500), // Keep last 500 events
        lastSaved: new Date()
      };
      
      localStorage.setItem('enhanced_spotify_sessions', JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving session data:', error);
    }
  }

  // Cleanup method
  cleanup() {
    this.stopRealTimeMonitoring();
    this.saveStoredData();
  }
}

// Phase 2: Intelligent Data Extrapolation
export class IntelligentDataExtrapolation {
  
  // Phase 2.1: Pattern-based follower estimation
  static calculateImprovedFollowerEstimate(artist: any, allArtists: any[]): number {
    const popularity = artist.popularity || 50;
    const genrePopularity = this.calculateGenrePopularityFactor(artist.genres || []);
    const relativeRanking = this.calculateRelativeRanking(artist, allArtists);
    
    // Use logarithmic scale based on popularity distribution
    const baseEstimate = Math.pow(10, 3 + (popularity / 100) * 3); // 1K to 1M range
    const genreMultiplier = genrePopularity;
    const rankingMultiplier = Math.max(0.5, 2 - relativeRanking);
    
    return Math.floor(baseEstimate * genreMultiplier * rankingMultiplier);
  }

  // Phase 2.2: Enhanced play count estimation
  static calculateEnhancedPlayCount(
    track: any, 
    index: number, 
    recentPlays: Map<string, number>,
    userPatterns?: any
  ): number {
    const factors = {
      ranking: Math.max(1, 100 - index), // Position in top tracks
      popularity: (track.popularity || 50) / 100, // Spotify popularity
      duration: Math.min(1.5, 240000 / (track.duration_ms || 240000)), // Duration factor
      recent: recentPlays.get(track.id) || 0, // Actual recent plays
      genre: this.getGenrePlayabilityFactor(track.artists?.[0]?.genres || []),
      userPreference: userPatterns ? this.calculateUserPreferenceFactor(track, userPatterns) : 1
    };
    
    // Weighted calculation with improved algorithm
    const basePlay = factors.ranking * 0.3 + 
                     factors.popularity * 30 * 0.25 + 
                     factors.duration * 20 * 0.15 + 
                     factors.recent * 5 * 0.15 +
                     factors.userPreference * 20 * 0.15;
                     
    return Math.max(1, Math.round(basePlay * factors.genre));
  }

  // Enhanced listening time calculation
  static calculateEnhancedListeningTime(
    track: any,
    index: number,
    actualData?: SessionTrack
  ): number {
    if (actualData && actualData.totalListeningTime > 0) {
      // Convert milliseconds → hours and round to 1 decimal place
      return Math.round((actualData.totalListeningTime / 1000 / 60 / 60) * 10) / 10;
    }
    
    // Improved estimation algorithm
    const baseTime = Math.max(0.1, (100 - index) * 1.5); // More realistic base
    const popularityBonus = (track.popularity || 50) / 100 * 0.5;
    const durationFactor = Math.min(1.2, (track.duration_ms || 180000) / 180000);
    
    return Math.round(baseTime * (1 + popularityBonus) * durationFactor);
  }

  // Discovery year estimation with pattern analysis
  static calculateDiscoveryYear(track: any, userPatterns?: any): number {
    const releaseYear = new Date(track.album?.release_date || '2020-01-01').getFullYear();
    const currentYear = new Date().getFullYear();
    
    // More sophisticated discovery estimation
    if (userPatterns && userPatterns.discoveryPatterns) {
      const avgDiscoveryDelay = userPatterns.discoveryPatterns.avgYearsAfterRelease || 2;
      return Math.min(currentYear, releaseYear + avgDiscoveryDelay);
    }
    
    // Default: assume discovery 1-3 years after release, but not in the future
    const estimatedDiscovery = releaseYear + Math.floor(Math.random() * 3) + 1;
    return Math.min(currentYear, estimatedDiscovery);
  }

  private static calculateGenrePopularityFactor(genres: string[]): number {
    const popularGenres = ['pop', 'rock', 'hip hop', 'electronic', 'indie'];
    const nicheGenres = ['experimental', 'avant-garde', 'drone', 'harsh noise'];
    
    const hasPopular = genres.some(g => popularGenres.some(pg => g.toLowerCase().includes(pg)));
    const hasNiche = genres.some(g => nicheGenres.some(ng => g.toLowerCase().includes(ng)));
    
    if (hasPopular) return 1.2;
    if (hasNiche) return 0.7;
    return 1.0;
  }

  private static calculateRelativeRanking(artist: any, allArtists: any[]): number {
    const sortedByPopularity = allArtists
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    
    const index = sortedByPopularity.findIndex(a => a.id === artist.id);
    return index / Math.max(1, allArtists.length);
  }

  private static getGenrePlayabilityFactor(genres: string[]): number {
    const highPlayability = ['pop', 'dance', 'electronic', 'hip hop'];
    const mediumPlayability = ['rock', 'indie', 'alternative'];
    const lowPlayability = ['classical', 'jazz', 'experimental'];
    
    const hasHigh = genres.some(g => highPlayability.some(hp => g.toLowerCase().includes(hp)));
    const hasLow = genres.some(g => lowPlayability.some(lp => g.toLowerCase().includes(lp)));
    
    if (hasHigh) return 1.3;
    if (hasLow) return 0.8;
    return 1.0;
  }

  private static calculateUserPreferenceFactor(track: any, userPatterns: any): number {
    // Analyze user's listening patterns to adjust estimates
    const trackGenres = track.artists?.[0]?.genres || [];
    const userFavoriteGenres = userPatterns.topGenres || [];
    
    const genreMatch = trackGenres.some((genre: string) => 
      userFavoriteGenres.includes(genre)
    );
    
    const energyMatch = userPatterns.preferredEnergy && 
      Math.abs((track.energy || 0.5) - userPatterns.preferredEnergy) < 0.2;
    
    let factor = 1.0;
    if (genreMatch) factor *= 1.2;
    if (energyMatch) factor *= 1.1;
    
    return factor;
  }
}

// Global instance
export const enhancedDataCollection = new EnhancedSpotifyPlaybackSDK();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  enhancedDataCollection.cleanup();
}); 