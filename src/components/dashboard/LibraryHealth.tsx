import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { Heart, TrendingUp, Users, Music, Star, AlertTriangle, CheckCircle, Clock, Sparkles, Target, Zap, ExternalLink, Headphones, Disc, Shield } from 'lucide-react';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { mapUITimeRangeToAPI, getTimeRangeLabel } from '@/lib/spotify-data-utils';
import { InfoButton } from '@/components/ui/InfoButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalmingLoader } from '@/components/ui/CalmingLoader';

export const LibraryHealth = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [sortBy, setSortBy] = useState('healthScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFiltering, setIsFiltering] = useState(false);

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

  // Process health metrics
  const healthMetrics = useMemo(() => {
    if (!tracks.length || !artists.length) return [];

    const metrics = [];
    
    // 1. Genre Diversity Health - Enhanced
    const genreCount = new Set(artists.flatMap((a: any) => a.genres || [])).size;
    const genreCoverage = Math.min(100, (genreCount / 30) * 100); // Based on 30 major genres
    const diversityScore = Math.round(genreCoverage);
    metrics.push({
      name: 'Genre Diversity',
      score: diversityScore,
      status: diversityScore >= 75 ? 'excellent' : diversityScore >= 60 ? 'good' : diversityScore >= 40 ? 'fair' : 'poor',
      description: `${genreCount} unique genres spanning ${Math.round(genreCoverage)}% of music spectrum`,
      recommendation: diversityScore < 60 ? 'Explore genres like jazz, electronic, or world music' : 'Excellent musical range!',
      category: 'diversity',
      value: genreCount,
      maxValue: 30,
      details: {
        topGenres: [...new Set(artists.flatMap((a: any) => a.genres || []))].slice(0, 5),
        rareGenres: [...new Set(artists.flatMap((a: any) => a.genres || []))].filter(g => 
          artists.filter((a: any) => a.genres?.includes(g)).length === 1
        ).length
      }
    });

    // 2. Music Freshness - Enhanced with release date analysis
    const avgPopularity = tracks.reduce((acc: number, track: any) => acc + (track.popularity || 0), 0) / tracks.length;
    const undergroundRatio = tracks.filter(t => (t.popularity || 0) < 30).length / tracks.length;
    const mainstreamRatio = tracks.filter(t => (t.popularity || 0) > 70).length / tracks.length;
    const freshnessScore = Math.round(
      (undergroundRatio * 40) + // Underground music bonus
      ((1 - mainstreamRatio) * 30) + // Avoid too mainstream
      (Math.max(0, 50 - avgPopularity) * 0.6) // Lower avg popularity bonus
    );
    metrics.push({
      name: 'Music Freshness',
      score: Math.min(100, freshnessScore),
      status: freshnessScore >= 70 ? 'excellent' : freshnessScore >= 55 ? 'good' : freshnessScore >= 40 ? 'fair' : 'poor',
      description: `${Math.round(undergroundRatio * 100)}% underground, ${Math.round(mainstreamRatio * 100)}% mainstream`,
      recommendation: freshnessScore < 55 ? 'Discover more emerging artists and indie music' : 'Great balance of fresh and familiar!',
      category: 'freshness',
      value: Math.round(100 - avgPopularity),
      maxValue: 100,
      details: {
        avgPopularity: Math.round(avgPopularity),
        undergroundCount: Math.round(undergroundRatio * tracks.length),
        mainstreamCount: Math.round(mainstreamRatio * tracks.length)
      }
    });

    // 3. Artist Balance - Enhanced with concentration analysis
    const artistPlayCounts = tracks.reduce((acc: any, track: any) => {
      const artistId = track.artists?.[0]?.id;
      if (artistId) {
        acc[artistId] = (acc[artistId] || 0) + 1;
      }
      return acc;
    }, {});
    const uniqueArtists = Object.keys(artistPlayCounts).length;
    const playCountValues = Object.values(artistPlayCounts) as number[];
    const topArtistShare = playCountValues.length > 0 ? Math.max(...playCountValues) / tracks.length : 0;
    const top5ArtistShare = playCountValues
      .sort((a, b) => b - a)
      .slice(0, 5)
      .reduce((acc, count) => acc + count, 0) / tracks.length;
    
    const balanceScore = Math.round(
      (Math.min(uniqueArtists / artists.length, 1) * 40) + // Artist utilization
      ((1 - topArtistShare) * 30) + // Avoid over-concentration
      ((1 - top5ArtistShare) * 30) // Distribute across many artists
    );
    
    metrics.push({
      name: 'Artist Balance',
      score: Math.min(100, balanceScore),
      status: balanceScore >= 75 ? 'excellent' : balanceScore >= 60 ? 'good' : balanceScore >= 45 ? 'fair' : 'poor',
      description: `${uniqueArtists} artists, top artist: ${Math.round(topArtistShare * 100)}% of listening`,
      recommendation: balanceScore < 60 ? 'Explore more artists to avoid over-concentration' : 'Well-distributed listening habits!',
      category: 'balance',
      value: Math.round((1 - topArtistShare) * 100),
      maxValue: 100,
      details: {
        uniqueArtists,
        topArtistShare: Math.round(topArtistShare * 100),
        top5Share: Math.round(top5ArtistShare * 100)
      }
    });

    // 4. Mood Variety - New metric
    const moodCategories = {
      energetic: tracks.filter(t => ((t as any).energy || 0.5) > 0.7 && ((t as any).valence || 0.5) > 0.6).length,
      happy: tracks.filter(t => ((t as any).valence || 0.5) > 0.7).length,
      chill: tracks.filter(t => ((t as any).energy || 0.5) < 0.5 && ((t as any).acousticness || 0.5) > 0.5).length,
      melancholic: tracks.filter(t => ((t as any).valence || 0.5) < 0.4).length,
      danceable: tracks.filter(t => ((t as any).danceability || 0.5) > 0.7).length
    };
    const moodCount = Object.values(moodCategories).filter(count => count > tracks.length * 0.05).length;
    const moodScore = Math.round((moodCount / 5) * 100);
    
    metrics.push({
      name: 'Mood Variety',
      score: moodScore,
      status: moodScore >= 80 ? 'excellent' : moodScore >= 60 ? 'good' : moodScore >= 40 ? 'fair' : 'poor',
      description: `${moodCount}/5 mood categories well-represented`,
      recommendation: moodScore < 60 ? 'Add more variety in energy and emotional range' : 'Great emotional diversity!',
      category: 'mood',
      value: moodCount,
      maxValue: 5,
      details: moodCategories
    });

    // 5. Listening Depth - New metric
    const trackDurations = tracks.map(t => t.duration_ms || 180000);
    const avgDuration = trackDurations.reduce((acc, dur) => acc + dur, 0) / trackDurations.length;
    const longTracks = tracks.filter(t => (t.duration_ms || 0) > 300000).length; // > 5 minutes
    const shortTracks = tracks.filter(t => (t.duration_ms || 0) < 120000).length; // < 2 minutes
    
    const depthScore = Math.round(
      (Math.min(avgDuration / 240000, 1) * 50) + // Prefer longer tracks
      ((longTracks / tracks.length) * 30) + // Bonus for long tracks
      (Math.max(0, 1 - (shortTracks / tracks.length)) * 20) // Penalty for too many short tracks
    );
    
    metrics.push({
      name: 'Listening Depth',
      score: Math.min(100, depthScore),
      status: depthScore >= 75 ? 'excellent' : depthScore >= 60 ? 'good' : depthScore >= 45 ? 'fair' : 'poor',
      description: `Avg: ${Math.round(avgDuration / 60000)}m, ${longTracks} long tracks, ${shortTracks} short tracks`,
      recommendation: depthScore < 60 ? 'Try longer, more immersive tracks and albums' : 'Great depth in your listening!',
      category: 'depth',
      value: Math.round(avgDuration / 60000),
      maxValue: 6,
      details: {
        avgDuration: Math.round(avgDuration / 60000),
        longTracks,
        shortTracks
      }
    });

    // 6. Era Diversity - New metric
    const currentYear = new Date().getFullYear();
    const eraDistribution = {
      recent: tracks.filter(t => {
        const year = new Date((t as any).album?.release_date || `${currentYear}`).getFullYear();
        return year >= currentYear - 3;
      }).length,
      modern: tracks.filter(t => {
        const year = new Date((t as any).album?.release_date || `${currentYear - 10}`).getFullYear();
        return year >= currentYear - 15 && year < currentYear - 3;
      }).length,
      classic: tracks.filter(t => {
        const year = new Date((t as any).album?.release_date || `${currentYear - 20}`).getFullYear();
        return year < currentYear - 15;
      }).length
    };
    
    const eraBalance = Object.values(eraDistribution).filter(count => count > tracks.length * 0.1).length;
    const eraScore = Math.round((eraBalance / 3) * 100);
    
    metrics.push({
      name: 'Era Diversity',
      score: eraScore,
      status: eraScore >= 80 ? 'excellent' : eraScore >= 60 ? 'good' : eraScore >= 40 ? 'fair' : 'poor',
      description: `${eraBalance}/3 eras represented (Recent, Modern, Classic)`,
      recommendation: eraScore < 60 ? 'Explore music from different decades' : 'Great temporal diversity!',
      category: 'era',
      value: eraBalance,
      maxValue: 3,
      details: eraDistribution
    });

    // 7. Discovery Momentum - Enhanced
    const recentDiscoveries = tracks.filter((track, index) => index < tracks.length * 0.2).length;
    const discoveryRate = (recentDiscoveries / tracks.length) * 100;
    const momentumScore = Math.round(
      (discoveryRate * 2) + // Base discovery rate
      (Math.min(recentDiscoveries / 50, 1) * 30) + // Absolute discovery count
      (tracks.length > 500 ? 20 : tracks.length / 25) // Library growth bonus
    );
    
    metrics.push({
      name: 'Discovery Momentum',
      score: Math.min(100, momentumScore),
      status: momentumScore >= 75 ? 'excellent' : momentumScore >= 60 ? 'good' : momentumScore >= 45 ? 'fair' : 'poor',
      description: `${recentDiscoveries} recent discoveries, ${Math.round(discoveryRate)}% of library`,
      recommendation: momentumScore < 60 ? 'Increase your music discovery rate with new releases' : 'Excellent discovery momentum!',
      category: 'discovery',
      value: recentDiscoveries,
      maxValue: Math.max(100, tracks.length * 0.3),
      details: {
        recentCount: recentDiscoveries,
        discoveryRate: Math.round(discoveryRate),
        librarySize: tracks.length
      }
    });

    // Calculate Overall Health Score
    const coreMetrics = metrics.filter(m => m.name !== 'Overall Health');
    const weightedScore = Math.round(
      (coreMetrics.find(m => m.name === 'Genre Diversity')?.score || 0) * 0.20 +
      (coreMetrics.find(m => m.name === 'Music Freshness')?.score || 0) * 0.18 +
      (coreMetrics.find(m => m.name === 'Artist Balance')?.score || 0) * 0.16 +
      (coreMetrics.find(m => m.name === 'Mood Variety')?.score || 0) * 0.15 +
      (coreMetrics.find(m => m.name === 'Listening Depth')?.score || 0) * 0.15 +
      (coreMetrics.find(m => m.name === 'Era Diversity')?.score || 0) * 0.08 +
      (coreMetrics.find(m => m.name === 'Discovery Momentum')?.score || 0) * 0.08
    );

    metrics.push({
      name: 'Overall Health',
      score: weightedScore,
      status: weightedScore >= 80 ? 'excellent' : weightedScore >= 70 ? 'good' : weightedScore >= 55 ? 'fair' : 'poor',
      description: `Comprehensive music library health assessment`,
      recommendation: weightedScore < 70 ? 'Focus on your lowest-scoring metrics for balanced improvement' : 'Outstanding library health!',
      category: 'overall',
      value: weightedScore,
      maxValue: 100,
      details: {
        weightedAverage: true,
        breakdown: coreMetrics.map(m => ({ name: m.name, score: m.score, weight: m.name === 'Genre Diversity' ? 20 : m.name === 'Music Freshness' ? 18 : 16 }))
      }
    });

    return metrics;
  }, [tracks, artists]);

  // Process recommendations
  const recommendations = useMemo(() => {
    if (!healthMetrics.length) return [];

    const recs = [];
    const coreMetrics = healthMetrics.filter(m => m.name !== 'Overall Health');
    const poorMetrics = coreMetrics.filter(m => m.status === 'poor');
    const fairMetrics = coreMetrics.filter(m => m.status === 'fair');
    const overallHealth = healthMetrics.find(m => m.name === 'Overall Health');
    
    // High priority recommendations for poor metrics
    poorMetrics.forEach(metric => {
      const specificRec = getSpecificRecommendation(metric, tracks, artists);
      recs.push({
        type: 'improvement',
        title: `🚨 Fix ${metric.name}`,
        description: specificRec.description,
        priority: 'high',
        category: metric.category,
        actions: specificRec.actions,
        impact: 'High impact on overall library health'
      });
    });

    // Medium priority recommendations for fair metrics
    fairMetrics.slice(0, 2).forEach(metric => {
      const specificRec = getSpecificRecommendation(metric, tracks, artists);
      recs.push({
        type: 'improvement',
        title: `⚡ Boost ${metric.name}`,
        description: specificRec.description,
        priority: 'medium',
        category: metric.category,
        actions: specificRec.actions,
        impact: 'Moderate improvement to library balance'
      });
    });

    // Success recommendations for excellent metrics
    const excellentMetrics = coreMetrics.filter(m => m.status === 'excellent');
    if (excellentMetrics.length > 0) {
      const topMetric = excellentMetrics[0];
      recs.push({
        type: 'maintenance',
        title: `✨ Maintain ${topMetric.name}`,
        description: `Your ${topMetric.name.toLowerCase()} is excellent! Keep up the great work.`,
        priority: 'low',
        category: topMetric.category,
        actions: [`Continue your current ${topMetric.name.toLowerCase()} habits`],
        impact: 'Sustains your library strengths'
      });
    }

    // Overall health recommendations
    if (overallHealth) {
      if (overallHealth.score >= 85) {
        recs.push({
          type: 'achievement',
          title: '🏆 Library Health Master',
          description: 'Your library is in outstanding health! You\'re a music curation expert.',
          priority: 'low',
          category: 'achievement',
          actions: ['Share your music discovery methods with friends', 'Consider creating curated playlists'],
          impact: 'You\'re setting the standard for healthy music libraries'
        });
      } else if (overallHealth.score < 60) {
        const lowestMetric = coreMetrics.reduce((prev, current) => 
          current.score < prev.score ? current : prev
        );
        recs.push({
          type: 'focus',
          title: '🎯 Priority Focus Area',
          description: `Start with ${lowestMetric.name} - it's your biggest opportunity for improvement.`,
          priority: 'high',
          category: 'strategy',
          actions: [`Focus on ${lowestMetric.name} for the next 2 weeks`, 'Track your progress'],
          impact: 'Strategic approach for maximum improvement'
        });
      }
    }

    return recs.slice(0, 6); // Limit to 6 recommendations
  }, [healthMetrics, tracks, artists]);

  // Helper function for specific recommendations
  const getSpecificRecommendation = (metric: any, tracks: any[], artists: any[]) => {
    switch (metric.name) {
      case 'Genre Diversity':
        const currentGenres = [...new Set(artists.flatMap((a: any) => a.genres || []))];
        const missingGenres = ['jazz', 'electronic', 'classical', 'reggae', 'blues', 'folk', 'world music']
          .filter(genre => !currentGenres.some(g => g.toLowerCase().includes(genre)));
        return {
          description: `Add ${missingGenres.slice(0, 3).join(', ')} to reach ${metric.value + 5}+ genres`,
          actions: [
            'Explore Spotify\'s genre playlists',
            `Try searching for "${missingGenres[0]}" artists`,
            'Use Discover Weekly to find new genres'
          ]
        };
      
      case 'Music Freshness':
        return {
          description: `Discover more underground artists (currently ${metric.details?.undergroundCount || 0} tracks)`,
          actions: [
            'Follow independent record labels',
            'Check out artists with <10k monthly listeners',
            'Explore local music scenes'
          ]
        };
      
      case 'Artist Balance':
        const topArtistShare = metric.details?.topArtistShare || 0;
        return {
          description: `Your top artist represents ${topArtistShare}% of listening - aim for <15%`,
          actions: [
            'Limit repeats of your top artists',
            'Actively seek similar artists',
            'Use artist radio for discovery'
          ]
        };
      
      case 'Mood Variety':
        const lowMoods = Object.entries(metric.details || {})
          .filter(([_, count]) => (count as number) < tracks.length * 0.05)
          .map(([mood]) => mood);
        return {
          description: `Add more ${lowMoods.slice(0, 2).join(' and ')} music to your collection`,
          actions: [
            'Create mood-specific playlists',
            'Explore different energy levels',
            'Try music for different activities'
          ]
        };
      
      case 'Listening Depth':
        const avgDuration = metric.details?.avgDuration || 3;
        return {
          description: `Average track length is ${avgDuration}m - try longer, more immersive pieces`,
          actions: [
            'Explore progressive rock and post-rock',
            'Listen to full albums instead of singles',
            'Try classical and ambient music'
          ]
        };
      
      case 'Era Diversity':
        const missingEras = Object.entries(metric.details || {})
          .filter(([_, count]) => (count as number) < tracks.length * 0.1)
          .map(([era]) => era);
        return {
          description: `Add more ${missingEras.join(' and ')} music to span different decades`,
          actions: [
            'Explore "Best of" playlists from different decades',
            'Ask older family members for recommendations',
            'Check out music history documentaries'
          ]
        };
      
      case 'Discovery Momentum':
        return {
          description: `Only ${metric.details?.recentCount || 0} recent discoveries - aim for 20+ per month`,
          actions: [
            'Set a goal to discover 5 new artists weekly',
            'Use Release Radar and Discover Weekly',
            'Follow music blogs and reviewers'
          ]
        };
      
      default:
        return {
          description: metric.recommendation,
          actions: ['Explore new music regularly', 'Diversify your listening habits']
        };
    }
  };

  // Sort metrics based on selected criteria
  const sortedMetrics = useMemo(() => {
    const sorted = [...healthMetrics].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'healthScore':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'status':
          const statusOrder = { 'excellent': 4, 'good': 3, 'fair': 2, 'poor': 1 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.score;
          bValue = b.score;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    return sorted;
  }, [healthMetrics, sortBy, sortOrder]);

  // Calculate stats
  const calculateStats = () => {
    if (!healthMetrics.length) return {
      overallScore: 0,
      excellentCount: 0,
      goodCount: 0,
      fairCount: 0,
      poorCount: 0,
      improvementAreas: 0,
      avgScore: 0
    };

    const overallMetric = healthMetrics.find(m => m.name === 'Overall Health');
    const overallScore = overallMetric?.score || 0;
    const excellentCount = healthMetrics.filter(m => m.status === 'excellent').length;
    const goodCount = healthMetrics.filter(m => m.status === 'good').length;
    const fairCount = healthMetrics.filter(m => m.status === 'fair').length;
    const poorCount = healthMetrics.filter(m => m.status === 'poor').length;
    const improvementAreas = fairCount + poorCount;
    const avgScore = Math.round(healthMetrics.reduce((acc, m) => acc + m.score, 0) / healthMetrics.length);
    
    return {
      overallScore,
      excellentCount,
      goodCount,
      fairCount,
      poorCount,
      improvementAreas,
      avgScore
    };
  };

  const stats = calculateStats();

  // Generate fun facts
  const funFacts = useMemo(() => {
    if (!healthMetrics.length) return [];
    
    const facts = [];
    const coreMetrics = healthMetrics.filter(m => m.name !== 'Overall Health');
    const bestMetric = coreMetrics.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    );
    const worstMetric = coreMetrics.reduce((prev, current) => 
      current.score < prev.score ? current : prev
    );
    const diversityMetric = healthMetrics.find(m => m.name === 'Genre Diversity');
    const freshnessMetric = healthMetrics.find(m => m.name === 'Music Freshness');
    const moodMetric = healthMetrics.find(m => m.name === 'Mood Variety');
    const depthMetric = healthMetrics.find(m => m.name === 'Listening Depth');
    const balanceMetric = healthMetrics.find(m => m.name === 'Artist Balance');
    const overallMetric = healthMetrics.find(m => m.name === 'Overall Health');
    
    // Dynamic facts based on actual data
    if (overallMetric && overallMetric.score >= 85) {
      facts.push({
        icon: Star,
        title: "Music Curator Extraordinaire",
        description: `With ${overallMetric.score}% overall health, you're in the top 5% of music listeners! Your library is a masterclass in curation.`
      });
    } else {
      facts.push({
        icon: CheckCircle,
        title: "Strongest Asset",
        description: `Your ${bestMetric?.name || 'top metric'} leads at ${bestMetric?.score || 0}% - this is your musical superpower!`
      });
    }
    
    if (diversityMetric && diversityMetric.details) {
      const rareGenres = diversityMetric.details.rareGenres;
      facts.push({
        icon: Sparkles,
        title: "Genre Explorer",
        description: `You've discovered ${diversityMetric.value} genres including ${rareGenres} rare ones - ${diversityMetric.score >= 75 ? 'you\'re a true musical adventurer!' : 'there are still new worlds to explore!'}`
      });
    }
    
    if (freshnessMetric && freshnessMetric.details) {
      const undergroundCount = freshnessMetric.details.undergroundCount;
      const mainstreamCount = freshnessMetric.details.mainstreamCount;
      facts.push({
        icon: Zap,
        title: "Discovery Balance",
        description: `Your taste spans ${undergroundCount} underground gems to ${mainstreamCount} mainstream hits - ${freshnessMetric.score >= 70 ? 'perfect balance!' : 'lean more toward the underground!'}`
      });
    }
    
    if (moodMetric && moodMetric.details) {
      const topMood = Object.entries(moodMetric.details)
        .reduce((prev, current) => (current[1] as number) > (prev[1] as number) ? current : prev);
      facts.push({
        icon: Heart,
        title: "Emotional Range",
        description: `Your dominant mood is ${topMood[0]} with ${topMood[1]} tracks - ${moodMetric.score >= 80 ? 'incredible emotional diversity!' : 'try exploring other moods!'}`
      });
    }
    
    if (depthMetric && depthMetric.details) {
      const avgDuration = depthMetric.details.avgDuration;
      const longTracks = depthMetric.details.longTracks;
      facts.push({
        icon: Clock,
        title: "Listening Style",
        description: `${avgDuration}min average tracks with ${longTracks} epic journeys - ${depthMetric.score >= 75 ? 'you appreciate musical depth!' : 'try some longer compositions!'}`
      });
    }
    
    if (balanceMetric && balanceMetric.details) {
      const topArtistShare = balanceMetric.details.topArtistShare;
      facts.push({
        icon: Target,
        title: "Artist Loyalty",
        description: `Your top artist claims ${topArtistShare}% of listening time - ${balanceMetric.score >= 75 ? 'great balance across artists!' : 'branch out to new artists!'}`
      });
    }
    
    // Add improvement insight
    if (worstMetric && worstMetric.score < 60) {
      facts.push({
        icon: TrendingUp,
        title: "Growth Opportunity",
        description: `${worstMetric.name} at ${worstMetric.score}% is your biggest opportunity - small improvements here will boost your overall health significantly!`
      });
    }
    
    return facts.slice(0, 4);
  }, [healthMetrics]);

  // Chart data
  const chartColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const radarData = healthMetrics.filter(m => m.name !== 'Overall Health').map(metric => ({
    metric: metric.name.replace(' ', '\n'),
    fullName: metric.name,
    score: metric.score,
    status: metric.status
  }));

  const statusData = [
    { status: 'Excellent', count: stats.excellentCount, color: '#22C55E' },
    { status: 'Good', count: stats.goodCount, color: '#3B82F6' },
    { status: 'Fair', count: stats.fairCount, color: '#F59E0B' },
    { status: 'Poor', count: stats.poorCount, color: '#EF4444' }
  ].filter(item => item.count > 0);

  const chartConfig = {
    score: { label: "Health Score", color: "hsl(var(--accent))" },
    count: { label: "Count", color: "hsl(var(--primary))" }
  };

  // Filtering overlay component
  const FilteringOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full"></div>
          <div className="animate-pulse h-2 w-2 bg-accent rounded-full"></div>
          <span className="text-sm font-medium">Analyzing library health...</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Processing {getTimeRangeLabel(timeRange)} data and {sortBy} sorting
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Library Health</h1>
          <p className="text-muted-foreground">Analyzing your music library health...</p>
        </div>
        <CalmingLoader 
          title="Diagnosing your music library..."
          description="Analyzing diversity, freshness, and balance in your collection"
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Library Health</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Comprehensive analysis of your music library • Discover areas for improvement
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Analysis Period: {getTimeRangeLabel(timeRange)}</span>
            <span>•</span>
            <span>Health Metrics: {healthMetrics.length - 1} categories</span>
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
              <SelectItem value="healthScore">Health Score</SelectItem>
              <SelectItem value="name">Metric Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="category">Category</SelectItem>
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

      {/* Overall Health Score */}
      <Card className="border-l-4 border-l-accent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Overall Library Health</h2>
              <p className="text-sm text-muted-foreground">
                Your music library's comprehensive health score
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-accent">{stats.overallScore}%</div>
              <Badge 
                variant={stats.overallScore >= 80 ? 'default' : stats.overallScore >= 65 ? 'secondary' : 'destructive'}
                className="mt-1"
              >
                {stats.overallScore >= 80 ? 'Excellent' : stats.overallScore >= 65 ? 'Good' : stats.overallScore >= 50 ? 'Fair' : 'Needs Attention'}
              </Badge>
            </div>
          </div>
          <Progress value={stats.overallScore} className="mt-4" />
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              <span className="text-xs md:text-sm font-medium">Excellent</span>
              <InfoButton
                title="Excellent Metrics"
                description="Number of health metrics performing excellently (80%+ score)."
                funFacts={[
                  "Excellent metrics show library strengths",
                  "These areas are performing optimally",
                  "Maintain these high standards"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-green-500">{stats.excellentCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              <span className="text-xs md:text-sm font-medium">Good</span>
              <InfoButton
                title="Good Metrics"
                description="Number of health metrics performing well (65-79% score)."
                funFacts={[
                  "Good metrics show solid performance",
                  "These areas are healthy",
                  "Small improvements can make them excellent"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-blue-500">{stats.goodCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
              <span className="text-xs md:text-sm font-medium">Fair</span>
              <InfoButton
                title="Fair Metrics"
                description="Number of health metrics performing fairly (50-64% score)."
                funFacts={[
                  "Fair metrics need attention",
                  "These areas have improvement potential",
                  "Focus here for better library health"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-yellow-500">{stats.fairCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
              <span className="text-xs md:text-sm font-medium">Poor</span>
              <InfoButton
                title="Poor Metrics"
                description="Number of health metrics needing attention (<50% score)."
                funFacts={[
                  "Poor metrics need immediate attention",
                  "These areas impact overall health",
                  "Prioritize improving these first"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold text-red-500">{stats.poorCount}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Improve</span>
              <InfoButton
                title="Improvement Areas"
                description="Number of metrics that could benefit from attention."
                funFacts={[
                  "Focus areas for better health",
                  "Small changes can make big impacts",
                  "Improvement leads to better experience"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.improvementAreas}</div>
            <div className="text-xs text-muted-foreground">Areas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              <span className="text-xs md:text-sm font-medium">Avg Score</span>
              <InfoButton
                title="Average Score"
                description="Average health score across all metrics."
                funFacts={[
                  "Shows overall library wellness",
                  "Higher averages indicate better health",
                  "Aim for 80%+ for optimal health"
                ]}
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">{stats.avgScore}</div>
            <div className="text-xs text-muted-foreground">Average %</div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Library Health Insights
            </CardTitle>
            <CardDescription>
              Key insights about your music library health
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
            <TabsTrigger value="detailed">Health Metrics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            {/* Health Metrics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Health Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Health Radar
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional view of your library health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={60} domain={[0, 100]} tickCount={5} />
                        <Radar
                          name="Health Score"
                          dataKey="score"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.3}
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                                  <p className="font-medium text-sm">{data.fullName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Score: {data.score}% ({data.status})
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

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of your health metrics by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ status, count }) => `${status}: ${count}`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {statusData.map((status, index) => (
                        <div key={status.status} className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="text-sm font-medium">{status.status}</span>
                          <Badge variant="outline" className="text-xs">
                            {status.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 md:space-y-6">
            {/* Detailed Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Metrics Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed analysis of each health category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedMetrics.filter(m => m.name !== 'Overall Health').map((metric, index) => (
                    <div key={metric.name} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{metric.name}</h3>
                            <Badge 
                              variant={
                                metric.status === 'excellent' ? 'default' :
                                metric.status === 'good' ? 'secondary' :
                                metric.status === 'fair' ? 'outline' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {metric.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">{metric.score}%</div>
                        </div>
                      </div>
                      <Progress value={metric.score} className="mb-2" />
                      <p className="text-xs text-muted-foreground">{metric.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 md:space-y-6">
            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Health Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions to improve your library health
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border rounded-lg ${
                          rec.priority === 'high' ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20' :
                          rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20' :
                          'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            rec.priority === 'high' ? 'bg-red-100 dark:bg-red-900' :
                            rec.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                            'bg-blue-100 dark:bg-blue-900'
                          }`}>
                            {rec.type === 'improvement' ? (
                              <Target className={`h-4 w-4 ${
                                rec.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                                rec.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-blue-600 dark:text-blue-400'
                              }`} />
                            ) : rec.type === 'achievement' ? (
                              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            ) : rec.type === 'focus' ? (
                              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium text-sm">{rec.title}</h3>
                              <Badge 
                                variant={
                                  rec.priority === 'high' ? 'destructive' :
                                  rec.priority === 'medium' ? 'outline' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                            
                            {(rec as any).actions && (
                              <div className="space-y-2">
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Action Steps:</h4>
                                <ul className="space-y-1">
                                  {(rec as any).actions.map((action: string, actionIndex: number) => (
                                    <li key={actionIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                                      <span className="text-accent mt-0.5">•</span>
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {(rec as any).impact && (
                              <div className="mt-3 pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground italic">
                                  Impact: {(rec as any).impact}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your Library is Healthy!</h3>
                    <p className="text-muted-foreground">
                      All metrics are performing well. Keep up the great work maintaining your diverse and fresh music collection.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
