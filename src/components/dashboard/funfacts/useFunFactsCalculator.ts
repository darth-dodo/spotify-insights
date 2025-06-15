
import { useMemo } from 'react';
import { Clock, Music, Users, Star, BarChart3, Heart, Zap, Disc } from 'lucide-react';
import { FunFact } from './types';

export const useFunFactsCalculator = (topTracksData: any, topArtistsData: any, timeRange: string): FunFact[] => {
  return useMemo(() => {
    if (!topTracksData?.items || !topArtistsData?.items) return [];

    const tracks = topTracksData.items;
    const artists = topArtistsData.items;

    // Total listening time with proper type checking
    const totalDurationMs = tracks.reduce((sum: number, track: any) => {
      const duration = track.duration_ms;
      if (typeof duration === 'number' && duration > 0) {
        return sum + duration;
      }
      return sum;
    }, 0);
    const totalHours = Math.round(totalDurationMs / (1000 * 60 * 60));
    const totalDays = Math.round(totalHours / 24);

    // Genre analysis
    const allGenres = artists.flatMap((artist: any) => artist.genres || []);
    const uniqueGenres = [...new Set(allGenres)];
    const genreCounts = allGenres.reduce((acc: Record<string, number>, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    const topGenre = Object.entries(genreCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0];

    // Artist diversity with proper type checking
    const uniqueArtists = [...new Set(tracks.flatMap((track: any) => track.artists?.map((a: any) => a.id) || []))];
    const artistCounts = tracks.reduce((acc: Record<string, number>, track: any) => {
      track.artists?.forEach((artist: any) => {
        const currentCount = acc[artist.id] || 0;
        acc[artist.id] = currentCount + 1;
      });
      return acc;
    }, {});

    // Popularity analysis with proper type checking
    const validPopularityTracks = tracks.filter((track: any) => typeof track.popularity === 'number');
    const avgPopularity = validPopularityTracks.length > 0 
      ? Math.round(validPopularityTracks.reduce((sum: number, track: any) => sum + (track.popularity as number), 0) / validPopularityTracks.length)
      : 0;
    const popularTracks = tracks.filter((track: any) => (track.popularity || 0) > 80).length;
    const hiddenGems = tracks.filter((track: any) => (track.popularity || 0) < 30).length;

    // Duration analysis with proper type checking
    const tracksLength = tracks.length;
    const avgDuration = tracksLength > 0 ? totalDurationMs / tracksLength / 1000 / 60 : 0; // minutes
    const shortTracks = tracks.filter((track: any) => (track.duration_ms || 0) < 180000).length; // under 3 min
    const longTracks = tracks.filter((track: any) => (track.duration_ms || 0) > 300000).length; // over 5 min

    // Time period specific facts
    const timeRangeLabel = timeRange === 'short_term' ? '4 weeks' : 
                          timeRange === 'medium_term' ? '6 months' : 'all time';
    
    const funFacts: FunFact[] = [
      {
        icon: Clock,
        title: "Total Listening Time",
        fact: `You've listened to ${totalHours.toLocaleString()} hours of music`,
        detail: `That's ${totalDays} full days of continuous music in your ${timeRangeLabel} data!`,
        color: "text-blue-500"
      },
      {
        icon: Music,
        title: "Genre Explorer",
        fact: `You've discovered ${uniqueGenres.length} different genres`,
        detail: `Your top genre is ${topGenre || 'Unknown'}, showing your diverse musical taste!`,
        color: "text-purple-500"
      },
      {
        icon: Users,
        title: "Artist Diversity",
        fact: `${uniqueArtists.length} unique artists in your collection`,
        detail: `From mainstream hits to hidden gems, you support a wide range of artists!`,
        color: "text-green-500"
      },
      {
        icon: Star,
        title: "Music Taste Score",
        fact: `Your average track popularity is ${avgPopularity}/100`,
        detail: `You have ${popularTracks} mainstream hits and ${hiddenGems} hidden gems!`,
        color: "text-yellow-500"
      },
      {
        icon: BarChart3,
        title: "Track Length Preference",
        fact: `Your average song is ${Math.round(avgDuration * 10) / 10} minutes long`,
        detail: `${shortTracks} quick tracks, ${longTracks} epic songs - perfectly balanced!`,
        color: "text-red-500"
      },
      {
        icon: Heart,
        title: "Music Dedication",
        fact: `You could listen to your top ${tracksLength} tracks for ${Math.round(totalHours/24)} days straight`,
        detail: `Your music library represents serious dedication to discovering great songs!`,
        color: "text-pink-500"
      },
      {
        icon: Zap,
        title: "Discovery Power",
        fact: `${Math.round((hiddenGems / tracksLength) * 100)}% of your music are hidden gems`,
        detail: `You're a true music discoverer, finding tracks before they go mainstream!`,
        color: "text-orange-500"
      },
      {
        icon: Disc,
        title: "Collection Size",
        fact: `Your top ${tracksLength} tracks span ${uniqueGenres.length} genres`,
        detail: `That's an average of ${Math.round(tracksLength / uniqueGenres.length)} tracks per genre!`,
        color: "text-cyan-500"
      }
    ];

    return funFacts;
  }, [topTracksData, topArtistsData, timeRange]);
};
