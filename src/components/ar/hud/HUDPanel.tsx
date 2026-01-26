import { useARStore } from '@/stores/arStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { Mic, MicOff, Battery, Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { PatientCard } from './PatientCard';
import { EmotionGauge } from './EmotionGauge';
import { AlertBadge } from './AlertBadge';
import { VitalsPanel } from './VitalsPanel';

interface HUDPanelProps {
  onMicToggle?: () => void;
  isListening?: boolean;
}

export function HUDPanel({ onMicToggle, isListening = false }: HUDPanelProps) {
  const { 
    showHUD, 
    currentPatient, 
    emotions, 
    vitalSigns,
    alerts,
    isEmotionsConnected,
    lastCommand
  } = useARStore();
  const { language } = useLanguage();

  if (!showHUD) return null;

  const currentTime = new Date().toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {/* Mic indicator */}
        <button 
          onClick={onMicToggle}
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20"
        >
          {isListening ? (
            <>
              <Mic className="h-5 w-5 text-red-400 animate-pulse" />
              <span className="text-xs text-white/80">
                {language === 'fr' ? 'Écoute...' : 'Listening...'}
              </span>
            </>
          ) : (
            <>
              <MicOff className="h-5 w-5 text-white/50" />
              <span className="text-xs text-white/50">
                {language === 'fr' ? 'Micro désactivé' : 'Mic off'}
              </span>
            </>
          )}
        </button>

        {/* Status indicators */}
        <div className="flex items-center gap-4 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-white/70" />
            <span className="text-sm text-white font-mono">{currentTime}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {isEmotionsConnected ? (
              <Wifi className="h-4 w-4 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Battery className="h-4 w-4 text-white/70" />
            <span className="text-xs text-white/70">85%</span>
          </div>
        </div>
      </div>

      {/* Last command feedback */}
      {lastCommand && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary/80 backdrop-blur-sm text-sm text-white animate-fade-in">
          "{lastCommand}"
        </div>
      )}

      {/* Left Panel - Patient Info */}
      <div className="absolute left-4 top-24 bottom-24 w-64 flex flex-col gap-4">
        {currentPatient && (
          <PatientCard patient={currentPatient} />
        )}
        
        {vitalSigns && (
          <VitalsPanel vitals={vitalSigns} />
        )}
      </div>

      {/* Right Panel - Emotions & Alerts */}
      <div className="absolute right-4 top-24 bottom-24 w-72 flex flex-col gap-4">
        {emotions && (
          <EmotionGauge emotions={emotions} />
        )}
        
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <AlertBadge key={index} message={alert} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom - Voice commands hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
        <div className="text-xs text-white/50 text-center">
          {language === 'fr' 
            ? 'Commandes: "Zoom [région]" • "Vue axiale" • "Note: [texte]" • "Reset"'
            : 'Commands: "Zoom [region]" • "View axial" • "Note: [text]" • "Reset"'
          }
        </div>
      </div>
    </div>
  );
}
