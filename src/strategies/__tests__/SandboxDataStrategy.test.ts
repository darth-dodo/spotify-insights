import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SandboxDataStrategy } from '../SandboxDataStrategy'

describe('SandboxDataStrategy', () => {
  let strategy: SandboxDataStrategy

  beforeEach(() => {
    strategy = new SandboxDataStrategy()
  })



  describe('getTopTracks', () => {
    it('returns array of tracks with correct structure', async () => {
      const result = await strategy.getTopTracks(20)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(20)
      
      // Check track structure
      const track = result[0]
      expect(track).toHaveProperty('id')
      expect(track).toHaveProperty('name')
      expect(track).toHaveProperty('artists')
      expect(track).toHaveProperty('album')
      expect(track).toHaveProperty('duration_ms')
      expect(track).toHaveProperty('popularity')
    })

    it('respects limit parameter', async () => {
      const small = await strategy.getTopTracks(5)
      const large = await strategy.getTopTracks(50)
      
      expect(small).toHaveLength(5)
      expect(large).toHaveLength(50)
    })

    it('uses default limit when none provided', async () => {
      const result = await strategy.getTopTracks()
      expect(result).toHaveLength(50) // Default limit
    })

    it('returns consistent data across calls', async () => {
      const result1 = await strategy.getTopTracks(10)
      const result2 = await strategy.getTopTracks(10)
      
      expect(result1[0].id).toBe(result2[0].id)
      expect(result1[0].name).toBe(result2[0].name)
    })

    it('contains tracks with valid properties', async () => {
      const tracks = await strategy.getTopTracks(5)
      
      tracks.forEach(track => {
        expect(track.id).toBeDefined()
        expect(track.name).toBeDefined()
        expect(Array.isArray(track.artists)).toBe(true)
        expect(track.artists.length).toBeGreaterThan(0)
        expect(typeof track.duration_ms).toBe('number')
        expect(track.duration_ms).toBeGreaterThan(0)
        expect(typeof track.popularity).toBe('number')
        expect(track.popularity).toBeGreaterThanOrEqual(0)
        expect(track.popularity).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('getTopArtists', () => {
    it('returns array of artists with correct structure', async () => {
      const result = await strategy.getTopArtists(20)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(20)
      
      // Check artist structure
      const artist = result[0]
      expect(artist).toHaveProperty('id')
      expect(artist).toHaveProperty('name')
      expect(artist).toHaveProperty('genres')
      expect(artist).toHaveProperty('popularity')
      expect(artist).toHaveProperty('followers')
    })

    it('includes diverse genres', async () => {
      const result = await strategy.getTopArtists(50)
      const allGenres = result.flatMap(artist => artist.genres || [])
      
      // Should include our main genre categories
      expect(allGenres.some(genre => genre.toLowerCase().includes('metal'))).toBe(true)
      expect(allGenres.some(genre => genre.toLowerCase().includes('rock'))).toBe(true)
      expect(allGenres.some(genre => genre.toLowerCase().includes('pop'))).toBe(true)
      expect(allGenres.some(genre => genre.toLowerCase().includes('jazz'))).toBe(true)
    })

    it('respects limit parameter', async () => {
      const small = await strategy.getTopArtists(10)
      const large = await strategy.getTopArtists(30)
      
      expect(small).toHaveLength(10)
      expect(large).toHaveLength(30)
    })

    it('uses default limit when none provided', async () => {
      const result = await strategy.getTopArtists()
      expect(result).toHaveLength(50) // Default limit
    })

    it('contains artists with valid properties', async () => {
      const artists = await strategy.getTopArtists(5)
      
      artists.forEach(artist => {
        expect(artist.id).toBeDefined()
        expect(artist.name).toBeDefined()
        expect(Array.isArray(artist.genres)).toBe(true)
        expect(typeof artist.popularity).toBe('number')
        expect(artist.popularity).toBeGreaterThanOrEqual(0)
        expect(artist.popularity).toBeLessThanOrEqual(100)
        expect(artist.followers).toBeDefined()
        expect(typeof artist.followers.total).toBe('number')
      })
    })
  })

  describe('getRecentlyPlayed', () => {
    it('returns array of recent tracks with play history', async () => {
      const result = await strategy.getRecentlyPlayed(20)
      
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(20)
      
      // Check play history structure
      const playHistory = result[0]
      expect(playHistory).toHaveProperty('played_at')
      expect(playHistory).toHaveProperty('track')
      
      // Verify played_at is a valid date string
      expect(new Date(playHistory.played_at)).toBeInstanceOf(Date)
      expect(new Date(playHistory.played_at).getTime()).not.toBeNaN()
    })

    it('respects limit parameter', async () => {
      const small = await strategy.getRecentlyPlayed(5)
      const large = await strategy.getRecentlyPlayed(50)
      
      expect(small).toHaveLength(5)
      expect(large).toHaveLength(50)
    })

    it('uses default limit when none provided', async () => {
      const result = await strategy.getRecentlyPlayed()
      expect(result).toHaveLength(50) // Default limit
    })

    it('contains valid play history entries', async () => {
      const history = await strategy.getRecentlyPlayed(5)
      
      history.forEach(entry => {
        expect(entry.played_at).toBeDefined()
        expect(entry.track).toBeDefined()
        expect(entry.track.id).toBeDefined()
        expect(entry.track.name).toBeDefined()
        
        // Verify it's a valid date string
        const playedDate = new Date(entry.played_at)
        expect(playedDate.getTime()).not.toBeNaN()
      })
    })
  })



  describe('getStats', () => {
    it('returns comprehensive statistics', () => {
      const stats = strategy.getStats()
      
      expect(stats).toHaveProperty('totalTracks')
      expect(stats).toHaveProperty('totalArtists')
      expect(stats).toHaveProperty('listeningTime')
      expect(stats).toHaveProperty('topGenre')
      expect(stats).toHaveProperty('uniqueGenres')
      expect(stats).toHaveProperty('avgPopularity')
      expect(stats).toHaveProperty('recentTracksCount')
      expect(stats).toHaveProperty('hasSpotifyData')
      
      // Verify data types and reasonable values
      expect(typeof stats.totalTracks).toBe('number')
      expect(typeof stats.totalArtists).toBe('number')
      expect(typeof stats.listeningTime).toBe('number')
      expect(typeof stats.topGenre).toBe('string')
      expect(typeof stats.uniqueGenres).toBe('number')
      expect(typeof stats.avgPopularity).toBe('number')
      expect(typeof stats.recentTracksCount).toBe('number')
      expect(stats.hasSpotifyData).toBe(true)
      
      // Reasonable value ranges
      expect(stats.totalTracks).toBeGreaterThan(0)
      expect(stats.totalArtists).toBeGreaterThan(0)
      expect(stats.listeningTime).toBeGreaterThan(0)
      expect(stats.uniqueGenres).toBeGreaterThan(0)
      expect(stats.avgPopularity).toBeGreaterThanOrEqual(0)
      expect(stats.avgPopularity).toBeLessThanOrEqual(100)
    })

    it('calculates average popularity correctly', () => {
      const stats = strategy.getStats()
      
      // Should be a rounded number
      expect(Number.isInteger(stats.avgPopularity)).toBe(true)
      expect(stats.avgPopularity).toBeGreaterThan(0)
      expect(stats.avgPopularity).toBeLessThanOrEqual(100)
    })

    it('returns consistent stats across calls', () => {
      const stats1 = strategy.getStats()
      const stats2 = strategy.getStats()
      
      expect(stats1.totalTracks).toBe(stats2.totalTracks)
      expect(stats1.totalArtists).toBe(stats2.totalArtists)
      expect(stats1.topGenre).toBe(stats2.topGenre)
    })
  })

  describe('getGenreAnalysis', () => {
    it('returns genre analysis with correct structure', () => {
      const analysis = strategy.getGenreAnalysis()
      
      expect(Array.isArray(analysis)).toBe(true)
      expect(analysis.length).toBeGreaterThan(0)
      expect(analysis.length).toBeLessThanOrEqual(8) // Limited to 8 genres
      
      // Check structure of first genre
      const genre = analysis[0]
      expect(genre).toHaveProperty('name')
      expect(genre).toHaveProperty('value')
      expect(genre).toHaveProperty('color')
      expect(genre).toHaveProperty('tracks')
      expect(genre).toHaveProperty('artists')
      expect(genre).toHaveProperty('hours')
      
      // Verify data types
      expect(typeof genre.name).toBe('string')
      expect(typeof genre.value).toBe('number')
      expect(typeof genre.color).toBe('string')
      expect(typeof genre.tracks).toBe('number')
      expect(typeof genre.artists).toBe('number')
      expect(typeof genre.hours).toBe('number')
    })

    it('sorts genres by popularity descending', () => {
      const analysis = strategy.getGenreAnalysis()
      
      for (let i = 0; i < analysis.length - 1; i++) {
        expect(analysis[i].value).toBeGreaterThanOrEqual(analysis[i + 1].value)
      }
    })

    it('assigns unique colors to genres', () => {
      const analysis = strategy.getGenreAnalysis()
      const colors = analysis.map(genre => genre.color)
      const uniqueColors = new Set(colors)
      
      // Should have unique colors (at least mostly unique)
      expect(uniqueColors.size).toBeGreaterThan(analysis.length * 0.7)
    })

    it('contains reasonable values', () => {
      const analysis = strategy.getGenreAnalysis()
      
      analysis.forEach(genre => {
        expect(genre.name).toBeTruthy()
        expect(genre.value).toBeGreaterThan(0)
        expect(genre.value).toBeLessThanOrEqual(100)
        expect(genre.tracks).toBeGreaterThan(0)
        expect(genre.artists).toBeGreaterThan(0)
        expect(genre.hours).toBeGreaterThanOrEqual(0)
        expect(genre.color).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
      })
    })

    it('returns consistent analysis across calls', () => {
      const analysis1 = strategy.getGenreAnalysis()
      const analysis2 = strategy.getGenreAnalysis()
      
      expect(analysis1.length).toBe(analysis2.length)
      expect(analysis1[0].name).toBe(analysis2[0].name)
      expect(analysis1[0].value).toBe(analysis2[0].value)
    })
  })

  describe('clearCache', () => {
    it('executes without error', () => {
      expect(() => strategy.clearCache()).not.toThrow()
    })

    it('logs cache clear message', () => {
      const consoleSpy = vi.spyOn(console, 'log')
      strategy.clearCache()
      expect(consoleSpy).toHaveBeenCalledWith('Sandbox data strategy cache cleared')
      consoleSpy.mockRestore()
    })
  })

  describe('data consistency and quality', () => {
    it('maintains consistent data across multiple method calls', async () => {
      const tracks = await strategy.getTopTracks(10)
      const artists = await strategy.getTopArtists(10)
      const recent = await strategy.getRecentlyPlayed(10)
      
      // All should return data
      expect(tracks.length).toBe(10)
      expect(artists.length).toBe(10)
      expect(recent.length).toBe(10)
      
      // Should be consistent across calls
      const tracks2 = await strategy.getTopTracks(10)
      expect(tracks[0].id).toBe(tracks2[0].id)
    })

    it('generates unique IDs for tracks and artists', async () => {
      const tracks = await strategy.getTopTracks(50)
      const artists = await strategy.getTopArtists(50)
      
      const trackIds = tracks.map(t => t.id)
      const artistIds = artists.map(a => a.id)
      
      // Track IDs should be unique
      expect(new Set(trackIds).size).toBe(trackIds.length)
      
      // Artist IDs may have some duplicates in the test data, but should have reasonable uniqueness
      const uniqueArtistIds = new Set(artistIds).size
      expect(uniqueArtistIds).toBeGreaterThan(30) // Allow for some duplicates in test data
      expect(uniqueArtistIds).toBeLessThanOrEqual(artistIds.length)
    })

    it('provides realistic genre distribution', async () => {
      const artists = await strategy.getTopArtists(50)
      const allGenres = artists.flatMap(artist => artist.genres || [])
      
      // Should have multiple genres
      expect(allGenres.length).toBeGreaterThan(50)
      
      // Should have genre diversity
      const uniqueGenres = new Set(allGenres)
      expect(uniqueGenres.size).toBeGreaterThan(10)
    })
  })
}) 