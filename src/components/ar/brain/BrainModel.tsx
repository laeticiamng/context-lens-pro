import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useARStore } from '@/stores/arStore';

interface BrainModelProps {
  position?: [number, number, number];
}

// Brain regions with positions (simplified anatomical mapping)
const BRAIN_REGIONS = {
  amygdala: { position: [0.15, -0.05, 0.1] as [number, number, number], size: 0.08, label: 'Amygdale' },
  hippocampus: { position: [-0.12, -0.08, 0.05] as [number, number, number], size: 0.1, label: 'Hippocampe' },
  prefrontal: { position: [0, 0.15, 0.2] as [number, number, number], size: 0.15, label: 'Cortex Préfrontal' },
  insula: { position: [0.18, 0.02, -0.05] as [number, number, number], size: 0.07, label: 'Insula' },
  hypothalamus: { position: [0, -0.12, 0.08] as [number, number, number], size: 0.06, label: 'Hypothalamus' },
  nucleus_accumbens: { position: [0.05, -0.02, 0.12] as [number, number, number], size: 0.05, label: 'N. Accumbens' }
};

export function BrainModel({ position = [0, 1.5, -2] }: BrainModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { zoomLevel, viewAngle, focusedRegion } = useARStore();

  // Calculate rotation based on view angle
  const rotation = useMemo(() => {
    switch (viewAngle) {
      case 'axial': return [Math.PI / 2, 0, 0] as [number, number, number];
      case 'sagittal': return [0, Math.PI / 2, 0] as [number, number, number];
      case 'coronal': return [0, 0, 0] as [number, number, number];
      default: return [0, 0, 0] as [number, number, number];
    }
  }, [viewAngle]);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current && viewAngle === 'default') {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  // Calculate focus offset
  const focusOffset = useMemo(() => {
    if (focusedRegion && BRAIN_REGIONS[focusedRegion as keyof typeof BRAIN_REGIONS]) {
      const region = BRAIN_REGIONS[focusedRegion as keyof typeof BRAIN_REGIONS];
      return region.position.map(v => -v * zoomLevel) as [number, number, number];
    }
    return [0, 0, 0] as [number, number, number];
  }, [focusedRegion, zoomLevel]);

  return (
    <group 
      ref={groupRef} 
      position={[
        position[0] + focusOffset[0], 
        position[1] + focusOffset[1], 
        position[2] + focusOffset[2]
      ]}
      rotation={rotation}
      scale={zoomLevel * 0.3}
    >
      {/* Main brain structure - outer cortex */}
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#e8d4c4"
          roughness={0.7}
          metalness={0.1}
          distort={0.15}
          speed={0.5}
          transparent
          opacity={0.85}
        />
      </Sphere>

      {/* Inner brain structure */}
      <Sphere args={[0.85, 32, 32]}>
        <meshStandardMaterial
          color="#d4b8a8"
          roughness={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* Cerebellum */}
      <group position={[0, -0.4, -0.5]}>
        <Sphere args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color="#c9a89a"
            roughness={0.6}
            distort={0.2}
            speed={0.3}
          />
        </Sphere>
      </group>

      {/* Brain stem */}
      <mesh position={[0, -0.7, -0.3]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.5, 16]} />
        <meshStandardMaterial color="#b09080" roughness={0.7} />
      </mesh>

      {/* Brain regions (will be colored by EmotionOverlay) */}
      {Object.entries(BRAIN_REGIONS).map(([name, region]) => (
        <group key={name} position={region.position}>
          <Sphere args={[region.size, 16, 16]} name={name}>
            <meshStandardMaterial
              color="#a08070"
              transparent
              opacity={focusedRegion === name ? 1 : 0.5}
            />
          </Sphere>
          
          {/* Region label (visible when focused) */}
          {focusedRegion === name && (
            <Text
              position={[0, region.size + 0.1, 0]}
              fontSize={0.06}
              color="white"
              anchorX="center"
              anchorY="bottom"
            >
              {region.label}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}

export { BRAIN_REGIONS };
