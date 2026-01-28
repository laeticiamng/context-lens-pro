// Offline Notice Component
// Shows when network is unavailable with clear messaging

import { WifiOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useLanguage } from '@/i18n/LanguageContext';

export function OfflineNotice() {
  const { isOnline } = useNetworkStatus();
  const { language } = useLanguage();

  if (isOnline) return null;

  const t = {
    title: language === 'fr' ? 'Mode hors ligne' : 'Offline Mode',
    description: language === 'fr' 
      ? 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.'
      : 'You are currently offline. Some features may not be available.',
    retry: language === 'fr' ? 'Réessayer' : 'Retry',
  };

  return (
    <Alert variant="default" className="mb-4 border-accent/30 bg-accent/10">
      <WifiOff className="h-4 w-4 text-accent" />
      <AlertTitle className="text-accent">{t.title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{t.description}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="border-accent/30 hover:bg-accent/10"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {t.retry}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
