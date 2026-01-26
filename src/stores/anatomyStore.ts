import { create } from 'zustand';
import type { AnatomicalStructure, BodyZone, OrganSystem } from '@/services/emotionscare/anatomyApi';
import { Matrix4 } from 'three';

interface LoadedOrgan {
  structure: AnatomicalStructure;
  meshUrl: string;
  isLoading: boolean;
  loadedAt: number;
}

interface AnatomyState {
  // Patient context
  patientId: string | null;
  setPatientId: (id: string | null) => void;

  // Body tracking
  isTracking: boolean;
  trackingConfidence: number;
  setTracking: (isTracking: boolean, confidence: number) => void;

  // Gaze zone
  currentZone: BodyZone | null;
  adjacentZones: BodyZone[];
  setCurrentZone: (zone: BodyZone | null, adjacent: BodyZone[]) => void;

  // Registration
  isCalibrated: boolean;
  calibrationQuality: number;
  transformMatrix: Matrix4;
  setCalibration: (calibrated: boolean, quality: number, matrix?: Matrix4) => void;

  // Loaded organs
  loadedOrgans: Map<string, LoadedOrgan>;
  addLoadedOrgan: (code: string, organ: LoadedOrgan) => void;
  removeLoadedOrgan: (code: string) => void;
  clearLoadedOrgans: () => void;

  // Focus
  focusedOrgan: string | null;
  setFocusedOrgan: (code: string | null) => void;

  // Visibility
  hiddenOrgans: Set<string>;
  hideOrgan: (code: string) => void;
  showOrgan: (code: string) => void;
  showAllOrgans: () => void;

  // Filters
  activeSystem: OrganSystem | null;
  setActiveSystem: (system: OrganSystem | null) => void;

  // View mode
  viewMode: 'overlay' | 'isolated' | 'comparison';
  setViewMode: (mode: 'overlay' | 'isolated' | 'comparison') => void;

  // Opacity
  globalOpacity: number;
  setGlobalOpacity: (opacity: number) => void;

  // Slice view
  sliceView: 'none' | 'axial' | 'sagittal' | 'coronal';
  setSliceView: (view: 'none' | 'axial' | 'sagittal' | 'coronal') => void;

  // Comparison mode
  comparisonScanId: string | null;
  setComparisonScan: (scanId: string | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  patientId: null,
  isTracking: false,
  trackingConfidence: 0,
  currentZone: null,
  adjacentZones: [],
  isCalibrated: false,
  calibrationQuality: 0,
  transformMatrix: new Matrix4(),
  loadedOrgans: new Map<string, LoadedOrgan>(),
  focusedOrgan: null,
  hiddenOrgans: new Set<string>(),
  activeSystem: null,
  viewMode: 'overlay' as const,
  globalOpacity: 1,
  sliceView: 'none' as const,
  comparisonScanId: null,
};

export const useAnatomyStore = create<AnatomyState>((set, get) => ({
  ...initialState,

  setPatientId: (id) => set({ patientId: id }),

  setTracking: (isTracking, confidence) => set({ 
    isTracking, 
    trackingConfidence: confidence 
  }),

  setCurrentZone: (zone, adjacent) => set({ 
    currentZone: zone, 
    adjacentZones: adjacent 
  }),

  setCalibration: (calibrated, quality, matrix) => set({
    isCalibrated: calibrated,
    calibrationQuality: quality,
    transformMatrix: matrix || get().transformMatrix,
  }),

  addLoadedOrgan: (code, organ) => {
    const newMap = new Map(get().loadedOrgans);
    newMap.set(code, organ);
    set({ loadedOrgans: newMap });
  },

  removeLoadedOrgan: (code) => {
    const newMap = new Map(get().loadedOrgans);
    newMap.delete(code);
    set({ loadedOrgans: newMap });
  },

  clearLoadedOrgans: () => set({ loadedOrgans: new Map() }),

  setFocusedOrgan: (code) => set({ focusedOrgan: code }),

  hideOrgan: (code) => {
    const newSet = new Set(get().hiddenOrgans);
    newSet.add(code);
    set({ hiddenOrgans: newSet });
  },

  showOrgan: (code) => {
    const newSet = new Set(get().hiddenOrgans);
    newSet.delete(code);
    set({ hiddenOrgans: newSet });
  },

  showAllOrgans: () => set({ hiddenOrgans: new Set() }),

  setActiveSystem: (system) => set({ activeSystem: system }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setGlobalOpacity: (opacity) => set({ globalOpacity: Math.max(0, Math.min(1, opacity)) }),

  setSliceView: (view) => set({ sliceView: view }),

  setComparisonScan: (scanId) => set({ comparisonScanId: scanId }),

  reset: () => set({
    ...initialState,
    loadedOrgans: new Map(),
    hiddenOrgans: new Set(),
    transformMatrix: new Matrix4(),
  }),
}));

// Selectors
export const selectVisibleOrgans = (state: AnatomyState) => {
  const visible: LoadedOrgan[] = [];
  state.loadedOrgans.forEach((organ, code) => {
    if (!state.hiddenOrgans.has(code)) {
      if (!state.activeSystem || organ.structure.structure_category === state.activeSystem) {
        visible.push(organ);
      }
    }
  });
  return visible;
};

export const selectOrganByCode = (code: string) => (state: AnatomyState) => 
  state.loadedOrgans.get(code);
