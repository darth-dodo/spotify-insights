
import { useEffect, useState } from 'react';
import { spotifyPlaybackSDK, HeatmapDay } from '@/lib/spotify-playback-sdk';

interface SessionStats {
  sessionLength: number;
  uniqueTracks: number;
  totalMinutes: number;
  deviceType: string;
  isActive: boolean;
}

export const useSpotifyPlayback = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);

  useEffect(() => {
    // Check connection status periodically
    const checkConnection = () => {
      setIsConnected(spotifyPlaybackSDK.isConnected());
      
      if (spotifyPlaybackSDK.isConnected()) {
        setSessionStats(spotifyPlaybackSDK.getSessionStats());
        setHeatmapData(spotifyPlaybackSDK.generateLocalHeatmapData());
      }
    };

    // Initial check
    checkConnection();

    // Set up periodic updates (every 30 seconds)
    const interval = setInterval(checkConnection, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const clearSession = () => {
    spotifyPlaybackSDK.clearSessionData();
    setSessionStats(spotifyPlaybackSDK.getSessionStats());
    setHeatmapData(spotifyPlaybackSDK.generateLocalHeatmapData());
  };

  const disconnect = () => {
    spotifyPlaybackSDK.disconnect();
    setIsConnected(false);
    setSessionStats(null);
    setHeatmapData([]);
  };

  return {
    isConnected,
    sessionStats,
    heatmapData,
    clearSession,
    disconnect
  };
};
