# Spotify Insights - Metric Calculations Documentation

This document provides a comprehensive overview of how all metrics are calculated throughout the Spotify Insights application. Understanding these calculations is crucial for interpreting the data and maintaining the codebase.

## 📊 Table of Contents

1. [Data Sources](#data-sources)
2. [Artist Metrics](#artist-metrics)
3. [Track Metrics](#track-metrics)
4. [Genre Metrics](#genre-metrics)
5. [Listening Trends](#listening-trends)
6. [Overview Statistics](#overview-statistics)
7. [Time Range Handling](#time-range-handling)
8. [Data Processing Pipeline](#data-processing-pipeline)

---

## 🎵 Data Sources

All metrics are derived from Spotify's Web API endpoints:

- **Top Tracks**: `/me/top/tracks` (up to 2000 tracks)
- **Top Artists**: `/me/top/artists` (up to 2000 artists)
- **Recently Played**: `/me/player/recently-played` (up to 50 tracks)
- **Audio Features**: `/audio-features/{id}` (energy, danceability, valence, etc.)

### Time Range Mapping
```typescript
// UI Time Ranges → Spotify API Time Ranges
'1week' → 'short_term'     // Last 4 weeks
'1month' → 'short_term'    // Last 4 weeks
'3months' → 'medium_term'  // Last 6 months
'6months' → 'medium_term'  // Last 6 months
'1year' → 'long_term'      // All time
'2years' → 'long_term'     // All time
'alltime' → 'long_term'    // All time
```

---

## 🎤 Artist Metrics

### 1. Track Count (`tracksCount`)
**Purpose**: Number of tracks by this artist in user's listening data
```typescript
const artistTracks = tracks.filter((track: any) => 
  track.artists?.some((a: any) => a.id === artist.id)
);
const tracksCount = artistTracks.length;
```

### 2. Listening Hours (`listeningHours`)
**Purpose**: Total potential listening time for all artist's tracks
```typescript
const totalDuration = artistTracks.reduce((acc: number, track: any) => 
  acc + (track.duration_ms || 0), 0);
const listeningHours = Math.round(totalDuration / (1000 * 60 * 60) * 100) / 100;
```
⚠️ **Note**: This represents potential listening time if all tracks were played once, not actual play time.

### 3. Song Share (`songShare`)
**Purpose**: Percentage of user's total listening time attributed to this artist
```typescript
const totalUserListening = tracks.reduce((acc: number, track: any) => 
  acc + (track.duration_ms || 0), 0);
const songShare = totalUserListening > 0 ? 
  (totalDuration / totalUserListening) * 100 : 0;
```

### 4. Average Popularity (`avgPopularity`)
**Purpose**: Mean popularity score across all artist's tracks
```typescript
const avgPopularity = artistTracks.length > 0 ? 
  artistTracks.reduce((acc: number, track: any) => 
    acc + (track.popularity || 0), 0) / artistTracks.length : 0;
```

### 5. Freshness Score (`freshness`)
**Purpose**: How recently the artist was "discovered" (simulated)
```typescript
const baseYear = 2020;
const discoveryYear = baseYear + Math.floor(Math.random() * 4); // 2020-2023
const currentYear = new Date().getFullYear();
const freshness = Math.max(0, 100 - ((currentYear - discoveryYear) * 25));
```

### 6. Replay Value (`replayValue`)
**Purpose**: Likelihood of replaying artist's tracks
```typescript
const replayValue = Math.min(100, Math.round(
  (artistTracks.length * 10) +        // Track diversity bonus
  (avgPopularity * 0.5) +             // Popularity factor
  (Math.random() * 20)                // Random variation
));
```

### 7. Estimated Plays
**Purpose**: Estimated total play count for artist
```typescript
// In Artist Detail Modal
const estimatedTotalPlays = Math.floor((artist.listeningHours || 0) * 60 / 3.5);
const avgPlaysPerTrack = artist.tracksCount > 0 ? 
  Math.floor(estimatedTotalPlays / artist.tracksCount) : 0;
```
**Assumption**: Average track length of 3.5 minutes

### 8. Followers
**Purpose**: Artist's Spotify follower count with intelligent fallback
```typescript
const formatFollowers = (followers: number) => {
  if (!followers || followers === 0) {
    // Generate realistic estimate based on popularity
    const estimatedFollowers = Math.floor(
      (artist.popularity || 50) * 10000 + Math.random() * 50000
    );
    return formatNumber(estimatedFollowers);
  }
  return formatNumber(followers);
};
```

---

## 🎵 Track Metrics

### 1. Base Listening Time (`listeningTime`)
**Purpose**: Estimated listening hours for each track
```typescript
const baseListeningTime = Math.max(0.1, (50 - index) * 2.5);
const listeningTime = Math.round(baseListeningTime * 100) / 100;
```
**Logic**: Higher-ranked tracks get more listening time, minimum 0.1 hours

### 2. Total Plays (`totalPlays`)
**Purpose**: Estimated play count for each track
```typescript
const totalPlays = Math.max(1, Math.round(baseListeningTime * 15));
```
**Logic**: ~15 plays per hour of listening time, minimum 1 play

### 3. Audio Features (0-100 scale)
**Purpose**: Spotify's audio analysis metrics converted to percentages
```typescript
const energy = (track.energy || 0.5) * 100;
const danceability = (track.danceability || 0.5) * 100;
const valence = (track.valence || 0.5) * 100;
const acousticness = (track.acousticness || 0.5) * 100;
```

### 4. Mood Score (`moodScore`)
**Purpose**: Combined mood indicator from audio features
```typescript
const moodScore = Math.round((energy + valence + danceability) / 3);
```

### 5. Replay Score (`replayScore`)
**Purpose**: How likely the track is to be replayed
```typescript
const replayScore = Math.min(100, Math.round(
  (track.popularity || 50) * 0.6 +    // 60% popularity weight
  energy * 0.2 +                      // 20% energy weight
  danceability * 0.2                  // 20% danceability weight
));
```

### 6. Song Share (`songShare`)
**Purpose**: Track's percentage of total listening time
```typescript
const totalUserListening = tracks.reduce((acc: number, t: any) => 
  acc + Math.max(0.1, (50 - tracks.indexOf(t)) * 2.5), 0);
const songShare = totalUserListening > 0 ? 
  (listeningTime / totalUserListening) * 100 : 0;
```

### 7. Freshness Score (`freshness`)
**Purpose**: How recently the track was discovered
```typescript
const discoveryYear = 2020 + Math.floor(Math.random() * 4);
const currentYear = new Date().getFullYear();
const freshness = Math.max(0, 100 - ((currentYear - discoveryYear) * 25));
```

---

## 🎭 Genre Metrics

### 1. Genre Count (`count`)
**Purpose**: Number of artists in user's data that belong to this genre
```typescript
artists.forEach(artist => {
  const genres = artist.genres || [];
  genres.forEach(genre => {
    genreMap.get(genre).count++;
  });
});
```

### 2. Genre Percentage (`percentage`)
**Purpose**: Genre's share of total genre occurrences
```typescript
const totalCount = Array.from(genreMap.values())
  .reduce((sum, data) => sum + data.count, 0);
const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
```

### 3. Artist Count (`artists`)
**Purpose**: Unique artists in this genre
```typescript
genreMap.set(genre, {
  artists: new Set(),
  // ... other properties
});
data.artists.add(artist.id);
const artistCount = data.artists.size;
```

### 4. Average Popularity (`avgPopularity`)
**Purpose**: Mean popularity across all artists in genre
```typescript
const avgPopularity = data.artistCount > 0 ? 
  data.totalPopularity / data.artistCount : 0;
```

### 5. Listening Hours (`listeningHours`)
**Purpose**: Total listening time for genre (calculated from artists)
```typescript
const genreListeningHours = genreArtists.reduce((acc, artist) => 
  acc + (artist.listeningHours || 0), 0);
```

### 6. Track Count (`trackCount`)
**Purpose**: Total tracks in genre
```typescript
const trackCount = genreArtists.reduce((acc, artist) => 
  acc + (artist.tracksCount || 0), 0);
```

### 7. Freshness (`freshness`)
**Purpose**: Average discovery freshness for genre
```typescript
const avgFreshness = genreArtists.length > 0 ? 
  genreArtists.reduce((acc, artist) => acc + artist.freshness, 0) / 
  genreArtists.length : 0;
```

### 8. Diversity Score (`diversity`)
**Purpose**: How varied the artists are within the genre
```typescript
const diversity = Math.min(100, Math.round(
  (genreArtists.length * 5) +         // Artist variety
  (avgPopularity * 0.3) +             // Popularity spread
  (Math.random() * 20)                // Random factor
));
```

### 9. Replay Value (`replayValue`)
**Purpose**: Genre's overall replay likelihood
```typescript
const replayValue = Math.min(100, Math.round(
  (avgPopularity * 0.4) +             // 40% popularity
  (diversity * 0.3) +                 // 30% diversity
  (trackCount * 0.002) +              // Track count factor
  (Math.random() * 30)                // Random variation
));
```

---

## 📈 Listening Trends

### 1. Weekly Listening Data
**Purpose**: Simulated weekly listening patterns over 12 weeks
```typescript
for (let i = 11; i >= 0; i--) {
  const weekDate = new Date(currentDate);
  weekDate.setDate(weekDate.getDate() - (i * 7));
  
  const baseListening = 20 + Math.random() * 30; // 20-50 hours/week
  const seasonalMultiplier = 0.8 + Math.sin((weekDate.getMonth() / 12) * Math.PI * 2) * 0.2;
  
  const listeningHours = Math.round(baseListening * seasonalMultiplier * 10) / 10;
  const trackCount = Math.floor(baseListening * 3 * seasonalMultiplier); // ~3 tracks/hour
  const artistCount = Math.floor(trackCount * 0.3); // ~30% unique artists
}
```

### 2. Mood Categories
**Purpose**: Classification of listening moods
```typescript
const moodCategories = {
  'High Energy': tracks.filter(t => t.energy > 80 && t.valence > 60),
  'Happy & Upbeat': tracks.filter(t => t.valence > 70 && t.danceability > 60),
  'Chill & Relaxed': tracks.filter(t => t.energy < 50 && t.acousticness > 50),
  'Melancholic': tracks.filter(t => t.valence < 40 && t.energy < 60),
  'Intense & Dark': tracks.filter(t => t.energy > 70 && t.valence < 40)
};
```

### 3. Diversity Score
**Purpose**: How varied the weekly listening is
```typescript
const diversity = Math.round((60 + Math.random() * 30) * 10) / 10;
```

---

## 📋 Overview Statistics

### 1. Total Statistics
```typescript
const calculateStats = (tracks, artists, recentlyPlayed, dimension) => {
  const totalTracks = tracks.length;
  const totalArtists = new Set(artists.map(artist => artist.id)).size;
  const totalDuration = tracks.reduce((acc, track) => acc + (track.duration_ms || 0), 0);
  const listeningTime = totalDuration / (1000 * 60 * 60); // Convert to hours
};
```

### 2. Genre Analysis
```typescript
const genreCounts = artists.reduce((acc, artist) => {
  artist.genres?.forEach((genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
  });
  return acc;
}, {});

const topGenre = Object.entries(genreCounts)
  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
```

### 3. Average Popularity
```typescript
const totalPopularity = tracks.reduce((acc, track) => acc + (track.popularity || 0), 0);
const averagePopularity = tracks.length > 0 ? totalPopularity / tracks.length : 0;
```

### 4. Recent Activity
```typescript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const recentTracks = recentlyPlayed.filter(track => {
  const playedAt = new Date(track.played_at || track.added_at);
  return playedAt >= thirtyDaysAgo;
});
```

---

## ⏰ Time Range Handling

### API Mapping Function
```typescript
export const mapUITimeRangeToAPI = (uiTimeRange: string): string => {
  const mapping: Record<string, string> = {
    '1week': 'short_term',
    '1month': 'short_term', 
    '3months': 'medium_term',
    '6months': 'medium_term',
    '1year': 'long_term',
    '2years': 'long_term',
    'alltime': 'long_term'
  };
  return mapping[uiTimeRange] || 'medium_term';
};
```

### Label Generation
```typescript
export const getTimeRangeLabel = (timeRange: string): string => {
  const labels: Record<string, string> = {
    '1week': 'Last Week',
    '1month': 'Last Month',
    '3months': 'Last 3 Months',
    '6months': 'Last 6 Months', 
    '1year': 'Last Year',
    '2years': 'Last 2 Years',
    'alltime': 'All Time'
  };
  return labels[timeRange] || 'Selected Period';
};
```

---

## 🔄 Data Processing Pipeline

### 1. Data Fetching
```typescript
const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks(apiTimeRange, 2000);
const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists(apiTimeRange, 2000);
```

### 2. Data Enhancement
```typescript
const processedData = useMemo(() => {
  if (!rawData.length) return [];
  
  return rawData.map((item, index) => {
    // Apply calculations
    const enhancedItem = {
      ...item,
      rank: index + 1,
      // ... calculated metrics
    };
    
    return enhancedItem;
  });
}, [rawData, timeRange]);
```

### 3. Sorting and Filtering
```typescript
const sortedData = useMemo(() => {
  const sorted = [...processedData].sort((a, b) => {
    // Apply sorting logic based on sortBy and sortOrder
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });
  
  // Update ranks after sorting
  return sorted.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}, [processedData, sortBy, sortOrder]);
```

### 4. Statistics Calculation
```typescript
const stats = useMemo(() => {
  return {
    total: sortedData.length,
    average: sortedData.reduce((acc, item) => acc + item.value, 0) / sortedData.length,
    // ... other statistics
  };
}, [sortedData]);
```

---

## 🎯 Key Principles

### 1. Minimum Value Constraints
All calculations include minimum value constraints to prevent negative or zero values:
```typescript
const value = Math.max(minimumValue, calculatedValue);
```

### 2. Rounding Consistency
Consistent rounding approaches across the application:
```typescript
// For percentages and scores
Math.round(value)

// For hours with decimals  
Math.round(value * 100) / 100

// For large numbers
Math.floor(value)
```

### 3. Fallback Values
All calculations include fallback values for missing data:
```typescript
const safeValue = item.property || defaultValue;
```

### 4. Data Validation
Input validation ensures calculations don't break:
```typescript
if (!data.length || !otherRequiredData.length) return [];
```

---

## 🔧 Maintenance Notes

### Adding New Metrics
1. Define the calculation logic
2. Add proper minimum value constraints
3. Include fallback values for missing data
4. Update this documentation
5. Add unit tests for the calculation

### Performance Considerations
- Use `useMemo` for expensive calculations
- Limit data processing to necessary items
- Cache results when possible
- Avoid recalculating on every render

### Data Accuracy
- Remember that listening hours are **potential** listening time, not actual
- Play counts are **estimated** based on ranking and duration
- Some metrics include simulated data for demonstration purposes
- Always validate against Spotify's actual API limitations

---

*Last Updated: December 2024*
*Version: 1.0* 