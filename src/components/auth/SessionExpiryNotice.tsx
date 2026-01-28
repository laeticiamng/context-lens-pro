// Session Expiry Notice Component
// Shows warning when session is about to expire

import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';

interface SessionExpiryNoticeProps {
  warningMinutes?: number; // Show warning X minutes before expiry
}

export function SessionExpiryNotice({ warningMinutes = 5 }: SessionExpiryNoticeProps) {
  const { language } = useLanguage();
  const [showWarning, setShowWarning] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.expires_at) {
        const expiryTime = session.expires_at * 1000; // Convert to ms
        const now = Date.now();
        const timeLeft = expiryTime - now;
        const minutesLeft = Math.floor(timeLeft / 60000);
        
        setExpiresIn(minutesLeft);
        setShowWarning(minutesLeft <= warningMinutes && minutesLeft > 0);
      }
    };

    // Check immediately
    checkSession();

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, [warningMinutes]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { error } = await supabase.auth.refreshSession();
      if (!error) {
        setShowWarning(false);
        setExpiresIn(null);
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!showWarning || expiresIn === null) return null;

  const t = {
    title: language === 'fr' ? 'Session expirante' : 'Session Expiring',
    description: language === 'fr' 
      ? `Votre session expire dans ${expiresIn} minute${expiresIn > 1 ? 's' : ''}. Cliquez pour prolonger.`
      : `Your session expires in ${expiresIn} minute${expiresIn > 1 ? 's' : ''}. Click to extend.`,
    refresh: language === 'fr' ? 'Prolonger' : 'Extend',
    refreshing: language === 'fr' ? 'Actualisation...' : 'Refreshing...',
  };

  return (
    <Alert variant="default" className="fixed bottom-4 right-4 w-auto max-w-sm z-50 border-accent/30 bg-accent/10 shadow-lg">
      <AlertTriangle className="h-4 w-4 text-accent" />
      <AlertTitle className="text-accent">{t.title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">{t.description}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="shrink-0"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t.refreshing : t.refresh}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
