import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use ref to track last zone to prevent unnecessary updates
  const lastZoneRef = useRef<BodyZone | null>(null);

  // Calculate zone based on gaze (simulated)
  const calculateGazeZone = useCallback((landmarks: BodyLandmark[]): BodyZone | null => {
    if (!landmarks || landmarks.length < 33) return null;

    // Get key landmark Y positions (normalized 0-1, top to bottom)
    const noseY = landmarks[POSE_LANDMARKS.NOSE].y;
    const shoulderY = (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2;
    const hipY = (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2;
    const kneeY = (landmarks[POSE_LANDMARKS.LEFT_KNEE].y + landmarks[POSE_LANDMARKS.RIGHT_KNEE].y) / 2;

    // Simulate gaze direction (center of view for devices without eye tracking)
    const gazeY = 0.4;

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
      if (manualZone !== lastZoneRef.current) {
        setCurrentZone(manualZone);
        lastZoneRef.current = manualZone;
      }
      
      if (bodyLandmarks) {
        setGazePoint(getZoneCenter(manualZone, bodyLandmarks));
      }
      return;
    }

    if (!bodyLandmarks) {
      if (currentZone !== null) {
        setCurrentZone(null);
        lastZoneRef.current = null;
      }
      setGazePoint(null);
      return;
    }

    const zone = calculateGazeZone(bodyLandmarks);
    
    // Only update if zone changed
    if (zone !== lastZoneRef.current) {
      setCurrentZone(zone);
      lastZoneRef.current = zone;
    }

    if (zone) {
      setGazePoint(getZoneCenter(zone, bodyLandmarks));
    } else {
      setGazePoint(null);
    }
  }, [bodyLandmarks, manualZone, calculateGazeZone, getZoneCenter, currentZone]);

  const adjacentZones = currentZone ? ZONE_ADJACENCY[currentZone] : [];

  const setManualZone = useCallback((zone: BodyZone) => {
    setManualZoneState(zone);
    // Clear manual override after 10 seconds
    setTimeout(() => {
      setManualZoneState(null);
    }, 10000);
  }, []);

  return {
    currentZone,
    gazePoint,
    adjacentZones,
    setManualZone,
  };
}
