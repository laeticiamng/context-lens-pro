import { useState, useEffect, useCallback, useRef } from 'react';
import { Matrix4, Vector3 } from 'three';
import { useAnatomyStore } from '@/stores/anatomyStore';
import { anatomyApi, type AnatomyLandmark } from '@/services/emotionscare/anatomyApi';
import type { BodyLandmark } from './useBodyTracking';
import { POSE_LANDMARKS } from './useBodyTracking';

export interface UseRegistrationResult {
  transformMatrix: Matrix4;
  isCalibrated: boolean;
  calibrationQuality: number;
  recalibrate: () => void;
  isCalibrating: boolean;
}

// Mapping between MediaPipe landmarks and IRM landmarks
const LANDMARK_MAPPING = [
  { body: POSE_LANDMARKS.LEFT_SHOULDER, irl: 'left_shoulder' },
  { body: POSE_LANDMARKS.RIGHT_SHOULDER, irl: 'right_shoulder' },
  { body: POSE_LANDMARKS.LEFT_HIP, irl: 'left_hip' },
  { body: POSE_LANDMARKS.RIGHT_HIP, irl: 'right_hip' },
  { body: POSE_LANDMARKS.NOSE, irl: 'nose' },
];

interface Correspondence {
  body: Vector3;
  irl: Vector3;
}

export function useRegistration(
  patientId: string | null,
  bodyLandmarks: BodyLandmark[] | null
): UseRegistrationResult {
  const [transformMatrix, setTransformMatrix] = useState<Matrix4>(new Matrix4());
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [calibrationQuality, setCalibrationQuality] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [irlLandmarks, setIrlLandmarks] = useState<AnatomyLandmark[] | null>(null);
  
  const setCalibration = useAnatomyStore(state => state.setCalibration);
  const calibratingRef = useRef(false);

  // Fetch IRL landmarks from API
  useEffect(() => {
    if (!patientId) {
      setIrlLandmarks(null);
      return;
    }

    async function fetchLandmarks() {
      try {
        const data = await anatomyApi.getLandmarks(patientId!);
        setIrlLandmarks(data.landmarks);
      } catch (err) {
        console.error('[Registration] Failed to fetch landmarks:', err);
      }
    }

    fetchLandmarks();
  }, [patientId]);

  // Match body landmarks to IRL landmarks
  const matchLandmarks = useCallback((body: BodyLandmark[], irl: AnatomyLandmark[]): Correspondence[] => {
    const correspondences: Correspondence[] = [];

    for (const mapping of LANDMARK_MAPPING) {
      const bodyLm = body[mapping.body];
      const irlLm = irl.find(l => l.landmark_code === mapping.irl);

      if (bodyLm && irlLm && bodyLm.visibility > 0.5 && irlLm.confidence > 0.5) {
        correspondences.push({
          body: new Vector3(bodyLm.x, bodyLm.y, bodyLm.z),
          irl: new Vector3(irlLm.position[0], irlLm.position[1], irlLm.position[2]),
        });
      }
    }

    return correspondences;
  }, []);

  // Compute transformation matrix using Procrustes analysis
  const computeTransformation = useCallback((correspondences: Correspondence[]): Matrix4 => {
    const matrix = new Matrix4();
    
    if (correspondences.length < 3) {
      return matrix;
    }

    // Calculate centroids
    const bodyCentroid = new Vector3();
    const irlCentroid = new Vector3();

    correspondences.forEach(c => {
      bodyCentroid.add(c.body);
      irlCentroid.add(c.irl);
    });

    bodyCentroid.divideScalar(correspondences.length);
    irlCentroid.divideScalar(correspondences.length);

    // Calculate scale
    let bodyScale = 0;
    let irlScale = 0;

    correspondences.forEach(c => {
      bodyScale += c.body.clone().sub(bodyCentroid).lengthSq();
      irlScale += c.irl.clone().sub(irlCentroid).lengthSq();
    });

    const scale = Math.sqrt(bodyScale / irlScale);

    // For simplicity, we'll use translation and uniform scale
    // In production, you'd use a full SVD-based Procrustes for rotation
    const translation = new Vector3()
      .copy(bodyCentroid)
      .sub(irlCentroid.clone().multiplyScalar(scale));

    // Construct transformation matrix
    matrix.makeScale(scale, scale, scale);
    matrix.setPosition(translation);

    return matrix;
  }, []);

  // Calibrate
  const calibrate = useCallback(() => {
    if (!bodyLandmarks || !irlLandmarks || calibratingRef.current) return;

    calibratingRef.current = true;
    setIsCalibrating(true);

    // Match landmarks
    const correspondences = matchLandmarks(bodyLandmarks, irlLandmarks);

    if (correspondences.length < 3) {
      setCalibrationQuality(correspondences.length / 3);
      setIsCalibrating(false);
      calibratingRef.current = false;
      return;
    }

    // Compute transformation
    const matrix = computeTransformation(correspondences);
    setTransformMatrix(matrix);
    setIsCalibrated(true);
    setCalibrationQuality(Math.min(1, correspondences.length / 5));
    setCalibration(true, Math.min(1, correspondences.length / 5), matrix);

    console.log('[Registration] Calibration complete, quality:', correspondences.length / 5);

    setIsCalibrating(false);
    calibratingRef.current = false;
  }, [bodyLandmarks, irlLandmarks, matchLandmarks, computeTransformation, setCalibration]);

  // Auto-calibrate when data is ready
  useEffect(() => {
    if (bodyLandmarks && irlLandmarks && !isCalibrated) {
      // Small delay to allow landmarks to stabilize
      const timer = setTimeout(calibrate, 500);
      return () => clearTimeout(timer);
    }
  }, [bodyLandmarks, irlLandmarks, isCalibrated, calibrate]);

  // Continuous tracking update (update transformation each frame)
  useEffect(() => {
    if (!isCalibrated || !bodyLandmarks || !irlLandmarks) return;

    const correspondences = matchLandmarks(bodyLandmarks, irlLandmarks);
    if (correspondences.length >= 3) {
      const matrix = computeTransformation(correspondences);
      setTransformMatrix(matrix);
    }
  }, [bodyLandmarks, isCalibrated, irlLandmarks, matchLandmarks, computeTransformation]);

  // Recalibrate function
  const recalibrate = useCallback(() => {
    setIsCalibrated(false);
    setCalibrationQuality(0);
    setCalibration(false, 0);
    
    // Trigger recalibration
    setTimeout(calibrate, 100);
  }, [calibrate, setCalibration]);

  return {
    transformMatrix,
    isCalibrated,
    calibrationQuality,
    recalibrate,
    isCalibrating,
  };
}
