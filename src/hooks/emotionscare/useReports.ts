import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { emotionsCareApi } from '@/services/emotionscare/api';
import type { ReportConfig, ReportStatus } from '@/services/emotionscare/types';
import { toast } from 'sonner';

// ============ REPORTS HOOK ============

interface UseReportsResult {
  generateReport: (config?: ReportConfig) => Promise<string | null>;
  reportStatus: ReportStatus | null;
  isGenerating: boolean;
  isPolling: boolean;
  error: Error | null;
  downloadUrl: string | null;
}

export function useReports(patientId: string | null): UseReportsResult {
  const queryClient = useQueryClient();
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Query for report status (polls when reportId is set)
  const statusQuery = useQuery({
    queryKey: ['emotionscare', 'report-status', currentReportId],
    queryFn: () => emotionsCareApi.getReportStatus(currentReportId!),
    enabled: !!currentReportId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling when report is ready or errored
      if (data?.status === 'ready' || data?.status === 'error') {
        return false;
      }
      return 2000; // Poll every 2 seconds while generating
    },
  });

  // Handle status changes
  if (statusQuery.data?.status === 'ready' && statusQuery.data.file_url && !downloadUrl) {
    setDownloadUrl(statusQuery.data.file_url);
    toast.success('Rapport généré', {
      description: 'Le rapport PDF est prêt à être téléchargé.',
      action: {
        label: 'Télécharger',
        onClick: () => window.open(statusQuery.data.file_url!, '_blank'),
      },
    });
  }

  if (statusQuery.data?.status === 'error') {
    toast.error('Erreur', {
      description: statusQuery.data.error || 'La génération du rapport a échoué.',
    });
  }

  // Mutation for generating reports
  const generateMutation = useMutation({
    mutationFn: async (config: ReportConfig) => {
      if (!patientId) throw new Error('No patient selected');
      return emotionsCareApi.generateReport(patientId, config);
    },
    onSuccess: (data) => {
      setCurrentReportId(data.reportId);
      setDownloadUrl(null);
      
      toast.loading('Génération en cours...', {
        description: 'Le rapport est en cours de création.',
      });
    },
    onError: (error) => {
      console.error('Failed to generate report:', error);
      toast.error('Erreur', {
        description: 'Impossible de démarrer la génération du rapport.',
      });
    },
  });

  const generateReport = useCallback(async (config: ReportConfig = {}): Promise<string | null> => {
    const defaultConfig: ReportConfig = {
      include_3d_captures: true,
      include_emotion_graphs: true,
      include_assessments: true,
      format: 'pdf',
      ...config,
    };

    try {
      const result = await generateMutation.mutateAsync(defaultConfig);
      return result.reportId;
    } catch {
      return null;
    }
  }, [generateMutation]);

  return {
    generateReport,
    reportStatus: statusQuery.data || null,
    isGenerating: generateMutation.isPending,
    isPolling: statusQuery.isFetching && statusQuery.data?.status !== 'ready',
    error: (generateMutation.error || statusQuery.error) as Error | null,
    downloadUrl,
  };
}

// ============ QUICK REPORT HOOK ============

export function useQuickReport(patientId: string | null) {
  const { generateReport, isGenerating, reportStatus, downloadUrl } = useReports(patientId);

  const generate = useCallback(async () => {
    return generateReport({
      include_3d_captures: true,
      include_emotion_graphs: true,
      include_assessments: false, // Quick report
    });
  }, [generateReport]);

  return {
    generate,
    isGenerating,
    progress: reportStatus?.progress || 0,
    isReady: reportStatus?.status === 'ready',
    downloadUrl,
  };
}
