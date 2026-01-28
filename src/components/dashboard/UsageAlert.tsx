// Usage Alert Component
// Notifies users when approaching usage limits

import { useState, useEffect } from 'react';
import { AlertTriangle, X, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/i18n/LanguageContext';

interface UsageAlertProps {
  currentUsage: number;
  limit: number;
  resourceName: string;
  warningThreshold?: number; // Percentage (0-100)
  onUpgrade?: () => void;
}

export function UsageAlert({ 
  currentUsage, 
  limit, 
  resourceName,
  warningThreshold = 80,
  onUpgrade
}: UsageAlertProps) {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  const percentage = Math.min((currentUsage / limit) * 100, 100);
  const isWarning = percentage >= warningThreshold && percentage < 100;
  const isLimit = percentage >= 100;
  const showAlert = (isWarning || isLimit) && !dismissed;

  // Reset dismissed state if usage changes significantly
  useEffect(() => {
    if (percentage >= 100 && dismissed) {
      setDismissed(false);
    }
  }, [percentage, dismissed]);

  if (!showAlert) return null;

  const t = {
    warningTitle: language === 'fr' 
      ? `${resourceName} - Limite approchante`
      : `${resourceName} - Limit approaching`,
    limitTitle: language === 'fr'
      ? `${resourceName} - Limite atteinte`
      : `${resourceName} - Limit reached`,
    warningDescription: language === 'fr'
      ? `Vous avez utilisé ${currentUsage} sur ${limit} ${resourceName.toLowerCase()}. Passez au plan supérieur pour continuer.`
      : `You've used ${currentUsage} of ${limit} ${resourceName.toLowerCase()}. Upgrade to continue.`,
    limitDescription: language === 'fr'
      ? `Vous avez atteint votre limite de ${limit} ${resourceName.toLowerCase()}. Passez au plan supérieur.`
      : `You've reached your limit of ${limit} ${resourceName.toLowerCase()}. Upgrade your plan.`,
    upgrade: language === 'fr' ? 'Passer au plan Pro' : 'Upgrade to Pro',
    dismiss: language === 'fr' ? 'Plus tard' : 'Dismiss',
  };

  return (
    <Alert 
      variant="default" 
      className={`mb-4 ${
        isLimit 
          ? 'border-destructive/30 bg-destructive/10' 
          : 'border-accent/30 bg-accent/10'
      }`}
    >
      <div className="flex items-start gap-3">
        {isLimit ? (
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
        ) : (
          <TrendingUp className="h-4 w-4 text-accent mt-0.5" />
        )}
        <div className="flex-1 space-y-2">
          <AlertTitle className={isLimit ? 'text-destructive' : 'text-accent'}>
            {isLimit ? t.limitTitle : t.warningTitle}
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground">
            {isLimit ? t.limitDescription : t.warningDescription}
          </AlertDescription>
          
          {/* Progress bar */}
          <div className="space-y-1">
            <Progress 
              value={percentage} 
              className={`h-2 ${isLimit ? '[&>div]:bg-destructive' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentUsage} / {limit}</span>
              <span>{Math.round(percentage)}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {onUpgrade && (
              <Button 
                variant={isLimit ? 'default' : 'outline'} 
                size="sm"
                onClick={onUpgrade}
              >
                {t.upgrade}
              </Button>
            )}
            {!isLimit && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setDismissed(true)}
              >
                {t.dismiss}
              </Button>
            )}
          </div>
        </div>
        
        {!isLimit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setDismissed(true)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
