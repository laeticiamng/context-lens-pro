import { useState } from 'react';
import { 
  Activity, 
  Eye, 
  EyeOff, 
  Crosshair, 
  Layers, 
  Settings, 
  Mic, 
  MicOff,
  RotateCcw,
  Target,
  Info,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAnatomyStore, selectVisibleOrgans } from '@/stores/anatomyStore';
import { useLanguage } from '@/i18n/LanguageContext';
import type { BodyZone, OrganSystem } from '@/services/emotionscare/anatomyApi';
import type { LoadedOrgan } from '@/hooks/anatomy/useOrganLoader';

interface AnatomyHUDProps {
  patientId: string;
  patientName?: string;
  currentZone: BodyZone | null;
  loadedOrgans: LoadedOrgan[];
  focusedOrgan: string | null;
  isCalibrated: boolean;
  calibrationQuality: number;
  isVoiceActive: boolean;
  onRecalibrate: () => void;
  onToggleVoice: () => void;
  onZoneSelect: (zone: BodyZone) => void;
}

const ZONE_LABELS: Record<BodyZone, { fr: string; en: string }> = {
  head: { fr: 'Tête', en: 'Head' },
  thorax: { fr: 'Thorax', en: 'Thorax' },
  abdomen: { fr: 'Abdomen', en: 'Abdomen' },
  pelvis: { fr: 'Bassin', en: 'Pelvis' },
  upper_limb: { fr: 'Bras', en: 'Arms' },
  lower_limb: { fr: 'Jambes', en: 'Legs' },
};

const SYSTEM_LABELS: Record<OrganSystem, { fr: string; en: string; color: string }> = {
  cardio: { fr: 'Cardiovasculaire', en: 'Cardiovascular', color: '#EF4444' },
  pulmo: { fr: 'Pulmonaire', en: 'Pulmonary', color: '#FDA4AF' },
  digestive: { fr: 'Digestif', en: 'Digestive', color: '#F59E0B' },
  nervous: { fr: 'Nerveux', en: 'Nervous', color: '#F472B6' },
  skeletal: { fr: 'Squelettique', en: 'Skeletal', color: '#E5E7EB' },
  muscular: { fr: 'Musculaire', en: 'Muscular', color: '#B91C1C' },
};

