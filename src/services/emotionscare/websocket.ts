import { getAccessToken, getMockToken } from './auth';
import type { 
  EmotionData, 
  BrainRegionMapping, 
  WSEmotionUpdate, 
  WSAlert 
} from './types';

type EmotionCallback = (data: {
  emotions: EmotionData;
  brainRegions: BrainRegionMapping[];
  timestamp: string;
}) => void;

type AlertCallback = (alert: WSAlert) => void;
type ConnectionCallback = (connected: boolean) => void;
type ErrorCallback = (error: Error) => void;

export interface WebSocketConfig {
  onEmotionUpdate: EmotionCallback;
  onConnectionChange: ConnectionCallback;
  onAlert?: AlertCallback;
  onError?: ErrorCallback;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
}

export class EmotionsCareWebSocket {
  private ws: WebSocket | null = null;
  private patientId: string;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private heartbeatIntervalMs: number;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalClose = false;
  private mockEmotionInterval: ReturnType<typeof setInterval> | null = null;

  constructor(patientId: string, config: WebSocketConfig) {
    this.patientId = patientId;
    this.config = config;
    this.maxReconnectAttempts = config.reconnectAttempts ?? 5;
    this.reconnectDelay = config.reconnectDelay ?? 1000;
    this.heartbeatIntervalMs = config.heartbeatInterval ?? 30000;
  }

  async connect(): Promise<void> {
    this.isIntentionalClose = false;
    
    let token = await getAccessToken();
    if (!token) {
      token = getMockToken();
    }

    const wsUrl = import.meta.env.VITE_EMOTIONSCARE_WS_URL || 'wss://api.emotionscare.app';
    
    try {
      this.ws = new WebSocket(
        `${wsUrl}/api/context-lens/ws/emotions/${this.patientId}?token=${token}`
      );

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.log('[WS] Connection failed, starting mock mode');
      this.startMockMode();
    }
  }

  private handleOpen(): void {
    console.log('[WS] Connected to EmotionsCare');
    this.reconnectAttempts = 0;
    this.config.onConnectionChange(true);
    
    // Subscribe to patient emotions
    this.send({ action: 'subscribe', patient_id: this.patientId });
    
    // Start heartbeat
    this.startHeartbeat();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'emotion_update':
          this.config.onEmotionUpdate({
            emotions: data.emotions,
            brainRegions: data.brain_regions || [],
            timestamp: data.timestamp || new Date().toISOString(),
          });
          break;
          
        case 'subscribed':
          console.log('[WS] Subscribed to patient:', this.patientId);
          break;
          
        case 'alert':
          this.config.onAlert?.(data as WSAlert);
          break;
          
        case 'pong':
          // Heartbeat acknowledged
          break;
          
        case 'error':
          console.error('[WS] Server error:', data.message);
          this.config.onError?.(new Error(data.message));
          break;
          
        default:
          console.log('[WS] Unknown message type:', data.type);
      }
    } catch (err) {
      console.error('[WS] Parse error:', err);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('[WS] Disconnected:', event.code, event.reason);
    this.config.onConnectionChange(false);
    this.stopHeartbeat();
    
    // Don't reconnect if intentional close or auth error
    if (this.isIntentionalClose || event.code === 4001 || event.code === 1000) {
      return;
    }
    
    this.attemptReconnect();
  }

  private handleError(event: Event): void {
    console.error('[WS] Error:', event);
    
    // If WebSocket never connected, fall back to mock mode
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.log('[WS] Starting mock mode due to connection error');
      this.startMockMode();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnect attempts reached, switching to mock mode');
      this.startMockMode();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ action: 'ping' });
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  // Mock mode for demo/offline
  private startMockMode(): void {
    console.log('[WS] Mock mode active');
    this.config.onConnectionChange(true);
    
    // Generate mock emotion updates every 500ms
    this.mockEmotionInterval = setInterval(() => {
      const mockEmotions: EmotionData = {
        anxiety: 0.3 + Math.random() * 0.5,
        joy: 0.2 + Math.random() * 0.4,
        sadness: 0.1 + Math.random() * 0.3,
        anger: 0.05 + Math.random() * 0.2,
        disgust: 0.02 + Math.random() * 0.15,
        timestamp: new Date().toISOString(),
      };
      
      const mockBrainRegions: BrainRegionMapping[] = [
        { 
          region: 'amygdala', 
          emotion: 'anxiety', 
          intensity: mockEmotions.anxiety, 
          color: '#EF4444',
          animation: 'pulse' 
        },
        { 
          region: 'nucleus_accumbens', 
          emotion: 'joy', 
          intensity: mockEmotions.joy, 
          color: '#10B981',
          animation: 'glow' 
        },
        { 
          region: 'prefrontal', 
          emotion: 'sadness', 
          intensity: mockEmotions.sadness, 
          color: '#3B82F6',
          animation: 'fade' 
        },
        { 
          region: 'hypothalamus', 
          emotion: 'anger', 
          intensity: mockEmotions.anger, 
          color: '#F59E0B',
          animation: 'flash' 
        },
        { 
          region: 'insula', 
          emotion: 'disgust', 
          intensity: mockEmotions.disgust, 
          color: '#8B5CF6',
          animation: 'wave' 
        },
      ];
      
      this.config.onEmotionUpdate({
        emotions: mockEmotions,
        brainRegions: mockBrainRegions,
        timestamp: mockEmotions.timestamp,
      });
      
      // Occasionally trigger an alert
      if (mockEmotions.anxiety > 0.8 && Math.random() > 0.7) {
        this.config.onAlert?.({
          type: 'alert',
          level: 'warning',
          message: 'Niveau de stress élevé détecté',
          emotion: 'anxiety',
          value: mockEmotions.anxiety,
        });
      }
    }, 500);
  }

  private stopMockMode(): void {
    if (this.mockEmotionInterval) {
      clearInterval(this.mockEmotionInterval);
      this.mockEmotionInterval = null;
    }
  }

  disconnect(): void {
    this.isIntentionalClose = true;
    this.stopHeartbeat();
    this.stopMockMode();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.config.onConnectionChange(false);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN || this.mockEmotionInterval !== null;
  }

  // Change patient without full reconnect
  async switchPatient(newPatientId: string): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.send({ action: 'unsubscribe', patient_id: this.patientId });
      this.patientId = newPatientId;
      this.send({ action: 'subscribe', patient_id: newPatientId });
    } else {
      this.patientId = newPatientId;
      await this.connect();
    }
  }
}
