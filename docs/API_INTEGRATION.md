
# Spotify API Integration Documentation

## Overview
This document details how the Spotify Analytics Dashboard integrates with Spotify's Web API to provide comprehensive music analytics while maintaining privacy-first principles.

## API Endpoints Used

### Core Endpoints
- **`/me/top/tracks`** - User's top tracks (up to 2,000 items)
- **`/me/top/artists`** - User's top artists (up to 2,000 items)
- **`/me/player/recently-played`** - Recently played tracks (up to 200 items)
- **`/me`** - Current user profile information

### Time Range Parameters
- **`short_term`** - Last 4 weeks of listening
- **`medium_term`** - Last 6 months of listening
- **`long_term`** - All-time listening history

## Extended Data Fetching

### Enhanced Top Tracks (2,000 Limit)
```typescript
async getExtendedTopTracks(
  accessToken: string, 
  timeRange: string = 'medium_term', 
  totalLimit: number = 2000
) {
  const allItems = [];
  const maxLimit = 50; // Spotify API limit per request
  let offset = 0;
  
  while (allItems.length < totalLimit && offset < 2000) {
    const response = await this.makeRequest(
      `/me/top/tracks?time_range=${timeRange}&limit=${maxLimit}&offset=${offset}`,
      accessToken
    );
    
    if (!response.items?.length) break;
    
    allItems.push(...response.items);
    offset += maxLimit;
    
    // Rate limiting - respect Spotify's limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return { items: allItems, total: allItems.length };
}
```

### Enhanced Top Artists (2,000 Limit)
```typescript
async getExtendedTopArtists(
  accessToken: string, 
  timeRange: string = 'medium_term', 
  totalLimit: number = 2000
) {
  // Similar implementation to tracks but for artists
  // Handles pagination and rate limiting automatically
}
```

## Rate Limiting & Error Handling

### Spotify API Limits
- **Rate Limit**: 100 requests per minute
- **Burst Limit**: 20 requests per second
- **Daily Limit**: No official limit for personal use

### Implementation Strategy
```typescript
const API_STRATEGY = {
  requestDelay: 100,           // 100ms between requests
  maxRetries: 3,               // Retry failed requests
  exponentialBackoff: true,    // Increase delay on failure
  respectRateLimit: true       // Honor 429 responses
};
```

### Error Handling
```typescript
// Comprehensive error handling
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  throw new Error(`Rate limited. Retry after ${retryAfter || 60} seconds.`);
}

if (response.status === 401) {
  throw new Error('Unauthorized. Please re-authenticate with Spotify.');
}

if (response.status === 403) {
  throw new Error('Forbidden. Check your Spotify permissions.');
}
```

## Authentication Flow

### OAuth 2.0 with PKCE
```typescript
// Secure authentication implementation
const authenticateWithSpotify = async () => {
  const codeVerifier = generateSecureRandomString();
  const codeChallenge = await sha256Hash(codeVerifier);
  
  const authParams = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: [
      'user-read-private',
      'user-top-read', 
      'user-read-recently-played'
    ].join(' ')
  };
};
```

### Required Scopes
- **`user-read-private`** - Access to user profile information
- **`user-top-read`** - Access to top tracks and artists
- **`user-read-recently-played`** - Access to recently played tracks

## Data Processing Pipeline

### Raw Data Transformation
```typescript
// Transform Spotify API response to internal format
const processSpotifyTrack = (track: SpotifyTrack): IntegratedTrackData => ({
  id: track.id,
  name: track.name,
  artists: track.artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    genres: artist.genres || []
  })),
  duration_ms: Math.max(0, track.duration_ms),
  popularity: Math.max(0, track.popularity || 50),
  playedAt: new Date().toISOString(),
  playCount: 1,
  totalListeningTime: track.duration_ms,
  source: 'api' as const
});
```

### Audio Features Integration
```typescript
// Enhanced track data with audio features
interface EnhancedTrackData extends IntegratedTrackData {
  audioFeatures?: {
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    time_signature: number;
  };
}
```

## Caching Strategy

### Multi-Level Caching
```typescript
class SpotifyDataCache {
  private memoryCache = new Map<string, any>();
  private localStoragePrefix = 'spotify_cache_';
  
  setCachedTopTracks(key: string, data: IntegratedTrackData[]): void {
    this.memoryCache.set(`tracks_${key}`, data);
    // Note: No localStorage for personal data - memory only
  }
  
  getCachedTopTracks(key: string): IntegratedTrackData[] | null {
    return this.memoryCache.get(`tracks_${key}`) || null;
  }
}
```

### Cache Invalidation
- **Time-Based**: Cache expires after 5 minutes
- **User-Triggered**: Manual refresh clears cache
- **Session-Based**: Cache cleared on logout

## Demo Mode Implementation

### Sandbox Environment
```typescript
const shouldUseDummyData = (): boolean => {
  return window.location.pathname === '/sandbox';
};

// Demo mode returns empty data to prevent API calls
if (isDemoMode) {
  console.log('Demo mode detected, returning empty data');
  return { items: [], total: 0 };
}
```

## Privacy Compliance

### Data Minimization
- Only fetch required data fields
- Process data locally in browser
- No server-side data storage
- Automatic cleanup on logout

### Transparency
- Clear API call logging
- User-visible network requests
- Open source implementation
- Documented data flows

## Performance Optimization

### Batch Processing
- Fetch 50 items per request (Spotify limit)
- Progressive loading with immediate display
- Background continuation for large datasets
- Efficient memory management

### Network Optimization
- Minimize redundant requests
- Implement request deduplication
- Use efficient data structures
- Optimize payload sizes

## Monitoring & Analytics

### API Usage Tracking
```typescript
// Track API performance (no personal data)
const apiMetrics = {
  requestCount: 0,
  averageResponseTime: 0,
  errorRate: 0,
  cacheHitRate: 0
};
```

### Error Monitoring
- Track API failures
- Monitor rate limit hits
- Log performance issues
- User experience metrics

This integration provides comprehensive Spotify data access while maintaining privacy-first principles and optimal performance with the enhanced 2,000-item dataset capability.
