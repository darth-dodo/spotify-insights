# Metrics Quick Reference Guide

A concise reference for all metric calculations in Spotify Insights.

## 🎤 Artist Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| **Track Count** | `tracks.filter(t => t.artists.includes(artist)).length` | Direct count |
| **Listening Hours** | `totalDuration / (1000 * 60 * 60)` | Potential time, not actual |
| **Song Share** | `(artistDuration / totalUserDuration) * 100` | Percentage of total listening |
| **Avg Popularity** | `sum(trackPopularity) / trackCount` | Mean across artist's tracks |
| **Freshness** | `100 - ((currentYear - discoveryYear) * 25)` | Simulated discovery recency |
| **Replay Value** | `(trackCount * 10) + (avgPop * 0.5) + random(20)` | Max 100 |
| **Estimated Plays** | `(listeningHours * 60) / 3.5` | Assumes 3.5min avg track |
| **Followers** | `popularity * 10000 + random(50000)` | Fallback if missing |

## 🎵 Track Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| **Listening Time** | `Math.max(0.1, (50 - index) * 2.5)` | Min 0.1 hours |
| **Total Plays** | `Math.max(1, listeningTime * 15)` | ~15 plays/hour |
| **Audio Features** | `(spotifyValue \|\| 0.5) * 100` | 0-100 scale |
| **Mood Score** | `(energy + valence + danceability) / 3` | Combined mood |
| **Replay Score** | `popularity * 0.6 + energy * 0.2 + dance * 0.2` | Max 100 |
| **Song Share** | `(trackTime / totalUserTime) * 100` | Track's % of total |
| **Freshness** | `100 - ((currentYear - discoveryYear) * 25)` | Discovery recency |

## 🎭 Genre Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| **Count** | `artists.filter(a => a.genres.includes(genre)).length` | Artist count in genre |
| **Percentage** | `(genreCount / totalGenreCount) * 100` | Share of all genres |
| **Artist Count** | `new Set(genreArtists.map(a => a.id)).size` | Unique artists |
| **Avg Popularity** | `sum(artistPopularity) / artistCount` | Mean popularity |
| **Listening Hours** | `sum(artist.listeningHours)` | Total from artists |
| **Track Count** | `sum(artist.tracksCount)` | Total from artists |
| **Diversity** | `(artistCount * 5) + (avgPop * 0.3) + random(20)` | Max 100 |
| **Replay Value** | `(avgPop * 0.4) + (diversity * 0.3) + random(30)` | Max 100 |

## 📈 Listening Trends

| Metric | Formula | Notes |
|--------|---------|-------|
| **Weekly Hours** | `(20 + random(30)) * seasonalMultiplier` | 20-50 hours/week |
| **Track Count** | `weeklyHours * 3 * seasonalMultiplier` | ~3 tracks/hour |
| **Artist Count** | `trackCount * 0.3` | ~30% unique artists |
| **Seasonal Multiplier** | `0.8 + sin((month/12) * π * 2) * 0.2` | 0.6-1.0 range |
| **Diversity** | `60 + random(30)` | 60-90% range |

## 📊 Overview Stats

| Metric | Formula | Notes |
|--------|---------|-------|
| **Total Tracks** | `tracks.length` | Direct count |
| **Total Artists** | `new Set(artists.map(a => a.id)).size` | Unique count |
| **Listening Time** | `totalDuration / (1000 * 60 * 60)` | Hours |
| **Top Genre** | `max(genreCounts)` | Most frequent |
| **Avg Popularity** | `sum(popularity) / count` | Mean score |
| **Recent Activity** | `tracks.filter(t => t.playedAt > 30daysAgo)` | Last 30 days |

## 🔧 Common Patterns

### Minimum Value Protection
```typescript
const safeValue = Math.max(minimumValue, calculatedValue);
```

### Rounding Standards
```typescript
Math.round(value)           // Percentages/scores
Math.round(value * 100)/100 // Hours with decimals
Math.floor(value)           // Large numbers
```

### Fallback Values
```typescript
const safeProperty = item.property || defaultValue;
```

### Time Range Mapping
```typescript
'1week'|'1month' → 'short_term'
'3months'|'6months' → 'medium_term' 
'1year'|'2years'|'alltime' → 'long_term'
```

## ⚠️ Important Notes

- **Listening Hours** = Potential time if all tracks played once
- **Play Counts** = Estimated based on ranking algorithms
- **Freshness/Discovery** = Simulated data for demo purposes
- **Minimum Values** = All calculations protected against negatives
- **API Limits** = Max 2000 tracks/artists, 50 recently played

## 🎯 Mood Categories

| Category | Criteria |
|----------|----------|
| **High Energy** | `energy > 80 && valence > 60` |
| **Happy & Upbeat** | `valence > 70 && danceability > 60` |
| **Chill & Relaxed** | `energy < 50 && acousticness > 50` |
| **Melancholic** | `valence < 40 && energy < 60` |
| **Intense & Dark** | `energy > 70 && valence < 40` |

---

*Quick Reference v1.0 - December 2024* 