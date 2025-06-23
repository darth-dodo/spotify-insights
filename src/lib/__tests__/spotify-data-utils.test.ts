import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  mapUITimeRangeToAPI,
  getTimeRangeLabel,
  getTimeRangeForDimension,
  filterDataByTimeDimension,
  calculateStats,
  calculateGenreAnalysis,
  getTracksByGenre,
  getTopTracks,
  getTopArtists,
  type TimeDimension,
} from '../spotify-data-utils'

describe('spotify-data-utils', () => {
  describe('mapUITimeRangeToAPI', () => {
    it('maps short-term ranges correctly', () => {
      expect(mapUITimeRangeToAPI('1week')).toBe('short_term')
      expect(mapUITimeRangeToAPI('1month')).toBe('short_term')
    })

    it('maps medium-term ranges correctly', () => {
      expect(mapUITimeRangeToAPI('3months')).toBe('medium_term')
      expect(mapUITimeRangeToAPI('6months')).toBe('medium_term')
    })

    it('maps long-term ranges correctly', () => {
      expect(mapUITimeRangeToAPI('1year')).toBe('long_term')
      expect(mapUITimeRangeToAPI('2years')).toBe('long_term')
      expect(mapUITimeRangeToAPI('alltime')).toBe('long_term')
    })

    it('defaults to medium_term for unknown ranges', () => {
      expect(mapUITimeRangeToAPI('unknown')).toBe('medium_term')
      expect(mapUITimeRangeToAPI('')).toBe('medium_term')
    })
  })

  describe('getTimeRangeLabel', () => {
    it('returns correct labels for all ranges', () => {
      expect(getTimeRangeLabel('1week')).toBe('Last Week')
      expect(getTimeRangeLabel('1month')).toBe('Last Month')
      expect(getTimeRangeLabel('3months')).toBe('Last Three Months')
      expect(getTimeRangeLabel('6months')).toBe('Last Six Months')
      expect(getTimeRangeLabel('1year')).toBe('Last Year')
      expect(getTimeRangeLabel('2years')).toBe('Last Two Years')
      expect(getTimeRangeLabel('alltime')).toBe('All Time')
    })

    it('returns default label for unknown ranges', () => {
      expect(getTimeRangeLabel('unknown')).toBe('This Period')
    })
  })

  describe('getTimeRangeForDimension', () => {
    beforeEach(() => {
      // Mock Date.now() to return a fixed timestamp
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-06-22T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('calculates 1 week range correctly', () => {
      const range = getTimeRangeForDimension('1week')
      const expectedStart = new Date('2025-06-15T12:00:00Z')
      const expectedEnd = new Date('2025-06-22T12:00:00Z')
      
      expect(range.start.getTime()).toBe(expectedStart.getTime())
      expect(range.end.getTime()).toBe(expectedEnd.getTime())
    })

    it('calculates 1 month range correctly', () => {
      const range = getTimeRangeForDimension('1month')
      const expectedStart = new Date('2025-05-22T12:00:00Z')
      
      expect(range.start.getTime()).toBe(expectedStart.getTime())
    })

    it('calculates alltime range correctly', () => {
      const range = getTimeRangeForDimension('alltime')
      const expectedStart = new Date('2000-01-01T00:00:00Z')
      
      expect(range.start.getFullYear()).toBe(2000)
    })
  })

  describe('calculateStats', () => {
    const mockTracks = [
      {
        id: '1',
        name: 'Track 1',
        duration_ms: 180000, // 3 minutes
        popularity: 80,
        artists: [{ id: 'artist1', name: 'Artist 1' }],
      },
      {
        id: '2',
        name: 'Track 2',
        duration_ms: 240000, // 4 minutes
        popularity: 60,
        artists: [{ id: 'artist2', name: 'Artist 2' }],
      },
    ]

    const mockArtists = [
      {
        id: 'artist1',
        name: 'Artist 1',
        genres: ['rock', 'alternative'],
        popularity: 75,
      },
      {
        id: 'artist2',
        name: 'Artist 2',
        genres: ['pop', 'electronic'],
        popularity: 65,
      },
    ]

    const mockRecentlyPlayed = [
      {
        played_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        track: mockTracks[0],
      },
    ]

    it('calculates stats correctly with valid data', () => {
      const stats = calculateStats(mockTracks, mockArtists, mockRecentlyPlayed)
      
      expect(stats.totalTracks).toBe(2)
      expect(stats.totalArtists).toBe(2)
      expect(stats.listeningTime).toBeCloseTo(0.117, 2) // (180000 + 240000) / (1000 * 60 * 60) ≈ 0.117 hours
      expect(stats.uniqueGenres).toBe(4) // rock, alternative, pop, electronic
      expect(stats.averagePopularity).toBe(70) // (80 + 60) / 2
      expect(stats.hasSpotifyData).toBe(true)
    })

    it('handles empty data gracefully', () => {
      const stats = calculateStats([], [], [])
      
      expect(stats.totalTracks).toBe(0)
      expect(stats.totalArtists).toBe(0)
      expect(stats.listeningTime).toBe(0)
      expect(stats.topGenre).toBe('N/A')
      expect(stats.uniqueGenres).toBe(0)
      expect(stats.averagePopularity).toBe(0)
      expect(stats.hasSpotifyData).toBe(false)
    })

    it('handles null/undefined data gracefully', () => {
      const stats = calculateStats(null as any, null as any, null as any)
      
      expect(stats.totalTracks).toBe(0)
      expect(stats.hasSpotifyData).toBe(false)
    })

    it('calculates top genre correctly', () => {
      const artistsWithGenres = [
        { id: '1', genres: ['rock', 'rock', 'alternative'] },
        { id: '2', genres: ['rock', 'pop'] },
      ]
      
      const stats = calculateStats(mockTracks, artistsWithGenres, [])
      expect(stats.topGenre).toBe('rock') // Most frequent genre
    })
  })

  describe('calculateGenreAnalysis', () => {
    const mockArtists = [
      {
        id: 'artist1',
        name: 'Artist 1',
        genres: ['rock', 'alternative'],
        popularity: 80,
      },
      {
        id: 'artist2',
        name: 'Artist 2',
        genres: ['rock', 'metal'],
        popularity: 70,
      },
      {
        id: 'artist3',
        name: 'Artist 3',
        genres: ['pop'],
        popularity: 90,
      },
    ]

    it('calculates genre analysis correctly', () => {
      const analysis = calculateGenreAnalysis(mockArtists)
      
      expect(analysis).toHaveLength(4) // rock, alternative, metal, pop
      
      const rockGenre = analysis.find(g => g.name === 'rock')
      expect(rockGenre?.count).toBe(2) // appears in 2 artists
      expect(rockGenre?.artists).toBe(2) // 2 unique artists
      expect(rockGenre?.percentage).toBe(40) // 2/5 * 100
      expect(rockGenre?.avgPopularity).toBe(75) // (80 + 70) / 2
    })

    it('handles empty artists array', () => {
      const analysis = calculateGenreAnalysis([])
      expect(analysis).toEqual([])
    })

    it('handles artists without genres', () => {
      const artistsNoGenres = [
        { id: 'artist1', name: 'Artist 1', genres: [], popularity: 80 },
      ]
      
      const analysis = calculateGenreAnalysis(artistsNoGenres)
      expect(analysis).toEqual([])
    })

    it('sorts genres by count descending', () => {
      const analysis = calculateGenreAnalysis(mockArtists)
      
      // First genre should have highest count
      expect(analysis[0].count).toBeGreaterThanOrEqual(analysis[1].count)
      expect(analysis[1].count).toBeGreaterThanOrEqual(analysis[2].count)
    })
  })

  describe('filterDataByTimeDimension', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-06-22T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const mockData = [
      {
        id: '1',
        played_at: new Date('2025-06-20T12:00:00Z').toISOString(), // 2 days ago
      },
      {
        id: '2',
        played_at: new Date('2025-06-10T12:00:00Z').toISOString(), // 12 days ago
      },
      {
        id: '3',
        added_at: new Date('2025-05-01T12:00:00Z').toISOString(), // ~2 months ago
      },
    ]

    it('filters data for 1 week correctly', () => {
      const filtered = filterDataByTimeDimension(mockData, '1week')
      expect(filtered).toHaveLength(1) // Only the item from 2 days ago
      expect(filtered[0].id).toBe('1')
    })

    it('filters data for 1 month correctly', () => {
      const filtered = filterDataByTimeDimension(mockData, '1month')
      expect(filtered).toHaveLength(2) // Items from last month
    })

    it('handles empty data array', () => {
      const filtered = filterDataByTimeDimension([], '1week')
      expect(filtered).toEqual([])
    })

    it('handles null/undefined data', () => {
      const filtered = filterDataByTimeDimension(null as any, '1week')
      expect(filtered).toEqual([])
    })
  })

  describe('getTracksByGenre', () => {
    const mockTracks = [
      {
        id: '1',
        name: 'Rock Track',
        artists: [{ id: 'artist1', name: 'Rock Artist' }],
        added_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Pop Track',
        artists: [{ id: 'artist2', name: 'Pop Artist' }],
        added_at: new Date().toISOString(),
      },
    ]

    const mockArtists = [
      {
        id: 'artist1',
        name: 'Rock Artist',
        genres: ['rock', 'alternative rock'],
      },
      {
        id: 'artist2',
        name: 'Pop Artist',
        genres: ['pop', 'dance pop'],
      },
    ]

    it('returns tracks for specified genre', () => {
      const rockTracks = getTracksByGenre(mockTracks, mockArtists, 'rock', 5)
      expect(rockTracks).toHaveLength(1)
      expect(rockTracks[0].name).toBe('Rock Track')
    })

    it('handles case-insensitive genre matching', () => {
      const rockTracks = getTracksByGenre(mockTracks, mockArtists, 'ROCK', 5)
      expect(rockTracks).toHaveLength(1)
    })

    it('handles empty tracks/artists arrays', () => {
      const tracks = getTracksByGenre([], [], 'rock', 5)
      expect(tracks).toEqual([])
    })

    it('respects limit parameter', () => {
      const tracks = getTracksByGenre(mockTracks, mockArtists, 'rock', 0)
      expect(tracks).toHaveLength(0)
    })
  })

  describe('getTopTracks', () => {
    const mockTracks = [
      {
        id: '1',
        name: 'Track 1',
        popularity: 90,
        artists: [{ id: 'artist1', name: 'Artist 1' }],
        album: { images: [{ url: 'image1.jpg' }] },
        duration_ms: 180000,
        added_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Track 2',
        popularity: 80,
        artists: [{ id: 'artist2', name: 'Artist 2' }],
        album: { images: [{ url: 'image2.jpg' }] },
        duration_ms: 200000,
        added_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Track 3',
        popularity: 70,
        artists: [{ id: 'artist3', name: 'Artist 3' }],
        album: { images: [{ url: 'image3.jpg' }] },
        duration_ms: 220000,
        added_at: new Date().toISOString(),
      },
    ]

    it('returns top tracks sorted by popularity', () => {
      const topTracks = getTopTracks(mockTracks, 2)
      expect(topTracks).toHaveLength(2)
      expect(topTracks[0].popularity).toBe(90)
      expect(topTracks[1].popularity).toBe(80)
    })

    it('handles empty tracks array', () => {
      const topTracks = getTopTracks([], 5)
      expect(topTracks).toEqual([])
    })

    it('respects limit parameter', () => {
      const topTracks = getTopTracks(mockTracks, 1)
      expect(topTracks).toHaveLength(1)
    })
  })

  describe('getTopArtists', () => {
    const mockArtists = [
      {
        id: '1',
        name: 'Artist 1',
        popularity: 95,
        genres: ['rock'],
        images: [{ url: 'artist1.jpg' }],
        added_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Artist 2',
        popularity: 85,
        genres: ['pop'],
        images: [{ url: 'artist2.jpg' }],
        added_at: new Date().toISOString(),
      },
    ]

    it('returns top artists sorted by popularity', () => {
      const topArtists = getTopArtists(mockArtists, 2)
      expect(topArtists).toHaveLength(2)
      expect(topArtists[0].popularity).toBe(95)
      expect(topArtists[1].popularity).toBe(85)
    })

    it('handles empty artists array', () => {
      const topArtists = getTopArtists([], 5)
      expect(topArtists).toEqual([])
    })
  })
}) 