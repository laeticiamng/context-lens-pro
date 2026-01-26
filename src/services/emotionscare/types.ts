// ============ PATIENT TYPES ============

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O';
  email?: string;
  phone?: string;
  diagnosis?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientSearchResult {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  last_visit?: string;
  thumbnail_url?: string;
  diagnosis?: string;
}

export interface Assessment {
  id: string;
  patient_id: string;
  type: string;
  score: number;
  date: string;
  notes?: string;
}

// ============ BRAIN TYPES ============

export interface BrainRegion {
  id: string;
  region_code: string;
  region_name: string;
  hemisphere: 'Left' | 'Right' | 'Bilateral';
  volume_mm3?: number;
  default_color: string;
  position: [number, number, number];
}

export interface BrainMeshResponse {
  mesh_url: string;
  format: 'gltf' | 'obj';
  lod: 'high' | 'medium' | 'low';
  regions: BrainRegion[];
  patient_id: string;
}

// ============ EMOTION TYPES ============

export interface EmotionData {
  anxiety: number;
  joy: number;
  sadness: number;
  anger: number;
  disgust: number;
  surprise?: number;
  timestamp: string;
  [key: string]: number | string | undefined;
}

export interface BrainRegionMapping {
  region: string;
  emotion: string;
  intensity: number;
  color: string;
  animation: 'pulse' | 'glow' | 'fade' | 'flash' | 'wave';
}

export interface EmotionWithBrainMapping {
  timestamp: string;
  emotions: EmotionData;
  dominant: string;
  brain_regions: BrainRegionMapping[];
}

export interface EmotionHistory {
  data: Array<{
    timestamp: string;
    emotions: EmotionData;
  }>;
  interval: 'hour' | 'day' | 'week';
  patient_id: string;
}

// ============ NOTES TYPES ============

export interface Note {
  id: string;
  patient_id: string;
  content: string;
  source: 'context-lens' | 'emotionscare' | 'manual';
  ar_context?: ARContext;
  created_at: string;
  created_by: string;
}

export interface ARContext {
  focused_region?: string;
  view_angle?: 'axial' | 'sagittal' | 'coronal' | 'default';
  zoom_level?: number;
  emotions_snapshot?: EmotionData;
  session_id?: string;
}

// ============ REPORT TYPES ============

export interface ReportConfig {
  include_3d_captures?: boolean;
  include_emotion_graphs?: boolean;
  include_assessments?: boolean;
  date_range?: {
    from: string;
    to: string;
  };
  clinician_notes?: string;
  format?: 'pdf' | 'docx';
}

export interface ReportStatus {
  id: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  progress?: number;
  file_url?: string;
  error?: string;
  created_at: string;
}

// ============ AUTH TYPES ============

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'clinician' | 'admin' | 'viewer';
}

// ============ WEBSOCKET TYPES ============

export type WSMessageType = 
  | 'emotion_update'
  | 'subscribed'
  | 'unsubscribed'
  | 'pong'
  | 'error'
  | 'alert';

export interface WSMessage {
  type: WSMessageType;
  payload?: unknown;
  timestamp: string;
}

export interface WSEmotionUpdate {
  type: 'emotion_update';
  emotions: EmotionData;
  brain_regions: BrainRegionMapping[];
  timestamp: string;
}

export interface WSAlert {
  type: 'alert';
  level: 'info' | 'warning' | 'critical';
  message: string;
  emotion?: string;
  value?: number;
}

// ============ API ERROR TYPES ============

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

// ============ VITALS TYPES ============

export interface VitalSigns {
  heart_rate: number;
  stress_level: number;
  respiratory_rate?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  timestamp: string;
}
