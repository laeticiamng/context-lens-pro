import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnatomyStore } from '@/stores/anatomyStore';

export interface BodyLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface UseBodyTrackingResult {
  bodyLandmarks: BodyLandmark[] | null;
  isTracking: boolean;
  trackingConfidence: number;
  error: Error | null;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

// MediaPipe Pose landmarks indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

export function useBodyTracking(): UseBodyTrackingResult {
  const [bodyLandmarks, setBodyLandmarks] = useState<BodyLandmark[] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingConfidence, setTrackingConfidence] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const setTracking = useAnatomyStore(state => state.setTracking);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  // Mock pose detection for demo (real implementation would use MediaPipe)
  const generateMockLandmarks = useCallback((): BodyLandmark[] => {
    const time = Date.now() / 1000;
    const breathingOffset = Math.sin(time * 0.5) * 0.01;
    const swayOffset = Math.sin(time * 0.3) * 0.005;

    // Generate 33 landmarks with slight movement
    const baseLandmarks: BodyLandmark[] = [
      // Head
      { x: 0.5 + swayOffset, y: 0.15, z: 0, visibility: 0.98 }, // nose
      { x: 0.48, y: 0.12, z: 0, visibility: 0.95 }, // left eye inner
      { x: 0.47, y: 0.12, z: 0, visibility: 0.96 }, // left eye
      { x: 0.46, y: 0.12, z: 0, visibility: 0.94 }, // left eye outer
      { x: 0.52, y: 0.12, z: 0, visibility: 0.95 }, // right eye inner
      { x: 0.53, y: 0.12, z: 0, visibility: 0.96 }, // right eye
      { x: 0.54, y: 0.12, z: 0, visibility: 0.94 }, // right eye outer
      { x: 0.42, y: 0.14, z: 0, visibility: 0.92 }, // left ear
      { x: 0.58, y: 0.14, z: 0, visibility: 0.92 }, // right ear
      { x: 0.48, y: 0.18, z: 0, visibility: 0.90 }, // mouth left
      { x: 0.52, y: 0.18, z: 0, visibility: 0.90 }, // mouth right
      
      // Shoulders
      { x: 0.35 + swayOffset, y: 0.28 + breathingOffset, z: 0, visibility: 0.95 }, // left shoulder
      { x: 0.65 + swayOffset, y: 0.28 + breathingOffset, z: 0, visibility: 0.95 }, // right shoulder
      
      // Arms
      { x: 0.28, y: 0.40, z: 0, visibility: 0.88 }, // left elbow
      { x: 0.72, y: 0.40, z: 0, visibility: 0.88 }, // right elbow
      { x: 0.25, y: 0.52, z: 0, visibility: 0.85 }, // left wrist
      { x: 0.75, y: 0.52, z: 0, visibility: 0.85 }, // right wrist
      { x: 0.24, y: 0.54, z: 0, visibility: 0.82 }, // left pinky
      { x: 0.76, y: 0.54, z: 0, visibility: 0.82 }, // right pinky
      { x: 0.25, y: 0.55, z: 0, visibility: 0.83 }, // left index
      { x: 0.75, y: 0.55, z: 0, visibility: 0.83 }, // right index
      { x: 0.26, y: 0.53, z: 0, visibility: 0.81 }, // left thumb
      { x: 0.74, y: 0.53, z: 0, visibility: 0.81 }, // right thumb
      
      // Hips
      { x: 0.40 + swayOffset, y: 0.55, z: 0, visibility: 0.92 }, // left hip
      { x: 0.60 + swayOffset, y: 0.55, z: 0, visibility: 0.92 }, // right hip
      
      // Legs
      { x: 0.38, y: 0.72, z: 0, visibility: 0.88 }, // left knee
      { x: 0.62, y: 0.72, z: 0, visibility: 0.88 }, // right knee
      { x: 0.37, y: 0.90, z: 0, visibility: 0.85 }, // left ankle
      { x: 0.63, y: 0.90, z: 0, visibility: 0.85 }, // right ankle
      { x: 0.36, y: 0.93, z: 0, visibility: 0.82 }, // left heel
      { x: 0.64, y: 0.93, z: 0, visibility: 0.82 }, // right heel
      { x: 0.38, y: 0.95, z: 0, visibility: 0.80 }, // left foot index
      { x: 0.62, y: 0.95, z: 0, visibility: 0.80 }, // right foot index
    ];

    return baseLandmarks;
  }, []);

  const startTracking = useCallback(async () => {
    if (isRunningRef.current) return;

    try {
      setError(null);
      isRunningRef.current = true;

      // Try to get camera access for real tracking
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 }
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        videoRef.current = video;
        streamRef.current = stream;

        // In production, initialize MediaPipe Pose here
        // For demo, use mock data
        console.log('[BodyTracking] Camera access granted, using mock tracking for demo');
      } catch (cameraError) {
        console.log('[BodyTracking] Camera access denied, using mock tracking');
      }

      // Start detection loop (mock for demo)
      const detect = () => {
        if (!isRunningRef.current) return;

        const landmarks = generateMockLandmarks();
        setBodyLandmarks(landmarks);
        setIsTracking(true);

        // Calculate average confidence
        const avgConfidence = landmarks.reduce((sum, lm) => sum + lm.visibility, 0) / landmarks.length;
        setTrackingConfidence(avgConfidence);
        setTracking(true, avgConfidence);

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      setError(err as Error);
      isRunningRef.current = false;
    }
  }, [generateMockLandmarks, setTracking]);

  const stopTracking = useCallback(() => {
    isRunningRef.current = false;
    setIsTracking(false);
    setTracking(false, 0);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current = null;
    }
  }, [setTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    bodyLandmarks,
    isTracking,
    trackingConfidence,
    error,
    startTracking,
    stopTracking,
  };
}

// Helper function to get body region from landmarks
export function getBodyRegion(landmarks: BodyLandmark[], region: 'shoulders' | 'hips' | 'head'): { x: number; y: number; z: number } {
  switch (region) {
    case 'head':
      return landmarks[POSE_LANDMARKS.NOSE];
    case 'shoulders':
      const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      return {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
        z: (leftShoulder.z + rightShoulder.z) / 2,
      };
    case 'hips':
      const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
      const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
      return {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2,
        z: (leftHip.z + rightHip.z) / 2,
      };
  }
}
