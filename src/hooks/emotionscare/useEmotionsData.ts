import { useState, useEffect, useCallback, useRef } from 'react';
import { EmotionsCareWebSocket } from '@/services/emotionscare/websocket';
import { emotionsCareApi } from '@/services/emotionscare/api';
import type { 
  EmotionData, 
  BrainRegionMapping, 
  WSAlert 
} from '@/services/emotionscare/types';

// ============ EMOTIONS REALTIME HOOK ============

interface UseEmotionsDataOptions {
  onAlert?: (alert: WSAlert) => void;
  fallbackToRest?: boolean;
  updateInterval?: number;
}

interface UseEmotionsDataResult {
  emotions: EmotionData | null;
  brainRegions: BrainRegionMapping[];
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useEmotionsData(
  patientId: string | null,
  options: UseEmotionsDataOptions = {}
): UseEmotionsDataResult {
  const { onAlert, fallbackToRest = true, updateInterval = 5000 } = options;
  
  const [emotions, setEmotions] = useState<EmotionData | null>(null);
  const [brainRegions, setBrainRegions] = useState<BrainRegionMapping[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<EmotionsCareWebSocket | null>(null);
  const fallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle emotion updates
  const handleEmotionUpdate = useCallback((data: {
    emotions: EmotionData;
    brainRegions: BrainRegionMapping[];
    timestamp: string;
  }) => {
    setEmotions(data.emotions);
    setBrainRegions(data.brainRegions);
    setIsLoading(false);
    setError(null);
  }, []);

  // Handle connection changes
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    
    // If disconnected and fallback enabled, start REST polling
    if (!connected && fallbackToRest && patientId) {
      startFallbackPolling();
    } else if (connected) {
      stopFallbackPolling();
    }
  }, [fallbackToRest, patientId]);

  // Handle alerts
  const handleAlert = useCallback((alert: WSAlert) => {
    console.log('[Emotions] Alert received:', alert);
    onAlert?.(alert);
  }, [onAlert]);

  // Handle errors
  const handleError = useCallback((err: Error) => {
    console.error('[Emotions] Error:', err);
    setError(err);
  }, []);

  // Fallback REST polling
  const startFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current || !patientId) return;
    
    console.log('[Emotions] Starting REST fallback polling');
    
    const fetchEmotions = async () => {
      try {
        const data = await emotionsCareApi.getEmotions(patientId);
        setEmotions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
      }
    };
    
    fetchEmotions();
    fallbackIntervalRef.current = setInterval(fetchEmotions, updateInterval);
  }, [patientId, updateInterval]);

  const stopFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!patientId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load initial data via REST
      const initialData = await emotionsCareApi.getEmotions(patientId);
      setEmotions(initialData);
      setIsLoading(false);

      // Connect WebSocket for real-time updates
      wsRef.current = new EmotionsCareWebSocket(patientId, {
        onEmotionUpdate: handleEmotionUpdate,
        onConnectionChange: handleConnectionChange,
        onAlert: handleAlert,
        onError: handleError,
      });
      
      await wsRef.current.connect();
    } catch (err) {
      console.error('[Emotions] Initial load failed:', err);
      setError(err as Error);
      setIsLoading(false);
      
      // Start fallback if enabled
      if (fallbackToRest) {
        startFallbackPolling();
      }
    }
  }, [
    patientId, 
    handleEmotionUpdate, 
    handleConnectionChange, 
    handleAlert, 
    handleError,
    fallbackToRest,
    startFallbackPolling
  ]);

  // Reconnect function
  const reconnect = useCallback(() => {
    wsRef.current?.disconnect();
    stopFallbackPolling();
    connect();
  }, [connect, stopFallbackPolling]);

  // Disconnect function
  const disconnect = useCallback(() => {
    wsRef.current?.disconnect();
    wsRef.current = null;
    stopFallbackPolling();
    setIsConnected(false);
  }, [stopFallbackPolling]);

  // Effect: Connect on mount, cleanup on unmount
  useEffect(() => {
    if (patientId) {
      connect();
    }

    return () => {
      wsRef.current?.disconnect();
      stopFallbackPolling();
    };
  }, [patientId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    emotions,
    brainRegions,
    isConnected,
    isLoading,
    error,
    reconnect,
    disconnect,
  };
}

// ============ EMOTION HISTORY HOOK ============

import { useQuery } from '@tanstack/react-query';

interface UseEmotionHistoryOptions {
  from: string;
  to: string;
  interval?: 'hour' | 'day' | 'week';
  enabled?: boolean;
}

export function useEmotionHistory(
  patientId: string | null,
  options: UseEmotionHistoryOptions
) {
  const { from, to, interval = 'day', enabled = true } = options;
  
  return useQuery({
    queryKey: ['emotionscare', 'emotion-history', patientId, from, to, interval],
    queryFn: () => emotionsCareApi.getEmotionHistory(patientId!, { from, to, interval }),
    enabled: !!patientId && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
