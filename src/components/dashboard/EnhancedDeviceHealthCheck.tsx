import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Thermometer,
  HardDrive,
  Cpu,
  Clock,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ElementType;
}

interface DeviceHealthStatus {
  isOnline: boolean;
  lastPing: Date | null;
  metrics: HealthMetric[];
  firmwareVersion: string;
  uptime: number; // in hours
}

interface EnhancedDeviceHealthCheckProps {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  onClose: () => void;
}

export function EnhancedDeviceHealthCheck({
  deviceId,
  deviceName,
  deviceType,
  onClose,
}: EnhancedDeviceHealthCheckProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<DeviceHealthStatus | null>(null);

  // Simulate health check
  const performHealthCheck = useCallback(async () => {
    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock health data
    const mockHealth: DeviceHealthStatus = {
      isOnline: Math.random() > 0.2, // 80% chance of being online
      lastPing: new Date(),
      firmwareVersion: '2.4.1',
      uptime: Math.floor(Math.random() * 720), // Up to 30 days in hours
      metrics: [
        {
          name: language === 'fr' ? 'Température' : 'Temperature',
          value: 35 + Math.random() * 15,
          unit: '°C',
          status: Math.random() > 0.8 ? 'warning' : 'good',
          icon: Thermometer,
        },
        {
          name: language === 'fr' ? 'Mémoire' : 'Memory',
          value: 40 + Math.random() * 40,
          unit: '%',
          status: Math.random() > 0.9 ? 'critical' : Math.random() > 0.7 ? 'warning' : 'good',
          icon: HardDrive,
        },
        {
          name: 'CPU',
          value: 20 + Math.random() * 50,
          unit: '%',
          status: 'good',
          icon: Cpu,
        },
        {
          name: language === 'fr' ? 'Latence' : 'Latency',
          value: 50 + Math.random() * 150,
          unit: 'ms',
          status: Math.random() > 0.8 ? 'warning' : 'good',
          icon: Zap,
        },
      ],
    };
    
    setHealthStatus(mockHealth);
    setIsChecking(false);
    
    toast({
      title: language === 'fr' ? 'Diagnostic terminé' : 'Health Check Complete',
      description: mockHealth.isOnline 
        ? (language === 'fr' ? 'Appareil en ligne et fonctionnel' : 'Device online and functional')
        : (language === 'fr' ? 'Appareil hors ligne' : 'Device offline'),
    });
  }, [language, toast]);

  // Run health check on mount
  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  const formatUptime = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}${language === 'fr' ? 'j' : 'd'} ${remainingHours}h`;
  };

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return 'text-accent';
      case 'warning': return 'text-amber-500';
      case 'critical': return 'text-destructive';
    }
  };

  const getProgressColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return '[&>div]:bg-accent';
      case 'warning': return '[&>div]:bg-amber-500';
      case 'critical': return '[&>div]:bg-destructive';
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {language === 'fr' ? 'Diagnostic de l\'appareil' : 'Device Health Check'}
            </CardTitle>
            <CardDescription>
              {deviceName} ({deviceType})
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={performHealthCheck}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {language === 'fr' ? 'Actualiser' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isChecking ? (
          <div className="flex flex-col items-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Diagnostic en cours...' : 'Running diagnostics...'}
            </p>
          </div>
        ) : healthStatus ? (
          <>
            {/* Connection Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                {healthStatus.isOnline ? (
                  <Wifi className="h-6 w-6 text-accent" />
                ) : (
                  <WifiOff className="h-6 w-6 text-destructive" />
                )}
                <div>
                  <p className="font-medium">
                    {healthStatus.isOnline 
                      ? (language === 'fr' ? 'En ligne' : 'Online')
                      : (language === 'fr' ? 'Hors ligne' : 'Offline')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr' ? 'Dernier ping' : 'Last ping'}: {healthStatus.lastPing?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Badge variant={healthStatus.isOnline ? 'default' : 'destructive'}>
                {healthStatus.isOnline 
                  ? (language === 'fr' ? 'Connecté' : 'Connected')
                  : (language === 'fr' ? 'Déconnecté' : 'Disconnected')}
              </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {healthStatus.metrics.map((metric, index) => (
                <div key={index} className="p-3 rounded-lg border border-border/50 bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <span className="text-sm">
                      {Math.round(metric.value)}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={metric.value} 
                    className={getProgressColor(metric.status)}
                  />
                </div>
              ))}
            </div>

            {/* Device Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">v{healthStatus.firmwareVersion}</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Firmware' : 'Firmware'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatUptime(healthStatus.uptime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'fr' ? 'Uptime' : 'Uptime'}
                </p>
              </div>
            </div>

            {/* Overall Status */}
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
              healthStatus.metrics.some(m => m.status === 'critical')
                ? 'bg-destructive/10 text-destructive'
                : healthStatus.metrics.some(m => m.status === 'warning')
                ? 'bg-amber-500/10 text-amber-600'
                : 'bg-accent/10 text-accent'
            }`}>
              {healthStatus.metrics.some(m => m.status === 'critical') ? (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {language === 'fr' ? 'Attention requise' : 'Attention Required'}
                  </span>
                </>
              ) : healthStatus.metrics.some(m => m.status === 'warning') ? (
                <>
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {language === 'fr' ? 'Avertissements mineurs' : 'Minor Warnings'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {language === 'fr' ? 'Tout est opérationnel' : 'All Systems Operational'}
                  </span>
                </>
              )}
            </div>
          </>
        ) : null}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
