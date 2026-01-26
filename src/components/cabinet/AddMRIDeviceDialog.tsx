// Add MRI Device Dialog Component
// CLP-LUNETTES-IRM-2026-001

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wifi, Search, Plus, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { toast } from 'sonner';
import { z } from 'zod';

const deviceSchema = z.object({
  manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  serial_number: z.string().min(5, { message: 'Serial number must be at least 5 characters' }),
  device_type: z.enum(['chipiron_squid', 'kyoto_opm', 'hyperfine', 'mock']),
  ip_address: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, { message: 'Invalid IP address' }).optional().or(z.literal('')),
});

interface AddMRIDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDevice: (device: {
    manufacturer: string;
    model: string;
    serial_number: string;
    device_type: string;
    ip_address?: string;
  }) => Promise<void>;
}

const DEVICE_TYPES = [
  { 
    id: 'chipiron_squid', 
    name: 'Chipiron SQUID ULF-MRI', 
    manufacturer: 'Chipiron',
    models: ['Model X', 'Model S', 'Model Pro'],
  },
  { 
    id: 'kyoto_opm', 
    name: 'Kyoto OPM-MRI', 
    manufacturer: 'Kyoto Instruments',
    models: ['OPM-100', 'OPM-200'],
  },
  { 
    id: 'hyperfine', 
    name: 'Hyperfine Swoop', 
    manufacturer: 'Hyperfine',
    models: ['Swoop'],
  },
  { 
    id: 'mock', 
    name: 'Mock Device (Demo)', 
    manufacturer: 'ContextLens',
    models: ['Virtual MRI v1'],
  },
];

export function AddMRIDeviceDialog({ 
  open, 
  onOpenChange, 
  onAddDevice 
}: AddMRIDeviceDialogProps) {
  const { language } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Array<{
    id: string;
    name: string;
    manufacturer: string;
    ip: string;
  }>>([]);
  
  const [formData, setFormData] = useState({
    manufacturer: '',
    model: '',
    serial_number: '',
    device_type: '',
    ip_address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = {
    title: language === 'fr' ? 'Ajouter un appareil IRM' : 'Add MRI Device',
    description: language === 'fr' 
      ? 'Scannez le réseau local ou entrez les informations manuellement'
      : 'Scan local network or enter information manually',
    scanNetwork: language === 'fr' ? 'Scanner le réseau' : 'Scan Network',
    scanning: language === 'fr' ? 'Recherche en cours...' : 'Scanning...',
    noDevices: language === 'fr' ? 'Aucun appareil trouvé' : 'No devices found',
    manualEntry: language === 'fr' ? 'Entrée manuelle' : 'Manual Entry',
    deviceType: language === 'fr' ? 'Type d\'appareil' : 'Device Type',
    manufacturer: language === 'fr' ? 'Fabricant' : 'Manufacturer',
    model: language === 'fr' ? 'Modèle' : 'Model',
    serialNumber: language === 'fr' ? 'Numéro de série' : 'Serial Number',
    ipAddress: language === 'fr' ? 'Adresse IP (optionnel)' : 'IP Address (optional)',
    add: language === 'fr' ? 'Ajouter l\'appareil' : 'Add Device',
    cancel: language === 'fr' ? 'Annuler' : 'Cancel',
  };

  const handleScan = async () => {
    setIsScanning(true);
    setDiscoveredDevices([]);
    
    // Simulate network scan
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock discovered devices
    setDiscoveredDevices([
      {
        id: 'mock-001',
        name: 'Chipiron SQUID X',
        manufacturer: 'Chipiron',
        ip: '192.168.1.100',
      },
    ]);
    
    setIsScanning(false);
    toast.success(
      language === 'fr' 
        ? '1 appareil découvert' 
        : '1 device discovered'
    );
  };

  const handleSelectDiscovered = (device: typeof discoveredDevices[0]) => {
    setFormData({
      ...formData,
      manufacturer: device.manufacturer,
      model: device.name,
      device_type: 'chipiron_squid',
      ip_address: device.ip,
    });
  };

  const handleSubmit = async () => {
    setErrors({});
    
    const result = deviceSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onAddDevice({
        manufacturer: formData.manufacturer,
        model: formData.model,
        serial_number: formData.serial_number,
        device_type: formData.device_type,
        ip_address: formData.ip_address || undefined,
      });
      onOpenChange(false);
      setFormData({
        manufacturer: '',
        model: '',
        serial_number: '',
        device_type: '',
        ip_address: '',
      });
    } catch {
      toast.error(
        language === 'fr' 
          ? 'Erreur lors de l\'ajout' 
          : 'Error adding device'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = DEVICE_TYPES.find(d => d.id === formData.device_type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Network Scan */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t.scanning}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  {t.scanNetwork}
                </>
              )}
            </Button>

            {discoveredDevices.length > 0 && (
              <div className="space-y-2">
                {discoveredDevices.map((device) => (
                  <button
                    key={device.id}
                    className="w-full p-3 border rounded-lg hover:bg-muted transition-colors text-left flex items-center gap-3"
                    onClick={() => handleSelectDiscovered(device)}
                  >
                    <Wifi className="h-5 w-5 text-accent" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.ip}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t.manualEntry}
              </span>
            </div>
          </div>

          {/* Manual Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.deviceType}</Label>
              <Select
                value={formData.device_type}
                onValueChange={(value) => {
                  const type = DEVICE_TYPES.find(d => d.id === value);
                  setFormData({
                    ...formData,
                    device_type: value,
                    manufacturer: type?.manufacturer || '',
                    model: '',
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'fr' ? 'Sélectionner...' : 'Select...'} />
                </SelectTrigger>
                <SelectContent>
                  {DEVICE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <span className="flex items-center gap-2">
                        {type.name}
                        {type.id === 'mock' && (
                          <Badge variant="secondary" className="text-xs">Demo</Badge>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedType && (
              <>
                <div className="space-y-2">
                  <Label>{t.model}</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'fr' ? 'Sélectionner...' : 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedType.models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t.serialNumber}</Label>
                  <Input
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    placeholder="SN-2026-XXXXX"
                    className={errors.serial_number ? 'border-destructive' : ''}
                  />
                  {errors.serial_number && (
                    <p className="text-xs text-destructive">{errors.serial_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{t.ipAddress}</Label>
                  <Input
                    value={formData.ip_address}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    placeholder="192.168.1.100"
                    className={errors.ip_address ? 'border-destructive' : ''}
                  />
                  {errors.ip_address && (
                    <p className="text-xs text-destructive">{errors.ip_address}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              {t.cancel}
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.device_type || !formData.model}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t.add}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
