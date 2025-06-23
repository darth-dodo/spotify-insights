import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  calculateStats,
  calculateGenreAnalysis,
} from '../spotify-data-utils'

// Mock data for testing
const mockValidTracks = [
  {
    id: 'track1',
    name: 'Valid Track 1',
    artists: [{ id: 'artist1', name: 'Artist 1' }],
    album: { id: 'album1', name: 'Album 1' },
    duration_ms: 180000,
    popularity: 75,
    added_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'track2',
    name: 'Valid Track 2',
    artists: [{ id: 'artist2', name: 'Artist 2' }],
    album: { id: 'album2', name: 'Album 2' },
    duration_ms: 240000,
    popularity: 60,
    added_at: '2023-01-02T00:00:00Z',
  },
]

const mockValidArtists = [
  {
    id: 'artist1',
    name: 'Artist 1',
    genres: ['rock', 'alternative'],
    popularity: 80,
    followers: { total: 10000 },
  },
  {
    id: 'artist2',
    name: 'Artist 2',
    genres: ['pop', 'electronic'],
    popularity: 70,
    followers: { total: 5000 },
  },
]

const mockCorruptedTracks = [
  {
    id: null, // Invalid ID
    name: '',  // Empty name
    artists: [], // No artists
    duration_ms: -1000, // Negative duration
    popularity: 150, // Invalid popularity
  },
  {
    id: 'track2',
    name: 'A'.repeat(1000), // Extremely long name
    artists: [{ name: null }], // Invalid artist
    duration_ms: 'invalid', // Wrong type
    popularity: null,
  },
]

// Helper functions for data quality testing
const validateSpotifyData = (data: any[], type: string) => {
  const errors: string[] = []
  const warnings: string[] = []
  const validItems: any[] = []

  if (!data || !Array.isArray(data)) {
    errors.push('Data is not an array')
    return { isValid: false, errors, warnings, validItems }
  }

  if (data.length === 0) {
    warnings.push('Data array is empty')
    return { isValid: true, errors, warnings, validItems }
  }

  data.forEach((item, index) => {
    if (type === 'tracks') {
      if (!item.id || item.id === null) {
        errors.push(`Track at index ${index} is missing ID`)
        return
      }
      if (!item.name || item.name.trim() === '') {
        errors.push(`Track at index ${index} has empty name`)
        return
      }
      if (!Array.isArray(item.artists) || item.artists.length === 0) {
        errors.push(`Track at index ${index} has no artists`)
        return
      }
      if (typeof item.duration_ms !== 'number' || item.duration_ms <= 0) {
        errors.push(`Track at index ${index} has invalid duration`)
        return
      }
      if (typeof item.popularity !== 'number' || item.popularity < 0 || item.popularity > 100) {
        errors.push(`Track at index ${index} has invalid popularity`)
        return
      }
      validItems.push(item)
    } else if (type === 'artists') {
      if (!item.id) {
        errors.push(`Artist at index ${index} is missing ID`)
        return
      }
      if (!item.name) {
        errors.push(`Artist at index ${index} has no name`)
        return
      }
      if (!Array.isArray(item.genres)) {
        errors.push(`Artist at index ${index} has invalid genres`)
        return
      }
      validItems.push(item)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    validItems
  }
}

const sanitizeUserInput = (input: string, type: string): string => {
  if (!input || typeof input !== 'string') return ''
  
  // Remove potentially harmful patterns
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
  
  // Limit length based on type
  const maxLength = type === 'search' ? 100 : type === 'genre' ? 50 : 200
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized.trim()
}

const handleDataInconsistencies = (data: any[], type: string): any[] => {
  if (!Array.isArray(data)) return []
  
  if (type === 'tracks') {
    // Remove duplicates by ID, keeping the one with higher popularity
    const deduped = data.reduce((acc, track) => {
      const existingIndex = acc.findIndex(t => t.id === track.id)
      if (existingIndex >= 0) {
        if (track.popularity > acc[existingIndex].popularity) {
          acc[existingIndex] = track
        }
      } else {
        acc.push(track)
      }
      return acc
    }, [])
    
    // Fix missing artists
    return deduped.map(track => ({
      ...track,
      artists: Array.isArray(track.artists) && track.artists.length > 0 
        ? track.artists 
        : [{ name: 'Unknown Artist' }]
    }))
  }
  
  if (type === 'artists') {
    // Normalize genre names
    return data.map(artist => ({
      ...artist,
      genres: Array.isArray(artist.genres) 
        ? [...new Set(artist.genres.map(g => 
            g.toLowerCase().replace(/\s+music$/, '').trim()
          ))]
        : []
    }))
  }
  
  return data
}

const detectDataAnomalies = (data: any[], type: string) => {
  const outliers: any[] = []
  const warnings: string[] = []
  const statistics: any = {}
  
  if (type === 'tracks') {
    const durations = data.map(t => t.duration_ms).filter(d => typeof d === 'number')
    const popularities = data.map(t => t.popularity).filter(p => typeof p === 'number')
    
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      const stdDev = Math.sqrt(durations.reduce((sq, n) => sq + Math.pow(n - avgDuration, 2), 0) / durations.length)
      
      statistics.duration_ms = { mean: avgDuration, stdDev }
      
      durations.forEach((duration, index) => {
        if (Math.abs(duration - avgDuration) > 2 * stdDev) {
          outliers.push({ index, field: 'duration_ms', value: duration })
        }
      })
    }
    
    if (popularities.length > 0) {
      const avgPopularity = popularities.reduce((a, b) => a + b, 0) / popularities.length
      statistics.popularity = { mean: avgPopularity }
      
      popularities.forEach((popularity, index) => {
        if (popularity === 0 || popularity === 100) {
          outliers.push({ index, field: 'popularity', value: popularity })
        }
      })
    }
  }
  
  if (type === 'artists') {
    const allGenres = data.flatMap(a => a.genres || [])
    const genreCounts = allGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {})
    
    const totalGenres = Object.keys(genreCounts).length
    const dominantGenres = Object.entries(genreCounts)
      .filter(([_, count]) => (count as number) > data.length * 0.5)
    
    if (dominantGenres.length > 0) {
      warnings.push('Detected skewed genre distribution - one genre dominates')
    }
  }
  
  if (type === 'recently_played') {
    const dates = data.map(item => new Date(item.played_at)).filter(d => !isNaN(d.getTime()))
    const now = new Date()
    
    dates.forEach((date, index) => {
      const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff > 365) {
        outliers.push({ index, field: 'played_at', value: date.toISOString() })
      }
    })
  }
  
  return { outliers, warnings, statistics }
}

