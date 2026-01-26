// Scan Statistics Card Component
// CLP-LUNETTES-IRM-2026-001

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Brain, 
  Heart, 
  Activity,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { MRIScan } from '@/hooks/mri';

interface ScanStatsCardProps {
  todayScans: MRIScan[];
  monthlyStats: {
    totalScans: number;
    anomaliesDetected: number;
    avgDuration: number;
  };
}

export function ScanStatsCard({ todayScans, monthlyStats }: ScanStatsCardProps) {
  const { language } = useLanguage();

  // Protocol icons
  const protocolIcons: Record<string, React.ReactNode> = {
    checkup_complet: <Activity className="h-4 w-4" />,
    cardio: <Heart className="h-4 w-4 text-destructive" />,
    neuro: <Brain className="h-4 w-4 text-primary" />,
    abdominal: <Activity className="h-4 w-4 text-accent" />,
    osteo: <Activity className="h-4 w-4 text-primary" />,
  };

  // Count scans by status
  const completedToday = todayScans.filter(s => s.status === 'completed').length;
  const inProgressToday = todayScans.filter(s => s.status === 'in_progress').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {language === 'fr' ? 'Statistiques' : 'Statistics'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Summary */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            {language === 'fr' ? "Aujourd'hui" : 'Today'}
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">{todayScans.length}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'fr' ? 'Total' : 'Total'}
              </p>
            </div>
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <p className="text-2xl font-bold text-accent">{completedToday}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'fr' ? 'Terminés' : 'Completed'}
              </p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">{inProgressToday}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'fr' ? 'En cours' : 'In Progress'}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            {language === 'fr' ? 'Ce mois' : 'This Month'}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                {language === 'fr' ? 'Scans réalisés' : 'Scans performed'}
              </span>
              <span className="font-bold">{monthlyStats.totalScans}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-destructive" />
                {language === 'fr' ? 'Anomalies détectées' : 'Anomalies detected'}
              </span>
              <span className="font-bold text-destructive">{monthlyStats.anomaliesDetected}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4" />
                {language === 'fr' ? 'Durée moyenne' : 'Avg. duration'}
              </span>
              <span className="font-bold">
                {Math.floor(monthlyStats.avgDuration / 60)} min
              </span>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        {todayScans.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {language === 'fr' ? 'Scans récents' : 'Recent Scans'}
            </h4>
            <div className="space-y-2">
              {todayScans.slice(0, 3).map((scan) => (
                <div 
                  key={scan.id} 
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm"
                >
                  <div className="flex items-center gap-2">
                    {protocolIcons[scan.protocol_id] || <Activity className="h-4 w-4" />}
                    <span className="font-medium">{scan.patient_reference}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    scan.status === 'completed' 
                      ? 'bg-accent/20 text-accent' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {scan.status === 'completed' 
                      ? (language === 'fr' ? 'Terminé' : 'Completed')
                      : (language === 'fr' ? 'En cours' : 'In Progress')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
