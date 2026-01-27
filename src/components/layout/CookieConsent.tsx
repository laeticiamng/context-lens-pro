// GDPR Cookie Consent Banner
// Displays cookie consent options and persists choice

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/i18n/LanguageContext';
import { Cookie, Settings, X } from 'lucide-react';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0';

interface ConsentState {
  version: string;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

export function CookieConsent() {
  const { language } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setShowBanner(true);
    } else {
      try {
        const consent: ConsentState = JSON.parse(stored);
        if (consent.version !== CONSENT_VERSION) {
          setShowBanner(true);
        }
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (acceptAll: boolean) => {
    const consent: ConsentState = {
      version: CONSENT_VERSION,
      essential: true,
      analytics: acceptAll ? true : analytics,
      marketing: acceptAll ? true : marketing,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setShowBanner(false);
  };

  const t = {
    title: language === 'fr' ? 'Nous utilisons des cookies' : 'We use cookies',
    description: language === 'fr'
      ? 'Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez accepter tous les cookies ou personnaliser vos préférences.'
      : 'We use cookies to improve your experience. You can accept all cookies or customize your preferences.',
    essential: language === 'fr' ? 'Essentiels (requis)' : 'Essential (required)',
    essentialDesc: language === 'fr' 
      ? 'Nécessaires au fonctionnement du site' 
      : 'Necessary for site functionality',
    analytics: language === 'fr' ? 'Analytiques' : 'Analytics',
    analyticsDesc: language === 'fr'
      ? 'Nous aident à comprendre l\'utilisation du site'
      : 'Help us understand site usage',
    marketing: language === 'fr' ? 'Marketing' : 'Marketing',
    marketingDesc: language === 'fr'
      ? 'Permettent des publicités personnalisées'
      : 'Enable personalized advertising',
    acceptAll: language === 'fr' ? 'Tout accepter' : 'Accept All',
    acceptSelected: language === 'fr' ? 'Accepter la sélection' : 'Accept Selected',
    customize: language === 'fr' ? 'Personnaliser' : 'Customize',
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="max-w-2xl mx-auto bg-background/95 backdrop-blur-sm shadow-lg border-border/50">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cookie className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setShowBanner(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {showSettings && (
            <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium">{t.essential}</Label>
                  <p className="text-xs text-muted-foreground">{t.essentialDesc}</p>
                </div>
                <Switch checked disabled />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium">{t.analytics}</Label>
                  <p className="text-xs text-muted-foreground">{t.analyticsDesc}</p>
                </div>
                <Switch checked={analytics} onCheckedChange={setAnalytics} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium">{t.marketing}</Label>
                  <p className="text-xs text-muted-foreground">{t.marketingDesc}</p>
                </div>
                <Switch checked={marketing} onCheckedChange={setMarketing} />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-end">
            {!showSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {t.customize}
              </Button>
            )}
            
            {showSettings && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveConsent(false)}
              >
                {t.acceptSelected}
              </Button>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={() => saveConsent(true)}
            >
              {t.acceptAll}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
