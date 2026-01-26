// Device Status Card Component
// CLP-LUNETTES-IRM-2026-001

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Wrench,
  Thermometer,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import type { MRIDevice } from '@/hooks/mri';

interface DeviceStatusCardProps {
  device: MRIDevice | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onRequestMaintenance?: () => void;
}

export function DeviceStatusCard({ 
  device, 
  isLoading,
  onRefresh,
  onRequestMaintenance,
}: DeviceStatusCardProps) {
  const { language } = useLanguage();

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { 
      color: string; 
      icon: React.ReactNode; 
      label: string; 
      labelFr: string;
      bgColor: string;
    }> = {
      online: { 
        color: 'text-white', 
        bgColor: 'bg-emerald-500',
        icon: <Wifi className="h-4 w-4" aria-hidden="true" />, 
        label: 'Online',
        labelFr: 'En ligne',
      },
      offline: { 
        color: 'text-muted-foreground', 
        bgColor: 'bg-muted',
        icon: <WifiOff className="h-4 w-4" aria-hidden="true" />, 
        label: 'Offline',
        labelFr: 'Hors ligne',
      },
      maintenance: { 
        color: 'text-white', 
        bgColor: 'bg-amber-500',
        icon: <Wrench className="h-4 w-4" aria-hidden="true" />, 
        label: 'Maintenance',
        labelFr: 'Maintenance',
      },
      error: { 
        color: 'text-white', 
        bgColor: 'bg-destructive',
        icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />, 
        label: 'Error',
        labelFr: 'Erreur',
      },
    };
    return statusMap[status] || statusMap.offline;
  };

  if (!device) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {language === 'fr' ? 'Appareil IRM' : 'MRI Device'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {language === 'fr' 
              ? 'Aucun appareil IRM enregistré' 
              : 'No MRI device registered'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusInfo = getStatusInfo(device.status);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {language === 'fr' ? 'Appareil IRM' : 'MRI Device'}
        </CardTitle>
        <Badge className={`${statusInfo.bgColor} ${statusInfo.color}`}>
          <span className="flex items-center gap-1">
            {statusInfo.icon}
            {language === 'fr' ? statusInfo.labelFr : statusInfo.label}
          </span>
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">
              {language === 'fr' ? 'Fabricant' : 'Manufacturer'}
            </span>
            <p className="font-medium">{device.manufacturer}</p>
          </div>
          <div>
            <span className="text-muted-foreground">
              {language === 'fr' ? 'Modèle' : 'Model'}
            </span>
            <p className="font-medium">{device.model}</p>
          </div>
          <div>
            <span className="text-muted-foreground">
              {language === 'fr' ? 'Numéro de série' : 'Serial Number'}
            </span>
            <p className="font-medium font-mono text-xs">{device.serial_number}</p>
          </div>
          <div>
            <span className="text-muted-foreground">
              {language === 'fr' ? 'Firmware' : 'Firmware'}
            </span>
            <p className="font-medium">{device.firmware_version || 'N/A'}</p>
          </div>
        </div>

        {/* Cryostat Temperature (simulated) */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <Thermometer className="h-5 w-5 text-primary" />
          <div>
            <span className="text-sm text-muted-foreground">
              {language === 'fr' ? 'Température cryostat' : 'Cryostat Temperature'}
            </span>
            <p className="font-medium">4.2 K</p>
          </div>
        </div>

        {/* Maintenance Info */}
        {device.next_maintenance_at && (
          <div className="text-sm text-muted-foreground">
            {language === 'fr' ? 'Prochaine maintenance' : 'Next maintenance'}: {' '}
            <span className="font-medium text-foreground">
              {new Date(device.next_maintenance_at).toLocaleDateString(language)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'fr' ? 'Actualiser' : 'Refresh'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRequestMaintenance}
          >
            <Wrench className="h-4 w-4 mr-1" />
            {language === 'fr' ? 'Maintenance' : 'Maintenance'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
