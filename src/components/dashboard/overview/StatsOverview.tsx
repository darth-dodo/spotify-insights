
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, Users, Heart, Trophy, Star } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

interface StatsOverviewProps {
  selectedCard: string | null;
  onCardSelect: (cardId: string | null) => void;
}

export const StatsOverview = ({ selectedCard, onCardSelect }: StatsOverviewProps) => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  
  const { data: topTracksData } = useTopTracks('medium_term', 10);
  const { data: topArtistsData } = useTopArtists('medium_term', 10);
  const { data: recentlyPlayedData } = useRecentlyPlayed(10);

  // Calculate stats from API data
  const calculateStats = () => {
    const totalTracks = topTracksData?.items?.length || 0;
    const totalArtists = topArtistsData?.items?.length || 0;
    const recentTracks = recentlyPlayedData?.items?.length || 0;
    const listeningTime = recentlyPlayedData?.items?.reduce((acc: number, item: any) => 
      acc + (item.track?.duration_ms || 0), 0) / (1000 * 60) || 0;
    
    return { 
      totalTracks, 
      totalArtists, 
      recentTracks,
      listeningTime: Math.round(listeningTime)
    };
  };

  const stats = calculateStats();

  const achievements = {
    level: Math.min(Math.floor(stats.totalTracks / 5) + 1, 50),
    streak: Math.min(stats.recentTracks, 30),
    totalListeningTime: Math.round(stats.listeningTime),
    artistsDiscovered: stats.totalArtists,
    songsLiked: stats.totalTracks
  };

  const statCards = [
    {
      id: 'streak',
      icon: Zap,
      label: 'Streak',
      value: achievements.streak,
      unit: 'recent plays',
      color: 'text-accent'
    },
    {
      id: 'time',
      icon: Clock,
      label: 'Time',
      value: `${achievements.totalListeningTime}m`,
      unit: 'listened',
      color: 'text-muted-foreground'
    },
    {
      id: 'discover',
      icon: Users,
      label: 'Artists',
      value: achievements.artistsDiscovered,
      unit: 'discovered',
      color: 'text-muted-foreground'
    },
    {
      id: 'likes',
      icon: Heart,
      label: 'Tracks',
      value: achievements.songsLiked,
      unit: 'in library',
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