const calculateLibraryHealth = (data: any) => {
  const { tracks = [], artists = [], recentlyPlayed = [] } = data
  
  let overallScore = 0
  const metrics = {
    diversity: 0,
    completeness: 0,
    freshness: 0,
    consistency: 0
  }
  const issues: string[] = []
  
  // Calculate diversity
  const allGenres = artists.flatMap(a => a.genres || [])
  const uniqueGenres = new Set(allGenres)
  metrics.diversity = Math.min(100, (uniqueGenres.size / Math.max(1, artists.length)) * 100)
  
  // Calculate completeness
  const tracksWithCompleteData = tracks.filter(t => 
    t.id && t.name && t.artists && t.duration_ms && typeof t.popularity === 'number'
  )
  metrics.completeness = tracks.length > 0 ? (tracksWithCompleteData.length / tracks.length) * 100 : 0
  
  // Calculate freshness
  if (recentlyPlayed.length > 0) {
    const recentDates = recentlyPlayed.map(item => new Date(item.played_at))
    const avgAge = recentDates.reduce((sum, date) => 
      sum + (Date.now() - date.getTime()), 0) / recentDates.length
    const daysSinceLastPlay = avgAge / (1000 * 60 * 60 * 24)
    metrics.freshness = Math.max(0, 100 - daysSinceLastPlay)
  } else {
    metrics.freshness = 0
    issues.push('No recent listening activity')
  }
  
  // Calculate consistency
  const trackValidation = validateSpotifyData(tracks, 'tracks')
  const artistValidation = validateSpotifyData(artists, 'artists')
  const totalItems = tracks.length + artists.length
  const validItems = trackValidation.validItems.length + artistValidation.validItems.length
  metrics.consistency = totalItems > 0 ? (validItems / totalItems) * 100 : 100
  
  // Calculate overall score
  overallScore = (metrics.diversity + metrics.completeness + metrics.freshness + metrics.consistency) / 4
  
  // Add issues based on low scores
  if (metrics.diversity < 30) issues.push('Low genre diversity')
  if (metrics.completeness < 80) issues.push('Incomplete track data')
  if (metrics.freshness < 50) issues.push('Stale listening data')
  if (metrics.consistency < 90) issues.push('Data quality issues detected')
  
  return {
    overallScore: Math.round(overallScore),
    metrics,
    issues
  }
}

const generateDataQualityReport = (data: any, previousReport?: any) => {
  const timestamp = new Date().toISOString()
  const validation = {
    tracks: validateSpotifyData(data.tracks || [], 'tracks'),
    artists: validateSpotifyData(data.artists || [], 'artists')
  }
  
  const health = calculateLibraryHealth(data)
  const anomalies = {
    tracks: detectDataAnomalies(data.tracks || [], 'tracks'),
    artists: detectDataAnomalies(data.artists || [], 'artists')
  }
  
  const totalItems = (data.tracks?.length || 0) + (data.artists?.length || 0)
  const totalErrors = validation.tracks.errors.length + validation.artists.errors.length
  const qualityScore = Math.max(0, 100 - (totalErrors / Math.max(1, totalItems)) * 100)
  
  const recommendations = []
  
  if (validation.tracks.errors.length > 0) {
    recommendations.push({
      priority: 'high',
      message: 'Fix track data validation errors',
      count: validation.tracks.errors.length
    })
  }
  
  if (health.metrics.diversity < 50) {
    recommendations.push({
      priority: 'medium',
      message: 'Explore more diverse music genres',
      suggestion: 'Try listening to different genres to improve diversity'
    })
  }
  
  if (anomalies.tracks.outliers.length > 0) {
    recommendations.push({
      priority: 'low',
      message: 'Review tracks with unusual characteristics',
      count: anomalies.tracks.outliers.length
    })
  }
  
  const summary = {
    totalItems,
    qualityScore: Math.round(qualityScore),
    errorCount: totalErrors,
    warningCount: validation.tracks.warnings.length + validation.artists.warnings.length,
    improvement: previousReport ? qualityScore - previousReport.summary.qualityScore : undefined
  }
  
  return {
    timestamp,
    summary,
    details: {
      validation,
      health,
      anomalies
    },
    recommendations
  }
}

