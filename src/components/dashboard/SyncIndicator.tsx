// Real-time Sync Status Indicator
// Shows database sync status with visual feedback

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface SyncIndicatorProps {
  className?: string;
}

export function SyncIndicator({ className }: SyncIndicatorProps) {
  const { language } = useLanguage();
  const [status, setStatus] = useState<SyncStatus>('synced');
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setStatus('syncing');
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
          .maybeSingle();
        
        if (error) {
          setStatus('error');
        } else {
          setStatus('synced');
          setLastSync(new Date());
        }
      } catch {
        setStatus('offline');
      }
    };

    // Initial check
    checkConnection();

    // Periodic check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen for online/offline events
    const handleOnline = () => checkConnection();
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = {
    synced: language === 'fr' ? 'Synchronisé' : 'Synced',
    syncing: language === 'fr' ? 'Synchronisation...' : 'Syncing...',
    offline: language === 'fr' ? 'Hors ligne' : 'Offline',
    error: language === 'fr' ? 'Erreur de sync' : 'Sync error',
    lastSync: language === 'fr' ? 'Dernière sync:' : 'Last sync:',
  };

  const statusConfig: Record<SyncStatus, {
    icon: typeof Check;
    color: string;
    bgColor: string;
    label: string;
    animate?: boolean;
  }> = {
    synced: {
      icon: Check,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: t.synced,
      animate: false,
    },
    syncing: {
      icon: RefreshCw,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: t.syncing,
      animate: true,
    },
    offline: {
      icon: CloudOff,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      label: t.offline,
      animate: false,
    },
    error: {
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      label: t.error,
      animate: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className={`gap-1.5 px-2 py-1 ${config.bgColor} border-0 cursor-default ${className}`}
        >
          <Icon 
            className={`h-3 w-3 ${config.color} ${config.animate ? 'animate-spin' : ''}`} 
          />
          <span className={`text-xs ${config.color}`}>{config.label}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          {t.lastSync} {lastSync.toLocaleTimeString()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
