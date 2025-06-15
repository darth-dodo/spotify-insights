
import { spotifyPlaybackSDK } from '../spotify-playback-sdk';
import { ensurePositive, validateTrackData } from './spotify-data-fetcher';
import type { IntegratedTrackData, IntegratedArtistData } from '../spotify-data-types';

export const processRecentlyPlayedData = (apiTracks: any[]): IntegratedTrackData[] => {
  return apiTracks
    .filter(item => validateTrackData(item?.track))
    .map(item => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists || [],
      duration_ms: ensurePositive(item.track.duration_ms),
      popularity: ensurePositive(item.track.popularity),
      playedAt: item.played_at,
      playCount: 1,
      totalListeningTime: ensurePositive(item.track.duration_ms),
      source: 'api' as const
    }));
};

export const processTopTracksData = (tracks: any[]): IntegratedTrackData[] => {
  return tracks
    .filter(track => validateTrackData(track))
    .map((track: any, index: number) => ({
      id: track.id,
      name: track.name,
      artists: track.artists || [],
      duration_ms: ensurePositive(track.duration_ms),
      popularity: ensurePositive(track.popularity),
      playCount: ensurePositive(Math.max(100 - index, 1)),
      totalListeningTime: ensurePositive((Math.max(100 - index, 1)) * track.duration_ms),
      source: 'api' as const
    }));
};

export const processTopArtistsData = (artists: any[]): IntegratedArtistData[] => {
  return artists.map((artist: any, index: number) => ({
    id: artist.id,
    name: artist.name,
    genres: artist.genres || [],
    popularity: ensurePositive(artist.popularity),
    playCount: ensurePositive(Math.max(50 - Math.floor(index / 2), 1)),
    totalListeningTime: ensurePositive((Math.max(50 - Math.floor(index / 2), 1)) * 180000),
    source: 'api' as const
  }));
};

export const combineTrackData = (tracks: IntegratedTrackData[]): IntegratedTrackData[] => {
  const trackMap = new Map<string, IntegratedTrackData>();

  tracks.forEach(track => {
    const existing = trackMap.get(track.id);
    if (existing) {
      existing.playCount = ensurePositive(existing.playCount + track.playCount);
      existing.totalListeningTime = ensurePositive(existing.totalListeningTime + track.totalListeningTime);
      existing.source = 'combined';
      if (track.playedAt && (!existing.playedAt || track.playedAt > existing.playedAt)) {
        existing.playedAt = track.playedAt;
      }
    } else {
      trackMap.set(track.id, { ...track });
    }
  });

  return Array.from(trackMap.values()).sort((a, b) => {
    if (a.playedAt && b.playedAt) {
      return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
    }
    return ensurePositive(b.playCount) - ensurePositive(a.playCount);
  });
};

export const enhanceTracksWithSDKData = (apiTracks: IntegratedTrackData[], sdkTracks: any[]): IntegratedTrackData[] => {
  const sdkTrackMap = new Map(sdkTracks.map(track => [track.id, track]));

  return apiTracks.map(track => {
    const sdkData = sdkTrackMap.get(track.id);
    if (sdkData) {
      return {
        ...track,
        playCount: ensurePositive(track.playCount + ensurePositive(sdkData.playCount)),
        totalListeningTime: ensurePositive(track.totalListeningTime + ensurePositive(sdkData.totalListeningTime)),
        source: 'combined' as const
      };
    }
    return track;
  });
};

export const assessDataQuality = (tracks: IntegratedTrackData[]): 'high' | 'medium' | 'low' => {
  const combinedSources = tracks.filter(t => t.source === 'combined').length;
  const apiSources = tracks.filter(t => t.source === 'api').length;
  
  if (combinedSources > tracks.length * 0.3) return 'high';
  if (apiSources > tracks.length * 0.5) return 'medium';
  return 'low';
};

export const calculateListeningStats = (tracks: IntegratedTrackData[], timeRangeLabel: string) => {
  const totalPlayCount = ensurePositive(tracks.reduce((sum, track) => sum + ensurePositive(track.playCount), 0));
  const totalMinutes = ensurePositive(Math.floor(tracks.reduce((sum, track) => sum + ensurePositive(track.totalListeningTime), 0) / 60000));
  const totalHours = ensurePositive(Math.floor(totalMinutes / 60));
  const uniqueArtists = new Set(tracks.flatMap(track => track.artists?.map(a => a.id) || [])).size;
  
  const days = timeRangeLabel.includes('Week') ? 7 :
               timeRangeLabel.includes('Month') ? 30 :
               timeRangeLabel.includes('6 Months') ? 180 :
               365;
  
  const avgDailyMinutes = ensurePositive(Math.floor(totalMinutes / days));

  return {
    totalPlayCount,
    totalMinutes,
    totalHours,
    uniqueArtists,
    avgDailyMinutes,
    topTrack: tracks[0],
    timeRangeLabel,
    dataQuality: assessDataQuality(tracks)
  };
};
