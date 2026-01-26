import { useQuery, useQueryClient } from '@tanstack/react-query';
import { emotionsCareApi } from '@/services/emotionscare/api';
import type { BrainRegion, BrainMeshResponse } from '@/services/emotionscare/types';

// ============ BRAIN MODEL HOOK ============

interface UseBrainModelOptions {
  lod?: 'high' | 'medium' | 'low';
  format?: 'gltf' | 'obj';
  enabled?: boolean;
}

interface UseBrainModelResult {
  meshUrl: string | null;
  meshData: BrainMeshResponse | null;
  regions: BrainRegion[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useBrainModel(
  patientId: string | null,
  options: UseBrainModelOptions = {}
): UseBrainModelResult {
  const { lod = 'medium', format = 'gltf', enabled = true } = options;

  // Query for full mesh data
  const meshQuery = useQuery({
    queryKey: ['emotionscare', 'brain-mesh', patientId, lod, format],
    queryFn: () => emotionsCareApi.getBrainMesh(patientId!, { lod, format }),
    enabled: !!patientId && enabled,
    staleTime: 1000 * 60 * 60, // 1 hour - mesh doesn't change often
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });

  // Query for regions (separate for granular caching)
  const regionsQuery = useQuery({
    queryKey: ['emotionscare', 'brain-regions', patientId],
    queryFn: () => emotionsCareApi.getBrainRegions(patientId!),
    enabled: !!patientId && enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });

  return {
    meshUrl: meshQuery.data?.mesh_url || null,
    meshData: meshQuery.data || null,
    regions: regionsQuery.data || meshQuery.data?.regions || [],
    isLoading: meshQuery.isLoading || regionsQuery.isLoading,
    error: (meshQuery.error || regionsQuery.error) as Error | null,
    refetch: () => {
      meshQuery.refetch();
      regionsQuery.refetch();
    },
  };
}

// ============ PREFETCH BRAIN MODEL ============

export function usePrefetchBrainModel() {
  const queryClient = useQueryClient();
  
  return (patientId: string, lod: 'high' | 'medium' | 'low' = 'medium') => {
    queryClient.prefetchQuery({
      queryKey: ['emotionscare', 'brain-mesh', patientId, lod, 'gltf'],
      queryFn: () => emotionsCareApi.getBrainMesh(patientId, { lod, format: 'gltf' }),
      staleTime: 1000 * 60 * 60,
    });
  };
}

// ============ MESH URL HOOK (for Three.js) ============

export function useBrainMeshUrl(
  patientId: string | null,
  options: UseBrainModelOptions = {}
): { url: string | null; isLoading: boolean } {
  const { lod = 'medium', enabled = true } = options;

  const query = useQuery({
    queryKey: ['emotionscare', 'brain-mesh-url', patientId, lod],
    queryFn: () => emotionsCareApi.getBrainMeshUrl(patientId!, { lod }),
    enabled: !!patientId && enabled,
    staleTime: 1000 * 60 * 60,
  });

  return {
    url: query.data || null,
    isLoading: query.isLoading,
  };
}
