
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Users, Heart, Trophy, Star } from 'lucide-react';
import { useExtendedSpotifyDataStore } from '@/hooks/useExtendedSpotifyDataStore';

interface StatsOverviewProps {
  selectedCard: string | null;
  onCardSelect: (cardId: string | null) => void;
}

export const StatsOverview = ({ selectedCard, onCardSelect }: StatsOverviewProps) => {
  const { tracks, artists, recentlyPlayed, getStats } = useExtendedSpotifyDataStore();

  const stats = getStats();

  // Calculate enhanced stats from the extended dataset
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

  const statCards = [
    {
      id: 'streak',
      icon: Zap,
      label: 'Library Size',
      value: achievements.songsLiked,
      unit: 'tracks total',
      color: 'text-accent'
    },
    {
      id: 'time',
      icon: Clock,
      label: 'Time',
      value: `${achievements.totalListeningTime}m`,
      unit: 'recent listening',
      color: 'text-muted-foreground'
    },
    {
      id: 'discover',
      icon: Users,
      label: 'Artists',
      value: achievements.artistsDiscovered,
      unit: 'in library',
      color: 'text-muted-foreground'
    },
    {
      id: 'likes',
      icon: Heart,
      label: 'Diversity',
      value: enhancedStats.uniqueGenres,
      unit: 'genres explored',
      color: 'text-muted-foreground'
    }
  ];

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
              </div>
              <div className={`text-lg md:text-2xl font-bold ${card.id === 'streak' ? 'text-accent' : ''}`}>
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.unit}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
