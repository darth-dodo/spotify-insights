# API Reference Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Data Structures](#data-structures)
3. [Internal APIs](#internal-apis)
4. [Spotify API Integration](#spotify-api-integration)
5. [Extended Data Fetching](#extended-data-fetching)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
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

#### 3. Token Refresh
```
POST https://accounts.spotify.com/api/token

Body:
- client_id: string
- grant_type: "refresh_token"
- refresh_token: string
```

## Data Structures

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

**Profile Image Security:**
- Profile images are stored in `localStorage` under the key `user_profile_image`
- Images are only stored when explicitly available from Spotify API
- Image URLs are validated and sanitized before storage
- Images are automatically cleared on logout for privacy
- Fallback avatars use user initials when images are unavailable

### Original Spotify User Response
```typescript
interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  country: string;
  followers: {
    total: number;
  };
  product: string;
}
```

### Token Response
```typescript
interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
}
```

### Track Data
```typescript
interface Track {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
}
```

### Artist Data
```typescript
interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  popularity: number;
  followers: {
    total: number;
  };
}
```

### Extended Response Format
```typescript
interface ExtendedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}
```

## Internal APIs

### SpotifyAPI Class

#### Standard Methods

##### `getTopTracks(accessToken?: string, timeRange = 'medium_term', limit = 50): Promise<SpotifyResponse>`
Fetches user's top tracks (standard API limit: 50).

```typescript
const tracks = await spotifyAPI.getTopTracks(accessToken, 'medium_term', 50);
```

##### `getTopArtists(accessToken?: string, timeRange = 'medium_term', limit = 50): Promise<SpotifyResponse>`
Fetches user's top artists (standard API limit: 50).

```typescript
const artists = await spotifyAPI.getTopArtists(accessToken, 'medium_term', 50);
```

#### Extended Methods (NEW)

##### `getExtendedTopTracks(accessToken?: string, timeRange = 'medium_term', totalLimit = 500): Promise<ExtendedResponse<Track>>`
Fetches extended top tracks dataset using pagination.

```typescript
const extendedTracks = await spotifyAPI.getExtendedTopTracks(accessToken, 'medium_term', 500);
```

**Features:**
- Fetches up to 500 tracks (vs 50 standard limit)
- Uses pagination with offset to gather data
- Implements rate limiting between requests
- Supports all standard time ranges
- Returns unified response format

**Parameters:**
- `accessToken` - Spotify access token
- `timeRange` - 'short_term', 'medium_term', or 'long_term'
- `totalLimit` - Maximum number of tracks to fetch (up to 500)

##### `getExtendedTopArtists(accessToken?: string, timeRange = 'medium_term', totalLimit = 500): Promise<ExtendedResponse<Artist>>`
Fetches extended top artists dataset using pagination.

```typescript
const extendedArtists = await spotifyAPI.getExtendedTopArtists(accessToken, 'medium_term', 500);
```

**Features:**
- Fetches up to 500 artists (vs 50 standard limit)
- Uses pagination with offset to gather data
- Implements rate limiting between requests
- Supports all standard time ranges
- Returns unified response format

#### Other Methods

##### `getCurrentUser(accessToken: string): Promise<SpotifyUser>`
Fetches the current user's profile from Spotify API.

##### `getRecentlyPlayed(accessToken?: string, limit = 50): Promise<SpotifyResponse>`
Fetches recently played tracks.

##### `getCurrentPlayback(accessToken?: string): Promise<PlaybackState>`
Fetches current playback state.

### Data Utilities

#### `hashData(data: string): Promise<string>`
Hashes sensitive data using SHA-256.

#### `generateShortHash(data: string): string`
Generates a shorter hash for display purposes.

#### `sanitizeUserData(userData: SpotifyUser): User`
Sanitizes user data to minimal required fields.

### Authentication Hook

#### `useAuth(): AuthContextType`
React hook for authentication state and methods.

### Data Hooks

#### Standard Hooks

##### `useTopTracks(timeRange?, limit?): QueryResult`
Hook for fetching standard top tracks (up to 50).

##### `useTopArtists(timeRange?, limit?): QueryResult`
Hook for fetching standard top artists (up to 50).

#### Extended Hooks (NEW)

##### `useExtendedTopTracks(timeRange?, totalLimit?): QueryResult`
Hook for fetching extended top tracks dataset.

```typescript
const { data, isLoading, error } = useExtendedTopTracks('medium_term', 500);
```

**Features:**
- Fetches up to 500 tracks
- Extended caching (10 minutes vs 5 minutes)
- Optimized for large datasets
- Includes loading states for pagination

##### `useExtendedTopArtists(timeRange?, totalLimit?): QueryResult`
Hook for fetching extended top artists dataset.

```typescript
const { data, isLoading, error } = useExtendedTopArtists('medium_term', 500);
```

## Spotify API Integration

### Base URL
```
https://api.spotify.com/v1
```

### Authentication Header
```
Authorization: Bearer {access_token}
```

### Standard Endpoints

#### Get User's Top Tracks
```
GET /me/top/tracks?limit=50&time_range=medium_term&offset=0
```

**Scopes Required:** `user-top-read`

**Parameters:**
- `limit` - Number of tracks (1-50)
- `time_range` - `short_term`, `medium_term`, or `long_term`
- `offset` - Index of first track to return (for pagination)

#### Get User's Top Artists
```
GET /me/top/artists?limit=50&time_range=medium_term&offset=0
```

**Scopes Required:** `user-top-read`

## Extended Data Fetching

### Pagination Strategy

The extended data fetching methods use a pagination approach to gather larger datasets:

1. **Multiple Requests**: Makes sequential API calls with different offset values
2. **Rate Limiting**: Implements 100ms delays between requests to respect API limits
3. **Error Handling**: Gracefully handles failures and continues with partial data
4. **Caching**: Uses longer cache times (10 minutes) for extended datasets

### Implementation Example

```typescript
// Fetch up to 500 top tracks
const fetchExtendedTracks = async () => {
  const allTracks = [];
  const maxLimit = 50; // Spotify API limit per request
  let offset = 0;
  const totalLimit = 500;
  
  while (allTracks.length < totalLimit && offset < 1000) {
    const response = await fetch(`/me/top/tracks?limit=${maxLimit}&offset=${offset}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    const data = await response.json();
    allTracks.push(...data.items);
    offset += maxLimit;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return { items: allTracks, total: allTracks.length };
};
```

### Benefits of Extended Data

1. **Deeper Insights**: More comprehensive genre analysis with 500+ artists
2. **Better Statistics**: More accurate popularity and diversity metrics
3. **Enhanced Discovery**: Find patterns not visible in top 50
4. **Improved Accuracy**: Better representation of actual listening habits

### Performance Considerations

- **Loading Time**: Extended fetching takes 5-15 seconds depending on data size
- **Memory Usage**: Larger datasets require more browser memory
- **Network Usage**: Multiple API calls increase bandwidth usage
- **Rate Limits**: Respects Spotify's rate limits with built-in delays

## Error Handling

### Error Types

#### Extended Fetching Errors
```typescript
interface ExtendedFetchError {
  type: 'rate_limit' | 'network' | 'auth' | 'partial_data';
  message: string;
  itemsFetched: number;
  totalRequested: number;
}
```

#### Rate Limiting for Extended Requests
```typescript
const handleExtendedRateLimit = async (requestCount: number) => {
  if (requestCount > 5) {
    // Increase delay for multiple requests
    const delay = Math.min(200 + (requestCount * 50), 1000);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};
```

### Best Practices for Extended Data

1. **Graceful Degradation**: Continue with partial data if some requests fail
2. **Progress Indication**: Show loading progress for long-running requests
3. **Caching Strategy**: Cache extended datasets longer to reduce API calls
4. **User Communication**: Inform users about longer loading times

## Rate Limiting

### Enhanced Rate Limiting for Extended Requests

#### Spotify API Limits
- **Standard Rate Limit:** 100 requests per minute per user
- **Burst Limit:** 10 requests per second
- **Extended Fetching:** Up to 10 requests for 500 items

#### Advanced Rate Limit Handling
```typescript
class RateLimitManager {
  private requestCount = 0;
  private requestWindow = 60000; // 1 minute
  private lastReset = Date.now();
  
  async throttleRequest(): Promise<void> {
    if (Date.now() - this.lastReset > this.requestWindow) {
      this.requestCount = 0;
      this.lastReset = Date.now();
    }
    
    if (this.requestCount >= 90) { // Leave buffer
      const waitTime = this.requestWindow - (Date.now() - this.lastReset);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requestCount++;
  }
}
```

#### Progressive Backoff Strategy
```typescript
const progressiveDelay = (requestIndex: number): number => {
  // Start with 100ms, increase gradually
  return Math.min(100 + (requestIndex * 25), 500);
};
```

## Security & Privacy

### Profile Image Storage

#### Secure Storage Implementation
```typescript
const storeProfileImage = (userData: any) => {
  try {
    if (userData?.images?.[0]?.url) {
      // Validate image URL before storage
      const imageUrl = userData.images[0].url;
      if (imageUrl.startsWith('https://') && imageUrl.includes('spotify')) {
        localStorage.setItem('user_profile_image', imageUrl);
        console.log('Profile image stored securely');
      }
    }
  } catch (error) {
    console.warn('Failed to store profile image:', error);
  }
};
```

#### Profile Image Retrieval
```typescript
const getUserProfileImage = () => {
  // Check for cached profile image first
  const cachedImage = localStorage.getItem('user_profile_image');
  if (cachedImage) {
    return cachedImage;
  }
  
  // Fallback to user.images if available
  return user.images?.[0]?.url || null;
};
```

### Data Clearing & Privacy

#### Comprehensive Data Cleanup
```typescript
const clearAllUserData = () => {
  try {
    const keysToRemove = [
      'spotify_access_token',
      'spotify_refresh_token', 
      'spotify_token_expiry',
      'user_profile',
      'user_profile_image'  // Profile image is cleared on logout
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('All user data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
```

### Authentication Flow Improvements

#### Enhanced Login Process
- **Single-Step Login:** Fixed double login requirement
- **Token Validation:** Background validation without blocking UI
- **Error Recovery:** Graceful handling of expired or invalid tokens
- **Secure Storage:** Profile images stored with validation

#### Logout Enhancement
```typescript
const logout = async () => {
  try {
    console.log('Logging out user...');
    setUser(null);
    setError(null);
    clearAllUserData(); // Includes profile image cleanup
    console.log('Logout completed successfully');
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local state even if there's an error
    setUser(null);
    setError(null);
    clearAllUserData();
  }
};
```

### Error Handling & Recovery

#### Site Stability Improvements
- **Graceful Degradation:** App doesn't break when data is cleared
- **Error Recovery UI:** User-friendly error messages with recovery options
- **Token Expiry Handling:** Automatic cleanup of expired authentication data
- **Background Validation:** Non-blocking token verification

#### Error Recovery Component
```typescript
// Enhanced AuthGuard with error recovery
if (error && !user) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-destructive font-bold text-xl">!</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">Connection Issue</h2>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <div className="space-y-2">
          <button onClick={() => window.location.reload()}>Refresh Page</button>
          <button onClick={() => window.location.href = '/index'}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
```

### Navigation Security

#### Protected Navigation
- **Dashboard Access:** Properly secured dashboard routes
- **Back Navigation:** Fixed "Back to Dashboard" buttons routing correctly
- **Logout Security:** Complete session cleanup on sign out
- **Profile Protection:** Avatar display with secure image handling

### Best Practices Implemented

1. **Privacy by Design:** All sensitive data cleared on logout
2. **Secure Storage:** Profile images validated before storage
3. **Error Recovery:** Graceful handling of authentication failures
4. **Single Sign-On:** Fixed double login requirement
5. **Session Management:** Proper token expiry and refresh handling
6. **UI Consistency:** Fixed navigation button behaviors
7. **Fallback Handling:** Graceful degradation when APIs fail

## Testing

### Extended Data Tests
```typescript
describe('Extended Data Fetching', () => {
  test('should fetch up to 500 tracks', async () => {
    const result = await spotifyAPI.getExtendedTopTracks(token, 'medium_term', 500);
    expect(result.items.length).toBeLessThanOrEqual(500);
    expect(result.items.length).toBeGreaterThan(50);
  });
  
  test('should handle rate limiting gracefully', async () => {
    const startTime = Date.now();
    await spotifyAPI.getExtendedTopTracks(token, 'medium_term', 200);
    const duration = Date.now() - startTime;
    expect(duration).toBeGreaterThan(1000); // Should include delays
  });
});
```

### Performance Tests
```typescript
describe('Performance Monitoring', () => {
  test('should complete extended fetch within reasonable time', async () => {
    const startTime = performance.now();
    await spotifyAPI.getExtendedTopTracks(token, 'medium_term', 500);
    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(30000); // 30 seconds max
  });
});
```