export function AnatomyHUD({
  patientId,
  patientName = 'Patient',
  currentZone,
  loadedOrgans,
  focusedOrgan,
  isCalibrated,
  calibrationQuality,
  isVoiceActive,
  onRecalibrate,
  onToggleVoice,
  onZoneSelect,
}: AnatomyHUDProps) {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const store = useAnatomyStore();
  const visibleOrgans = useAnatomyStore(selectVisibleOrgans);
  
  const focusedOrganData = loadedOrgans.find(o => o.structure.structure_code === focusedOrgan);

  const t = {
    patient: language === 'fr' ? 'Patient' : 'Patient',
    zone: language === 'fr' ? 'Zone' : 'Zone',
    organs: language === 'fr' ? 'Organes' : 'Organs',
    calibration: language === 'fr' ? 'Calibration' : 'Calibration',
    recalibrate: language === 'fr' ? 'Recalibrer' : 'Recalibrate',
    opacity: language === 'fr' ? 'Opacité' : 'Opacity',
    system: language === 'fr' ? 'Système' : 'System',
    all: language === 'fr' ? 'Tous' : 'All',
    focus: language === 'fr' ? 'Focus' : 'Focus',
    voice: language === 'fr' ? 'Commandes vocales' : 'Voice Commands',
    volume: language === 'fr' ? 'Volume' : 'Volume',
    noAnomalies: language === 'fr' ? 'Aucune anomalie' : 'No anomalies',
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Patient Info */}
        <Card className="bg-background/80 backdrop-blur-md border-primary/20">
          <CardHeader className="py-2 px-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/10">
                {patientId.slice(0, 8)}
              </Badge>
              <span className="font-medium">{patientName}</span>
              {currentZone && (
                <Badge className="bg-accent">
                  {ZONE_LABELS[currentZone][language]}
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Calibration Status */}
        <Card className="bg-background/80 backdrop-blur-md border-primary/20">
          <CardContent className="py-2 px-4 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isCalibrated ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            <span className="text-sm">
              {t.calibration}: {Math.round(calibrationQuality * 100)}%
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRecalibrate}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Left Panel - Organ List */}
      <div className={`absolute left-4 top-24 bottom-24 transition-all duration-300 pointer-events-auto ${isExpanded ? 'w-64' : 'w-12'}`}>
        <Card className="h-full bg-background/80 backdrop-blur-md border-primary/20 overflow-hidden">
          <div className="flex items-center justify-between p-2 border-b">
            {isExpanded && (
              <CardTitle className="text-sm">{t.organs}</CardTitle>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100%-40px)]">
              {visibleOrgans.map((organ) => (
                <button
                  key={organ.structure.structure_code}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    focusedOrgan === organ.structure.structure_code
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => store.setFocusedOrgan(
                    focusedOrgan === organ.structure.structure_code ? null : organ.structure.structure_code
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: organ.structure.default_color }}
                  />
                  <span className="text-sm truncate">{organ.structure.structure_name}</span>
                  {store.hiddenOrgans.has(organ.structure.structure_code) && (
                    <EyeOff className="w-3 h-3 ml-auto text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Right Panel - Focus Info */}
      {focusedOrganData && (
        <div className="absolute right-4 top-24 w-72 pointer-events-auto">
          <Card className="bg-background/80 backdrop-blur-md border-primary/20">
            <CardHeader className="py-3 px-4 flex flex-row items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">{focusedOrganData.structure.structure_name}</CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.system}</span>
                <Badge 
                  style={{ 
                    backgroundColor: SYSTEM_LABELS[focusedOrganData.structure.structure_category].color + '20',
                    color: SYSTEM_LABELS[focusedOrganData.structure.structure_category].color 
                  }}
                >
                  {SYSTEM_LABELS[focusedOrganData.structure.structure_category][language]}
                </Badge>
              </div>
              
              {focusedOrganData.structure.volume_ml && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.volume}</span>
                  <span>{focusedOrganData.structure.volume_ml} mL</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Info className="w-4 h-4" />
                {t.noAnomalies}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => store.hideOrgan(focusedOrganData.structure.structure_code)}
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  {language === 'fr' ? 'Masquer' : 'Hide'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    store.showAllOrgans();
                    store.loadedOrgans.forEach((_, code) => {
                      if (code !== focusedOrganData.structure.structure_code) {
                        store.hideOrgan(code);
                      }
                    });
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {language === 'fr' ? 'Isoler' : 'Isolate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <Card className="bg-background/80 backdrop-blur-md border-primary/20">
          <CardContent className="py-2 px-4 flex items-center gap-4">
            {/* Zone Selector */}
            <div className="flex items-center gap-2">
              {(['head', 'thorax', 'abdomen', 'pelvis'] as BodyZone[]).map((zone) => (
                <Button
                  key={zone}
                  variant={currentZone === zone ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onZoneSelect(zone)}
                >
                  {ZONE_LABELS[zone][language]}
                </Button>
              ))}
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* System Filter */}
            <div className="flex items-center gap-1">
              <Button
                variant={store.activeSystem === null ? 'default' : 'ghost'}
                size="sm"
                onClick={() => store.setActiveSystem(null)}
              >
                {t.all}
              </Button>
              {(['cardio', 'pulmo', 'digestive'] as OrganSystem[]).map((system) => (
                <Button
                  key={system}
                  variant={store.activeSystem === system ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => store.setActiveSystem(system)}
                  style={store.activeSystem === system ? { backgroundColor: SYSTEM_LABELS[system].color } : {}}
                >
                  {SYSTEM_LABELS[system][language].slice(0, 5)}
                </Button>
              ))}
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Opacity Slider */}
            <div className="flex items-center gap-2 w-32">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[store.globalOpacity * 100]}
                onValueChange={([v]) => store.setGlobalOpacity(v / 100)}
                max={100}
                step={10}
              />
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Voice Toggle */}
            <Button
              variant={isVoiceActive ? 'default' : 'ghost'}
              size="sm"
              onClick={onToggleVoice}
            >
              {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            
            {/* Show All */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                store.showAllOrgans();
                store.setFocusedOrgan(null);
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              {t.all}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
