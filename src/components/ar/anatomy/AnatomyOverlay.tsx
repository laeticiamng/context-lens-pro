import { useMemo } from 'react';
import { Matrix4 } from 'three';
import { OrganModel } from './OrganModel';
import type { LoadedOrgan } from '@/hooks/anatomy/useOrganLoader';
import { useAnatomyStore, selectVisibleOrgans } from '@/stores/anatomyStore';

interface AnatomyOverlayProps {
  organs: LoadedOrgan[];
  transformMatrix: Matrix4;
}

export function AnatomyOverlay({ organs, transformMatrix }: AnatomyOverlayProps) {
  const focusedOrgan = useAnatomyStore(state => state.focusedOrgan);
  const setFocusedOrgan = useAnatomyStore(state => state.setFocusedOrgan);
  const visibleOrgans = useAnatomyStore(selectVisibleOrgans);
  
  // Extract position and scale from transform matrix
  const transformProps = useMemo(() => {
    const position = [
      transformMatrix.elements[12],
      transformMatrix.elements[13],
      transformMatrix.elements[14],
    ] as [number, number, number];
    
    // Extract scale (simplified - assumes uniform scale)
    const scale = Math.sqrt(
      transformMatrix.elements[0] ** 2 +
      transformMatrix.elements[1] ** 2 +
      transformMatrix.elements[2] ** 2
    );
    
    return { position, scale };
  }, [transformMatrix]);

  const handleOrganClick = (code: string) => {
    if (focusedOrgan === code) {
      setFocusedOrgan(null);
    } else {
      setFocusedOrgan(code);
    }
  };

  return (
    <group
      position={transformProps.position}
      scale={transformProps.scale}
    >
      {visibleOrgans.map((organ) => (
        <OrganModel
          key={organ.structure.structure_code}
          structure={organ.structure}
          meshUrl={organ.meshUrl}
          isActive={!organ.isLoading}
          isFocused={focusedOrgan === organ.structure.structure_code}
          onClick={() => handleOrganClick(organ.structure.structure_code)}
        />
      ))}
    </group>
  );
}
