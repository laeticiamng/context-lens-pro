import { useMemo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { BodyLandmark } from '@/hooks/anatomy/useBodyTracking';
import { POSE_LANDMARKS } from '@/hooks/anatomy/useBodyTracking';

interface BodyTrackerProps {
  landmarks: BodyLandmark[] | null;
  visible?: boolean;
  color?: string;
}

// Skeleton connections
const SKELETON_CONNECTIONS = [
  // Torso
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP],
  
  // Left arm
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  
  // Right arm
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  
  // Left leg
  [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
  [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.LEFT_ANKLE],
  
  // Right leg
  [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
  [POSE_LANDMARKS.RIGHT_KNEE, POSE_LANDMARKS.RIGHT_ANKLE],
];

// Key landmarks to highlight
const KEY_LANDMARKS = [
  POSE_LANDMARKS.NOSE,
  POSE_LANDMARKS.LEFT_SHOULDER,
  POSE_LANDMARKS.RIGHT_SHOULDER,
  POSE_LANDMARKS.LEFT_HIP,
  POSE_LANDMARKS.RIGHT_HIP,
];

export function BodyTracker({ 
  landmarks, 
  visible = true,
  color = '#00ff00' 
}: BodyTrackerProps) {
  // Convert normalized coords to 3D space
  const landmarkPositions = useMemo(() => {
    if (!landmarks) return [];
    
    return landmarks.map((lm) => {
      // Convert from normalized (0-1) to world space
      // Assuming a 2m tall person centered at origin
      const x = (lm.x - 0.5) * 2;
      const y = (1 - lm.y) * 2; // Flip Y
      const z = lm.z * 2;
      return new THREE.Vector3(x, y, z);
    });
  }, [landmarks]);

  // Generate skeleton lines
  const skeletonLines = useMemo(() => {
    if (!landmarkPositions.length) return [];
    
    return SKELETON_CONNECTIONS.map(([from, to]) => {
      const start = landmarkPositions[from];
      const end = landmarkPositions[to];
      if (!start || !end) return null;
      return [start.toArray(), end.toArray()] as [[number, number, number], [number, number, number]];
    }).filter(Boolean) as [[number, number, number], [number, number, number]][];
  }, [landmarkPositions]);

  if (!visible || !landmarks) {
    return null;
  }

  return (
    <group>
      {/* Skeleton lines */}
      {skeletonLines.map((line, index) => (
        <Line
          key={`line-${index}`}
          points={line}
          color={color}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
      
      {/* Key landmark points */}
      {KEY_LANDMARKS.map((idx) => {
        const pos = landmarkPositions[idx];
        if (!pos) return null;
        
        const visibility = landmarks[idx]?.visibility || 0;
        
        return (
          <Sphere
            key={`point-${idx}`}
            position={pos.toArray() as [number, number, number]}
            args={[0.02, 8, 8]}
          >
            <meshBasicMaterial
              color={color}
              transparent
              opacity={visibility * 0.8}
            />
          </Sphere>
        );
      })}
    </group>
  );
}
