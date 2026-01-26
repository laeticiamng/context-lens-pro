import { useState, useEffect, useCallback } from 'react';
import { useAnatomyStore } from '@/stores/anatomyStore';
import type { BodyLandmark } from './useBodyTracking';
import { POSE_LANDMARKS } from './useBodyTracking';
import type { BodyZone } from '@/services/emotionscare/anatomyApi';

export interface UseGazeZoneResult {
  currentZone: BodyZone | null;
  gazePoint: { x: number; y: number; z: number } | null;
  adjacentZones: BodyZone[];
  setManualZone: (zone: BodyZone) => void;
}

// Zone adjacency map for preloading
const ZONE_ADJACENCY: Record<BodyZone, BodyZone[]> = {
  head: ['thorax'],
  thorax: ['head', 'abdomen'],
  abdomen: ['thorax', 'pelvis'],
  pelvis: ['abdomen', 'lower_limb'],
  upper_limb: ['thorax'],
  lower_limb: ['pelvis'],
};

// Organs to load for each zone
export const ZONE_ORGANS: Record<BodyZone, string[]> = {
  head: ['BRAIN', 'SKULL'],
  thorax: ['HEART', 'LUNG_L', 'LUNG_R', 'AORTA', 'RIBS'],
  abdomen: ['LIVER', 'SPLEEN', 'STOMACH', 'KIDNEY_L', 'KIDNEY_R'],
  pelvis: ['BLADDER', 'PELVIS'],
  upper_limb: [],
  lower_limb: [],
};

export function useGazeZone(bodyLandmarks: BodyLandmark[] | null): UseGazeZoneResult {
  const [currentZone, setCurrentZone] = useState<BodyZone | null>(null);
  const [gazePoint, setGazePoint] = useState<{ x: number; y: number; z: number } | null>(null);
  const [manualZone, setManualZoneState] = useState<BodyZone | null>(null);
  
  const setStoreZone = useAnatomyStore(state => state.setCurrentZone);

  // Calculate zone based on gaze (simulated)
  const calculateGazeZone = useCallback((landmarks: BodyLandmark[]): BodyZone | null => {
    if (!landmarks || landmarks.length < 33) return null;

    // Get key landmark Y positions (normalized 0-1, top to bottom)
    const noseY = landmarks[POSE_LANDMARKS.NOSE].y;
    const shoulderY = (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2;
    const hipY = (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2;
    const kneeY = (landmarks[POSE_LANDMARKS.LEFT_KNEE].y + landmarks[POSE_LANDMARKS.RIGHT_KNEE].y) / 2;

    // Simulate gaze direction (center of view for devices without eye tracking)
    // In real implementation, this would come from WebXR eye tracking API
    const gazeY = 0.4; // Looking at upper body area by default

    // Determine zone based on gaze Y position relative to body landmarks
    if (gazeY < noseY + 0.05) {
      return 'head';
    } else if (gazeY < shoulderY + 0.1) {
      return 'thorax';
    } else if (gazeY < hipY) {
      return 'abdomen';
    } else if (gazeY < kneeY) {
      return 'pelvis';
    } else {
      return 'lower_limb';
    }
  }, []);

  // Get zone center for HUD positioning
  const getZoneCenter = useCallback((zone: BodyZone, landmarks: BodyLandmark[]): { x: number; y: number; z: number } => {
    switch (zone) {
      case 'head':
        return landmarks[POSE_LANDMARKS.NOSE];
      
      case 'thorax':
        return {
          x: (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].x) / 2,
          y: (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.LEFT_HIP].y) / 2,
          z: 0,
        };
      
      case 'abdomen':
        return {
          x: (landmarks[POSE_LANDMARKS.LEFT_HIP].x + landmarks[POSE_LANDMARKS.RIGHT_HIP].x) / 2,
          y: ((landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2 + 
              (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2) / 2,
          z: 0,
        };
      
      case 'pelvis':
        return {
          x: (landmarks[POSE_LANDMARKS.LEFT_HIP].x + landmarks[POSE_LANDMARKS.RIGHT_HIP].x) / 2,
          y: (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2,
          z: 0,
        };
      
      case 'upper_limb':
        return landmarks[POSE_LANDMARKS.LEFT_ELBOW];
      
      case 'lower_limb':
        return landmarks[POSE_LANDMARKS.LEFT_KNEE];
      
      default:
        return { x: 0.5, y: 0.5, z: 0 };
    }
  }, []);

  // Update zone when landmarks or manual zone changes
  useEffect(() => {
    if (manualZone) {
      setCurrentZone(manualZone);
      setStoreZone(manualZone, ZONE_ADJACENCY[manualZone]);
      
      if (bodyLandmarks) {
        setGazePoint(getZoneCenter(manualZone, bodyLandmarks));
      }
      return;
    }

    if (!bodyLandmarks) {
      setCurrentZone(null);
      setGazePoint(null);
      setStoreZone(null, []);
      return;
    }

    const zone = calculateGazeZone(bodyLandmarks);
    setCurrentZone(zone);

    if (zone) {
      setGazePoint(getZoneCenter(zone, bodyLandmarks));
      setStoreZone(zone, ZONE_ADJACENCY[zone]);
    } else {
      setGazePoint(null);
      setStoreZone(null, []);
    }
  }, [bodyLandmarks, manualZone, calculateGazeZone, getZoneCenter, setStoreZone]);

  const adjacentZones = currentZone ? ZONE_ADJACENCY[currentZone] : [];

  const setManualZone = useCallback((zone: BodyZone) => {
    setManualZoneState(zone);
  }, []);

  return {
    currentZone,
    gazePoint,
    adjacentZones,
    setManualZone,
  };
}
