
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Music, Search, TrendingUp, Users, Star, Filter, Grid, List, Loader2 } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { cn } from '@/lib/utils';

export const GenreExplorer = () => {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'artists' | 'tracks'>('popularity');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Use centralized store with full 2000 item dataset
  const { tracks, artists, isLoading: storeLoading } = useExtendedSpotifyDataStore();
  const topTracksData = { items: tracks };
  const topArtistsData = { items: artists };
  const tracksLoading = storeLoading;
  const artistsLoading = storeLoading;

  const isLoading = tracksLoading || artistsLoading;

  // Process genre data
  const genreData = useMemo(() => {
    if (!topArtistsData?.items || !topTracksData?.items) {
      return { genres: [], total: 0 };
    }

    const genreCounts: { [key: string]: { 
      count: number; 
      artists: Set<string>; 
      tracks: Set<string>;
      popularity: number;
    } } = {};
    
    // Process artists and their genres
    topArtistsData.items.forEach((artist: any) => {
      const artistPopularity = artist.popularity || 0;
      artist.genres?.forEach((genre: string) => {
        if (!genreCounts[genre]) {
          genreCounts[genre] = { 
            count: 0, 
            artists: new Set(), 
            tracks: new Set(),
            popularity: 0
          };
        }
        genreCounts[genre].count += 1;
        genreCounts[genre].artists.add(artist.name);
        genreCounts[genre].popularity += artistPopularity;
      });
    });

    // Add track information
    topTracksData.items.forEach((track: any) => {
      track.artists?.forEach((artist: any) => {
        const matchingArtist = topArtistsData.items.find((a: any) => a.id === artist.id);
        if (matchingArtist?.genres) {
          matchingArtist.genres.forEach((genre: string) => {
            if (genreCounts[genre]) {
              genreCounts[genre].tracks.add(track.name);
            }
          });
        }
      });
    });

    // Create final genre list
    const genres = Object.entries(genreCounts)
      .map(([genre, data]) => ({
        name: genre,
        count: data.count,
        artists: Array.from(data.artists),
        tracks: Array.from(data.tracks),
        avgPopularity: data.count > 0 ? Math.round(data.popularity / data.count) : 0,
        percentage: 0,
      }))
      .sort((a, b) => {
        switch (sortBy) {
          case 'artists': return b.count - a.count;
          case 'tracks': return b.tracks.length - a.tracks.length;
          case 'popularity': return b.avgPopularity - a.avgPopularity;
          default: return b.count - a.count;
        }
      });

    const total = genres.reduce((sum, genre) => sum + genre.count, 0);
    
    // Calculate percentages
    genres.forEach(genre => {
      genre.percentage = total > 0 ? Math.round((genre.count / total) * 100) : 0;
    });

    return { genres, total };
  }, [topArtistsData, topTracksData, sortBy]);

  // Filter genres based on search
  const filteredGenres = useMemo(() => {
    return genreData.genres.filter(genre =>
      genre.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [genreData.genres, searchQuery]);

  const chartColors = [
    'hsl(142, 71%, 45%)', // Spotify green
    'hsl(217, 91%, 60%)', // Blue
    'hsl(262, 83%, 58%)', // Purple
    'hsl(25, 95%, 53%)',  // Orange
    'hsl(330, 81%, 60%)', // Pink
    'hsl(200, 98%, 39%)', // Cyan
    'hsl(31, 81%, 56%)',  // Amber
    'hsl(348, 83%, 47%)', // Red
  ];

  const selectedGenreData = useMemo(() => {
    if (!selectedGenre) return null;
    return genreData.genres.find(g => g.name === selectedGenre);
  }, [selectedGenre, genreData.genres]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Genre Explorer</h1>
          <p className="text-muted-foreground">Loading your musical genres...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Genre Explorer</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover and explore your musical genres
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short_term">Last 4 Weeks</SelectItem>
                <SelectItem value="medium_term">Last 6 Months</SelectItem>
                <SelectItem value="long_term">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="artists">Artists</SelectItem>
                <SelectItem value="tracks">Tracks</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-xs md:text-sm font-medium">Total Genres</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">{genreData.genres.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Top Genre</span>
            </div>
            <div className="text-sm md:text-base font-bold truncate">
              {genreData.genres[0]?.name || 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Artists</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">
              {topArtistsData?.items?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Diversity</span>
            </div>
            <div className="text-lg md:text-2xl font-bold">
              {genreData.genres.length > 10 ? 'High' : genreData.genres.length > 5 ? 'Medium' : 'Low'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Genre List */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Genres ({filteredGenres.length})</CardTitle>
              <CardDescription>
                Genres from your listening history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {filteredGenres.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Genres Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or time range.
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredGenres.map((genre, index) => (
                      <Card 
                        key={genre.name}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          selectedGenre === genre.name ? 'ring-2 ring-accent' : ''
                        )}
                        onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div 
                              className="w-full h-3 rounded-full"
                              style={{ backgroundColor: chartColors[index % chartColors.length] }}
                            />
                            <h3 className="font-medium text-sm truncate">{genre.name}</h3>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Artists:</span>
                                <span>{genre.artists.length}</span>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Tracks:</span>
                                <span>{genre.tracks.length}</span>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Share:</span>
                                <span>{genre.percentage}%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredGenres.map((genre, index) => (
                      <div
                        key={genre.name}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-accent/5",
                          selectedGenre === genre.name ? 'bg-accent/10 border border-accent/20' : 'bg-muted/20'
                        )}
                        onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
                      >
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: chartColors[index % chartColors.length] }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate">{genre.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {genre.percentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>{genre.artists.length} artists</span>
                            <span>{genre.tracks.length} tracks</span>
                            <span>Pop: {genre.avgPopularity}/100</span>
                          </div>
                          <Progress value={genre.percentage} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Chart and Details */}
        <div className="space-y-4">
          {/* Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {genreData.genres.length > 0 ? (
                <ChartContainer config={{}} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData.genres.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {genreData.genres.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {data.count} artists ({data.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No data to display
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Genre Details */}
          {selectedGenreData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  {selectedGenreData.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Statistics</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Share:</span>
                        <span className="font-medium text-accent">{selectedGenreData.percentage}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Artists:</span>
                        <span className="font-medium">{selectedGenreData.artists.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tracks:</span>
                        <span className="font-medium">{selectedGenreData.tracks.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Popularity:</span>
                        <span className="font-medium">{selectedGenreData.avgPopularity}/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Top Artists</h4>
                    <div className="space-y-1">
                      {selectedGenreData.artists.slice(0, 5).map((artist, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {artist}
                        </div>
                      ))}
                      {selectedGenreData.artists.length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          +{selectedGenreData.artists.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
