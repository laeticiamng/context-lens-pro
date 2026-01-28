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
  Stethoscope
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface ReportConfig {
  includeScans: boolean;
  includeStats: boolean;
  includeImages: boolean;
  includeRecommendations: boolean;
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  format: 'pdf' | 'docx';
}

interface ReportGeneratorProps {
  cabinetId: string;
  patientReference?: string;
}

type ReportStatus = 'idle' | 'generating' | 'ready' | 'error';

export function ReportGenerator({ cabinetId, patientReference }: ReportGeneratorProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [status, setStatus] = useState<ReportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState<ReportConfig>({
    includeScans: true,
    includeStats: true,
    includeImages: true,
    includeRecommendations: true,
    dateRange: 'month',
    format: 'pdf',
  });

  const handleGenerateReport = async () => {
    setStatus('generating');
    setProgress(0);

    try {
      // Simulate report generation progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i);
      }

      // In production, this would call an Edge Function to generate the PDF
      // const { data, error } = await supabase.functions.invoke('generate-report', {
      //   body: { cabinetId, patientReference, config }
      // });

      setStatus('ready');
      toast({
        title: language === 'fr' ? 'Rapport généré' : 'Report Generated',
        description: language === 'fr' 
          ? 'Votre rapport est prêt au téléchargement'
          : 'Your report is ready to download',
      });
    } catch (error) {
      setStatus('error');
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Échec de la génération du rapport'
          : 'Failed to generate report',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    // Simulate download
    const dummyContent = `
RAPPORT MÉDICAL LUNETTES IRM
============================
Cabinet ID: ${cabinetId}
Patient: ${patientReference || 'N/A'}
Date: ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}

Configuration:
- Scans inclus: ${config.includeScans ? 'Oui' : 'Non'}
- Statistiques: ${config.includeStats ? 'Oui' : 'Non'}
- Images: ${config.includeImages ? 'Oui' : 'Non'}
- Recommandations: ${config.includeRecommendations ? 'Oui' : 'Non'}
- Période: ${config.dateRange}

[Ce rapport de démonstration serait généré en PDF via Edge Functions]
    `;

    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-irm-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === 'fr' ? 'Téléchargé' : 'Downloaded',
      description: language === 'fr' 
        ? 'Rapport téléchargé avec succès'
        : 'Report downloaded successfully',
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
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word (DOCX)</SelectItem>
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

        {status === 'ready' && (
          <div className="space-y-4 py-4 text-center">
            <CheckCircle className="h-12 w-12 text-accent mx-auto" />
            <div>
              <h3 className="font-medium">
                {language === 'fr' ? 'Rapport prêt !' : 'Report Ready!'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'fr' 
                  ? 'Cliquez ci-dessous pour télécharger'
                  : 'Click below to download'}
              </p>
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
        <div className="pt-4 border-t border-border/50">
          <Badge variant="outline" className="text-xs">
            {language === 'fr' 
              ? '🔜 Génération PDF via Edge Functions bientôt disponible'
              : '🔜 PDF generation via Edge Functions coming soon'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
