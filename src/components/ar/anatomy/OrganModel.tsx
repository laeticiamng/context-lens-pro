import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import type { AnatomicalStructure } from '@/services/emotionscare/anatomyApi';
import { useAnatomyStore } from '@/stores/anatomyStore';

interface OrganModelProps {
  structure: AnatomicalStructure;
  meshUrl: string;
  isActive?: boolean;
  isFocused?: boolean;
  onClick?: () => void;
}

// Organ position mappings (relative to body center)
const ORGAN_POSITIONS: Record<string, [number, number, number]> = {
  BRAIN: [0, 1.6, 0],
  SKULL: [0, 1.6, 0],
  HEART: [0.05, 1.2, 0.05],
  LUNG_L: [-0.15, 1.25, 0],
  LUNG_R: [0.15, 1.25, 0],
  AORTA: [0.02, 1.1, 0.03],
  RIBS: [0, 1.2, 0],
  LIVER: [0.12, 0.95, 0.02],
  SPLEEN: [-0.15, 1.0, -0.02],
  STOMACH: [-0.05, 0.95, 0.05],
  KIDNEY_L: [-0.1, 0.9, -0.05],
  KIDNEY_R: [0.1, 0.9, -0.05],
  BLADDER: [0, 0.7, 0.03],
  PELVIS: [0, 0.75, 0],
};

// Organ scales
const ORGAN_SCALES: Record<string, [number, number, number]> = {
  BRAIN: [0.15, 0.12, 0.15],
  SKULL: [0.18, 0.15, 0.18],
  HEART: [0.08, 0.1, 0.06],
  LUNG_L: [0.1, 0.15, 0.08],
  LUNG_R: [0.1, 0.15, 0.08],
  AORTA: [0.02, 0.3, 0.02],
  RIBS: [0.2, 0.2, 0.15],
  LIVER: [0.12, 0.08, 0.1],
  SPLEEN: [0.06, 0.04, 0.03],
  STOMACH: [0.08, 0.06, 0.05],
  KIDNEY_L: [0.04, 0.06, 0.03],
  KIDNEY_R: [0.04, 0.06, 0.03],
  BLADDER: [0.05, 0.05, 0.04],
  PELVIS: [0.2, 0.1, 0.15],
};

export function OrganModel({ 
  structure, 
  meshUrl, 
  isActive = true, 
  isFocused = false,
  onClick 
}: OrganModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const globalOpacity = useAnatomyStore(state => state.globalOpacity);
  const hiddenOrgans = useAnatomyStore(state => state.hiddenOrgans);
  
  const isHidden = hiddenOrgans.has(structure.structure_code);
  
  // Get position and scale for this organ
  const position = ORGAN_POSITIONS[structure.structure_code] || [0, 1, 0];
  const scale = ORGAN_SCALES[structure.structure_code] || [0.1, 0.1, 0.1];

  // Parse color from structure
  const color = useMemo(() => {
    return new THREE.Color(structure.default_color);
  }, [structure.default_color]);

  // Calculate effective opacity
  const effectiveOpacity = useMemo(() => {
    if (isHidden) return 0;
    const baseOpacity = structure.opacity || 0.8;
    return baseOpacity * globalOpacity * (isFocused ? 1 : 0.7);
  }, [isHidden, structure.opacity, globalOpacity, isFocused]);

  // Animation
  useFrame((state) => {
    if (!meshRef.current || isHidden) return;

    // Pulse animation for focused organ
    if (isFocused) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1;
      meshRef.current.scale.setScalar(pulse);
    }

    // Gentle breathing motion for thorax organs
    if (['LUNG_L', 'LUNG_R', 'HEART'].includes(structure.structure_code)) {
      const breathe = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      meshRef.current.position.y = position[1] + breathe;
    }

    // Heart beat for heart
    if (structure.structure_code === 'HEART') {
      const beat = Math.sin(state.clock.elapsedTime * 4) * 0.05 + 1;
      meshRef.current.scale.set(
        scale[0] * beat,
        scale[1] * beat,
        scale[2] * beat
      );
    }
  });

  if (isHidden || effectiveOpacity === 0) {
    return null;
  }

  // Use simple geometry for demo (would use GLTFLoader for real meshes)
  const GeometryComponent = ['BRAIN', 'SKULL', 'HEART', 'SPLEEN', 'KIDNEY_L', 'KIDNEY_R', 'BLADDER'].includes(structure.structure_code)
    ? Sphere
    : Box;

  return (
    <group position={position}>
      <GeometryComponent
        ref={meshRef}
        args={scale as [number, number, number]}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={effectiveOpacity}
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.1}
          emissive={isFocused ? color : undefined}
          emissiveIntensity={isFocused ? 0.3 : 0}
        />
      </GeometryComponent>
      
      {/* Outline for focused organ */}
      {isFocused && (
        <GeometryComponent
          args={[scale[0] * 1.1, scale[1] * 1.1, scale[2] * 1.1] as [number, number, number]}
        >
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </GeometryComponent>
      )}
    </group>
  );
}
