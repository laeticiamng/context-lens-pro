import { VitalSigns } from '@/stores/arStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { Heart, Activity } from 'lucide-react';

interface VitalsPanelProps {
  vitals: VitalSigns;
}

export function VitalsPanel({ vitals }: VitalsPanelProps) {
  const { language } = useLanguage();

  const hrStatus = vitals.heartRate > 100 ? 'elevated' : vitals.heartRate < 60 ? 'low' : 'normal';
  const stressStatus = vitals.stressLevel > 70 ? 'high' : vitals.stressLevel < 30 ? 'low' : 'moderate';

  return (
    <div className="pointer-events-auto p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 shadow-xl">
      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
        {language === 'fr' ? 'Signes Vitaux' : 'Vitals'}
      </h3>

      <div className="space-y-3">
        {/* Heart Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={`h-5 w-5 ${
              hrStatus === 'elevated' ? 'text-red-400 animate-pulse' : 
              hrStatus === 'low' ? 'text-blue-400' : 'text-green-400'
            }`} />
            <span className="text-sm text-white/80">
              {language === 'fr' ? 'FC' : 'HR'}
            </span>
          </div>
          <span className={`font-mono font-bold ${
            hrStatus === 'elevated' ? 'text-red-400' : 
            hrStatus === 'low' ? 'text-blue-400' : 'text-green-400'
          }`}>
            {vitals.heartRate} <span className="text-xs text-white/50">bpm</span>
          </span>
        </div>

        {/* Stress Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`h-5 w-5 ${
              stressStatus === 'high' ? 'text-orange-400' : 
              stressStatus === 'low' ? 'text-green-400' : 'text-yellow-400'
            }`} />
            <span className="text-sm text-white/80">
              {language === 'fr' ? 'Stress' : 'Stress'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  stressStatus === 'high' ? 'bg-orange-400' : 
                  stressStatus === 'low' ? 'bg-green-400' : 'bg-yellow-400'
                }`}
                style={{ width: `${vitals.stressLevel}%` }}
              />
            </div>
            <span className="text-xs font-mono text-white/60">{vitals.stressLevel}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
