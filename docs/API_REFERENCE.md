
# API Reference Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Data Structures](#data-structures)
3. [Internal APIs](#internal-apis)
4. [Spotify API Integration](#spotify-api-integration)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

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

### User Profile (Sanitized)
```typescript
interface User {
  id: string;           // Hashed user ID (SHA-256, shortened)
  display_name: string; // Truncated to 20 characters
  has_image: boolean;   // Boolean flag for profile image
  country: string;      // 2-letter country code
}
```

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

## Internal APIs

### SpotifyAuth Class

#### Methods

##### `login(): Promise<void>`
Initiates the OAuth flow by redirecting to Spotify's authorization server.

```typescript
await spotifyAuth.login();
```

**Throws:**
- `Error` if CLIENT_ID is not configured

##### `handleCallback(code: string, state: string): Promise<void>`
Handles the OAuth callback and exchanges the authorization code for tokens.

```typescript
await spotifyAuth.handleCallback(authCode, state);
```

**Parameters:**
- `code` - Authorization code from Spotify
- `state` - State parameter for CSRF protection

**Throws:**
- `Error` if state mismatch detected
- `Error` if code verifier not found
- `Error` if token exchange fails

##### `refreshAccessToken(refreshToken: string): Promise<TokenResponse>`
Refreshes the access token using the refresh token.

```typescript
const tokens = await spotifyAuth.refreshAccessToken(refreshToken);
```

**Returns:** New token response object

##### `getCurrentUser(accessToken: string): Promise<SpotifyUser>`
Fetches the current user's profile from Spotify API.

```typescript
const user = await spotifyAuth.getCurrentUser(accessToken);
```

**Returns:** User profile data from Spotify

### Data Utilities

#### `hashData(data: string): Promise<string>`
Hashes sensitive data using SHA-256.

```typescript
const hashedId = await hashData(userId);
```

**Parameters:**
- `data` - String to hash

**Returns:** SHA-256 hash as hex string

#### `generateShortHash(data: string): string`
Generates a shorter hash for display purposes.

```typescript
const shortHash = generateShortHash(userId);
```

**Parameters:**
- `data` - String to hash

**Returns:** Short hash as base-36 string

#### `sanitizeUserData(userData: SpotifyUser): User`
Sanitizes user data to minimal required fields.

```typescript
const sanitizedUser = sanitizeUserData(spotifyUserData);
```

**Parameters:**
- `userData` - Raw Spotify user data

**Returns:** Sanitized user object

### Authentication Hook

#### `useAuth(): AuthContextType`
React hook for authentication state and methods.

```typescript
const { user, isLoading, login, logout, refreshToken } = useAuth();
```

**Returns:**
```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
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

### Endpoints Used

#### Get Current User Profile
```
GET /me
```

**Scopes Required:** `user-read-private`, `user-read-email`

**Response:**
```json
{
  "id": "user_id",
  "display_name": "User Name",
  "email": "user@example.com",
  "images": [...],
  "country": "US",
  "followers": { "total": 100 },
  "product": "premium"
}
```

#### Get User's Top Tracks
```
GET /me/top/tracks?limit=50&time_range=medium_term
```

**Scopes Required:** `user-top-read`

**Parameters:**
- `limit` - Number of tracks (1-50)
- `time_range` - `short_term`, `medium_term`, or `long_term`
- `offset` - Index of first track to return

#### Get User's Top Artists
```
GET /me/top/artists?limit=50&time_range=medium_term
```

**Scopes Required:** `user-top-read`

#### Get Recently Played Tracks
```
GET /me/player/recently-played?limit=50
```

**Scopes Required:** `user-read-recently-played`

#### Get Current Playback State
```
GET /me/player
```

**Scopes Required:** `user-read-playback-state`

## Error Handling

### Error Types

#### Authentication Errors
```typescript
interface AuthError {
  error: string;
  error_description: string;
}
```

Common auth errors:
- `invalid_client` - Invalid client ID
- `invalid_grant` - Invalid authorization code
- `invalid_request` - Malformed request

#### API Errors
```typescript
interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}
```

Common API errors:
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient scope)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Handling Pattern
```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  // Handle specific error cases
  if (error.status === 401) {
    // Token expired, attempt refresh
    await refreshToken();
  }
  throw error;
}
```

## Rate Limiting

### Spotify API Limits
- **Rate Limit:** 100 requests per minute per user
- **Burst Limit:** 10 requests per second
- **Headers:**
  - `X-RateLimit-Limit` - Request limit per minute
  - `X-RateLimit-Remaining` - Remaining requests
  - `X-RateLimit-Reset` - Time when limit resets

### Rate Limit Handling
```typescript
const handleRateLimit = async (response: Response) => {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
    
    console.log(`Rate limited. Retrying after ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the request
    return fetch(url, options);
  }
  return response;
};
```

### Best Practices
1. **Implement exponential backoff** for failed requests
2. **Cache responses** to reduce API calls
3. **Batch requests** when possible
4. **Monitor rate limit headers** and adjust accordingly
5. **Use appropriate time ranges** for data requests

## Security Considerations

### Token Security
- Store tokens in `localStorage` with encryption
- Implement automatic token refresh
- Clear tokens on logout
- Never expose tokens in logs or client-side code

### Data Protection
- Hash all sensitive user identifiers
- Minimize data collection and storage
- Implement proper data sanitization
- Use HTTPS for all communications

### PKCE Implementation
```typescript
// Generate code verifier and challenge
const codeVerifier = generateRandomString(64);
const codeChallenge = await sha256(codeVerifier);
const codeChallengeBase64 = base64URLEncode(codeChallenge);

// Store verifier for later use
localStorage.setItem('code_verifier', codeVerifier);
```

## Testing

### Unit Tests
```typescript
describe('SpotifyAuth', () => {
  test('should generate valid PKCE challenge', async () => {
    const auth = new SpotifyAuth();
    const challenge = await auth.generateCodeChallenge();
    expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });
});
```

### Integration Tests
```typescript
describe('Authentication Flow', () => {
  test('should complete OAuth flow successfully', async () => {
    const authCode = 'test_auth_code';
    const state = 'test_state';
    
    await spotifyAuth.handleCallback(authCode, state);
    
    expect(localStorage.getItem('spotify_access_token')).toBeTruthy();
  });
});
```

### API Mocking
```typescript
// Mock Spotify API responses for testing
const mockSpotifyAPI = {
  '/v1/me': {
    id: 'test_user',
    display_name: 'Test User',
    country: 'US'
  }
};
```
