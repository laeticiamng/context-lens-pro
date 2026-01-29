import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Image,
  BarChart3,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReportConfig {
  includeScans: boolean;
  includeStats: boolean;
  includeImages: boolean;
  includeRecommendations: boolean;
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  format: 'pdf' | 'docx' | 'json' | 'markdown' | 'html';
}

interface ReportGeneratorProps {
  cabinetId: string;
  patientReference?: string;
  scanId?: string;
}

type ReportStatus = 'idle' | 'generating' | 'ready' | 'error';

interface GeneratedReport {
  report_id: string;
  content: string;
  ai_summary: string | null;
  format: string;
}

export function ReportGenerator({ cabinetId, patientReference, scanId }: ReportGeneratorProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [config, setConfig] = useState<ReportConfig>({
    includeScans: true,
    includeStats: true,
    includeImages: true,
    includeRecommendations: true,
    dateRange: 'month',
    format: 'json',
  });

  const handleGenerateReport = async () => {
    setStatus('generating');
    setProgress(0);

    try {
      // Progress simulation for UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Call Edge Function if scanId is provided
      if (scanId) {
        const { data, error } = await supabase.functions.invoke('generate-report', {
          body: { 
            scan_id: scanId, 
            format: config.format === 'pdf' || config.format === 'docx' ? 'json' : config.format,
            language 
          }
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        setGeneratedReport(data);
        setStatus('ready');
        
        toast({
          title: language === 'fr' ? 'Rapport généré' : 'Report Generated',
          description: data.ai_summary 
            ? (language === 'fr' ? 'Rapport avec résumé IA prêt' : 'Report with AI summary ready')
            : (language === 'fr' ? 'Rapport prêt au téléchargement' : 'Report ready for download'),
        });
      } else {
        // Fallback demo mode
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setProgress(i);
        }
        setGeneratedReport({
          report_id: `DEMO-${Date.now()}`,
          content: JSON.stringify({ demo: true, cabinetId, config }, null, 2),
          ai_summary: null,
          format: config.format
        });
        setStatus('ready');
        toast({
          title: language === 'fr' ? 'Rapport généré (démo)' : 'Report Generated (demo)',
          description: language === 'fr' ? 'Mode démonstration' : 'Demo mode',
        });
      }
    } catch (error) {
      setStatus('error');
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (!generatedReport) return;

    const content = generatedReport.ai_summary 
      ? `${generatedReport.content}\n\n--- AI SUMMARY ---\n${generatedReport.ai_summary}`
      : generatedReport.content;
    
    const mimeTypes: Record<string, string> = {
      json: 'application/json',
      markdown: 'text/markdown',
      html: 'text/html',
      pdf: 'text/plain',
      docx: 'text/plain'
    };
    const extensions: Record<string, string> = {
      json: 'json',
      markdown: 'md',
      html: 'html',
      pdf: 'txt',
      docx: 'txt'
    };

    const blob = new Blob([content], { type: mimeTypes[generatedReport.format] || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${generatedReport.report_id}.${extensions[generatedReport.format] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === 'fr' ? 'Téléchargé' : 'Downloaded',
      description: `${generatedReport.report_id}`,
    });
  };

  const resetGenerator = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {language === 'fr' ? 'Générateur de rapports' : 'Report Generator'}
        </CardTitle>
        <CardDescription>
          {language === 'fr' 
            ? 'Créez des rapports PDF personnalisés pour vos patients'
            : 'Create customized PDF reports for your patients'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {status === 'idle' && (
          <>
            {/* Report options */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeScans"
                    checked={config.includeScans}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, includeScans: checked === true }))
                    }
                  />
                  <Label htmlFor="includeScans" className="flex items-center gap-2 cursor-pointer">
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    {language === 'fr' ? 'Résultats de scans' : 'Scan Results'}
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeStats"
                    checked={config.includeStats}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, includeStats: checked === true }))
                    }
                  />
                  <Label htmlFor="includeStats" className="flex items-center gap-2 cursor-pointer">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    {language === 'fr' ? 'Statistiques' : 'Statistics'}
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeImages"
                    checked={config.includeImages}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, includeImages: checked === true }))
                    }
                  />
                  <Label htmlFor="includeImages" className="flex items-center gap-2 cursor-pointer">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    {language === 'fr' ? 'Images IRM' : 'MRI Images'}
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeRecommendations"
                    checked={config.includeRecommendations}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, includeRecommendations: checked === true }))
                    }
                  />
                  <Label htmlFor="includeRecommendations" className="flex items-center gap-2 cursor-pointer">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    {language === 'fr' ? 'Recommandations' : 'Recommendations'}
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {language === 'fr' ? 'Période' : 'Date Range'}
                  </Label>
                  <Select
                    value={config.dateRange}
                    onValueChange={(value: ReportConfig['dateRange']) => 
                      setConfig(prev => ({ ...prev, dateRange: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">
                        {language === 'fr' ? '7 derniers jours' : 'Last 7 days'}
                      </SelectItem>
                      <SelectItem value="month">
                        {language === 'fr' ? '30 derniers jours' : 'Last 30 days'}
                      </SelectItem>
                      <SelectItem value="quarter">
                        {language === 'fr' ? '3 derniers mois' : 'Last 3 months'}
                      </SelectItem>
                      <SelectItem value="year">
                        {language === 'fr' ? '12 derniers mois' : 'Last 12 months'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {language === 'fr' ? 'Format' : 'Format'}
                  </Label>
                  <Select
                    value={config.format}
                    onValueChange={(value: ReportConfig['format']) => 
                      setConfig(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleGenerateReport} 
              className="w-full"
              variant="hero"
            >
              <FileText className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Générer le rapport' : 'Generate Report'}
            </Button>
          </>
        )}

        {status === 'generating' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {language === 'fr' 
                ? `Génération en cours... ${progress}%`
                : `Generating report... ${progress}%`}
            </p>
          </div>
        )}

        {status === 'ready' && generatedReport && (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle className="h-12 w-12 text-accent mx-auto" />
            <div>
              <h3 className="font-medium">
                {language === 'fr' ? 'Rapport prêt !' : 'Report Ready!'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                ID: {generatedReport.report_id}
              </p>
              {generatedReport.ai_summary && (
                <div className="mt-3 p-3 rounded-lg bg-primary/10 text-left">
                  <div className="flex items-center gap-2 text-primary text-xs font-medium mb-1">
                    <Sparkles className="h-3 w-3" />
                    {language === 'fr' ? 'Résumé IA' : 'AI Summary'}
                  </div>
                  <p className="text-sm">{generatedReport.ai_summary}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Télécharger' : 'Download'}
              </Button>
              <Button variant="outline" onClick={resetGenerator}>
                {language === 'fr' ? 'Nouveau rapport' : 'New Report'}
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="font-medium text-destructive">
                {language === 'fr' ? 'Erreur de génération' : 'Generation Error'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'fr' 
                  ? 'Impossible de générer le rapport. Réessayez.'
                  : 'Could not generate report. Please try again.'}
              </p>
            </div>
            <Button onClick={resetGenerator} variant="outline">
              {language === 'fr' ? 'Réessayer' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Feature badge */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
          <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {language === 'fr' 
              ? 'Edge Function déployée'
              : 'Edge Function deployed'}
          </Badge>
          {scanId && (
            <span className="text-xs text-muted-foreground">
              Scan: {scanId.slice(0, 8)}...
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
