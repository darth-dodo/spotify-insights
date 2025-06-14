
# Security Documentation

## Table of Contents
1. [Security Overview](#security-overview)
2. [Authentication Security](#authentication-security)
3. [Data Protection](#data-protection)
4. [Privacy Implementation](#privacy-implementation)
5. [Security Headers](#security-headers)
6. [Vulnerability Assessment](#vulnerability-assessment)
7. [Compliance](#compliance)

## Security Overview

### Security Principles
1. **Privacy by Design** - Minimal data collection from the start
2. **Zero Trust** - Never trust, always verify
3. **Defense in Depth** - Multiple layers of security
4. **Least Privilege** - Minimum necessary permissions
5. **Data Minimization** - Collect only what's needed

### Threat Model
| Threat | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **XSS Attacks** | High | Medium | CSP headers, input sanitization |
| **Token Theft** | High | Low | Secure storage, HTTPS only |
| **CSRF Attacks** | Medium | Low | State parameter, SameSite cookies |
| **Data Breaches** | Medium | Low | Minimal data storage, hashing |
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

### Encryption at Rest
```typescript
// Client-side encryption for sensitive data
class SecureStorage {
  private static async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptData(data: string): Promise<string> {
    const key = await this.generateKey();
    const encoded = new TextEncoder().encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );
    
    return btoa(JSON.stringify({
      data: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    }));
  }
}
```

### Data Lifecycle Management
```typescript
// Automatic data cleanup on user logout
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
  
  console.log('All user data securely cleared');
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

### Privacy Controls Implementation
```typescript
// User data export functionality
const exportUserData = () => {
  const userData = {
    profile: JSON.parse(localStorage.getItem('user_profile') || '{}'),
    preferences: {
      theme: localStorage.getItem('theme'),
      accentColor: localStorage.getItem('accentColor')
    },
    metadata: {
      exportDate: new Date().toISOString(),
      dataVersion: '1.0',
      format: 'JSON'
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

## Security Headers

### Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.spotify.com https://accounts.spotify.com;
  font-src 'self';
  media-src 'self';
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

### Common Vulnerabilities & Mitigations

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

### Security Testing Checklist
- [ ] OAuth flow security validation
- [ ] Token storage encryption
- [ ] XSS vulnerability scanning
- [ ] CSRF protection testing
- [ ] Data sanitization verification
- [ ] Security header validation
- [ ] Third-party dependency audit
- [ ] Privacy control functionality

## Compliance

### GDPR Compliance

#### Article 25 - Data Protection by Design
- **Implementation:** Minimal data collection from system design
- **Evidence:** Data minimization in code architecture

#### Article 32 - Security of Processing
- **Implementation:** SHA-256 hashing, secure storage
- **Evidence:** Cryptographic protection measures

#### Article 17 - Right to Erasure
- **Implementation:** Data deletion functionality
- **Evidence:** Complete data removal on user request

```typescript
// GDPR Article 17 compliance implementation
const rightToErasure = async () => {
  // Clear all personal data
  localStorage.clear();
  sessionStorage.clear();
  
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
  
  console.log('All personal data erased per GDPR Article 17');
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

### Error Tracking
```typescript
// Security event logging
const logSecurityEvent = (event: string, details: any) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.warn('Security Event:', securityLog);
  
  // In production, send to security monitoring service
  // fetch('/api/security-log', {
  //   method: 'POST',
  //   body: JSON.stringify(securityLog)
  // });
};

// Monitor for potential security issues
window.addEventListener('error', (event) => {
  if (event.error?.name === 'SecurityError') {
    logSecurityEvent('SecurityError', {
      message: event.error.message,
      stack: event.error.stack
    });
  }
});
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
