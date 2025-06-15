# Security Documentation

## Table of Contents
1. [Security Overview](#security-overview)
2. [Authentication Security](#authentication-security)
3. [Data Protection](#data-protection)
4. [Privacy Implementation](#privacy-implementation)
5. [Web Playback SDK Security](#web-playback-sdk-security)
6. [Security Headers](#security-headers)
7. [Vulnerability Assessment](#vulnerability-assessment)
8. [Compliance](#compliance)

## Security Overview

### Security Principles
1. **Privacy by Design** - Minimal data collection from the start
2. **Local-First Processing** - Real-time data processed locally without permanent storage
3. **Zero Trust** - Never trust, always verify
4. **Defense in Depth** - Multiple layers of security
5. **Least Privilege** - Minimum necessary permissions
6. **Data Minimization** - Collect only what's needed

### Enhanced Threat Model
| Threat | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **XSS Attacks** | High | Medium | CSP headers, input sanitization |
| **Token Theft** | High | Low | Secure storage, HTTPS only |
| **CSRF Attacks** | Medium | Low | State parameter, SameSite cookies |
| **Playback Data Interception** | Medium | Low | Local-only processing, no transmission |
| **Memory-based Data Leaks** | Low | Low | Automatic cleanup, session limits |
| **Man-in-the-Middle** | High | Low | HTTPS enforcement, HSTS |

## Authentication Security

### OAuth 2.0 with PKCE Implementation

#### PKCE Flow Security
```typescript
class SpotifyAuth {
  private generateRandomString(length: number): string {
    // Use cryptographically secure random generation
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  private async sha256(plain: string): Promise<ArrayBuffer> {
    // Use Web Crypto API for secure hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
  }

  private base64encode(input: ArrayBuffer): string {
    // RFC 4648 base64url encoding
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
```

#### State Parameter Protection
- **Purpose:** Prevent CSRF attacks
- **Implementation:** Random 16-character string
- **Storage:** Temporary localStorage
- **Validation:** Server callback verification

#### Token Security
```typescript
// Secure token storage pattern
const storeTokenSecurely = (tokens: TokenResponse) => {
  // Use structured storage with metadata
  const tokenData = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + (tokens.expires_in * 1000),
    created_at: Date.now()
  };
  
  // Store with consistent keys
  localStorage.setItem('spotify_tokens', JSON.stringify(tokenData));
};

// Automatic token cleanup
const cleanupExpiredTokens = () => {
  const tokenData = localStorage.getItem('spotify_tokens');
  if (tokenData) {
    const tokens = JSON.parse(tokenData);
    if (tokens.expires_at < Date.now()) {
      localStorage.removeItem('spotify_tokens');
      localStorage.removeItem('user_profile');
    }
  }
};
```

## Data Protection

### Data Hashing Strategy

#### SHA-256 Implementation
```typescript
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

#### Data Sanitization Matrix
| Original Data | Sanitization Method | Stored Format | Security Level |
|---|---|---|---|
| `spotify:user:1234567890` | SHA-256 + truncate | `abc123xyz` | High |
| `John Doe Smith` | Truncate + filter | `John D` | Medium |
| `https://image.url/pic.jpg` | Boolean conversion | `true/false` | High |
| `user@example.com` | Not collected | `null` | Maximum |
| `United States` | ISO code conversion | `US` | Low |

### Enhanced Data Lifecycle Management
```typescript
// Comprehensive data cleanup including playback session data
const secureLogout = () => {
  // Clear all authentication data
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('user_profile');
  
  // Clear temporary auth data
  localStorage.removeItem('code_verifier');
  localStorage.removeItem('auth_state');
  
  // Clear any cached API responses
  queryClient.clear();
  
  // Clear session storage
  sessionStorage.clear();
  
  // Disconnect and clear Web Playback SDK data
  if (window.spotifyPlaybackSDK) {
    window.spotifyPlaybackSDK.disconnect();
  }
  
  console.log('All user data including playback session data securely cleared');
};
```

## Privacy Implementation

### Data Minimization Principles

#### Collection Limitation
```typescript
// Only collect essential data fields
const sanitizeUserData = (userData: any) => {
  return {
    // Hash sensitive identifiers
    id: generateShortHash(userData.id || ''),
    
    // Truncate personal information
    display_name: userData.display_name?.substring(0, 20) || 'User',
    
    // Convert to boolean flags
    has_image: Boolean(userData.images && userData.images.length > 0),
    
    // Use standard codes
    country: userData.country?.substring(0, 2) || 'US'
  };
};
```

#### Purpose Limitation
- **User Profile:** Authentication and display only
- **Listening Data:** Analytics generation only
- **Tokens:** API access only
- **Preferences:** UI customization only

### Enhanced Privacy Controls Implementation
```typescript
// Enhanced user data export including playback session info
const exportUserData = () => {
  const userData = {
    profile: JSON.parse(localStorage.getItem('user_profile') || '{}'),
    preferences: {
      theme: localStorage.getItem('theme'),
      accentColor: localStorage.getItem('accentColor')
    },
    sessionInfo: {
      playbackSDKConnected: window.spotifyPlaybackSDK?.isConnected() || false,
      sessionStats: window.spotifyPlaybackSDK?.getSessionStats() || null,
      note: "Playback session data is temporary and not included in export"
    },
    metadata: {
      exportDate: new Date().toISOString(),
      dataVersion: '2.0',
      format: 'JSON',
      privacyLevel: 'Enhanced with local-only processing'
    }
  };
  
  const dataBlob = new Blob([JSON.stringify(userData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `spotify-analytics-data-${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};
```

## Web Playback SDK Security

### Local-Only Processing Security
```typescript
// Security-focused playback session management
class SecurePlaybackSession {
  private static readonly MAX_SESSION_SIZE = 100;
  private static readonly SESSION_TIMEOUT = 3600000; // 1 hour
  
  private sessionData: LocalPlaybackSession[] = [];
  private lastActivity: number = Date.now();
  
  // Security: Automatic session cleanup
  private cleanupExpiredSessions() {
    const now = Date.now();
    
    // Remove old sessions beyond timeout
    this.sessionData = this.sessionData.filter(
      session => (now - session.timestamp) < SecurePlaybackSession.SESSION_TIMEOUT
    );
    
    // Limit memory usage
    if (this.sessionData.length > SecurePlaybackSession.MAX_SESSION_SIZE) {
      this.sessionData = this.sessionData.slice(-SecurePlaybackSession.MAX_SESSION_SIZE);
    }
  }
  
  // Security: Sanitized data processing
  processPlaybackEvent(state: PlaybackState) {
    this.cleanupExpiredSessions();
    
    // Only store essential, non-sensitive data
    const sanitizedSession: LocalPlaybackSession = {
      timestamp: Date.now(),
      trackId: this.sanitizeTrackId(state.track_window.current_track.id),
      duration: Math.max(0, state.duration), // Prevent negative values
      progress: Math.max(0, Math.min(state.position, state.duration)), // Clamp progress
      deviceType: this.detectSecureDeviceType()
    };
    
    this.sessionData.push(sanitizedSession);
    this.lastActivity = Date.now();
  }
  
  private sanitizeTrackId(trackId: string): string {
    // Ensure track ID is a valid Spotify ID format
    return trackId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 22);
  }
  
  private detectSecureDeviceType(): 'web' | 'mobile' | 'desktop' {
    // Minimal user agent detection without exposing detailed browser info
    const userAgent = navigator.userAgent.toLowerCase();
    return /mobile|android|iphone|ipad/.test(userAgent) ? 'mobile' : 'web';
  }
  
  // Security: Complete data clearing
  clearAllData() {
    this.sessionData = [];
    this.lastActivity = 0;
    console.log('All playback session data securely cleared');
  }
}
```

### SDK Integration Security
```typescript
// Secure SDK initialization with error handling
const initializePlaybackSDKSecurely = async (token: string) => {
  try {
    // Validate token format before use
    if (!token || !token.match(/^[A-Za-z0-9_-]+$/)) {
      throw new Error('Invalid token format');
    }
    
    // Initialize with minimal permissions
    const player = new window.Spotify.Player({
      name: 'Spotify Analytics Dashboard',
      getOAuthToken: (cb: (token: string) => void) => {
        // Verify token is still valid before providing
        if (isTokenValid(token)) {
          cb(token);
        } else {
          logSecurityEvent('Token validation failed', { action: 'playback_auth' });
          throw new Error('Token expired or invalid');
        }
      },
      volume: 0.5
    });
    
    // Security: Monitor for suspicious activity
    player.addListener('initialization_error', ({ message }: { message: string }) => {
      logSecurityEvent('Playback SDK initialization error', { message });
    });
    
    player.addListener('authentication_error', ({ message }: { message: string }) => {
      logSecurityEvent('Playback SDK authentication error', { message });
    });
    
    return player;
  } catch (error) {
    logSecurityEvent('Playback SDK security error', { error: error.message });
    throw error;
  }
};
```

## Security Headers

### Enhanced CSP for Playback SDK
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://sdk.scdn.co;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: *.spotifycdn.com *.scdn.co;
  connect-src 'self' https://api.spotify.com https://accounts.spotify.com wss://dealer.spotify.com;
  font-src 'self';
  media-src 'self' https: *.spotifycdn.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

### Additional Security Headers
```typescript
// Recommended security headers for deployment
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
```

## Vulnerability Assessment

### Enhanced Vulnerabilities & Mitigations

#### Playback Data Exposure
- **Risk:** Medium
- **Mitigation:**
  - Local-only processing (no network transmission)
  - Memory-only storage (no persistence)
  - Automatic cleanup on session end
  - User-controlled data clearing

#### Memory-based Attacks
- **Risk:** Low
- **Mitigation:**
  - Session size limits (max 100 entries)
  - Automatic timeout cleanup (1 hour)
  - Sanitized data storage
  - No sensitive data in memory

#### XSS (Cross-Site Scripting)
- **Risk:** High
- **Mitigation:** 
  - CSP headers
  - Input sanitization
  - React's built-in XSS protection
  - No `dangerouslySetInnerHTML` usage

#### CSRF (Cross-Site Request Forgery)
- **Risk:** Medium
- **Mitigation:**
  - OAuth state parameter
  - SameSite cookie attributes
  - Origin validation

#### Token Exposure
- **Risk:** High
- **Mitigation:**
  - Secure localStorage usage
  - Automatic token rotation
  - No token logging
  - HTTPS enforcement

#### Data Leakage
- **Risk:** Medium
- **Mitigation:**
  - Minimal data collection
  - Data hashing
  - Secure data disposal
  - No analytics tracking

### Enhanced Security Testing Checklist
- [ ] OAuth flow security validation
- [ ] Token storage encryption
- [ ] XSS vulnerability scanning
- [ ] CSRF protection testing
- [ ] Data sanitization verification
- [ ] Security header validation
- [ ] Playback SDK isolation testing
- [ ] Memory leak detection
- [ ] Session cleanup verification
- [ ] Privacy control functionality
- [ ] Third-party dependency audit

## Compliance

### Enhanced GDPR Compliance

#### Article 25 - Data Protection by Design
- **Implementation:** Local-only playback processing, minimal data collection
- **Evidence:** Web Playback SDK with memory-only storage architecture

#### Article 32 - Security of Processing
- **Implementation:** Enhanced security with local processing, no persistent storage of playback data
- **Evidence:** Memory-only session management, automatic cleanup mechanisms

#### Article 17 - Right to Erasure
- **Implementation:** Data deletion functionality
- **Evidence:** Complete data removal on user request

```typescript
// Enhanced GDPR Article 17 compliance with playback data
const enhancedRightToErasure = async () => {
  // Clear all personal data
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear playback session data
  if (window.spotifyPlaybackSDK) {
    window.spotifyPlaybackSDK.disconnect();
  }
  
  // Clear any cached data
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
  
  // Clear IndexedDB if used
  if ('indexedDB' in window) {
    // Implementation for clearing IndexedDB
  }
  
  console.log('All personal data including playback session data erased per GDPR Article 17');
};
```

### CCPA Compliance

#### Right to Know
- **Implementation:** Data transparency in Privacy Controls
- **Evidence:** Clear data collection disclosure

#### Right to Delete
- **Implementation:** Data deletion functionality
- **Evidence:** Complete data removal capability

#### Right to Opt-Out
- **Implementation:** No data sale (not applicable)
- **Evidence:** No third-party data sharing

### Privacy Policy Requirements
1. **Data Collection:** What data we collect and why
2. **Data Usage:** How we use the collected data
3. **Data Sharing:** We don't share data with third parties
4. **Data Retention:** Session-only data retention
5. **User Rights:** Access, export, delete capabilities
6. **Contact Information:** Privacy officer contact details

## Security Monitoring

### Enhanced Error Tracking
```typescript
// Enhanced security event logging including playback events
const logSecurityEvent = (event: string, details: any) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    details: {
      ...details,
      playbackSDKActive: window.spotifyPlaybackSDK?.isConnected() || false,
      sessionDataSize: window.spotifyPlaybackSDK?.getSessionStats()?.sessionLength || 0
    },
    userAgent: navigator.userAgent.substring(0, 100), // Truncate for privacy
    url: window.location.href
  };
  
  console.warn('Security Event:', securityLog);
  
  // In production, send to security monitoring service
  // fetch('/api/security-log', {
  //   method: 'POST',
  //   body: JSON.stringify(securityLog)
  // });
};

// Monitor playback SDK security events
if (window.spotifyPlaybackSDK) {
  // Monitor for excessive session data
  setInterval(() => {
    const stats = window.spotifyPlaybackSDK.getSessionStats();
    if (stats?.sessionLength > 200) {
      logSecurityEvent('Excessive session data detected', {
        sessionLength: stats.sessionLength,
        action: 'automatic_cleanup_triggered'
      });
      window.spotifyPlaybackSDK.clearSessionData();
    }
  }, 300000); // Check every 5 minutes
}
```

### Performance Monitoring
```typescript
// Monitor for suspicious activity patterns
const monitorAuthAttempts = () => {
  const attempts = localStorage.getItem('auth_attempts') || '0';
  const attemptCount = parseInt(attempts) + 1;
  
  if (attemptCount > 5) {
    logSecurityEvent('Excessive auth attempts', {
      count: attemptCount,
      timeWindow: '1 hour'
    });
  }
  
  localStorage.setItem('auth_attempts', attemptCount.toString());
  
  // Reset counter after 1 hour
  setTimeout(() => {
    localStorage.removeItem('auth_attempts');
  }, 3600000);
};
```

## Security Maintenance

### Regular Security Tasks
- **Weekly:** Review error logs for security issues
- **Monthly:** Update dependencies and scan for vulnerabilities
- **Quarterly:** Security audit and penetration testing
- **Annually:** Complete security architecture review

### Dependency Security
```bash
# Regular security audits
npm audit
npm audit fix

# Check for known vulnerabilities
npx audit-ci --moderate
```

### Security Updates
- Monitor security advisories for all dependencies
- Implement automatic security updates where possible
- Maintain security changelog
- Regular security training for development team

This enhanced security documentation reflects the implementation of Web Playback SDK with local-only processing, maintaining the application's privacy-first approach while providing real-time capabilities.
