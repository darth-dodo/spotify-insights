
# API Reference Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Data Structures](#data-structures)
3. [Data Integration APIs](#data-integration-apis)
4. [Spotify API Integration](#spotify-api-integration)
5. [Real-time SDK Integration](#real-time-sdk-integration)
6. [Extended Data Fetching](#extended-data-fetching)
7. [Error Handling](#error-handling)
8. [Security & Privacy](#security--privacy)

## Authentication

### OAuth 2.0 Flow with PKCE

#### 1. Authorization Request
```
GET https://accounts.spotify.com/authorize

Parameters:
- client_id: string (required)
- response_type: "code" (required)
- redirect_uri: string (required)
- scope: string (required)
- code_challenge_method: "S256" (required)
- code_challenge: string (required)
- state: string (required)
```

#### 2. Token Exchange
```
POST https://accounts.spotify.com/api/token

Headers:
- Content-Type: application/x-www-form-urlencoded

Body:
- client_id: string
- grant_type: "authorization_code"
- code: string
- redirect_uri: string
- code_verifier: string
```

## Data Structures

### Integrated Data Types

#### IntegratedTrackData
```typescript
interface IntegratedTrackData {
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
```

#### IntegratedArtistData
```typescript
interface IntegratedArtistData {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  playCount: number;
  totalListeningTime: number;
  source: 'api' | 'sdk' | 'combined';
}
```

#### ListeningSession
```typescript
interface ListeningSession {
  startTime: Date;
  endTime?: Date;
  tracks: IntegratedTrackData[];
  totalTime: number;
  isActive: boolean;
}
```

### Real-time SDK Types

#### SessionTrack
```typescript
interface SessionTrack {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  duration_ms: number;
  popularity?: number;
  playedAt: string;
  playCount: number;
  totalListeningTime: number;
}
```

#### LocalPlaybackSession
```typescript
interface LocalPlaybackSession {
  timestamp: number;
  trackId: string;
  duration: number;
  progress: number;
  deviceType: 'web' | 'mobile' | 'desktop';
}
```

### User Profile (Sanitized & Secure)
```typescript
interface User {
  id: string;           // Hashed user ID (SHA-256, shortened)
  display_name: string; // Truncated to 20 characters
  has_image: boolean;   // Boolean flag for profile image
  country: string;      // 2-letter country code
  images?: Array<{      // Securely stored profile images
    url: string;
    height: number;
    width: number;
  }>;
}
```

## Data Integration APIs

### SpotifyDataIntegration Class

The central data integration service that combines multiple data sources.

#### Enhanced Data Methods

##### `getEnhancedRecentlyPlayed(limit: number = 200): Promise<IntegratedTrackData[]>`
Fetches enhanced recently played tracks combining API data with real-time SDK data.

```typescript
const recentTracks = await spotifyDataIntegration.getEnhancedRecentlyPlayed(200);
```

**Features:**
- Fetches up to 200 tracks using API pagination
- Enhances with real-time SDK session data
- Deduplicates and combines play counts
- Returns unified dataset with source attribution

**Data Sources:**
- Spotify Web API: Recently played tracks (paginated)
- Web Playback SDK: Current session tracks
- Combined: Merged and deduplicated results

##### `getEnhancedTopTracks(timeRange: string = 'medium_term', totalLimit: number = 1000): Promise<IntegratedTrackData[]>`
Fetches extended top tracks dataset with SDK enhancement.

```typescript
const topTracks = await spotifyDataIntegration.getEnhancedTopTracks('medium_term', 1000);
```

**Features:**
- Extended dataset up to 1000 tracks
- Enhanced with real-time session data
- Estimated play counts based on ranking
- Comprehensive listening history analysis

##### `getEnhancedTopArtists(timeRange: string = 'medium_term', totalLimit: number = 1000): Promise<IntegratedArtistData[]>`
Fetches extended top artists dataset with listening metrics.

```typescript
const topArtists = await spotifyDataIntegration.getEnhancedTopArtists('medium_term', 1000);
```

**Features:**
- Extended dataset up to 1000 artists
- Estimated listening time calculations
- Genre analysis from extended dataset
- Play count estimation algorithms

#### Listening Statistics

##### `calculateListeningStats(tracks: IntegratedTrackData[], timeRangeLabel: string)`
Calculates comprehensive listening statistics from integrated track data.

```typescript
const stats = spotifyDataIntegration.calculateListeningStats(tracks, 'Last 6 Months');
```

**Returns:**
```typescript
{
  totalPlayCount: number;
  totalMinutes: number;
  totalHours: number;
  uniqueArtists: number;
  avgDailyMinutes: number;
  topTrack: IntegratedTrackData;
  timeRangeLabel: string;
  dataQuality: 'high' | 'medium' | 'low';
}
```

#### Session Management

##### `startListeningSession(): void`
Starts tracking a new listening session.

##### `endListeningSession(): ListeningSession | null`
Ends current listening session and returns session data.

##### `getCurrentSession(): ListeningSession | null`
Gets current active listening session.

## Spotify API Integration

### Base URL
```
https://api.spotify.com/v1
```

### Standard Endpoints

#### Get User's Top Tracks (Extended)
```
GET /me/top/tracks?limit=50&time_range=medium_term&offset=0
```

**Extended Implementation:**
- Supports pagination up to 1000 tracks
- Rate limiting with 100ms delays
- Graceful error handling with partial data

#### Get User's Top Artists (Extended)
```
GET /me/top/artists?limit=50&time_range=medium_term&offset=0
```

**Extended Implementation:**
- Supports pagination up to 1000 artists
- Genre aggregation across extended dataset
- Enhanced popularity metrics

#### Get Recently Played (Enhanced)
```
GET /me/player/recently-played?limit=50&before={timestamp}
```

**Enhanced Implementation:**
- Pagination support for up to 200 tracks
- Time-based filtering capabilities
- Integration with real-time SDK data

## Real-time SDK Integration

### SpotifyPlaybackSDK Class

Handles real-time playback monitoring and session tracking.

#### Initialization Methods

##### `constructor()`
Automatically initializes SDK and sets up event listeners.

##### `initializeSDK(): Promise<void>`
Loads and initializes the Spotify Web Playback SDK.

```typescript
await spotifyPlaybackSDK.initializeSDK();
```

#### Session Tracking Methods

##### `getSessionTracks(): SessionTrack[]`
Returns current session tracks with aggregated play data.

```typescript
const sessionTracks = spotifyPlaybackSDK.getSessionTracks();
```

**Returns:**
- Deduplicated tracks from current session
- Play counts and total listening time
- Sorted by most recent play time

##### `getSessionStats()`
Provides comprehensive session statistics.

```typescript
const sessionStats = spotifyPlaybackSDK.getSessionStats();
```

**Returns:**
```typescript
{
  sessionLength: number;      // Number of tracked plays
  uniqueTracks: number;       // Unique tracks in session
  totalMinutes: number;       // Total listening time
  deviceType: 'web' | 'mobile' | 'desktop';
  isActive: boolean;          // Session activity status
}
```

##### `startSession(): void`
Begins session tracking (automatic through playback events).

##### `clearSessionData(): void`
Clears all temporary session data for privacy.

#### Real-time Data Methods

##### `generateLocalHeatmapData(): HeatmapDay[]`
Generates activity heatmap data from current session.

```typescript
const heatmapData = spotifyPlaybackSDK.generateLocalHeatmapData();
```

**Features:**
- Combines session data with demonstration patterns
- Privacy-first local processing
- No permanent storage

##### `isConnected(): boolean`
Checks SDK connection status.

##### `getDeviceId(): string`
Returns current device ID for playback control.

#### Privacy & Cleanup

##### `disconnect(): void`
Disconnects player and clears all session data.

##### Auto-cleanup on page unload
Automatic cleanup prevents data persistence across sessions.

## Extended Data Fetching

### Enhanced Data Hooks

#### `useSpotifyData()`
Central hook providing access to both enhanced and legacy data methods.

```typescript
const {
  // Enhanced hooks with integration
  useEnhancedRecentlyPlayed,
  useEnhancedTopTracks,
  useEnhancedTopArtists,
  useListeningStats,
  
  // Legacy hooks for backward compatibility
  useTopTracks,
  useTopArtists,
  useRecentlyPlayed,
  useCurrentPlayback,
} = useSpotifyData();
```

#### Enhanced Hooks Usage

##### `useEnhancedRecentlyPlayed(limit: number = 200)`
```typescript
const { data, isLoading, error } = useEnhancedRecentlyPlayed(200);
```

##### `useEnhancedTopTracks(timeRange: string = 'medium_term', totalLimit: number = 1000)`
```typescript
const { data, isLoading, error } = useEnhancedTopTracks('medium_term', 1000);
```

##### `useListeningStats(timeRange: string = 'medium_term')`
```typescript
const { data: stats, isLoading, error } = useListeningStats('medium_term');
```

## Error Handling

### Multi-Source Error Management

#### Error Types
```typescript
interface DataIntegrationError {
  type: 'api_error' | 'sdk_error' | 'network_error' | 'rate_limit';
  message: string;
  source: 'api' | 'sdk' | 'integration';
  recoverable: boolean;
}
```

#### Graceful Degradation
```typescript
// Partial data handling
const handlePartialFailure = async () => {
  const results = await Promise.allSettled([
    fetchAPIData(),
    fetchSDKData()
  ]);
  
  return {
    apiData: getSuccessfulResult(results[0]),
    sdkData: getSuccessfulResult(results[1]),
    hasPartialData: results.some(r => r.status === 'rejected')
  };
};
```

#### Rate Limiting Strategy
- Progressive backoff for multiple requests
- 100ms base delay between paginated calls
- Respect for Spotify API limits (100 requests/minute)
- Automatic retry with exponential backoff

## Security & Privacy

### Privacy-First Design

#### Session Data Handling
- All SDK data processed locally in browser memory
- No permanent storage of listening data
- Automatic cleanup on page unload
- Session data limited to prevent memory bloat

#### Profile Image Security
```typescript
const storeProfileImage = (userData: any) => {
  if (userData?.images?.[0]?.url) {
    const imageUrl = userData.images[0].url;
    if (imageUrl.startsWith('https://') && imageUrl.includes('spotify')) {
      localStorage.setItem('user_profile_image', imageUrl);
    }
  }
};
```

#### Data Cleanup
```typescript
const clearAllUserData = () => {
  const keysToRemove = [
    'spotify_access_token',
    'spotify_refresh_token', 
    'spotify_token_expiry',
    'user_profile',
    'user_profile_image'
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
```

### Authentication Security

#### Enhanced Login Process
- Single-step login (fixed double login requirement)
- Background token validation
- Graceful error recovery
- Secure profile image handling

#### Token Management
- Automatic token refresh
- Secure token storage
- Proper cleanup on logout
- Error handling for expired tokens

## Performance Optimization

### Caching Strategy

#### API Data Caching
- 10-minute cache for extended datasets
- 2-minute cache for recently played
- Shared cache across all components
- Smart cache invalidation

#### Real-time Processing
- In-memory session data processing
- Efficient event handling
- Automatic memory management
- No blocking operations

### Network Optimization

#### Batch Processing
- Parallel API requests where possible
- Sequential requests for rate limiting
- Partial data continuation
- Smart retry mechanisms

#### Memory Management
- Limited session data storage (100 items max)
- Automatic cleanup of old data
- Efficient data structures
- Memory leak prevention

## Best Practices

### Implementation Guidelines

1. **Use Enhanced Hooks**: Always prefer enhanced hooks for new features
2. **Handle Partial Data**: Gracefully handle scenarios with missing data sources
3. **Respect Privacy**: Follow privacy-first principles for all data handling
4. **Cache Calculations**: Use React.useMemo for expensive calculations
5. **Clean Up Resources**: Properly clean up SDK connections and data
6. **Progressive Enhancement**: Start with API data, enhance with SDK when available

### Testing Strategies

1. **Mock All Sources**: Test both API and SDK data sources
2. **Test Offline Scenarios**: Handle cases where SDK is unavailable
3. **Validate Data Quality**: Test different data source combinations
4. **Performance Testing**: Verify performance with large datasets
5. **Error Scenarios**: Test graceful degradation with partial failures

This API reference provides comprehensive documentation for the integrated data architecture, covering both the enhanced capabilities and maintaining backward compatibility with existing implementations.
