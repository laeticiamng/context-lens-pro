import { create } from 'zustand';
import type { 
  Patient, 
  EmotionData, 
  BrainRegionMapping,
  VitalSigns,
  Note 
} from '@/services/emotionscare/types';

// ============ EMOTIONSCARE STORE ============

interface EmotionsCareState {
  // Current patient
  currentPatient: Patient | null;
  setCurrentPatient: (patient: Patient | null) => void;

  // Emotions
  currentEmotions: EmotionData | null;
  brainRegions: BrainRegionMapping[];
  setEmotions: (emotions: EmotionData, regions: BrainRegionMapping[]) => void;

  // Vitals
  vitals: VitalSigns | null;
  setVitals: (vitals: VitalSigns | null) => void;

  // Connection state
  isConnected: boolean;
  setConnected: (connected: boolean) => void;

  // Session notes
  sessionNotes: Note[];
  addSessionNote: (note: Note) => void;
  clearSessionNotes: () => void;

  // AR view state
  showEmotionOverlay: boolean;
  toggleEmotionOverlay: () => void;
  setEmotionOverlay: (show: boolean) => void;

  // Focused region
  focusedRegion: string | null;
  setFocusedRegion: (region: string | null) => void;

  // View settings
  viewAngle: 'axial' | 'sagittal' | 'coronal' | 'default';
  setViewAngle: (angle: 'axial' | 'sagittal' | 'coronal' | 'default') => void;

  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Alerts
  alerts: string[];
  addAlert: (alert: string) => void;
  dismissAlert: (alert: string) => void;
  clearAlerts: () => void;

  // Session management
  sessionId: string | null;
  startSession: (patientId: string) => void;
  endSession: () => void;

  // Reset
  reset: () => void;
}

const initialState = {
  currentPatient: null,
  currentEmotions: null,
  brainRegions: [],
  vitals: null,
  isConnected: false,
  sessionNotes: [],
  showEmotionOverlay: true,
  focusedRegion: null,
  viewAngle: 'default' as const,
  zoomLevel: 1,
  alerts: [],
  sessionId: null,
};

export const useEmotionsCareStore = create<EmotionsCareState>((set, get) => ({
  ...initialState,

  // Patient
  setCurrentPatient: (patient) => set({ currentPatient: patient }),

  // Emotions
  setEmotions: (emotions, regions) => {
    const currentAlerts = get().alerts;
    const newAlerts = [...currentAlerts];

    // Check for high anxiety alert
    if (emotions.anxiety > 0.8 && !currentAlerts.includes('Niveau de stress élevé')) {
      newAlerts.push('Niveau de stress élevé');
    }

    set({ 
      currentEmotions: emotions, 
      brainRegions: regions,
      alerts: newAlerts,
    });
  },

  // Vitals
  setVitals: (vitals) => set({ vitals }),

  // Connection
  setConnected: (connected) => set({ isConnected: connected }),

  // Notes
  addSessionNote: (note) => set((state) => ({
    sessionNotes: [...state.sessionNotes, note],
  })),
  clearSessionNotes: () => set({ sessionNotes: [] }),

  // Overlay
  toggleEmotionOverlay: () => set((state) => ({ 
    showEmotionOverlay: !state.showEmotionOverlay,
  })),
  setEmotionOverlay: (show) => set({ showEmotionOverlay: show }),

  // Focus
  setFocusedRegion: (region) => set({ focusedRegion: region }),

  // View
  setViewAngle: (angle) => set({ viewAngle: angle }),
  setZoomLevel: (level) => set({ zoomLevel: Math.max(0.5, Math.min(3, level)) }),

  // Alerts
  addAlert: (alert) => set((state) => ({
    alerts: state.alerts.includes(alert) ? state.alerts : [...state.alerts, alert],
  })),
  dismissAlert: (alert) => set((state) => ({
    alerts: state.alerts.filter(a => a !== alert),
  })),
  clearAlerts: () => set({ alerts: [] }),

  // Session
  startSession: (patientId) => set({
    sessionId: `session-${patientId}-${Date.now()}`,
    sessionNotes: [],
    alerts: [],
  }),
  endSession: () => set({
    sessionId: null,
    currentPatient: null,
    currentEmotions: null,
    brainRegions: [],
    vitals: null,
    isConnected: false,
    focusedRegion: null,
    viewAngle: 'default',
    zoomLevel: 1,
  }),

  // Reset
  reset: () => set(initialState),
}));

// ============ SELECTORS ============

export const selectDominantEmotion = (state: EmotionsCareState) => {
  if (!state.currentEmotions) return null;
  
  const emotions = state.currentEmotions;
  let dominant = { name: '', value: 0 };
  
  for (const [key, value] of Object.entries(emotions)) {
    if (key !== 'timestamp' && typeof value === 'number' && value > dominant.value) {
      dominant = { name: key, value };
    }
  }
  
  return dominant.name ? dominant : null;
};

export const selectActiveRegions = (state: EmotionsCareState) => {
  return state.brainRegions.filter(r => r.intensity > 0.3);
};

export const selectHasHighStress = (state: EmotionsCareState) => {
  return state.currentEmotions?.anxiety ? state.currentEmotions.anxiety > 0.7 : false;
};
