// Hook for generating MRI scan reports via Edge Function
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';

interface ReportResponse {
  report_id: string;
  generated_at: string;
  format: 'json' | 'markdown' | 'html';
  language: 'fr' | 'en';
  content: string;
  ai_summary: string | null;
  metadata: {
    scan_id: string;
    patient_reference_masked: string;
  };
}

interface UseGenerateReportReturn {
  generateReport: (scanId: string, format?: 'json' | 'markdown' | 'html') => Promise<ReportResponse | null>;
  isGenerating: boolean;
  error: string | null;
  lastReport: ReportResponse | null;
}

export function useGenerateReport(): UseGenerateReportReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<ReportResponse | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const generateReport = async (
    scanId: string,
    format: 'json' | 'markdown' | 'html' = 'json'
  ): Promise<ReportResponse | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-report', {
        body: {
          scan_id: scanId,
          format,
          language,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setLastReport(data);
      
      toast({
        title: language === 'fr' ? 'Rapport généré' : 'Report Generated',
        description: language === 'fr' 
          ? `ID: ${data.report_id}` 
          : `ID: ${data.report_id}`,
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      
      toast({
        variant: 'destructive',
        title: language === 'fr' ? 'Erreur de génération' : 'Generation Error',
        description: message,
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateReport,
    isGenerating,
    error,
    lastReport,
  };
}
