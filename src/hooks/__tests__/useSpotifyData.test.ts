import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSpotifyData } from '../useSpotifyData'
import React, { ReactNode } from 'react'

// Mock the spotify API
vi.mock('@/lib/spotify-api', () => ({
  spotifyAPI: {
    getTopTracks: vi.fn(),
    getTopArtists: vi.fn(),
    getRecentlyPlayed: vi.fn(),
    getCurrentPlayback: vi.fn(),
    getExtendedTopTracks: vi.fn(),
    getExtendedTopArtists: vi.fn(),
  },
}))

// Mock the data integration
vi.mock('@/lib/spotify-data-integration', () => ({
  spotifyDataIntegration: {
    getEnhancedRecentlyPlayed: vi.fn(),
    getEnhancedTopTracks: vi.fn(),
    getEnhancedTopArtists: vi.fn(),
  },
}))

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

describe('useSpotifyData', () => {
  let queryClient: QueryClient

  const wrapper = ({ children }: { children: ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('mock-token')
    
    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/dashboard',
      },
      writable: true,
    })
  })

  it('returns an object with hook functions', () => {
    const { result } = renderHook(() => useSpotifyData(), { wrapper })

    expect(result.current).toHaveProperty('useEnhancedRecentlyPlayed')
    expect(result.current).toHaveProperty('useEnhancedTopTracks')
    expect(result.current).toHaveProperty('useEnhancedTopArtists')
    expect(result.current).toHaveProperty('useTopTracks')
    expect(result.current).toHaveProperty('useTopArtists')
    expect(result.current).toHaveProperty('useRecentlyPlayed')
    expect(result.current).toHaveProperty('useCurrentPlayback')
    expect(result.current).toHaveProperty('useExtendedTopTracks')
    expect(result.current).toHaveProperty('useExtendedTopArtists')
    expect(result.current).toHaveProperty('useListeningStats')

    // All should be functions
    expect(typeof result.current.useEnhancedRecentlyPlayed).toBe('function')
    expect(typeof result.current.useEnhancedTopTracks).toBe('function')
    expect(typeof result.current.useEnhancedTopArtists).toBe('function')
    expect(typeof result.current.useTopTracks).toBe('function')
    expect(typeof result.current.useTopArtists).toBe('function')
    expect(typeof result.current.useRecentlyPlayed).toBe('function')
    expect(typeof result.current.useCurrentPlayback).toBe('function')
    expect(typeof result.current.useExtendedTopTracks).toBe('function')
    expect(typeof result.current.useExtendedTopArtists).toBe('function')
    expect(typeof result.current.useListeningStats).toBe('function')
  })

  it('detects demo mode correctly', () => {
    // Test sandbox route
    Object.defineProperty(window, 'location', {
      value: { pathname: '/sandbox' },
      writable: true,
    })

    const { result } = renderHook(() => useSpotifyData(), { wrapper })
    
    // Should still return the same hook functions
    expect(result.current).toHaveProperty('useEnhancedTopTracks')
    expect(typeof result.current.useEnhancedTopTracks).toBe('function')
  })

  it('hooks return valid query results', () => {
    const { result } = renderHook(() => {
      const hooks = useSpotifyData()
      return hooks.useEnhancedTopTracks()
    }, { wrapper })

    expect(result.current).toHaveProperty('data')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('refetch')
  })

  it('hooks accept parameters correctly', () => {
    const { result } = renderHook(() => {
      const hooks = useSpotifyData()
      return {
        enhancedTracks: hooks.useEnhancedTopTracks('short_term', 100),
        enhancedArtists: hooks.useEnhancedTopArtists('long_term', 200),
        enhancedRecent: hooks.useEnhancedRecentlyPlayed(50),
        topTracks: hooks.useTopTracks('medium_term', 25),
        topArtists: hooks.useTopArtists('short_term', 30),
        recentlyPlayed: hooks.useRecentlyPlayed(40),
        extendedTracks: hooks.useExtendedTopTracks('long_term', 500),
        extendedArtists: hooks.useExtendedTopArtists('medium_term', 600),
        listeningStats: hooks.useListeningStats('short_term'),
      }
    }, { wrapper })

    // All hooks should return valid query results
    Object.values(result.current).forEach(hookResult => {
      expect(hookResult).toHaveProperty('data')
      expect(hookResult).toHaveProperty('isLoading')
      expect(hookResult).toHaveProperty('error')
      expect(hookResult).toHaveProperty('refetch')
    })
  })

  it('provides consistent hook interface', () => {
    const { result } = renderHook(() => useSpotifyData(), { wrapper })

    const hookNames = [
      'useEnhancedTopTracks',
      'useEnhancedTopArtists', 
      'useEnhancedRecentlyPlayed',
      'useTopTracks',
      'useTopArtists',
      'useRecentlyPlayed',
      'useCurrentPlayback',
      'useExtendedTopTracks',
      'useExtendedTopArtists',
      'useListeningStats',
    ]

    hookNames.forEach(hookName => {
      expect(result.current).toHaveProperty(hookName)
      expect(typeof result.current[hookName]).toBe('function')
    })
  })
}) 