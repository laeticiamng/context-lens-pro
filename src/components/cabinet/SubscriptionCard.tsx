// Subscription Status Card Component
// CLP-LUNETTES-IRM-2026-001

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Glasses, 
  Scan,
  TrendingUp,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { MRISubscription } from '@/hooks/mri';

interface SubscriptionCardProps {
  subscription: MRISubscription | null;
  onManage?: () => void;
  onUpgrade?: () => void;
}

const PLAN_DETAILS: Record<string, {
  name: string;
  nameFr: string;
  price: number;
  color: string;
}> = {
  starter: { name: 'Starter', nameFr: 'Starter', price: 1990, color: 'bg-blue-500' },
  pro: { name: 'Pro', nameFr: 'Pro', price: 3490, color: 'bg-purple-500' },
  clinic: { name: 'Clinic', nameFr: 'Clinic', price: 4990, color: 'bg-amber-500' },
};

export function SubscriptionCard({ 
  subscription, 
  onManage,
  onUpgrade,
}: SubscriptionCardProps) {
  const { language } = useLanguage();

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {language === 'fr' ? 'Abonnement' : 'Subscription'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              {language === 'fr' 
                ? 'Aucun abonnement actif' 
                : 'No active subscription'}
            </p>
            <Button onClick={onUpgrade}>
              {language === 'fr' ? 'Choisir un forfait' : 'Choose a plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const plan = PLAN_DETAILS[subscription.plan_id] || PLAN_DETAILS.starter;
  const scansUsed = subscription.scans_this_period || 0;
  const scansLimit = subscription.scans_limit;
  const scansPercentage = scansLimit ? (scansUsed / scansLimit) * 100 : 0;
  const isUnlimited = !scansLimit;
  const daysRemaining = Math.ceil(
    (new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {language === 'fr' ? 'Abonnement' : 'Subscription'}
        </CardTitle>
        <Badge className={`${plan.color} text-white`}>
          {language === 'fr' ? plan.nameFr : plan.name}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            {plan.price.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} €
          </span>
          <span className="text-muted-foreground">
            /{language === 'fr' ? 'mois' : 'month'}
          </span>
        </div>

        {/* Scans Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Scan className="h-4 w-4" />
              {language === 'fr' ? 'Scans ce mois' : 'Scans this month'}
            </span>
            <span className="font-medium">
              {scansUsed} {isUnlimited ? '' : `/ ${scansLimit}`}
              {isUnlimited && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {language === 'fr' ? 'Illimité' : 'Unlimited'}
                </Badge>
              )}
            </span>
          </div>
          {!isUnlimited && (
            <>
              <Progress 
                value={scansPercentage} 
                className={scansPercentage > 80 ? 'bg-destructive/20' : ''}
              />
              {scansPercentage > 80 && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {language === 'fr' 
                    ? 'Limite bientôt atteinte' 
                    : 'Limit almost reached'}
                </p>
              )}
            </>
          )}
        </div>

        {/* Glasses */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Glasses className="h-4 w-4" />
            {language === 'fr' ? 'Lunettes incluses' : 'Glasses included'}
          </span>
          <span className="font-medium">{subscription.glasses_included}</span>
        </div>

        {/* Period */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {language === 'fr' ? 'Fin de période' : 'Period ends'}
          </span>
          <span className="font-medium">
            {new Date(subscription.current_period_end).toLocaleDateString(
              language === 'fr' ? 'fr-FR' : 'en-US',
              { day: 'numeric', month: 'short', year: 'numeric' }
            )}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {language === 'fr' ? 'Jours restants' : 'Days remaining'}
          </span>
          <span className="font-medium text-foreground">{daysRemaining}</span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
            {subscription.status === 'active' 
              ? (language === 'fr' ? 'Actif' : 'Active')
              : subscription.status}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onManage}>
            <Settings className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Gérer' : 'Manage'}
          </Button>
          {subscription.plan_id !== 'clinic' && (
            <Button size="sm" className="flex-1" onClick={onUpgrade}>
              {language === 'fr' ? 'Upgrader' : 'Upgrade'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
