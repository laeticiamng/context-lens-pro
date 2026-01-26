// EmotionsCare API Client Module
// Provides REST API and WebSocket connectivity for Context-Lens-Pro

export { apiClient } from './client';
export { emotionsCareApi } from './api';
export { EmotionsCareWebSocket } from './websocket';
export type { WebSocketConfig } from './websocket';

// Auth functions
export {
  login,
  logout,
  getAccessToken,
  refreshAccessToken,
  isAuthenticated,
  clearTokens,
  setMockToken,
} from './auth';

// Types
export type {
  // Patient
  Patient,
  PatientSearchResult,
  Assessment,
  
  // Brain
  BrainRegion,
  BrainMeshResponse,
  
  // Emotions
  EmotionData,
  BrainRegionMapping,
  EmotionWithBrainMapping,
  EmotionHistory,
  
  // Notes
  Note,
  ARContext,
  
  // Reports
  ReportConfig,
  ReportStatus,
  
  // Vitals
  VitalSigns,
  
  // Auth
  AuthTokens,
  AuthUser,
  
  // WebSocket
  WSMessageType,
  WSMessage,
  WSEmotionUpdate,
  WSAlert,
  
  // Errors
  ApiError,
} from './types';
