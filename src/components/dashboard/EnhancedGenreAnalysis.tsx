
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Music, TrendingUp, Star, Shuffle, Calendar, Users, Clock, Award } from 'lucide-react';

export const EnhancedGenreAnalysis = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState('all');

  // Enhanced genre data with more details
  const genreData = [
    { 
      name: 'Rock', 
      value: 35, 
      color: '#FF6B6B', 
      tracks: 245, 
      artists: 45, 
      hours: 87,
      avgRating: 4.6,
      topArtist: 'Led Zeppelin',
      recentGrowth: '+12%',
      peakHours: '8-10 PM',
      avgTrackLength: '4:23'
    },
    { 
      name: 'Pop', 
      value: 28, 
      color: '#4ECDC4', 
      tracks: 196, 
      artists: 38, 
      hours: 72,
      avgRating: 4.2,
      topArtist: 'Taylor Swift',
      recentGrowth: '+8%',
      peakHours: '2-4 PM',
      avgTrackLength: '3:45'
    },
    { 
      name: 'Electronic', 
      value: 18, 
      color: '#45B7D1', 
      tracks: 126, 
      artists: 28, 
      hours: 45,
      avgRating: 4.4,
      topArtist: 'Daft Punk',
      recentGrowth: '+15%',
      peakHours: '11 PM-1 AM',
      avgTrackLength: '5:12'
    },
    { 
      name: 'Hip Hop', 
      value: 12, 
      color: '#96CEB4', 
      tracks: 84, 
      artists: 22, 
      hours: 31,
      avgRating: 4.3,
      topArtist: 'Kendrick Lamar',
      recentGrowth: '+5%',
      peakHours: '6-8 PM',
      avgTrackLength: '3:58'
    },
    { 
      name: 'Jazz', 
      value: 7, 
      color: '#FFEAA7', 
      tracks: 49, 
      artists: 15, 
      hours: 18,
      avgRating: 4.8,
      topArtist: 'Miles Davis',
      recentGrowth: '+3%',
      peakHours: '10 AM-12 PM',
      avgTrackLength: '6:34'
    },
  ];

  const moodData = [
    { mood: 'Energetic', value: 85, genres: ['Electronic', 'Rock'] },
    { mood: 'Relaxed', value: 65, genres: ['Jazz', 'Ambient'] },
    { mood: 'Melancholic', value: 45, genres: ['Indie', 'Alternative'] },
    { mood: 'Upbeat', value: 78, genres: ['Pop', 'Dance'] },
    { mood: 'Aggressive', value: 32, genres: ['Metal', 'Punk'] },
    { mood: 'Romantic', value: 58, genres: ['R&B', 'Soul'] },
  ];

  const genreEvolution = [
    { month: 'Jan', Rock: 30, Pop: 25, Electronic: 20, 'Hip Hop': 15, Jazz: 10 },
    { month: 'Feb', Rock: 32, Pop: 26, Electronic: 18, 'Hip Hop': 14, Jazz: 10 },
    { month: 'Mar', Rock: 34, Pop: 27, Electronic: 19, 'Hip Hop': 13, Jazz: 7 },
    { month: 'Apr', Rock: 35, Pop: 28, Electronic: 18, 'Hip Hop': 12, Jazz: 7 },
  ];

  const chartConfig = {
    value: { label: "Percentage", color: "hsl(var(--accent))" },
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Genre Deep Dive</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your musical taste evolution and patterns
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">5</div>
            <p className="text-xs text-muted-foreground">Active Genres</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">4.5★</div>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">148</div>
            <p className="text-xs text-muted-foreground">Total Artists</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">78%</div>
            <p className="text-xs text-muted-foreground">Diversity Score</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
          <TabsTrigger value="details">Detailed Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Genre Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Genre Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        onMouseEnter={(data) => setSelectedGenre(data.name)}
                        onMouseLeave={() => setSelectedGenre(null)}
                      >
                        {genreData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke={selectedGenre === entry.name ? 'hsl(var(--accent))' : 'transparent'}
                            strokeWidth={selectedGenre === entry.name ? 3 : 0}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Mood Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Mood Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={moodData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="mood" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Mood"
                        dataKey="value"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Genre Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {genreData.map((genre, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedGenre === genre.name ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => setSelectedGenre(selectedGenre === genre.name ? null : genre.name)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {genre.name}
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold" style={{ color: genre.color }}>
                    {genre.value}%
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium">{genre.avgRating}★</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Growth</span>
                      <span className="font-medium text-green-600">{genre.recentGrowth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Peak</span>
                      <span className="font-medium">{genre.peakHours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Genre Evolution Over Time
              </CardTitle>
              <CardDescription>
                How your musical preferences have changed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="Rock" fill="#FF6B6B" />
                    <Bar dataKey="Pop" fill="#4ECDC4" />
                    <Bar dataKey="Electronic" fill="#45B7D1" />
                    <Bar dataKey="Hip Hop" fill="#96CEB4" />
                    <Bar dataKey="Jazz" fill="#FFEAA7" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodData.map((mood, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{mood.mood}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-accent">{mood.value}%</div>
                    <Progress value={mood.value} className="flex-1" />
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {mood.genres.map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedGenre && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedGenre} Deep Dive</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const genre = genreData.find(g => g.name === selectedGenre);
                  if (!genre) return null;
                  
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-lg font-bold">{genre.avgTrackLength}</div>
                        <div className="text-xs text-muted-foreground">Avg Track Length</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-lg font-bold">{genre.topArtist}</div>
                        <div className="text-xs text-muted-foreground">Top Artist</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-lg font-bold">{genre.peakHours}</div>
                        <div className="text-xs text-muted-foreground">Peak Hours</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Award className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-lg font-bold">{genre.avgRating}★</div>
                        <div className="text-xs text-muted-foreground">Avg Rating</div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
