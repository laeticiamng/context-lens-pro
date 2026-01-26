import { useQuery, useQueryClient } from '@tanstack/react-query';
import { emotionsCareApi } from '@/services/emotionscare/api';
import type { Patient, PatientSearchResult, Assessment } from '@/services/emotionscare/types';

// ============ PATIENT DATA HOOK ============

interface UsePatientDataResult {
  patient: Patient | null;
  assessments: Assessment[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePatientData(patientId: string | null): UsePatientDataResult {
  const patientQuery = useQuery({
    queryKey: ['emotionscare', 'patient', patientId],
    queryFn: () => emotionsCareApi.getPatient(patientId!),
    enabled: !!patientId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
  });

  const assessmentsQuery = useQuery({
    queryKey: ['emotionscare', 'patient-assessments', patientId],
    queryFn: () => emotionsCareApi.getPatientAssessments(patientId!),
    enabled: !!patientId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    patient: patientQuery.data || null,
    assessments: assessmentsQuery.data || [],
    isLoading: patientQuery.isLoading || assessmentsQuery.isLoading,
    error: (patientQuery.error || assessmentsQuery.error) as Error | null,
    refetch: () => {
      patientQuery.refetch();
      assessmentsQuery.refetch();
    },
  };
}

// ============ PATIENT SEARCH HOOK ============

interface UsePatientSearchResult {
  results: PatientSearchResult[];
  isLoading: boolean;
  error: Error | null;
}

export function usePatientSearch(query: string): UsePatientSearchResult {
  const searchQuery = useQuery({
    queryKey: ['emotionscare', 'patient-search', query],
    queryFn: () => emotionsCareApi.searchPatients(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5,
  });

  return {
    results: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    error: searchQuery.error as Error | null,
  };
}

// ============ PREFETCH PATIENT ============

export function usePrefetchPatient() {
  const queryClient = useQueryClient();
  
  return (patientId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['emotionscare', 'patient', patientId],
      queryFn: () => emotionsCareApi.getPatient(patientId),
      staleTime: 1000 * 60 * 5,
    });
    
    queryClient.prefetchQuery({
      queryKey: ['emotionscare', 'patient-assessments', patientId],
      queryFn: () => emotionsCareApi.getPatientAssessments(patientId),
      staleTime: 1000 * 60 * 5,
    });
  };
}
