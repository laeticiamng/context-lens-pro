// Subscription Plans Pricing Component
// CLP-LUNETTES-IRM-2026-001

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Glasses, Scan, Headphones, Zap } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void;
  currentPlan?: string;
  isLoading?: boolean;
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1990,
    popular: false,
    features: {
      en: [
        '1 MRI Cabinet included',
        '1 pair of AR glasses',
        '50 scans per month',
        'Standard support',
        'Basic protocols (3)',
        'Email reports',
      ],
      fr: [
        '1 Armoire IRM incluse',
        '1 paire de lunettes AR',
        '50 scans par mois',
        'Support standard',
        'Protocoles basiques (3)',
        'Rapports par email',
      ],
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 3490,
    popular: true,
    features: {
      en: [
        '1 MRI Cabinet included',
        '2 pairs of AR glasses',
        'Unlimited scans',
        'Priority support',
        'All protocols (5)',
        'PDF reports with images',
        'Longitudinal tracking',
      ],
      fr: [
        '1 Armoire IRM incluse',
        '2 paires de lunettes AR',
        'Scans illimités',
        'Support prioritaire',
        'Tous les protocoles (5)',
        'Rapports PDF avec images',
        'Suivi longitudinal',
      ],
    },
  },
  {
    id: 'clinic',
    name: 'Clinic',
    price: 4990,
    popular: false,
    features: {
      en: [
        '1 MRI Cabinet included',
        '5 pairs of AR glasses',
        'Unlimited scans',
        'Premium 24/7 support',
        'All protocols + custom',
        'Advanced analytics',
        'Multi-practitioner access',
        'API access',
        'Dedicated account manager',
      ],
      fr: [
        '1 Armoire IRM incluse',
        '5 paires de lunettes AR',
        'Scans illimités',
        'Support premium 24/7',
        'Tous les protocoles + personnalisés',
        'Analyses avancées',
        'Accès multi-praticiens',
        'Accès API',
        'Gestionnaire de compte dédié',
      ],
    },
  },
];

export function SubscriptionPlans({ onSelectPlan, currentPlan, isLoading }: SubscriptionPlansProps) {
  const { language } = useLanguage();

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {language === 'fr' ? 'Choisissez votre forfait' : 'Choose your plan'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === 'fr' 
            ? "Tous les forfaits incluent l'armoire IRM portative, les lunettes AR et l'accès à la plateforme. Engagement 12 mois."
            : 'All plans include the portable MRI cabinet, AR glasses, and platform access. 12-month commitment.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''} ${currentPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                {language === 'fr' ? 'Le plus populaire' : 'Most Popular'}
              </Badge>
            )}
            
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">
                  {plan.price.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')} €
                </span>
                <span className="text-muted-foreground">
                  /{language === 'fr' ? 'mois' : 'month'}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <ul className="space-y-3">
                {plan.features[language === 'fr' ? 'fr' : 'en'].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => onSelectPlan(plan.id)}
                disabled={isLoading || currentPlan === plan.id}
              >
                {currentPlan === plan.id 
                  ? (language === 'fr' ? 'Plan actuel' : 'Current plan')
                  : (language === 'fr' ? 'Choisir ce plan' : 'Select this plan')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Features comparison */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-6">
          {language === 'fr' ? 'Inclus dans tous les forfaits' : 'Included in all plans'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">
              {language === 'fr' ? 'IRM non irradiante' : 'Non-radiating MRI'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Glasses className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">
              {language === 'fr' ? 'Lunettes AR' : 'AR Glasses'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">
              {language === 'fr' ? 'Résultats en temps réel' : 'Real-time results'}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">
              {language === 'fr' ? 'Formation incluse' : 'Training included'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
