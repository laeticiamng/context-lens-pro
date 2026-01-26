import { useQuery } from '@tanstack/react-query';
import { emotionsCareApi } from '@/services/emotionscare/api';
import type { VitalSigns } from '@/services/emotionscare/types';

// ============ VITALS HOOK ============

interface UseVitalsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseVitalsResult {
  vitals: VitalSigns | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useVitals(
  patientId: string | null,
  options: UseVitalsOptions = {}
): UseVitalsResult {
  const { refreshInterval = 5000, enabled = true } = options;

  const query = useQuery({
    queryKey: ['emotionscare', 'vitals', patientId],
    queryFn: () => emotionsCareApi.getVitals(patientId!),
    enabled: !!patientId && enabled,
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
  });

  return {
    vitals: query.data || null,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
