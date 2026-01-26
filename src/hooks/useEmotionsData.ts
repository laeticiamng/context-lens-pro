import { useEffect, useRef, useCallback } from 'react';
import { useARStore, EmotionData } from '@/stores/arStore';

const WS_URL = import.meta.env.VITE_EMOTIONSCARE_WS_URL || 'wss://api.emotionscare.app';

export function useEmotionsData(patientId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  const { 
    emotions, 
    isEmotionsConnected,
    setEmotions, 
    setEmotionsConnected 
  } = useARStore();

  const connect = useCallback(() => {
    if (!patientId) return;
    
    try {
      const ws = new WebSocket(`${WS_URL}/ws/emotions/${patientId}`);
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('Emotions WebSocket connected');
        setEmotionsConnected(true);
        ws.send(JSON.stringify({ action: 'subscribe', patientId }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'emotion_update') {
            setEmotions(data.emotions as EmotionData);
          }
        } catch (e) {
          console.error('Failed to parse emotion data:', e);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed, reconnecting in 3s...');
        setEmotionsConnected(false);
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setEmotionsConnected(false);
      
      // Fallback to mock data for demo
      startMockEmotions();
    }
  }, [patientId, setEmotions, setEmotionsConnected]);

  // Mock emotions for demo/offline mode
  const startMockEmotions = useCallback(() => {
    console.log('Starting mock emotions data');
    setEmotionsConnected(true);
    
    const interval = setInterval(() => {
      const mockEmotions: EmotionData = {
        anxiety: 0.3 + Math.random() * 0.5,
        joy: 0.2 + Math.random() * 0.4,
        sadness: 0.1 + Math.random() * 0.3,
        anger: 0.05 + Math.random() * 0.2,
        disgust: 0.02 + Math.random() * 0.15,
        timestamp: new Date().toISOString()
      };
      setEmotions(mockEmotions);
    }, 500);
    
    return () => clearInterval(interval);
  }, [setEmotions, setEmotionsConnected]);

  useEffect(() => {
    if (patientId) {
      // Try real connection first, fallback to mock
      try {
        connect();
      } catch {
        startMockEmotions();
      }
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [patientId, connect, startMockEmotions]);

  return {
    emotions,
    isConnected: isEmotionsConnected,
    reconnect: connect
  };
}
