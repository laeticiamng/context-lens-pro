// Diagnostics Panel Component
// For development debugging and system status

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Database, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  RefreshCw,
  Bug,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DiagnosticsState {
  userId: string | null;
  authStatus: 'authenticated' | 'anonymous' | 'checking';
  environment: 'development' | 'production';
  lastApiError: string | null;
  latencyMs: number | null;
  supabaseConnected: boolean;
  timestamp: number;
}

export function DiagnosticsPanel() {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    userId: null,
    authStatus: 'checking',
    environment: import.meta.env.DEV ? 'development' : 'production',
    lastApiError: null,
    latencyMs: null,
    supabaseConnected: false,
    timestamp: Date.now(),
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const runDiagnostics = async () => {
    setIsRefreshing(true);
    const startTime = Date.now();
    
    try {
      // Check auth status
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      // Check database connectivity
      const { error: dbError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
        .maybeSingle();
      
      const latency = Date.now() - startTime;
      
      setDiagnostics({
        userId: session?.user?.id || null,
        authStatus: session?.user ? 'authenticated' : 'anonymous',
        environment: import.meta.env.DEV ? 'development' : 'production',
        lastApiError: authError?.message || dbError?.message || null,
        latencyMs: latency,
        supabaseConnected: !dbError,
        timestamp: Date.now(),
      });
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        lastApiError: error instanceof Error ? error.message : 'Unknown error',
        supabaseConnected: false,
        timestamp: Date.now(),
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  // Only show in development
  if (import.meta.env.PROD && !window.location.search.includes('debug=true')) {
    return null;
  }

  const t = {
    title: language === 'fr' ? 'Diagnostics Système' : 'System Diagnostics',
    authStatus: language === 'fr' ? 'Statut Auth' : 'Auth Status',
    userId: language === 'fr' ? 'ID Utilisateur' : 'User ID',
    environment: language === 'fr' ? 'Environnement' : 'Environment',
    latency: language === 'fr' ? 'Latence API' : 'API Latency',
    database: language === 'fr' ? 'Base de données' : 'Database',
    lastError: language === 'fr' ? 'Dernière erreur' : 'Last Error',
    refresh: language === 'fr' ? 'Actualiser' : 'Refresh',
    authenticated: language === 'fr' ? 'Authentifié' : 'Authenticated',
    anonymous: language === 'fr' ? 'Anonyme' : 'Anonymous',
    connected: language === 'fr' ? 'Connecté' : 'Connected',
    disconnected: language === 'fr' ? 'Déconnecté' : 'Disconnected',
    noError: language === 'fr' ? 'Aucune erreur' : 'No errors',
  };

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 opacity-60 hover:opacity-100"
        onClick={() => setIsExpanded(true)}
        aria-label={t.title}
      >
        <Bug className="h-4 w-4 mr-1" />
        {language === 'fr' ? 'Debug' : 'Debug'}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-80 shadow-lg bg-background/95 backdrop-blur-sm">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bug className="h-4 w-4" />
          {t.title}
        </CardTitle>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={runDiagnostics}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(false)}
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4 space-y-2 text-sm">
        {/* Auth Status */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-muted-foreground">
            <User className="h-3 w-3" />
            {t.authStatus}
          </span>
          <Badge variant={diagnostics.authStatus === 'authenticated' ? 'default' : 'secondary'}>
            {diagnostics.authStatus === 'authenticated' ? t.authenticated : t.anonymous}
          </Badge>
        </div>

        {/* User ID */}
        {diagnostics.userId && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t.userId}</span>
            <code className="text-xs bg-muted px-1 rounded">
              {diagnostics.userId.slice(0, 8)}...
            </code>
          </div>
        )}

        <Separator />

        {/* Environment */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Activity className="h-3 w-3" />
            {t.environment}
          </span>
          <Badge variant={diagnostics.environment === 'development' ? 'outline' : 'default'}>
            {diagnostics.environment}
          </Badge>
        </div>

        {/* Database */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Database className="h-3 w-3" />
            {t.database}
          </span>
          <span className="flex items-center gap-1">
            {diagnostics.supabaseConnected ? (
              <>
                <CheckCircle className="h-3 w-3 text-primary" />
                {t.connected}
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-destructive" />
                {t.disconnected}
              </>
            )}
          </span>
        </div>

        {/* Latency */}
        {diagnostics.latencyMs !== null && (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              {t.latency}
            </span>
            <span className={diagnostics.latencyMs > 500 ? 'text-destructive' : ''}>
              {diagnostics.latencyMs} ms
            </span>
          </div>
        )}

        <Separator />

        {/* Last Error */}
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs">{t.lastError}:</span>
          {diagnostics.lastApiError ? (
            <pre className="text-xs bg-destructive/10 text-destructive p-2 rounded overflow-x-auto max-h-16">
              {diagnostics.lastApiError}
            </pre>
          ) : (
            <p className="text-xs text-primary">{t.noError}</p>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground text-right">
          {new Date(diagnostics.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
