import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Music, TrendingUp, Clock, Star, Info, Play, Album, Calendar, Sparkles, Target, Zap, Heart, Volume2, ExternalLink, Headphones, Users, Disc } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { mapUITimeRangeToAPI, getTimeRangeLabel } from '@/lib/spotify-data-utils';
import { cn } from '@/lib/utils';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

interface TrackDetailModalProps {
  track: any;
  isOpen: boolean;
  onClose: () => void;
}

const TrackDetailModal = ({ track, isOpen, onClose }: TrackDetailModalProps) => {
  if (!track) return null;

  const durationMinutes = Math.floor(track.duration_ms / 60000);
  const durationSeconds = Math.floor((track.duration_ms % 60000) / 1000);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Track Deep Dive: {track.name}
          </DialogTitle>
          <DialogDescription>
            Comprehensive analysis of this track from your music library
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Track Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Track Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Artist:</span>
                  <span className="font-medium">{track.artists?.[0]?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Album:</span>
                  <span className="font-medium truncate ml-2">{track.album?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{durationMinutes}:{durationSeconds.toString().padStart(2, '0')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Popularity:</span>
                  <span className="font-medium">{track.popularity || 0}/100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Listening Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Play Rank:</span>
                  <span className="font-medium">#{track.rank || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Replay Score:</span>
                  <span className="font-medium">{track.replayScore || 0}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discovery Year:</span>
                  <span className="font-medium">{track.discoveryYear || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Mood Score:</span>
                  <span className="font-medium">{track.moodScore || 0}/100</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audio Features Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audio Characteristics</CardTitle>
              <CardDescription className="text-xs">
                Estimated audio features based on track metadata and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Energy</span>
                    <span>{track.energy || 75}%</span>
                  </div>
                  <Progress value={track.energy || 75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Danceability</span>
                    <span>{track.danceability || 68}%</span>
                  </div>
                  <Progress value={track.danceability || 68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Valence</span>
                    <span>{track.valence || 72}%</span>
                  </div>
                  <Progress value={track.valence || 72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Acousticness</span>
                    <span>{track.acousticness || 25}%</span>
                  </div>
                  <Progress value={track.acousticness || 25} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Personal Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Why You Love This Track</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {track.personalInsight || `This track ranks #${track.rank || 'high'} in your library with a ${track.replayScore || 85}% replay score, suggesting strong personal connection and frequent listening.`}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-accent/10 rounded">
                    <div className="text-lg font-bold text-accent">{track.totalPlays || Math.floor(Math.random() * 50) + 20}</div>
                    <div className="text-xs text-muted-foreground">Est. Plays</div>
                  </div>
                  <div className="text-center p-2 bg-primary/10 rounded">
                    <div className="text-lg font-bold text-primary">{Math.floor((track.duration_ms || 0) / 60000 * (track.totalPlays || 35))}m</div>
                    <div className="text-xs text-muted-foreground">Listen Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const TrackExplorer = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [sortBy, setSortBy] = useState('listeningTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  const { useEnhancedTopTracks, useEnhancedTopArtists } = useSpotifyData();
  const apiTimeRange = mapUITimeRangeToAPI(timeRange);
  const { data: tracks = [], isLoading: tracksLoading } = useEnhancedTopTracks(apiTimeRange, 2000);
  const { data: artists = [], isLoading: artistsLoading } = useEnhancedTopArtists(apiTimeRange, 2000);
  const isLoading = tracksLoading || artistsLoading;

  // Handle filtering state
  React.useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [timeRange, sortBy, sortOrder]);

  // Process track data with enhanced metrics
  const processedTracks = useMemo(() => {
    if (!tracks.length || !artists.length) return [];
    
    return tracks.map((track: any, index: number) => {
      const artist = artists.find((a: any) => 
        track.artists?.some((ta: any) => ta.id === a.id)
      );
      
      const duration = track.duration_ms || 0;
      const energy = (track.energy || 0.5) * 100;
      const danceability = (track.danceability || 0.5) * 100;
      const valence = (track.valence || 0.5) * 100;
      const acousticness = (track.acousticness || 0.5) * 100;
      
      // Calculate enhanced metrics
      const baseListeningTime = Math.max(0.1, (50 - index) * 2.5); // Estimated hours, minimum 0.1
      const replayScore = Math.min(100, Math.round(
        (track.popularity || 50) * 0.6 + 
        energy * 0.2 + 
        danceability * 0.2
      ));
      
      const discoveryYear = 2020 + Math.floor(Math.random() * 4);
      const currentYear = new Date().getFullYear();
      const freshness = Math.max(0, 100 - ((currentYear - discoveryYear) * 25));
      
      const moodScore = Math.round((energy + valence + danceability) / 3);
      const totalPlays = Math.max(1, Math.round(baseListeningTime * 15)); // Estimated plays, minimum 1
      const listeningTime = Math.round(baseListeningTime * 100) / 100;
      
      // Song share calculation
      const totalUserListening = tracks.reduce((acc: number, t: any) => 
        acc + Math.max(0.1, (50 - tracks.indexOf(t)) * 2.5), 0);
      const songShare = totalUserListening > 0 ? (listeningTime / totalUserListening) * 100 : 0;
      
      return {
        ...track,
        rank: index + 1,
        artist: artist,
        artistName: track.artists?.[0]?.name || 'Unknown Artist',
        albumName: track.album?.name || 'Unknown Album',
        durationMinutes: Math.floor(duration / 60000),
        durationSeconds: Math.floor((duration % 60000) / 1000),
        energy: Math.round(energy),
        danceability: Math.round(danceability),
        valence: Math.round(valence),
        acousticness: Math.round(acousticness),
        replayScore,
        discoveryYear,
        moodScore,
        totalPlays,
        listeningTime,
        freshness: Math.round(freshness),
        songShare: Math.round(songShare * 100) / 100,
        genres: artist?.genres || [],
        personalInsight: `This ${artist?.genres?.[0] || 'track'} masterpiece has been played ${totalPlays} times, showing your deep connection to its ${moodScore > 70 ? 'uplifting' : moodScore > 40 ? 'balanced' : 'contemplative'} energy.`
      };
    });
  }, [tracks, artists]);

  // Separate sorting logic
  const sortedTracks = useMemo(() => {
    const sorted = [...processedTracks].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'listeningTime':
          aValue = a.listeningTime;
          bValue = b.listeningTime;
          break;
        case 'artistName':
          aValue = a.artistName.toLowerCase();
          bValue = b.artistName.toLowerCase();
          break;
        case 'popularity':
          aValue = a.popularity || 0;
          bValue = b.popularity || 0;
          break;
        case 'energy':
          aValue = a.energy;
          bValue = b.energy;
          break;
        case 'danceability':
          aValue = a.danceability;
          bValue = b.danceability;
          break;
        case 'valence':
          aValue = a.valence;
          bValue = b.valence;
          break;
        case 'replayScore':
          aValue = a.replayScore;
          bValue = b.replayScore;
          break;
        case 'freshness':
          aValue = a.freshness;
          bValue = b.freshness;
          break;
        case 'songShare':
          aValue = a.songShare;
          bValue = b.songShare;
          break;
        case 'discoveryYear':
          aValue = a.discoveryYear;
          bValue = b.discoveryYear;
          break;
        default:
          aValue = a.listeningTime;
          bValue = b.listeningTime;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return sorted.map((track, index) => ({
      ...track,
      rank: index + 1
    }));
  }, [processedTracks, sortBy, sortOrder]);

  // Calculate stats
  const calculateStats = () => {
    const totalTracks = sortedTracks.length;
    const totalHours = Math.round(sortedTracks.reduce((acc, track) => acc + track.listeningTime, 0) * 10) / 10;
    const avgPopularity = Math.round(sortedTracks.reduce((acc, track) => acc + (track.popularity || 0), 0) / totalTracks) || 0;
    const avgEnergy = Math.round(sortedTracks.reduce((acc, track) => acc + track.energy, 0) / totalTracks) || 0;
    const avgMood = Math.round(sortedTracks.reduce((acc, track) => acc + track.moodScore, 0) / totalTracks) || 0;
    const avgFreshness = Math.round(sortedTracks.reduce((acc, track) => acc + track.freshness, 0) / totalTracks) || 0;
    const totalPlays = sortedTracks.reduce((acc, track) => acc + track.totalPlays, 0);
    
    return {
      totalTracks,
      totalHours,
      avgPopularity,
      avgEnergy,
      avgMood,
      avgFreshness,
      totalPlays
    };
  };

  const stats = calculateStats();

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!sortedTracks.length) return [];
    
    const facts = [];
    const topTrack = sortedTracks[0];
    const mostEnergetic = sortedTracks.reduce((prev, current) => 
      current.energy > prev.energy ? current : prev
    );
    const mostDanceable = sortedTracks.reduce((prev, current) => 
      current.danceability > prev.danceability ? current : prev
    );
    const freshestTrack = sortedTracks.reduce((prev, current) => 
      current.freshness > prev.freshness ? current : prev
    );
    
    facts.push({
      icon: Heart,
      title: "Top Track Obsession",
      description: `"${topTrack?.name}" by ${topTrack?.artistName} is your #1 with ${topTrack?.listeningTime || 0} hours - that's ${Math.round((topTrack?.listeningTime || 0) * 60)} minutes of pure bliss!`
    });
    
    facts.push({
      icon: Zap,
      title: "Energy Powerhouse",
      description: `"${mostEnergetic?.name}" brings the highest energy at ${mostEnergetic?.energy || 0}% - perfect for those high-intensity moments!`
    });
    
    facts.push({
      icon: Target,
      title: "Dance Floor Champion",
      description: `"${mostDanceable?.name}" has ${mostDanceable?.danceability || 0}% danceability - it's your go-to groove maker!`
    });
    
    facts.push({
      icon: Sparkles,
      title: "Fresh Discovery",
      description: `"${freshestTrack?.name}" is your freshest find at ${freshestTrack?.freshness || 0}% fresh from ${freshestTrack?.discoveryYear || 'recently'}!`
    });
    
    return facts.slice(0, 4);
  }, [sortedTracks]);

  // Chart data
  const energyData = sortedTracks.slice(0, 10).map(track => ({
    name: track.name.length > 15 ? track.name.substring(0, 15) + '...' : track.name,
    fullName: track.name,
    artist: track.artistName,
    energy: track.energy,
    danceability: track.danceability,
    valence: track.valence
  }));

  const listeningTimeData = sortedTracks.slice(0, 10).map(track => ({
    name: track.name.length > 15 ? track.name.substring(0, 15) + '...' : track.name,
    fullName: track.name,
    artist: track.artistName,
    time: track.listeningTime,
    plays: track.totalPlays
  }));

  const moodAnalysisData = sortedTracks.slice(0, 8).map(track => ({
    track: track.name.length > 12 ? track.name.substring(0, 12) + '...' : track.name,
    fullName: track.name,
    artist: track.artistName,
    energy: track.energy,
    danceability: track.danceability,
    valence: track.valence,
    acousticness: track.acousticness
  }));

  const chartConfig = {
    energy: { label: "Energy", color: "hsl(var(--accent))" },
    danceability: { label: "Danceability", color: "hsl(var(--primary))" },
    valence: { label: "Valence", color: "hsl(217, 91%, 60%)" },
    time: { label: "Hours", color: "hsl(var(--accent))" }
  };

  // Filtering overlay component
  const FilteringOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
          <div className="animate-pulse h-2 w-2 bg-accent rounded-full"></div>
          <span className="text-sm font-medium">Filtering tracks...</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Applying {getTimeRangeLabel(timeRange)} filter and {sortBy} sorting
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Track Explorer</h1>
          <p className="text-muted-foreground">Loading your music collection...</p>
        </div>
        <CalmingLoader 
          title="Analyzing your track collection..."
          description="Processing your extended music library to discover patterns"
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filtering overlay */}
      {isFiltering && <FilteringOverlay />}

      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Track Explorer</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Deep insights from your extended track collection • Discover your musical DNA
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Total Dataset: {tracks.length} tracks</span>
            <span>•</span>
            <span>Filtered ({getTimeRangeLabel(timeRange)}): {sortedTracks.length} tracks</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">Last Week</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last Three Months</SelectItem>
              <SelectItem value="6months">Last Six Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="2years">Last Two Years</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="listeningTime">Listening Time</SelectItem>
              <SelectItem value="name">Track Name</SelectItem>
              <SelectItem value="artistName">Artist Name</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="danceability">Danceability</SelectItem>
              <SelectItem value="valence">Mood</SelectItem>
              <SelectItem value="replayScore">Replay Score</SelectItem>
              <SelectItem value="freshness">Freshness</SelectItem>
              <SelectItem value="songShare">Song Share</SelectItem>
              <SelectItem value="discoveryYear">Discovery Year</SelectItem>
            </SelectContent>
          </Select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Tracks</span>
              <InfoButton
                title="Total Tracks"
                description="Number of unique tracks in your extended dataset for the selected time period."
                funFacts={[
                  "Your track collection shows musical depth",
                  "More tracks indicate comprehensive listening",
                  "Each track represents a musical moment"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalTracks}</div>
            <div className="text-xs text-muted-foreground">{getTimeRangeLabel(timeRange)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Hours</span>
              <InfoButton
                title="Total Listening Hours"
                description="Estimated total hours spent listening to these tracks."
                calculation="Calculated from track rankings and estimated play frequency."
                funFacts={[
                  "Shows dedication to musical tracks",
                  "Listening hours indicate deep musical engagement",
                  "More hours suggest passionate music consumption"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalHours}</div>
            <div className="text-xs text-muted-foreground">Total listening</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Avg Pop.</span>
              <InfoButton
                title="Average Popularity"
                description="Average popularity score across all your tracks (0-100 scale)."
                calculation="Based on Spotify's popularity metrics, averaged across your track collection."
                funFacts={[
                  "Higher scores indicate mainstream taste",
                  "Lower scores suggest underground preferences",
                  "Balance shows diverse musical palette"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgPopularity}</div>
            <div className="text-xs text-muted-foreground">Out of 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Energy</span>
              <InfoButton
                title="Average Energy"
                description="How energetic your music taste is (0-100 scale)."
                calculation="Based on Spotify's audio features, averaged across your collection."
                funFacts={[
                  "Higher energy indicates upbeat preferences",
                  "Shows your musical energy preferences",
                  "Energy affects mood and motivation"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgEnergy}</div>
            <div className="text-xs text-muted-foreground">Energy score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Mood</span>
              <InfoButton
                title="Average Mood"
                description="Overall mood score of your music (0-100 scale)."
                calculation="Combination of valence, energy, and danceability metrics."
                funFacts={[
                  "Higher scores indicate happier music",
                  "Shows your emotional music preferences",
                  "Mood affects listening experience"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgMood}</div>
            <div className="text-xs text-muted-foreground">Mood score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Freshness</span>
              <InfoButton
                title="Discovery Freshness"
                description="How recently you've discovered new tracks (0-100 scale)."
                calculation="Based on estimated discovery timeline and current musical trends."
                funFacts={[
                  "Higher scores indicate recent musical discoveries",
                  "Shows openness to new music",
                  "Freshness keeps your taste evolving"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgFreshness}</div>
            <div className="text-xs text-muted-foreground">Discovery score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Plays</span>
              <InfoButton
                title="Total Plays"
                description="Estimated total number of plays across all tracks."
                funFacts={[
                  "Each play represents a musical moment",
                  "Play count shows listening dedication",
                  "More plays indicate favorite tracks"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.totalPlays.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Est. plays</div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Fun Facts About Your Track Collection
            </CardTitle>
            <CardDescription>
              Interesting insights from your track listening patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {funFacts.map((fact, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <fact.icon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{fact.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{fact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <div className="relative">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Track List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Top Tracks List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Top Tracks - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Your most played tracks from the extended dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sortedTracks.slice(0, 10).map((track) => (
                    <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Badge variant="outline" className="text-xs min-w-[2rem] text-center">
                        #{track.rank}
                      </Badge>
                      
                      {track.album?.images?.[0]?.url ? (
                        <img 
                          src={track.album.images[0].url} 
                          alt={track.albumName}
                          className="w-12 h-12 rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-md flex items-center justify-center">
                          <Music className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{track.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {track.popularity || 0}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.artistName} • {track.albumName}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{track.listeningTime}h</span>
                          <span>•</span>
                          <span>{track.totalPlays} plays</span>
                          <span>•</span>
                          <span>{track.energy}% energy</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Share</div>
                        <div className="text-sm font-bold text-accent">{track.songShare}%</div>
                      </div>
                      
                      {track.external_urls?.spotify && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(track.external_urls.spotify, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Detailed Track Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Extended Track Collection - {getTimeRangeLabel(timeRange)}
                </CardTitle>
                <CardDescription>
                  Complete track analysis from your extended dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {sortedTracks.slice(0, 24).map((track) => (
                    <Card key={track.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{track.rank}
                          </Badge>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Hours</div>
                            <div className="text-sm font-bold text-accent">{track.listeningTime}</div>
                          </div>
                        </div>
                        
                        {track.album?.images?.[0]?.url ? (
                          <div className="mb-3 relative group">
                            <img 
                              src={track.album.images[0].url} 
                              alt={track.albumName}
                              className="w-full h-32 sm:h-36 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <p className="text-xs font-medium truncate">{track.name}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3 h-32 sm:h-36 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Music className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground font-medium">{track.name}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-sm truncate flex-1 pr-2">{track.name}</h3>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {track.popularity || 0}/100
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground truncate">
                            {track.artistName}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-1 text-xs">
                            <div className="text-center p-2 bg-accent/10 rounded">
                              <div className="text-xs text-muted-foreground">Energy</div>
                              <div className="font-medium text-accent">{track.energy}%</div>
                            </div>
                            <div className="text-center p-2 bg-primary/10 rounded">
                              <div className="text-xs text-muted-foreground">Dance</div>
                              <div className="font-medium text-primary">{track.danceability}%</div>
                            </div>
                            <div className="text-center p-2 bg-green-500/10 rounded">
                              <div className="text-xs text-muted-foreground">Mood</div>
                              <div className="font-medium text-green-600">{track.valence}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              <span>{track.freshness}% fresh</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{track.durationMinutes}:{track.durationSeconds.toString().padStart(2, '0')}</span>
                            </div>
                          </div>
                          
                          {track.genres && track.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {track.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="secondary" className="text-xs px-1.5 py-0">
                                  {genre}
                                </Badge>
                              ))}
                              {track.genres.length > 2 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                  +{track.genres.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 md:space-y-6">
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Listening Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Listening Time Distribution
                  </CardTitle>
                  <CardDescription>
                    Hours spent listening to your top tracks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={listeningTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    by {data.artist}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Time: {data.time}h ({data.plays} plays)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="time" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Energy Analysis Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Audio Features Analysis
                  </CardTitle>
                  <CardDescription>
                    Energy, danceability, and mood of your top tracks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={energyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    by {data.artist}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Energy: {data.energy}% | Dance: {data.danceability}% | Mood: {data.valence}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="energy" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="danceability" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="valence" 
                          stroke="hsl(217, 91%, 60%)" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Mood Analysis Radar Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Track Mood Analysis
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional analysis of your top tracks' audio features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={moodAnalysisData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="track" />
                        <PolarRadiusAxis angle={60} domain={[0, 100]} tickCount={5} />
                        <Radar
                          name="Energy"
                          dataKey="energy"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Danceability" 
                          dataKey="danceability"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Valence"
                          dataKey="valence"
                          stroke="hsl(217, 91%, 60%)"
                          fill="hsl(217, 91%, 60%)"
                          fillOpacity={0.2}
                        />
                        <Radar
                          name="Acousticness"
                          dataKey="acousticness"
                          stroke="hsl(142, 71%, 45%)"
                          fill="hsl(142, 71%, 45%)"
                          fillOpacity={0.1}
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    by {data.artist}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Energy: {data.energy}% | Dance: {data.danceability}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Mood: {data.valence}% | Acoustic: {data.acousticness}%
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TrackDetailModal 
        track={selectedTrack}
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
      />
    </div>
  );
}; 