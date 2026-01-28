import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Bell,
  BellOff,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface UsageThreshold {
  scripts: { used: number; limit: number };
  analyses: { used: number; limit: number };
  devices: { used: number; limit: number };
}

interface UsageAlertsProps {
  usage: UsageThreshold;
  onUpgrade?: () => void;
}

const ALERT_THRESHOLDS = {
  warning: 0.75, // 75%
  critical: 0.9, // 90%
};

export function UsageAlerts({ usage, onUpgrade }: UsageAlertsProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Calculate percentages
  const calculatePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const scriptsPercent = calculatePercentage(usage.scripts.used, usage.scripts.limit);
  const analysesPercent = calculatePercentage(usage.analyses.used, usage.analyses.limit);
  const devicesPercent = calculatePercentage(usage.devices.used, usage.devices.limit);

  // Determine alert level
  const getAlertLevel = (percent: number): 'none' | 'warning' | 'critical' => {
    if (percent >= ALERT_THRESHOLDS.critical * 100) return 'critical';
    if (percent >= ALERT_THRESHOLDS.warning * 100) return 'warning';
    return 'none';
  };

  const scriptsLevel = getAlertLevel(scriptsPercent);
  const analysesLevel = getAlertLevel(analysesPercent);

  // Show toast notifications for critical levels
  useEffect(() => {
    if (!alertsEnabled) return;

    if (scriptsLevel === 'critical' && !dismissedAlerts.includes('scripts')) {
      toast({
        title: language === 'fr' ? '⚠️ Limite de scripts atteinte' : '⚠️ Script limit reached',
        description: language === 'fr' 
          ? `Vous avez utilisé ${usage.scripts.used}/${usage.scripts.limit} scripts`
          : `You've used ${usage.scripts.used}/${usage.scripts.limit} scripts`,
        variant: 'destructive',
      });
      setDismissedAlerts(prev => [...prev, 'scripts']);
    }

    if (analysesLevel === 'critical' && !dismissedAlerts.includes('analyses')) {
      toast({
        title: language === 'fr' ? '⚠️ Limite d\'analyses atteinte' : '⚠️ Analysis limit reached',
        description: language === 'fr' 
          ? `Vous avez utilisé ${usage.analyses.used}/${usage.analyses.limit} analyses`
          : `You've used ${usage.analyses.used}/${usage.analyses.limit} analyses`,
        variant: 'destructive',
      });
      setDismissedAlerts(prev => [...prev, 'analyses']);
    }
  }, [scriptsLevel, analysesLevel, alertsEnabled, dismissedAlerts, language, toast, usage]);

  // Reset dismissed alerts on new month
  useEffect(() => {
    const checkReset = () => {
      const lastReset = localStorage.getItem('cl_alerts_reset');
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
      
      if (lastReset !== monthKey) {
        setDismissedAlerts([]);
        localStorage.setItem('cl_alerts_reset', monthKey);
      }
    };
    
    checkReset();
  }, []);

  const hasWarnings = scriptsLevel !== 'none' || analysesLevel !== 'none';

  if (!hasWarnings) {
    return null;
  }

  return (
    <>
      <Card className={`border-2 ${
        scriptsLevel === 'critical' || analysesLevel === 'critical'
          ? 'border-destructive/50 bg-destructive/5'
          : 'border-amber-500/50 bg-amber-500/5'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                scriptsLevel === 'critical' || analysesLevel === 'critical'
                  ? 'text-destructive'
                  : 'text-amber-500'
              }`} />
              <span className="font-medium">
                {language === 'fr' ? 'Alertes d\'utilisation' : 'Usage Alerts'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              title={alertsEnabled 
                ? (language === 'fr' ? 'Désactiver les alertes' : 'Disable alerts')
                : (language === 'fr' ? 'Activer les alertes' : 'Enable alerts')}
            >
              {alertsEnabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {/* Scripts usage */}
            {scriptsLevel !== 'none' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {language === 'fr' ? 'Scripts' : 'Scripts'}
                  </span>
                  <Badge variant={scriptsLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {usage.scripts.used}/{usage.scripts.limit}
                  </Badge>
                </div>
                <Progress 
                  value={scriptsPercent} 
                  className={scriptsLevel === 'critical' ? '[&>div]:bg-destructive' : '[&>div]:bg-amber-500'}
                />
              </div>
            )}

            {/* Analyses usage */}
            {analysesLevel !== 'none' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {language === 'fr' ? 'Analyses' : 'Analyses'}
                  </span>
                  <Badge variant={analysesLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {usage.analyses.used}/{usage.analyses.limit}
                  </Badge>
                </div>
                <Progress 
                  value={analysesPercent} 
                  className={analysesLevel === 'critical' ? '[&>div]:bg-destructive' : '[&>div]:bg-amber-500'}
                />
              </div>
            )}
          </div>

          {/* Upgrade CTA */}
          {(scriptsLevel === 'critical' || analysesLevel === 'critical') && onUpgrade && (
            <Button 
              className="w-full mt-4" 
              variant="hero"
              onClick={() => setShowUpgradeDialog(true)}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'Passer à Pro' : 'Upgrade to Pro'}
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'fr' ? 'Passez à Pro' : 'Upgrade to Pro'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'fr'
                ? 'Débloquez des scripts illimités, des analyses avancées et le support prioritaire.'
                : 'Unlock unlimited scripts, advanced analytics, and priority support.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'fr' ? 'Plus tard' : 'Maybe later'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onUpgrade}>
              {language === 'fr' ? 'Voir les plans' : 'View Plans'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
