import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  isAuthenticated,
  getAccessToken,
  isDemoMode,
  validateTokenScopes,
  hasPlaybackPermissions,
  shouldEnablePlaybackFeatures,
  getScopes,
  getExtendedScopes,
  getClientId,
  getRedirectUri,
} from '../spotify-auth-core'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('spotify-auth-core', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/',
        origin: 'http://localhost:5173',
      },
      writable: true,
    })
  })

  describe('isAuthenticated', () => {
    it('returns false when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      expect(isAuthenticated()).toBe(false)
    })

    it('returns false when no expiry exists', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'valid-token'
        if (key === 'spotify_token_expiry') return null
        return null
      })
      expect(isAuthenticated()).toBe(false)
    })

    it('returns false when token is expired', () => {
      const expiredTime = Date.now() - 1000 // 1 second ago
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'valid-token'
        if (key === 'spotify_token_expiry') return expiredTime.toString()
        return null
      })
      expect(isAuthenticated()).toBe(false)
    })

    it('returns true when token is valid and not expired', () => {
      const futureTime = Date.now() + 3600000 // 1 hour from now
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'valid-token'
        if (key === 'spotify_token_expiry') return futureTime.toString()
        return null
      })
      expect(isAuthenticated()).toBe(true)
    })
  })

  describe('getAccessToken', () => {
    it('returns null when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      expect(getAccessToken()).toBe(null)
    })

    it('returns null when token is expired', () => {
      const expiredTime = Date.now() - 1000
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'valid-token'
        if (key === 'spotify_token_expiry') return expiredTime.toString()
        return null
      })
      expect(getAccessToken()).toBe(null)
    })

    it('returns token when valid and not expired', () => {
      const futureTime = Date.now() + 3600000
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'valid-token'
        if (key === 'spotify_token_expiry') return futureTime.toString()
        return null
      })
      expect(getAccessToken()).toBe('valid-token')
    })
  })

  describe('isDemoMode', () => {
    it('returns true when on /sandbox route', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/sandbox' },
        writable: true,
      })
      expect(isDemoMode()).toBe(true)
    })

    it('returns false when on /dashboard route', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/dashboard' },
        writable: true,
      })
      expect(isDemoMode()).toBe(false)
    })

    it('returns false when on root route', () => {
      Object.defineProperty(window, 'location', {
        value: { pathname: '/' },
        writable: true,
      })
      expect(isDemoMode()).toBe(false)
    })
  })

  describe('validateTokenScopes', () => {
    it('returns false when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      expect(validateTokenScopes(['streaming'])).toBe(false)
    })

    it('returns false for demo token', () => {
      const futureTime = Date.now() + 3600000
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'demo_access_token'
        if (key === 'spotify_token_expiry') return futureTime.toString()
        return null
      })
      expect(validateTokenScopes(['streaming'])).toBe(false)
    })

    it('returns true for valid real token', () => {
      const futureTime = Date.now() + 3600000
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'real-token'
        if (key === 'spotify_token_expiry') return futureTime.toString()
        return null
      })
      expect(validateTokenScopes(['streaming'])).toBe(true)
    })
  })

  describe('hasPlaybackPermissions', () => {
    it('returns false when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      expect(hasPlaybackPermissions()).toBe(false)
    })

    it('returns false for demo token', () => {
      const futureTime = Date.now() + 3600000
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'demo_access_token'
        if (key === 'spotify_token_expiry') return futureTime.toString()
        return null
      })
      expect(hasPlaybackPermissions()).toBe(false)
    })

    it('returns false for real token (default behavior)', () => {
      const futureTime = Date.now() + 3600000
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'spotify_access_token') return 'real-token'
        if (key === 'spotify_token_expiry') return futureTime.toString()
        return null
      })
      expect(hasPlaybackPermissions()).toBe(false)
    })
  })

  describe('shouldEnablePlaybackFeatures', () => {
    it('returns false when playback not enabled in localStorage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'enable_playback_features') return 'false'
        return null
      })
      expect(shouldEnablePlaybackFeatures()).toBe(false)
    })

    it('returns false when playback enabled but no permissions', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'enable_playback_features') return 'true'
        if (key === 'spotify_access_token') return 'demo_access_token'
        return null
      })
      expect(shouldEnablePlaybackFeatures()).toBe(false)
    })
  })

  describe('configuration functions', () => {
    it('getScopes returns core scopes', () => {
      const scopes = getScopes()
      expect(scopes).toContain('user-read-private')
      expect(scopes).toContain('user-top-read')
      expect(scopes).toContain('user-read-recently-played')
      expect(scopes).not.toContain('streaming')
    })

    it('getExtendedScopes includes optional scopes', () => {
      const scopes = getExtendedScopes()
      expect(scopes).toContain('user-read-private')
      expect(scopes).toContain('streaming')
      expect(scopes).toContain('user-modify-playback-state')
    })

    it('getClientId returns environment client ID', () => {
      expect(getClientId()).toBe('af5f0c1ca1704677a98efb92b4d9d212')
    })

    it('getRedirectUri returns environment redirect URI', () => {
      expect(getRedirectUri()).toBe('http://127.0.0.1:8080/callback')
    })
  })
}) 