describe('Data Quality Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateSpotifyData', () => {
    it('validates correct track data', () => {
      const result = validateSpotifyData(mockValidTracks, 'tracks')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
      expect(result.validItems).toHaveLength(2)
    })

    it('detects invalid track data', () => {
      const result = validateSpotifyData(mockCorruptedTracks, 'tracks')
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.validItems.length).toBeLessThan(mockCorruptedTracks.length)
    })

    it('handles empty data gracefully', () => {
      const result = validateSpotifyData([], 'tracks')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.validItems).toHaveLength(0)
      expect(result.warnings.some(w => w.includes('empty'))).toBe(true)
    })
  })

  describe('sanitizeUserInput', () => {
    it('sanitizes search queries', () => {
      const maliciousInput = '<script>alert("xss")</script>Rock Music'
      const sanitized = sanitizeUserInput(maliciousInput, 'search')
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
      expect(sanitized).toContain('Rock Music')
    })

    it('limits input length', () => {
      const longInput = 'A'.repeat(1000)
      const sanitized = sanitizeUserInput(longInput, 'search')
      
      expect(sanitized.length).toBeLessThanOrEqual(100)
    })
  })

  describe('calculateLibraryHealth', () => {
    it('calculates comprehensive library health score', () => {
      const healthReport = calculateLibraryHealth({
        tracks: mockValidTracks,
        artists: mockValidArtists,
        recentlyPlayed: [],
      })
      
      expect(healthReport.overallScore).toBeGreaterThan(0)
      expect(healthReport.overallScore).toBeLessThanOrEqual(100)
      expect(healthReport.metrics).toHaveProperty('diversity')
      expect(healthReport.metrics).toHaveProperty('completeness')
      expect(healthReport.metrics).toHaveProperty('freshness')
      expect(healthReport.metrics).toHaveProperty('consistency')
    })

    it('rewards genre diversity', () => {
      const diverseArtists = [
        { id: 'a1', genres: ['rock'] },
        { id: 'a2', genres: ['jazz'] },
        { id: 'a3', genres: ['electronic'] },
        { id: 'a4', genres: ['classical'] },
        { id: 'a5', genres: ['hip-hop'] },
      ]
      
      const monoGenreArtists = [
        { id: 'a1', genres: ['rock'] },
        { id: 'a2', genres: ['rock'] },
        { id: 'a3', genres: ['rock'] },
      ]
      
      const diverseHealth = calculateLibraryHealth({
        tracks: mockValidTracks,
        artists: diverseArtists,
        recentlyPlayed: [],
      })
      
      const monoHealth = calculateLibraryHealth({
        tracks: mockValidTracks,
        artists: monoGenreArtists,
        recentlyPlayed: [],
      })
      
      expect(diverseHealth.metrics.diversity).toBeGreaterThan(monoHealth.metrics.diversity)
    })
  })

  describe('Edge Cases', () => {
    it('handles extremely large datasets', () => {
      const largeTracks = Array.from({ length: 10000 }, (_, i) => ({
        id: `track_${i}`,
        name: `Track ${i}`,
        artists: [{ name: `Artist ${i % 100}` }],
        duration_ms: 180000 + (i * 1000),
        popularity: Math.floor(Math.random() * 100),
      }))
      
      const startTime = Date.now()
      const stats = calculateStats(largeTracks, [], [])
      const endTime = Date.now()
      
      expect(stats.totalTracks).toBe(10000)
      expect(endTime - startTime).toBeLessThan(5000)
    })

    it('handles Unicode and special characters', () => {
      const unicodeTracks = [
        { id: 'track1', name: '音楽 (Music)', artists: [{ name: 'アーティスト' }] },
        { id: 'track2', name: 'Música Española', artists: [{ name: 'Artista' }] },
        { id: 'track3', name: 'Русская музыка', artists: [{ name: 'Исполнитель' }] },
        { id: 'track4', name: '🎵 Emoji Song 🎶', artists: [{ name: '🎤 Singer' }] },
      ]
      
      const stats = calculateStats(unicodeTracks, [], [])
      
      expect(stats.totalTracks).toBe(4)
      expect(stats.hasSpotifyData).toBe(true)
    })
  })
}) 