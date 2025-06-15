
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Users, Heart, Trophy, Star } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';
import { InfoButton } from '@/components/ui/InfoButton';

interface StatsOverviewProps {
  selectedCard: string | null;
  onCardSelect: (cardId: string | null) => void;
}

export const StatsOverview = ({ selectedCard, onCardSelect }: StatsOverviewProps) => {
  const { tracks, artists, recentlyPlayed, getStats, isLoading } = useExtendedSpotifyDataStore();

  const stats = getStats();

  // Calculate enhanced stats from the limited dataset (capped at 2000 for performance)
  const calculateEnhancedStats = () => {
    const totalTracks = tracks.length;
    const totalArtists = artists.length;
    const recentTracks = recentlyPlayed.length;
    const listeningTime = recentlyPlayed.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60);
    
    return { 
      totalTracks, 
      totalArtists, 
      recentTracks,
      listeningTime: Math.round(listeningTime),
      uniqueGenres: stats?.uniqueGenres || 0,
      avgPopularity: stats?.avgPopularity || 0
    };
  };

  const enhancedStats = calculateEnhancedStats();

  const achievements = {
    level: Math.min(Math.floor(enhancedStats.totalTracks / 20) + 1, 50),
    streak: Math.min(enhancedStats.recentTracks, 30),
    totalListeningTime: enhancedStats.listeningTime,
    artistsDiscovered: enhancedStats.totalArtists,
    songsLiked: enhancedStats.totalTracks
  };

  // Check if we have any data at all
  const hasData = stats?.hasSpotifyData && (enhancedStats.totalTracks > 0 || enhancedStats.totalArtists > 0);

  const statCards = [
    {
      id: 'streak',
      icon: Zap,
      label: 'Library Size',
      value: hasData ? achievements.songsLiked : 'No data',
      unit: hasData ? 'tracks total' : 'available',
      color: 'text-accent',
      infoButton: (
        <InfoButton
          title="Library Size Analysis"
          description="Total number of unique tracks in your limited dataset, capped at 2000 for optimal performance."
          calculation="Counts all unique songs in your limited Spotify dataset. Higher numbers indicate extensive music exploration and diverse listening habits."
          funFacts={[
            "The average music fan has 200-500 songs in regular rotation",
            "Your library size directly affects recommendation quality",
            "We cap analysis at 2000 tracks for smooth app performance",
            "Large libraries suggest adventurous music discovery habits"
          ]}
          metrics={[
            { label: "Your Tracks", value: `${enhancedStats.totalTracks}`, description: "In your limited dataset" },
            { label: "Performance Cap", value: "2000", description: "Maximum for optimization" }
          ]}
        />
      )
    },
    {
      id: 'time',
      icon: Clock,
      label: 'Time',
      value: hasData ? `${achievements.totalListeningTime}m` : 'No data',
      unit: hasData ? 'recent listening' : 'available',
      color: 'text-muted-foreground',
      infoButton: (
        <InfoButton
          title="Listening Time Analysis"
          description="Your recent music listening activity measured in minutes from available data."
          calculation="Calculated from your recent listening sessions and track durations. Shows current engagement with music across different time periods."
          funFacts={[
            "The average person listens to 2-4 hours of music daily",
            "Music listening often peaks during commutes and work",
            "Recent activity indicates current music engagement levels",
            "Time metrics help understand listening pattern changes"
          ]}
          metrics={[
            { label: "Recent Minutes", value: `${achievements.totalListeningTime}`, description: "From recent activity" },
            { label: "Recent Tracks", value: `${enhancedStats.recentTracks}`, description: "Songs played recently" }
          ]}
        />
      )
    },
    {
      id: 'discover',
      icon: Users,
      label: 'Artists',
      value: hasData ? achievements.artistsDiscovered : 'No data',
      unit: hasData ? 'in library' : 'available',
      color: 'text-muted-foreground',
      infoButton: (
        <InfoButton
          title="Artist Discovery Analysis"
          description="Number of unique artists in your limited dataset, showing the breadth of your musical exploration."
          calculation="Counts all unique artists from your limited dataset (capped at 2000 for performance). Includes primary artists, featured artists, and collaborators from your listening history."
          funFacts={[
            "Diverse artist libraries often predict musical openness",
            "The typical listener follows 50-150 artists regularly",
            "Supporting many artists helps fund the music ecosystem",
            "Artist count is limited to 2000 for app performance"
          ]}
          metrics={[
            { label: "Your Artists", value: `${enhancedStats.totalArtists}`, description: "In your limited library" },
            { label: "Performance Cap", value: "2000", description: "Maximum for optimization" }
          ]}
        />
      )
    },
    {
      id: 'likes',
      icon: Heart,
      label: 'Diversity',
      value: hasData ? enhancedStats.uniqueGenres : 'No data',
      unit: hasData ? 'genres explored' : 'available',
      color: 'text-muted-foreground',
      infoButton: (
        <InfoButton
          title="Musical Diversity Analysis"
          description="Number of unique genres you explore, indicating the breadth of your musical taste from the limited dataset."
          calculation="Calculated from all artist genres in your limited library. Higher numbers suggest eclectic taste and willingness to explore different musical styles and cultures."
          funFacts={[
            "Most people stick to 3-7 genres throughout their lives",
            "Genre diversity often correlates with personality openness",
            "Exploring diverse genres can enhance cognitive flexibility",
            "Analysis based on up to 2000 artists for performance"
          ]}
          metrics={[
            { label: "Your Genres", value: `${enhancedStats.uniqueGenres}`, description: "Unique styles explored" },
            { label: "Diversity Level", value: enhancedStats.uniqueGenres >= 10 ? 'High' : enhancedStats.uniqueGenres >= 5 ? 'Medium' : 'Focused', description: "Musical exploration range" }
          ]}
        />
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          
          return (
            <Card key={card.id} className="animate-pulse">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <span className="text-xs md:text-sm font-medium">{card.label}</span>
                  {card.infoButton}
                </div>
                <div className="text-lg md:text-2xl font-bold text-muted-foreground">
                  Loading...
                </div>
                <p className="text-xs text-muted-foreground">Please wait</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedCard === card.id;
        
        return (
          <Card 
            key={card.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? 'ring-2 ring-accent bg-accent/5' : ''
            }`}
            onClick={() => onCardSelect(isSelected ? null : card.id)}
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 md:h-5 md:w-5 ${card.color}`} />
                <span className="text-xs md:text-sm font-medium">{card.label}</span>
                {card.infoButton}
              </div>
              <div className={`text-lg md:text-2xl font-bold ${card.id === 'streak' && hasData ? 'text-accent' : hasData ? '' : 'text-muted-foreground'}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.unit}</p>
              {!hasData && (
                <p className="text-xs text-muted-foreground mt-1">
                  Limited dataset (max 2000 items)
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
