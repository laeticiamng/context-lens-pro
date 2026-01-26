import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useARStore, EmotionType } from '@/stores/arStore';
import { BRAIN_REGIONS } from './BrainModel';

// Emotion to brain region mapping with colors
const EMOTION_CONFIG: Record<EmotionType, {
  region: keyof typeof BRAIN_REGIONS;
  color: string;
  animation: 'pulse' | 'glow' | 'fade' | 'flash' | 'wave';
}> = {
  anxiety: {
    region: 'amygdala',
    color: '#EF4444', // Red
    animation: 'pulse'
  },
  joy: {
    region: 'nucleus_accumbens',
    color: '#10B981', // Green
    animation: 'glow'
  },
  sadness: {
    region: 'prefrontal',
    color: '#3B82F6', // Blue
    animation: 'fade'
  },
  anger: {
    region: 'hypothalamus',
    color: '#F59E0B', // Orange
    animation: 'flash'
  },
  disgust: {
    region: 'insula',
    color: '#8B5CF6', // Purple
    animation: 'wave'
  }
};

interface EmotionOverlayProps {
  brainPosition?: [number, number, number];
}

export function EmotionOverlay({ brainPosition = [0, 1.5, -2] }: EmotionOverlayProps) {
  const { emotions, showOverlay, zoomLevel, focusedRegion } = useARStore();
  const materialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  // Animate overlays
  useFrame((state) => {
    if (!emotions) return;

    const time = state.clock.elapsedTime;

    Object.entries(EMOTION_CONFIG).forEach(([emotion, config]) => {
      const intensity = emotions[emotion as EmotionType] || 0;
      const material = materialsRef.current.get(emotion);
      
      if (material && intensity > 0.1) {
        switch (config.animation) {
          case 'pulse':
            material.emissiveIntensity = intensity * (0.5 + Math.sin(time * 4) * 0.5);
            break;
          case 'glow':
            material.emissiveIntensity = intensity * (0.8 + Math.sin(time * 2) * 0.2);
            break;
          case 'fade':
            material.opacity = intensity * (0.6 + Math.sin(time * 1.5) * 0.4);
            break;
          case 'flash':
            material.emissiveIntensity = intensity * (Math.sin(time * 8) > 0 ? 1 : 0.3);
            break;
          case 'wave':
            material.emissiveIntensity = intensity * (0.5 + Math.sin(time * 3 + intensity * 5) * 0.5);
            break;
        }
      }
    });
  });

  // Calculate offset for focus
  const focusOffset = useMemo(() => {
    if (focusedRegion && BRAIN_REGIONS[focusedRegion as keyof typeof BRAIN_REGIONS]) {
      const region = BRAIN_REGIONS[focusedRegion as keyof typeof BRAIN_REGIONS];
      return region.position.map(v => -v * zoomLevel) as [number, number, number];
    }
    return [0, 0, 0] as [number, number, number];
  }, [focusedRegion, zoomLevel]);

  if (!showOverlay || !emotions) return null;

  return (
    <group 
      position={[
        brainPosition[0] + focusOffset[0],
        brainPosition[1] + focusOffset[1],
        brainPosition[2] + focusOffset[2]
      ]}
      scale={zoomLevel * 0.3}
    >
      {Object.entries(EMOTION_CONFIG).map(([emotion, config]) => {
        const intensity = emotions[emotion as EmotionType] || 0;
        const region = BRAIN_REGIONS[config.region];
        
        if (intensity < 0.1) return null;

        return (
          <Sphere
            key={emotion}
            args={[region.size * (1 + intensity * 0.5), 24, 24]}
            position={region.position}
          >
            <meshStandardMaterial
              ref={(mat) => {
                if (mat) materialsRef.current.set(emotion, mat);
              }}
              color={config.color}
              emissive={config.color}
              emissiveIntensity={intensity * 0.8}
              transparent
              opacity={0.4 + intensity * 0.4}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
        );
      })}

      {/* Connecting neural pathways (animated lines between active regions) */}
      {emotions.anxiety > 0.5 && emotions.anger > 0.3 && (
        <mesh>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(...BRAIN_REGIONS.amygdala.position),
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(...BRAIN_REGIONS.hypothalamus.position)
            ]),
            20,
            0.01,
            8,
            false
          ]} />
          <meshBasicMaterial 
            color="#FF6B6B" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}
    </group>
  );
}
