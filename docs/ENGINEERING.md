
# Spotify Analytics Dashboard - Engineering Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [System Architecture](#system-architecture)
3. [Data Flow](#data-flow)
4. [Extended Data Architecture](#extended-data-architecture)
5. [API Documentation](#api-documentation)
6. [Security Implementation](#security-implementation)
7. [Performance Optimization](#performance-optimization)
8. [Deployment Guide](#deployment-guide)

## Architecture Overview

### Technology Stack
| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | UI framework |
| **Build Tool** | Vite | Latest | Fast development & build |
| **Language** | TypeScript | Latest | Type safety |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS |
| **UI Components** | Shadcn/UI | Latest | Pre-built components |
| **State Management** | React Query + Context | 5.56.2 | Server state & app state |
| **Routing** | React Router | 6.26.2 | Client-side routing |
| **Charts** | Recharts | 2.12.7 | Data visualization |

### Project Structure
```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   │   ├── LibraryHealth.tsx     # Enhanced with 500+ items
│   │   ├── ImprovedListeningTrends.tsx
│   │   └── ...
│   ├── layout/            # Layout components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useSpotifyData.ts  # Enhanced with extended methods
│   └── useTheme.ts
├── lib/                   # Utility libraries
│   ├── spotify-api.ts     # Enhanced with pagination support
│   ├── data-utils.ts
│   └── utils.ts
├── pages/                 # Route components
└── types/                 # TypeScript definitions
```

## System Architecture

### Enhanced Data Layer Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                        │
├─────────────────────────────────────────────────────────┤
│  React Application Layer                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ Auth System │ │ Dashboard   │ │ Extended Analytics  │ │
│  │             │ │ Components  │ │ (500+ items)        │ │
│  └─────────────┘ └─────────────┘ └─────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Enhanced State Management Layer                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ React Query │ │ Standard    │ │ Extended Data       │ │
│  │ (10min cache│ │ Data Cache  │ │ Cache (500+ items)  │ │
│  │ extended)   │ │ (5min)      │ │                     │ │
│  └─────────────┘ └─────────────┘ └─────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Pagination & Rate Limiting Layer (NEW)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ Request     │ │ Rate Limit  │ │ Progress Tracking   │ │
│  │ Sequencer   │ │ Manager     │ │ & Error Recovery    │ │
│  └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                             │
                             │ HTTPS/OAuth 2.0 + Pagination
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Spotify Web API                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ Paginated   │ │ Standard    │ │ Rate Limited        │ │
│  │ Endpoints   │ │ Endpoints   │ │ Responses           │ │
│  │ (offset)    │ │ (limit 50)  │ │ (100/min)           │ │
│  └─────────────┘ └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Standard Data Flow (50 items)
```
User Request → useTopTracks() → spotifyAPI.getTopTracks() → Single API Call → 50 items
```

### Extended Data Flow (500 items) - NEW
```
User Request → useExtendedTopTracks() → spotifyAPI.getExtendedTopTracks()
     ↓
Pagination Loop:
  ├─ Request 1: offset=0,  limit=50 → 50 items
  ├─ Rate limit delay (100ms)
  ├─ Request 2: offset=50, limit=50 → 50 items  
  ├─ Rate limit delay (125ms)
  ├─ ...
  └─ Request 10: offset=450, limit=50 → 50 items
     ↓
Total: 500 items → Enhanced Analytics
```

### Enhanced Processing Pipeline
```
Raw Extended Data → Sanitization → Analysis → Caching → UI Display
      (500+ items)      ↓            ↓         ↓         ↓
                   Remove PII    Deep Genre  Extended   Rich
                   Validate data Analysis    Cache      Insights
                   Error handle  Decade      (10min)    Visualizations
                                Distribution
```

## Extended Data Architecture

### Pagination Implementation

#### Request Sequencing
```typescript
class ExtendedDataFetcher {
  async fetchWithPagination(
    endpoint: string, 
    totalLimit: number,
    accessToken: string
  ): Promise<ExtendedResponse> {
    const allItems = [];
    const maxRequestLimit = 50; // Spotify API limit
    let offset = 0;
    let requestCount = 0;
    
    while (allItems.length < totalLimit && offset < 1000) {
      const currentLimit = Math.min(maxRequestLimit, totalLimit - allItems.length);
      
      try {
        // Make API request
        const response = await this.makeRequest(
          `${endpoint}?limit=${currentLimit}&offset=${offset}`,
          accessToken
        );
        
        if (!response.items?.length) break;
        
        allItems.push(...response.items);
        offset += currentLimit;
        requestCount++;
        
        // Progressive rate limiting
        if (allItems.length < totalLimit) {
          const delay = this.calculateDelay(requestCount);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
      } catch (error) {
        console.error(`Request failed at offset ${offset}:`, error);
        break; // Continue with partial data
      }
    }
    
    return {
      items: allItems,
      total: allItems.length,
      limit: maxRequestLimit,
      offset: 0,
      next: null,
      previous: null
    };
  }
  
  private calculateDelay(requestCount: number): number {
    // Progressive backoff: 100ms + 25ms per request
    return Math.min(100 + (requestCount * 25), 500);
  }
}
```

#### Memory Management
```typescript
class ExtendedDataManager {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private maxCacheSize = 10; // Limit cached datasets
  
  cacheExtendedData(key: string, data: any): void {
    // Clear old cache if at limit
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  getCachedData(key: string, maxAge: number = 600000): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}
```

### Enhanced Analytics Capabilities

#### Deep Genre Analysis (500+ Artists)
```typescript
interface EnhancedGenreAnalysis {
  totalGenres: number;
  genreDistribution: Array<{
    genre: string;
    artistCount: number;
    percentage: number;
    popularity: number;
  }>;
  genreEvolution: Array<{
    decade: string;
    genres: string[];
    dominantGenre: string;
  }>;
  nicheFactor: number; // 0-100, how niche the taste is
  discoveryScore: number; // 0-100, emerging artists ratio
}
```

#### Advanced Artist Insights
```typescript
interface ArtistInsights {
  totalArtists: number;
  uniqueArtists: number;
  popularityDistribution: {
    emerging: number;    // 0-39 popularity
    established: number; // 40-69 popularity  
    mainstream: number;  // 70-100 popularity
  };
  followerAnalysis: {
    averageFollowers: number;
    medianFollowers: number;
    undergroundRatio: number; // Artists with <100k followers
  };
  genreDiversity: {
    averageGenresPerArtist: number;
    mostVersatileArtists: Artist[];
    genreConnections: Array<{
      genre1: string;
      genre2: string;
      connectionStrength: number;
    }>;
  };
}
```

## API Documentation

### Extended Spotify API Methods

#### `getExtendedTopTracks(accessToken, timeRange, totalLimit)`
**Purpose**: Fetch up to 500 top tracks using pagination
**Returns**: `ExtendedResponse<Track>`
**Features**:
- Automatic pagination handling
- Rate limiting between requests
- Partial data recovery on errors
- Progress tracking capabilities

#### `getExtendedTopArtists(accessToken, timeRange, totalLimit)`
**Purpose**: Fetch up to 500 top artists using pagination
**Returns**: `ExtendedResponse<Artist>`
**Features**:
- Enhanced genre analysis with larger dataset
- Better statistical accuracy
- Deeper discovery insights

### React Query Integration

#### Extended Data Hooks
```typescript
// Standard hook (50 items, 5min cache)
const { data: standardTracks } = useTopTracks('medium_term', 50);

// Extended hook (500 items, 10min cache)
const { data: extendedTracks } = useExtendedTopTracks('medium_term', 500);
```

#### Cache Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Standard data: 5 minutes
      staleTime: 1000 * 60 * 5,
      // Extended data: 10 minutes (configured per hook)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## Security Implementation

### Extended Data Security

#### Rate Limiting Compliance
```typescript
class RateLimitManager {
  private requestLog: number[] = [];
  private readonly windowMs = 60000; // 1 minute
  private readonly maxRequests = 90; // Buffer under 100/min limit
  
  async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    // Remove old requests outside window
    this.requestLog = this.requestLog.filter(time => now - time < this.windowMs);
    
    if (this.requestLog.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requestLog);
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime + 100));
    }
    
    this.requestLog.push(now);
  }
}
```

#### Memory Protection
```typescript
// Prevent memory leaks with large datasets
const cleanupExtendedData = () => {
  // Clear extended datasets after component unmount
  useEffect(() => {
    return () => {
      queryClient.removeQueries(['extended-top-tracks']);
      queryClient.removeQueries(['extended-top-artists']);
    };
  }, []);
};
```

## Performance Optimization

### Extended Data Optimizations

#### Lazy Loading Strategy
```typescript
const LazyExtendedAnalytics = React.lazy(() => 
  import('./components/dashboard/ExtendedAnalytics')
);

// Load extended data only when needed
const [showExtended, setShowExtended] = useState(false);
```

#### Virtual Scrolling for Large Lists
```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualizedTrackList = ({ tracks }: { tracks: Track[] }) => (
  <List
    height={600}
    itemCount={tracks.length}
    itemSize={60}
    itemData={tracks}
  >
    {TrackListItem}
  </List>
);
```

#### Progressive Enhancement
```typescript
// Start with standard data, upgrade to extended
const useProgressiveData = (timeRange: string) => {
  const [useExtended, setUseExtended] = useState(false);
  
  const standardData = useTopTracks(timeRange, 50);
  const extendedData = useExtendedTopTracks(timeRange, 500, {
    enabled: useExtended
  });
  
  return {
    data: useExtended ? extendedData : standardData,
    upgradeToExtended: () => setUseExtended(true),
    isExtended: useExtended
  };
};
```

### Performance Metrics

#### Extended Data Benchmarks
| Metric | Standard (50 items) | Extended (500 items) | Target |
|--------|--------------------|--------------------|---------|
| **Load Time** | 200-500ms | 3-8 seconds | <10s |
| **Memory Usage** | ~100KB | ~1MB | <5MB |
| **API Calls** | 1 request | 10 requests | <15 |
| **Cache Duration** | 5 minutes | 10 minutes | 10min+ |

#### Performance Monitoring
```typescript
const measureExtendedDataPerformance = () => {
  const startTime = performance.now();
  let apiCallCount = 0;
  
  const originalFetch = window.fetch;
  window.fetch = (...args) => {
    if (args[0].toString().includes('spotify.com/v1')) {
      apiCallCount++;
    }
    return originalFetch(...args);
  };
  
  return {
    getMetrics: () => ({
      duration: performance.now() - startTime,
      apiCalls: apiCallCount,
      memoryUsage: performance.memory?.usedJSHeapSize || 0
    })
  };
};
```

## Deployment Guide

### Build Optimization for Extended Data

#### Bundle Splitting
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'extended-analytics': [
            'src/components/dashboard/LibraryHealth.tsx',
            'src/components/dashboard/ImprovedListeningTrends.tsx'
          ],
          'standard-analytics': [
            'src/components/dashboard/DashboardOverview.tsx'
          ]
        }
      }
    }
  }
});
```

#### Production Environment Variables
```bash
# Extended data configuration
VITE_EXTENDED_DATA_ENABLED=true
VITE_MAX_EXTENDED_TRACKS=500
VITE_MAX_EXTENDED_ARTISTS=500
VITE_EXTENDED_CACHE_DURATION=600000  # 10 minutes
```

### Monitoring Extended Data Usage

#### Analytics Events
```typescript
// Track extended data usage
const trackExtendedDataUsage = () => {
  analytics.track('Extended Data Fetched', {
    itemCount: data.items.length,
    timeRange: timeRange,
    loadTime: performance.now() - startTime,
    success: data.items.length > 50
  });
};
```

#### Error Tracking
```typescript
// Monitor extended data errors
const trackExtendedDataErrors = (error: Error, context: any) => {
  errorTracking.captureException(error, {
    tags: {
      feature: 'extended-data-fetching',
      timeRange: context.timeRange,
      itemsRequested: context.totalLimit,
      itemsFetched: context.itemsFetched
    }
  });
};
```

## Maintenance & Monitoring

### Extended Data Health Checks

#### API Performance Monitoring
```typescript
const monitorExtendedDataHealth = () => {
  // Track success rates
  const successRate = successfulExtendedRequests / totalExtendedRequests;
  
  // Monitor average load times  
  const avgLoadTime = totalExtendedLoadTime / completedExtendedRequests;
  
  // Check rate limit compliance
  const rateLimitViolations = requestsRejectedByRateLimit;
  
  return {
    healthScore: calculateHealthScore(successRate, avgLoadTime, rateLimitViolations),
    metrics: { successRate, avgLoadTime, rateLimitViolations }
  };
};
```

#### Maintenance Tasks

**Weekly**:
- Review extended data fetch success rates
- Monitor average load times for 500+ item datasets
- Check rate limit compliance and adjust delays if needed

**Monthly**:
- Analyze extended data usage patterns
- Optimize pagination strategy based on user behavior
- Update cache durations based on data freshness needs

**Quarterly**:
- Performance audit of extended data components
- Review memory usage patterns with large datasets
- Optimize bundle splitting for extended analytics features

### Future Enhancements

#### Planned Extended Data Features
1. **Smart Pagination**: Adaptive request sizes based on user's data volume
2. **Background Sync**: Pre-fetch extended data in background
3. **Incremental Updates**: Update only changed portions of extended datasets
4. **Data Compression**: Compress large datasets for better performance
5. **Offline Support**: Cache extended data for offline analysis
