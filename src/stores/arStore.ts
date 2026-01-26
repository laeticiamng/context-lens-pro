import { create } from 'zustand';

export type EmotionType = 'anxiety' | 'joy' | 'sadness' | 'anger' | 'disgust';

export interface EmotionData {
  anxiety: number;
  joy: number;
  sadness: number;
  anger: number;
  disgust: number;
  timestamp: string;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  lastSession: string;
  diagnosis?: string;
}

export interface VitalSigns {
  heartRate: number;
  stressLevel: number;
  timestamp: string;
}

export interface ARNote {
  id: string;
  text: string;
  timestamp: string;
  region?: string;
}

export type ViewAngle = 'axial' | 'sagittal' | 'coronal' | 'default';

interface ARState {
  // Session
  isARActive: boolean;
  isLoading: boolean;
  deviceType: 'quest' | 'smartphone' | 'hololens' | 'desktop' | null;
  
  // Patient
  currentPatient: PatientData | null;
  
  // Emotions
  emotions: EmotionData | null;
  isEmotionsConnected: boolean;
  showOverlay: boolean;
  
  // Brain
  focusedRegion: string | null;
  zoomLevel: number;
  viewAngle: ViewAngle;
  brainMeshUrl: string | null;
  
  // HUD
  showHUD: boolean;
  vitalSigns: VitalSigns | null;
  alerts: string[];
  
  // Voice
  isListening: boolean;
  lastCommand: string | null;
  voiceLanguage: 'fr-FR' | 'en-US';
  
  // Notes
  notes: ARNote[];
  
  // Actions
  setARActive: (active: boolean) => void;
  setLoading: (loading: boolean) => void;
  setDeviceType: (type: ARState['deviceType']) => void;
  setCurrentPatient: (patient: PatientData | null) => void;
  setEmotions: (emotions: EmotionData | null) => void;
  setEmotionsConnected: (connected: boolean) => void;
  toggleOverlay: () => void;
  setFocusedRegion: (region: string | null) => void;
  setZoomLevel: (level: number) => void;
  setViewAngle: (angle: ViewAngle) => void;
  setBrainMeshUrl: (url: string | null) => void;
  toggleHUD: () => void;
  setVitalSigns: (vitals: VitalSigns | null) => void;
  addAlert: (alert: string) => void;
  clearAlerts: () => void;
  setListening: (listening: boolean) => void;
  setLastCommand: (command: string | null) => void;
  setVoiceLanguage: (lang: 'fr-FR' | 'en-US') => void;
  addNote: (note: Omit<ARNote, 'id' | 'timestamp'>) => void;
  resetSession: () => void;
}

export const useARStore = create<ARState>((set) => ({
  // Initial state
  isARActive: false,
  isLoading: false,
  deviceType: null,
  currentPatient: null,
  emotions: null,
  isEmotionsConnected: false,
  showOverlay: true,
  focusedRegion: null,
  zoomLevel: 1,
  viewAngle: 'default',
  brainMeshUrl: null,
  showHUD: true,
  vitalSigns: null,
  alerts: [],
  isListening: false,
  lastCommand: null,
  voiceLanguage: 'fr-FR',
  notes: [],
  
  // Actions
  setARActive: (active) => set({ isARActive: active }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDeviceType: (type) => set({ deviceType: type }),
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  setEmotions: (emotions) => set((state) => {
    // Check for high anxiety alert
    if (emotions && emotions.anxiety > 0.8 && !state.alerts.includes('Stress élevé détecté')) {
      return { emotions, alerts: [...state.alerts, 'Stress élevé détecté'] };
    }
    return { emotions };
  }),
  setEmotionsConnected: (connected) => set({ isEmotionsConnected: connected }),
  toggleOverlay: () => set((state) => ({ showOverlay: !state.showOverlay })),
  setFocusedRegion: (region) => set({ focusedRegion: region }),
  setZoomLevel: (level) => set({ zoomLevel: Math.max(0.5, Math.min(3, level)) }),
  setViewAngle: (angle) => set({ viewAngle: angle }),
  setBrainMeshUrl: (url) => set({ brainMeshUrl: url }),
  toggleHUD: () => set((state) => ({ showHUD: !state.showHUD })),
  setVitalSigns: (vitals) => set({ vitalSigns: vitals }),
  addAlert: (alert) => set((state) => ({ 
    alerts: state.alerts.includes(alert) ? state.alerts : [...state.alerts, alert] 
  })),
  clearAlerts: () => set({ alerts: [] }),
  setListening: (listening) => set({ isListening: listening }),
  setLastCommand: (command) => set({ lastCommand: command }),
  setVoiceLanguage: (lang) => set({ voiceLanguage: lang }),
  addNote: (note) => set((state) => ({
    notes: [...state.notes, {
      ...note,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }]
  })),
  resetSession: () => set({
    isARActive: false,
    isLoading: false,
    currentPatient: null,
    emotions: null,
    isEmotionsConnected: false,
    focusedRegion: null,
    zoomLevel: 1,
    viewAngle: 'default',
    vitalSigns: null,
    alerts: [],
    notes: [],
    lastCommand: null
  })
}));
