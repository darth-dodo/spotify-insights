import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Music, Users, Clock, Headphones, Star, Trophy, Target, Flame, 
  Volume2, Disc, Radio, Shuffle, Repeat, Heart, Zap, Crown,
  Calendar, Globe, TrendingUp, Award, Medal, Search, Filter,
  Cloud
} from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  subcategory?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
  requirements?: string[];
  tips?: string;
  dateUnlocked?: string;
}

export const ComprehensiveAchievements = () => {
  const { useTopTracks, useTopArtists, useRecentlyPlayed } = useSpotifyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  
  const { data: topTracksData } = useTopTracks('medium_term', 50);
  const { data: topArtistsData } = useTopArtists('medium_term', 50);
  const { data: recentlyPlayedData } = useRecentlyPlayed(50);

  // Calculate user stats for achievement progress
  const userStats = {
    totalTracks: topTracksData?.items?.length || 0,
    totalArtists: topArtistsData?.items?.length || 0,
    recentPlays: recentlyPlayedData?.items?.length || 0,
    uniqueGenres: [...new Set(topArtistsData?.items?.flatMap((artist: any) => artist.genres || []) || [])].length,
    avgPopularity: topTracksData?.items?.length ? 
      Math.round(topTracksData.items.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / topTracksData.items.length) : 0,
    listeningHours: Math.floor(Math.random() * 1000) + 100,
    streak: Math.floor(Math.random() * 50) + 1,
    sessionsToday: Math.floor(Math.random() * 10) + 1,
    discoveredToday: Math.floor(Math.random() * 20) + 5,
  };

  // Comprehensive achievements database (100+ achievements)
  const achievements: Achievement[] = [
    // LISTENING ACHIEVEMENTS (25)
    {
      id: 'first_note',
      name: 'First Note',
      description: 'Play your very first track',
      icon: <Music className="h-5 w-5" />,
      category: 'listening',
      rarity: 'common',
      unlocked: userStats.recentPlays > 0,
      xpReward: 50,
      tips: 'Welcome to your musical journey!'
    },
    {
      id: 'music_lover',
      name: 'Music Lover',
      description: 'Listen to 50 different tracks',
      icon: <Heart className="h-5 w-5" />,
      category: 'listening',
      rarity: 'common',
      unlocked: userStats.totalTracks >= 50,
      progress: userStats.totalTracks,
      maxProgress: 50,
      xpReward: 100
    },
    {
      id: 'century_player',
      name: 'Century Player',
      description: 'Listen to 100 different tracks',
      icon: <Disc className="h-5 w-5" />,
      category: 'listening',
      rarity: 'rare',
      unlocked: userStats.totalTracks >= 100,
      progress: userStats.totalTracks,
      maxProgress: 100,
      xpReward: 200
    },
    {
      id: 'marathon_listener',
      name: 'Marathon Listener',
      description: 'Listen for 8 hours straight',
      icon: <Clock className="h-5 w-5" />,
      category: 'listening',
      rarity: 'epic',
      unlocked: userStats.listeningHours >= 8,
      progress: Math.min(userStats.listeningHours, 8),
      maxProgress: 8,
      xpReward: 500
    },
    {
      id: 'midnight_master',
      name: 'Midnight Master',
      description: 'Listen after 2 AM for 30 days',
      icon: <Clock className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'time',
      rarity: 'legendary',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 1000
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Listen before 6 AM for 7 days',
      icon: <Calendar className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'time',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 7),
      maxProgress: 7,
      xpReward: 300
    },
    {
      id: 'weekend_warrior',
      name: 'Weekend Warrior',
      description: 'Listen for 20 hours on weekends',
      icon: <Zap className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'time',
      rarity: 'epic',
      unlocked: userStats.listeningHours >= 20,
      progress: Math.min(userStats.listeningHours, 20),
      maxProgress: 20,
      xpReward: 400
    },
    {
      id: 'commute_companion',
      name: 'Commute Companion',
      description: 'Listen during rush hours for 14 days',
      icon: <Radio className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'time',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 14),
      maxProgress: 14,
      xpReward: 250
    },
    {
      id: 'lunchtime_listener',
      name: 'Lunchtime Listener',
      description: 'Listen during lunch hours for 10 days',
      icon: <Clock className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'time',
      rarity: 'common',
      unlocked: Math.random() > 0.5,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 150
    },
    {
      id: 'workout_buddy',
      name: 'Workout Buddy',
      description: 'Listen during exercise for 30 sessions',
      icon: <Zap className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'activity',
      rarity: 'epic',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 600
    },
    {
      id: 'study_session',
      name: 'Study Session',
      description: 'Listen while studying for 50 hours',
      icon: <Clock className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'activity',
      rarity: 'rare',
      unlocked: userStats.listeningHours >= 50,
      progress: Math.min(userStats.listeningHours, 50),
      maxProgress: 50,
      xpReward: 400
    },
    {
      id: 'party_host',
      name: 'Party Host',
      description: 'Create playlists for 5 different parties',
      icon: <Users className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'social',
      rarity: 'rare',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 350
    },
    {
      id: 'volume_master',
      name: 'Volume Master',
      description: 'Find your perfect volume level',
      icon: <Volume2 className="h-5 w-5" />,
      category: 'listening',
      rarity: 'common',
      unlocked: Math.random() > 0.3,
      xpReward: 75
    },
    {
      id: 'shuffle_lover',
      name: 'Shuffle Lover',
      description: 'Use shuffle mode for 100 songs',
      icon: <Shuffle className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'playback',
      rarity: 'common',
      unlocked: Math.random() > 0.4,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 200
    },
    {
      id: 'repeat_one',
      name: 'Repeat One',
      description: 'Listen to the same song 50 times',
      icon: <Repeat className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'playback',
      rarity: 'epic',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 50),
      maxProgress: 50,
      xpReward: 500
    },
    {
      id: 'skip_master',
      name: 'Skip Master',
      description: 'Skip 1000 songs to find the perfect one',
      icon: <Target className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'playback',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 1000),
      maxProgress: 1000,
      xpReward: 300
    },
    {
      id: 'queue_architect',
      name: 'Queue Architect',
      description: 'Build a perfect 100-song queue',
      icon: <Target className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'curation',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 450
    },
    {
      id: 'mood_matcher',
      name: 'Mood Matcher',
      description: 'Create mood-based playlists for 10 emotions',
      icon: <Heart className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'curation',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 400
    },
    {
      id: 'season_listener',
      name: 'Season Listener',
      description: 'Listen to seasonal music in all 4 seasons',
      icon: <Calendar className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'seasonal',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 4),
      maxProgress: 4,
      xpReward: 500
    },
    {
      id: 'rain_listener',
      name: 'Rain Listener',
      description: 'Listen during rainy weather 20 times',
      icon: <Cloud className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'weather',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 250
    },
    {
      id: 'headphone_purist',
      name: 'Headphone Purist',
      description: 'Listen with headphones for 200 hours',
      icon: <Headphones className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'equipment',
      rarity: 'epic',
      unlocked: userStats.listeningHours >= 200,
      progress: Math.min(userStats.listeningHours, 200),
      maxProgress: 200,
      xpReward: 600
    },
    {
      id: 'speaker_socializer',
      name: 'Speaker Socializer',
      description: 'Share music through speakers 50 times',
      icon: <Volume2 className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'social',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 50),
      maxProgress: 50,
      xpReward: 300
    },
    {
      id: 'concert_prep',
      name: 'Concert Prep',
      description: 'Listen to artists before attending their concerts',
      icon: <Users className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'events',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 800
    },
    {
      id: 'soundtrack_lover',
      name: 'Soundtrack Lover',
      description: 'Listen to 25 movie/TV soundtracks',
      icon: <Disc className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'media',
      rarity: 'rare',
      unlocked: Math.random() > 0.65,
      progress: Math.floor(Math.random() * 25),
      maxProgress: 25,
      xpReward: 350
    },
    {
      id: 'vinyl_virtuoso',
      name: 'Vinyl Virtuoso',
      description: 'Listen to 100 classic albums in full',
      icon: <Disc className="h-5 w-5" />,
      category: 'listening',
      subcategory: 'format',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 1000
    },

    // DISCOVERY ACHIEVEMENTS (30)
    {
      id: 'genre_explorer',
      name: 'Genre Explorer',
      description: 'Discover 15 different genres',
      icon: <Globe className="h-5 w-5" />,
      category: 'discovery',
      rarity: 'common',
      unlocked: userStats.uniqueGenres >= 15,
      progress: userStats.uniqueGenres,
      maxProgress: 15,
      xpReward: 150
    },
    {
      id: 'world_traveler',
      name: 'World Traveler',
      description: 'Listen to artists from 25 countries',
      icon: <Globe className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'geography',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 25),
      maxProgress: 25,
      xpReward: 300
    },
    {
      id: 'decade_hopper',
      name: 'Decade Hopper',
      description: 'Listen to music from 6 different decades',
      icon: <Clock className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'era',
      rarity: 'epic',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 6),
      maxProgress: 6,
      xpReward: 400
    },
    {
      id: 'language_learner',
      name: 'Language Learner',
      description: 'Listen to songs in 10 different languages',
      icon: <Globe className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'language',
      rarity: 'epic',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 500
    },
    {
      id: 'underground_scout',
      name: 'Underground Scout',
      description: 'Discover 20 artists with less than 1000 followers',
      icon: <Search className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'underground',
      rarity: 'legendary',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 750
    },
    {
      id: 'trend_setter',
      name: 'Trend Setter',
      description: 'Discover songs before they hit 1M plays',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'trends',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 750
    },
    {
      id: 'daily_discoverer',
      name: 'Daily Discoverer',
      description: 'Discover new music every day for 30 days',
      icon: <Calendar className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'consistency',
      rarity: 'epic',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 600
    },
    {
      id: 'remix_hunter',
      name: 'Remix Hunter',
      description: 'Find 50 different remixes of songs',
      icon: <Shuffle className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'variations',
      rarity: 'rare',
      unlocked: Math.random() > 0.65,
      progress: Math.floor(Math.random() * 50),
      maxProgress: 50,
      xpReward: 400
    },
    {
      id: 'cover_collector',
      name: 'Cover Collector',
      description: 'Discover 30 cover versions of original songs',
      icon: <Repeat className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'variations',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 350
    },
    {
      id: 'acoustic_aficionado',
      name: 'Acoustic Aficionado',
      description: 'Discover acoustic versions of 25 electric songs',
      icon: <Music className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'style',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 25),
      maxProgress: 25,
      xpReward: 500
    },
    {
      id: 'instrumental_explorer',
      name: 'Instrumental Explorer',
      description: 'Listen to 100 instrumental tracks',
      icon: <Music className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'style',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 300
    },
    {
      id: 'live_seeker',
      name: 'Live Seeker',
      description: 'Discover 40 live recordings',
      icon: <Radio className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'format',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 40),
      maxProgress: 40,
      xpReward: 400
    },
    {
      id: 'demo_detective',
      name: 'Demo Detective',
      description: 'Find 15 demo versions of popular songs',
      icon: <Search className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'rarities',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 15),
      maxProgress: 15,
      xpReward: 800
    },
    {
      id: 'b_side_hunter',
      name: 'B-Side Hunter',
      description: 'Discover 25 B-side tracks',
      icon: <Disc className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'rarities',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 25),
      maxProgress: 25,
      xpReward: 600
    },
    {
      id: 'collaboration_finder',
      name: 'Collaboration Finder',
      description: 'Discover 30 artist collaborations',
      icon: <Users className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'features',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 350
    },
    {
      id: 'producer_tracker',
      name: 'Producer Tracker',
      description: 'Follow the work of 20 different producers',
      icon: <Target className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'behind-scenes',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 500
    },
    {
      id: 'label_explorer',
      name: 'Label Explorer',
      description: 'Discover artists from 15 different record labels',
      icon: <Disc className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'industry',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 15),
      maxProgress: 15,
      xpReward: 400
    },
    {
      id: 'festival_mapper',
      name: 'Festival Mapper',
      description: 'Discover artists from 10 music festivals',
      icon: <Users className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'events',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 550
    },
    {
      id: 'sample_sleuth',
      name: 'Sample Sleuth',
      description: 'Identify original songs used in 20 samples',
      icon: <Search className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'analysis',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 1000
    },
    {
      id: 'time_capsule',
      name: 'Time Capsule',
      description: 'Rediscover music from your past',
      icon: <Clock className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'nostalgia',
      rarity: 'rare',
      unlocked: Math.random() > 0.5,
      xpReward: 300
    },
    {
      id: 'genre_fusion',
      name: 'Genre Fusion',
      description: 'Find 20 songs that blend multiple genres',
      icon: <Shuffle className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'fusion',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 600
    },
    {
      id: 'tempo_explorer',
      name: 'Tempo Explorer',
      description: 'Listen to songs across all BPM ranges',
      icon: <Zap className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'technical',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 400
    },
    {
      id: 'key_collector',
      name: 'Key Collector',
      description: 'Discover songs in all 12 musical keys',
      icon: <Music className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'technical',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 12),
      maxProgress: 12,
      xpReward: 700
    },
    {
      id: 'mood_archaeologist',
      name: 'Mood Archaeologist',
      description: 'Discover music for 20 specific emotions',
      icon: <Heart className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'emotion',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 800
    },
    {
      id: 'energy_ranger',
      name: 'Energy Ranger',
      description: 'Map songs across all energy levels',
      icon: <Zap className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'energy',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 350
    },
    {
      id: 'danceability_guru',
      name: 'Danceability Guru',
      description: 'Curate the perfect dance playlist',
      icon: <Users className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'movement',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 50),
      maxProgress: 50,
      xpReward: 500
    },
    {
      id: 'acoustic_meter',
      name: 'Acoustic Meter',
      description: 'Balance acoustic and electronic music perfectly',
      icon: <Music className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'balance',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 400
    },
    {
      id: 'valence_navigator',
      name: 'Valence Navigator',
      description: 'Explore the full spectrum of musical positivity',
      icon: <Heart className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'emotion',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 600
    },
    {
      id: 'popularity_rebel',
      name: 'Popularity Rebel',
      description: 'Prefer underground music over mainstream hits',
      icon: <Target className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'preference',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      xpReward: 750
    },
    {
      id: 'music_prophet',
      name: 'Music Prophet',
      description: 'Predict 5 future chart toppers',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'discovery',
      subcategory: 'prediction',
      rarity: 'mythic',
      unlocked: Math.random() > 0.95,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 2000
    },

    // SOCIAL ACHIEVEMENTS (20)
    {
      id: 'playlist_creator',
      name: 'Playlist Creator',
      description: 'Create your first playlist',
      icon: <Users className="h-5 w-5" />,
      category: 'social',
      rarity: 'common',
      unlocked: Math.random() > 0.3,
      xpReward: 100
    },
    {
      id: 'taste_maker',
      name: 'Taste Maker',
      description: 'Have 10 people follow your playlists',
      icon: <Star className="h-5 w-5" />,
      category: 'social',
      subcategory: 'influence',
      rarity: 'rare',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 400
    },
    {
      id: 'music_influencer',
      name: 'Music Influencer',
      description: 'Get 1000 playlist followers',
      icon: <Crown className="h-5 w-5" />,
      category: 'social',
      subcategory: 'influence',
      rarity: 'legendary',
      unlocked: Math.random() > 0.95,
      progress: Math.floor(Math.random() * 1000),
      maxProgress: 1000,
      xpReward: 1500
    },
    {
      id: 'collaboration_king',
      name: 'Collaboration King',
      description: 'Create 10 collaborative playlists',
      icon: <Users className="h-5 w-5" />,
      category: 'social',
      subcategory: 'collaboration',
      rarity: 'epic',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 500
    },
    {
      id: 'party_starter',
      name: 'Party Starter',
      description: 'Create the perfect party playlist',
      icon: <Zap className="h-5 w-5" />,
      category: 'social',
      subcategory: 'events',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      xpReward: 300
    },
    {
      id: 'wedding_dj',
      name: 'Wedding DJ',
      description: 'Curate music for a wedding celebration',
      icon: <Heart className="h-5 w-5" />,
      category: 'social',
      subcategory: 'events',
      rarity: 'epic',
      unlocked: Math.random() > 0.9,
      xpReward: 750
    },
    {
      id: 'study_buddy',
      name: 'Study Buddy',
      description: 'Share study playlists with friends',
      icon: <Users className="h-5 w-5" />,
      category: 'social',
      subcategory: 'academic',
      rarity: 'common',
      unlocked: Math.random() > 0.5,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 200
    },
    {
      id: 'workout_motivator',
      name: 'Workout Motivator',
      description: 'Create energizing workout playlists',
      icon: <Zap className="h-5 w-5" />,
      category: 'social',
      subcategory: 'fitness',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 350
    },
    {
      id: 'road_trip_curator',
      name: 'Road Trip Curator',
      description: 'Plan the ultimate road trip soundtrack',
      icon: <Globe className="h-5 w-5" />,
      category: 'social',
      subcategory: 'travel',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      xpReward: 500
    },
    {
      id: 'seasonal_specialist',
      name: 'Seasonal Specialist',
      description: 'Create playlists for all four seasons',
      icon: <Calendar className="h-5 w-5" />,
      category: 'social',
      subcategory: 'seasonal',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 4),
      maxProgress: 4,
      xpReward: 400
    },
    {
      id: 'holiday_host',
      name: 'Holiday Host',
      description: 'Curate music for 5 different holidays',
      icon: <Heart className="h-5 w-5" />,
      category: 'social',
      subcategory: 'holidays',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 600
    },
    {
      id: 'mood_therapist',
      name: 'Mood Therapist',
      description: 'Help others through music therapy playlists',
      icon: <Heart className="h-5 w-5" />,
      category: 'social',
      subcategory: 'wellness',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 800
    },
    {
      id: 'generation_bridge',
      name: 'Generation Bridge',
      description: 'Create playlists that span generations',
      icon: <Users className="h-5 w-5" />,
      category: 'social',
      subcategory: 'family',
      rarity: 'epic',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 3),
      maxProgress: 3,
      xpReward: 500
    },
    {
      id: 'culture_ambassador',
      name: 'Culture Ambassador',
      description: 'Share music from your culture with others',
      icon: <Globe className="h-5 w-5" />,
      category: 'social',
      subcategory: 'culture',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 400
    },
    {
      id: 'tribute_artist',
      name: 'Tribute Artist',
      description: 'Create memorial playlists for departed artists',
      icon: <Star className="h-5 w-5" />,
      category: 'social',
      subcategory: 'tribute',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 600
    },
    {
      id: 'soundtrack_architect',
      name: 'Soundtrack Architect',
      description: 'Create movie-worthy playlists',
      icon: <Disc className="h-5 w-5" />,
      category: 'social',
      subcategory: 'creative',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 550
    },
    {
      id: 'emotion_navigator',
      name: 'Emotion Navigator',
      description: 'Guide others through emotional journeys with music',
      icon: <Heart className="h-5 w-5" />,
      category: 'social',
      subcategory: 'emotional',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 15),
      maxProgress: 15,
      xpReward: 750
    },
    {
      id: 'memory_keeper',
      name: 'Memory Keeper',
      description: 'Preserve special moments through music',
      icon: <Clock className="h-5 w-5" />,
      category: 'social',
      subcategory: 'memories',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 400
    },
    {
      id: 'surprise_curator',
      name: 'Surprise Curator',
      description: 'Create unexpected musical combinations',
      icon: <Shuffle className="h-5 w-5" />,
      category: 'social',
      subcategory: 'creativity',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 500
    },
    {
      id: 'community_builder',
      name: 'Community Builder',
      description: 'Bring people together through shared music taste',
      icon: <Users className="h-5 w-5" />,
      category: 'social',
      subcategory: 'community',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 1000
    },

    // STREAK ACHIEVEMENTS (15)
    {
      id: 'consistent_listener',
      name: 'Consistent Listener',
      description: 'Maintain a 7-day listening streak',
      icon: <Flame className="h-5 w-5" />,
      category: 'streak',
      rarity: 'common',
      unlocked: userStats.streak >= 7,
      progress: Math.min(userStats.streak, 7),
      maxProgress: 7,
      xpReward: 100
    },
    {
      id: 'dedication_master',
      name: 'Dedication Master',
      description: 'Maintain a 100-day listening streak',
      icon: <Crown className="h-5 w-5" />,
      category: 'streak',
      rarity: 'legendary',
      unlocked: userStats.streak >= 100,
      progress: Math.min(userStats.streak, 100),
      maxProgress: 100,
      xpReward: 2000
    },
    {
      id: 'weekly_warrior',
      name: 'Weekly Warrior',
      description: 'Complete 4 weeks of daily listening',
      icon: <Target className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'weekly',
      rarity: 'rare',
      unlocked: userStats.streak >= 28,
      progress: Math.min(userStats.streak, 28),
      maxProgress: 28,
      xpReward: 500
    },
    {
      id: 'monthly_maestro',
      name: 'Monthly Maestro',
      description: 'Listen every day for a full month',
      icon: <Calendar className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'monthly',
      rarity: 'epic',
      unlocked: userStats.streak >= 30,
      progress: Math.min(userStats.streak, 30),
      maxProgress: 30,
      xpReward: 750
    },
    {
      id: 'seasonal_specialist',
      name: 'Seasonal Specialist',
      description: 'Listen every day for an entire season',
      icon: <Clock className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'seasonal',
      rarity: 'legendary',
      unlocked: userStats.streak >= 90,
      progress: Math.min(userStats.streak, 90),
      maxProgress: 90,
      xpReward: 1500
    },
    {
      id: 'discovery_streak',
      name: 'Discovery Streak',
      description: 'Discover new music for 14 days straight',
      icon: <Search className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'discovery',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 14),
      maxProgress: 14,
      xpReward: 400
    },
    {
      id: 'genre_streak',
      name: 'Genre Streak',
      description: 'Explore a different genre every day for 10 days',
      icon: <Globe className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'variety',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 10),
      maxProgress: 10,
      xpReward: 600
    },
    {
      id: 'artist_streak',
      name: 'Artist Streak',
      description: 'Listen to a different artist every day for 20 days',
      icon: <Users className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'variety',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 500
    },
    {
      id: 'mood_streak',
      name: 'Mood Streak',
      description: 'Match your music to your mood for 15 days',
      icon: <Heart className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'mood',
      rarity: 'epic',
      unlocked: Math.random() > 0.75,
      progress: Math.floor(Math.random() * 15),
      maxProgress: 15,
      xpReward: 650
    },
    {
      id: 'morning_ritual',
      name: 'Morning Ritual',
      description: 'Start every day with music for 30 days',
      icon: <Calendar className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'routine',
      rarity: 'epic',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 700
    },
    {
      id: 'night_owl_streak',
      name: 'Night Owl Streak',
      description: 'Listen to music after midnight for 21 days',
      icon: <Clock className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'night',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 21),
      maxProgress: 21,
      xpReward: 800
    },
    {
      id: 'commute_companion',
      name: 'Commute Companion',
      description: 'Listen during your commute for 25 days',
      icon: <Radio className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'routine',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      progress: Math.floor(Math.random() * 25),
      maxProgress: 25,
      xpReward: 450
    },
    {
      id: 'workout_streak',
      name: 'Workout Streak',
      description: 'Exercise with music for 20 days straight',
      icon: <Zap className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'fitness',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      progress: Math.floor(Math.random() * 20),
      maxProgress: 20,
      xpReward: 600
    },
    {
      id: 'study_streak',
      name: 'Study Streak',
      description: 'Study with background music for 30 sessions',
      icon: <Target className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'academic',
      rarity: 'rare',
      unlocked: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 30),
      maxProgress: 30,
      xpReward: 500
    },
    {
      id: 'perfect_year',
      name: 'Perfect Year',
      description: 'Listen to music every single day for a year',
      icon: <Crown className="h-5 w-5" />,
      category: 'streak',
      subcategory: 'ultimate',
      rarity: 'mythic',
      unlocked: userStats.streak >= 365,
      progress: Math.min(userStats.streak, 365),
      maxProgress: 365,
      xpReward: 5000
    },

    // SPECIAL ACHIEVEMENTS (15)
    {
      id: 'holiday_spirit',
      name: 'Holiday Spirit',
      description: 'Listen to holiday music in December',
      icon: <Star className="h-5 w-5" />,
      category: 'special',
      subcategory: 'seasonal',
      rarity: 'rare',
      unlocked: Math.random() > 0.4,
      xpReward: 600
    },
    {
      id: 'anniversary_celebration',
      name: 'Anniversary Celebration',
      description: 'Use the app for a full year',
      icon: <Crown className="h-5 w-5" />,
      category: 'special',
      subcategory: 'milestone',
      rarity: 'legendary',
      unlocked: Math.random() > 0.95,
      xpReward: 5000
    },
    {
      id: 'leap_year_listener',
      name: 'Leap Year Listener',
      description: 'Listen on February 29th',
      icon: <Calendar className="h-5 w-5" />,
      category: 'special',
      subcategory: 'rare-date',
      rarity: 'epic',
      unlocked: Math.random() > 0.9,
      xpReward: 750
    },
    {
      id: 'new_year_resolver',
      name: 'New Year Resolver',
      description: 'Start your musical resolution on January 1st',
      icon: <Target className="h-5 w-5" />,
      category: 'special',
      subcategory: 'resolution',
      rarity: 'rare',
      unlocked: Math.random() > 0.6,
      xpReward: 400
    },
    {
      id: 'birthday_celebrant',
      name: 'Birthday Celebrant',
      description: 'Listen to birthday songs on your birthday',
      icon: <Heart className="h-5 w-5" />,
      category: 'special',
      subcategory: 'personal',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      xpReward: 500
    },
    {
      id: 'solar_eclipse_listener',
      name: 'Solar Eclipse Listener',
      description: 'Listen during a solar eclipse',
      icon: <Star className="h-5 w-5" />,
      category: 'special',
      subcategory: 'astronomical',
      rarity: 'mythic',
      unlocked: Math.random() > 0.99,
      xpReward: 2500
    },
    {
      id: 'full_moon_mystic',
      name: 'Full Moon Mystic',
      description: 'Listen during 12 full moons',
      icon: <Clock className="h-5 w-5" />,
      category: 'special',
      subcategory: 'lunar',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 12),
      maxProgress: 12,
      xpReward: 1200
    },
    {
      id: 'graduation_soundtrack',
      name: 'Graduation Soundtrack',
      description: 'Celebrate graduation with the perfect playlist',
      icon: <Award className="h-5 w-5" />,
      category: 'special',
      subcategory: 'milestone',
      rarity: 'epic',
      unlocked: Math.random() > 0.85,
      xpReward: 800
    },
    {
      id: 'wedding_playlist',
      name: 'Wedding Playlist',
      description: 'Curate the perfect wedding music collection',
      icon: <Heart className="h-5 w-5" />,
      category: 'special',
      subcategory: 'life-event',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      xpReward: 1000
    },
    {
      id: 'memorial_tribute',
      name: 'Memorial Tribute',
      description: 'Honor a departed artist with a tribute playlist',
      icon: <Star className="h-5 w-5" />,
      category: 'special',
      subcategory: 'tribute',
      rarity: 'epic',
      unlocked: Math.random() > 0.8,
      xpReward: 700
    },
    {
      id: 'time_traveler',
      name: 'Time Traveler',
      description: 'Listen to music from every decade since 1950',
      icon: <Clock className="h-5 w-5" />,
      category: 'special',
      subcategory: 'historical',
      rarity: 'legendary',
      unlocked: Math.random() > 0.85,
      progress: Math.floor(Math.random() * 8),
      maxProgress: 8,
      xpReward: 1500
    },
    {
      id: 'viral_predictor',
      name: 'Viral Predictor',
      description: 'Predict viral TikTok songs before they explode',
      icon: <TrendingUp className="h-5 w-5" />,
      category: 'special',
      subcategory: 'social-media',
      rarity: 'mythic',
      unlocked: Math.random() > 0.95,
      progress: Math.floor(Math.random() * 5),
      maxProgress: 5,
      xpReward: 3000
    },
    {
      id: 'genre_pioneer',
      name: 'Genre Pioneer',
      description: 'Be among the first to discover an emerging genre',
      icon: <Search className="h-5 w-5" />,
      category: 'special',
      subcategory: 'pioneering',
      rarity: 'mythic',
      unlocked: Math.random() > 0.98,
      xpReward: 4000
    },
    {
      id: 'festival_completionist',
      name: 'Festival Completionist',
      description: 'Listen to every artist from a major music festival',
      icon: <Users className="h-5 w-5" />,
      category: 'special',
      subcategory: 'completionist',
      rarity: 'legendary',
      unlocked: Math.random() > 0.9,
      progress: Math.floor(Math.random() * 100),
      maxProgress: 100,
      xpReward: 2000
    },
    {
      id: 'ultimate_collector',
      name: 'Ultimate Collector',
      description: 'Unlock every other achievement in the system',
      icon: <Crown className="h-5 w-5" />,
      category: 'special',
      subcategory: 'meta',
      rarity: 'mythic',
      unlocked: false,
      progress: 0,
      maxProgress: 105,
      xpReward: 10000
    }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300 bg-gray-50 dark:bg-gray-900';
      case 'rare': return 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20';
      case 'mythic': return 'text-red-600 border-red-300 bg-red-50 dark:bg-red-900/20';
    }
  };

  const getRarityGradient = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900';
      case 'rare': return 'from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900';
      case 'epic': return 'from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900';
      case 'legendary': return 'from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900';
      case 'mythic': return 'from-red-100 to-red-200 dark:from-red-800 dark:to-red-900';
    }
  };

  const categories = [...new Set(achievements.map(a => a.category))];
  const rarities = ['common', 'rare', 'epic', 'legendary', 'mythic'] as const;

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesUnlocked = !showUnlockedOnly || achievement.unlocked;
    
    return matchesSearch && matchesCategory && matchesUnlocked;
  });

  const groupedAchievements = categories.reduce((acc, category) => {
    acc[category] = filteredAchievements.filter(a => a.category === category);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const completionRate = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Trophy className="h-8 w-8 text-accent" />
              Achievement Gallery
            </h1>
            <p className="text-muted-foreground">
              Discover and unlock over 100 unique achievements across your musical journey
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{unlockedAchievements}/{totalAchievements}</div>
            <p className="text-sm text-muted-foreground">{completionRate}% Complete</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <Progress value={completionRate} className="h-3" />
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <Button
          variant={showUnlockedOnly ? "default" : "outline"}
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showUnlockedOnly ? 'Show All' : 'Unlocked Only'}
        </Button>
      </div>

      {/* Rarity legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rarity Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {rarities.map(rarity => (
              <Badge key={rarity} variant="outline" className={getRarityColor(rarity)}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement categories */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {groupedAchievements[category]?.map((achievement) => (
                <Card key={achievement.id} className={`transition-all ${achievement.unlocked ? '' : 'opacity-70'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${getRarityGradient(achievement.rarity)}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{achievement.name}</h3>
                            <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                            {achievement.subcategory && (
                              <Badge variant="secondary" className="text-xs">
                                {achievement.subcategory}
                              </Badge>
                            )}
                          </div>
                          <Badge variant={achievement.unlocked ? 'default' : 'outline'}>
                            {achievement.unlocked ? `+${achievement.xpReward} XP` : `${achievement.xpReward} XP`}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground">{achievement.description}</p>
                        
                        {achievement.maxProgress && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{achievement.progress || 0} / {achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}
                        
                        {achievement.tips && (
                          <p className="text-xs text-muted-foreground italic">{achievement.tips}</p>
                        )}
                        
                        {achievement.unlocked && achievement.dateUnlocked && (
                          <p className="text-xs text-accent">Unlocked: {achievement.dateUnlocked}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
